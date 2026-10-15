"""Individually reviewed DSS physical-record links; never a continuous edition."""
from collections import Counter
import hashlib
import json
import re


DISPOSITIONS = {"partial_physical_extent_reviewed", "reconstruction_only_reference", "provisional_reference"}
COUNTS = ("sign_slots", "letter_slots", "reconstructed_letter_slots", "uncertain_letter_slots", "unmarked_letter_slots")


def compile_dss_reviews(reader, directory, endpoint, native_key):
    files, progress = {}, []
    for path in sorted(directory.glob("*.json")):
        raw = path.read_bytes()
        source = json.loads(raw)
        if source["source_commit"] != reader.store.profile["commit"]:
            raise ValueError("DSS review belongs to another pinned source revision.")
        book = source["book_id"]
        if not re.fullmatch(r"[A-Za-z0-9_-]+", book):
            raise ValueError("Unsafe DSS book artifact ID.")
        table = reader._dss_index("records", book)
        records = {(row["scroll"], row["record_id"]): row for row in table}
        if len(records) != len(table):
            raise ValueError("DSS physical identities are not unique.")
        links, seen = [], set()
        for review in source["reviewed_records"]:
            key = (review["scroll"], review["record_id"])
            if key in seen or key not in records:
                raise ValueError("Duplicate or unattested DSS physical review.")
            seen.add(key)
            row = records[key]
            pointer = reader._dss_pointer(row)
            # Verify actual source bytes, not only the annotation table.
            reading = reader.store.span(pointer)
            if hashlib.sha256(reading).hexdigest() != review["expected_record_sha256"]:
                raise ValueError("Reviewed DSS source bytes changed; repeat physical-record review.")
            annotation = {k: row[k] for k in ("book", "chapter", "verse", "halfverse")}
            if annotation != review["expected_source_annotation"]:
                raise ValueError("Reviewed DSS reference annotation changed.")
            disposition = review["disposition"]
            counts = {k: int(row[k]) for k in COUNTS}
            if disposition not in DISPOSITIONS:
                raise ValueError("Unknown physical-reference disposition.")
            has_physical_letters = counts["unmarked_letter_slots"] + counts["uncertain_letter_slots"] > 0
            if disposition == "partial_physical_extent_reviewed" and not has_physical_letters:
                raise ValueError("Fully reconstructed/no-letter text cannot corroborate physical verse coverage.")
            if disposition == "reconstruction_only_reference" and (has_physical_letters or row["letter_reconstruction"] not in {"ALL_LETTER_SLOTS_RECONSTRUCTED", "NO_LETTER_SLOTS"}):
                raise ValueError("Reconstruction-only disposition conflicts with physical annotations.")
            provenance = review["review"]
            if provenance.get("status") != "model_reviewed" or not all(provenance.get(k) for k in ("reviewer", "date", "basis")) or not review.get("note"):
                raise ValueError("DSS links require actual review provenance and reasoning.")
            anchors = review["anchor_references"]
            if not anchors or len({native_key(a) for a in anchors}) != len(anchors):
                raise ValueError("Distinct attested anchor references are required.")
            evidence = [endpoint(reader, ref) for ref in anchors]
            if [e["reading_text_sha256"] for e in evidence] != review["expected_anchor_reading_sha256"]:
                raise ValueError("Reviewed anchor wording changed.")
            links.append({"physical_reference": {"dataset": "DSS-2.0.1", **{k: row[k] for k in ("scroll", "record_id", "fragment", "line", "word_nodes")}},
                "source_annotation": annotation, "anchor_references": anchors, "disposition": disposition,
                "physical_letter_support": disposition == "partial_physical_extent_reviewed",
                "scope": "partial_physical_or_editorial_reference_not_complete_verse_equivalence",
                "reconstruction": {"status": row["letter_reconstruction"], **counts},
                "record_evidence": reader.store.evidence(pointer), "anchor_evidence": evidence,
                "review": provenance, "note": review["note"],
                "source_limit": "Unmarked glyphs have not been independently confirmed from manuscript images; reconstruction and uncertainty remain explicit."})
        name = f"dss-{book}.json"
        body = {"schema_version": "0.2.0", "source_commit": source["source_commit"], "book_id": book,
            "records": links, "licence": "CC BY-NC 4.0", "comparison_delivery_enabled": False}
        files[name] = (json.dumps(body, ensure_ascii=False, separators=(",", ":")) + "\n").encode()
        unreviewed = sorted((row for key, row in records.items() if key not in seen),
            key=lambda row: (int(row["chapter"]) if row["chapter"].isdigit() else 10**9,
                             int(row["verse"]) if row["verse"].isdigit() else 10**9,
                             row["scroll"], row["record_id"]))
        progress.append({"book_id": book, "file": name, "source_review_file": str(path.relative_to(reader.store.root)),
            "source_review_sha256": hashlib.sha256(raw).hexdigest(), "indexed_physical_records": len(records),
            "reviewed_physical_records": len(links), "remaining_unreviewed_physical_records": len(records) - len(links),
            "dispositions": dict(Counter(link["disposition"] for link in links)), "physical_alignment_complete": False,
            "next_unreviewed_physical_record": next(({"scroll": row["scroll"], "record_id": row["record_id"], "source_annotation": {k: row[k] for k in ("book", "chapter", "verse")}} for row in unreviewed), None)})
    return files, progress


def lookup_dss(directory, manifest, ref, target_book=None):
    progress = json.loads((directory / manifest["book_mapping_progress"]).read_text())
    records = []
    for book in progress.get("DSS_physical_mapping", []):
        if target_book and target_book != book["book_id"]:
            continue
        records.extend(row for row in json.loads((directory / book["file"]).read_text())["records"] if ref in row["anchor_references"])
    return {"native_reference": ref, "target_dataset": "DSS-2.0.1", "source_commit": manifest["source_commit"],
        "status": "reviewed_physical_or_editorial_links" if records else "no_reviewed_physical_link_not_evidence_of_omission",
        "physical_records": records, "complete_verse_equivalence": False, "comparison_delivery_enabled": False}
