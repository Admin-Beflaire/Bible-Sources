// Enforce bounds as chunks arrive, including requests without Content-Length.
export class BodyLimitError extends Error {}
export async function readBoundedBody(body, limit) {
  if (!body) return new Uint8Array();
  const reader = body.getReader(), chunks = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        // Cancellation can depend on the sender; do not delay the rejection.
        void reader.cancel().catch(() => {});
        throw new BodyLimitError('Body exceeds its byte budget');
      }
      chunks.push(value);
    }
  } finally {reader.releaseLock();}
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.byteLength;}
  return bytes;
}

export async function enforceRateLimit(request, payload, issuer, binding) {
  if (!binding?.limit) return new Response('Rate limiter not configured', {status: 503});
  // Callers supply a verified Access identity or an edge-verified network key;
  // never use a client-supplied ID or raw token.
  const identity = payload.sub || payload.email || payload.common_name || 'authenticated-service';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${issuer}\n${identity}`));
  const key = `mcp:${new URL(request.url).hostname}:${Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')}`;
  try {
    const {success} = await binding.limit({key});
    if (success) return null;
    console.log(JSON.stringify({event: 'rate_limited', route: '/mcp', status: 429}));
    return new Response('Too many requests. Retry after 60 seconds.', {status: 429, headers: {'Retry-After': '60', 'Cache-Control': 'no-store'}});
  } catch {
    console.error(JSON.stringify({event: 'rate_limiter_unavailable', route: '/mcp', status: 503}));
    return new Response('Rate limiter temporarily unavailable', {status: 503, headers: {'Retry-After': '60'}});
  }
}
