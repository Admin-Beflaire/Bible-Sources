"""Offline book/chapter mapping from exact Hebrew content and explicit reviews.

An exact consonantal match proves a verse extent, not identical punctuation,
vocalization, textual priority, or an independent manuscript witness.
"""
from collections import Counter, defaultdict
from functools import lru_cache
import hashlib
import json
import re
import unicodedata


HEBREW_EDITIONS = {"wlc-4.20-oshb", "uxlc-2.4", "TAHOT"}
TEXT_METHOD = "unique_full_verse_hebrew_letters_v1"


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def letters(rows, dataset):
    # Qere, additions and restorations require an explicit review. Never drop
    # those words and then declare the remainder an exact full-verse match.
    if dataset not in HEBREW_EDITIONS:
        return None
    if dataset == "TAHOT" and any(not r["flags"].startswith("L") for r in rows):
        return None
    if dataset == "uxlc-2.4" and any(r["qere_ketiv_markers"] for r in rows):
        return None
    text = "".join(r.get("text", r.get("form", "")) for r in rows)
    return "".join(c for c in unicodedata.normalize("NFD", text) if "\u05d0" <= c <= "\u05ea")


def signature(row):
    left = tuple(tuple(x) for x in row["left"])
    right = tuple(tuple(x) for x in row["right"])
    return tuple(sorted((left, right)))


class BookMapper:
    def __init__(self, reader, endpoint, native_key):
        self.reader, self.endpoint, self.native_key = reader, endpoint, native_key

    @lru_cache(maxsize=None)
    def records(self, dataset, book):
        result = {}
        for d, b, c in sorted(self.reader.chapters):
            if (d, b) == (dataset, book):
                for row in self.reader.native_chapter(d, b, c)["records"]:
                    ref = (d, b, c, str(row.get("native_verse_label", row["verse"])))
                    result.setdefault(ref, []).append(row)
        if not result:
            raise ValueError(f"No indexed source book: {dataset}/{book}")
        return result

    @lru_cache(maxsize=None)
    def evidence(self, ref):
        result = self.endpoint(self.reader, list(ref))
        rows = self.records(ref[0], ref[1])[ref]
        if ref[0] == "TAHOT":
            result["annotation_flags"] = {r["id"]: r["flags"] for r in rows if r["flags"] != "L"}
        elif ref[0] == "uxlc-2.4":
            result["qere_ketiv_marker_count"] = sum(len(r["qere_ketiv_markers"]) for r in rows)
        return result

    def relation(self, left, right, witness, review, note, order="parallel", identifier=None):
        for ref in left + right:
            self.native_key(list(ref))
            if ref not in self.records(ref[0], ref[1]):
                raise ValueError(f"Unattested mapping endpoint: {ref}")
        if not left or not right or len(set(left)) != len(left) or len(set(right)) != len(right):
            raise ValueError("Mapping sides must contain distinct, nonempty native references.")
        if len({r[:2] for r in left}) != 1 or len({r[:2] for r in right}) != 1 or left[0][0] == right[0][0]:
            raise ValueError("Each side must have one different native edition/book.")
        if {left[0][0], right[0][0]} == {"wlc-4.20-oshb", "uxlc-2.4"} and witness != "same_manuscript_transcriptions":
            raise ValueError("WLC/UXLC are the same manuscript's related transcriptions.")
        if order not in {"parallel", "renumbered", "reordered", "partial"}:
            raise ValueError("Unknown order relation.")
        cardinality = ("one" if len(left) == 1 else "many") + "_to_" + ("one" if len(right) == 1 else "many")
        identifier = identifier or f"{left[0][1]}-{left[0][2]}-{left[0][3]}-to-{right[0][0]}-{right[0][2]}-{right[0][3]}"
        return {"id": identifier, "left": [list(r) for r in left], "right": [list(r) for r in right],
                "cardinality": cardinality, "order_relation": order, "witness_relationship": witness,
                "scope": "corresponding_verse_extent_not_identical_wording_or_independent_witness_vote",
                "review": review, "note": note,
                "left_evidence": [self.evidence(r) for r in left], "right_evidence": [self.evidence(r) for r in right]}

    def compile(self, source):
        if source["source_commit"] != self.reader.store.profile["commit"]:
            raise ValueError("Book review belongs to another pinned source revision.")
        book_id = source["book_id"]
        if not re.fullmatch(r"[A-Za-z0-9_-]+", book_id):
            raise ValueError("Unsafe book artifact ID.")
        anchor = tuple(source["anchor"])
        native = self.records(*anchor)
        targets = {(t["dataset"], t["book"]): t for t in source["targets"]}
        if len(targets) != len(source["targets"]) or anchor in targets:
            raise ValueError("Duplicate target or self-mapping.")
        relations = []
        for row in source.get("reviewed_relations", []):
            left, right = [tuple(r) for r in row["left"]], [tuple(r) for r in row["right"]]
            if not left or not right or any(r[:2] != anchor for r in left) or any(r[:2] != right[0][:2] for r in right) or right[0][:2] not in targets:
                raise ValueError("Review endpoints do not match the declared source pair.")
            review = row["review"]
            if review.get("status") != "model_reviewed" or not all(review.get(k) for k in ("reviewer", "date", "basis")) or not row.get("note"):
                raise ValueError("Individual reviews require provenance and a source-based reason.")
            relation = self.relation(left, right, targets[right[0][:2]]["witness_relationship"], review, row["note"], row["order_relation"], row["id"])
            for side in ("left", "right"):
                actual = [e["reading_text_sha256"] for e in relation[side + "_evidence"]]
                if actual != row["expected_" + side + "_reading_sha256"]:
                    raise ValueError("Reviewed wording changed; repeat source review rather than refreshing hashes blindly.")
            relations.append(relation)

        for pair, target in targets.items():
            if not target.get("automate_exact_hebrew", False):
                continue
            if anchor[0] not in HEBREW_EDITIONS or pair[0] not in HEBREW_EDITIONS:
                raise ValueError("Consonantal equality cannot certify a cross-language mapping.")
            left_keys = {ref: letters(rows, anchor[0]) for ref, rows in native.items()}
            right_keys = {ref: letters(rows, pair[0]) for ref, rows in self.records(*pair).items()}
            counts = Counter(left_keys.values())
            reverse = defaultdict(list)
            for ref, key in right_keys.items():
                if key:
                    reverse[key].append(ref)
            manual_left = {tuple(r) for row in relations if tuple(row["right"][0][:2]) == pair for r in row["left"]}
            manual_right = {tuple(r) for row in relations if tuple(row["right"][0][:2]) == pair for r in row["right"]}
            for ref, key in left_keys.items():
                if ref in manual_left or not key or len(key) < 12 or counts[key] != 1 or len(reverse[key]) != 1:
                    continue
                other = reverse[key][0]
                if other in manual_right:
                    raise ValueError("Automatic equality conflicts with an individual reviewed extent.")
                review = {"status": "text_verified", "method": TEXT_METHOD, "normalized_letters_sha256": sha(key.encode()), "letter_count": len(key)}
                relations.append(self.relation([ref], [other], target["witness_relationship"], review,
                    "Unique complete Hebrew letter sequence in both native books; vocalization, punctuation and segmentation are not asserted identical.",
                    "parallel" if ref[2:] == other[2:] else "renumbered"))

        # A native endpoint belongs to one extent per source pair. Disallow
        # conflicting overlaps instead of counting duplicate matches as coverage.
        occupied, ids = set(), set()
        for row in relations:
            pair = tuple(row["right"][0][:2])
            if row["id"] in ids:
                raise ValueError("Duplicate book relation ID.")
            ids.add(row["id"])
            for side in ("left", "right"):
                for ref in row[side]:
                    key = (pair, side, tuple(ref))
                    if key in occupied:
                        raise ValueError("Conflicting overlapping native extents in one edition pair.")
                    occupied.add(key)

        chapters = sorted({r[2] for r in native})
        files, shards, progress = {}, [], []
        for pair, target in targets.items():
            subset = [row for row in relations if tuple(row["right"][0][:2]) == pair]
            left = {tuple(r) for row in subset for r in row["left"]}
            right = {tuple(r) for row in subset for r in row["right"]}
            todo = [list(ref) for ref in native if ref not in left]
            unmatched_targets = [list(ref) for ref in self.records(*pair) if ref not in right]
            progress.append({"anchor": list(anchor), "target": list(pair), "anchor_verses": len(native),
                "mapped_anchor_verses": len(left), "target_verses": len(self.records(*pair)), "mapped_target_verses": len(right),
                "relations": len(subset), "review_methods": dict(Counter(row["review"]["status"] for row in subset)),
                "complete_anchor_chapters": [c for c in chapters if all(ref in left for ref in native if ref[2] == c)],
                "extent_coverage_complete_for_this_pair": not todo and not unmatched_targets,
                "next_unresolved_anchor": todo[0] if todo else None, "unmatched_target_references": unmatched_targets})

        for chapter in chapters:
            rows = sorted((row for row in relations if row["left"][0][2] == chapter), key=lambda row: (row["left"][0][3].zfill(4), row["right"][0][0], row["id"]))
            evidence, compact = {}, []
            for row in rows:
                packed = dict(row)
                for side in ("left", "right"):
                    endpoints = []
                    for item in row[side + "_evidence"]:
                        ref = item["native_reference"]
                        key = "/".join(map(str, ref[:3]))
                        evidence[key] = item["chapter_evidence"]
                        endpoints.append({k: v for k, v in item.items() if k != "chapter_evidence"} | {"chapter_evidence_key": key})
                    packed[side + "_evidence"] = endpoints
                compact.append(packed)
            unresolved = []
            for pair in targets:
                mapped = {tuple(r) for row in relations if tuple(row["right"][0][:2]) == pair for r in row["left"]}
                refs = [list(ref) for ref in native if ref[2] == chapter and ref not in mapped]
                if refs:
                    unresolved.append({"target": list(pair), "anchor_references": refs, "status": "unresolved_not_a_textual_omission"})
            body = {"schema_version": "0.2.0", "book_id": book_id, "anchor_chapter": chapter,
                "source_commit": source["source_commit"], "chapter_evidence": evidence,
                "relations": compact, "unresolved": unresolved, "comparison_delivery_enabled": False}
            name = f"book-{book_id}-{chapter:03}.json"
            files[name] = (json.dumps(body, ensure_ascii=False, separators=(",", ":")) + "\n").encode()
            shards.append({"file": name, "native_chapters": list(evidence), "relations": len(rows)})

        summary = {"book_id": book_id, "source_review_file": source["_path"], "source_review_sha256": source["_sha256"],
            "status": "mapping_in_progress", "pair_coverage": progress, "shards": shards,
            "physical_DSS_alignment": source.get("physical_DSS_alignment", "not_reviewed"),
            "relation_count": len(relations), "review_methods": dict(Counter(row["review"]["status"] for row in relations)),
            "comparison_delivery_enabled": False}
        return files, summary


def compile_books(reader, directory, endpoint, native_key):
    mapper = BookMapper(reader, endpoint, native_key)
    files, books = {}, []
    for path in sorted(directory.glob("*.json")):
        raw = path.read_bytes()
        source = json.loads(raw)
        source["_path"], source["_sha256"] = str(path.relative_to(reader.store.root)), sha(raw)
        artifacts, progress = mapper.compile(source)
        if set(files) & set(artifacts):
            raise ValueError("Duplicate book artifacts.")
        files.update(artifacts)
        books.append(progress)
    return files, books


def expand_relation(row, chapter_evidence):
    result = dict(row, mapping_origin="book_chapter")
    for side in ("left", "right"):
        result[side + "_evidence"] = [
            {k: v for k, v in e.items() if k != "chapter_evidence_key"} | {"chapter_evidence": chapter_evidence[e["chapter_evidence_key"]]}
            for e in row[side + "_evidence"]]
    return result
