# Verse-mapping index — work in progress

The pinned native-reference inventory is complete. Actual cross-source mapping is proceeding book by book from Genesis. This is **not a complete cross-source map** and is **not a corpus-wide runtime map**. Private Preview now consumes derived Genesis assets only; systematic comparison delivery remains inactive.

The current [Genesis checkpoint](../../development/verse-mapping-progress.md) contains **4,575 edition correspondences**. WLC↔UXLC, WLC↔TAHOT and WLC↔Brenton Greek cover all 50 Genesis chapters (1,533 WLC extents; 1,532 Greek native records). **842 / 842 DSS physical records** have individual dispositions: 365 partial physical correspondences, 234 reconstruction-only references and 243 provisional references. **Genesis inventory review and final verification are complete (16 October 2026)**. [book-progress.json](book-progress.json) records exact per-pair coverage and a null next-unreviewed record.

## Files and review records

- `manifest.json`: pinned revision, source-profile identity and artifact hashes.
- Five edition `native-*.json` files: exact native book/chapter/verse labels, including headings, suffixes and edition-only books; no copied verse bodies.
- `native-DSS-2.0.1.json`: every pinned DSS physical-record table, with identity, coverage and reconstruction counts.
- `book-Gen-001.json` … `book-Gen-050.json`: explicit edition correspondences, actual record IDs, reading digests, shared chapter-byte provenance and unresolved references.
- `dss-Gen.json`: individually reviewed physical-record links; never a continuous DSS edition or full-verse equivalence claim.
- `pilot-relations.json`: the eleven original examples. Lookup prefers chapter mappings over duplicate Genesis examples; the two Psalm examples remain.
- Authored review inputs: [Genesis edition reviews](../../development/verse-mapping-books/Gen.json), [DSS physical reviews](../../development/verse-mapping-dss/Gen.json) and [historical pilot reviews](../../development/verse-mapping-pilot.json).

`text_verified` means the complete nonempty Hebrew letter sequence matches uniquely in both native books, with a twelve-letter minimum. Pointing, punctuation and segmentation are removed only from the derived key; original text and flags remain untouched. Marked UXLC Qere/Ketiv and non-L TAHOT records, including additions/restorations, are excluded from automatic verification. Exact equality is not inferred from labels, and duplicate or short wording stays unresolved until individually reviewed.

`model_reviewed` means Codex inspected the exact source wording and boundaries and recorded a reason. Expected reading hashes prevent a review silently carrying over to changed wording. No human review is claimed. Ordered endpoint lists preserve split, merged, noncontiguous and reordered extents; a grouped result does not establish identical individual verse boundaries. WLC/UXLC remain related transcriptions of the same Leningrad manuscript.

DSS records preserve scroll, fragment, line, original modern reference annotation, raw source evidence and sign-slot status. `partial_physical_extent_reviewed` identifies partial wording correspondence from the transcription. `reconstruction_only_reference` preserves an editorial attribution without physical support. `provisional_reference` retains an insufficiently established placement. Unmarked glyphs have not independently been verified from manuscript images, and slot totals are not the surviving fraction of an entire verse.

## Commands

From the repository root:

```bash
python3 plugins/canonical-scripture-study/scripts/verse_mapping.py build
python3 plugins/canonical-scripture-study/scripts/verse_mapping.py check
python3 plugins/canonical-scripture-study/scripts/verse_mapping.py lookup --dataset wlc-4.20-oshb --book Gen --chapter 32 --verse 1 --target-dataset TAHOT
python3 plugins/canonical-scripture-study/scripts/verse_mapping.py lookup --dataset wlc-4.20-oshb --book Gen --chapter 35 --verse 21 --target-dataset LXX-GRCBRENT-20260408 --target-book GEN
python3 plugins/canonical-scripture-study/scripts/verse_mapping.py lookup --dataset wlc-4.20-oshb --book Gen --chapter 1 --verse 2 --target-dataset DSS-2.0.1
```

Build/check use local, hash-verified pinned data without network access. Check reconstructs every artifact and compares exact bytes. Lookup verifies artifact integrity and source-profile identity and returns expanded endpoint evidence in either edition direction. DSS lookup starts from its reviewed modern anchor, retaining physical identity in the result; DSS does not acquire a fabricated continuous verse system. No transitive mapping or Psalm offset is inferred.

Greek Genesis extent mapping is complete. All 842 indexed Genesis DSS physical records have individual dispositions. The [final verification report](../../development/verse-mapping-genesis-verification.json) confirms all 842 unique inventory identities, source/anchor hashes, complete Hebrew/Greek extent coverage, deterministic rebuild, and 58 Python / 35 Worker tests with 1,956 parity cases. Genesis work is finished; do not add another review batch or begin Exodus. Inventory disposition completion does not establish confident physical alignment for provisional or reconstruction-only records. The five-milestone continuation is complete. Other books require a separate assignment. Record unresolved spans, unavailable sources and book-specific literary forms explicitly. Missing coverage is not a manuscript omission.

Dataset terms remain those in [ATTRIBUTION.md](../../ATTRIBUTION.md), including the DSS source's **CC BY-NC 4.0** condition. Original source texts, the pinned source profile and the live study sequence are unchanged.


## Preview Genesis runtime integration — 0.1.19, 16 October 2026

The completed Genesis index now supplies a **private Preview runtime consumer**. The authored index remains the development source; the Worker build checks its manifest/profile/review hashes and emits fifty separately verified chapter assets. Preview `fetch_passage` uses mapped native extents for selected Genesis editions, handling TAHOT 31/32 numbering, Greek split/grouped/reordered boundaries and native record order. The requested WLC translation scope is retained explicitly when a grouped target needs surrounding context. Retrieved endpoint text must match its reviewed reading hash. WLC-only requests do not fetch comparison assets; other books and non-Preview tools retain their existing retrieval behavior.

Preview Genesis `fetch_dss` uses reviewed anchors and physical identities, retaining source annotations, exact hashes, model provenance, reconstruction and uncertainty. All 842 records remain classified as 365 partial physical, 234 reconstruction-only and 243 provisional references; this does not create continuous DSS verse coverage or resolve uncertain placements. Source restrictions remain active. Health and active plans describe this Genesis-only capability without adding a study part or routinely requesting further witnesses. The systematic comparison-delivery section remains disabled; the historical development-index gate is unchanged. No Production/public deployment or other-book mapping is included.

Implemented, tested and deployed to private Preview 0.1.19; see the [release status](../../development/release-status.md) for the separate deployment/live-check outcome. The earlier final-verification report describes the completed offline milestone at its recorded commit, before this newly authorized runtime integration.
