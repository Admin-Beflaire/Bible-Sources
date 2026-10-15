# Verse-mapping progress

Checkpoint: 15 October 2026, committed data `62d1c6acf82c714e6e96ada97ebea187466ef3ea`. Source pin: `054a5226027deb13827a04a6e68c56cbd3702f37`. Development index only; systematic study comparison remains inactive. Completion here is book-specific, not corpus-wide.

| Genesis source pair | Reviewed coverage | Next work |
| --- | --- | --- |
| WLC/OSHB ↔ UXLC | 1,533 / 1,533 WLC verse extents, all 50 chapters | Same Leningrad manuscript, not independent witnesses |
| WLC/OSHB ↔ TAHOT | 1,533 / 1,533 WLC verse extents, all 50 chapters | Preserve Qere/X status and the 31/32 renumbering |
| WLC/OSHB ↔ Brenton Greek | 1,120 / 1,533 WLC extents; 1,119 / 1,532 Greek records; 1,100 relations | Genesis 38:1 |
| WLC/OSHB ↔ DSS physical records | 10 / 842 individually reviewed | 832 records remain |

Greek completed chapters: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37.

The edition layer has **4,166 correspondences**: **3,029 text-verified** by unique full-verse Hebrew consonants and **1,137 individually model-reviewed** from actual source wording and boundaries. Expected reading hashes bind reviews to inspected text. No human review, textual identity or preferred reading is claimed. Eleven historical pilot records remain for provenance, with duplicate Genesis lookup edges suppressed.

DSS dispositions: {"partial_physical_extent_reviewed": 6, "provisional_reference": 1, "reconstruction_only_reference": 3}. Preserve scroll, fragment, line, physical record ID, original annotation, source bytes, sign-slot uncertainty and reconstruction. Reconstructed text is not physical attestation; slot counts are not a verse-survival percentage. Manuscript photographs have not been examined.

Notable boundary cases already encoded:

- WLC Genesis 32:1 ↔ TAHOT 31:55; WLC 32:2–33 ↔ TAHOT 32:1–32.
- Genesis 1:6–7: the fulfillment clause crosses the Hebrew/Greek verse boundary; use a two-to-two block.
- Genesis 10:27–28: the Obal/Eual name crosses that boundary; use a two-to-two block.
- Genesis 11:12–13: Greek inserts Kainan within the genealogy; preserve the expanded block and differing ages.
- Hebrew Genesis 35:16 + 21 ↔ Greek 35:16: the tent/tower episode is relocated; absence of a separate Greek 35:21 record is not absence of that material.
- Genesis 17:3–4: the divine-speech introduction moves from the Hebrew third verse into the Greek fourth verse.
- Genesis 19:16–17: preserve the family being brought outside with the hand-taking/escape block.
- Genesis 19:18–19: the Lord-address crosses the Hebrew/Greek verse boundary.


Additional reviewed boundaries: 22:3–4 (third day); 23:5–6 (address); 24:18–19 (drink completion); 27:44–45 (anger); 31:26–27 (hidden flight); 31:34–35 (search); 31:44/46/48/50–52 (noncontiguous repeated witness language and Greek `50a`); 37:1–2 (genealogy heading) and 37:9–10 (report to father). Hebrew 26:32 found water and pinned Greek did not find water remain distinct.

Rebuild/check and lookup commands are in [the index README](../indexes/verse-mapping/README.md). [book-progress.json](../indexes/verse-mapping/book-progress.json) is authoritative for exact remaining references. Review batches are committed incrementally; do not restart completed chapters. No runtime/version or Production/public publication change is requested.

Saved checkpoints: `17690fa7` (initial Genesis), `c5ea6312` (Greek through 20), `8c709e85` (21–24), `20a7b74b` (25–28), `3ba1fb34` (29–32), `62d1c6ac` (33–37). Each new batch passed deterministic pinned-source rebuild/check and the relevant mapping tests; the last of these ran 18 tests. These checks do not verify host-model output or performance.
