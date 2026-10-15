// Works against Wrangler locally or the actual workers.dev endpoint after deployment.
import assert from 'node:assert/strict';
import manifest from '../../plugin.json' with {type: 'json'};
const endpoint = process.argv[2] ?? 'http://localhost:8787/mcp';
const url = new URL(endpoint);
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && url.protocol !== 'https:') throw Error('Use HTTPS for a public MCP endpoint.');
let id = 0, version = '2025-06-18';
async function rpc(method, params = {}, notification = false, extraHeaders = {}) {
  const response = await fetch(endpoint, {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': version, ...extraHeaders}, body: JSON.stringify({jsonrpc: '2.0', ...(notification ? {} : {id: ++id}), method, params}), signal: AbortSignal.timeout(30000)});
  if (notification) {assert.ok(response.ok); return null;}
  assert.equal(response.status, 200, await response.clone().text());
  const text = await response.text();
  const packet = response.headers.get('Content-Type')?.includes('text/event-stream')
    ? text.split(/\r?\n\r?\n/).map(event => event.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n')).filter(Boolean).map(JSON.parse).find(packet => packet.id === id)
    : JSON.parse(text);
  assert.ok(packet, 'Streamable HTTP response must contain the matching result.');
  assert.equal(packet.id, id);
  assert.ok(!packet.error, JSON.stringify(packet.error));
  return packet.result;
}
async function tool(name, args = {}) {
  const result = await rpc('tools/call', {name, arguments: args});
  assert.deepEqual(JSON.parse(result.content[0].text), result.structuredContent);
  return result;
}

const init=await rpc('initialize',{protocolVersion:version,capabilities:{},clientInfo:{name:'release-smoke',version:'0.1.19'}});
version=init.protocolVersion;
assert.equal(init.serverInfo.version,manifest.version);
assert.match(init.instructions,/STAGED STUDY DELIVERY|STAGED DELIVERY/);
await rpc('notifications/initialized',{},true);
const list=await rpc('tools/list');
assert.equal(list.tools.length,12);
for(const name of ['study_plan','study_delivery','preview_timestamp','fetch_passage','fetch_dss']) assert.ok(list.tools.some(t=>t.name===name));
assert.ok(!list.tools.some(t=>t.name==='check_handoff'));
const health=(await tool('study_health')).structuredContent;
assert.equal(health.plugin_version,manifest.version);
assert.equal(health.genesis_mapping.DSS_inventory_reviews,842);
assert.equal(health.genesis_mapping.consumer,'released_channels');
assert.equal(health.runtime_controls.preview_debug_mode,false);
const study=(await tool('study_plan',{query:'Full study Genesis 11'})).structuredContent;
assert.equal(study.delivery.current_part,'translation_notes');
assert.equal(study.part_sequence.length,4);
assert.equal(study.output_contract.diagnostics,undefined);
const ready=(await tool('study_plan',{query:'Ready',study_state:{preview_delivery:study.delivery_state}})).structuredContent;
assert.equal(ready.next_title,'Local explanation and literary structure');
const next=(await tool('study_plan',{query:'Next',study_state:{preview_delivery:ready.next_delivery_state}})).structuredContent;
assert.equal(next.reference,'Genesis 11');
assert.equal(next.delivery.current_part,'local_explanation');
const mapped=(await tool('fetch_passage',{reference:'Genesis 32:1',sources:['TAHOT']})).structuredContent;
assert.equal(mapped.source_packets[0].chapter,31);
assert.ok(mapped.verse_mapping);
assert.equal(mapped.preview_debug,undefined);
const basic=(await tool('fetch_passage',{reference:'Genesis 1:1-3',sources:['WLC']})).structuredContent;
assert.equal(basic.source_packets[0].records.length,3);
const invalid=await tool('fetch_passage',{reference:'Genesis 1:99'});
assert.equal(invalid.isError,true);
const rejected=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://unrelated.invalid'},body:JSON.stringify({jsonrpc:'2.0',id:999,method:'tools/list'})});
assert.equal(rejected.status,403);
console.log(JSON.stringify({version:manifest.version,tools:list.tools.length,parity:'staged studies and reviewed Genesis map',diagnostics:'disabled'}));
