# Development decisions

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

## Request and output recovery — implemented in Preview 0.1.17 candidate

The 13 October 0.1.16 Genesis 1 host check exposed a reproducible planner failure for “Give me the full study of genesis 1”. The sampled initial operation trace showed unknown_book, a router-document read and then direct source retrieval, without a successful active plan before that retrieval. The supplied output had complete translation and verse-linked markers, but lacked visible clocks/diagnostics, used expanded heading-per-note discussions, changed stage titles and retained “living life” in Genesis 1:30. Its opening rendering was correct. Sampled logs do not establish a complete host call count or the absence of every later Ready call.

Normalize recognizable English/Dutch request phrasing around documented commands in Preview only. Preserve the requested passage and options; never guess a book or silently repair ambiguous scope. Genuine errors or missing input must lead to repair/clarification and a successful planner retry, not a router read or direct fetch. Return this requirement explicitly in error results and instruction reads. This remains a host contract; no stateful cross-call enforcement or new routine validation step is introduced.

Return the concrete active output layout at planning and refresh it at Ready: actual timestamp, H2 heading, consulted edition identity, concise numbered paragraph notes, compact observed diagnostics and exact continuation label. Preserve consequential alternatives; defer extended anthropology, doctrinal arguments, historical surveys and full word studies to their own parts. Reinforce contextual Genesis 1:30 wording without imposing one fixed nephesh gloss. Source labels describe the actual dataset (including Brenton Greek Septuagint), preserve all original evidence, and make no alignment claim.

Regression and live contract checks can establish these mechanisms. A fresh host study must still establish visible delivery, wording, note length and client behavior. No host-speed improvement is inferred from the new exploratory 1m16s display.

## Performance evidence

The user-reported Worked for times (6m10s full-study first part, 3m42s comparison translation, 1m56s WLC-only) are exploratory, with insufficient controls for an improvement claim. Local before/after replays measure runtime overhead only. Controlled host runs must hold prompt, scope, language, format, model, client and debug setting constant within each scenario. See [benchmark protocol](benchmark-protocol.md). Cross-edition mapping follows delivery evaluation.
