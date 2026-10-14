# Development backlog

| Priority | Work | Status | Evidence / next action |
| --- | --- | --- | --- |
| 1 | Remove unnecessary Preview handoff validation | Implemented, tested and deployed in private Preview 0.1.16 | Tool-list isolation and active instruction tests pass. |
| 2 | Reduce avoidable retrievals, invalid calls and repeated wording refinement | 0.1.16 host check exposed a planner bypass; 0.1.17 correction implemented and locally tested, private deployment verification pending | Normalize the observed conversational prompt; explicit error recovery requires a successful retry and active translation key before retrieval. Preserve metadata-only planning and evidence reuse. |
| 3 | Retain translation rules and literary scope under source restrictions | Implemented, tested and deployed in private Preview 0.1.16 | WLC-only, exact scope, language, interlinear and continuation regressions pass. |
| 4 | Reliable Preview clocks, concise notes and exact staged output | 0.1.16 supplied output missed visible clocks/diagnostics and expanded notes; 0.1.17 correction implemented and locally tested, private deployment verification pending | Concrete output_contract returned at planning and Ready, with fresh clock, H2 heading, actual edition label, paragraph notes and exact Next label. Fresh host validation still required. |
| 5 | Comparable host-model benchmark | Pending | Fixed protocol and local baseline/candidate replay records available; no host-speed improvement claimed. |
| 6 | Cross-edition verse alignment and mapping | Proposed; not implemented | Start after delivery evaluation. Preserve native numbering and distinguish reviewed equivalence from equal labels. |

Full-study Next sequencing is already implemented. Verify translation markers, restrained footnotes, stage sequence and Next UI in fresh host conversations. Public submission remains paused.
