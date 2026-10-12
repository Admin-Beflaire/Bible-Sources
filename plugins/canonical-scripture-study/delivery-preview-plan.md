# Preview delivery candidate

The first improvement is stage-specific research and delivery. Alignment safeguards,
workload measurements, concordance and dossier expansion follow after delivery testing.

## Execution

1. Give a short scope orientation, including a justified literary-unit adjustment.
2. Retrieve primary wording and necessary prior discourse. Compare only witnesses,
   lexical evidence or wording links that can change the translation or its notes.
   Investigate consequential differences; label unresolved alternatives honestly.
3. Present the complete working translation with numbered footnotes referring to
   affected verses. A central thesis or interpretive essay must not precede it.
4. Research and deliver local explanation, literary structure and relevant terms.
   Research historical context only for the question being explained. Reuse evidence.
5. Research and deliver bounded canonical/theological development. Explain findings
   once and use the synthesis to connect them. Review new or inconsistent claims.

Full retains depth. Research budgets are ceilings, not quotas. Focused tasks retain
their own milestones; a word study is not forced into a passage translation.

## Host capability and fallback

Prefer visible completed sections interleaved with later tool calls in the same turn
when ChatGPT supports it. Otherwise use an ordered streamed answer with bounded
necessary research. The server supplies instructions and evidence; it cannot force
ChatGPT to publish an intermediate message or guarantee a 30-second translation.
Do not promise background jobs or automatic subsequent turns. Next changes passage.

## Preview evaluation

Use fresh Preview chats and ordinary requests, without adding instructions that
compensate for missing plugin behavior:

- Full study Genesis 1 in English: complete Genesis 1:1–2:3, consequential opening
  and seventh-day notes, then literary/history/canonical development.
- Full study Philippians 4:10–13, exact: translation before interpretation, bounded
  local context, then a follow-up about contentment and improving circumstances.
- Translate Acts 8:37: handle the known textual issue without manufacturing a
  reading or treating speed as grounds to skip consequential evidence.
- Full word study ruach: retain occurrence-level semantic coverage and citations,
  without forcing a passage-translation stage.

Record time to first substantive translation, time to completion, tool/research
sequence, unnecessary retrievals, numbered-note placement, repeated explanations,
scope completeness and delivery failures. Thirty seconds is a target to measure,
not a guarantee or reason to weaken evidence. A faster but incomplete response fails.

Local contract/parity/protocol tests cannot certify model delivery. Mark host
evaluations pending until actual Preview conversations have completed.

Local checks on 12 October 2026 passed: 39 Python runtime tests, 20 Worker test
groups and 1,956 Python/Worker parity cases. MCP initialization carries the same
research policy as the plan. No source texts or source hashes changed.

## Deployment boundary

Private Preview receives 0.1.12 from the preview branch. The public video server
remains on 0.1.11 and Production on 0.1.10. On 12 October 2026 the user explicitly
authorized disabling automatic public builds. The public build trigger retains its
original branch, commands and bindings; its path filter is temporarily
`__manual_public_release_only__/**`. Restore `path_includes: ["*"]` when the user
approves public promotion. Live Preview host evaluation remains pending.
