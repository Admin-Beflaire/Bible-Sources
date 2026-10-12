import {readBoundedBody} from './http.js';

export const CONNECTOR_SOURCE = 'https://openai.com/chatgpt-connectors.json';
export const POLICY_KEY = 'chatgpt-connectors:v1';
export const MAX_POLICY_AGE_MS = 48 * 60 * 60 * 1000;
// Only the common public network policy is cached; never request/user data.
const policies = new WeakMap();

export function address(value) {
  if (typeof value !== 'string' || !value || value.length > 45 || value.trim() !== value) throw Error('Invalid IP');
  if (!value.includes(':')) {
    const parts = value.split('.');
    if (parts.length !== 4 || parts.some(p => !/^(0|[1-9][0-9]{0,2})$/.test(p) || +p > 255)) throw Error('Invalid IPv4');
    return {bits: 32, value: parts.reduce((n, p) => (n << 8n) | BigInt(p), 0n)};
  }
  if (!/^[0-9a-fA-F:.]+$/.test(value) || value.split('::').length > 2) throw Error('Invalid IPv6');
  let text = value;
  if (text.includes('.')) {
    const split = text.lastIndexOf(':');
    const tail = address(text.slice(split + 1));
    if (tail.bits !== 32) throw Error('Invalid IPv6 tail');
    text = text.slice(0, split + 1) + (tail.value >> 16n).toString(16) + ':' + (tail.value & 65535n).toString(16);
  }
  const halves = text.split('::'), left = halves[0] ? halves[0].split(':') : [], right = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  if ([...left, ...right].some(p => !/^[0-9a-fA-F]{1,4}$/.test(p))) throw Error('Invalid IPv6 group');
  const omitted = 8 - left.length - right.length;
  if (halves.length === 1 ? omitted !== 0 : omitted < 1) throw Error('Invalid IPv6 length');
  const groups = halves.length === 2 ? [...left, ...Array(omitted).fill('0'), ...right] : left;
  return {bits: 128, value: groups.reduce((n, p) => (n << 16n) | BigInt('0x' + p), 0n)};
}

export function subnet(text) {
  const parts = typeof text === 'string' ? text.split('/') : [];
  if (parts.length !== 2 || !/^(0|[1-9][0-9]{0,2})$/.test(parts[1])) throw Error('Invalid subnet');
  const ip = address(parts[0]), prefix = +parts[1];
  if (prefix < 1 || prefix > ip.bits) throw Error('Invalid prefix');
  const shift = BigInt(ip.bits - prefix);
  return {bits: ip.bits, shift, network: ip.value >> shift};
}

export function compilePolicy(policy, now = Date.now()) {
  if (!policy || policy.source !== CONNECTOR_SOURCE || !Number.isFinite(policy.fetchedAt) || policy.fetchedAt > now + 300000 || now - policy.fetchedAt > MAX_POLICY_AGE_MS) throw Error('Missing or stale connector policy');
  const source = policy.document;
  if (!source || typeof source.creationTime !== 'string' || !Number.isFinite(Date.parse(source.creationTime)) || !Array.isArray(source.prefixes) || source.prefixes.length < 1 || source.prefixes.length > 1000) throw Error('Invalid connector document');
  const ranges = source.prefixes.map(p => {
    const fields = ['ipv4Prefix', 'ipv6Prefix'].filter(k => typeof p?.[k] === 'string');
    if (fields.length !== 1) throw Error('Invalid connector prefix');
    const range = subnet(p[fields[0]]);
    if (range.bits !== (fields[0] === 'ipv4Prefix' ? 32 : 128)) throw Error('IP family mismatch');
    return range;
  });
  return {ranges, expires: policy.fetchedAt + MAX_POLICY_AGE_MS, fetchedAt: policy.fetchedAt};
}

export async function allowConnector(request, binding, now = Date.now()) {
  // Cloudflare supplies CF-Connecting-IP. Do not accept forwarded headers or
  // Worker subrequests (their originating client headers can be rewritten).
  if (request.headers.has('CF-Worker')) return {allowed: false};
  let ip;
  try {ip = address(request.headers.get('CF-Connecting-IP'));} catch {return {allowed: false};}
  if (!binding?.get) throw Error('Connector policy binding missing');
  let cached = policies.get(binding);
  if (!cached || now > cached.recheck || now > cached.expires) {
    const policy = await binding.get(POLICY_KEY, {type: 'json', cacheTtl: 60});
    cached = {...compilePolicy(policy, now), recheck: now + 60000};
    policies.set(binding, cached);
  }
  const allowed = cached.ranges.some(r => r.bits === ip.bits && (ip.value >> r.shift) === r.network);
  return {allowed, ip: allowed ? `${ip.bits}:${ip.value.toString(16)}` : undefined};
}

export async function refreshConnectorPolicy(binding, fetcher = fetch, now = Date.now()) {
  if (!binding?.put) throw Error('Connector policy binding missing');
  const response = await fetcher(CONNECTOR_SOURCE, {redirect: 'error', signal: AbortSignal.timeout(15000)});
  if (!response.ok) throw Error('Connector source unavailable');
  const bytes = await readBoundedBody(response.body, 65536);
  const document = JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes));
  const policy = {source: CONNECTOR_SOURCE, fetchedAt: now, document};
  const compiled = compilePolicy(policy, now);
  await binding.put(POLICY_KEY, JSON.stringify(policy));
  policies.delete(binding);
  return compiled.ranges.length;
}
