# Verse-mapping progress

Checkpoint: 15 October 2026, DSS milestone 3 completed from preview `789010c324a794aa33c0d5ddf6bb63a4555ca17d`; intermediate committed checkpoint `bab81a98a7e5b379fa3f5bc9e19bdf774be0e4da`. Source pin: `054a5226027deb13827a04a6e68c56cbd3702f37`. Development index only; systematic study comparison remains inactive. Completion here is book-specific, not corpus-wide.

| Genesis source pair | Reviewed coverage | Next work |
| --- | --- | --- |
| WLC/OSHB ↔ UXLC | 1,533 / 1,533 WLC verse extents, all 50 chapters | Same Leningrad manuscript, not independent witnesses |
| WLC/OSHB ↔ TAHOT | 1,533 / 1,533 WLC verse extents, all 50 chapters | Preserve Qere/X status and the 31/32 renumbering |
| WLC/OSHB ↔ Brenton Greek | 1,533 / 1,533 WLC extents; 1,532 / 1,532 Greek records; 1,509 relations | None; both native inventories completely covered |
| WLC/OSHB ↔ DSS physical records | 722 / 842 individually reviewed | 120 records remain; next `1Q1 / L1589621-R002` (Genesis 24:23) |

Greek completed chapters: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50.

The edition layer has **4,575 correspondences**: **3,029 text-verified** by unique full-verse Hebrew consonants and **1,546 individually model-reviewed** from actual source wording and boundaries. Expected reading hashes bind reviews to inspected text. No human review, textual identity or preferred reading is claimed. Eleven historical pilot records remain for provenance, with duplicate Genesis lookup edges suppressed.

DSS dispositions: {"partial_physical_extent_reviewed": 313, "reconstruction_only_reference": 195, "provisional_reference": 214}. Preserve scroll, fragment, line, physical record ID, original annotation, source bytes, sign-slot uncertainty and reconstruction. Reconstructed text is not physical attestation; slot counts are not a verse-survival percentage. Manuscript photographs have not been examined.

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

## DSS milestone 1 — intermediate checkpoint, 15 October 2026

Reviewed the next 20 unreviewed inventory records, from `4Q10 / L1593319-R001` through `4Q4 / L1593117-R001`, based on preview `39e00a2f56e4772b41bf1d558384f3efd2fb469c`. Added 11 partial physical correspondences, 5 reconstruction-only references and 4 provisional references. Total: **622 / 842**, **220 remaining**; next unreviewed record: `4Q4 / L1593117-R002` (Genesis 1:22). Existing 602 reviews and all edition maps retained. This is model transcription review, without manuscript-image or human verification. Deterministic build/check and 18 mapping tests passed. Development data only; no runtime integration or deployment claimed. The earlier overview is historical and will be reconciled at the milestone endpoint.

## DSS milestone 1 — completed, 15 October 2026

Added **40** individual source-based reviews in the authoritative unreviewed chapter/verse/scroll/record order: `4Q10 / L1593319-R001` through `4Q10 / L1593330-R001`. First 20 published at `57ab114b6e7edc2a16ae41dc3f703d8a6d768605`; this completion adds the remaining 20. Milestone outcomes: **18 partial physical correspondences, 11 reconstruction-only references, 11 provisional references**. Total: **642 / 842**, **200 unreviewed**. Next: **`4Q10 / L1593330-R002`, Genesis 2:3**. Continue with one approximately 40-record milestone per response; do not start another book.

All 602 prior authored and generated reviews are preserved. Each new review binds the pinned source bytes, original annotation and WLC reading digest; the generated artifact retains physical identity, source provenance, reconstruction and uncertainty. Notes preserve corrected-letter status at `4Q4 / L1593117-R002` and removed unidentified signs at `4Q10 / L1593325-R001`. Short/common or solely uncertain fragments remain provisional. Zero-letter records, including nonletter uncertainty signs, remain reconstruction-only/editorial references. No manuscript images or human verification are claimed.

Verification: deterministic build and check; **18 mapping tests passed**; exact preservation of the previous 602 reviews and edition/native artifacts; 40 new unique identities match the next 40 unreviewed inventory entries; 642 reviewed plus 200 remaining equals 842. Source pin and comparison-delivery gate are unchanged. These are offline data/integrity results, not host-model performance or evidence of a Cloudflare deployment.

## DSS milestone 2 — intermediate checkpoint, 15 October 2026

Added the next 20 inventory reviews, `4Q10 / L1593330-R002` through `6Q1 / L1602881-R001`, from preview `46daf9f347184f3b973aa24bbafa9bafbb55abf4`. Outcomes: **6 partial physical / 6 reconstruction-only / 8 provisional**. Total: **662 / 842**, **180 remaining**. Next: `6Q1 / L1602881-R002` (Genesis 6:16). The earlier overview reflects milestone 1 until the milestone 2 endpoint is reconciled. Deterministic build/check and all 18 mapping tests passed. Prior reviews and edition maps remain unchanged; no runtime integration or deployment claim.

## DSS milestone 2 — completed, 15 October 2026

Added **40** individual reviews in authoritative unreviewed inventory order, from `4Q10 / L1593330-R002` through `8Q1 / L1603101-R002`. Intermediate 20-record checkpoint: `c542e48760cb8ae484c54b2d6bd7149af9abe6ae` (662 / 842). Milestone outcomes: **11 partial physical / 16 reconstruction-only / 13 provisional**. Total: **682 / 842**, **160 remaining**. Next: **`8Q1 / L1603102-R001`, Genesis 17:13**. Continue with one approximately 40-record milestone per response.

Preserved the previous 642 authored and generated reviews, all edition/native mapping artifacts and the pinned source profile. Each added disposition is bound to the source-record bytes, original annotation and WLC reading hash. The Genesis 3:1 transcription's additional ה before אף and Genesis 6:20 plural kinds suffix remain explicit rather than harmonized with WLC. The first Genesis 17:12 record retains fragment f1+4 / physical line 0; its eight-day wording is reconstructed, not surviving attestation. Short recipient endings, isolated place wording and single uncertain letters remain provisional. No images or human review are claimed.

Executed deterministic build/check, **18 mapping tests**, exact prior-record/artifact preservation checks, next-40 inventory identity checks and whitespace validation; all passed. Review counts reconcile: 682 reviewed + 160 unreviewed = 842. Model transcription review remains distinct from confident physical alignment. Development index only; no runtime integration, deployment or host-performance claim.

## DSS milestone 3 — intermediate checkpoint, 15 October 2026

Added the next 20 inventory reviews, `8Q1 / L1603102-R001` through `8Q1 / L1603111-R002`, from preview `789010c324a794aa33c0d5ddf6bb63a4555ca17d`. Outcomes: **1 partial physical / 11 reconstruction-only / 8 provisional**. Total: **702 / 842**, **140 remaining**. Next: `8Q1 / L1603112-R001` (Genesis 18:24). The overview remains at milestone 2 until the milestone 3 endpoint is reconciled. Deterministic build/check and all 18 mapping tests passed. Prior reviews and edition maps remain unchanged; this is development data without runtime integration or deployment claims.

## DSS milestone 3 — completed, 15 October 2026

Added **40** individual reviews in authoritative unreviewed inventory order, from `8Q1 / L1603102-R001` through `1Q1 / L1589621-R001`. Intermediate 20-record checkpoint: `bab81a98a7e5b379fa3f5bc9e19bdf774be0e4da` (702 / 842). Milestone outcomes: **6 partial physical / 16 reconstruction-only / 18 provisional**. Total: **722 / 842**, **120 remaining**. Next: **`1Q1 / L1589621-R002`, Genesis 24:23**. Continue one approximately 40-record milestone per response.

The previous 682 authored and generated reviews, edition/native artifacts and pinned source profile are unchanged. Each new review preserves source-record identity/bytes, original annotation, sign flags and WLC reading digests. Notes explicitly preserve the corrected את הדבר sequence at `8Q1 / L1603112-R002`, the additional את in `1Q1 / L1589613-R001` against WLC's naming clause, and physical line 0 at `2Q1 / L1592435-R001`. A repeated name or isolated numeral does not establish the reconstructed context; those insufficient fragments remain provisional. No manuscript-image inspection or human review is claimed.

Executed deterministic build/check, all **18 mapping tests**, exact prior-record/artifact preservation checks, next-40 inventory identity checks, count reconciliation and whitespace validation; all passed. 722 reviewed + 120 unreviewed = 842. This is development-only mapping data, without runtime integration, deployment or host-model/performance claims.

## DSS milestone 4 — intermediate checkpoint, 15 October 2026

Added the next 20 inventory reviews, `1Q1 / L1589621-R002` through `4Q6 / L1593180-R001`, from preview `078e8c1bf4df42a116754a64f74137cf82191017`. Outcomes: **6 partial physical / 9 reconstruction-only / 5 provisional**. Total: **742 / 842**, **100 remaining**. Next: `Murx / L1605156-R002` (Genesis 33:19). The overview remains at milestone 3 until the milestone 4 endpoint is reconciled. Deterministic build/check and all 18 mapping tests passed. Prior reviews and edition maps are preserved; no runtime integration or deployment claim.
