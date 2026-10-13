# Preview delivery candidate

The first improvement is stage-specific research and delivery. Alignment safeguards,
workload measurements, concordance and dossier expansion follow after delivery testing.

## Execution in 0.1.13

Preview overrides the earlier one-turn experiment after the user's 0.1.12 transcript
showed all research still occurred before translation output. Each passage study part
now occupies a separate user turn:

1. Clock check first, brief stamped scope orientation, relevant translation skills,
   primary sources and consequential decisions, then complete translation/footnotes.
2. Next: local explanation, literary structure and relevant names/terms.
3. Next in Full: bounded historical-cultural comparison.
4. Next: bounded canonical synthesis, theology, formation and a compact conclusion.

Standard and Detailed omit the separate historical part. Translation-only is one
part. Focused word/theme/dialogue tasks retain their own task structure and are timed
without being forced into passage translation. Load only the named active skills.
Structural handoff validation remains available when an actual contract requires it;
do not routinely generate and validate three large packets before output.

## Timing and controls

`preview_timestamp` supplies the first line of each visible assistant message using
DD-MM-YYYY HH:mm:ss in Europe/Amsterdam, with daylight saving time. The stage start
and ready timestamps measure preparation between server checks, not the complete
request-to-rendering interval. No precise final-character timestamp is available.
Never invent timing or estimate completion from the next user message's time.

`study_delivery` ready returns a continuation card and exact state; Next continues
the same passage until its final part, then advances the passage. Resume repeats
an interrupted part. Explicit Next passage uses ordinary passage continuation.
A supported MCP UI sends a user-triggered follow-up; typed Next is the fallback.
This is a plugin card, not control over native ChatGPT suggestion buttons.

## Evaluation

Local tests cover daylight saving time, malformed states, idempotent retry, ordered
part progression, literary-unit/depth/language/format retention, actual MCP descriptors,
private Preview isolation, default/public tools, and widget bridge/fallback behavior.
These checks do not certify model delivery or rendering in each ChatGPT client.

In fresh Preview chats, test Full Genesis 1, Full Philippians 4:10–13 exact, Translate
Acts 8:37, and Full word study ruach. Record first translation latency, each part's
start/output stamps, full completion, repeated research, numbering of footnotes and
button behavior on web, Windows and phone. Do not add corrective workflow instructions
to the test prompt: they must come from the plugin. Public submission remains paused.

## Deployment boundary

Private Preview receives 0.1.13 from the preview branch, enabled only by
`previews.vars.PREVIEW_DELIVERY`. Public remains 0.1.11 and Production 0.1.10. The
public build trigger remains suspended with user authorization. Restore its original
`path_includes: ["*"]` only upon approved public promotion. Source corpus, source pin,
Access settings and existing rate limits are unchanged.
