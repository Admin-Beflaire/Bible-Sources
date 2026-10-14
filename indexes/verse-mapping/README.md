# Verse-mapping index — development pilot

This index inventories the pinned corpus's native references and starts reviewed cross-edition correspondence. It is **not a complete verse map** and is **not loaded by study tools**. The systematic manuscript/translation-variance delivery part remains inactive.

`manifest.json` records exact coverage, source revision, artifact hashes, pilot count and open work. Five `native-*.json` files preserve the exact native book/chapter/verse labels of WLC/OSHB, UXLC, TAHOT, Brenton Greek and SBLGNT, including edition-only books, headings and suffixed labels. They reference the already pinned chapter index rather than copying source texts. `native-DSS-2.0.1.json` registers all pinned DSS physical-record TSV indexes, their hashes and coverage/reconstruction counts. The original TSV rows retain scroll, fragment, line, record, reference annotation and source-span pointers; their reference annotations are not reviewed alignments to another edition.

`pilot-relations.json` compiles the explicit [review records](../../development/verse-mapping-pilot.json). The initial eleven correspondences cover Genesis 1:1–3 from WLC to UXLC, TAHOT and Greek, plus two Psalm correspondences with different numbering. They were inspected by the model against the exact pinned wording and boundaries; **no human review is claimed**. Each endpoint has chapter-byte-span provenance, record IDs and a digest of the retrieved wording. The claim concerns corresponding verse extents, not identical readings or independent manuscript votes. Preserve the shared Leningrad identity of WLC/UXLC.

From the repository root:

```bash
python3 plugins/canonical-scripture-study/scripts/verse_mapping.py build
python3 plugins/canonical-scripture-study/scripts/verse_mapping.py check
python3 plugins/canonical-scripture-study/scripts/verse_mapping.py lookup --dataset wlc-4.20-oshb --book Ps --chapter 23 --verse 1 --target-dataset LXX-GRCBRENT-20260408 --target-book PSA
```

Build/check use local, hash-verified pinned data and require no network access. Check reconstructs every artifact and compares exact bytes. Lookup verifies artifact integrity and source-profile identity. Reviewed pilot relations can cross native chapter/verse numbers. An unmatched same-label candidate is explicitly unreviewed; it is not verified equivalence. A missing native record is not a manuscript omission. DSS physical-record lookup remains through its existing TSV/source access, not the verse lookup command.

The review format uses ordered lists of exact native references on each side, allowing split, merged, partial and reordered extents to be documented without inventing one-to-one equivalence. Such complex relations still need actual source review; structural support does not establish their historical correctness. Do not extrapolate Psalm offsets or other pilot mappings across unreviewed material.

Next work: review coverage book by book, resolve numbering/heading differences, document split/merged/reordered and partial relations, investigate longer/shorter literary forms, and verify DSS reference annotations against the physical records while preserving reconstruction. Record unresolved relations and source gaps explicitly. Complete and review this work before enabling systematic comparison in a study.

Dataset terms and attribution remain those in [ATTRIBUTION.md](../../ATTRIBUTION.md), including the DSS source's CC BY-NC 4.0 condition. This development work changes no original source text or source access policy.
