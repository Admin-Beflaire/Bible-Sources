import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import {Engine} from '../src/engine.js';
import {SourceStore} from '../src/store.js';
import {timestamp, previewPlan, deliveryAction} from '../src/preview-delivery.js';
import {previewWidget} from '../src/preview-widget.js';
const here = dirname(fileURLToPath(import.meta.url));
const make = () => new Engine(new SourceStore({fetch: async req => new Response(readFileSync(resolve(here, '../generated/assets', new URL(req.url).pathname.slice(1))))}));
const start = Date.parse('2026-10-13T12:00:00Z');

test('European timestamps preserve Amsterdam DST and distinguish clock checks from rendering', () => {
  assert.match(timestamp(start).display, /^13-10-2026 14:00:00 /);
  assert.match(timestamp(Date.parse('2026-12-13T12:00:00Z')).display, /^13-12-2026 13:00:00 /);
  assert.equal(timestamp(start + 224000, new Date(start).toISOString()).stage_elapsed_seconds, 224);
  assert.match(timestamp(start).measures, /not client rendering/);
});
test('Full study advances parts on the same passage, preserves preferences, and advances passage only last', async () => {
  const e = make(); let plan = await previewPlan(e, {query: 'Full study Genesis 1 in English'}, start);
  assert.equal(plan.reference, 'Genesis 1:1-2:3');
  assert.equal(plan.delivery.current_part, 'translation_notes');
  assert.equal(plan.delivery.total_parts, 4);
  assert.ok(!Object.hasOwn(plan, 'study_plan'));
  for (const [i, part] of ['translation_notes','local_explanation','historical_context','canonical_synthesis'].entries()) {
    assert.equal(plan.delivery.current_part, part);
    assert.equal(plan.reference, 'Genesis 1:1-2:3');
    assert.equal(plan.study_depth, 'full');
    const before = JSON.stringify(plan.delivery_state);
    const ready = await deliveryAction(e, 'ready', plan.delivery_state, start + (i + 1) * 1000);
    assert.equal(JSON.stringify(plan.delivery_state), before);
    assert.equal(ready.passage_complete, i === 3);
    const retry = await deliveryAction(e, 'resume', plan.delivery_state, start + (i + 1) * 1000);
    assert.equal(retry.delivery.current_part, part);
    plan = await deliveryAction(e, 'next', ready.next_delivery_state, start + (i + 1) * 1000);
  }
  assert.equal(plan.reference, 'Genesis 2:4-25');
  assert.equal(plan.delivery.current_part, 'translation_notes');
  const nl = await previewPlan(e, {query: 'Detailed study Genesis 1:1-3, exact', language: 'nl', translation_format: 'original_interlinear'}, start);
  const next = await deliveryAction(e, 'next', nl.delivery_state, start + 1000);
  assert.equal(next.reference, 'Genesis 1:1-3');
  assert.equal(next.language, 'nl');
  assert.equal(next.translation_format, 'original_interlinear');
});
test('Focused tasks and regular engine are preserved; malformed states fail rather than skip parts', async () => {
  const e = make(); const regular = await e.plan('Full study Genesis 1');
  assert.equal(regular.delivery.mode, 'progressive_in_current_turn');
  const focused = await previewPlan(e, {query:'Full word study ruach'}, start);
  assert.equal(focused.mode,'word_study');
  assert.ok(!focused.delivery_state);
  const translation = await previewPlan(e, {query:'Translate Acts 8:37'}, start);
  assert.equal(translation.delivery.total_parts,1);
  const full = await previewPlan(e, {query:'Full study Genesis 1'}, start);
  for (const patch of [{stage_index:-1},{stage_index:99},{stage_index:1.5},{schema_version:2},{started_at:'invalid'},{started_at:'2026-11-01T00:00:00Z'},{extra:'unexpected'}]) {
    await assert.rejects(deliveryAction(e, 'next', {...full.delivery_state,...patch}, start), err=>err.code==='delivery_state');
  }
  await assert.rejects(deliveryAction(e,'invalid',full.delivery_state,start), err=>err.code==='delivery_action');
});
test('Existing planner provides active skills, clock, readiness, continuation and debug preferences', async()=>{
  const e=make();const p=await previewPlan(e,{query:'Full study Genesis 1'},start);
  assert.deepEqual(Object.keys(p.instruction_bundle),['bible-source-retrieval','bible-translation','translation-key']);
  assert.deepEqual(p.translation_workflow.steps,['confirm_scope_and_translation_key','retrieve_bounded_primary_once','resolve_only_consequential_questions','draft_single_main_translation_with_verse_linked_notes','one_completeness_check_then_ready']);
  assert.deepEqual(p.translation_workflow.retained_policy_under_source_restrictions,['literary_and_exact_scope','translation_key','established_OT_NT_wording_links']);
  assert.match(p.delivery.instruction_priority,/single completeness review/);
  assert.ok(!p.delivery.instruction_priority.includes('check_handoff'));
  assert.match(p.instruction_bundle['translation-key'],/In the beginning God created the heavens and the earth/);
  assert.deepEqual(p.retrieval_plan[0].arguments.sources,['WLC'],'Comparison editions need a specific question or request');
  assert.ok(Object.values(p.instruction_bundle).every(s=>typeof s==='string'&&s.length>100));
  const ready=await previewPlan(e,{query:'Ready',study_state:{preview_delivery:p.delivery_state}},start+1000);
  const next=await previewPlan(e,{query:'Next',study_state:{preview_delivery:ready.next_delivery_state}},start+2000);
  assert.equal(next.delivery.current_part,'local_explanation');assert.equal(next.reference,p.reference);
  assert.deepEqual(Object.keys(next.instruction_bundle),['bible-exegesis']);
  assert.equal((await previewPlan(e,{query:'Clock'},start)).status,'clock_check');
  assert.equal((await previewPlan(e,{query:'Debug off'},start)).debug_mode,false);
  assert.equal((await previewPlan(e,{query:'Debug on'},start)).debug_mode,true);
});
test('Conversational study requests reach the active translation key without changing scope or preferences', async () => {
  const e = make();
  const observed = await previewPlan(e, {query:'Give me the full study of genesis 1'}, start);
  assert.equal(observed.mode,'full_study');
  assert.equal(observed.study_depth,'full');
  assert.equal(observed.reference,'Genesis 1:1-2:3');
  assert.equal(observed.requested_reference,'genesis 1');
  assert.equal(observed.request_normalization.normalized_query,'full study genesis 1');
  assert.equal(observed.planning_status,'ready');
  assert.match(observed.instruction_bundle['translation-key'],/In the beginning God created/);
  for (const query of ['Could you please give me a full Bible study of Genesis 1 in English using only WLC?', 'Geef me de volledige studie van Genesis 1, WLC only.']) {
    const p = await previewPlan(e,{query},start);
    assert.equal(p.mode,'full_study');assert.equal(p.reference,observed.reference);
    assert.deepEqual(p.source_policy.allowed_editions,['WLC']);
  }
  const exact = await previewPlan(e,{query:'Please show me a detailed study of Romans 12:1-2, exact, original interlinear, in Dutch, SBLGNT only.'},start);
  assert.equal(exact.reference,'Romans 12:1-2');assert.equal(exact.study_depth,'detailed');
  assert.equal(exact.language,'nl');assert.equal(exact.translation_format,'original_interlinear');
  assert.deepEqual(exact.source_policy.allowed_editions,['SBLGNT']);
  const song = await previewPlan(e,{query:'Please translate Song of Songs 1:1-3.'},start);
  assert.equal(song.requested_reference,'Song of Songs 1:1-3');
  const numbered = await previewPlan(e,{query:'Give me a standard study of 1 John 1:1-3, exact'},start);
  assert.equal(numbered.reference,'1 John 1:1-3');
  const word = await previewPlan(e,{query:'Could you give me a full word study of ruach?'},start);
  assert.equal(word.mode,'word_study');assert.equal(word.topic,'ruach');assert.equal(word.study_depth,'full');
  assert.ok(!word.delivery_state);
  const next = await previewPlan(e,{query:'Please Next',study_state:{preview_delivery:observed.delivery_state}},start+1000);
  assert.equal(next.delivery.current_part,'local_explanation');assert.equal(next.reference,observed.reference);
  assert.deepEqual(e.store.metrics,{asset_fetches:0,cache_hits:0,asset_bytes:0});
});
test('Failed and incomplete plans require repair and retry instead of bypassing the active bundle', async () => {
  const e = make();
  for (const query of ['Give me the full study of Frobnitz 1','Please translate Genesis 99']) {
    await assert.rejects(previewPlan(e,{query},start), error => {
      assert.equal(error.previewRecovery.planning_status,'failed');
      assert.equal(error.previewRecovery.can_retrieve,false);
      assert.equal(error.previewRecovery.recovery.retry_tool,'study_plan');
      assert.match(error.previewRecovery.recovery.success_required_before,/direct fetch is not/);
      assert.ok(!error.previewRecovery.instruction_bundle&&!error.previewRecovery.delivery_state);
      return true;
    });
  }
  const missing = await previewPlan(e,{query:'Give me the full study'},start);
  assert.equal(missing.status,'needs_input');assert.equal(missing.can_retrieve,false);
  assert.equal(missing.recovery.retry_tool,'study_plan');
  await assert.rejects(previewPlan(e,{query:'Please '.repeat(400)+'Full study Genesis 1'},start),err=>err.code==='query');
  assert.deepEqual(e.store.metrics,{asset_fetches:0,cache_hits:0,asset_bytes:0});
});
test('Ready refreshes the concrete layout, concise note policy, contextual wording check and exact continuation', async () => {
  const e = make();const plan = await previewPlan(e,{query:'Give me the full study of genesis 1'},start);
  assert.equal(plan.output_contract.heading,'## Genesis 1:1-2:3 — Translation and footnotes');
  assert.equal(plan.output_contract.first_line,timestamp(start).display);
  assert.match(plan.output_contract.footnotes.format,/no separate heading/);
  assert.match(plan.output_contract.footnotes.length,/two to four sentences/);
  assert.equal(plan.output_contract.wording_checks[0].reference,'Genesis 1:30');
  assert.match(plan.output_contract.wording_checks[0].instruction,/that has life/);
  const ready = await previewPlan(e,{query:'Ready',study_state:{preview_delivery:plan.delivery_state}},start+61000);
  assert.equal(ready.output_contract.first_line,ready.timestamp.display);
  assert.notEqual(ready.output_contract.first_line,plan.output_contract.first_line);
  assert.deepEqual(ready.output_contract.closing_lines,[`Last server check: ${ready.timestamp.display}`,'Next: Local explanation and literary structure']);
  assert.equal(ready.output_completion_observed,false);
  assert.deepEqual(ready.next_delivery_state,plan.delivery_state);
  const next = await deliveryAction(e,'next',ready.next_delivery_state,start+62000);
  assert.equal(next.output_contract.heading,'## Genesis 1:1-2:3 — Local explanation and literary structure');
  assert.ok(!next.output_contract.footnotes&&!next.output_contract.wording_checks);
  const exact = await previewPlan(e,{query:'Please translate Genesis 1:1-3'},start);
  assert.ok(!exact.output_contract.wording_checks);
  const done = await deliveryAction(e,'ready',exact.delivery_state,start+1000);
  assert.equal(done.output_contract.closing_lines.at(-1),'Next passage');
});
test('Restricted evidence keeps the translation key, literary scope, valid calls and continuation without planner retrieval', async () => {
  const e = make();
  let plan = await previewPlan(e, {query:'Full study Genesis 1, WLC only'}, start);
  assert.equal(plan.reference,'Genesis 1:1-2:3');
  assert.equal(plan.scope_policy.study_reference,'Genesis 1:1-2:3');
  assert.equal(plan.language,'en');
  assert.deepEqual(plan.source_policy.allowed_editions,['WLC']);
  assert.equal(plan.source_policy.secondary_lookups_allowed,false);
  assert.deepEqual(plan.retrieval_plan,[{tool:'fetch_passage',arguments:{reference:'Genesis 1:1-2:3',sources:['WLC'],detail:'text'}}]);
  assert.match(plan.instruction_bundle['translation-key'], /In the beginning God created/);
  assert.match(plan.instruction_bundle['bible-translation'], /Do not construct or validate a handoff/);
  assert.equal(plan.context_preface.required,null,'The planner must not claim to have inspected source text');
  assert.deepEqual(e.store.metrics,{asset_fetches:0,cache_hits:0,asset_bytes:0});
  for (let i=0;i<4;i++) {
    const ready=await deliveryAction(e,'ready',plan.delivery_state,start+(i+1)*1000);
    assert.equal(ready.output_status,'awaiting_host_output');
    assert.equal(ready.output_completion_observed,false);
    const resumed=await deliveryAction(e,'resume',plan.delivery_state,start+(i+1)*1000);
    assert.deepEqual(resumed.source_policy.allowed_editions,['WLC']);
    plan=await deliveryAction(e,'next',ready.next_delivery_state,start+(i+1)*1000);
    assert.deepEqual(plan.source_policy.allowed_editions,['WLC']);
  }
  assert.equal(plan.reference,'Genesis 2:4-25');
  assert.deepEqual(e.store.metrics,{asset_fetches:0,cache_hits:0,asset_bytes:0});
  const exact=await previewPlan(e,{query:'Full study Genesis 1:1-3, exact, WLC only',language:'nl',translation_format:'original_interlinear'},start);
  assert.equal(exact.reference,'Genesis 1:1-3');
  assert.equal(exact.retrieval_plan[0].arguments.detail,'linguistic');
  const skipped=await previewPlan(e,{query:'Next passage',study_state:{preview_delivery:exact.delivery_state}},start+1000);
  assert.equal(skipped.reference,'Genesis 1:4-2:3');
  assert.equal(skipped.language,'nl');
  assert.deepEqual(skipped.source_policy.allowed_editions,['WLC']);
  const translated=await previewPlan(e,{query:'Translate Genesis 1:1-3, exact, sources WLC+LXX'},start);
  assert.equal(translated.reference,'Genesis 1:1-3');
  assert.deepEqual(translated.source_policy.allowed_editions,['WLC','LXX']);
  const lxx=await previewPlan(e,{query:'Translate Genesis 1:1-3',sources:['LXX']},start);
  assert.deepEqual(lxx.retrieval_plan[0].arguments.sources,['LXX']);
  const legacy={...exact.delivery_state};delete legacy.sources;
  const legacyNext=await deliveryAction(e,'next',legacy,start+1000);
  assert.deepEqual(legacyNext.source_policy.allowed_editions,['WLC']);
  const dss=await previewPlan(e,{query:'Translate Genesis 1:27, DSS-only'},start);
  assert.equal(dss.retrieval_plan[0].tool,'fetch_dss');
  assert.match(dss.coverage_instruction,/fragmentary evidence/);
  const language=await previewPlan(e,{query:'Full study Genesis 1 in English using only WLC'},start);
  assert.equal(language.language,'en');assert.deepEqual(language.source_policy.allowed_editions,['WLC']);
  for (const args of [{query:'Genesis 1',sources:[]},{query:'Genesis 1',sources:['RAHLFS']},{query:'Genesis 1',sources:['WLC','WLC']},{query:'Genesis 1, WLC only',sources:['LXX']},{query:'Genesis 1',sources:['SBLGNT']}]) {
    await assert.rejects(previewPlan(e,args,start),err=>err.code==='sources');
  }
});
test('Source-limited Preview queries retain translation key, exact scope and witness through Next', async () => {
  const e = make();
  const exact = await previewPlan(e, {query: 'Translate Genesis 1:1-3, exact, using only WLC'}, start);
  assert.equal(exact.mode, 'translation_only');
  assert.equal(exact.reference, 'Genesis 1:1-3');
  assert.deepEqual(exact.source_restriction.allowed_sources, ['WLC']);
  assert.deepEqual(Object.keys(exact.instruction_bundle), ['bible-source-retrieval','bible-translation','translation-key']);
  assert.match(exact.instruction_bundle['translation-key'], /In the beginning God created/);
  const alternate = await previewPlan(e, {query: 'Full study Genesis 1, WLC-only'}, start);
  assert.equal(alternate.reference, 'Genesis 1:1-2:3');
  assert.deepEqual(alternate.source_restriction.allowed_sources, ['WLC']);
  const next = await deliveryAction(e, 'next', alternate.delivery_state, start + 1000);
  assert.equal(next.delivery.current_part, 'local_explanation');
  assert.deepEqual(next.source_restriction.allowed_sources, ['WLC']);
  const later = await previewPlan(e, {query: 'Full study Genesis 1, using WLC only'}, start);
  assert.deepEqual(later.source_restriction.allowed_sources, ['WLC']);
  await assert.rejects(deliveryAction(e, 'next', {...alternate.delivery_state, source_restriction:'MADE_UP'}, start + 1000), err=>err.code==='delivery_state');
});
test('Widget sends a user-triggered Next through the standard bridge and blocks duplicate clicks', async () => {
  const elements = Object.fromEntries(['title','clock','elapsed','next','hint','error'].map(id=>[id,{textContent:'',hidden:false,disabled:false}]));
  const listeners = {}, messages = [], parent = {postMessage: message=>messages.push(message)};
  const window = {parent, addEventListener:(name,fn)=>listeners[name]=fn};
  runInNewContext(previewWidget.match(/<script>([\s\S]*)<\/script>/)[1], {window,document:{getElementById:id=>elements[id]},setTimeout:()=>1,clearTimeout:()=>{},Intl,Date,Map,Error});
  assert.equal(messages[0].method,'ui/initialize');
  assert.equal(elements.next.hidden,true);
  listeners.message({source:parent,data:{jsonrpc:'2.0',id:messages[0].id,result:{}}});
  await Promise.resolve();
  listeners.message({source:parent,data:{jsonrpc:'2.0',method:'ui/notifications/tool-result',params:{structuredContent:{status:'host_reports_part_ready',completed_title:'Translation',timestamp:timestamp(start),button_label:'Next: Local explanation',passage_complete:false}}}});
  assert.equal(elements.next.disabled,false);
  const click=elements.next.onclick();
  assert.equal(elements.next.disabled,true);
  const message=messages.at(-1);assert.equal(message.method,'ui/message');assert.equal(message.params.content[0].text,'Next');
  listeners.message({source:parent,data:{jsonrpc:'2.0',id:message.id,result:{}}});await click;
  assert.equal(elements.next.textContent,'Requested');
  assert.match(elements.hint.textContent,/Next requested at/);
  assert.ok(!previewWidget.includes('localStorage'));
});
test('Widget compatibility fallback sends Next passage without inventing a native button', async () => {
  const elements=Object.fromEntries(['title','clock','elapsed','next','hint','error'].map(id=>[id,{textContent:'',hidden:false,disabled:false}]));
  let prompt=null;const output={status:'host_reports_part_ready',timestamp:timestamp(start),completed_title:'Synthesis',button_label:'Next passage',passage_complete:true};
  const window={parent:{postMessage:()=>{}},addEventListener:()=>{},openai:{toolOutput:output,sendFollowUpMessage:async args=>{prompt=args.prompt;}}};
  runInNewContext(previewWidget.match(/<script>([\s\S]*)<\/script>/)[1],{window,document:{getElementById:id=>elements[id]},setTimeout:()=>1,clearTimeout:()=>{},Intl,Date,Map,Error});
  assert.equal(elements.next.disabled,false);await elements.next.onclick();assert.equal(prompt,'Next passage');
  assert.equal(elements.next.textContent,'Requested');
});
