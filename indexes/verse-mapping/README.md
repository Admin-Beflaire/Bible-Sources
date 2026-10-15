# Verse-mapping index — work in progress

The pinned native-reference inventory is complete. Actual cross-source mapping is proceeding book by book from Genesis. This is **not a complete cross-source map** and is **not loaded by study tools**; systematic manuscript comparison remains inactive.

The first [Genesis checkpoint](../../development/verse-mapping-progress.md) contains **3,390 edition correspondences**. WLC↔UXLC and WLC↔TAHOT cover all 50 chapters; Greek review covers 1–11 and 35. Ten opening DSS records have separate physical/editorial dispositions. [book-progress.json](book-progress.json) records exact per-pair coverage and the next unfinished reference.

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

Continue Greek Genesis at chapter 12 and DSS at the annotated Genesis 1:4 physical records, then proceed through the remaining corpus. Record unresolved spans, unavailable sources and book-specific literary forms explicitly. Missing coverage is not a manuscript omission.

Dataset terms remain those in [ATTRIBUTION.md](../../ATTRIBUTION.md), including the DSS source's **CC BY-NC 4.0** condition. Original source texts, the pinned source profile and the live study sequence are unchanged.
