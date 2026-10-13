// Preview-only, client-carried delivery state. No user content or timings are stored.
import {bounded, StudyError} from './common.js';
import {bundle} from './store.js';

export const PREVIEW_ROUTER = `Preview study routing: call study_plan first. It returns the current part and the complete instruction_bundle for that part; read that bundle without fetching every skill or reference. Do not preload documents. If preview_timestamp or study_delivery is unavailable, use the existing study_plan tool: query Clock for a real timestamp; query Ready, Next or Resume with study_state={preview_delivery: delivery_state} for delivery control. Use the returned exact part titles; do not invent another sequence. Translation requires verse-linked numbered footnotes, not eleven mini-essays. Keep material alternatives and explanations, and defer historical/canonical/theological discussion to their own parts. Retaining the primary reading with a factual alternative note does not require evaluate_reading; use formal evaluation for a proposed primary-reading change or a requested textual assessment. Never weaken evidence validation or invent evidence to save time.`;
export const PREVIEW_DEBUG_INSTRUCTIONS = `PREVIEW DEBUG MODE: Verbose observable-operation reporting is enabled by default for this experiment. The user may say Debug off to reduce reporting, or Debug on to restore it, in this conversation. Before each batch report the actual active part, the specific source question and planned bounded tool calls. Afterwards summarize tools actually called, witnesses/record counts retrieved, server_execution_ms from preview_debug, cache metrics, actual errors and corrections. Distinguish planned, completed, failed and deferred operations. Explain an operational choice briefly (for example a retained base needs a note but no formal selection contract), without disclosing private internal reasoning or claiming a validator authenticated the interpretation. Do not dump full source packets, repeated instructions, raw state or transcripts into progress. End each part with the server's exact next title and a short actual-checks summary. Server execution time is not model thinking or end-to-end latency. Only report counts and durations present in the tool results; do not invent a complete trace or output-completion timestamp.`;

export const PREVIEW_INSTRUCTIONS = `PREVIEW TIMING AND STAGED DELIVERY OVERRIDE: These Preview-only rules supersede the usual complete-in-one-turn delivery rules in all study documents. At the beginning of EVERY user turn call preview_timestamp before any study retrieval. Put its exact display timestamp as the FIRST LINE of your first visible assistant message. Before each further visible assistant progress or substantive message call preview_timestamp again and put the fresh timestamp first. Never invent a clock value. These timestamps are server checks, not exact client rendering times. For passage studies call study_plan, which returns only the current delivery part. Complete only that part, then STOP and invite Next; do not research later parts in this turn. Before the substantive output call study_delivery with action ready and the exact delivery_state; copy its output timestamp as the first line, retain next_delivery_state and show the continuation control. A plan or progress message does not complete a part. While a part remains pending, typed Next means the NEXT PART of the SAME passage: call study_delivery action next with next_delivery_state. Use action resume with delivery_state to recover an interrupted part. After the last part Next advances the passage; explicit Next passage always uses the ordinary passage continuation_state with study_plan. Do not force focused word/theme/dialogue tasks into passage translation; still timestamp their visible messages. Research only the active part, reuse prior verified evidence, retain depth/language/format, and keep consequential footnotes with translation. A structural handoff check is optional unless an actual contract needs validation; do not build and validate three large internal handoff packets routinely. Never claim the clock measures complete model thinking or the time the final character appeared. If a button is unavailable, accept typed Next. Do not imply a native ChatGPT suggestion button is controlled by this server.`;

const passageModes = new Set(['study_plan', 'standard_study', 'detailed_study', 'full_study', 'translation_only', 'exegesis_only', 'context_history']);
const titles = {translation_notes: 'Translation and footnotes', local_explanation: 'Local explanation and literary structure', historical_context: 'Historical-cultural context', canonical_synthesis: 'Canonical synthesis and formation'};
const instructionBundle = names => Object.fromEntries(names.map(section=>[section,bundle.documents[`skills/${section}/SKILL.md`]??bundle.documents[`references/${section}.md`]]));
const focusedInstructions = {word_study:['bible-exegesis'],theme_study:['bible-exegesis','bible-theology-review'],variant_reconciliation:['bible-textual-comparison','bible-reading-evaluation'],theology_check:['bible-theology-review'],dss_research:['bible-dss-research']};
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
  const rest = Object.fromEntries(['mode','reference','requested_reference','language','translation_format','study_depth','scope_policy','context_preface','textual_review_flags','continuation_state','translation_policy','budgets'].filter(key=>Object.hasOwn(plan,key)).map(key=>[key,plan[key]]));
  const instruction_bundle = instructionBundle(partRules[id].instructions);
  return bounded({...rest, instruction_bundle, part_sequence: sequence.map(part=>({id:part,title:titles[part]})), next_passage: plan.next, delivery_state: state, delivery: {mode: 'preview_one_part_per_turn', current_part: id, title: titles[id], part_number: state.stage_index + 1, total_parts: sequence.length, ...partRules[id], timestamp: timestamp(now, state.started_at), requires_next_for_more_parts: state.stage_index + 1 < sequence.length, instruction_priority: PREVIEW_ROUTER + ' Complete only this part, mark Ready, deliver it, and stop. Copy the provided part sequence exactly. Put numbered footnote markers at the affected wording and concise matching notes after the translation. Do not repeat the same decisions in another table or conclusion.'}}, 30000);
}
export async function previewPlan(engine, args, now = Date.now()) {
  const command = args.query.trim().toLowerCase();
  if (['debug','debug on','debug off'].includes(command)) return {status:'preview_debug_preferences',debug_mode:command!=='debug off',timestamp:timestamp(now),instruction:command==='debug off'?'Reduce visible diagnostic reporting in this conversation; preserve timestamps and evidence checks. No server-wide setting changed.':PREVIEW_DEBUG_INSTRUCTIONS};
  if (command === 'clock') return {status:'clock_check', timestamp:timestamp(now), instruction:'Use this real timestamp as the next message first line. It is not an exact rendering-completion time.'};
  if (['ready','next','resume'].includes(command) && args.study_state?.preview_delivery) return deliveryAction(engine,command,args.study_state.preview_delivery,now);
  // Normalize the ordinary trailing language wording seen in the reported test.
  const match = /\s+in (English|Engels|Dutch|Nederlands)\.?$/i.exec(args.query);
  const query = match ? args.query.slice(0, match.index) : args.query;
  const language = match ? /english|engels/i.test(match[1]) ? 'en' : 'nl' : args.language;
  const plan = await engine.plan(query, args.active_reference ?? null, language, args.translation_format, args.study_state ?? null, args.study_depth ?? null);
  if (!plan.continuation_state || !passageModes.has(plan.mode)) return bounded({...plan,...(focusedInstructions[plan.mode]?{instruction_bundle:instructionBundle(focusedInstructions[plan.mode])}:{}),preview_timestamp:timestamp(now)},30000);
  return partPlan(plan, {schema_version: 1, passage_state: plan.continuation_state, stage_index: 0, started_at: new Date(now).toISOString()}, now);
}
export async function deliveryAction(engine, action, state, now = Date.now()) {
  if (!['next', 'resume', 'ready'].includes(action)) throw new StudyError('delivery_action', 'Use next, resume or ready.');
  const {passage, sequence} = validateState(engine, state, now);
  if (action === 'ready') {
    const hasNext = state.stage_index + 1 < sequence.length;
    return {status: 'host_reports_part_ready', timestamp: timestamp(now, state.started_at), completed_part: sequence[state.stage_index], completed_title: titles[sequence[state.stage_index]], next_title: hasNext ? titles[sequence[state.stage_index + 1]] : 'Next passage', passage_complete: !hasNext, next_delivery_state: {...state}, next_action: 'next', button_label: hasNext ? `Next: ${titles[sequence[state.stage_index + 1]]}` : 'Next passage', instruction: 'Begin substantive output with timestamp.display. Deliver only the current part and then stop. Retain next_delivery_state for Next. If the host supports a clock call after substantive streaming, issue it and append the fresh timestamp in a separate closing message. Otherwise end with Last server check: timestamp.display; never label a pre-output check as output completion. Readiness is reported by the host; this tool does not certify the translation or interpretation.'};
  }
  if (action === 'next' && state.stage_index + 1 === sequence.length) {
    return previewPlan(engine, {query: 'Next', study_state: passage, language: passage.language, translation_format: passage.translation_format}, now);
  }
  const index = action === 'next' ? state.stage_index + 1 : state.stage_index;
  const plan = await engine.passagePlan(passage.request_mode, passage.current_reference, passage.language, passage.translation_format, passage.original_reference, passage.pending_references, null, passage.study_depth);
  return partPlan(plan, {schema_version: 1, passage_state: passage, stage_index: index, started_at: new Date(now).toISOString()}, now);
}
