// Preview-only, client-carried delivery state. No user content or timings are stored.
import {bounded, StudyError} from './common.js';
import {bundle} from './store.js';

export const PREVIEW_ROUTER = `PREVIEW ROUTER: Call study_plan once for the active part; read its instruction_bundle directly. Do not reread bundled skills or download broad method documents. For translation use this bounded sequence: (1) confirm selected literary/exact scope and the translation key, (2) retrieve the primary passage once, (3) investigate only a specific consequential reading or lexical problem if needed, (4) select one defensible main translation and attach numbered verse-linked footnotes, (5) make one completeness check against the retrieved passage, then call Ready and deliver. No routine handoff validation, repeated wording refinement, full-draft restart or calls to tools without a concrete source question. When the user restricts sources (for example WLC only), restrict evidence retrieval, NOT literary/exact scope, translation method/key, or previously established source-supported OT–NT wording connections. Never claim to have freshly checked an unconsulted witness. Reuse an established OT–NT connection without routinely retrieving the NT; check only if consequential wording remains unresolved. Consult LXX, DSS, lexicons or external sources only where the active translation needs a particular check and the user's source restriction permits it. Prefer Genesis 1:1 'In the beginning God created...' and footnote the temporal Hebrew alternative. Keep meaningful variants and uncertainty visible; retaining an attested base with a factual footnote does not require evaluate_reading. Formal reading evaluation is for a proposed primary-reading change or requested textual assessment. Do not invent evidence to save time. For controls, use preview_timestamp and study_delivery, or query Clock/Ready/Next/Resume through study_plan when a tool is not available. Follow the returned exact part titles and sequence.`;
export const PREVIEW_DEBUG_INSTRUCTIONS = `PREVIEW DIAGNOSTICS: Experimental observation is enabled. Do not interrupt translation with pre-batch progress reports or lengthy tool-use narration. At the end of each part, give a compact record of operations actually observed: consulted sources and counts when supplied, tools called if known, failed calls, and the server's stage-start/Ready checks. Distinguish tool server_execution_ms, asset/cache metrics, preparation interval and any user-supplied 'Worked for' measurement; none measures full client rendering or final-character completion. Do not invent total call counts, a model-thinking duration, error-free status or output-completion time. Do not dump raw packets, state, instructions or traces. Debug off reduces visible diagnostics; it does not disable tool-side measurement. The user can restore them with Debug on.`;

export const PREVIEW_INSTRUCTIONS = `PREVIEW ONE-PART DELIVERY: Preview-specific rules supersede the older complete-in-one-turn contract. At the start of a Preview study turn call preview_timestamp once before source retrieval (or study_plan query Clock if unavailable); display its real Amsterdam timestamp as the first line of the first visible reply. Call study_plan for the current part and use only its active instruction_bundle. Do not issue unnecessary intermediate assistant updates; do not call the clock for every paragraph. Before delivering the checked substantive part call study_delivery action ready using the exact delivery_state, and display the returned Ready timestamp as a PRE-OUTPUT SERVER CHECK rather than the moment of rendering completion. The returned stage_elapsed_seconds measures server-checked preparation, not end-to-end generation. Complete only that part, stop and invite Next; never research later parts in this turn. A pending typed Next advances the SAME passage's next part; Resume recovers an interrupted part; after the last part Next advances the passage, while explicit Next passage skips ahead. Retain scope/depth/language/format, source restrictions and verified evidence. Translation follows one targeted retrieval-and-rendering pass with numbered verse-linked footnotes and one completeness check. Never run check_handoff in Preview. Keep the translation rules and literary/exact scope even when evidence sources are restricted. Use established OT–NT links without repeated checking unless a specific unresolved question needs it. Do not force dialogue, theme or word studies through passage translation; still timestamp any visible reply. An optional final server check must be clearly labelled as a later check, never as an exact client output timestamp. A control button may not render in every client; typed Next remains valid. Do not claim the server controls native ChatGPT suggested replies.`;

const passageModes = new Set(['study_plan', 'standard_study', 'detailed_study', 'full_study', 'translation_only', 'exegesis_only', 'context_history']);
const titles = {translation_notes: 'Translation and footnotes', local_explanation: 'Local explanation and literary structure', historical_context: 'Historical-cultural context', canonical_synthesis: 'Canonical synthesis and formation'};
const instructionBundle = names => Object.fromEntries(names.map(section=>[section,bundle.documents[`skills/${section}/SKILL.md`]??bundle.documents[`references/${section}.md`]]));
const focusedInstructions = {word_study:['bible-exegesis'],theme_study:['bible-exegesis','bible-theology-review'],variant_reconciliation:['bible-textual-comparison','bible-reading-evaluation'],theology_check:['bible-theology-review'],dss_research:['bible-dss-research']};
const restrictedWitnesses = new Set(['WLC', 'UXLC', 'TAHOT', 'LXX', 'SBLGNT', 'DSS']);
function extractSourceRestriction(query) {
  const patterns = [
    /(?:,?\s+)(?:using|with|from)\s+only\s+(WLC|UXLC|TAHOT|LXX|SBLGNT|DSS)\s*$/i,
    /(?:,?\s+)(?:using|with|from)\s+(WLC|UXLC|TAHOT|LXX|SBLGNT|DSS)\s+only\s*$/i,
    /(?:,?\s+)(WLC|UXLC|TAHOT|LXX|SBLGNT|DSS)(?:-only|\s+only)\s*$/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(query);
    if (match) return {query: query.slice(0, match.index).trim().replace(/,\s*$/, ''), witness: match[1].toUpperCase()};
  }
  return {query, witness: null};
}

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
  if (!state || Object.keys(state).some(key => !['passage_state','schema_version','stage_index','started_at','source_restriction'].includes(key)) || !['passage_state','schema_version','stage_index','started_at'].every(key => Object.hasOwn(state,key)) || (state.source_restriction !== undefined && !restrictedWitnesses.has(state.source_restriction)) || state.schema_version !== 1 || !Number.isInteger(state.stage_index) || typeof state.started_at !== 'string' || !Number.isFinite(Date.parse(state.started_at)) || Date.parse(state.started_at) > now || now - Date.parse(state.started_at) > 30 * 86400000) throw new StudyError('delivery_state', 'Use the exact recent delivery_state returned by Preview.');
  const passage = engine.state(state.passage_state);
  if (!passageModes.has(passage.request_mode)) throw new StudyError('delivery_state', 'This focused task does not use passage delivery parts.');
  const sequence = stages(passage.request_mode, passage.study_depth);
  if (state.stage_index < 0 || state.stage_index >= sequence.length) throw new StudyError('delivery_state', 'Invalid delivery part index.');
  return {passage, sequence};
}
const partRules = {
  translation_notes: {output: 'One defensible complete working translation of the selected literary/exact unit; place numbered markers at consequential verses and concise matching footnotes after it. Give the main reading rather than multiple competing draft translations. No central thesis or later study sections.', research: 'Retrieve the bounded primary passage once and prior discourse only when needed. Reuse established, source-supported OT–NT wording links; do not routinely retrieve the NT, other editions or a lexicon to restate settled findings. Compare LXX/DSS/lexicons only for an identified consequential question, when permitted by source constraints; not as an automatic checklist. No historical surveys, full word studies or canonical dossiers. A user restriction on witnesses never cancels scope policy or the translation key.', instructions: ['bible-source-retrieval', 'bible-translation', 'translation-key'], stop: 'Once the translation and notes are checked and delivered, stop this turn. Next requests local explanation.'},
  local_explanation: {output: 'Local meaning, argument, relevant terms/names and literary structure at the retained depth.', research: 'Reuse the translation evidence. Retrieve only an unresolved local-context question. Defer broad historical comparison and canonical synthesis.', instructions: ['bible-exegesis'], stop: 'Once local explanation is checked and delivered, stop this turn.'},
  historical_context: {output: 'Relevant historical-cultural context and specific comparisons; distinguish evidence from interpretation.', research: 'Reuse prior evidence. Investigate only concrete historical questions needed for this part; no general survey or collection of agreeing sources.', instructions: ['bible-exegesis'], stop: 'Once relevant historical context is checked and delivered, stop this turn.'},
  canonical_synthesis: {output: 'Bounded canonical development, theological synthesis, formation implications and a compact conclusion without repeating prior sections.', research: 'Retrieve only the canonical anchors needed for this synthesis, reusing already checked passages. Review new or inconsistent claims; do not restart the full study.', instructions: ['bible-theology-review'], stop: 'Once synthesis is checked and delivered, this passage study is complete.'},
};
function partPlan(plan, state, now) {
  const sequence = stages(plan.mode, plan.study_depth), id = sequence[state.stage_index];
  const rest = Object.fromEntries(['mode','reference','requested_reference','language','translation_format','study_depth','scope_policy','context_preface','textual_review_flags','continuation_state','translation_policy','budgets'].filter(key=>Object.hasOwn(plan,key)).map(key=>[key,plan[key]]));
  const instruction_bundle = instructionBundle(partRules[id].instructions);
  const translation_workflow = id === 'translation_notes' ? {steps: ['confirm_scope_and_translation_key', 'retrieve_bounded_primary_once', 'resolve_only_consequential_questions', 'draft_single_main_translation_with_verse_linked_notes', 'one_completeness_check_then_ready'], additional_witness_rule: 'Targeted consequential checks only, subject to source restrictions.', retained_policy_under_source_restrictions: ['literary_and_exact_scope', 'translation_key', 'established_OT_NT_wording_links'], handoff_validation: 'not_used_in_preview'} : undefined;
  return bounded({...rest, instruction_bundle, ...(translation_workflow ? {translation_workflow} : {}), ...(state.source_restriction ? {source_restriction: {allowed_sources: [state.source_restriction], excludes_other_witnesses: true, instruction: 'Fetch only the named witness. Preserve the translation key, literary/exact scope and established wording links without claiming new checks of excluded witnesses.'}} : {}), part_sequence: sequence.map(part=>({id:part,title:titles[part]})), next_passage: plan.next, delivery_state: state, delivery: {mode: 'preview_one_part_per_turn', current_part: id, title: titles[id], part_number: state.stage_index + 1, total_parts: sequence.length, ...partRules[id], timestamp: timestamp(now, state.started_at), requires_next_for_more_parts: state.stage_index + 1 < sequence.length, instruction_priority: PREVIEW_ROUTER + ' Complete the active part only. For translation use one main rendering and a single completeness review, then mark Ready and deliver without another revision loop. Use the exact part titles; numbered footnote markers belong at affected wording and matching notes follow. Do not duplicate decisions in tables or conclusions.'}}, 30000);
}
export async function previewPlan(engine, args, now = Date.now()) {
  const command = args.query.trim().toLowerCase();
  if (['debug','debug on','debug off'].includes(command)) return {status:'preview_debug_preferences',debug_mode:command!=='debug off',timestamp:timestamp(now),instruction:command==='debug off'?'Reduce visible diagnostic reporting in this conversation; preserve timestamps and evidence checks. No server-wide setting changed.':PREVIEW_DEBUG_INSTRUCTIONS};
  if (command === 'clock') return {status:'clock_check', timestamp:timestamp(now), instruction:'Use this real timestamp as the next message first line. It is not an exact rendering-completion time.'};
  if (['ready','next','resume'].includes(command) && args.study_state?.preview_delivery) return deliveryAction(engine,command,args.study_state.preview_delivery,now);
  // Normalize the ordinary trailing language wording seen in the reported test.
  const sourceConstraint = extractSourceRestriction(args.query);
  const match = /\s+in (English|Engels|Dutch|Nederlands)\.?$/i.exec(sourceConstraint.query);
  const query = match ? sourceConstraint.query.slice(0, match.index) : sourceConstraint.query;
  const language = match ? /english|engels/i.test(match[1]) ? 'en' : 'nl' : args.language;
  const plan = await engine.plan(query, args.active_reference ?? null, language, args.translation_format, args.study_state ?? null, args.study_depth ?? null);
  const witness = sourceConstraint.witness ?? args._retained_restriction ?? null;
  if (witness && !restrictedWitnesses.has(witness)) throw new StudyError('source_restriction', 'Unknown restricted witness.');
  if (!plan.continuation_state || !passageModes.has(plan.mode)) return bounded({...plan,...(focusedInstructions[plan.mode]?{instruction_bundle:instructionBundle(focusedInstructions[plan.mode])}:{}), ...(witness ? {source_restriction: {allowed_sources: [witness], excludes_other_witnesses: true}} : {}),preview_timestamp:timestamp(now)},30000);
  return partPlan(plan, {schema_version: 1, passage_state: plan.continuation_state, stage_index: 0, started_at: new Date(now).toISOString(), ...(witness ? {source_restriction: witness} : {})}, now);
}
export async function deliveryAction(engine, action, state, now = Date.now()) {
  if (!['next', 'resume', 'ready'].includes(action)) throw new StudyError('delivery_action', 'Use next, resume or ready.');
  const {passage, sequence} = validateState(engine, state, now);
  if (action === 'ready') {
    const hasNext = state.stage_index + 1 < sequence.length;
    return {status: 'host_reports_part_ready', timestamp: timestamp(now, state.started_at), completed_part: sequence[state.stage_index], completed_title: titles[sequence[state.stage_index]], next_title: hasNext ? titles[sequence[state.stage_index + 1]] : 'Next passage', passage_complete: !hasNext, next_delivery_state: {...state}, next_action: 'next', button_label: hasNext ? `Next: ${titles[sequence[state.stage_index + 1]]}` : 'Next passage', instruction: 'Begin substantive output with timestamp.display. Deliver only the current part and then stop. Retain next_delivery_state for Next. If the host supports a clock call after substantive streaming, issue it and append the fresh timestamp in a separate closing message. Otherwise end with Last server check: timestamp.display; never label a pre-output check as output completion. Readiness is reported by the host; this tool does not certify the translation or interpretation.'};
  }
  if (action === 'next' && state.stage_index + 1 === sequence.length) {
    return previewPlan(engine, {query: 'Next', study_state: passage, language: passage.language, translation_format: passage.translation_format, _retained_restriction: state.source_restriction ?? null}, now);
  }
  const index = action === 'next' ? state.stage_index + 1 : state.stage_index;
  const plan = await engine.passagePlan(passage.request_mode, passage.current_reference, passage.language, passage.translation_format, passage.original_reference, passage.pending_references, null, passage.study_depth);
  return partPlan(plan, {schema_version: 1, passage_state: passage, stage_index: index, started_at: new Date(now).toISOString(), ...(state.source_restriction ? {source_restriction: state.source_restriction} : {})}, now);
}
