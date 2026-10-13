// Preview-only, client-carried delivery state. No user content or timings are stored.
import {bounded, StudyError} from './common.js';

export const PREVIEW_INSTRUCTIONS = `PREVIEW TIMING AND STAGED DELIVERY OVERRIDE: These Preview-only rules supersede the usual complete-in-one-turn delivery rules in all study documents. At the beginning of EVERY user turn call preview_timestamp before any study retrieval. Put its exact display timestamp as the FIRST LINE of your first visible assistant message. Before each further visible assistant progress or substantive message call preview_timestamp again and put the fresh timestamp first. Never invent a clock value. These timestamps are server checks, not exact client rendering times. For passage studies call study_plan, which returns only the current delivery part. Complete only that part, then STOP and invite Next; do not research later parts in this turn. Before the substantive output call study_delivery with action ready and the exact delivery_state; copy its output timestamp as the first line, retain next_delivery_state and show the continuation control. A plan or progress message does not complete a part. While a part remains pending, typed Next means the NEXT PART of the SAME passage: call study_delivery action next with next_delivery_state. Use action resume with delivery_state to recover an interrupted part. After the last part Next advances the passage; explicit Next passage always uses the ordinary passage continuation_state with study_plan. Do not force focused word/theme/dialogue tasks into passage translation; still timestamp their visible messages. Research only the active part, reuse prior verified evidence, retain depth/language/format, and keep consequential footnotes with translation. A structural handoff check is optional unless an actual contract needs validation; do not build and validate three large internal handoff packets routinely. Never claim the clock measures complete model thinking or the time the final character appeared. If a button is unavailable, accept typed Next. Do not imply a native ChatGPT suggestion button is controlled by this server.`;

const passageModes = new Set(['study_plan', 'standard_study', 'detailed_study', 'full_study', 'translation_only', 'exegesis_only', 'context_history']);
const titles = {translation_notes: 'Translation and footnotes', local_explanation: 'Local explanation and literary structure', historical_context: 'Historical-cultural context', canonical_synthesis: 'Canonical synthesis and formation'};
function stages(mode, depth) {
  if (mode === 'translation_only') return ['translation_notes'];
  if (mode === 'context_history') return ['historical_context'];
  const parts = mode === 'exegesis_only' ? [] : ['translation_notes'];
  parts.push('local_explanation');
  if (depth === 'full') parts.push('historical_context');
  parts.push('canonical_synthesis');
  return parts;
}
export function timestamp(now = Date.now(), startedAt = null) {
  const date = new Date(now);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/Amsterdam', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZoneName: 'short'}).formatToParts(date).map(p => [p.type, p.value]));
  return {iso: date.toISOString(), display: `${parts.day}-${parts.month}-${parts.year} ${parts.hour}:${parts.minute}:${parts.second} (${parts.timeZoneName}, Europe/Amsterdam)`, time_zone: 'Europe/Amsterdam', ...(startedAt ? {stage_elapsed_seconds: Math.round((now - Date.parse(startedAt)) / 100) / 10} : {}), measures: 'Server clock check; not client rendering or final-message completion.'};
}
function validateState(engine, state, now) {
  if (!state || Object.keys(state).sort().join(',') !== 'passage_state,schema_version,stage_index,started_at' || state.schema_version !== 1 || !Number.isInteger(state.stage_index) || typeof state.started_at !== 'string' || !Number.isFinite(Date.parse(state.started_at)) || Date.parse(state.started_at) > now || now - Date.parse(state.started_at) > 30 * 86400000) throw new StudyError('delivery_state', 'Use the exact recent delivery_state returned by Preview.');
  const passage = engine.state(state.passage_state);
  if (!passageModes.has(passage.request_mode)) throw new StudyError('delivery_state', 'This focused task does not use passage delivery parts.');
  const sequence = stages(passage.request_mode, passage.study_depth);
  if (state.stage_index < 0 || state.stage_index >= sequence.length) throw new StudyError('delivery_state', 'Invalid delivery part index.');
  return {passage, sequence};
}
const partRules = {
  translation_notes: {output: 'Complete working translation of the selected unit with numbered consequential footnotes. No central thesis or later study sections.', research: 'Primary passage, necessary preceding discourse, consequential textual/lexical decisions and verified quotation/echo wording only. No historical surveys, full word studies or canonical dossiers. Use a targeted external lookup only for an unresolved rendering that materially changes the translation or its footnotes.', instructions: ['bible-source-retrieval', 'bible-translation', 'translation-key'], stop: 'Once the translation and notes are checked and delivered, stop this turn. Next requests local explanation.'},
  local_explanation: {output: 'Local meaning, argument, relevant terms/names and literary structure at the retained depth.', research: 'Reuse the translation evidence. Retrieve only an unresolved local-context question. Defer broad historical comparison and canonical synthesis.', instructions: ['bible-exegesis'], stop: 'Once local explanation is checked and delivered, stop this turn.'},
  historical_context: {output: 'Relevant historical-cultural context and specific comparisons; distinguish evidence from interpretation.', research: 'Reuse prior evidence. Investigate only concrete historical questions needed for this part; no general survey or collection of agreeing sources.', instructions: ['bible-exegesis'], stop: 'Once relevant historical context is checked and delivered, stop this turn.'},
  canonical_synthesis: {output: 'Bounded canonical development, theological synthesis, formation implications and a compact conclusion without repeating prior sections.', research: 'Retrieve only the canonical anchors needed for this synthesis, reusing already checked passages. Review new or inconsistent claims; do not restart the full study.', instructions: ['bible-theology-review'], stop: 'Once synthesis is checked and delivered, this passage study is complete.'},
};
function partPlan(plan, state, now) {
  const sequence = stages(plan.mode, plan.study_depth), id = sequence[state.stage_index];
  const {delivery, stages: oldStages, study_plan, method, reader_action, response_sections, next, ...rest} = plan;
  // Keep evidence policies but omit the all-study stage list that encouraged front-loading.
  return bounded({...rest, next_passage: next, delivery_state: state, delivery: {mode: 'preview_one_part_per_turn', current_part: id, title: titles[id], part_number: state.stage_index + 1, total_parts: sequence.length, ...partRules[id], timestamp: timestamp(now, state.started_at), requires_next_for_more_parts: state.stage_index + 1 < sequence.length, instruction_priority: 'This active-part contract overrides autonomous whole-study completion. Complete this part, call study_delivery ready, deliver it, and stop. Do not research later parts.'}}, 20000);
}
export async function previewPlan(engine, args, now = Date.now()) {
  // Normalize the ordinary trailing language wording seen in the reported test.
  const match = /\s+in (English|Engels|Dutch|Nederlands)\.?$/i.exec(args.query);
  const query = match ? args.query.slice(0, match.index) : args.query;
  const language = match ? /english|engels/i.test(match[1]) ? 'en' : 'nl' : args.language;
  const plan = await engine.plan(query, args.active_reference ?? null, language, args.translation_format, args.study_state ?? null, args.study_depth ?? null);
  if (!plan.continuation_state || !passageModes.has(plan.mode)) return {...plan, preview_timestamp: timestamp(now)};
  return partPlan(plan, {schema_version: 1, passage_state: plan.continuation_state, stage_index: 0, started_at: new Date(now).toISOString()}, now);
}
export async function deliveryAction(engine, action, state, now = Date.now()) {
  if (!['next', 'resume', 'ready'].includes(action)) throw new StudyError('delivery_action', 'Use next, resume or ready.');
  const {passage, sequence} = validateState(engine, state, now);
  if (action === 'ready') {
    const hasNext = state.stage_index + 1 < sequence.length;
    return {status: 'host_reports_part_ready', timestamp: timestamp(now, state.started_at), completed_part: sequence[state.stage_index], completed_title: titles[sequence[state.stage_index]], next_title: hasNext ? titles[sequence[state.stage_index + 1]] : 'Next passage', passage_complete: !hasNext, next_delivery_state: {...state}, next_action: 'next', button_label: hasNext ? `Next: ${titles[sequence[state.stage_index + 1]]}` : 'Next passage', instruction: 'Begin substantive output with timestamp.display. Deliver only the current part and then stop. Retain next_delivery_state for Next. Readiness is reported by the host; this tool does not certify the translation or interpretation.'};
  }
  if (action === 'next' && state.stage_index + 1 === sequence.length) {
    return previewPlan(engine, {query: 'Next', study_state: passage, language: passage.language, translation_format: passage.translation_format}, now);
  }
  const index = action === 'next' ? state.stage_index + 1 : state.stage_index;
  const plan = await engine.passagePlan(passage.request_mode, passage.current_reference, passage.language, passage.translation_format, passage.original_reference, passage.pending_references, null, passage.study_depth);
  return partPlan(plan, {schema_version: 1, passage_state: passage, stage_index: index, started_at: new Date(now).toISOString()}, now);
}
