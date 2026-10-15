# Verse-mapping progress

Checkpoint: 16 October 2026, Finish Genesis milestone 5 — final verification completed from preview `b7e59868f9e0c3875316a7fc0dc331e6294218bd`. Source pin: `054a5226027deb13827a04a6e68c56cbd3702f37`. All 842 indexed Genesis DSS records have individual dispositions; Hebrew/Greek extent coverage and the complete development inventory passed final verification. Systematic study comparison remains inactive. Genesis work is finished; do not start Exodus.

| Genesis source pair | Reviewed coverage | Next work |
| --- | --- | --- |
| WLC/OSHB ↔ UXLC | 1,533 / 1,533 WLC verse extents, all 50 chapters | Same Leningrad manuscript, not independent witnesses |
| WLC/OSHB ↔ TAHOT | 1,533 / 1,533 WLC verse extents, all 50 chapters | Preserve Qere/X status and the 31/32 renumbering |
| WLC/OSHB ↔ Brenton Greek | 1,533 / 1,533 WLC extents; 1,532 / 1,532 Greek records; 1,509 relations | None; both native inventories completely covered |
| WLC/OSHB ↔ DSS physical records | 842 / 842 individual dispositions recorded | No unreviewed physical records; final verification passed; Genesis finished |

Greek completed chapters: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50.

The edition layer has **4,575 correspondences**: **3,029 text-verified** by unique full-verse Hebrew consonants and **1,546 individually model-reviewed** from actual source wording and boundaries. Expected reading hashes bind reviews to inspected text. No human review, textual identity or preferred reading is claimed. Eleven historical pilot records remain for provenance, with duplicate Genesis lookup edges suppressed.

DSS dispositions: {"partial_physical_extent_reviewed": 365, "reconstruction_only_reference": 234, "provisional_reference": 243}. Preserve scroll, fragment, line, physical record ID, original annotation, source bytes, sign-slot uncertainty and reconstruction. Reconstructed text is not physical attestation; slot counts are not a verse-survival percentage. Manuscript photographs have not been examined.

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

## DSS milestone 4 — completed, 15 October 2026

Added **40** individual reviews in authoritative unreviewed inventory order, from `1Q1 / L1589621-R002` through `2Q1 / L1592440-R001`. Intermediate 20-record checkpoint: `7e5a6fc506f3885cddd8cabb2de9d7beba0c60db` (742 / 842). Milestone outcomes: **12 partial physical / 15 reconstruction-only / 13 provisional**. Total: **762 / 842**, **80 remaining**. Next: **`2Q1 / L1592441-R001`, Genesis 36:6**. Continue one approximately 40-record milestone per response.

All previous 722 authored/generated reviews and completed edition/native maps remain unchanged. Notes retain 4Q12's אחרית / לוא forms and uncertain final י after יט, without normalizing to WLC. The unmarked פנות in `4Q6 / L1593182-R001` is preserved against WLC בנות as a transcription difference; no image-based decision establishes it as an actual manuscript variant or an export error. The heavily uncertain altar wording at `4Q6 / L1593180-R002` remains explicitly uncertain. The rare payment-unit noun in 4Q6 is distinguished from reconstructed hundred wording, and Murx's isolated amount remains provisionally placed. No complete purchase clause is invented from these fragments.

Executed deterministic build/check, all **18 mapping tests**, exact prior-record/artifact preservation, next-40 inventory identity checks, count reconciliation and whitespace validation; all passed. 762 reviewed + 80 unreviewed = 842. Source pin, physical identities and source/anchor digests remain verifiable. Model transcription review does not claim human or image verification. Development index only; no runtime integration, deployment or host-performance claim.


## Finish Genesis milestone 1 — 20-record schedule, 15 October 2026

This continuation uses the user's replacement schedule: exactly one 20-record milestone per response, with visible progress after ten reviews, validation before committing, one remote HEAD verification (at most one recovery), and a final report before waiting for “Next milestone”. This supersedes the historical 40-record instructions above. After the remaining review batches, perform a separate final Genesis verification milestone; do not start Exodus.

Starting verified preview: `691e16379258df0e25c2db4ddd436a67a743a922`, **762 / 842**. Reviewed exactly the next 20 unique inventory identities, from `2Q1 / L1592441-R001` through `4Q3 / L1593099-R001`. Outcomes: **1 partial physical / 11 reconstruction-only / 8 provisional**; cumulative **326 / 221 / 235**. Total: **782 / 842**, **60 remaining**. Next: **`4Q3 / L1593099-R002`, Genesis 40:21**.

The unmarked שמלה ממש sequence supports a partial Samlah/place correspondence; its remaining place letters are reconstructed. Preserve source physical line 0 at `2Q1 / L1592442-R001`. The uncertain ע in the restored Avith name and short שא remnant remain provisional. The Genesis 40 demonstrative, repeated Pharaoh names, numeral ending, preposition and isolated ש do not independently establish their restored contexts. Zero-letter records retain missing/unidentified signs without invented Hebrew readings. Every record preserves its annotation, source-byte hash, WLC anchor digest and model-review provenance. No manuscript-image inspection or human review is claimed.

Validation: established build/check, all 18 existing mapping tests, exact next-20 identity and prior-review preservation checks, duplicate/count reconciliation, source/anchor hash verification, deterministic artifact comparison and whitespace checks passed. The prior 762 authored/generated reviews, all edition/native mapping artifacts and source pin remain unchanged. Development data only: comparison delivery stays disabled, with no runtime, Production or public deployment change.


## Finish Genesis milestone 2 — 20-record schedule, 15 October 2026

Starting verified preview: `bd07178994ce53159a7f927b96458c1dfbb79f2e`, **782 / 842**. Reviewed exactly the next 20 unique inventory identities, `4Q3 / L1593099-R002` through `4Q3 / L1593109-R001`, following fragment f1ii physical lines 5-15. Outcomes: **10 partial physical / 8 reconstruction-only / 2 provisional**; cumulative **336 / 229 / 237**. Total: **802 / 842**, **40 remaining**. Next: **`4Q3 / L1593109-R002`, Genesis 41:8**. Continue exactly one 20-record milestone per turn and return a final report; wait for “Next milestone”. The final Genesis verification remains separate.

Notes preserve fully reconstructed cupbearer/baker clauses and the provisional repeated cupbearer title, then track actual dream/cattle/grain wording through the column. Short uncertain river wording remains provisional. The unmarked/plene forms בריאות (41:2, 4) and יפות (41:4) are distinguished from the WLC anchor spellings. At 41:7, the six unmarked letters ותבלען lack WLC's final ה; the following record preserves an additional blighted modifier (ו restored, ה uncertain, שדפות unmarked) and הבראות without WLC's י. Sign-run uncertainty, reconstructed introductions, standalone vacats and source identity remain explicit. These are transcription observations, not image-confirmed manuscript variants or whole-verse equivalence. No human review is claimed.

Validation: established build/check, all 18 existing mapping tests, exact next-20 identity and prior-782 preservation checks, no duplicates, source/anchor hashes, deterministic artifact integrity, count reconciliation and whitespace checks passed. Earlier Hebrew/Greek/native mapping artifacts, the source pin and comparison-delivery gate are unchanged. Development data only; no runtime, Production or public deployment change, or host-model performance claim.


## Finish Genesis milestone 3 — 20-record schedule, 15 October 2026

Starting verified preview: `75d6f33bfe5605f79995f146b06bbd016451f1c9`, **802 / 842**. Reviewed exactly the next 20 unique inventory identities, `4Q3 / L1593109-R002` through `4Q6 / L1593186-R001`, spanning 4Q3 f1ii lines 15-18, Mas1 f1 lines 1-5 and 4Q6 f1 lines 1-4. Outcomes: **13 partial physical / 4 reconstruction-only / 3 provisional**; cumulative **349 / 233 / 240**. Total: **822 / 842**, **20 remaining**. Next: **`4Q6 / L1593186-R002`, Genesis 48:3**. Finish only the final 20-record review batch next; keep the final Genesis verification as a separate milestone and wait for “Next milestone” after each report.

4Q3's correction span across Genesis 41:9-10 remains marked cor=3; corrected letters are neither ordinary unmarked text nor editorial reconstruction. The unmarked ונחלם ending differs from WLC ונחלמה; the fragment ending does not establish omission of the rest of 41:11. Mas1 preserves actual את יעקוב, while its following אביהם is wholly reconstructed; neither wording is silently harmonized with WLC. Reuben/Hanoch, Jemuel/Jamin and the damaged sons-of-Levi heading support partial genealogical correspondences. Egypt alone remains provisional. At 4Q6 48:1, a reconstructed alternative י retains both rec/alt flags; the father-illness clause is restored, while Joseph and portions of the two names have physical support. The heavily uncertain arrival report and damaged Israel/verb opening at 48:2 remain provisional; bed wording is reconstructed. No manuscript-image or human review is claimed.

Validation: established build/check, all 18 existing mapping tests, exact next-20 identity and prior-802 preservation checks, no duplicates, source/anchor hashes, fragment/line identity, deterministic artifact integrity, count reconciliation and whitespace checks passed. Earlier Hebrew/Greek/native mapping artifacts, source pin, comparison gate and deployment settings remain unchanged. Development data only, with no runtime, Production/public deployment or host-model performance claim.


## Finish Genesis milestone 4 — final 20-record review batch, 16 October 2026

Starting verified preview: `2a6ad998edf1ea205fbcf052ecbc1532d95c01c1`, **822 / 842**. Reviewed exactly the final 20 unique inventory identities, `4Q6 / L1593186-R002` through `4Q6 / L1593199-R002`, fragment f1 physical lines 4-17, annotated Genesis 48:3-11. Outcomes: **16 partial physical / 1 reconstruction-only / 3 provisional**; cumulative **365 / 234 / 243**. Total: **842 / 842**, **0 remaining**. Next unreviewed record: **none**. The next user-authorized milestone is the separate full Genesis verification/documentation pass; it has not been completed in this review batch. Do not start Exodus.

Preserve the reconstructed/alternative Luz and Simeon letters, damaged promises and uncertain אחרים against WLC אחריהם. The unmarked inheritance and later recognition/blessing wording support partial correspondences, retaining each physical record identity. The 48:7 transcription passes from אפרתה to היא בית לחם without WLC's intervening burial clause; at 48:9 it has ויאמר יוסף בני without WLC's אל אביו. At 48:10, fully unmarked מזקנה differs from WLC מזקן, and the transcribed embrace/kiss order is reversed against WLC. These are transcription-level differences and boundaries, not image-confirmed manuscript omissions or adjudicated textual variants. Preserve uncertain letters and reconstruction explicitly; no human or manuscript-image review is claimed.

Validation: established build/check, all 18 existing mapping tests, exact final-20 identity and prior-822 authored/generated review preservation checks, no duplicates, source/anchor hashes, fragment/line identity, deterministic artifact integrity, count reconciliation and whitespace checks passed. All 842 inventory identities now have dispositions and the next-unreviewed field is null, while confident physical alignment remains incomplete by design. Existing Hebrew/Greek/native artifacts, source pin, comparison gate and deployment settings are unchanged. Development data only, with no runtime, Production/public deployment or host-model performance claim. The separate final verification will broaden the inventory, lookup and deterministic-rebuild audit and record its own committed outcome.


## Finish Genesis milestone 5 — final verification complete, 16 October 2026

Verified the completed inventory from preview `b7e59868f9e0c3875316a7fc0dc331e6294218bd`; **no new physical reviews** were added. All **842 / 842** indexed Genesis physical identities are unique and have dispositions: **365 partial physical / 234 reconstruction-only / 243 provisional**, with zero missing identities and no next unreviewed record. All 842 prior review objects and the 762-record starting checkpoint are preserved exactly. Updated only the authored review file's stale “Opening physical records” scope metadata; the individual reviews, source bytes and generated DSS links are unchanged. The [machine-readable verification report](verse-mapping-genesis-verification.json) records exact evidence and limitations.

Verified each physical source-record hash, original annotation, scroll/fragment/line/word identity, sign-slot counts, disposition, anchor digest and model provenance. Reconstruction-only records do not claim surviving wording; provisional references remain unresolved. WLC/UXLC and WLC/TAHOT each retain 1,533 / 1,533 extents; WLC/Brenton Greek retains 1,533 Hebrew extents and 1,532 Greek native records in 1,509 relations. All 4,575 edition correspondences, 6,131 unique endpoints and 9,197 endpoint memberships were audited. Actual lookup checks passed in both edition directions, including TAHOT renumbering, Greek grouped/reordered boundaries and first/final chapter examples; DSS anchor lookups preserve physical identities without fabricating a continuous DSS verse system.

Established build/check confirms a deterministic pinned-source rebuild with exact artifact bytes. **58 Python tests** (including all 18 mapping tests), **35 Worker tests** and **1,956 Python/Worker parity cases** passed. Worker asset preparation verified 103 metadata files and 64,108 source spans; the runtime bundle contains no verse-mapping metadata. Earlier edition/native artifacts, runtime sources, deployment configuration, pinned source profile and DSS CC BY-NC 4.0 provenance remain unchanged. Both comparison-delivery and confident physical-alignment flags remain false deliberately; inventory review completion does not resolve every textual placement or prove whole-verse attestation.

Read-only live checks: Production health remains **0.1.10**, Preview **0.1.18**, with the same source pin. Cloudflare's active Production deployment `1f13e9d5-8a55-4798-a9ae-b70bd7115d43` dates to 12 October 09:56:19Z; public deployment `30ac1ac7-0f5c-4df1-be75-aa5920c99464` dates to 12 October 15:18:33Z. Both predate this continuation. Public health still returns an internal connector error, so no fresh public health/version claim is made. Its manual-only build path remains `__manual_public_release_only__/**`. Main remains `fed918d04ca9975e93e4fd72e6861b8481948639`. No deployment, runtime integration or publication was performed; no host-model behavior/performance claim follows from these tests.

Unresolved limits remain intentional: 243 provisional placements, 234 reconstruction-only references, damaged/corrected/alternative-marked letters, and noted transcription differences (including 4Q3 Genesis 41 and Mas1/4Q6 Genesis 46/48). No manuscript photographs or human review are claimed. These uncertainties do not prevent completion of the explicitly bounded inventory-disposition assignment. **Genesis is finished. Do not start Exodus or activate manuscript comparison.**


## Preview Genesis runtime integration — 0.1.19, 16 October 2026

The completed Genesis index now supplies a **private Preview runtime consumer**. The authored index remains the development source; the Worker build checks its manifest/profile/review hashes and emits fifty separately verified chapter assets. Preview `fetch_passage` uses mapped native extents for selected Genesis editions, handling TAHOT 31/32 numbering, Greek split/grouped/reordered boundaries and native record order. The requested WLC translation scope is retained explicitly when a grouped target needs surrounding context. Retrieved endpoint text must match its reviewed reading hash. WLC-only requests do not fetch comparison assets; other books and non-Preview tools retain their existing retrieval behavior.

Preview Genesis `fetch_dss` uses reviewed anchors and physical identities, retaining source annotations, exact hashes, model provenance, reconstruction and uncertainty. All 842 records remain classified as 365 partial physical, 234 reconstruction-only and 243 provisional references; this does not create continuous DSS verse coverage or resolve uncertain placements. Source restrictions remain active. Health and active plans describe this Genesis-only capability without adding a study part or routinely requesting further witnesses. The systematic comparison-delivery section remains disabled; the historical development-index gate is unchanged. No Production/public deployment or other-book mapping is included.

Implemented, tested and deployed to private Preview 0.1.19; see the [release status](release-status.md) for the separate deployment/live-check outcome. The earlier final-verification report describes the completed offline milestone at its recorded commit, before this newly authorized runtime integration.
