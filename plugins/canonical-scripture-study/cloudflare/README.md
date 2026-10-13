# Cloudflare hosting and runtime controls

Canonical Scripture Study runs on Cloudflare Workers and Workers Static Assets. ChatGPT performs translation, exegesis and theology; the Worker retrieves bounded verified evidence and makes no model API calls. The private channels require no model API key, R2, Containers or database. The public service uses one KV namespace containing only OpenAI's public connector network ranges.

| Channel | Branch | MCP endpoint | Git deploy command |
| --- | --- | --- | --- |
| Production | `main` | https://study.canonical-theology.com/mcp | `npx wrangler deploy` |
| Preview | `preview` | https://preview-canonical-scripture-study.shrill-shadow-3258.workers.dev/mcp | `npx wrangler preview` |
| Public MCP | `preview` | https://mcp.canonical-theology.com/mcp | `npx wrangler deploy --config wrangler.public.jsonc` |

The private Production and Preview connections use the existing Access application and Managed OAuth. The separate public MCP service uses a connector network allowlist without user authentication. Its workers.dev and version preview URLs are disabled. The unneeded production workers.dev route is disabled; origin JWT validation also protects Preview. Reuse the existing access configuration and endpoints. See the root [release table](../../../README.md#releases-and-connections) for deployed versions.

## Existing Git deployment

The repository is [Admin-Beflaire/Bible-Sources](https://github.com/Admin-Beflaire/Bible-Sources), transferred on 12 October 2026. The existing Cloudflare build connection now uses this owner. Production on `main` remains 0.1.10. Preview is verified at 0.1.15 and targets candidate 0.1.16 from `preview`; the separate public MCP Worker remains on 0.1.11. Its automatic build path filter was suspended with user approval while Preview delivery is evaluated. Restore its original `path_includes: ["*"]` only when promoting an approved public release. The private endpoints, Access application and rate-limit namespaces are preserved. The pinned source commit and source hashes are retained, with evidence links identifying the new repository location.

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

The separately deployed public service below does not use this Access application. End users do not need a Cloudflare account or access to the maintainer’s account.

## Public MCP without an additional sign-in

Connect **https://mcp.canonical-theology.com/mcp** with **No authentication**. OAuth discovery, authorization, token, registration URLs, client IDs, secrets and scopes are not needed. [mcp.public.json](../mcp.public.json) contains the remote configuration; use it as `mcp.json` in a separate public submission package. The original `mcp.json` continues to configure local stdio. Deploying this service does not publish a Plugins Directory listing.

`src/public.js` checks the edge-provided `CF-Connecting-IP` for every `/mcp` method before quotas, body reads or tool execution. Only ranges from **https://openai.com/chatgpt-connectors.json** are accepted. It ignores user agents and forwarded IP headers, rejects Worker subrequests and rejects hostnames other than `PUBLIC_HOST`. Requests outside the ranges return 403. Missing, malformed or more than 48-hour-old policy returns 503. IPv4 and IPv6 prefixes are validated; malformed addresses and unrestricted `/0` policies are rejected.

The scheduled handler downloads the official list every six hours at minute 17 UTC (`17 */6 * * *`), with a 15-second timeout and 64 KiB response bound. Validation precedes the KV write. A failed refresh retains the last good policy until it expires, then the endpoint fails closed. Freshness uses the last successful download, not the document's publication date. In-memory/KV policy caching is bounded to 60 seconds. KV is eventually consistent, so removals may take time to propagate.

The provisioned `CONNECTOR_RANGES` namespace is `canonical-scripture-study-public-connector-ranges`. Before an initial deployment, seed its `chatgpt-connectors:v1` key with `{ "source": "https://openai.com/chatgpt-connectors.json", "fetchedAt": <current Unix milliseconds>, "document": <validated downloaded JSON> }`. A new account must provision its own namespace and rate-limit IDs. Do not serve an unseeded policy or whitelist local test IPs.

The public limiter uses separate namespaces: `73001903` allows 600 MCP requests per connector IP per minute; `73001904` allows 1,200 per minute across this service at each Cloudflare location. All MCP methods count. Keys are hashed canonical edge-verified addresses or the fixed service identity. These shared, approximate counters cannot provide per-user quotas without user identity. Missing/unavailable bindings fail closed; excess requests receive 429 with `Retry-After: 60`. Streamed POST bodies remain limited to 128 KiB. Public tools declare `noauth`, expose the same eleven read-only tools and verified evidence, and return `Cache-Control: no-store`.

The restriction identifies OpenAI's connector infrastructure, not a particular ChatGPT user, organization or approved app installation. Users of that infrastructure can access this read-only service. It is enforced in the Worker, so denied requests still invoke the Worker and count toward platform quotas; it is not an edge WAF rule or a global spending cap. No paid plan has been enabled. The public source repository remains independently readable.

`GET /` and `GET /health` expose basic status; raw assets and other paths return 404. `run_worker_first: true` prevents Static Assets from bypassing the guard. The optional `OPENAI_DOMAIN_CHALLENGE` variable serves only the portal-provided token at `GET /.well-known/openai-apps-challenge`; no token has been set by this release. Keep both `workers_dev` and `preview_urls` disabled. Private Access/JWT checks remain enabled in `src/worker.js`.

A positive live MCP test must originate from ChatGPT's connector network; a locally injected `CF-Connecting-IP` tests code paths only. Check public `study_health` for the release and `connector_network_allowlist` controls. Monitor `connector_policy_refreshed`, `connector_policy_refresh_failed` and `connector_policy_unavailable` events, and verify the installed Cron trigger and policy freshness.

## Runtime controls and monitoring

The private channels retain the 0.1.10 controls and use `MCP_RATE_LIMITER`, configured at both the top level and in `previews` in `wrangler.jsonc`. Each verified user can make 120 authenticated MCP POST requests per 60 seconds. Initialization and notifications count. HTTP 429 responses include `Retry-After: 60`; retry after that delay. Missing or unavailable bindings return 503 rather than silently removing protection. Authentication precedes rate limiting. Keys hash verified identity and include the hostname; they never use raw tokens, user-supplied IDs or shared ChatGPT proxy IPs. Valid service assertions without a user identifier share a service bucket.

Namespaces `73001901` (Preview) and `73001902` (Production) isolate counters. Cloudflare counters are approximate, eventually consistent and local to each Cloudflare location. This protects against bursts; it is not global usage accounting, an account-wide daily CPU/request cap or a replacement for edge DDoS protection. Access-managed OAuth discovery, authorization, token and registration endpoints do not pass through the MCP limiter.

Bodies are read incrementally and cancelled above 128 KiB, including requests without Content-Length. Asset reads stop at their registered byte length, then undergo SHA-256 verification. Existing packet, source-span and per-call retrieval bounds remain unchanged. The 8 MiB isolate-local LRU caches only verified public source bytes. Signing keys retain the existing `jose` remote-JWKS cache. Immutable instructions and tool schemas are assembled once per isolate; deployment code is minified. Authenticated MCP responses are `no-store`. Conversation state and personalized responses are not cached.

Wrangler observability enables stored invocation logs at 100% sampling for this private trial, with URL query strings redacted. Invocation records show CPU time, wall time, HTTP outcomes and deployment version. Structured `study_tool` events contain only tool name, release, outcome/error code, elapsed milliseconds, response bytes, asset fetches/bytes and verified-cache hits. They omit prompts, arguments, source text, identities and tokens. Tool elapsed time is wall time; CPU measurement comes from the invocation record. `rate_limited` and `rate_limiter_unavailable` events identify protection failures. Authenticated `study_health` confirms the limiter binding and reports body/cache bounds.

In Cloudflare's Workers & Pages area, select the intended Production Worker or Preview and Observability/Logs, or use the account Query Builder and filter to that channel. Filter `study_tool` by version, tool or outcome; inspect invocation CPU/wall time and 429/503 responses. Compare first retrievals with repeated retrievals using `asset_fetches` and `cache_hits`. Review slow Full plans, passage retrieval, word studies and DSS calls. The Cloudflare plugin can query these events through the Workers Observability API. Logs begin at deployment; the earlier release had no stored invocation sample available for comparison. No notification recipient or alert delivery has been configured.

These controls do not upgrade the account or provision paid storage/model services. Platform quotas remain; consult current [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) and [limits](https://developers.cloudflare.com/workers/platform/limits/). If real studies exceed a CPU quota, inspect slow operations before considering a hosting change. Do not silently shorten a study.

## Verification and development

The build verifies 103 metadata files and 64,108 source spans, producing 13,369 evidence assets; the largest is 782,080 bytes. The builder checks configured ceilings of 20,000 files and 25 MiB/file. Current counts appear in `generated/build-report.json`. Generated Wrangler types confirm `MCP_RATE_LIMITER: RateLimit` and `ASSETS: Fetcher`.

Release checks cover 39 Python tests, 29 Worker tests and 1,956 Python/Worker parity comparisons, including chapter boundaries, all 50 word studies and selected lexical IDs. Protocol tests use locally generated signed assertions and exercise eleven tools, twelve resources, authentication failures, overload, streaming limits and source tampering. Public regressions also cover network boundaries, stale/malformed policy, bounded refresh and last-good retention, bypass hosts, quotas, body limits and the no-sign-in MCP lifecycle. These local checks and dry runs are distinct from live Cloudflare CPU measurements.

Run `npm test` for regressions, `npm run build` for the private deployment dry run, `npm run build:public` for the public dry run, and `npm run dev` for local private Wrangler. For local authenticated tests, use the protocol test's generated signing keys; never commit a real Access assertion. `npm run smoke -- <endpoint>` requires an authenticated transport; the protocol test wraps that script locally. Connected Cloudflare and Canonical Scripture Study plugins can perform live verification without exposing credentials.

## Data and state

`prepare:data` verifies 103 required metadata files and 64,108 unique source spans against the pinned profile before producing assets. Native chapter spans remain byte-for-byte intact. DSS is packaged by native verse while preserving physical-record order, nullable linguistic cells and passage reconstruction statuses; the prepared subset contains the 23,422 mapped physical records available through the current base-book router. Unmapped/nonbiblical DSS material remains in the source repository and is outside the current tool routes. The generated files are ignored by Git and are reproducible from the existing source snapshot.

Every retrieved asset is SHA-256 checked against the build manifest before parsing. Original edition paths, byte offsets, lengths, source hashes and commit remain in evidence packets. Runtime caches contain only verified public source bytes. No conversation state is saved on the server: ChatGPT passes back the returned `continuation_state`. Raw static asset paths are not public application routes; access is through bounded read-only tools. Rahlfs is excluded. Source-specific terms and attribution remain in force, including **CC BY-NC 4.0 for DSS**. Code is covered by the parent plugin's MIT licence.

Official setup references, checked 12 October 2026:

- [OpenAI connector IP ranges](https://developers.openai.com/api/docs/guides/ip-addresses)
- [Workers Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Static asset billing and limits](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Workers platform limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Workers Git build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Add a custom MCP server in ChatGPT](https://developers.openai.com/api/docs/guides/custom-mcp-server)
- [Package the complete plugin](https://developers.openai.com/plugins/build/plugins)

## Preview timing and staged delivery

Only `previews.vars` enables `PREVIEW_DELIVERY=true`. Normal private production and
public deployments do not enable it; the noauth server additionally refuses this
feature regardless of that flag. Candidate Preview registers 12 tools (the original eleven minus `check_handoff`,
plus `preview_timestamp` and `study_delivery`) and one additional UI resource.

For passage studies the active part is returned by `study_plan`, which loads only
its relevant skills. Full uses translation/footnotes, local explanation, historical
context, then canonical synthesis/formation. Each part ends the turn. Next uses the
exact `next_delivery_state` to continue the same passage; the final Next advances
the passage. An interrupted part can be resumed. State remains in the conversation
and tool output; no server-side study store, user identifier or transcript log is added.

The UI resource is self-contained, has no external connections, and sends a
user-triggered Next through the MCP Apps bridge with a ChatGPT compatibility fallback.
It does not control ChatGPT's native suggested-response buttons. Actual rendering
and follow-up support must be tested in the user's web, desktop and mobile clients.
Typed Next remains the fallback. Refresh the existing Preview connection to scan the
new tools and resource, then test in a new conversation.

Timestamps use DD-MM-YYYY and a 24-hour clock in Europe/Amsterdam, including daylight
saving time. First-tool and pre-output timestamps are server checks. The ready call
measures part preparation from the plan/continuation call; it excludes time before
that call and after it, including subsequent text generation and client rendering.
The button separately shows its local click time. Never infer a full response duration
from a later user message timestamp. Directory publication remains on hold while the
improvements are evaluated; the existing public runtime remains 0.1.11.

### Preview debug mode and cached-tool fallback (0.1.14)

`previews.vars.PREVIEW_DEBUG=true` enables compact observed-operation metrics and
verbose diagnostic reporting instructions. Public/noauth and normal private servers
never receive these debug fields. No new storage or transcript logging is added.
Debug off/on affects visible reporting within the conversation, not a server setting.

Preview's planner bundles the complete active skill documents. Instruction reads are
short routers by default, with explicit full reads available. The existing planner can
supply Clock and Ready/Next/Resume so a stale tool scan does not block delivery. UI
metadata still requires a connection refresh. Evaluation uses a fully typed Preview
schema and unchanged strict semantic validation. No full verse mapping is introduced
in this delivery release; that work remains next after delivery evaluation.

### Preview translation corrections (0.1.16 candidate)

Preview planning uses local metadata without retrieving an opening verse. Its explicit retrieval plan uses named editions and text/linguistic detail. Inspect dependent openings after retrieving the active passage and retain needed preceding context. Sources-only restrictions preserve the translation key, literary scope and continuation; cached connections can use comma source options.

Preview removes check_handoff, retains strict reading-selection evidence checks, and supplies request-local metrics and correlation IDs without transcript logging. Both successful and domain-error results carry real clocks. Ready is explicitly awaiting host output; the UI describes elapsed time between server checks without claiming to measure text generation or output completion.

Private/public dry runs passed for the candidate. They do not deploy either service. [Release status](../../../development/release-status.md) records the live checks and deployment; [benchmark protocol](../../../development/benchmark-protocol.md) separates exploratory host observations, local runtime replays and still-pending controlled host tests.
