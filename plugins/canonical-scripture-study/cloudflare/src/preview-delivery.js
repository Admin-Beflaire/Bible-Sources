import {GENESIS_MAPPING_GUIDANCE} from './preview-genesis.js';
// Preview-only, client-carried delivery state. No user content or timings are stored.
import {bounded, config, StudyError} from './common.js';
import {bundle} from './store.js';
import {normalizePreviewRequest, planningRecovery} from './preview-request.js';
import {interpretationWorkflow, interpretationOutput} from './interpretation.js';

export const PREVIEW_ROUTER = `Preview study routing: call study_plan first and use its current part, instruction_bundle, retrieval_plan and output_contract. A successful plan is required before scripture retrieval. On error or needs_input follow recovery, repair or clarify the request and retry study_plan; never bypass a failed plan with direct retrieval or get_study_instructions. The bundled skills and translation key are already loaded; do not fetch them again. Restrict source retrieval as requested while retaining translation rules and scope_policy. Use only documented sources and detail text or linguistic. If preview_timestamp or study_delivery is unavailable, use study_plan: Clock; Ready, Next or Resume with study_state={preview_delivery: delivery_state}. Next passage explicitly advances the passage. Copy the exact returned part titles. Produce one defensible main translation with numbered markers beside affected wording and concise matching footnotes. Reuse established source-supported OT–NT wording links; verify a new or unresolved link only when it materially changes this translation. Refine wording once against the evidence, then deliver; reopen only a specific unresolved or inconsistent choice. check_handoff is removed from Preview: do not construct stage envelopes or call a cached handoff tool. Retaining an attested base with an alternative footnote needs no evaluate_reading; use it for a proposed primary-reading change or requested textual assessment. Never weaken source checks or invent evidence.`;
export const PREVIEW_DEBUG_INSTRUCTIONS = `PREVIEW DEBUG MODE: Give compact observed diagnostics by default; Debug off/on changes visible reporting only in this conversation. Summarize actual tools, retrieved editions/record counts, server_execution_ms, cache metrics and failures with their operation IDs. Group related operations instead of narrating every call. Distinguish completed, failed and deferred work. Do not disclose private reasoning, dump packets/state, repeat instructions or invent counts. End with the exact next title and a short actual-checks summary. A server clock, part readiness, and host output completion are different events. The server cannot observe final text or rendering completion; say Last server check unless an actual post-output check is available. Server execution is not model thinking, Worked for time or end-to-end latency.`;

export const PREVIEW_INSTRUCTIONS = `PREVIEW TIMING AND STAGED DELIVERY OVERRIDE: These Preview-only rules supersede complete-in-one-turn delivery in the study documents. Before any visible study orientation or progress, call study_plan. Its output_contract.progress gives the required timestamp-first layout; copy its first_line before the initial orientation. For dialogue use preview_timestamp, or study_plan Clock when the new tool is unavailable. Put a freshly returned server timestamp first on visible messages; reuse the clock from the just-completed tool rather than adding a redundant Clock call. Never invent clock values or treat them as rendering times. For passage studies complete only the active delivery part, then STOP and invite Next. Research no later part. Before substantive output call study_delivery ready with the exact delivery_state; copy timestamp.display, retain next_delivery_state and show the continuation control. Ready means prepared for host output, not output completed. Typed Next continues the same passage's next part using next_delivery_state; Resume repeats an interrupted part. After the last part Next advances the passage. Explicit Next passage works through study_plan with the retained state. Retain depth, language, format, source restrictions and scope. Sources-only restrictions do not disable the translation key or literary-unit policy, and never imply excluded editions were consulted. Do not build or validate structural handoffs; Preview does not expose check_handoff. Reuse verified evidence and established wording links; check only consequential gaps, choose one main rendering, attach meaningful footnotes, and deliver. Do not force word/theme/dialogue requests into passage translation. If a post-output clock call is supported, label it Server check after output; otherwise label the footer Last server check. Never claim to know exact final-character or client-rendering completion. Typed Next remains the UI fallback.`;

const passageModes = new Set(['study_plan', 'standard_study', 'detailed_study', 'full_study', 'translation_only', 'exegesis_only', 'context_history']);
const titles = {translation_notes: 'Translation and footnotes', local_explanation: 'Local explanation and literary structure', historical_context: 'Historical-cultural context', canonical_synthesis: 'Canonical synthesis and formation'};
const instructionBundle = names => Object.fromEntries(names.map(section=>[section,bundle.documents[`skills/${section}/SKILL.md`]??bundle.documents[`references/${section}.md`]]));
const focusedInstructions = {word_study:['word-study'],theme_study:['bible-exegesis','bible-theology-review'],variant_reconciliation:['bible-textual-comparison','bible-reading-evaluation'],theology_check:['bible-theology-review'],dss_research:['bible-dss-research']};
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
  return {iso: date.toISOString(), display: `${parts.day}-${parts.month}-${parts.year} ${parts.hour}:${parts.minute}:${parts.second} (${parts.timeZoneName}, Europe/Amsterdam)`, time_zone: 'Europe/Amsterdam', ...(startedAt ? {stage_elapsed_seconds: Math.round((now - Date.parse(startedAt)) / 100) / 10} : {}), measures: 'Server clock check; not client rendering or final-message completion.', visible_message_rule: 'Copy display as the first line of the next visible assistant message, including brief orientation and progress updates. Use the newest clock already returned by a tool; do not add a redundant clock call or invent a time.'};
}
function progressContract(now) {
  return {first_line: timestamp(now).display, applies_to: 'Every visible assistant message: initial orientation, intermediate progress, continuation and substantive output.', format: 'Timestamp on its own first line, blank line, then one or two sentences about the passage or actual evidence. No internal-rule or publisher-review narration.', refresh: 'Reuse the newest preview_clock.display or timestamp.display returned by the just-completed tool. Do not make an extra Clock call just to repeat that clock.', host_limit: 'This is a host presentation instruction, not proof of rendering or output completion.'};
}
function validateState(engine, state, now) {
  const required = ['passage_state','schema_version','stage_index','started_at'];
  if (!state || required.some(key=>!Object.hasOwn(state,key)) || Object.keys(state).some(key=>![...required,'sources','source_restriction'].includes(key)) || state.schema_version !== 1 || !Number.isInteger(state.stage_index) || typeof state.started_at !== 'string' || !Number.isFinite(Date.parse(state.started_at)) || Date.parse(state.started_at) > now || now - Date.parse(state.started_at) > 30 * 86400000) throw new StudyError('delivery_state', 'Use the exact recent delivery_state returned by Preview.');
  if (state.source_restriction !== undefined && (!RESTRICTION_NAMES.includes(state.source_restriction) || state.sources && (state.sources.length!==1 || state.sources[0]!==state.source_restriction))) throw new StudyError('delivery_state','Invalid retained source restriction.');
  validateSources(state.sources);
  const passage = engine.state(state.passage_state);
  if (!passageModes.has(passage.request_mode)) throw new StudyError('delivery_state', 'This focused task does not use passage delivery parts.');
  const sequence = stages(passage.request_mode, passage.study_depth);
  if (state.stage_index < 0 || state.stage_index >= sequence.length) throw new StudyError('delivery_state', 'Invalid delivery part index.');
  return {passage, sequence};
}
export const SOURCE_NAMES = ['WLC','UXLC','TAHOT','LXX','SBLGNT'];
export const RESTRICTION_NAMES = [...SOURCE_NAMES,'DSS'];
const retainedSources = state => state?.sources ?? (state?.source_restriction ? [state.source_restriction] : null);
const sourceState = sources => sources ? {sources,...(sources.length===1?{source_restriction:sources[0]}:{})} : {};
function validateSources(sources) {
  if (sources != null && (!Array.isArray(sources) || sources.length < 1 || sources.length > 4 || sources.some(s=>!RESTRICTION_NAMES.includes(s)) || new Set(sources).size !== sources.length || sources.includes('DSS') && sources.length!==1)) throw new StudyError('sources', 'Use one to four distinct named editions, or DSS only for fragmentary evidence.');
}
function sourceOptions(query, explicit, retained = null) {
  const named = [], clauses = [];
  const patterns=[/(?:,?\s+)(?:using|with|from)\s+only\s+(WLC|UXLC|TAHOT|LXX|SBLGNT|DSS)\s*$/i,/(?:,?\s+)(?:using|with|from)\s+(WLC|UXLC|TAHOT|LXX|SBLGNT|DSS)\s+only\s*$/i,/(?:,?\s+)(WLC|UXLC|TAHOT|LXX|SBLGNT|DSS)(?:-only|\s+only)\s*$/i];
  for(const pattern of patterns) {const match=pattern.exec(query);if(match){named.push(match[1].toUpperCase());query=query.slice(0,match.index).trim().replace(/,\s*$/,'');break;}}
  const clause = /^(?:(?:sources?|using|with|from)\s*[:=]?\s*)?(?:only\s+)?((?:WLC|UXLC|TAHOT|LXX|SBLGNT|DSS)(?:\s*(?:\+|&|and)\s*(?:WLC|UXLC|TAHOT|LXX|SBLGNT|DSS))*)(?:[\s-]+only)?$/i;
  for (const part of query.split(/,\s*/)) {
    const match = clause.exec(part.trim());
    if (match) named.push(...match[1].toUpperCase().match(/WLC|UXLC|TAHOT|LXX|SBLGNT|DSS/g));
    else clauses.push(part);
  }
  let text = clauses.join(', ').trim();
  const trailing = /\s+(?:using\s+)?(WLC|UXLC|TAHOT|LXX|SBLGNT)[\s-]+only$/i.exec(text);
  if (trailing) {named.push(trailing[1].toUpperCase()); text = text.slice(0,trailing.index);}
  const parsed = named.length ? [...new Set(named)] : null;
  validateSources(explicit); validateSources(retained); validateSources(parsed);
  if (explicit != null && parsed && (explicit.length !== parsed.length || explicit.some(s=>!parsed.includes(s)))) throw new StudyError('sources', 'The sources argument and query restriction disagree.');
  return {query:text, sources:explicit ?? parsed ?? retained};
}
const partRules = {
  translation_notes: {output: 'Complete working translation of the selected unit with one defensible main rendering and numbered consequential footnotes. No central thesis or later study sections.', research: 'Fetch the bounded passage once using retrieval_plan. Inspect its opening; retrieve preceding discourse only if needed. Check only consequential textual/lexical gaps allowed by source_policy. Reuse established source-supported wording links and do not routinely fetch John 1 or refine several competing drafts. No historical surveys, full word studies or canonical dossiers. A targeted external lookup needs both source-policy permission and an unresolved consequential rendering.', instructions: ['bible-source-retrieval', 'bible-translation', 'translation-key'], stop: 'Deliver the checked translation and notes, then stop this turn. Follow the returned next title; translation-only completes this passage task.'},
  local_explanation: {output: 'Connected local argument, relevant terms/names and literary structure; independently discovered serious readings with their best evidence, substantial objections and gaps at the retained depth.', research: 'Reuse translation evidence. Check unresolved linguistic, literary and necessary historical questions that distinguish readings. At every depth allow a targeted ambiguity-driven research expansion within source_policy; defer wider historical development and canonical synthesis.', instructions: ['bible-exegesis'], stop: 'Once local explanation and the serious interpretive cases are checked and delivered, stop this turn.'},
  historical_context: {output: 'Relevant historical-cultural context and specific comparisons; distinguish evidence from interpretation.', research: 'Reuse prior evidence. Investigate only concrete historical questions needed for this part; no general survey or collection of agreeing sources.', instructions: ['bible-exegesis'], stop: 'Once relevant historical context is checked and delivered, stop this turn.'},
  canonical_synthesis: {output: 'Bounded canonical development, theological synthesis, formation implications and a compact conclusion without repeating prior sections. At Full depth, distinguish narrative trajectory, intertextual evidence and Christ/Spirit integration, then finish with supporting reference material from actual study evidence.', research: 'Retrieve only the canonical anchors needed for this synthesis, reusing already checked passages. Review new or inconsistent claims; do not restart the full study or retrieve again merely to populate reference tables.', instructions: ['bible-theology-review'], stop: 'Once synthesis and applicable reference material are checked and delivered, this passage study is complete.'},
};
function outputContract(engine, state, now, debug = true) {
  const passage = state.passage_state, sequence = stages(passage.request_mode, passage.study_depth), id = sequence[state.stage_index];
  const clock = timestamp(now, state.started_at), next = sequence[state.stage_index + 1];
  const p = engine.refs.parse(passage.current_reference);
  const includesGen130 = p.book === 'Gen' && p.start_chapter === 1 && (p.start_verse <= 30 && (p.end_chapter > 1 || p.end_verse >= 30));
  return {
    ...(debug ? {first_line:clock.display,progress:progressContract(now)} : {}),
    heading: `## ${passage.current_reference} — ${titles[id]}`,
    reader_focus: config('method').reader_output_policy,
    source_line: 'Name only actually consulted editions using their reader-facing edition_label. Keep dataset_id in enabled diagnostics or an explicit technical export. Cite known biblical connections normally without narrating reviewed policy or claiming a new source retrieval.',
    scope_preface: 'At most two sentences for a necessary literary-unit adjustment or dependent opening, then begin the active part. Do not put a stage overview table before the translation.',
    interpretation:interpretationOutput(id,passage.study_depth),
    section_order: id === 'translation_notes' ? ['Working translation', 'Numbered footnotes', ...(debug?['Compact observed diagnostics','Server-check footer']:[]), 'Continuation label'] : [...(passage.study_depth === 'full' && id === 'canonical_synthesis' ? ['Narrative trajectory','Intertextual connections','Christ and the Spirit','Theological synthesis and formation','Reference material'] : [titles[id]]), ...(debug?['Compact observed diagnostics','Server-check footer']:[]), 'Continuation label'],
    ...(passage.study_depth === 'full' && ['local_explanation','canonical_synthesis'].includes(id) ? {full_study: {...config('method').full_study_policy, active_focus: id === 'local_explanation' ? 'Develop the consequential words, grammar, names and images in their actual verses. Keep later canonical synthesis for its own part.' : 'Explain the connections and theological conclusions, then consolidate reference support using earlier evidence and sources. Include the key-term table without repeating full earlier explanations.'}} : {}),
    ...(id === 'translation_notes' ? {
      footnotes: {format: 'Numbered paragraphs matching markers beside affected wording; no separate heading for each note.', length: 'Usually two to four sentences per note; expand only to explain a consequential grammatical or textual choice and its meaningful alternative.', scope: 'Explain the affected rendering, evidence and uncertainty. Defer extended word studies, anthropology, doctrinal argument and historical surveys to the relevant later part. Full depth does not turn translation footnotes into later study sections.'},
      ...(includesGen130 ? {wording_checks: [{reference: 'Genesis 1:30', instruction: 'Render the clause containing nephesh chayyah naturally in context (English working prose can say “that has life”). Do not leave the interlinear gloss “living life” in the working translation. Do not impose one fixed gloss or settle human ontology in this note.'}]} : {}),
    } : {}),
    ...(debug ? {diagnostics:'Report only observed diagnostic metrics and never invented host timings.'} : {}),
    closing_lines: [...(debug ? [`Last server check: ${clock.display}`] : []), next ? `Next: ${titles[next]}` : 'Next passage'],
    instruction:debug?'Use the fresh output_contract including its timestamp. Deliver only this part and stop. Ready is not output completion.':'Deliver only this part and stop. Do not add diagnostics, clock stamps or timing footers. Ready is not output completion.',
  };
}
function partPlan(engine, plan, state, now, debug = true) {
  const sequence = stages(plan.mode, plan.study_depth), id = sequence[state.stage_index];
  const rest = Object.fromEntries(['mode','reference','requested_reference','language','translation_format','study_depth','scope_policy','literary_unit_suggestions','boundary_status','context_preface','textual_review_flags','continuation_state','translation_policy','budgets'].filter(key=>Object.hasOwn(plan,key)).map(key=>[key,plan[key]]));
  const activeRules = id === 'canonical_synthesis' && plan.study_depth === 'full' ? {...partRules[id], instructions:['bible-exegesis','bible-theology-review']} : partRules[id];
  const instruction_bundle = instructionBundle(activeRules.instructions);
  const restriction=retainedSources(state);
  const routes = engine.refs.books[engine.refs.parse(plan.reference).book].routes, sources = restriction ?? [routes.WLC?'WLC':'SBLGNT'];
  if (sources.some(s=>s!=='DSS'&&!routes[s])) throw new StudyError('sources', 'A selected edition is unavailable for this passage. Keep the restriction and report the gap; do not silently substitute another edition.');
  const source_policy = {restricted:restriction != null, allowed_editions:restriction, secondary_lookups_allowed:restriction == null, external_research_allowed:restriction == null,
    instruction:'Source restrictions govern evidence retrieval, not translation rules, language, literary scope or continuation. Honour excluded comparisons and secondary lookups; label coverage limits and never say excluded sources were consulted.'};
  const retrieval_plan = id === 'translation_notes' ? sources[0]==='DSS' ? [{tool:'fetch_dss',arguments:{reference:plan.reference,cursor:0,limit:1,include_linguistics:true}}] : [{tool:'fetch_passage',arguments:{reference:plan.reference,sources,detail:plan.translation_format==='plain_working'?'text':'linguistic'}}] : [];
  const translation_workflow = id === 'translation_notes' ? {steps:['confirm_scope_and_translation_key','retrieve_bounded_primary_once','resolve_only_consequential_questions','draft_single_main_translation_with_verse_linked_notes','one_completeness_check_then_ready'],additional_witness_rule:'Targeted consequential checks only, subject to source restrictions.',retained_policy_under_source_restrictions:['literary_and_exact_scope','translation_key','established_OT_NT_wording_links'],handoff_validation:'not_used_in_preview'} : null;
  return bounded({...rest, planning_status:'ready', can_retrieve:true, source_policy, interpretation_workflow:interpretationWorkflow(id,plan.study_depth,source_policy), retrieval_plan, instruction_bundle, ...(engine.refs.parse(plan.reference).book==='Gen'?{genesis_mapping_guidance:GENESIS_MAPPING_GUIDANCE}:{}), output_contract:outputContract(engine,state,now,debug),...(debug?{progress_contract:progressContract(now)}:{}),...(translation_workflow?{translation_workflow}:{}),...(restriction?{source_restriction:{allowed_sources:restriction,excludes_other_witnesses:true}}:{}),...(sources[0]==='DSS'?{coverage_instruction:'DSS is paginated fragmentary evidence. Do not invent a complete translation or substitute another witness for missing coverage.'}:{}), part_sequence: sequence.map(part=>({id:part,title:titles[part]})), next_passage: plan.next, delivery_state: state, delivery: {mode: 'preview_one_part_per_turn', current_part: id, title: titles[id], part_number: state.stage_index + 1, total_parts: sequence.length, ...activeRules, ...(debug?{timestamp:timestamp(now,state.started_at)}:{}), requires_next_for_more_parts: state.stage_index + 1 < sequence.length, instruction_priority:'Complete only this part using source_policy, retrieval_plan, output_contract and the bundled instructions. Make a single completeness review, mark Ready, deliver and stop. Copy the exact part sequence and keep numbered notes beside affected wording. Do not repeat decisions in another table or conclusion.'}}, 30000);
}
export async function previewPlan(engine, args, now = Date.now(), debug = true) {
  try {
    const query = normalizePreviewRequest(args.query);
    const result = await planRequest(engine, {...args,query}, now, debug);
    return {...result,...(query !== args.query.trim() ? {request_normalization:{normalized_query:query,method:'recognized_request_phrasing'}} : {})};
  } catch (error) {
    if (error instanceof StudyError) error.previewRecovery = planningRecovery(error.code);
    throw error;
  }
}
async function planRequest(engine, args, now, debug = true) {
  const command = args.query.toLowerCase();
  if (['debug','debug on','debug off'].includes(command)) return {status:'preview_debug_preferences',debug_mode:command!=='debug off',timestamp:timestamp(now),instruction:command==='debug off'?'Reduce visible diagnostic reporting in this conversation; preserve timestamps and evidence checks. No server-wide setting changed.':PREVIEW_DEBUG_INSTRUCTIONS};
  if (command === 'clock') return {status:'clock_check', timestamp:timestamp(now), instruction:'Use this real timestamp as the next message first line. It is not an exact rendering-completion time.'};
  if (['ready','next','resume'].includes(command) && args.study_state?.preview_delivery) return deliveryAction(engine,command,args.study_state.preview_delivery,now,debug);
  // Normalize the ordinary trailing language wording seen in the reported test.
  const retained = args.study_state?.preview_delivery;
  if (retained) validateState(engine, retained, now);
  const options = sourceOptions(args.query, args.sources, retainedSources(retained) ?? (args._retained_restriction?[args._retained_restriction]:null));
  const match = /\s+in (English|Engels|Dutch|Nederlands)\.?$/i.exec(options.query);
  const normalized = match ? options.query.slice(0,match.index).trim().replace(/,\s*$/,'') : options.query;
  const language = match ? /english|engels/i.test(match[1]) ? 'en' : 'nl' : args.language;
  const query = /^(?:next|volgende) passage$/i.test(normalized) ? 'Next' : normalized;
  const plan = await engine.plan(query, args.active_reference ?? null, language, args.translation_format, retained?.passage_state ?? args.study_state ?? null, args.study_depth ?? null, {inspectOpening:false});
  if (plan.status === 'needs_input') return {...plan,...planningRecovery('needs_input'),planning_status:'needs_input',...(debug?{preview_timestamp:timestamp(now),progress_contract:progressContract(now)}:{})};
  if (!plan.continuation_state || !passageModes.has(plan.mode)) {
    const restricted=options.sources != null;
    const source_policy={...plan.source_policy,restricted,allowed_editions:options.sources,secondary_lookups_allowed:!restricted,external_research_allowed:!restricted};
    return bounded({...plan,source_policy,...(['word_study','theme_study','theology_check'].includes(plan.mode)?{interpretation_workflow:interpretationWorkflow('focused',plan.study_depth,source_policy)}:{}),...(focusedInstructions[plan.mode]?{planning_status:'ready',can_retrieve:true,reader_output_policy:config('method').reader_output_policy,instruction_bundle:instructionBundle(focusedInstructions[plan.mode])}:{}),...(options.sources?{source_restriction:{allowed_sources:options.sources,excludes_other_witnesses:true}}:{}),...(debug?{preview_timestamp:timestamp(now),progress_contract:progressContract(now)}:{})},30000);
  }
  return partPlan(engine, plan, {schema_version: 1, passage_state: plan.continuation_state, stage_index: 0, started_at: new Date(now).toISOString(),...sourceState(options.sources)}, now, debug);
}
export async function deliveryAction(engine, action, state, now = Date.now(), debug = true) {
  if (!['next', 'resume', 'ready'].includes(action)) throw new StudyError('delivery_action', 'Use next, resume or ready.');
  const {passage, sequence} = validateState(engine, state, now);
  if (action === 'ready') {
    const hasNext = state.stage_index + 1 < sequence.length;
    return {status: 'host_reports_part_ready', output_status:'awaiting_host_output', output_completion_observed:false, ...(debug?{timestamp:timestamp(now,state.started_at)}:{}), output_contract:outputContract(engine,state,now,debug), completed_part: sequence[state.stage_index], completed_title: titles[sequence[state.stage_index]], next_title: hasNext ? titles[sequence[state.stage_index + 1]] : 'Next passage', passage_complete: !hasNext, next_delivery_state: {...state}, next_action: 'next', button_label: hasNext ? `Next: ${titles[sequence[state.stage_index + 1]]}` : 'Next passage', instruction:debug?'Use output_contract with its timestamp. Deliver only this part and stop; retain Next state. Do not equate Ready with output completion.':'Deliver only this part and stop, keeping the Next continuation state. No diagnostic metrics or server timings.'};
  }
  if (action === 'next' && state.stage_index + 1 === sequence.length) {
    return previewPlan(engine, {query: 'Next', study_state: passage, sources:retainedSources(state), language: passage.language, translation_format: passage.translation_format}, now, debug);
  }
  const index = action === 'next' ? state.stage_index + 1 : state.stage_index;
  const plan = await engine.passagePlan(passage.request_mode, passage.current_reference, passage.language, passage.translation_format, passage.original_reference, passage.pending_references, null, passage.study_depth, null, {inspectOpening:false});
  return partPlan(engine, plan, {schema_version: 1, passage_state: passage, stage_index: index, started_at: new Date(now).toISOString(),...sourceState(retainedSources(state))}, now, debug);
}
