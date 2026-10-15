# Verse-mapping progress

Checkpoint: 15 October 2026. Source pin: `054a5226027deb13827a04a6e68c56cbd3702f37`. Inventory complete; cross-source alignment incomplete. Development data only; systematic study comparison remains inactive.

| Genesis source pair | Mapped WLC verse extents | Coverage | Next work |
| --- | ---: | --- | --- |
| WLC/OSHB ↔ UXLC | 1,533 / 1,533 | All 50 chapters | Same Leningrad manuscript, not independent witnesses |
| WLC/OSHB ↔ TAHOT | 1,533 / 1,533 | All 50 chapters | Preserve Qere/X status and the 31/32 renumbering |
| WLC/OSHB ↔ Brenton Greek | 328 / 1,533 | Chapters 1–11 and 35 | Continue at Genesis 12:1 |
| WLC/OSHB ↔ individual DSS records | 10 / 842 physical records inspected | Opening 1:1–3 only | Continue at the annotated Genesis 1:4 physical records |

The edition layer has **3,390 correspondences**: **3,029 text-verified** by unique full-verse Hebrew consonants and **361 individually model-reviewed** from source wording and boundaries. Eleven historical pilot records remain for provenance; duplicate Genesis pilot edges are suppressed in lookup. Two Psalm examples remain outside the Genesis batch. Correspondence does not assert identical wording, one-to-one clause boundaries, an independent witness or a preferred reading.

DSS dispositions are separate: six partial physical links, three reconstruction-only references and one provisional attribution (the short 4Q8d opening-word fragment). Preserve scroll, fragment, line, record ID, raw source-byte evidence, sign-slot uncertainty and reconstruction. The remaining 832 indexed Genesis records still need review. Neither reconstructed wording nor a matching modern annotation establishes surviving text.

Notable boundary cases already encoded:

- WLC Genesis 32:1 ↔ TAHOT 31:55; WLC 32:2–33 ↔ TAHOT 32:1–32.
- Genesis 1:6–7: the fulfillment clause crosses the Hebrew/Greek verse boundary; use a two-to-two block.
- Genesis 10:27–28: the Obal/Eual name crosses that boundary; use a two-to-two block.
- Genesis 11:12–13: Greek inserts Kainan within the genealogy; preserve the expanded block and differing ages.
- Hebrew Genesis 35:16 + 21 ↔ Greek 35:16: the tent/tower episode is relocated; absence of a separate Greek 35:21 record is not absence of that material.

Rebuild/check and lookup instructions are in [the index README](../indexes/verse-mapping/README.md). The machine-readable [book progress](../indexes/verse-mapping/book-progress.json) retains per-pair coverage, unresolved references, physical-review dispositions and shard paths. Resume from the earliest unresolved reference; do not restart completed chapters or silently promote matching labels.
