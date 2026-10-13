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
  assert.deepEqual(p.translation_workflow.steps, ['confirm_scope_and_translation_key', 'retrieve_bounded_primary_once', 'resolve_only_consequential_questions', 'draft_single_main_translation_with_verse_linked_notes', 'one_completeness_check_then_ready']);
  assert.deepEqual(p.translation_workflow.retained_policy_under_source_restrictions, ['literary_and_exact_scope', 'translation_key', 'established_OT_NT_wording_links']);
  assert.match(p.delivery.research, /do not routinely retrieve the NT/);
  assert.match(p.delivery.instruction_priority, /single completeness review/);
  assert.match(p.instruction_bundle['translation-key'], /In the beginning God created the heavens and the earth/);
  assert.ok(!p.delivery.instruction_priority.includes('check_handoff'));
  assert.match(p.delivery.timestamp.measures, /not client rendering/);
  assert.ok(Object.values(p.instruction_bundle).every(s=>typeof s==='string'&&s.length>100));
  const ready=await previewPlan(e,{query:'Ready',study_state:{preview_delivery:p.delivery_state}},start+1000);
  assert.equal(ready.timestamp.stage_elapsed_seconds, 1);
  assert.match(ready.instruction,/never label a pre-output check as output completion/);
  const next=await previewPlan(e,{query:'Next',study_state:{preview_delivery:ready.next_delivery_state}},start+2000);
  assert.equal(next.delivery.current_part,'local_explanation');assert.equal(next.reference,p.reference);
  assert.deepEqual(Object.keys(next.instruction_bundle),['bible-exegesis']);
  assert.equal((await previewPlan(e,{query:'Clock'},start)).status,'clock_check');
  assert.equal((await previewPlan(e,{query:'Debug off'},start)).debug_mode,false);
  assert.equal((await previewPlan(e,{query:'Debug on'},start)).debug_mode,true);
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
