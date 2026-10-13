import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateKeyPair, exportJWK, SignJWT} from 'jose';
import worker from '../src/worker.js';
import {readBoundedBody, BodyLimitError} from '../src/http.js';
const here = dirname(fileURLToPath(import.meta.url));
const issuer = 'https://study-auth.example.test';
const audience = 'local-test-audience';
const {privateKey, publicKey} = await generateKeyPair('RS256');
const jwk = {...await exportJWK(publicKey), kid: 'local-key', alg: 'RS256', use: 'sig'};
const sign = (key = privateKey, aud = audience, expiry = '5m') => new SignJWT({email: 'study@example.test'}).setProtectedHeader({alg: 'RS256', kid: 'local-key'}).setIssuer(issuer).setAudience(aud).setIssuedAt().setExpirationTime(expiry).sign(key);

test('Chunked bodies stop at the byte limit and cancel the unread remainder', async () => {
  let pulled = 0, cancelled = false;
  const body = new ReadableStream({pull(controller) {pulled++; controller.enqueue(new Uint8Array(65536));}, cancel() {cancelled = true;}});
  await assert.rejects(readBoundedBody(body, 128 * 1024), BodyLimitError);
  assert.ok(cancelled);
  assert.ok(pulled <= 4, 'Must stop without buffering the rest of the stream');
  assert.equal((await readBoundedBody(new Response('exact').body, 5)).length, 5);
});

test('Authenticated rate limiting uses stable verified identity, refuses overload and fails closed', async () => {
  const actualFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({keys: [jwk]});
  let calls = 0, keys = [];
  const env = {TEAM_DOMAIN: issuer, POLICY_AUD: audience, MCP_RATE_LIMITER: {limit: async ({key}) => {calls++; keys.push(key); return {success: false};}}};
  const request = async (token, ip = '192.0.2.1') => new Request('https://study.example.test/mcp', {method: 'POST', headers: {'Cf-Access-Jwt-Assertion': token ?? await sign(), 'Cf-Connecting-IP': ip}, body: '{}'});
  try {
    for (const ip of ['192.0.2.1', '192.0.2.2']) {
      const response = await worker.fetch(await request(await sign(), ip), env, {});
      assert.equal(response.status, 429);
      assert.equal(response.headers.get('Retry-After'), '60');
    }
    assert.equal(keys[0], keys[1], 'Token refresh and shared proxy addresses must not change identity');
    assert.ok(!keys[0].includes('study@example.test'));
    assert.equal((await worker.fetch(await request('not-a-jwt'), env, {})).status, 403);
    assert.equal(calls, 2, 'Unverified callers must not consume authenticated quota');
    assert.equal((await worker.fetch(await request(), {...env, MCP_RATE_LIMITER: undefined}, {})).status, 503);
    assert.equal((await worker.fetch(await request(), {...env, MCP_RATE_LIMITER: {limit: async () => {throw Error('Unavailable');}}}, {})).status, 503);
  } finally {globalThis.fetch = actualFetch;}
});
test('First MCP instructions prioritize progressive delivery and do not promise background work', () => {
  const source = readFileSync(resolve(here, '../src/worker.js'), 'utf8');
  const firstPriority = source.indexOf("'DELIVERY PRIORITY:");
  const name = source.indexOf("'Canonical Scripture Study —");
  assert.ok(firstPriority > 0 && name > firstPriority);
  assert.match(source.slice(firstPriority, name), /Next means the next Bible passage/);
  assert.match(source, /stream one response in the same order/);
});

test('Streamable HTTP lifecycle and eleven tools through the actual Worker handler', async () => {
  const actualFetch = globalThis.fetch;
  const token = await sign();
  const env = {TEAM_DOMAIN: issuer, POLICY_AUD: audience, MCP_RATE_LIMITER: {limit: async () => ({success: true})}, ASSETS: {fetch: async request => new Response(readFileSync(resolve(here, '../generated/assets', new URL(request.url).pathname.slice(1))))}};
  const pending = [];
  const ctx = {waitUntil: promise => pending.push(promise)};
  globalThis.fetch = (input, init) => {
    const request = new Request(input, init);
    if (request.url === `${issuer}/cdn-cgi/access/certs`) return Promise.resolve(Response.json({keys: [jwk]}));
    request.headers.set('Host', new URL(request.url).host);
    request.headers.set('Cf-Access-Jwt-Assertion', token);
    return worker.fetch(request, env, ctx);
  };
  try {await import('../scripts/smoke.mjs'); await Promise.all(pending);} finally {globalThis.fetch = actualFetch;}
});

test('Access validation refuses missing, expired, wrong-audience and forged assertions', async () => {
  const actualFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({keys: [jwk]});
  const env = {TEAM_DOMAIN: issuer, POLICY_AUD: audience, MCP_RATE_LIMITER: {limit: async () => ({success: true})}};
  const request = token => new Request('https://study.example.test/mcp', {method: 'POST', headers: token ? {'Cf-Access-Jwt-Assertion': token} : {}, body: '{}'});
  try {
    assert.equal((await worker.fetch(request(), {}, {})).status, 503);
    assert.equal((await worker.fetch(request(), env, {})).status, 403);
    const forged = await generateKeyPair('RS256');
    for (const token of ['not-a-jwt', await sign(privateKey, audience, Math.floor(Date.now() / 1000) - 60), await sign(privateKey, 'other-audience'), await sign(forged.privateKey)]) {
      assert.equal((await worker.fetch(request(token), env, {})).status, 403);
    }
    // An authenticated oversized body is refused before executing any tool.
    const large = new Request('https://study.example.test/mcp', {method: 'POST', headers: {'Cf-Access-Jwt-Assertion': await sign()}, body: 'x'.repeat(128 * 1024 + 1)});
    assert.equal((await worker.fetch(large, env, {})).status, 413);
    assert.equal((await worker.fetch(new Request('https://study.example.test/health'), {}, {})).status, 200);
  } finally {globalThis.fetch = actualFetch;}
});

test('Preview-only timing, part plans and UI are isolated from normal server on the same assets', async () => {
  const actualFetch=globalThis.fetch;globalThis.fetch=async()=>Response.json({keys:[jwk]});
  const assets={fetch:async req=>new Response(readFileSync(resolve(here,'../generated/assets',new URL(req.url).pathname.slice(1))))};
  const normal={ASSETS:assets,TEAM_DOMAIN:issuer,POLICY_AUD:audience,MCP_RATE_LIMITER:{limit:async()=>({success:true})}};
  const preview={...normal,PREVIEW_DELIVERY:'true',PREVIEW_DEBUG:'true'};const ctx={waitUntil:()=>{}};let id=0;
  const rpc=async(env,method,params={})=>{
    const req=new Request('https://study.example.test/mcp',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json, text/event-stream','Cf-Access-Jwt-Assertion':await sign()},body:JSON.stringify({jsonrpc:'2.0',id:++id,method,params})});
    const response=await worker.fetch(req,env,ctx);assert.equal(response.status,200);const text=await response.text();
    const data=response.headers.get('Content-Type')?.includes('text/event-stream')?text.split(/\r?\n\r?\n/).map(event=>event.split(/\r?\n/).filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trimStart()).join('\n')).filter(Boolean).map(JSON.parse).find(packet=>packet.id===id):JSON.parse(text);
    assert.ok(data&&!data.error);return data.result;
  };
  try{
    const init=await rpc(preview,'initialize',{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'preview-test',version:'1'}});
    assert.ok(init.instructions.startsWith('PREVIEW TIMING AND STAGED DELIVERY OVERRIDE:'));
    const tools=(await rpc(preview,'tools/list')).tools;assert.equal(tools.length,12);
    assert.ok(!tools.some(t=>t.name==='check_handoff'));
    assert.match(init.instructions,/check_handoff is removed from Preview/);
    const descriptor=tools.find(t=>t.name==='study_delivery');assert.ok(descriptor._meta.ui.resourceUri.startsWith('ui://'));
    const clock=(await rpc(preview,'tools/call',{name:'preview_timestamp',arguments:{}})).structuredContent;assert.match(clock.display,/Europe\/Amsterdam/);
    const plan=(await rpc(preview,'tools/call',{name:'study_plan',arguments:{query:'Full study Genesis 1 in English'}})).structuredContent;
    assert.equal(plan.delivery.current_part,'translation_notes');
    assert.deepEqual(Object.keys(plan.instruction_bundle),['bible-source-retrieval','bible-translation','translation-key']);
    assert.equal(plan.preview_debug.operation,'study_plan');assert.ok(plan.preview_debug.server_execution_ms>=0);
    assert.equal(plan.preview_debug.asset_fetches,0);
    assert.equal(plan.preview_debug.cache_hits,0);
    assert.match(plan.preview_debug.operation_id,/^[0-9a-f-]{36}$/);
    assert.ok(Date.parse(plan.preview_debug.returned_at)>=Date.parse(plan.preview_debug.started_at));
    assert.equal(plan.preview_debug.output_completion_observed,false);
    const planTool=tools.find(t=>t.name==='study_plan');assert.equal(planTool._meta.ui.resourceUri,descriptor._meta.ui.resourceUri);
    assert.deepEqual(planTool.inputSchema.properties.sources.anyOf[0].items.enum,['WLC','UXLC','TAHOT','LXX','SBLGNT','DSS']);
    assert.equal(plan.translation_workflow.handoff_validation,'not_used_in_preview');
    assert.deepEqual(tools.find(t=>t.name==='fetch_passage').inputSchema.properties.detail.enum,['text','linguistic']);
    const restricted=(await rpc(preview,'tools/call',{name:'study_plan',arguments:{query:'Genesis 1',sources:['WLC']}})).structuredContent;
    assert.equal(restricted.reference,'Genesis 1:1-2:3');
    assert.deepEqual(restricted.delivery_state.sources,['WLC']);
    const failed=(await rpc(preview,'tools/call',{name:'fetch_passage',arguments:{reference:'Genesis 0',sources:['WLC']}})).structuredContent;
    assert.ok(failed.error&&failed.preview_clock);
    assert.equal(failed.preview_debug.outcome,'failed');
    assert.equal(failed.preview_debug.error_code,failed.error.code);
    const fetched=(await rpc(preview,'tools/call',{name:'fetch_passage',arguments:{reference:'Genesis 1:1-3',sources:['WLC']}})).structuredContent;
    assert.equal(fetched.preview_debug.reference,'Genesis 1:1-3');
    assert.equal(fetched.preview_debug.retrieved[0].records,3);
    const evalTool=tools.find(t=>t.name==='evaluate_reading');assert.deepEqual(evalTool.inputSchema.properties.record.properties.significance.enum,['semantic','theological','insignificant','uncertain']);
    const ready=(await rpc(preview,'tools/call',{name:'study_delivery',arguments:{action:'ready',delivery_state:plan.delivery_state}})).structuredContent;
    assert.equal(ready.next_title,'Local explanation and literary structure');
    const resource=await rpc(preview,'resources/read',{uri:descriptor._meta.ui.resourceUri});assert.equal(resource.contents[0].mimeType,'text/html;profile=mcp-app');
    await rpc(normal,'initialize',{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'normal-test',version:'1'}});
    const normalTools=(await rpc(normal,'tools/list')).tools;assert.equal(normalTools.length,11);
    assert.ok(normalTools.some(t=>t.name==='check_handoff'));
    assert.ok(!normalTools.some(t=>t.name==='preview_timestamp'));
    const instructions=(await rpc(preview,'tools/call',{name:'get_study_instructions',arguments:{section:'bible-study'}})).structuredContent;
    assert.ok(instructions.text.startsWith('Preview study routing:'));
    assert.equal(instructions.instruction_source,'router_use_active_plan_bundle');
    const full=(await rpc(preview,'tools/call',{name:'get_study_instructions',arguments:{section:'bible-translation',detail:'full'}})).structuredContent;
    assert.ok(full.text.includes('translation rules and key'));
    assert.ok(full.text.length>instructions.text.length);
    const fallback=(await rpc(preview,'tools/call',{name:'study_plan',arguments:{query:'Ready',study_state:{preview_delivery:plan.delivery_state}}})).structuredContent;
    assert.equal(fallback.status,'host_reports_part_ready');
    const clocks=(await rpc(preview,'tools/call',{name:'study_plan',arguments:{query:'Clock'}})).structuredContent;
    assert.equal(clocks.status,'clock_check');
    const health=(await rpc(preview,'tools/call',{name:'study_health',arguments:{}})).structuredContent;assert.equal(health.runtime_controls.preview_debug_mode,true);
    const normalHealth=(await rpc(normal,'tools/call',{name:'study_health',arguments:{}})).structuredContent;assert.ok(!normalHealth.preview_debug&&!normalHealth.preview_clock);
  }finally{globalThis.fetch=actualFetch;}
});
