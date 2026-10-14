"""Development-index tests: real renumbering, uncertainty, integrity and structure."""
import copy
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location("verse_mapping", Path(__file__).resolve().parents[1] / "scripts/verse_mapping.py")
maps = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(maps)


class VerseMappingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.reader = maps.Reader(maps.SourceStore(data_root=maps.ROOT, offline=True))
        cls.seeds = json.loads(maps.SEEDS.read_text())

    def test_native_inventory_preserves_headings_suffixes_and_source_order(self):
        class FixtureReader:
            chapters = {("LXX-GRCBRENT-20260408", "PSA", 1): {}}
            def native_chapter(self, *args):
                return {"records": [{"verse": 0, "native_verse_label": "0"}, {"verse": 1, "native_verse_label": "1"}, {"verse": 1, "native_verse_label": "1a"}, {"verse": 1, "native_verse_label": "1a"}]}
        self.assertEqual(maps.inventory(FixtureReader())["LXX-GRCBRENT-20260408"]["PSA"]["1"], ["0", "1", "1a"])

    def test_real_pilot_uses_exact_evidence_and_different_psalm_numbers(self):
        rows = maps.compile_relations(self.reader, self.seeds)
        psalm = next(r for r in rows if r["id"] == "psalm-23-1-wlc-greek-22-1")
        self.assertEqual(psalm["right"][0][2:], [22, "1"])
        self.assertEqual(psalm["left_evidence"][0]["chapter_evidence"]["source_commit"], self.seeds["source_commit"])
        self.assertEqual(len(psalm["right_evidence"][0]["reading_text_sha256"]), 64)
        self.assertIn("not_identical", psalm["scope"])
        self.assertTrue(any(r["witness_relationship"] == "same_manuscript_transcriptions" for r in rows))

    def test_lookup_does_not_promote_matching_labels_or_extrapolate_offsets(self):
        reviewed = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Ps", 23, "1"], "LXX-GRCBRENT-20260408", "PSA")
        self.assertEqual(reviewed["status"], "model_reviewed_pilot_extent")
        pending = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Ps", 23, "2"], "LXX-GRCBRENT-20260408", "PSA")
        self.assertEqual(pending["status"], "unresolved_alignment")
        self.assertEqual(pending["relations"], [])
        self.assertIn("not_verified_equivalence", pending["candidate_status"])
        self.assertFalse(pending["comparison_delivery_enabled"])
        missing = maps.lookup(maps.DEST, ["SBLGNT", "Acts", 8, "37"])
        self.assertIn("not_evidence_of_omission", missing["status"])

    def test_invalid_or_unattested_review_cannot_be_compiled(self):
        for change in ["pin", "duplicate", "absent", "empty", "review"]:
            seeds = copy.deepcopy(self.seeds)
            if change == "pin": seeds["source_commit"] = "0" * 40
            if change == "duplicate": seeds["relations"].append(copy.deepcopy(seeds["relations"][0]))
            if change == "absent": seeds["relations"][0]["left"][0][3] = "999"
            if change == "empty": seeds["relations"][0]["right"] = []
            if change == "review": seeds["relations"][0]["review"] = {"status": "candidate"}
            with self.subTest(change=change), self.assertRaises(ValueError):
                maps.compile_relations(self.reader, seeds)

    def test_artifact_and_revision_tampering_fail_closed(self):
        for change in ["artifact", "pin", "enable"]:
            with tempfile.TemporaryDirectory() as tmp:
                directory = Path(tmp)
                for p in maps.DEST.glob("*.json"):
                    shutil.copy(p, directory / p.name)
                manifest_path = directory / "manifest.json"
                manifest = json.loads(manifest_path.read_text())
                if change == "artifact": (directory / "pilot-relations.json").write_text("{}")
                if change == "pin": manifest["source_commit"] = "0" * 40
                if change == "enable": manifest["comparison_delivery_enabled"] = True
                manifest_path.write_text(json.dumps(manifest))
                with self.subTest(change=change), self.assertRaises(ValueError):
                    maps.load_index(directory)

    def test_split_merge_and_reordered_structure_retains_endpoint_order(self):
        # Synthetic cardinality fixture, not a historical mapping assertion.
        class FixtureReader:
            store = self.reader.store
            def native_chapter(self, dataset, book, chapter):
                return {"evidence": {"sha256": "0" * 64}, "records": [{"id": str(v), "verse": v, "text": "fixture"} for v in [1, 2]]}
        for left, right, cardinality in [([2, 1], [1], "many_to_one"), ([1], [1, 2], "one_to_many"), ([2, 1], [1, 2], "many_to_many")]:
            row = copy.deepcopy(self.seeds["relations"][0])
            row["left"] = [["wlc-4.20-oshb", "Gen", 1, str(v)] for v in left]
            row["right"] = [["uxlc-2.4", "Gen", 1, str(v)] for v in right]
            row["order_relation"] = "reordered"
            result = maps.compile_relations(FixtureReader(), {"source_commit": self.seeds["source_commit"], "relations": [row]})[0]
            self.assertEqual(result["cardinality"], cardinality)
            self.assertEqual([r[3] for r in result["left"]], list(map(str, left)))

    def test_dss_inventory_retains_physical_identity_and_uncertainty(self):
        dss = json.loads((maps.DEST / "native-DSS-2.0.1.json").read_text())
        self.assertEqual(dss["identity"], "scroll_and_record_id")
        self.assertGreater(dss["fully_reconstructed_letter_records"], 0)
        self.assertGreater(dss["unresolved_native_references"], 0)
        self.assertIn("not_reviewed_cross_edition_alignment", dss["reference_status"])
        self.assertEqual(sum(t["physical_records"] for t in dss["tables"]), dss["physical_records"])
        expected = {p for p in self.reader.store.profile["metadata_hashes"] if p.startswith("indexes/dss/records/")}
        self.assertEqual({t["index"] for t in dss["tables"]}, expected)
        self.assertTrue(any(Path(t["index"]).name.startswith("_unmapped") for t in dss["tables"]))


if __name__ == "__main__":
    unittest.main()
