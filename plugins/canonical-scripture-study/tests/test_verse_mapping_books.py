"""Book-map checks for real boundaries, annotation limits and physical DSS links."""
import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location("verse_mapping", Path(__file__).resolve().parents[1] / "scripts/verse_mapping.py")
maps = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(maps)
from scripts.verse_mapping_books import BookMapper, letters  # noqa: E402
from scripts.verse_mapping_dss import compile_dss_reviews  # noqa: E402


class BookMappingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.reader = maps.Reader(maps.SourceStore(data_root=maps.ROOT, offline=True))
        cls.source = json.loads((maps.BOOK_REVIEWS / "Gen.json").read_text())

    def test_actual_tahot_boundary_and_reverse_lookup(self):
        row = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Gen", 32, "1"], "TAHOT")["relations"][0]
        self.assertEqual(row["right"], [["TAHOT", "Gen", 31, "55"]])
        self.assertEqual(row["order_relation"], "renumbered")
        self.assertEqual(row["review"]["status"], "text_verified")
        self.assertIn("source_commit", row["right_evidence"][0]["chapter_evidence"])
        reverse = maps.lookup(maps.DEST, ["TAHOT", "Gen", 31, "55"], "wlc-4.20-oshb")
        self.assertEqual(reverse["relations"][0]["left"], [["wlc-4.20-oshb", "Gen", 32, "1"]])

    def test_greek_clause_and_name_boundaries_use_groups(self):
        for chapter, verse, expected in [(1, "6", ["6", "7"]), (10, "28", ["27", "28"]), (11, "12", ["12", "13"])]:
            result = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Gen", chapter, verse], "LXX-GRCBRENT-20260408")
            self.assertEqual(len(result["relations"]), 1)
            row = result["relations"][0]
            self.assertEqual(row["cardinality"], "many_to_many")
            self.assertEqual([r[3] for r in row["left"]], expected)
            self.assertEqual([r[3] for r in row["right"]], expected)

    def test_relocated_tower_episode_is_not_a_missing_verse_claim(self):
        result = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Gen", 35, "21"], "LXX-GRCBRENT-20260408")
        row = result["relations"][0]
        self.assertEqual(row["right"], [["LXX-GRCBRENT-20260408", "GEN", 35, "16"]])
        self.assertEqual([r[3] for r in row["left"]], ["16", "21"])
        self.assertEqual(row["cardinality"], "many_to_one")
        self.assertIn("not evidence", row["note"])

    def test_qere_and_editorial_additions_remain_explicit(self):
        qere = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Gen", 8, "17"], "uxlc-2.4")["relations"][0]
        self.assertEqual(qere["review"]["status"], "model_reviewed")
        self.assertGreater(qere["right_evidence"][0]["qere_ketiv_marker_count"], 0)
        added = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Gen", 4, "8"], "TAHOT")["relations"][0]
        self.assertEqual(list(added["right_evidence"][0]["annotation_flags"].values()).count("X"), 2)
        self.assertIn("editorial additions", added["note"])
        self.assertIsNone(letters([{"form": "בראשית", "flags": "X"}], "TAHOT"))

    def test_duplicate_pilot_edges_are_not_counted_again(self):
        result = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Gen", 1, "1"])
        self.assertEqual(len(result["relations"]), 3)
        self.assertTrue(all(row["mapping_origin"] == "book_chapter" for row in result["relations"]))

    def test_equal_labels_short_text_and_duplicate_wording_do_not_certify(self):
        a, b, short = "בראשיתבראאלהים", "ויאמראלהיםיהיאור", "וידבר"
        class FixtureReader:
            store = self.reader.store
            chapters = {(d, "Gen", 1): {} for d in ["wlc-4.20-oshb", "uxlc-2.4"]}
            def native_chapter(self, dataset, book, chapter):
                values = [a, b, short] if dataset == "wlc-4.20-oshb" else ["אלהיםבראאתהארץ", a, b, b, short]
                return {"evidence": {"source_commit": self.store.profile["commit"], "sha256": "0" * 64},
                    "records": [{"id": dataset + str(i), "verse": i, "text": text, "qere_ketiv_markers": []} for i, text in enumerate(values, 1)]}
        source = {"book_id": "Gen", "source_commit": self.reader.store.profile["commit"], "anchor": ["wlc-4.20-oshb", "Gen"],
            "targets": [{"dataset": "uxlc-2.4", "book": "Gen", "witness_relationship": "same_manuscript_transcriptions", "automate_exact_hebrew": True}],
            "reviewed_relations": [], "_path": "fixture", "_sha256": "0" * 64}
        files, summary = BookMapper(FixtureReader(), maps.endpoint, maps.native_key).compile(source)
        rows = json.loads(files["book-Gen-001.json"])["relations"]
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["left"][0][3], "1")
        self.assertEqual(rows[0]["right"][0][3], "2")
        self.assertFalse(summary["pair_coverage"][0]["extent_coverage_complete_for_this_pair"])

    def test_wrong_review_digest_overlap_and_cross_language_shortcut_fail(self):
        mapper = BookMapper(self.reader, maps.endpoint, maps.native_key)
        for change in ["hash", "overlap", "greek"]:
            source = copy.deepcopy(self.source)
            source.update(_path="fixture", _sha256="0" * 64)
            if change == "hash": source["reviewed_relations"][0]["expected_left_reading_sha256"] = ["0" * 64]
            if change == "overlap":
                row = copy.deepcopy(source["reviewed_relations"][0]); row["id"] += "-duplicate"; source["reviewed_relations"].append(row)
            if change == "greek": source["targets"][-1]["automate_exact_hebrew"] = True
            with self.subTest(change=change), self.assertRaises(ValueError):
                mapper.compile(source)

    def test_dss_fragment_reconstruction_and_provisional_cases_are_separate(self):
        beginning = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Gen", 1, "1"], "DSS-2.0.1")
        self.assertEqual(len(beginning["physical_records"]), 3)
        short = next(r for r in beginning["physical_records"] if r["physical_reference"]["scroll"] == "4Q8d")
        self.assertEqual(short["disposition"], "provisional_reference")
        self.assertFalse(short["physical_letter_support"])
        second = maps.lookup(maps.DEST, ["wlc-4.20-oshb", "Gen", 1, "2"], "DSS-2.0.1")
        restored = next(r for r in second["physical_records"] if r["disposition"] == "reconstruction_only_reference")
        self.assertFalse(restored["physical_letter_support"])
        self.assertEqual(restored["reconstruction"]["unmarked_letter_slots"], 0)
        self.assertFalse(second["complete_verse_equivalence"])

    def test_reconstructed_dss_cannot_be_promoted_to_physical_support(self):
        source = json.loads((maps.DSS_REVIEWS / "Gen.json").read_text())
        row = next(r for r in source["reviewed_records"] if r["disposition"] == "reconstruction_only_reference")
        row["disposition"] = "partial_physical_extent_reviewed"
        with tempfile.TemporaryDirectory(dir=maps.ROOT) as tmp:
            directory = Path(tmp)
            (directory / "Gen.json").write_text(json.dumps(source))
            with self.assertRaisesRegex(ValueError, "cannot corroborate"):
                compile_dss_reviews(self.reader, directory, maps.endpoint, maps.native_key)

    def test_progress_is_pair_specific_and_keeps_comparison_inactive(self):
        progress = json.loads((maps.DEST / "book-progress.json").read_text())
        book = progress["books"][0]
        for row in book["pair_coverage"][:2]:
            self.assertEqual(row["mapped_anchor_verses"], 1533)
            self.assertTrue(row["extent_coverage_complete_for_this_pair"])
        self.assertFalse(book["pair_coverage"][-1]["extent_coverage_complete_for_this_pair"])
        dss = progress["DSS_physical_mapping"][0]
        self.assertEqual(dss["dispositions"]["partial_physical_extent_reviewed"], 6)
        self.assertEqual(dss["dispositions"]["reconstruction_only_reference"], 3)
        self.assertEqual(dss["remaining_unreviewed_physical_records"], 832)
        self.assertFalse(progress["comparison_delivery_enabled"])


if __name__ == "__main__":
    unittest.main()
