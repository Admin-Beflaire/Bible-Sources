# Canonical Scripture Study development

> **Retired MCP services — 30 October 2026:** The private and public Study Workers have been decommissioned. Their server code, deployment/package configuration and MCP adapters were removed under [cleanup #6](https://github.com/Admin-Beflaire/Bible-Sources/issues/6). Sources, indexes, knowledge, provenance, research records and offline source/mapping tools remain. Earlier hosting/install/release instructions below are historical; retired files remain in [the pre-cleanup revision](https://github.com/Admin-Beflaire/Bible-Sources/tree/05f7b4ecff1d5eaf179052adb03b82bed9909a22). Do not redeploy the retired services.


Repository code and verified running deployments are authoritative. Before changing a release, check all three live `study_health` results and the Cloudflare build configuration. Work in `plugins/canonical-scripture-study` and use the existing deployment process.

- Develop and deploy to private Preview first, on `preview`.
- Keep only `main` and `preview` as permanent branches.
- Merge/promote to private Production or deploy to the public/video server only when explicitly requested.
- Public automatic builds are intentionally suspended by the `__manual_public_release_only__/**` watch path. Preserve that suspension until public promotion is authorized.
- Keep the root/plugin READMEs and `development/decisions.md`, `development/backlog.md`, and `development/release-status.md` current. Distinguish proposed, implemented, tested, and deployed work.
- Run relevant regression checks and verify live contracts after deployment. Local tests and retrieval replays do not prove host-model delivery, wording quality, UI behavior, or performance.
- Benchmark comparable runs before claiming improvement. Treat the reported 6m10s, 3m42s and 1m56s Worked for times as exploratory observations.
- Preserve source text, the pinned corpus revision, authentication, endpoint identity, and audience unless a change is explicitly authorized.
- Keep development instructions here and in `development/`; do not bundle them into runtime study skills or MCP instructions.

Product and translation decisions are recorded in `development/decisions.md`. Runtime study behavior belongs in the plugin's skills, references and planner contracts.
