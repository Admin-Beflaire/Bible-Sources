// Controlled local retrieval replay. This does not run a host model or measure chat output.
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Engine} from '../src/engine.js';
import {SourceStore, clearCache} from '../src/store.js';
import {previewPlan, deliveryAction} from '../src/preview-delivery.js';
import {VERSION} from '../src/common.js';

const here = dirname(fileURLToPath(import.meta.url));
const output = process.argv[2];
if (!output) throw Error('Supply an output JSON path. Run prepare:data first.');
const assets = {fetch: async request => new Response(readFileSync(resolve(here, '../generated/assets', new URL(request.url).pathname.slice(1))))};
const cases = [
  {id: 'full_first_part', query: 'Full study Genesis 1:1-2:3, exact', sources: ['WLC', 'LXX']},
  {id: 'translation_comparisons', query: 'Translate Genesis 1:1-2:3, exact', sources: ['WLC', 'LXX']},
  {id: 'translation_wlc', query: 'Translate Genesis 1:1-2:3, exact', sources: ['WLC']},
];
async function run(c, cache, repetition) {
  const engine = new Engine(new SourceStore(assets));
  const started = performance.now();
  const plan = await previewPlan(engine, {query: c.query, sources: c.sources, language: 'en', translation_format: 'plain_working'});
  const planned = performance.now();
  const passage = await engine.reader.passage(plan.reference, c.sources, 'text');
  const retrieved = performance.now();
  const ready = await deliveryAction(engine, 'ready', plan.delivery_state);
  const completed = performance.now();
  if (plan.reference !== 'Genesis 1:1-2:3' || ready.completed_part !== 'translation_notes') throw Error('Replay scope or delivery changed');
  return {case: c.id, cache, repetition, query: c.query, reference: plan.reference, sources: c.sources,
    plan_ms: planned - started, passage_ms: retrieved - planned, ready_ms: completed - retrieved,
    total_ms: completed - started, ...engine.store.metrics,
    records: passage.source_packets.map(p => ({source: p.source, count: p.records.length})),
    plan_bytes: Buffer.byteLength(JSON.stringify(plan)), passage_bytes: Buffer.byteLength(JSON.stringify(passage))};
}
const samples = [];
for (const c of cases) {
  for (let repetition = 1; repetition <= 5; repetition++) {
    clearCache();
    samples.push(await run(c, 'cold', repetition));
    samples.push(await run(c, 'warm', repetition));
  }
}
const median = values => values.sort((a,b) => a-b)[Math.floor(values.length / 2)];
const summary = cases.flatMap(c => ['cold','warm'].map(cache => {
  const rows = samples.filter(s => s.case === c.id && s.cache === cache);
  return {case: c.id, cache, repetitions: rows.length,
    median_total_ms: median(rows.map(r => r.total_ms)), median_plan_ms: median(rows.map(r => r.plan_ms)),
    median_passage_ms: median(rows.map(r => r.passage_ms)), median_ready_ms: median(rows.map(r => r.ready_ms)),
    asset_fetches: rows[0].asset_fetches, cache_hits: rows[0].cache_hits, plan_bytes: rows[0].plan_bytes};
}));
const result = {kind: 'local_retrieval_replay', recorded_at: new Date().toISOString(), version: VERSION,
  git_head: execFileSync('git', ['rev-parse','HEAD'], {cwd: here, encoding:'utf8'}).trim(), node: process.version,
  scope: 'Genesis 1:1-2:3', language: 'en', translation_format: 'plain_working',
  limitations: ['No host model, network, Cloudflare CPU, wording quality, or client rendering is measured.',
    'Identical planned calls compare runtime overhead only; they cannot establish reduced host call counts or Worked for time.'],
  summary, samples};
writeFileSync(resolve(output), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({output: resolve(output), version: VERSION, summary}));
