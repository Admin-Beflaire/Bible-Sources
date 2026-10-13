# Changelog

## 0.1.14 — Preview debug and delivery repairs — 2026-10-13

- Bundle only active-stage instructions in the planner and make default Preview instruction reads compact routers, with explicit full access for a concrete missing instruction.
- Add Preview-only verbose observable-operation reporting, compact tool timings/cache metrics/source counts, per-result server clock checks and conversation-level Debug on/off requests. Do not expose hidden reasoning or add argument/transcript logs.
- Provide Clock and Ready/Next/Resume through the existing planner as a cached-tool fallback; attach the continuation UI to that planner as well as study_delivery. UI still depends on host support and refreshed metadata.
- Expose the complete typed evaluation contract and avoid unnecessary formal evaluation when retaining the primary text with a factual alternative note. Preserve strict evidence checks for actual selection assessments.
- Require verse-linked footnote markers, concise matching notes and the exact returned part sequence. Label pre-output footer timestamps honestly; request a fresh post-output clock only when supported.
- Keep public 0.1.11 and Production 0.1.10 unchanged; publication and verse mapping remain on hold during delivery testing.

## 0.1.13 — Preview timing and study parts — 2026-10-13

- Add Preview-only Amsterdam timestamps, with explicit server-check and rendering limits. Call the clock before each visible assistant message.
- Return only the active passage-study part, load its relevant skills, and stop after its output. Preserve the literary unit, depth, language and translation format through typed Next or an optional UI continuation button; resume interrupted parts without advancing.
- Add a self-contained MCP UI using standard follow-up messaging with a ChatGPT compatibility fallback. No server study storage, additional identity data, external UI dependencies or background model work.
- Gate the two additional tools and UI resource behind the private Preview environment flag; default/private production and public noauth delivery contracts remain unchanged.
- Reduce Preview initialization instructions and make structural handoff validation conditional rather than routine. Normalize the trailing language phrase seen in the user test. Public stays 0.1.11, Production 0.1.10; publication remains on hold.

## 0.1.12 — Preview delivery — 2026-10-12

- Add a shared section-bounded research policy to MCP initialization, Worker/Python plans and study instructions. Before translation, check only primary wording, necessary discourse and consequential variants, lexical questions or wording links; preserve unresolved alternatives.
- Deliver translation with numbered footnotes before a central thesis. Defer wider historical, lexical and canonical research to the section that needs it; reuse evidence, treat budgets as ceilings, and avoid repeated synthesis.
- Preserve Full depth, enclosing literary units, focused-task milestones and autonomous completion. Host-controlled streaming remains a limitation; no guaranteed latency or background model work is promised.
- Suspend automatic public-server builds with user approval while Preview is evaluated. Public remains 0.1.11; Production remains 0.1.10. Source pin, texts and access settings are unchanged.

## 0.1.11 — Preview and separate public MCP — 2026-10-12

- Add a standalone public Worker at `mcp.canonical-theology.com/mcp`, with no extra sign-in and eleven read-only tools declaring no authentication. Preserve the private Production/Preview Access configuration; Production remains 0.1.10.
- Restrict all public MCP methods to edge-verified addresses in OpenAI's official connector ranges. Reject forwarded-header spoofing, Worker subrequests and alternate hostnames; disable workers.dev/preview URLs and static-route bypass.
- Refresh a validated, bounded network-policy snapshot in KV every six hours; retain last-good policy on failed refresh and fail closed after 48 hours or on missing/malformed policy.
- Add shared connector-IP/service burst limits (600/1,200 requests per minute per Cloudflare location), retaining streamed 128 KiB body limits, no-store responses and verified evidence retrieval.
- Add public remote configuration, separate Git build/deploy setup, network/noauth protocol regressions and documentation. This deployment does not publish a directory listing. Study instructions, source texts and pinned source hashes remain unchanged.

## 0.1.10 — Production and Preview — 2026-10-12

- Limit authenticated MCP POSTs with a Cloudflare Rate Limiting binding: 120 per verified user per 60 seconds, separate Preview/production namespaces, HTTP 429 with Retry-After and fail-closed binding errors. Keys use hashed verified identity rather than a shared proxy IP or raw token.
- Stop streamed request reads at 128 KiB, including requests without Content-Length; stop source asset reads at their registered byte length and retain SHA-256 verification.
- Assemble immutable MCP instructions and tool schemas once per isolate, minify the Worker and expose verified-cache metrics.
- Enable stored invocation logs with URL query redaction and structured tool timing/outcome/byte metrics without logging prompts, arguments, source content, identities or tokens. Authenticated study_health reports runtime controls.
- Prevent HTTP caching of MCP responses; retain Access/OAuth settings and disabled production workers.dev endpoint.
- Add rate-limit, identity, streamed-body and cache-integrity regressions; refresh hosting documentation. Study behavior and sources are unchanged except version metadata. Promote the verified Preview release and the 0.1.9 study policies to Production; both branches share the same release content.

## 0.1.9 — Preview — 2026-10-11

- Add a shared study-dialogue policy to first MCP instructions and Python/Worker plans: answer the actual question, retain clarifications, evaluate cumulative arguments and explain specific reasoning errors.
- Distinguish explicit contextual statements from supported inference, corroboration, compatibility and canonical synthesis; permit warranted doctrine without overstating unstated conclusions as direct textual proof.
- Bound source checks to an identified gap, reuse verified evidence, retrieve enough discourse and stop once resolved; limit external research by depth and expand it only for a concrete need.
- Respect the Bible’s diverse genres and formative purpose, and answer follow-up questions with targeted context/retrieval rather than restarting a full study.
- Update study, exegesis and theology-review instructions. Keep the source texts and authentication unchanged; production remains 0.1.8.

## 0.1.8 — Production — 2026-10-11

- Ordinary passage studies explain and select the smallest curated enclosing literary unit, including Genesis 1:1–2:3 for Genesis 1. Explicit exact requests and focused commands keep their scope; unindexed boundaries require source-based host review.
- Apply a general source-grounded OT–NT wording policy: preserve recognizable verified quotation/echo wording where grammar supports it; assess defensible consolidated working renderings; footnote traditional, scholarly and working choices; preserve real source differences.
- Make the English default explicit; change language only for the user’s request or retained study continuation.

## 0.1.7 Preview — 2026-10-09

- Release check: expanded complete word-study packets use a shared 16,000-character ceiling in Python and Worker; context pointers are still deferred as needed, all study content is retained, and lexical/single-sense limits remain 12,000.

- Upgrade Full word-study planning to cover all supported attested semantic senses rather than using 4–6 sample passages as a hard limit; include uncommon uses and distinct homographs.
- Require occurrence-level contextual analysis: syntax, actor/recipient, relationships, direction and reciprocity, literary/historical setting.
- Compare related lexical concepts without treating them as synonyms, and separate source semantics from contextual inference and theological/canonical interpretation.
- Preserve compact Standard word studies and existing evidence-based citation rules. Add matching JavaScript/Python delivery metadata and regression/smoke assertions.
- No edits to any of the 50 curated source word-study records, indexes or source evidence; these are managed independently. Production unchanged.

## 0.1.6 Preview — 2026-10-09

- Default Word study / Woordstudie to a concise Standard word study; add explicit Full word study / Volledige woordstudie routing and depth-specific response sections.
- Keep the existing optional Detailed depth, selected research budgets and phased delivery; add word-specific coverage targets without bloating Standard.
- Require claim-adjacent biblical references and verifiable source attribution for lexicographical claims; never invent BDB/HALOT quotations or infer their contents from selected STEP/OSHB project records.
- Return a structured word_study_policy and citation_policy in both JavaScript and Python planners and update study skills, MCP instructions, documentation, parity tests and smoke checks.
- No source-text changes, authentication changes or Production promotion.

## 0.1.5 Preview — 2026-10-09

- Choose bounded remaining verses of a curated literary unit for Next suggestions, even across chapter boundaries (Genesis 1:1–3 → 1:4–2:3), without automatically expanding the current request.
- Keep explicit Next chapter and pending chapter portions authoritative; fall back to existing bounded chunking when curated continuations cannot be used.
- Explain literary boundary choices and interpret dependent openings at the necessary discourse scale, not a fixed five-verse context window.
- Mirror reference and planner changes across Python/JavaScript, with specific Next, continuation, and smoke regression checks.
- Preserve the progressive delivery behavior introduced in 0.1.4; no authentication changes; Production unchanged pending review.

## 0.1.4 Preview — 2026-10-09

- Require an actual completed Standard study instead of stopping at the returned study plan.
- Add evidence-gated delivery milestones for normal and focused study modes, with preference for successive assistant messages and a single-stream fallback.
- Prioritize early verified working translation/notes, autonomous continuation in the same user turn, and clear Next semantics.
- Update MCP instructions, skill and method, both Python/JavaScript planners, versioned manifests and regression tests.
- Keep authentication and tool input schemas unchanged; Production is not promoted.

## 0.1.3 Preview — 2026-10-08

- Add Standard/Detailed/Full planning, depth-specific research budgets, English/Dutch aliases and an additive study_depth/--depth option.
- Preserve depth through Next and accept the existing six-field continuation state.
- Return source-first research order, staged in-turn delivery and relevant name/literary reading-aid contracts; update the embedded skills and method.
- Strengthen adjacent translation notes, translation/explanation consistency and confidence checks after user feedback.
- Keep pinned source bytes, evidence contracts and Cloudflare Access JWT protection intact; validate the authenticated protocol with local signing keys.
- Publish this change to the existing Preview branch only; production promotion remains separate.

## 0.1.2 — 2026-10-06

- Add native JavaScript hosting for Cloudflare Workers Free with verified Workers Static Assets; no paid service or model API binding.
- Preserve the ten runtime operations and add a read-only instruction tool exposing the eight skills and four method references.
- Prepare byte-preserved chapter spans and paged DSS verse assets from the existing pinned sources; exclude private Rahlfs and unmapped DSS routes.
- Verify 1,921 Python/Worker behavior comparisons, integrity and scope guards, Streamable HTTP behavior and a Wrangler deployment dry run.
- Document account-side deployment and ChatGPT connection; live hosting, free-plan CPU measurements and installation remain pending.

## 0.1.1 — 2026-10-06

- Adopt Canonical Scripture Study and the approved subtitle.
- Rename the package, catalogue entry, MCP identity and setup paths consistently.
- Clarify that the intended study interface is ChatGPT and installation remains unfinished.
- Preserve all source datasets, study commands and evidence contracts.

## 0.1.0 — 2026-10-06

- Publish eight modular study skills and a dependency-free, pinned source retrieval CLI.
- Add a read-only optional MCP 2.3 adapter with ten structured tools.
- Route English/Dutch commands and all three translation display formats.
- Turn larger requests into sequential portions with explicit continuation state and Next.
- Preserve reconstruction/annotation provenance, textual alternatives and native references.
- Retrieve complete bounded word studies and six provisional canonical seed dossiers.
- Validate strict stage envelopes and reading assessment contracts; document human/model review limits.
