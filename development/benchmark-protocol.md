# Translation delivery benchmark

## Existing exploratory observations

| Scenario | Reported Worked for | Classification |
| --- | --- | --- |
| Full-study first part | 6m10s | Exploratory; prompt/model/client/other controls not established. |
| Translation-only with comparisons | 3m42s | Exploratory; not a controlled comparison with the other scenarios. |
| WLC-only translation | 1m56s | Exploratory; source scope differs from the comparison run. |
| Preview 0.1.16 Genesis 1 full-study request | 1m16s | Exploratory screenshot; the observed run included a failed plan and different retrieval behavior, so it is not a controlled speed comparison. |
| Preview 0.1.17 first part in Work | 46s | Exploratory user screenshot/output, 14 October 18:38 CEST; original conversational prompt, WLC/OSHB evidence, model unspecified. Complete selected unit and intended final layout; progress timestamps/rules commentary and remaining parts still need review. |

Do not treat these as a baseline proving a later speed improvement.

## Controlled host runs — pending

Use fresh Preview conversations and one fixed model/client. Refresh metadata before running a candidate. Use these exact prompts, with at least three repetitions per release and scenario:

| Scenario | Prompt |
| --- | --- |
| Full-study first part | Full study Genesis 1:1–2:3, exact, in English, sources WLC+LXX |
| Comparison translation | Translate Genesis 1:1–2:3, exact, in English, sources WLC+LXX |
| WLC-only translation | Translate Genesis 1:1–2:3, exact, in English, WLC only |

Hold source revision, scope, English, plain working format and Debug on constant. Compare a scenario with the same scenario across releases; do not compare full-study time with WLC-only time as though the task were identical. Baseline 0.1.14 host timings were not captured under these controls, so an after-only run is not a before/after benchmark. Do not roll back a live release just to create benchmark data without an authorized release plan.

Record: release/deployment, exact model identifier and client, run/repetition, first tool and last server check, Worked for display, time to first substantive translation and full output if directly observable, actual tool count, repeated fetches/instruction reads, failures/corrections, server execution totals and cache metrics. Mark missing measures unavailable. Ready and a pre-output clock do not measure output completion; do not infer completion from the next user message.

Check quality alongside timing: full selected unit, Genesis 1:1 main rendering and alternative note, numbered verse-linked footnotes, permitted sources only, retained translation rules, exact next title, and correct Next/Next passage behavior. Report medians/ranges and failures. Do not attribute changes solely to code when host model or service conditions changed.

## Local retrieval replay — completed

Run from the Cloudflare directory after prepare:data:

```bash
node scripts/benchmark-delivery.mjs /absolute/path/to/results.json
```

The same script was run against baseline 0.1.14 and candidate 0.1.16 using five cold/warm pairs per scenario, identical Genesis 1:1–2:3 text retrieval, English and plain format. Results include individual samples, medians, asset/cache counts and packet bytes. Planning and passage retrieval are measured separately. Cache is cleared before each cold run and retained for its warm pair.

The replay includes no model, external network, Cloudflare CPU or client rendering. It cannot verify actual host call counts, translation quality or Worked for time. Results are mixed: cold totals increased and warm totals decreased in this sample. The redundant planner opening read is absent in the candidate, confirmed by its zero planner retrieval metrics and one fewer cache hit per replay. No overall or host-speed improvement is claimed.

The candidate replay covers the combined 0.1.16 source after preserving the concurrently deployed 0.1.15 changes. Its git_head is a local preparation commit, not an assertion that this commit was deployed. Baseline 0.1.14 is the initial verified source. Planner packets grew with explicit policies and retrieval metadata; this is another reason not to infer host performance from local planning time.
