import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Engine} from '../src/engine.js';
import {SourceStore,bundle} from '../src/store.js';
import {previewPlan,deliveryAction} from '../src/preview-delivery.js';
import {INTERPRETATION_CORE} from '../src/interpretation.js';
const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../../../..');
const make=()=>new Engine(new SourceStore({fetch:async req=>new Response(readFileSync(resolve(here,'../generated/assets',new URL(req.url).pathname.slice(1))))}));
const now=Date.parse('2026-10-16T13:00:00Z');

test('Neutral acceptance prompts route through identical reusable discovery contracts, without research or passage templates',async()=>{
  const cases=JSON.parse(readFileSync(resolve(root,'development/interpretation-acceptance.json'))).cases;
  let contract;
  for(const fixture of cases){
    const e=make();let p=await previewPlan(e,{query:fixture.prompt},now);
    assert.equal(p.delivery.current_part,'translation_notes');
    assert.equal(p.study_depth,'full');
    assert.deepEqual(e.refs.parse(p.reference),e.refs.parse(fixture.reference));
    assert.deepEqual(p.part_sequence.map(x=>x.id),['translation_notes','local_explanation','historical_context','canonical_synthesis']);
    assert.ok(!p.interpretation_workflow.discovery,'Do not front-load the exegesis research');
    assert.ok(!p.interpretation_workflow.research.conditional_ceiling);
    p=await deliveryAction(e,'next',p.delivery_state,now+1000);
    assert.equal(p.delivery.current_part,'local_explanation');
    assert.equal(p.interpretation_workflow.research.conditional_ceiling.secondary_sources,6);
    assert.deepEqual(p.retrieval_plan,[],'Discovery does not force speculative retrievals');
    assert.ok(p.interpretation_workflow.discovery);
    if(contract)assert.deepEqual(p.interpretation_workflow,contract);
    contract=p.interpretation_workflow;
    let tick=now+2000;
    for(let i=1;i<=3;i++){
      assert.ok(JSON.stringify(p).length<30000);
      const ready=await deliveryAction(e,'ready',p.delivery_state,++tick);
      assert.deepEqual(ready.output_contract.interpretation,p.output_contract.interpretation);
      assert.equal(ready.output_completion_observed,false);
      if(i<3)p=await deliveryAction(e,'next',ready.next_delivery_state,++tick);
    }
    assert.deepEqual(e.store.metrics,{asset_fetches:0,cache_hits:0,asset_bytes:0});
  }
});

test('Depth changes research ceiling without dropping serious alternatives; exact scope and restricted evidence survive every part',async()=>{
  for(const [depth,ceiling] of [['standard',2],['detailed',3],['full',6]]){
    const e=make();const initial=await previewPlan(e,{query:`${depth} study Mark 7:14-23, exact`,language:'nl'},now);
    const next=await deliveryAction(e,'next',initial.delivery_state,now+1);
    assert.equal(next.language,'nl');assert.equal(next.reference,'Mark 7:14-23');
    assert.equal(next.interpretation_workflow.research.conditional_ceiling.secondary_sources,ceiling);
    assert.ok(next.output_contract.interpretation.case_fields.includes('substantial objections'));
    let p=await previewPlan(e,{query:`${depth} study Mark 7:14-23, exact, SBLGNT only`},now);
    let tick=now+10;
    while(true){
      assert.equal(p.source_policy.external_research_allowed,false);
      assert.equal(p.source_policy.secondary_lookups_allowed,false);
      if(p.interpretation_workflow.research.conditional_ceiling)assert.equal(p.interpretation_workflow.research.conditional_ceiling.secondary_sources,0);
      const ready=await deliveryAction(e,'ready',p.delivery_state,++tick);
      assert.deepEqual(ready.next_delivery_state.sources,['SBLGNT']);
      if(ready.passage_complete)break;
      p=await deliveryAction(e,'next',ready.next_delivery_state,++tick);
    }
  }
});

test('Focused word/theme research retains exclusions and receives word-specific detail only when needed',async()=>{
  const e=make();
  const word=await previewPlan(e,{query:'Full word study ruach, WLC only'},now);
  assert.equal(word.source_policy.external_research_allowed,false);
  assert.equal(word.interpretation_workflow.research.conditional_ceiling.secondary_sources,0);
  assert.ok(word.instruction_bundle['word-study']);
  let p=await previewPlan(e,{query:'Full study Genesis 2:4-25, exact'},now);
  p=await deliveryAction(e,'next',p.delivery_state,now+1);
  assert.ok(!p.instruction_bundle['word-study']);
  assert.ok(!p.instruction_bundle['bible-exegesis'].includes('Four to six diagnostic passages'));
});

test('Runtime bundles contain the discovery method but never the development acceptance answers',()=>{
  const policy=readFileSync(resolve(here,'../src/interpretation.js'),'utf8');
  const runtime=Object.values(bundle.documents).join('\n')+policy;
  for(const forbidden of ['maternal-incest interpretation','paternal sexual-assault interpretation','Jephthah’s daughter','literal burnt sacrifice versus lifelong dedication'])assert.ok(!runtime.includes(forbidden));
  assert.ok(!Object.keys(bundle.documents).some(path=>path.startsWith('development/')));
  assert.match(INTERPRETATION_CORE,/No|Do not assign percentages/);
  assert.match(INTERPRETATION_CORE,/reader weighs the evidence/);
});
