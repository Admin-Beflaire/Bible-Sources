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
