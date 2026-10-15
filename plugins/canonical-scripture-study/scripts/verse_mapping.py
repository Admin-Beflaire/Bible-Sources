#!/usr/bin/env python3
"""Build/query offline, pinned book/chapter mappings and DSS physical links.

This development index is not loaded by study tools and never changes source text.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
from collections import Counter
from pathlib import Path
import sys

PLUGIN = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PLUGIN))
from bible_study.readers import Reader  # noqa: E402
from bible_study.store import SourceStore, StudyError  # noqa: E402
from scripts.verse_mapping_books import compile_books, expand_relation, signature  # noqa: E402
from scripts.verse_mapping_dss import compile_dss_reviews, lookup_dss  # noqa: E402

ROOT = PLUGIN.parents[1]
DEST = ROOT / "indexes/verse-mapping"
SEEDS = ROOT / "development/verse-mapping-pilot.json"
BOOK_REVIEWS = ROOT / "development/verse-mapping-books"
DSS_REVIEWS = ROOT / "development/verse-mapping-dss"
DATASET_NAMES = {"wlc-4.20-oshb": "WLC/OSHB 4.20", "uxlc-2.4": "UXLC 2.4", "TAHOT": "TAHOT", "LXX-GRCBRENT-20260408": "Brenton Greek Septuagint", "SBLGNT": "SBL Greek New Testament"}


def digest(value):
    return hashlib.sha256(value).hexdigest()


def label(row):
    return str(row.get("native_verse_label", row["verse"]))


def native_key(ref):
    if not isinstance(ref, list) or len(ref) != 4:
        raise ValueError("A native reference is [dataset, native_book, chapter, verse_label].")
    dataset, book, chapter, verse = ref
    if dataset not in DATASET_NAMES or not isinstance(book, str) or not book or type(chapter) is not int or chapter < 1 or not isinstance(verse, str) or not verse:
        raise ValueError("Invalid native reference; retain exact dataset/book/verse labels.")
    return dataset, book, chapter, verse


def endpoint(reader, ref):
    dataset, book, chapter, verse = native_key(ref)
    packet = reader.native_chapter(dataset, book, chapter)
    records = [r for r in packet["records"] if label(r) == verse]
    if not records:
        raise ValueError(f"No native source records for {ref!r}; missing coverage is not omission.")
    wording = "\n".join(r.get("text", r.get("form", "")) for r in records)
    return {"native_reference": ref, "chapter_evidence": packet["evidence"], "record_ids": [r["id"] for r in records], "reading_text_sha256": digest(wording.encode("utf-8"))}


def compile_relations(reader, seeds):
    if seeds["source_commit"] != reader.store.profile["commit"]:
        raise ValueError("Pilot relations belong to another source revision.")
    out = []; ids = set(); pairs = set()
    for row in seeds["relations"]:
        if row["id"] in ids or not row.get("left") or not row.get("right"):
            raise ValueError("Duplicate relation ID or empty alignment side.")
        ids.add(row["id"])
        left = [native_key(x) for x in row["left"]]; right = [native_key(x) for x in row["right"]]
        if len(set(left)) != len(left) or len(set(right)) != len(right) or set(left) & set(right):
            raise ValueError("Alignment sides must contain distinct native references.")
        if len({x[0] for x in left}) != 1 or len({x[0] for x in right}) != 1 or left[0][0] == right[0][0]:
            raise ValueError("Each side must represent one different source edition.")
        pair = (tuple(left), tuple(right))
        if pair in pairs or (pair[1], pair[0]) in pairs:
            raise ValueError("Duplicate or reversed duplicate relation.")
        pairs.add(pair)
        if row["review"].get("status") != "model_reviewed" or not all(row["review"].get(k) for k in ("reviewer", "date", "basis")) or not row.get("note"):
            raise ValueError("Pilot relations require explicit review provenance and reasoning.")
        if row.get("order_relation") not in {"parallel", "renumbered", "reordered", "partial"}:
            raise ValueError("Declare whether native extents are parallel, renumbered, reordered or partial.")
        if {left[0][0], right[0][0]} == {"wlc-4.20-oshb", "uxlc-2.4"} and row.get("witness_relationship") != "same_manuscript_transcriptions":
            raise ValueError("WLC and UXLC cannot be counted as independent manuscripts.")
        cardinality = ("one" if len(left) == 1 else "many") + "_to_" + ("one" if len(right) == 1 else "many")
        out.append({**row, "cardinality": cardinality, "scope": "corresponding_verse_extent_not_identical_wording_or_independent_witness_vote", "left_evidence": [endpoint(reader, x) for x in row["left"]], "right_evidence": [endpoint(reader, x) for x in row["right"]]})
    return out


def inventory(reader):
    editions = {}
    for dataset, book, chapter in sorted(reader.chapters):
        packet = reader.native_chapter(dataset, book, chapter)
        # A native verse can contain many TAHOT word records or Greek source lines.
        # Deduplicate labels in their source order, retaining headings and suffixes.
        labels = list(dict.fromkeys(label(row) for row in packet["records"]))
        if not labels:
            raise ValueError(f"Indexed chapter unexpectedly has no readable records: {(dataset, book, chapter)}")
        editions.setdefault(dataset, {}).setdefault(book, {})[str(chapter)] = labels
    return editions


def dss_inventory(store):
    tables = []; totals = Counter(); physical_ids = set()
    for path in sorted(store.profile["metadata_hashes"]):
        if not path.startswith("indexes/dss/records/"):
            continue
        # The unmapped/nonbiblical table exceeds the runtime's 8 MB metadata
        # ceiling. This offline builder verifies its full local bytes without
        # weakening that runtime limit or changing the pinned source profile.
        local = (store.root / store.safe_path(path)).resolve()
        if not local.is_relative_to(store.root):
            raise ValueError("DSS metadata path escapes the source checkout.")
        raw = store.verify(local.read_bytes(), store.profile["metadata_hashes"][path])
        rows = list(csv.DictReader(io.StringIO(raw.decode("utf-8")), delimiter="\t"))
        counts = Counter()
        for row in rows:
            key = (row["scroll"], row["record_id"])
            if key in physical_ids:
                raise ValueError(f"Duplicate DSS physical identity: {key}")
            physical_ids.add(key)
            annotated = row["chapter"].isdigit() and row["verse"].isdigit()
            counts["numeric_reference_annotations" if annotated else "unresolved_native_references"] += 1
            if row["letter_reconstruction"] == "ALL_LETTER_SLOTS_RECONSTRUCTED":
                counts["fully_reconstructed_letter_records"] += 1
        totals.update(counts)
        tables.append({"index": path, "sha256": store.profile["metadata_hashes"][path], "physical_records": len(rows), **dict(counts)})
    return {"dataset_id": "DSS-2.0.1", "identity": "scroll_and_record_id", "reference_status": "modern_annotations_not_reviewed_cross_edition_alignment", "evidence_access": "Read the pinned TSV row and its hash-verified source span; preserve reconstruction, uncertainty, fragment and line identity.", "tables": tables, "physical_records": len(physical_ids), **dict(totals)}


def build(reader, seeds, book_reviews=BOOK_REVIEWS, dss_reviews=DSS_REVIEWS):
    editions = inventory(reader)
    files = {}
    coverage = {}
    for dataset, books in sorted(editions.items()):
        name = f"native-{dataset}.json"
        body = {"dataset_id": dataset, "status": "native_reference_inventory_only", "books": books}
        files[name] = (json.dumps(body, ensure_ascii=False, separators=(",", ":")) + "\n").encode()
        coverage[dataset] = {"books": len(books), "chapters": sum(len(c) for c in books.values()), "native_verses": sum(len(vs) for c in books.values() for vs in c.values())}
    dss = dss_inventory(reader.store)
    files["native-DSS-2.0.1.json"] = (json.dumps(dss, ensure_ascii=False, indent=2) + "\n").encode()
    relations = compile_relations(reader, seeds)
    files["pilot-relations.json"] = (json.dumps({"source_commit": reader.store.profile["commit"], "relations": relations}, ensure_ascii=False, indent=2) + "\n").encode()
    book_files, book_progress = compile_books(reader, book_reviews, endpoint, native_key)
    files.update(book_files)
    dss_files, dss_progress = compile_dss_reviews(reader, dss_reviews, endpoint, native_key)
    files.update(dss_files)
    files["book-progress.json"] = (json.dumps({"source_commit": reader.store.profile["commit"], "books": book_progress, "DSS_physical_mapping": dss_progress, "reviewed_alignment_complete": False, "comparison_delivery_enabled": False}, ensure_ascii=False, indent=2) + "\n").encode()
    manifest = {"schema_version": "0.1.0", "status": "partial_mapping_index_with_complete_native_inventory", "source_repository": reader.store.profile["repository"], "source_commit": reader.store.profile["commit"], "chapter_index_sha256": reader.store.profile["metadata_hashes"]["indexes/chapter-index.jsonl"], "source_profile_sha256": digest((PLUGIN / "bible_study/config/source-profile.json").read_bytes()), "coverage": coverage, "DSS": {k: v for k, v in dss.items() if k in {"physical_records", "numeric_reference_annotations", "unresolved_native_references", "fully_reconstructed_letter_records"}}, "DSS_index_tables": len(dss["tables"]), "model_reviewed_pilot_relations": len(relations), "reviewed_alignment_complete": False, "comparison_delivery_enabled": False, "witness_relationships": {"wlc-4.20-oshb+uxlc-2.4": "related_transcriptions_of_the_same_Leningrad_manuscript", "LXX-GRCBRENT-20260408": "Greek_translation_tradition_in_a_modern_edition", "TAHOT": "annotated_Hebrew_edition_not_an_independent_manuscript_vote", "SBLGNT": "modern_critical_edition_not_a_single_manuscript", "DSS-2.0.1": "individual_scrolls_with_physical_and_reconstruction_status"}, "open_work": ["Review remaining verse correspondences from source wording and boundaries.", "Handle split, merged, reordered and partial spans without inferring equivalence from labels.", "Review DSS reference annotations against actual physical readings and reconstruction.", "Keep edition-only books, headings, suffixes, unavailable records and unresolved alignments explicit."], "files": {name: {"sha256": digest(data), "bytes": len(data)} for name, data in sorted(files.items())}}
    manifest.update(schema_version="0.2.0", book_mapping_progress="book-progress.json",
        book_relations=sum(b["relation_count"] for b in book_progress),
        DSS_individually_reviewed_physical_records=sum(b["reviewed_physical_records"] for b in dss_progress),
        book_review_methods={key: sum(b["review_methods"].get(key, 0) for b in book_progress) for key in sorted({k for b in book_progress for k in b["review_methods"]})})
    files["manifest.json"] = (json.dumps(manifest, indent=2, ensure_ascii=False) + "\n").encode()
    return files, manifest


def load_index(directory):
    manifest = json.loads((directory / "manifest.json").read_text())
    profile_bytes = (PLUGIN / "bible_study/config/source-profile.json").read_bytes()
    if manifest["source_commit"] != json.loads(profile_bytes)["commit"] or manifest["source_profile_sha256"] != digest(profile_bytes):
        raise ValueError("Index provenance does not match the pinned source profile.")
    if manifest["reviewed_alignment_complete"] or manifest["comparison_delivery_enabled"]:
        raise ValueError("The partial development index cannot claim complete mapping or enable study delivery.")
    for name, expected in manifest["files"].items():
        path = directory / name
        if path.parent != directory or not path.is_file():
            raise ValueError("Unsafe or missing index artifact.")
        raw = path.read_bytes()
        if digest(raw) != expected["sha256"] or len(raw) != expected["bytes"]:
            raise ValueError(f"Index artifact changed: {name}")
    return manifest


def lookup(directory, ref, target_dataset=None, target_book=None):
    manifest = load_index(directory)
    dataset, book, chapter, verse = native_key(ref)
    if target_dataset == dataset:
        raise ValueError("Select a different target edition.")
    native = json.loads((directory / f"native-{dataset}.json").read_text())["books"]
    if verse not in native.get(book, {}).get(str(chapter), []):
        return {"native_reference": ref, "status": "no_indexed_native_reference_not_evidence_of_omission", "relations": []}
    if target_dataset == "DSS-2.0.1":
        return lookup_dss(directory, manifest, ref, target_book)
    # Prefer chapter mappings over duplicate historical pilot examples. Do not
    # infer transitive mappings or extrapolate offsets to unreviewed references.
    relations = []
    seen = set()
    if manifest.get("book_mapping_progress"):
        progress = json.loads((directory / manifest["book_mapping_progress"]).read_text())
        native_chapter = "/".join(map(str, ref[:3]))
        for book_progress in progress["books"]:
            for shard in book_progress["shards"]:
                if native_chapter not in shard["native_chapters"]:
                    continue
                chapter = json.loads((directory / shard["file"]).read_text())
                for row in chapter["relations"]:
                    if ref in row["left"] or ref in row["right"]:
                        relations.append(expand_relation(row, chapter["chapter_evidence"]))
                        seen.add(signature(row))
    relations.extend(row for row in json.loads((directory / "pilot-relations.json").read_text())["relations"] if signature(row) not in seen)
    matches = [row for row in relations if ref in row["left"] or ref in row["right"]]
    if target_dataset:
        matches = [row for row in matches if any(x[0] == target_dataset and (target_book is None or x[1] == target_book) for x in row["left"] + row["right"])]
    book_match = any(row.get("mapping_origin") == "book_chapter" for row in matches)
    status = "reviewed_book_extent" if book_match else "model_reviewed_pilot_extent"
    if matches and all(row["review"]["status"] == "text_verified" for row in matches):
        status = "text_verified_book_extent"
    result = {"native_reference": ref, "source_commit": manifest["source_commit"], "status": status if matches else "unresolved_alignment", "relations": matches, "comparison_delivery_enabled": False}
    if not matches and target_dataset:
        native_key([target_dataset, target_book or book, chapter, verse])
        target = json.loads((directory / f"native-{target_dataset}.json").read_text())["books"]
        candidates = target.get(target_book or book, {}).get(str(chapter), [])
        result["same_label_candidate"] = [target_dataset, target_book or book, chapter, verse] if verse in candidates else None
        result["candidate_status"] = "unreviewed_matching_labels_are_not_verified_equivalence"
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["build", "check", "lookup"])
    parser.add_argument("--directory", type=Path, default=DEST)
    parser.add_argument("--seeds", type=Path, default=SEEDS)
    parser.add_argument("--dataset", choices=DATASET_NAMES)
    parser.add_argument("--book")
    parser.add_argument("--chapter", type=int)
    parser.add_argument("--verse")
    parser.add_argument("--target-dataset", choices=[*DATASET_NAMES, "DSS-2.0.1"])
    parser.add_argument("--target-book")
    args = parser.parse_args()
    try:
        if args.action == "build":
            files, manifest = build(Reader(SourceStore(data_root=ROOT, offline=True)), json.loads(args.seeds.read_text()))
            args.directory.mkdir(parents=True, exist_ok=True)
            for name, raw in files.items():
                (args.directory / name).write_bytes(raw)
            print(json.dumps({"coverage": manifest["coverage"], "DSS": manifest["DSS"], "pilot_relations": manifest["model_reviewed_pilot_relations"], "book_relations": manifest["book_relations"], "book_review_methods": manifest["book_review_methods"], "comparison_delivery_enabled": False}))
        elif args.action == "check":
            load_index(args.directory)
            expected, _ = build(Reader(SourceStore(data_root=ROOT, offline=True)), json.loads(args.seeds.read_text()))
            if any((args.directory / name).read_bytes() != raw for name, raw in expected.items()):
                raise ValueError("Index does not match a deterministic rebuild from pinned sources and review records.")
            print("Verified artifact hashes, pinned-source rebuild, book extents and DSS physical reviews.")
        else:
            if None in [args.dataset, args.book, args.chapter, args.verse]:
                parser.error("lookup requires --dataset, --book, --chapter and --verse")
            print(json.dumps(lookup(args.directory, [args.dataset, args.book, args.chapter, args.verse], args.target_dataset, args.target_book), ensure_ascii=False, indent=2))
    except (ValueError, StudyError, KeyError, OSError) as error:
        parser.exit(1, f"Verse-mapping index: {error}\n")


if __name__ == "__main__":
    main()
