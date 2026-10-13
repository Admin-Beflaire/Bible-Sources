import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import publicWorker from '../src/public.js';
import {address, subnet, compilePolicy, allowConnector, refreshConnectorPolicy, CONNECTOR_SOURCE, POLICY_KEY, MAX_POLICY_AGE_MS} from '../src/network.js';

const here = dirname(fileURLToPath(import.meta.url));
const host = 'mcp.example.test';
const policy = (prefixes = [{ipv4Prefix: '192.0.2.0/28'}, {ipv6Prefix: '2001:db8::/64'}], fetchedAt = Date.now()) => ({source: CONNECTOR_SOURCE, fetchedAt, document: {creationTime: '2026-10-06T23:18:01.923622', prefixes}});
const binding = value => ({get: async key => {assert.equal(key, POLICY_KEY); return value;}});
const request = (ip, body = '{}', path = '/mcp', extra = {}) => new Request(`https://${host}${path}`, {method: 'POST', headers: {...(ip ? {'CF-Connecting-IP': ip} : {}), 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-06-18', ...extra}, body});

test('Connector matching handles IPv4 and IPv6 boundaries and rejects malformed addresses', async () => {
  const b = binding(policy());
  for (const ip of ['192.0.2.0', '192.0.2.15', '2001:db8::', '2001:0db8:0000:0000:ffff:ffff:ffff:ffff']) assert.equal((await allowConnector(request(ip), b)).allowed, true, ip);
  for (const ip of [undefined, '192.0.2.16', '192.0.1.255', '2001:db8:0:1::', '::ffff:192.0.2.1', '010.0.0.1', '192.0.2.999', '192.0.2.1, 8.8.8.8', '2001:db8:::1', '2001:db8::1%eth0', '[2001:db8::1]']) assert.equal((await allowConnector(request(ip), b)).allowed, false, String(ip));
  assert.equal((await allowConnector(request('192.0.2.1', '{}', '/mcp', {'CF-Worker': 'attacker.test'}), b)).allowed, false);
  assert.equal((await allowConnector(request(undefined, '{}', '/mcp', {'X-Forwarded-For': '192.0.2.1', 'X-Real-IP': '192.0.2.1', 'User-Agent': 'ChatGPT'}), b)).allowed, false);
  for (const value of ['0.0.0.0/0', '192.0.2.0/33', '2001:db8::/129', '192.0.2.1/-1']) assert.throws(() => subnet(value));
  assert.equal(address('::1').bits, 128);
});

test('Missing, stale, malformed and unavailable network policy fails closed', async () => {
  const now = Date.now();
  for (const p of [null, policy([], now), policy([{ipv4Prefix: '::1/128'}], now), policy(undefined, now - MAX_POLICY_AGE_MS - 1), policy(undefined, now + 600000), {...policy(), source: 'https://attacker.test/list'}]) {
    assert.throws(() => compilePolicy(p, now));
    await assert.rejects(allowConnector(request('192.0.2.1'), binding(p), now));
  }
  await assert.rejects(allowConnector(request('192.0.2.1'), {}));
  await assert.rejects(allowConnector(request('192.0.2.1'), {get: async () => {throw Error('Unavailable');}}));
  // Cached policy expires even when the cache recheck has not elapsed.
  const b = binding(policy(undefined, now - MAX_POLICY_AGE_MS + 1));
  assert.equal((await allowConnector(request('192.0.2.1'), b, now)).allowed, true);
  await assert.rejects(allowConnector(request('192.0.2.1'), b, now + 2));
});

test('Range refresh validates its bounded official response before replacing the last good policy', async () => {
  const writes = [], b = {put: async (key, value) => writes.push({key, value})};
  const now = Date.now();
  const count = await refreshConnectorPolicy(b, async (url, options) => {assert.equal(url, CONNECTOR_SOURCE); assert.equal(options.redirect, 'error'); return Response.json(policy().document);}, now);
  assert.equal(count, 2); assert.equal(writes.length, 1); assert.equal(JSON.parse(writes[0].value).fetchedAt, now);
  for (const response of [new Response('Unavailable', {status: 503}), Response.json({prefixes: []}), new Response('x'.repeat(65537))]) await assert.rejects(refreshConnectorPolicy(b, async () => response));
  assert.equal(writes.length, 1, 'Failed refresh must retain the last good snapshot');
});

test('Public Worker blocks outsiders and bypass hostnames, enforces both quotas and body limits', async () => {
  let rateCalls = 0, keys = [];
  const limiter = {limit: async ({key}) => {rateCalls++; keys.push(key); return {success: true};}};
  const env = {PUBLIC_HOST: host, CONNECTOR_RANGES: binding(policy()), PUBLIC_IP_LIMITER: limiter, PUBLIC_SERVICE_LIMITER: limiter};
  for (const ip of [undefined, '198.51.100.1']) assert.equal((await publicWorker.fetch(request(ip), env, {})).status, 403);
  assert.equal(rateCalls, 0);
  assert.equal((await publicWorker.fetch(new Request('https://bypass.workers.dev/mcp'), env, {})).status, 404);
  assert.equal((await publicWorker.fetch(request('192.0.2.1'), {...env, CONNECTOR_RANGES: undefined}, {})).status, 503);
  assert.equal((await publicWorker.fetch(request('192.0.2.1'), {...env, PUBLIC_IP_LIMITER: undefined}, {})).status, 503);
  const rejected = await publicWorker.fetch(request('192.0.2.1'), {...env, PUBLIC_SERVICE_LIMITER: {limit: async () => ({success: false})}}, {});
  assert.equal(rejected.status, 429); assert.equal(rejected.headers.get('Retry-After'), '60'); assert.equal(rejected.headers.get('Cache-Control'), 'no-store');
  const large = await publicWorker.fetch(request('192.0.2.1', 'x'.repeat(131073)), env, {});
  assert.equal(large.status, 413); assert.equal(large.headers.get('Cache-Control'), 'no-store');
  assert.ok(keys.every(k => !k.includes('192.0.2.1')));
  const challenge = await publicWorker.fetch(new Request(`https://${host}/.well-known/openai-apps-challenge`), {...env, OPENAI_DOMAIN_CHALLENGE: 'exact-portal-token'}, {});
  assert.equal(await challenge.text(), 'exact-portal-token');
  assert.equal((await publicWorker.fetch(new Request(`https://${host}/spans/arbitrary.txt`), env, {})).status, 404);
});

test('No-sign-in public MCP exposes eleven noauth tools and returns verified evidence', async () => {
  const limit = {limit: async () => ({success: true})};
  const env = {PUBLIC_HOST: host, CONNECTOR_RANGES: binding(policy()), PUBLIC_IP_LIMITER: limit, PUBLIC_SERVICE_LIMITER: limit, ASSETS: {fetch: async req => new Response(readFileSync(resolve(here, '../generated/assets', new URL(req.url).pathname.slice(1))))}};
  const pending = [], ctx = {waitUntil: p => pending.push(p)};
  let id = 0;
  const rpc = async (method, params = {}) => {
    const r = await publicWorker.fetch(request('192.0.2.1', JSON.stringify({jsonrpc: '2.0', id: ++id, method, params})), env, ctx);
    assert.equal(r.status, 200, await r.clone().text()); assert.equal(r.headers.get('Cache-Control'), 'no-store');
    const body = await r.text();
    const p = r.headers.get('Content-Type')?.includes('text/event-stream')
      ? body.split(/\r?\n\r?\n/).map(event => event.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n')).filter(Boolean).map(JSON.parse).find(packet => packet.id === id)
      : JSON.parse(body);
    assert.ok(p && !p.error); return p.result;
  };
  const init = await rpc('initialize', {protocolVersion: '2025-06-18', capabilities: {}, clientInfo: {name: 'public-study-test', version: '1'}});
  assert.equal(init.serverInfo.version, '0.1.14');
  const list = await rpc('tools/list'); assert.equal(list.tools.length, 11);
  assert.ok(list.tools.every(t => t._meta?.securitySchemes?.[0]?.type === 'noauth'));
  const health = (await rpc('tools/call', {name: 'study_health', arguments: {}})).structuredContent;
  assert.equal(health.runtime_controls.user_authentication, false);
  assert.equal(health.runtime_controls.rate_limit_scope, 'shared_connector_ip_and_service');
  const passage = (await rpc('tools/call', {name: 'fetch_passage', arguments: {reference: 'Genesis 1:1-3', sources: ['WLC']}})).structuredContent;
  assert.equal(passage.source_packets[0].records.length, 3);
  assert.equal(passage.source_packets[0].evidence.repository, 'Admin-Beflaire/Bible-Sources');
  const bad = await publicWorker.fetch(request('192.0.2.1', '{}', '/mcp', {Origin: 'https://unrelated.invalid'}), env, ctx);
  assert.equal(bad.status, 403);
  await Promise.all(pending);
});
