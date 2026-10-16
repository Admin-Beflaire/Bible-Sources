# Release status

## Verified before changes — 13 October 2026, 20:48 CEST

| Channel | Live version | Branch | Evidence |
| --- | --- | --- | --- |
| Private Preview | 0.1.14 | preview (`a187c463b00f413f6e27450ee9dcfb44324d1ee1`) | Connected MCP study_health: 2026-10-13T18:48:19.725Z. |
| Private Production | 0.1.10 | main (`fed918d04ca9975e93e4fd72e6861b8481948639`) | Connected MCP study_health; Cloudflare active deployment unchanged since 12 October. |
| Public/video server | 0.1.11 | Separate public build from preview | Connected MCP study_health; public build trigger watch path remains `__manual_public_release_only__/**`. |

Source pin for all three: `054a5226027deb13827a04a6e68c56cbd3702f37`. Cloudflare confirms Preview auto-build enabled. Public auto-build is suspended through the watch path; the build configuration's auto_build_enabled flag alone does not indicate publication is active.

## Preview 0.1.16 — implemented, tested and deployed

Implemented: Preview handoff-tool removal; metadata-only planning; named retrieval contracts; retained source restrictions; one main translation and the Genesis 1:1 correction; request-local observable diagnostics and honest clock labels.

Tested: 39 Python tests, 29 Worker tests, and 1,956 Python/Worker parity cases passed. Private/public Wrangler dry runs passed (packaging checks only; no deployment). Local retrieval replay results are stored under [benchmarks](benchmarks/), with no host-model or end-to-end speed claim.

Deployment: private Preview only, verified below. Production/public promotion is not authorized. Host wording, timing and UI behavior await controlled fresh-conversation checks. See [backlog](backlog.md) and [decisions](decisions.md).

## Concurrent verified update — 13 October 2026, 21:07 CEST

While this candidate was being prepared, Preview advanced to **0.1.15**, commit `7daf29fc99125718a238dfaf61580c9ee8edd30a`. Cloudflare build `e128792b-a0d9-4e83-a532-a311b171dc93` succeeded at 18:57:13Z; connected study_health confirmed 0.1.15 at 19:07:39Z. Its release and single-witness changes are preserved. The combined release is **0.1.16**, rebased onto that source, and retains compatibility with 0.1.15 delivery state.

## Current verified deployments — 13 October 2026, 21:16 CEST

| Channel | Live version | Release evidence |
| --- | --- | --- |
| Private Preview | **0.1.16** | Source commit `1a6897321b71a315991c5fdc772e890e32347645`; successful Cloudflare build `65edd743-8db0-407b-ac84-7a8ee7d220f0`, stopped at 19:15:33.586Z; study_health at 19:16:09.741Z. |
| Private Production | **0.1.10** | Connected study_health rechecked after Preview deployment; main remains `fed918d04ca9975e93e4fd72e6861b8481948639`. |
| Public/video server | **0.1.11** | Connected study_health rechecked after deployment; public watch path remains `__manual_public_release_only__/**`, public previews disabled. |

Live contract checks: WLC-only Full Genesis 1 selects Genesis 1:1–2:3, retains the active translation key and exact main-rendering rule, and reports zero planner asset reads/cache hits. Its returned retrieval call supplies 31 WLC records for chapter 1 plus three for 2:1–3. Ready reports awaiting_host_output and output_completion_observed=false, with the correct next title. Next stays on the passage's local-explanation part; Next passage advances to Genesis 2:4–25 while retaining WLC. An exact translation keeps Genesis 1:1–3. Request-local diagnostic IDs, clocks and record counts are present.

These are live server-contract checks, not a generated translation quality assessment, a client UI test or a controlled host performance benchmark. Documentation-only follow-up commits may rebuild the same 0.1.16 runtime; the release source and verification above remain identified explicitly.

## Verified before 0.1.17 changes — 14 October 2026, 08:41 CEST

Connected study_health rechecked private Preview **0.1.16** at 06:41:36Z, private Production **0.1.10**, and public/video **0.1.11**. Preview branch head was `ee11faece9033d03825a5f2a00feba5c55b5ab51`; main remained `fed918d04ca9975e93e4fd72e6861b8481948639`. Cloudflare confirmed private automatic Preview builds enabled and public automatic publication still suspended by `__manual_public_release_only__/**`, with public previews disabled. The pinned source revision is unchanged.

## Preview 0.1.17 — implemented, tested and deployed privately

Fixes the reproducible conversational planner failure, supplies explicit planner recovery, returns concrete active output layouts from planning and Ready, reinforces natural Genesis 1:30 working prose, and identifies actual returned editions. The regular parser and source evidence are preserved. No additional routine validation call, public deployment or Production promotion is included.

Local checks passed: 39 Python tests, 34 Worker tests, 1,956 Python/Worker parity cases and private/public Wrangler deployment dry runs (packaging only). Conversational routing tests also exposed and fixed a trailing-comma error when retaining language options. Rechecked at 06:59:18Z before release: Preview 0.1.16, Production 0.1.10, public 0.1.11; public watch-path suspension and disabled public previews remained intact.

### Deployment and live contracts — 14 October 2026, 09:06 CEST

| Channel | Live version | Evidence |
| --- | --- | --- |
| Private Preview | **0.1.17** | Release commit `3bfb59bbedc8f202fe0d5b27c615b526bff8a227`; successful Cloudflare build `1589e3f4-dc30-4349-ab7f-8ce6fdb259bf`, stopped 07:03:31.030Z; connected study_health at 07:04:23.013Z. |
| Private Production | **0.1.10** | Connected study_health rechecked after deployment at approximately 07:05:10Z; main unchanged. |
| Public/video | **0.1.11** | Connected study_health rechecked after deployment at approximately 07:05:10Z; public automatic build suspension preserved. |

The exact prompt `Give me the full study of genesis 1` now returns Full Genesis 1:1–2:3, English/plain format, three active instruction documents including the translation key, zero planner asset reads and the concrete translation-part layout. An unknown-book fixture remains an error with can_retrieve=false, explicit planner-retry guidance, a clock and observed failure diagnostics. The router document explicitly cannot replace a successful plan.

Source fixtures retrieved 34 WLC records across Genesis 1:1–2:3 and three records each from WLC/Brenton Greek for an explicit exact Genesis 1:1–3 comparison. Returned edition labels and aggregate counts match actual datasets; alignment remains unverified. Ready refreshed first_line and Last server check to its actual 07:05:34.036Z clock, retained the exact next title, and reported output completion unobserved. Next returned local explanation on the same passage at Full depth. A separate Dutch/original-interlinear/WLC+LXX fixture retained exact scope and preferences through Next and Next passage.

These are server-contract fixtures, not a generated study, host call-count measurement, UI certification or speed benchmark. Real host delivery and performance remain unverified: refresh Preview metadata and retest the original prompt in a fresh conversation, checking natural Genesis 1:30 prose, paragraph-note length, clocks/diagnostics, edition names, exact stage titles and Next. Documentation-only follow-up commits may rebuild the same runtime; the tested release source and deployment are recorded above.

## Host observation and local presentation correction — 14 October 2026, evening

The supplied Work first-part study reports 46s and a final 18:38:01 CEST server-check label. It includes all 34 verses, the preferred Genesis 1:1 with its alternative, natural Genesis 1:30 prose, concise numbered paragraphs, source attribution, observed diagnostics and the correct Next title. Progress messages lack timestamps and narrate internal instructions; footnote 1 also describes reviewed plugin policy. This is one exploratory host observation, not a controlled benchmark or completion of the remaining study parts.

Live read-only pre-change checks at 16:48Z confirmed Preview 0.1.17 and Production 0.1.10. The public study_health call returned an internal connector error on two attempts; its last successful version verification remains 0.1.11 earlier today. Cloudflare confirms the public watch-path suspension and disabled previews are unchanged. No deployment or build configuration is changed here.

A shared Scripture-focused presentation rule is implemented locally in regular/Preview initialization, active/focused contracts and the study/translation instructions. Local verification passed: 39 Python tests, 34 Worker tests and 1,956 parity cases. Tests cover both initialization paths, the active translation bundle, Ready/Next layouts and focused plans; they do not certify generated host prose. An unattached Git source commit preserves this draft without updating either remote branch or triggering a deployment. The current live Preview release remains fixed during the user's remaining-part test. Version metadata is not bumped until this draft is included in a release. Production/public promotion still requires explicit authorization.

## Additional host observations and source-use correction — 14 October 2026, 19:22 CEST

The supplied next outputs deliver local explanation in a reported 55s and historical-cultural context in 2m2s, keeping Genesis 1:1–2:3 and the correct next title at each step. The historical output reports four additional biblical retrievals and 18 WLC/OSHB records, and lists consulted ancient-text and BibleProject resources. The user accepts the substance but asks to integrate useful research into the study rather than narrating and critiquing BibleProject. Three of four parts are observed; canonical synthesis/final continuation and Chat behavior remain unverified.

The unreleased draft is extended in the shared reader policy, exegesis/theology guidance and method reference. It preserves citations, source credit and warranted uncertainty while reserving direct publisher assessments for an explicit request. Verification passed: 39 Python tests, 34 Worker tests and 1,956 parity cases. Generated host behavior still requires a fresh check after release. Read-only checks at 17:23:54Z confirm Preview 0.1.17 and Production 0.1.10; public study_health again returned an internal connector error, so no fresh public MCP health claim is made. Public automatic publication remains suspended and public previews disabled. No remote branch update or deployment is included in this draft.

The screenshot's search summary lists 33 websites; this is not evidence that 33 pages were opened or consulted. Some expanded tool-call panels appear to show empty or incomplete arguments. The display alone does not establish backend call failure or a complete operation trace; inspect actual diagnostics before claiming every operation succeeded. These observations do not replace a controlled benchmark or a generated-study accuracy review.

## Planning update — manuscript/translation variance — 14 October 2026, 19:40 CEST

Record a future separate comparison section, dependent on the full verse-mapping index for supported sources. Preserve the initial primary-source working translation and notes. The feature, placement/depth details and mappings are not implemented; only planning documents are changed. No runtime, version or deployment change is made. Private Preview 0.1.17 and Production 0.1.10 were rechecked at 17:41Z; the public connector health call remains unavailable, with its last successful version check recorded above.

## Full-study source review — 14 October 2026, evening

Inspected the supplied Theology 1.4.2 original, the nine English main/exegesis/reference source files at canonical-theology commit `63802bd2f205b411ab4af536aed716040e667cad`, their website pages and the available unversioned Theology Library files. The [coverage design](full-study-reference-design.md) records the original layers, analytical dimensions, reference components and proposed staged Full coverage. This is documentation only: no runtime implementation, stage change, version bump or deployment. Existing presentation code drafts remain unreleased.

Read-only live checks at 17:52:39Z confirm private Preview **0.1.17** and private Production **0.1.10**. Public study_health again returned an internal connector error; its last successful version verification remains **0.1.11** above. Cloudflare confirms private Preview automatic builds enabled and public publication still suspended by `__manual_public_release_only__/**`, with public previews disabled. No remote branch or hosting configuration is changed. Documentation validation is `git diff --check`; runtime tests need not be rerun for this planning-only change. Real canonical-stage delivery remains pending in the user's current study.

## Complete Work output observed — 14 October 2026, 20:20 CEST

The user supplied the fourth part, canonical synthesis and formation, reporting **1m31s** and a **19:42:22 CEST** Last server check. It completes the same Genesis 1:1–2:3 unit and suggests Genesis 2:4–25. All four parts are now observed; actual next-passage execution and Chat remain unverified. The final output already develops narrative, intertextual, Christ/Spirit and formation coverage. The main content addition is organized reference/word-study support, alongside earlier presentation corrections and missing progress timestamps. See the [host observation](host-observation-genesis1-2026-10-14.md).

The four reported durations sum to **5m14s**, excluding waiting between turns, with no controlled benchmark claim. The final six-retrieval/57-record report is consistent with the named ranges (7 Hebrew, 50 Greek); it is not a complete independently inspected backend trace. The displayed server clock is not exact output completion.

Before this documentation update, read-only health checks at **18:20:59Z** confirmed private Preview **0.1.17** and Production **0.1.10**, retaining source pin `054a5226027deb13827a04a6e68c56cbd3702f37`. Public health still returns an internal connector error; the last successful version check remains **0.1.11**. Cloudflare confirms private Preview automatic builds remain enabled, while public publication remains suspended by `__manual_public_release_only__/**` and public previews disabled. No version, runtime, branch ref, source pin or hosting configuration changes. Presentation code drafts remain unreleased; broader Full coverage is still proposed. Documentation-only validation: `git diff --check`; no runtime tests rerun for this record.

## Preview 0.1.18 — implemented, tested and deployed privately

Read-only checks before release at **19:02:15Z / 21:02:15 CEST, 14 October 2026** confirm Preview **0.1.17**, Production **0.1.10** and source pin `054a5226027deb13827a04a6e68c56cbd3702f37`. Public study_health still returns an internal connector error; its last successful verification remains **0.1.11**. The remote preview ref remains `ab93d11a6484e715e9dd9b4387eb341e3e7bc5d6`. Cloudflare confirms private preview builds enabled, public automatic publication suspended by `__manual_public_release_only__/**` and public previews disabled.

The 0.1.18 candidate includes the previously saved presentation corrections, explicit timestamp-first progress, proportionate Full linguistic/canonical/reference coverage and both exegesis/theology guidance in the existing final part. No additional stage, state migration, source access change or systematic manuscript-comparison feature is introduced.

The offline mapping foundation inventories **106,223 native verse references** across WLC/OSHB, UXLC, TAHOT, Brenton Greek and SBLGNT. It registers all **124 DSS physical-record tables / 66,557 physical records**, including unassigned/nonbiblical material: 23,429 numeric reference annotations and 43,128 unresolved native references; 5,602 records have all letter slots reconstructed. Eleven model-reviewed pilot correspondences cover Genesis 1:1–3 against three editions and two renumbered Psalm extents. Exact endpoint evidence is retained; no human review or complete alignment is claimed. Comparison delivery remains disabled.

Validation: **47 Python tests, 35 Worker tests and 1,956 parity cases** passed, plus deterministic artifact/source rebuild, modified-skill checks and private/public Wrangler packaging dry runs. A fresh-context model composition using the exact Full final-part instructions and supplied WLC/SBLGNT packets produced term/passage/source references without internal-rule or publisher narration. Its fixture lacked the earlier working translation; an explicit rendering-continuity instruction was subsequently added and the affected suites rerun. This limited composition is not a real Chat/Work UI run or performance measurement.

Release commit: `ed17c19dc0361363271c0dd35b861695e5d58c84`. Private Preview build **`5d2499f5-e3db-439e-be41-f6668a511daa`** succeeded, stopped **19:07:24.303Z**. Connected study_health at **19:07:51.164Z** verifies **0.1.18**, the unchanged source pin and 13,369 source asset files. Production remains **0.1.10**. Public health still returns an internal connector error; no fresh public version claim is made. Cloudflare recheck confirms the manual-only public watch path and disabled public previews remain intact.

Live contracts at **19:07–19:09Z** verify the exact original request, four parts on Genesis 1:1–2:3, initial translation key, timestamp-first progress, silent reader policy and zero planner asset reads. The local part receives consequential-term guidance. The final part receives both exegesis and theology-review instructions and the reference layer, including actual sources and rendering continuity; its response remains below 30,000 characters. A Dutch/original-interlinear/exact/WLC-only fixture retains every preference through all four parts and continues to prohibit secondary/external retrieval. A Full word-study fixture stays focused and receives no forced passage appendix.

Final Ready at **19:08:59.528Z** refreshes the timestamp/layout, retains reference guidance and reports output completion unobserved. Its Next passage control and planner continuation advance to **Genesis 2:4–25**. These were source-free contract fixtures, not generated studies or proof of displayed host output.

A fresh complete host study must verify actual prose, progress clocks, reference usefulness and retained wording. Production/public promotion and public submission remain out of scope.

## Genesis book/chapter mapping — 15 October 2026

Read-only checks at **08:02:57Z / 10:02:57 CEST** confirm Preview **0.1.18**, Production **0.1.10** and unchanged source pin `054a5226027deb13827a04a6e68c56cbd3702f37`. Public connector health still returns an internal error; no fresh public version claim is made. Cloudflare retains the manual-only public watch path and disabled public previews. Starting preview ref: `91ed9e637c4b737bec9f61d260e9d147478b4c15`.

The offline Genesis batch contains **3,390 relations**, with **3,029 text-verified** and **361 individually model-reviewed**. Each Hebrew target covers all **1,533 WLC Genesis verses**. Greek chapter review covers **1–11 and 35**, including grouped/reordered boundaries. Ten DSS records at Genesis 1:1–3 were inspected: **six partial physical links, three reconstruction-only references and one provisional short-fragment attribution**, leaving **832** indexed Genesis records unreviewed. No human review or manuscript-image verification is claimed.

Validation passed: **57 Python tests**, including real TAHOT chapter renumbering, moved Greek clauses/names/genealogies, relocated Migdal Eder, retained Qere/X flags, duplicate suppression, digest/overlap rejection and reconstruction-only safeguards. Deterministic rebuild verifies original pinned bytes and every endpoint/artifact hash. These are offline index checks; the index is not bundled into study retrieval, systematic comparison remains inactive and the Worker remains 0.1.18. No Production/public promotion.

Saved mapping checkpoint `17690fa7a41326206c7df4a1c3b8d50b64d7d7f1` on preview. Its private automatic build **`60547e69-440f-410c-9004-d75477414581`** succeeded, stopped **08:16:14.650Z**. This includes the offline index only; the study Worker remains version 0.1.18 with comparison delivery inactive.

The subsequent source-review batch extends Greek Genesis through **1–20 and 35**: **543 WLC verse extents / 542 Greek native records**, represented by **536 relations** after grouped boundaries. The total Genesis edition layer is now **3,602 relations**: **3,029 text-verified** plus **573 individually model-reviewed**. Hebrew-edition coverage and the ten DSS dispositions are unchanged. Next work: Greek **Genesis 21:1** and DSS **4Q2 / L1593035-R002**, annotated Genesis 1:4. The 57-test suite and deterministic pinned-source rebuild are rerun for the extended batch.

## Genesis DSS milestone 1 — 15 October 2026

**Implemented and locally tested development data; committed to `preview`.** Starting checkpoint `39e00a2f56e4772b41bf1d558384f3efd2fb469c`: 602 / 842 DSS records reviewed. Intermediate 20-record checkpoint: `57ab114b6e7edc2a16ae41dc3f703d8a6d768605`, 622 / 842. Milestone endpoint: **642 / 842**, **200 remaining**. Added 40 model-reviewed dispositions: **18 partial physical support / 11 reconstruction-only / 11 provisional**. Cumulative outcomes: **296 / 163 / 183** respectively. Next: `4Q10 / L1593330-R002`, annotated Genesis 2:3.

Executed deterministic mapping build/check and the complete relevant mapping suite (**18 tests, passed**), plus inventory/count/preservation checks and `git diff --check`. Previous 602 reviews, completed Hebrew/Brenton Greek maps, source pin and native inventories are preserved. No runtime, version or deployment-setting changes; systematic comparison stays disabled. No Cloudflare deployment is asserted from these GitHub commits, and no host-model or performance claim is made. The historical mapping counts above describe earlier checkpoints; current machine-readable progress and [mapping progress](verse-mapping-progress.md) are authoritative.

## Genesis DSS milestone 2 — 15 October 2026

**Implemented, locally tested and committed development data on `preview`.** Starting checkpoint `46daf9f347184f3b973aa24bbafa9bafbb55abf4`: 642 / 842. Intermediate checkpoint `c542e48760cb8ae484c54b2d6bd7149af9abe6ae`: 662 / 842. Milestone endpoint: **682 / 842**, **160 remaining**. Added **11 partial physical / 16 reconstruction-only / 13 provisional** dispositions; cumulative totals are **307 / 179 / 196**. Next: `8Q1 / L1603102-R001`, Genesis 17:13.

Deterministic mapping build/check, all **18 relevant mapping tests**, inventory/count reconciliation, preservation checks and `git diff --check` passed. Earlier authored/generated reviews, edition/native artifacts and source-profile bytes are preserved. No Worker/version/configuration change or runtime integration. A GitHub commit is not evidence of a Cloudflare deployment; no deployment or host-model performance claim is made for this milestone.

## Genesis DSS milestone 3 — 15 October 2026

**Implemented, locally tested and committed development data on `preview`.** Starting checkpoint `789010c324a794aa33c0d5ddf6bb63a4555ca17d`: 682 / 842. Intermediate checkpoint `bab81a98a7e5b379fa3f5bc9e19bdf774be0e4da`: 702 / 842. Milestone endpoint: **722 / 842**, **120 remaining**. Added **6 partial physical / 16 reconstruction-only / 18 provisional** dispositions; cumulative totals are **313 / 195 / 214**. Next: `1Q1 / L1589621-R002`, Genesis 24:23.

Deterministic build/check, all **18 relevant mapping tests**, prior-record/artifact preservation, inventory/count reconciliation and `git diff --check` passed. Previously authored/generated reviews, edition/native artifacts and source-profile bytes are preserved. No Worker/version/configuration change or runtime integration. No Cloudflare deployment or host-model performance claim is inferred from the GitHub commits.

## Genesis DSS milestone 4 — 15 October 2026

**Implemented, locally tested and committed development data on `preview`.** Starting checkpoint `078e8c1bf4df42a116754a64f74137cf82191017`: 722 / 842. Intermediate checkpoint `7e5a6fc506f3885cddd8cabb2de9d7beba0c60db`: 742 / 842. Milestone endpoint: **762 / 842**, **80 remaining**. Added **12 partial physical / 15 reconstruction-only / 13 provisional** dispositions; cumulative totals are **325 / 210 / 227**. Next: `2Q1 / L1592441-R001`, Genesis 36:6.

Deterministic build/check, all **18 relevant mapping tests**, prior-record/artifact preservation, inventory/count reconciliation and `git diff --check` passed. Previous authored/generated reviews, completed edition/native maps and source-profile bytes are unchanged. No Worker/version/configuration change or runtime integration. No Cloudflare deployment or host-model performance claim is inferred from the GitHub commits.


## Finish Genesis milestone 1 — 20-record continuation, 15 October 2026

**Implemented, locally tested and committed development data on `preview`.** Starting verified checkpoint: `691e16379258df0e25c2db4ddd436a67a743a922` (762 / 842). Added exactly 20 unique physical-record reviews, `2Q1 / L1592441-R001` through `4Q3 / L1593099-R001`: **1 partial physical / 11 reconstruction-only / 8 provisional**. Total: **782 / 842**, **60 remaining**; cumulative dispositions **326 / 221 / 235**. Next: `4Q3 / L1593099-R002`, Genesis 40:21. Earlier milestone numbering above is historical; the user's new schedule has four 20-record review milestones and a separate final verification, with a final chat report and explicit continuation after each.

Established build/check and all **18 mapping tests** pass, alongside exact next-20 identity, prior-762 preservation, no-duplicate, source/anchor hash, count, artifact-integrity and deterministic rebuild checks. All completed Hebrew/Greek mapping artifacts remain unchanged. These are local data/integrity results, not evidence of host-model delivery, performance or deployment. No runtime integration, version change, Production/public deployment or publication; comparison delivery remains disabled.


## Finish Genesis milestone 2 — 20-record continuation, 15 October 2026

**Implemented, locally tested and committed development data on `preview`.** Starting verified checkpoint: `bd07178994ce53159a7f927b96458c1dfbb79f2e` (782 / 842). Added exactly 20 unique physical-record reviews, `4Q3 / L1593099-R002` through `4Q3 / L1593109-R001`: **10 partial physical / 8 reconstruction-only / 2 provisional**. Total: **802 / 842**, **40 remaining**; cumulative dispositions **336 / 229 / 237**. Next: `4Q3 / L1593109-R002`, Genesis 41:8.

Established build/check and all **18 mapping tests** pass, alongside exact next-20 identity, prior-782 authored/generated review preservation, no-duplicate, source/anchor hash, count, artifact-integrity and deterministic rebuild checks. Completed Hebrew/Greek/native mapping artifacts remain unchanged. Notes retain meaningful Genesis 41 transcription differences and damaged-letter uncertainty; no manuscript-image or human review is claimed. These are local data/integrity results, not host-model delivery or performance evidence. No runtime integration, version change, deployment or publication; comparison delivery remains disabled.


## Finish Genesis milestone 3 — 20-record continuation, 15 October 2026

**Implemented, locally tested and committed development data on `preview`.** Starting verified checkpoint: `75d6f33bfe5605f79995f146b06bbd016451f1c9` (802 / 842). Added exactly 20 unique physical-record reviews, `4Q3 / L1593109-R002` through `4Q6 / L1593186-R001`: **13 partial physical / 4 reconstruction-only / 3 provisional**. Total: **822 / 842**, **20 remaining**; cumulative dispositions **349 / 233 / 240**. Next: `4Q6 / L1593186-R002`, Genesis 48:3. The final 20 reviews and final Genesis verification remain separate milestones.

Established build/check and all **18 mapping tests** pass, alongside exact next-20 identity, prior-802 authored/generated review preservation, no-duplicate, source/anchor hash, fragment/line identity, count, artifact-integrity and deterministic rebuild checks. Completed Hebrew/Greek/native mapping artifacts remain unchanged. Notes retain corrected, uncertain, reconstructed and alternative-marked wording distinctly; no manuscript-image or human review is claimed. These are local data/integrity results, not host-model delivery or performance evidence. No runtime integration, version change, deployment or publication; comparison delivery remains disabled.


## Finish Genesis milestone 4 — final 20-record review batch, 16 October 2026

**Implemented, locally tested and committed development data on `preview`; separate final Genesis verification pending.** Starting verified checkpoint: `2a6ad998edf1ea205fbcf052ecbc1532d95c01c1` (822 / 842). Added exactly the final 20 unique inventory reviews, `4Q6 / L1593186-R002` through `4Q6 / L1593199-R002`: **16 partial physical / 1 reconstruction-only / 3 provisional**. Total: **842 / 842**, **0 remaining**; cumulative dispositions **365 / 234 / 243**. Next unreviewed record: none. This is inventory-disposition completion, not fully confident physical alignment or completion of the separate final verification milestone.

Established build/check and all **18 mapping tests** pass, with exact final-20 identities, prior-822 authored/generated review preservation, no duplicates, source/anchor hashes, fragment/line identity, count reconciliation and deterministic artifact-integrity checks. Hebrew/Greek/native mapping artifacts remain unchanged. Notes preserve meaningful transcription differences and reconstruction/uncertainty without manuscript-image or human-review claims. No runtime integration, version change, deployment or publication; comparison delivery remains disabled. Full Genesis verification and its documentation commit remain the next separate milestone.


## Finish Genesis milestone 5 — final verification complete, 16 October 2026

**Implemented, verified and committed development data/documentation on `preview`; Genesis assignment finished.** Verification starts from `b7e59868f9e0c3875316a7fc0dc331e6294218bd`. No new physical reviews: **842 / 842**, zero missing/duplicate identities, **365 partial physical / 234 reconstruction-only / 243 provisional**, no remaining or next unreviewed record. All prior review objects are preserved. The authored review-file scope metadata is corrected from its initial opening-record description; its hash/progress manifest are rebuilt, while generated DSS links, edition/native artifacts and runtime sources remain unchanged.

[Final verification evidence](verse-mapping-genesis-verification.json): build/check and exact deterministic artifact comparison passed; **58 Python tests**, **35 Worker tests**, **1,956 parity cases** passed. All 842 physical-record and anchor hashes, source annotations, physical identities and provenance were checked. All 4,575 edition relations / 6,131 endpoints retain complete Hebrew/Greek extent coverage, with forward/reverse lookups and DSS physical-result checks passing. Runtime assets exclude the mapping index; comparison delivery remains disabled and confident whole-inventory physical alignment remains incomplete.

Live health reports Production **0.1.10**, Preview **0.1.18**, source pin unchanged. Cloudflare active Production/public deployments remain dated **12 October 2026**, with IDs recorded in the report; main remains `fed918d04ca9975e93e4fd72e6861b8481948639`. Public health still errors, with no fresh version claim; manual-only public build path remains `__manual_public_release_only__/**`. No deployment or configuration mutation, runtime integration, version change or publication. Local tests do not prove host-model behavior or performance. Textual uncertainties and provisional placements remain explicit. **Stop after Genesis; no Exodus work started.**


## 0.1.19 — private Preview Genesis index consumer — 16 October 2026

**Implemented, locally tested and deployed to private Preview 0.1.19.** Base: `c96a49b7c7f502bcd54d4ddb6d87c8893c0e6b39`. The user authorizes Genesis runtime integration after the completed offline mapping assignment. Preview-only passage retrieval now resolves reviewed native edition extents and reading hashes; DSS retrieval uses reviewed physical identities/dispositions. Fifty derived, separately hash-verified mapping assets retain the source/index provenance. Native order, grouped target context versus requested scope, source restrictions and non-Genesis fallback are tested. WLC-only retrieval remains primary-only and adds no mapping read. The systematic comparison section stays disabled; existing review/index source artifacts remain unchanged.

Validation: 58 Python tests; 41 Worker tests including new Genesis and authenticated Preview-versus-normal protocol assertions; 1,956 parity cases; deterministic index check; private Worker packaging dry run. These checks do not prove host-generated study prose or performance. Live health before release: Preview 0.1.18, Production 0.1.10, source pin unchanged; public connector health errors, with no fresh public version claim. Production/public promotion remains unauthorized. Public auto-build remains suspended. Deployment and live results follow below.


Private Preview code commit: **`513c72f9989cc7a722c2b56ba926df2e729ea933`**. Cloudflare build **`238627e9-147c-42f6-ab2d-95752df92c6a`** succeeded, stopped **2026-10-15 22:25:27.882Z / 16 October 00:25 CEST**. [Saved live verification](preview-genesis-index-live-2026-10-16.json) confirms health **0.1.19**, 13,419 assets, index fingerprint and all 842 dispositions; a zero-asset-read active plan carries Genesis guidance. Actual calls resolve Genesis 32:1 to TAHOT 31:55 and Genesis 35:21 to Greek 35:16. DSS Genesis 48:11 returns `4Q6 / L1593199-R002` with its reviewed physical support; Genesis 36:6 returns a reconstruction-only record with physical support false. WLC-only Genesis 1:1 retrieves one source asset without comparison data. These are live retrieval contracts, not a generated-study quality or host-performance benchmark.

Production health remains **0.1.10**. Cloudflare active Production/public deployment IDs remain `1f13e9d5-8a55-4798-a9ae-b70bd7115d43` / `30ac1ac7-0f5c-4df1-be75-aa5920c99464`, both dated 12 October; the public manual-only path remains intact. Public health still errors; no fresh public version claim. No Production/public deployment, publication, other-book mapping or new systematic comparison-delivery section.


## 0.1.19 feature-parity correction — 16 October 2026

**Implemented on `preview`; validation and release verification pending.** Production and public/video previously displayed 0.1.19 but retained the older 11-tool/unstaged behavior. Correct the shared release contract so all three endpoints use the same 12-tool staged study flow, continuation state, source-bound Genesis index and debugging/timestamps. Preserve the private Cloudflare Access gate and the public connector-network allowlist, distinct rate limiting and manual-only public build trigger. No corpus expansion, extra manuscript studies or publication-directory submission. Validate locally and live before reporting feature parity; actual host-model part-by-part behavior remains a separate test and is not established by tool contracts.


### Public-only connector refresh maintenance — 16 October 2026

**Fix committed for public manual deployment; runtime verification pending.** Cloudflare's scheduled refresh was failing because Workers does not support fetch `redirect: 'error'`. Switch to `redirect: 'manual'`, keeping the existing `!response.ok` rejection of all 3xx responses and fail-closed policy age validation. Extend the public Worker test to reject redirect responses without replacing the last good policy. No change to study features, private authentication, public allowlist enforcement, six-hour Cron, or manual-only public deployment. Validate on the actual public endpoint and record evidence before claiming restoration.
