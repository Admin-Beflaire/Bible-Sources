# Development decisions

> **Retired MCP services — 30 October 2026:** The private and public Study Workers have been decommissioned. Their server code, deployment/package configuration and MCP adapters were removed under [cleanup #6](https://github.com/Admin-Beflaire/Bible-Sources/issues/6). Sources, indexes, knowledge, provenance, research records and offline source/mapping tools remain. Earlier hosting/install/release instructions below are historical; retired files remain in [the pre-cleanup revision](https://github.com/Admin-Beflaire/Bible-Sources/tree/b90bcb02802cc96ecfa661ffbf125277af1a7d7d). Do not redeploy the retired services.


## Complete Genesis Work observation — 14 October 2026, 20:20 CEST

The supplied final part completes the four-part Genesis 1:1–2:3 output, with a reported 1m31s and a correct next-passage suggestion. Its narrative development, explained textual relationships, Christ/Spirit synthesis and formation are already present and should be preserved. The coverage design should make them consistent rather than characterize them as absent. The main content addition is organized word-study/reference support; keep the initial translation workflow intact. Existing internal-rule/publisher-presentation drafts remain unreleased, and progress timestamps remain an open issue.

The four reported durations sum to 5m14s, excluding waiting between turns. This is an exploratory observation, not a speed benchmark or verified Chat/Work difference. The final retrieval total is consistent with the named ranges, but the supplied UI/diagnostics do not constitute a complete backend trace. Final next-passage execution and Chat remain unobserved. Details are in the [host observation](host-observation-genesis1-2026-10-14.md). No release or runtime change accompanies this record; manuscript variance retains its mapping prerequisite.

## Full-study coverage from the original studies — proposed — 14 October 2026

Inspected the versioned Theology 1.4.2 project source and the nine Theology/Christology/Pneumatology main, exegesis and reference source/site pages. The [coverage design](full-study-reference-design.md) records the four original layers: concise statements, readable biblical explanation, detailed textual/canonical analysis, and supporting reference material. The website combines the first two; newer original papers govern their content. This is structural review, not complete doctrinal-profile import or validation of every source assertion.

Make source-language/contextual analysis, historical comparison, narrative development, intertextual evidence and Christ/Spirit integration explicit in later Full parts. Conclude with relevant word studies, explained key passages/tables, necessary abbreviations and actual sources, preserving the initial primary-source translation and concise notes. Existing rendering alternatives differ from manuscript variants; the new systematic manuscript section remains dependent on the full mapping index. Coverage is proposed only: no runtime, stage, version or deployment change.

## Future manuscript/translation-variance section — planned only — 14 October 2026

Add a separate section for translation variance across manuscripts after a full verse-mapping index has been built for the supported source corpus. This dependency is explicit: do not implement or activate the new section now. Keep the current primary-source working translation and notes first; the user values its observed speed. Proposed placement is immediately after that first section and before local explanation. Depth/focused-command defaults will be settled with the later feature rather than changing them now.

The future comparison should identify actually aligned readings, their sources, meaningful translation effects, evidence and uncertainty. Distinguish a manuscript from its modern editions/transcriptions and from a translation tradition; do not count WLC and UXLC as independent manuscripts. Keep native references and provenance, handle split/merged/reordered spans, and distinguish absent coverage from a verified textual omission. A complete index must make unresolved relations and source gaps explicit rather than asserting equivalence from matching verse numbers.

Preserve source restrictions and the initial translation's supported alternatives. If later evidence warrants a revision, identify the affected rendering and explain it rather than silently replacing it. Future staged delivery must also preserve continuation correctly when a new section is inserted; do not reinterpret old numeric stage indices silently. No mapping implementation, new tool, version bump or deployment is included in this planning decision.

## Scripture-focused presentation — prepared locally, not deployed — 14 October 2026

The reader sees Scripture, source evidence, meaningful alternatives and uncertainty. Apply study instructions silently in progress messages, translation notes and explanations; do not narrate plugin rules, reviewed policy, skills, prompts, schemas or instruction compliance. Describe scope through the literary account and give a useful Next title without explaining internal routing. Explicit software/method questions can receive direct technical answers. Enabled Preview diagnostics retain actual operations and metrics; they do not become commentary on rules. This shared runtime rule is intended for all study modes and any later explicitly authorized Production/public release.

The supplied Work first-part output used the intended 34-verse unit, preferred opening and natural Genesis 1:30 prose, paragraph notes, a timestamp/footer, source attribution and correct Next title. It also exposed internal rules in progress text and reviewed policy in footnote 1; progress timestamps were missing. Reported Worked for: 46s, exploratory and not a controlled Chat/Work comparison. Remaining parts and Chat behavior are not yet verified. Prepare/test the presentation correction locally and keep live Preview 0.1.17 fixed during the current host test.

## Secondary research in study prose — prepared, not deployed — 14 October 2026

Use BibleProject and other appropriate secondary research to inform an independent explanation in the host's own wording. Develop the argument from biblical and historical evidence, attach meaningful uncertainty and counter-evidence to the interpretation, and credit actual sources through citations, footnotes or a compact Sources consulted list. Do not turn ordinary studies into reports of what a publisher says or critiques of that publisher; direct comparisons/reviews belong to explicit requests. Preserve quotation attribution and distinctive sourced proposals. This is a presentation rule, not permission to copy wording, conceal attribution or adopt unsupported claims.

The next Work outputs retained Genesis 1:1–2:3 and the proper part sequence: local explanation (55s) and historical-cultural context (2m2s). The historical output includes useful primary-text comparison and sanctuary connections, but makes BibleProject's claims and their evaluation a visible subject. The user accepts the remainder and requests integrated source use. Canonical synthesis, final continuation and Chat behavior remain under test. Keep this and the internal-rule correction unreleased while that test continues.

## Release boundaries — 13 October 2026

Private Preview is the development target. Production remains 0.1.10 and the public/video server remains 0.1.11 until explicit promotion. Public directory publication and automatic public builds remain on hold. Only main and preview are permanent branches. See [release status](release-status.md) for verified deployments.

## Translation delivery — implemented, tested and deployed in private Preview 0.1.16

Deliver translation and numbered consequential footnotes first. Research later study parts separately and continue with Next. Keep the returned part sequence; Ready is preparation for host output, not proof of delivery. The server cannot observe final-character or client-rendering completion.

Remove check_handoff from the private Preview tool list and routine stage-envelope instructions. Keep the legacy validator in the regular Python/private/public interfaces. Source integrity, coverage, grammatical review and strict reading-selection evidence checks remain required. An attested base retained with a factual alternative footnote does not require evaluate_reading.

Use metadata-only Preview planning and a concrete retrieval_plan. Inspect dependent openings after retrieving the active passage; retrieve permitted preceding discourse when needed. Bundle the active skills and translation key once. Reuse checked evidence and established wording links; refine a main rendering once, reopening only a consequential unresolved or inconsistent choice. Named edition/detail schemas reduce invalid calls.

Source restrictions govern retrieval while retaining the translation key, English default, scope and continuation. Retain restrictions in client-carried delivery state through Next, Resume and Next passage. A WLC-only request does not load excluded editions, secondary records or external sources. These are host retrieval contracts; stateless tools cannot police all calls made elsewhere by a host.

Ordinary studies use the supported enclosing literary unit (Genesis 1 → 1:1–2:3), while exact ranges and focused translation scopes remain authoritative. A source restriction changes evidence access, not this policy.

Prefer Genesis 1:1 “In the beginning God created…” and footnote the meaningful temporal alternative “When God began to create…”. This supersedes the composite-opening preference. Preserve the established Genesis–John wording connection without routine re-retrieval; John's Greek does not determine Genesis's Hebrew grammar. Preserve meaningful differences rather than forcing harmonization.

## Observable diagnostics

Private Preview reports request-local tool metrics, a correlation ID, actual edition/record counts and failures, and real Amsterdam server clock checks. Error results also carry a clock. Reuse a freshly returned clock for progress instead of making a redundant clock call. Label a pre-output footer Last server check. A supported post-output check is labelled Server check after output; neither is an exact rendering-completion measurement. Do not disclose hidden reasoning or log prompts, arguments, identities or source text.

## Request and output recovery — implemented, tested and deployed in private Preview 0.1.17

The 13 October 0.1.16 Genesis 1 host check exposed a reproducible planner failure for “Give me the full study of genesis 1”. The sampled initial operation trace showed unknown_book, a router-document read and then direct source retrieval, without a successful active plan before that retrieval. The supplied output had complete translation and verse-linked markers, but lacked visible clocks/diagnostics, used expanded heading-per-note discussions, changed stage titles and retained “living life” in Genesis 1:30. Its opening rendering was correct. Sampled logs do not establish a complete host call count or the absence of every later Ready call.

Normalize recognizable English/Dutch request phrasing around documented commands in Preview only. Preserve the requested passage and options; never guess a book or silently repair ambiguous scope. Genuine errors or missing input must lead to repair/clarification and a successful planner retry, not a router read or direct fetch. Return this requirement explicitly in error results and instruction reads. This remains a host contract; no stateful cross-call enforcement or new routine validation step is introduced.

Return the concrete active output layout at planning and refresh it at Ready: actual timestamp, H2 heading, consulted edition identity, concise numbered paragraph notes, compact observed diagnostics and exact continuation label. Preserve consequential alternatives; defer extended anthropology, doctrinal arguments, historical surveys and full word studies to their own parts. Reinforce contextual Genesis 1:30 wording without imposing one fixed nephesh gloss. Source labels describe the actual dataset (including Brenton Greek Septuagint), preserve all original evidence, and make no alignment claim.

Regression and live contract checks passed for these mechanisms, including the exact original request, active translation key, error recovery, actual edition labels, refreshed Ready layout and retained Next preferences. A fresh host study must still establish visible delivery, wording, note length and client behavior. No host-speed improvement is inferred from the new exploratory 1m16s display.

## Performance evidence

The user-reported Worked for times (6m10s full-study first part, 3m42s comparison translation, 1m56s WLC-only) are exploratory, with insufficient controls for an improvement claim. Local before/after replays measure runtime overhead only. Controlled host runs must hold prompt, scope, language, format, model, client and debug setting constant within each scenario. See [benchmark protocol](benchmark-protocol.md). Cross-edition mapping follows delivery evaluation.

## 0.1.18: preserve observed delivery, add reference support and start mapping

Implement the authorized fixes after the complete four-part 0.1.17 Work observation. Apply internal study guidance silently and integrate useful secondary research into independent Scripture-grounded explanation, preserving credit and warranted limits. Reinforce timestamp-first orientation/progress through concrete plan layouts and every returned clock; this is a host instruction, not rendering enforcement.

Adapt the original Theology 1.4.2 and Theology/Christology/Pneumatology exegesis/reference structure proportionately. Full passage/exegesis work develops consequential language locally and explains narrative, intertextual, Christ/Spirit and theological arguments. Append useful reference material within the existing final part, bundling both exegetical and theological guidance. Reuse evidence and established renderings; explain warranted revisions. Do not delay first translation, refetch to fill tables, invent lexicon consultation or force the appendix onto focused/Standard/Detailed requests. The four-part state schema remains compatible.

Start verse mapping as an offline development artifact, outside the pinned source profile and live retrieval path. Inventory the exact native labels and all DSS record indexes; retain model-reviewed pilot relations with byte-span provenance and reading digests. Ordered endpoint lists permit complex extents, but structural support and equal numbering do not certify correspondence. Keep model review distinct from human review, manuscript identity distinct from edition identity, and unresolved annotation distinct from omission. All remaining correspondences and DSS physical-reference review are open. Systematic comparison stays inactive until the full map is reviewed.

Release only to private Preview. Preserve Production/public versions, source pin, authentication, rate limits and public watch-path suspension. Record actual build and live checks after deployment; local tests and a fresh-context model example do not prove real host behavior or speed.

Private Preview 0.1.18 is deployed from `ed17c19dc0361363271c0dd35b861695e5d58c84`; build `5d2499f5-e3db-439e-be41-f6668a511daa` succeeded at 19:07:24.303Z. Health and live contracts confirm the version, progress/reference guidance and retained continuation. Production remains 0.1.10; public connector health remains unavailable and automatic public builds remain suspended. Fresh host output remains unverified. See [release status](release-status.md).

## Book/chapter verse mapping — 15 October 2026

Continue actual mapping from Genesis rather than adding more pilot-only scaffolding. Search the entire target Hebrew book for a unique, nonempty full-verse consonantal sequence; remove pointing, punctuation and segmentation only in the derived comparison key, leaving original source bytes untouched. Require at least twelve letters and uniqueness in both books. Automatically exclude Qere/Ketiv-marked UXLC verses and non-L TAHOT records, including editorial X additions. These cases and short verses need explicit source review. Label reproducible equality as text_verified; reserve model_reviewed for actual individual inspection. Neither status decides textual priority or independent manuscript identity.

Record grouped extents for moved clauses, names and expanded genealogies, and noncontiguous extents for reordered material. Preserve the TAHOT Genesis 31/32 chapter shift. Compile chapter shards with exact record IDs, reading hashes and shared chapter-byte provenance; lookup handles either native endpoint and suppresses duplicate historical pilot edges. Do not infer transitive mappings or extrapolate unreviewed offsets.

DSS has a separate physical-record layer, keyed by scroll and record ID, with fragment/line and original modern reference annotation retained. Read actual hash-verified transcriptions and sign annotations. Classify partial physical support, reconstruction-only reference and provisional attribution separately. Fully reconstructed wording cannot corroborate surviving text; an unmarked glyph has not thereby been independently verified from a manuscript image. Do not turn slot counts into a claim that a whole biblical verse survives. Keep CC BY-NC 4.0 attribution.

This batch changes offline development data/tools only. The pinned source profile, study instructions, Worker runtime/version, authentication, endpoints and public build suspension remain unchanged. Systematic manuscript comparison stays inactive. [Progress](verse-mapping-progress.md) records exact coverage and next work.

The next source-review batch extends Greek Genesis through chapter 20 (plus the already reviewed chapter 35), adding grouped extents at 17:3–4, 19:16–17 and 19:18–19. Explicitly retain unequal verse wording and lists, including Greek payment additions and pronoun/name differences; a mapping is not a harmonized translation or full apparatus. Update the exact continuation point to Genesis 21:1. DSS review remains separately checkpointed at its first unreviewed Genesis 1:4 physical record.

## Genesis DSS milestone execution — 15 October 2026

Implement the existing physical-record schema without redesign. Use the next unreviewed chapter/verse/scroll/record inventory entries, preserving local physical sequence, in approximately 40-record milestones with an intermediate checkpoint near 20. A completed review may remain provisional or reconstruction-only. Completion counts reviewed dispositions, not confident whole-verse alignment. The milestone 1 source pin remains `054a5226027deb13827a04a6e68c56cbd3702f37`; 642 / 842 are reviewed and 200 remain. Greek Genesis extent mapping is already complete, superseding the earlier chapter-21 continuation above.

Keep corrected and removed sign features explicit alongside rec/unc status. In this batch, isolated/common endings and uncertain-only openings do not establish the annotation; record the uncertainty rather than promoting it from a matching verse label. Publish only forward-moving `preview` commits. Keep this index development-only; runtime integration, Production/public deployment and other books are outside this assignment.

## Genesis DSS milestone 2 — 15 October 2026

Continue the same physical-record schema and model-review method. Preserve transcription differences even in a partial correspondence: additional ה before אף in `4Q10 / L1593333-R001`, and the plural kinds suffix in `6Q1 / L1602886-R002` against WLC's singular suffix. Do not promote a repeated noun such as מלאכתו, an isolated place expression such as ממצרים, or a single uncertain letter into a confident verse attribution. Physical line 0 and composite fragment labels remain unchanged.

Milestone 2 adds 40 reviews and reaches 682 / 842, leaving 160. Resume at `8Q1 / L1603102-R001` (Genesis 17:13). The prior 642 reviews and completed edition maps remain unchanged; the source pin, runtime comparison gate and deployment settings remain untouched.

## Genesis DSS milestone 3 — 15 October 2026

Preserve cor=3 correction status in the Genesis 18:25 `8Q1 / L1603112-R002` record; its largely reconstructed corrected phrase is not an unqualified original reading. Preserve the extra unmarked את in the Genesis 22:14 naming sequence (`1Q1 / L1589613-R001`) rather than silently harmonizing it with WLC. A complete repeated name, common doing verb or isolated numeral may still leave the attribution provisional when the distinctive context is reconstructed.

Milestone 3 reaches 722 / 842 from 40 new reviews (6 partial physical, 16 reconstruction-only, 18 provisional). The next unreviewed record is `1Q1 / L1589621-R002` (Genesis 24:23), with 120 remaining. The prior 682 reviews and edition maps are preserved. No source-pin, runtime, deployment-setting or publication change.

## Genesis DSS milestone 4 — 15 October 2026

Retain source-transcription differences without silently resolving their origin. The unmarked פנות in `4Q6 / L1593182-R001` differs from WLC בנות; no manuscript-image inspection establishes whether this reflects the witness or an export issue. The 4Q12 well narrative's אחרית / לוא and uncertain final י after יט also remain explicit. A distinctive payment-unit noun can support a partial lexical correspondence while a reconstructed amount remains unattested; an isolated generic amount can still have provisional verse placement. Heavily uncertain altar letters are never presented as unmarked wording.

Milestone 4 adds 40 reviews (12 partial physical, 15 reconstruction-only, 13 provisional), reaching 762 / 842 and leaving 80. Resume at `2Q1 / L1592441-R001` (Genesis 36:6). Earlier reviews, edition maps, source pin and runtime/deployment settings are preserved.


## Finish Genesis — bounded 20-record continuation, 15 October 2026

The user replaces the earlier approximately 40-record schedule with exactly one 20-record milestone per turn. Report progress at the start, after ten, after twenty, and after validation; commit once, verify remote HEAD once (at most one recovery), then stop with a final report. Continue only on “Next milestone”. A separate final verification follows all 842 dispositions.

Continuation milestone 1 starts from verified preview `691e16379258df0e25c2db4ddd436a67a743a922` and adds 1 partial physical, 11 reconstruction-only and 8 provisional reviews, reaching 782 / 842 with 60 remaining. Resume at `4Q3 / L1593099-R002` (Genesis 40:21). Short repeated names, function words and isolated letters retain provisional placement; restoration never becomes surviving support. Earlier reviews, edition maps, source pin, runtime gate and deployment settings are preserved.


## Finish Genesis milestone 2 — 15 October 2026

Continue the bounded 20-record workflow from verified preview `bd07178994ce53159a7f927b96458c1dfbb79f2e`. Added 10 partial physical, 8 reconstruction-only and 2 provisional reviews, reaching 802 / 842 with 40 remaining. Resume at `4Q3 / L1593109-R002` (Genesis 41:8).

Preserve the Genesis 41:7 transcription's ותבלען ending, additional blighted modifier and הבראות spelling alongside the WLC anchor, with per-letter reconstruction and uncertainty explicit. Local physically supported sequence can establish a partial correspondence without making every uncertain or reconstructed letter secure. Short repeated role/river wording remains provisional. No source, runtime, deployment-setting, publication or comparison-delivery change.


## Finish Genesis milestone 3 — 15 October 2026

Continue the bounded 20-record workflow from verified preview `75d6f33bfe5605f79995f146b06bbd016451f1c9`. Added 13 partial physical, 4 reconstruction-only and 3 provisional reviews, reaching 822 / 842 with 20 remaining. Resume at `4Q6 / L1593186-R002` (Genesis 48:3); final verification follows that review batch separately.

Preserve 4Q3's cross-record cor=3 span, Mas1's unmarked את יעקוב versus reconstructed אביהם, and 4Q6's overlapping alt/rec flag without flattening them into ordinary surviving text. Local physical sequences can support partial mappings; repeated isolated names and predominantly insecure message fragments may retain provisional references. Preserve source wording and explicit uncertainties without forcing WLC harmonization. No source, runtime, comparison gate, deployment-setting or publication change.


## Finish Genesis milestone 4 — 16 October 2026

From verified preview `2a6ad998edf1ea205fbcf052ecbc1532d95c01c1`, the final 20-record batch adds 16 partial physical, 1 reconstruction-only and 3 provisional reviews. All 842 indexed Genesis DSS identities have dispositions; no unreviewed record remains. Completion of this inventory review does not mean every record has a confident physical alignment. Keep the existing physical-alignment/comparison flags false and reserve the separate full Genesis verification/documentation milestone for the next explicit continuation.

Preserve differences in the damaged 48:6 reading, shorter transcribed 48:7/9 wording, 48:10 age term and embrace/kiss order without silently harmonizing with WLC or inferring image-confirmed manuscript omissions. Retain reconstructed alternatives and uncertainty. No runtime, source-pin, deployment-setting or publication change; do not start Exodus.


## Genesis final verification — 16 October 2026

The five-milestone continuation is complete. Preserve all 842 Genesis DSS reviews, the 365 / 234 / 243 disposition split, completed Hebrew/Greek edition maps and source pin. The reviewed-record scope metadata now accurately describes all Genesis records, with no change to individual review objects. The final evidence is recorded in [verse-mapping-genesis-verification.json](verse-mapping-genesis-verification.json).

Inventory completion means every physical identity received a source-bound disposition; it does not promote provisional or reconstruction-only references to physical support. Keep confident physical-alignment and comparison-delivery flags false, leave runtime integration inactive and stop after Genesis. Final verification passed build/check, 58 Python tests, 35 Worker tests and 1,956 parity cases, complete source/anchor hash and identity checks, and edition forward/reverse lookups. Read-only Cloudflare checks confirm Production/public deployments still date to 12 October and the public manual-only build path remains intact; public health remains unavailable. No promotion, deployment, publication or host-performance claim.


## Preview-only Genesis index consumer — 16 October 2026

The user explicitly authorizes runtime use of the completed Genesis index, superseding the earlier development-only restriction for private Preview Genesis retrieval. Keep other books, Production/public behavior, source pin, authentication and the four-part study sequence unchanged. Do not enable the additional systematic comparison-delivery section.

Build fifty hash-verified chapter assets from the reviewed manifest, retaining a separate index fingerprint alongside corpus provenance. Retrieve selected editions by reviewed native extents and verify reading hashes. Keep grouped target context distinct from requested translation scope; preserve native record order. Return reviewed DSS physical identities and dispositions without promoting reconstruction/provisional references. WLC-only requests need no alignment assets or extra witnesses. Index/review source records are not rewritten; the prior final audit remains a dated offline checkpoint.

Preview 0.1.19 deployed from `513c72f9989cc7a722c2b56ba926df2e729ea933`; successful build and live mapped-retrieval checks are recorded in [release status](release-status.md) and [the live evidence](preview-genesis-index-live-2026-10-16.json). Production/public deployments remain unchanged.


## Released-version feature parity — 16 October 2026

A common numeric release version must expose the same study/retrieval feature contract on private Preview, authenticated Production, and public/video. Authentication, rate limiting, public routing and optional channel-specific deployment diagnostics may differ, but staged Full-study delivery and reviewed Genesis mapping must not silently differ. Preview-only future features require an explicitly distinct prerelease version/build label until promoted. This decision does not override the public manual-release gate or constitute evidence of host-model delivery quality.


## Contextual interpretation and evidence development — 16 October 2026

For Preview 0.1.20, independently discover serious text-grounded interpretations and develop each strongest defensible case, language/context support, substantial objections and unresolved premises. Do not assign percentages, likelihood labels, rankings or a preferred interpretive winner; do not manufacture equal evidence. State direct textual assertions clearly. Distinguish direct statement, contextual inference, historical reconstruction, speculation and canonical synthesis; assess cumulative evidence without demanding each observation prove the whole case. The reader weighs the evidence and exercises spiritual discernment.

This milestone supersedes the runtime instruction to prefer the owner's framework. It introduces no replacement framework. Future owner-directed theological synthesis remains separate. A working translation still chooses one defensible main rendering with meaningful alternatives in numbered notes. Textual witness evaluation remains distinct from interpretive-case presentation. Systems are evaluated fairly when explicitly requested; they are not automatically inserted as passage alternatives.

Research is active-part and question-bound. Local exegesis may check necessary historical premises rather than deferring the basis of an interpretation until after presenting it. Later history develops remaining questions without repeating research; canonical synthesis retains unresolved premises. Standard/Detailed have no default external survey, but consequential ambiguity permits bounded primary/academic research. Conditional source ceilings are two/three/six for Standard/Detailed/Full, twelve entries and 16,000 excerpt characters. These host guidance ceilings never override source restrictions. Cultural evidence requires relevant dating/place and direct/analogous/speculative classification. Inspect sources before attribution; unavailable sources remain explicit gaps.

The Worker provides verified sources and reusable contracts, not model inference or external academic search. The [development-only acceptance criteria](interpretation-acceptance.json) must never be inserted into runtime prompts or data. Neutral host studies in fresh conversations are required to establish discovery quality. Local tests/live contract probes and controlled local retrieval replays establish only their measured contracts and overhead. No host-speed or interpretive success claim is authorized by passing unit tests. Preserve Preview-only release, corpus pin, authentication, Genesis mapping, diagnostics, Next and Public's manual-release policy.


## Curated word-study availability in Full studies — 18 October 2026

The 0.1.20 Full-study host response incorrectly reported no separately completed study for *ruach* and *tselem*. Connected Preview 0.1.20 lookup_word returned WT010 for 'ruach'; WT043 (*Image, glory, form, exaltation*) for 'image', 'beeld' or H6754, but 'tselem' and Hebrew-script spellings were unmapped aliases. The lack of a separate term-titled monograph does not mean the existing theme-hub record is unavailable.

For Preview 0.1.21, preserve existing 50 records and source pin; add direct aliases for both original-language terms and guide local-explanation stages to check targeted curated coverage before claiming it absent. "Not consulted" and "no curated entry" are distinct. Do not prefetch all 50 studies, turn passage exegesis into 50 exhaustive word studies, or claim software checks verify that a host will use the lookup. Live source lookup, deployment and a fresh host study must be reported separately.
