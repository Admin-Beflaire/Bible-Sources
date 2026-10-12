# Cloudflare hosting and runtime controls

Canonical Scripture Study runs on Cloudflare Workers and Workers Static Assets. ChatGPT performs translation, exegesis and theology; the Worker retrieves bounded verified evidence and makes no model API calls. No model API key, R2, Containers or database binding is required.

| Channel | Branch | MCP endpoint | Git deploy command |
| --- | --- | --- | --- |
| Production | `main` | https://study.canonical-theology.com/mcp | `npx wrangler deploy` |
| Preview | `preview` | https://preview-canonical-scripture-study.shrill-shadow-3258.workers.dev/mcp | `npx wrangler preview` |

Both connections use the existing Access application and Managed OAuth. The unneeded production workers.dev route is disabled; origin JWT validation also protects Preview. Reuse the existing access configuration and endpoints. See the root [release table](../../../README.md#releases-and-connections) for deployed versions.

## Existing Git deployment

GitHub integration uses root `plugins/canonical-scripture-study/cloudflare`, Node 22+, `npm ci`, build command `npm run prepare:data` and the channel-specific deploy command above. Preview auto-builds are enabled. The full repository checkout supplies pinned source data. Preserve `ASSETS`, `TEAM_DOMAIN`, `POLICY_AUD` and `MCP_RATE_LIMITER`. `keep_vars` preserves dashboard text variables; Preview specifies Access variables explicitly.

Changes go to Preview first, followed by live checks after a successful build. Production promotion is a separately authorized merge to `main`. Source preparation is deterministic and asset uploads reuse unchanged files. Recreating the ChatGPT connection or changing its icon is unnecessary.

For local development, clone the repository, enter this directory and run `npm ci` and `npm test`. `npm run dev` starts Wrangler locally. `npm run deploy` targets production and belongs only to an authorized production release; it is not the Preview test command. A deployment in another account requires that account's Access variables and distinct rate-limit namespaces.

## Connect it in ChatGPT

On ChatGPT web, open **Plugins → + → Add custom MCP server**. Name it **Canonical Scripture Study**, enter the deployed HTTPS `/mcp` URL, and select **OAuth** after configuring Cloudflare Access as described below. Review ChatGPT's connection prompt, create the personal plugin, then install it. In a new Work conversation select **@Canonical Scripture Study** and try:

- `Full study Romans 12:1-2`
- `Word study testing. Compare Matthew 6:13 and James 1:13.`
- `Translate Genesis 1-2, in Dutch, with original language interlinear`
- `Next`

The initial connection supplies the tools, server-wide method and translation key, and `get_study_instructions`, which retrieves the exact eight published skill instructions on demand. It also exposes twelve methodology resources. This allows an initial study trial through the MCP connection. Registering an MCP server does not itself install the repository's skill folders as native ChatGPT skills. To install the complete bundled plugin afterward, copy the registered connection ID beginning `plugin_asdk_app...` and wire that existing connection to this plugin's eight skills using the supported plugin packaging flow. There is no need to build a separate study website.


## Secure a private deployment with Cloudflare Access

The Worker **requires valid Cloudflare Access JWT assertions for every `/mcp` request**, including requests through a `workers.dev` hostname. Without environment configuration it fails closed with HTTP 503; requests lacking assertions are refused with HTTP 403. The existing `/health` endpoint remains an intentionally public, non-sensitive status response.

For a new deployment:

1. Configure a Cloudflare Access **self-hosted application** for the Worker custom domain (for example, `study.canonical-theology.com`), with an Allow policy for your exact email. Do not use an Everyone policy for a personal deployment.
2. In Zero Trust, copy the application's **Application Audience (AUD) Tag** from Additional settings, and your **Team domain** (for example, `https://example.cloudflareaccess.com`).
3. Under **Workers & Pages → canonical-scripture-study → Settings → Variables and Secrets**, add two text variables named `TEAM_DOMAIN` and `POLICY_AUD`. The configured `keep_vars` setting preserves dashboard variables across Wrangler deployments. Neither value is a client secret.
4. Deploy and test that unauthenticated `/mcp` requests are rejected. In Access application settings, under **Advanced settings**, enable **Managed OAuth**. Configure the Access token lifetime to approximately 15 minutes and the grant session to up to 14 days. Only allow redirect URIs actually needed by trusted OAuth clients.
5. In ChatGPT, reconnect the personal MCP plugin to the custom domain using **OAuth**. Complete the Cloudflare login through your permitted account and smoke-test actual tool calls.
6. After OAuth works, disable the unneeded `workers.dev` route. JWT checks remain enabled as defense in depth.

For a new deployment, configure `TEAM_DOMAIN`, `POLICY_AUD` and the `MCP_RATE_LIMITER` binding before serving MCP requests. Otherwise the MCP endpoint intentionally stops responding to valid tool calls. Cloudflare Access handles the OAuth browser flow and forwards a signed JWT in `Cf-Access-Jwt-Assertion`; the Worker validates the JWT signature, issuer, audience and expiry before it runs tools. ChatGPT's OAuth access token is not itself a JWT for this Worker to verify.

For future public release, keep JWT validation but replace the single-email Access policy with a suitable public-user authentication policy and identity provider. Do not provide Cloudflare-account access to end users.

## Runtime controls and monitoring

Version 0.1.10 on both channels uses `MCP_RATE_LIMITER`, configured at both the top level and in `previews` in `wrangler.jsonc`. Each verified user can make 120 authenticated MCP POST requests per 60 seconds. Initialization and notifications count. HTTP 429 responses include `Retry-After: 60`; retry after that delay. Missing or unavailable bindings return 503 rather than silently removing protection. Authentication precedes rate limiting. Keys hash verified identity and include the hostname; they never use raw tokens, user-supplied IDs or shared ChatGPT proxy IPs. Valid service assertions without a user identifier share a service bucket.

Namespaces `73001901` (Preview) and `73001902` (Production) isolate counters. Cloudflare counters are approximate, eventually consistent and local to each Cloudflare location. This protects against bursts; it is not global usage accounting, an account-wide daily CPU/request cap or a replacement for edge DDoS protection. Access-managed OAuth discovery, authorization, token and registration endpoints do not pass through the MCP limiter.

Bodies are read incrementally and cancelled above 128 KiB, including requests without Content-Length. Asset reads stop at their registered byte length, then undergo SHA-256 verification. Existing packet, source-span and per-call retrieval bounds remain unchanged. The 8 MiB isolate-local LRU caches only verified public source bytes. Signing keys retain the existing `jose` remote-JWKS cache. Immutable instructions and tool schemas are assembled once per isolate; deployment code is minified. Authenticated MCP responses are `no-store`. Conversation state and personalized responses are not cached.

Wrangler observability enables stored invocation logs at 100% sampling for this private trial, with URL query strings redacted. Invocation records show CPU time, wall time, HTTP outcomes and deployment version. Structured `study_tool` events contain only tool name, release, outcome/error code, elapsed milliseconds, response bytes, asset fetches/bytes and verified-cache hits. They omit prompts, arguments, source text, identities and tokens. Tool elapsed time is wall time; CPU measurement comes from the invocation record. `rate_limited` and `rate_limiter_unavailable` events identify protection failures. Authenticated `study_health` confirms the limiter binding and reports body/cache bounds.

In Cloudflare's Workers & Pages area, select the intended Production Worker or Preview and Observability/Logs, or use the account Query Builder and filter to that channel. Filter `study_tool` by version, tool or outcome; inspect invocation CPU/wall time and 429/503 responses. Compare first retrievals with repeated retrievals using `asset_fetches` and `cache_hits`. Review slow Full plans, passage retrieval, word studies and DSS calls. The Cloudflare plugin can query these events through the Workers Observability API. Logs begin at deployment; the earlier release had no stored invocation sample available for comparison. No notification recipient or alert delivery has been configured.

These controls do not upgrade the account or provision paid storage/model services. Platform quotas remain; consult current [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) and [limits](https://developers.cloudflare.com/workers/platform/limits/). If real studies exceed a CPU quota, inspect slow operations before considering a hosting change. Do not silently shorten a study.

## Verification and development

The build verifies 103 metadata files and 64,108 source spans, producing 13,369 evidence assets; the largest is 782,080 bytes. The builder checks configured ceilings of 20,000 files and 25 MiB/file. Current counts appear in `generated/build-report.json`. Generated Wrangler types confirm `MCP_RATE_LIMITER: RateLimit` and `ASSETS: Fetcher`.

Release checks cover 38 Python tests, 14 Worker test groups and 1,956 Python/Worker parity comparisons, including chapter boundaries, all 50 word studies and selected lexical IDs. Protocol tests use locally generated signed assertions and exercise eleven tools, twelve resources, authentication failures, overload, streaming limits and source tampering. These local checks and dry runs are distinct from live Cloudflare CPU measurements.

Run `npm test` for regressions, `npm run build` for a deployment dry run, and `npm run dev` for local Wrangler. For local authenticated tests, use the protocol test's generated signing keys; never commit a real Access assertion. `npm run smoke -- <endpoint>` requires an authenticated transport; the protocol test wraps that script locally. Connected Cloudflare and Canonical Scripture Study plugins can perform live verification without exposing credentials.

## Data and state

`prepare:data` verifies 103 required metadata files and 64,108 unique source spans against the pinned profile before producing assets. Native chapter spans remain byte-for-byte intact. DSS is packaged by native verse while preserving physical-record order, nullable linguistic cells and passage reconstruction statuses; the prepared subset contains the 23,422 mapped physical records available through the current base-book router. Unmapped/nonbiblical DSS material remains in the source repository and is outside the current tool routes. The generated files are ignored by Git and are reproducible from the existing source snapshot.

Every retrieved asset is SHA-256 checked against the build manifest before parsing. Original edition paths, byte offsets, lengths, source hashes and commit remain in evidence packets. Runtime caches contain only verified public source bytes. No conversation state is saved on the server: ChatGPT passes back the returned `continuation_state`. Raw static asset paths are not public application routes; access is through bounded read-only tools. Rahlfs is excluded. Source-specific terms and attribution remain in force, including **CC BY-NC 4.0 for DSS**. Code is covered by the parent plugin's MIT licence.

Official setup references, checked 12 October 2026:

- [Workers Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Static asset billing and limits](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Workers platform limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Workers Git build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Add a custom MCP server in ChatGPT](https://developers.openai.com/api/docs/guides/custom-mcp-server)
- [Package the complete plugin](https://developers.openai.com/plugins/build/plugins)
