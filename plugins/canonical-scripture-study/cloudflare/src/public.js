import {createMcpHandler} from 'agents/mcp/server';
import {createServer} from './worker.js';
import {VERSION} from './common.js';
import {bundle} from './store.js';
import {readBoundedBody, BodyLimitError, enforceRateLimit} from './http.js';
import {allowConnector, refreshConnectorPolicy} from './network.js';

const handlers = new WeakMap();
const noStore = response => {
  const headers = new Headers(response.headers); headers.set('Cache-Control', 'no-store');
  return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
};
const runtimeControls = {access: 'connector_network_allowlist', user_authentication: false, rate_limit_scope: 'shared_connector_ip_and_service', connector_ip_requests_per_minute: 600, service_requests_per_minute: 1200};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!env.PUBLIC_HOST || url.hostname !== env.PUBLIC_HOST) return new Response('Not found', {status: 404});
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) return noStore(Response.json({name: 'Canonical Scripture Study', version: VERSION, mcp_path: '/mcp', source_commit: bundle.source_commit, ...runtimeControls}));
    // This route is public only for the exact portal-provided domain challenge.
    if (request.method === 'GET' && url.pathname === '/.well-known/openai-apps-challenge' && env.OPENAI_DOMAIN_CHALLENGE) return new Response(env.OPENAI_DOMAIN_CHALLENGE, {headers: {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store'}});
    if (url.pathname !== '/mcp') return new Response('Not found', {status: 404});
    let caller;
    try {caller = await allowConnector(request, env.CONNECTOR_RANGES);} catch {
      console.error(JSON.stringify({event: 'connector_policy_unavailable'}));
      return noStore(new Response('Connector network policy temporarily unavailable', {status: 503}));
    }
    if (!caller.allowed) return noStore(new Response('Forbidden', {status: 403}));
    for (const [binding, identity] of [[env.PUBLIC_IP_LIMITER, caller.ip], [env.PUBLIC_SERVICE_LIMITER, 'all-connectors']]) {
      const limited = await enforceRateLimit(request, {sub: identity}, 'connector-network', binding);
      if (limited) return noStore(limited);
    }
    if (request.method === 'POST') {
      if (+request.headers.get('Content-Length') > 128 * 1024) return noStore(new Response('Request too large', {status: 413}));
      let body;
      try {body = await readBoundedBody(request.body, 128 * 1024);} catch (error) {return noStore(new Response(error instanceof BodyLimitError ? 'Request too large' : 'Invalid request body', {status: error instanceof BodyLimitError ? 413 : 400}));}
      request = new Request(request, {body});
    }
    if (!handlers.has(env.ASSETS)) handlers.set(env.ASSETS, createMcpHandler(() => createServer(env.ASSETS, env.PUBLIC_IP_LIMITER, {noAuth: true, runtimeControls}), {route: '/mcp', responseMode: 'json', legacy: 'stateless', corsOptions: {origin: 'https://chatgpt.com'}}));
    return noStore(await handlers.get(env.ASSETS)(request, env, ctx));
  },
  async scheduled(controller, env, ctx) {
    try {
      const count = await refreshConnectorPolicy(env.CONNECTOR_RANGES);
      console.log(JSON.stringify({event: 'connector_policy_refreshed', prefixes: count}));
    } catch (error) {
      console.error(JSON.stringify({event: 'connector_policy_refresh_failed', error: error?.name ?? 'Error'}));
      throw error;
    }
  },
};
