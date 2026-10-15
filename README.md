# Bible-Sources

Public source data and study software for AI-assisted Bible study, maintained by Mark Gatzen. This repository contains original source files, structured Hebrew/Greek texts, linguistic and manuscript data, curated word studies, verified retrieval indexes, and the working **Canonical Scripture Study** plugin.

## Study plugin

*Study Scripture through its languages, context, and canonical story.*

[Canonical Scripture Study](plugins/canonical-scripture-study/) combines working translation, local exegesis, biblical theology and canonical theology in a ChatGPT conversation. It is already deployed on Cloudflare Workers and connected through separate authenticated Production and Preview plugins. The public repository and the access-controlled study service are separate: publishing the code does not give an arbitrary visitor access to the MCP endpoint or create a public Plugins Directory listing.

### Releases and connections

Private release state verified after deployment on **14 October 2026, 21:07–21:09 CEST**. Public version below is the last successful verification; its current connector health call returns an internal error:

| Connection | Git branch | Version | MCP endpoint |
| --- | --- | --- | --- |
| Production | `main` | **0.1.10** | [study.canonical-theology.com/mcp](https://study.canonical-theology.com/mcp) |
| Preview | `preview` | **0.1.18** | [preview-canonical-scripture-study.shrill-shadow-3258.workers.dev/mcp](https://preview-canonical-scripture-study.shrill-shadow-3258.workers.dev/mcp) |
| Public MCP | `preview` | **0.1.11** (last verified) | [mcp.canonical-theology.com/mcp](https://mcp.canonical-theology.com/mcp) |

Use the connected plugin's `study_health` tool to check the actual running version and source revision. A Git commit becomes live only after a successful Cloudflare build. Changes are tested in Preview before an explicitly authorized promotion to `main`; only these two branches are retained. Production is verified at 0.1.10 and private Preview at 0.1.18; the separate public endpoint was last successfully verified at 0.1.11. Public automatic builds remain suspended. Preview retains the 0.1.16 handoff-tool omission, source restrictions, translation rules and observable diagnostics; host performance remains unverified. All include the 0.1.9 study-dialogue and bounded-source policies. Production 0.1.8 was previously promoted through [PR #5](https://github.com/Admin-Beflaire/Bible-Sources/pull/5). See [release notes](plugins/canonical-scripture-study/CHANGELOG.md) and the [Preview source](https://github.com/Admin-Beflaire/Bible-Sources/tree/preview/plugins/canonical-scripture-study).

Preview 0.1.18 is implemented, tested and deployed privately. Live contracts verify timestamp-first progress, silent study guidance, the existing four parts and the new Full reference appendix. Both exegesis and theology guidance reach the final part; exact scope, Dutch/original interlinear and WLC-only restrictions survive continuation. Ready refreshes the layout, and Next advances Genesis 1:1–2:3 to Genesis 2:4–25. Planning retains zero asset reads. These checks verify tool contracts; a fresh generated host study and controlled timing remain outstanding.

The complete 14 October Work check supplied all four parts on the same passage: translation (46s), local explanation (55s), historical context (2m2s) and canonical synthesis (1m31s). These reported durations sum to 5m14s, excluding waits between turns, and remain exploratory observations. The final part already includes narrative development, intertextual argument, Christ/Spirit integration and formation, and suggests Genesis 2:4–25. Actual next-passage execution and Chat remain unverified. Private Preview 0.1.18 now deploys silent study guidance, integrated secondary research, explicit progress clocks and organized Full reference support; a fresh host study remains pending. See the [host observation](development/host-observation-genesis1-2026-10-14.md) and [release status](development/release-status.md).

A separate manuscript/translation-variance section remains inactive until the full verse-mapping index is reviewed. The new [development index](indexes/verse-mapping/README.md) inventories 106,223 native verse references and registers all 66,557 DSS physical records, including unassigned and nonbiblical material. The current [Genesis mapping checkpoint](development/verse-mapping-progress.md) contains 4,575 source-linked edition correspondences across all 50 chapters for WLC↔UXLC, WLC↔TAHOT and WLC↔Brenton Greek. DSS review covers 802 / 842 physical records, with 40 remaining; partial physical support, reconstruction-only and provisional placements remain distinct. This development index is not integrated into study tools. Text verification and model review are distinguished. Matching labels are not verified equivalence. See the [backlog](development/backlog.md).

The original Theology 1.4.2 paper and the Theology/Christology/Pneumatology source/site structure inform the [Full-study coverage](development/full-study-reference-design.md) implemented and privately deployed in 0.1.18: consequential language analysis, historical context, narrative development, explained intertextual relationships, Christ/Spirit integration, formation and a supporting reference appendix. The appendix stays within the existing final part; translation remains first. Standard/Detailed and focused requests retain proportionate scope.

The private Production and Preview connections use Cloudflare Access OAuth. The Worker also validates the Access JWT signature, issuer, audience and expiry at its origin; `/mcp` fails closed when authentication/configuration is missing. Public `/health` exposes only basic deployment status. Reuse the existing endpoint after a release, refresh the plugin's tool metadata/instructions where the host provides that control, and test in a new conversation. A Worker release does not automatically change the ChatGPT plugin card's name/icon or separately imported skill files.

Version 0.1.10 added the private Cloudflare runtime controls retained by both channels: 120 authenticated MCP POST requests per user per minute, separate Preview/production counters, streamed 128 KiB request bounds, verified-source cache metrics, minified code and stored invocation/tool logs for CPU, wall time, failures and cache use. Counters are approximate and local to each Cloudflare location. Authenticated MCP responses are `no-store`; only verified public source bytes are cached. Custom logs omit prompts, tool arguments, source text, identities and tokens; invocation URL query strings are redacted. See the [hosting and monitoring guide](plugins/canonical-scripture-study/cloudflare/README.md).

Version 0.1.11 adds a separate public MCP endpoint with **No authentication** and no extra end-user sign-in. Every MCP request must originate from OpenAI's published ChatGPT connector ranges; ordinary Internet requests are denied. A scheduled refresh updates those ranges every six hours, retaining a valid last-good policy and failing closed after 48 hours without a successful refresh. Shared connector-IP and service rate limits replace per-user quotas for this endpoint. The network restriction cannot identify a particular user or app installation. Private Access settings remain intact. See [the public MCP guide](plugins/canonical-scripture-study/cloudflare/README.md#public-mcp-without-an-additional-sign-in) and [remote configuration](plugins/canonical-scripture-study/mcp.public.json). This deployment is preparation for public availability; it does not create a Plugins Directory listing.

The [public-submission source](plugins/canonical-scripture-study/publication/) contains a separate remote package manifest, an approved bright 256 × 256 icon, five positive and three negative review cases, free-access declaration and initial targeting for all 27 EU member countries. Plugin-specific website, support, privacy and terms pages are deployed on Canonical Theology. The initial directory submission still needs a real demo recording, saved-version connection/case checks, scans and the publisher’s attestations; it has not been submitted or approved. Private/local package bindings remain separate.

### What the study plugin does

| Request | Result |
| --- | --- |
| Bare passage / Standard study | Literary orientation, working translation, relevant footnotes and a concise explanation. |
| Detailed study | Adds consequential terms, literary design, historical/cultural context and bounded canonical connections. |
| Full study | Developed textual review, exegesis, canonical development and theological synthesis; selective external deepening where useful. |
| Word study / Woordstudie | Concise Standard word study: contextual meanings, diagnostic occurrences, an important distinction and synthesis. |
| Full word study / Volledige woordstudie | Inventory of all supported attested senses in consulted evidence, occurrence-level context, participants/relationships, related concepts and separate theological interpretation. The 4–6 initial examples are not a hard coverage limit. |
| Translate / interlinear | Plain working translation, transliteration interlinear, or original-language interlinear with original → transliteration → contextual gloss and readable clause wording. |
| Exegesis, context/history, theme, theology check, variants or DSS research | A focused explanation or evidence assessment rather than an automatically expanded full study. |
| Next / Next chapter / Next: reference | Private Preview advances study parts first, then the passage; Next passage explicitly skips to another passage. Other channels retain passage continuation. |

English is the default; request Dutch or another language explicitly. Ordinary passage studies select and explain the smallest supported enclosing literary unit: `Genesis 1` becomes **Genesis 1:1–2:3**, including the seventh day. `Genesis 1:1–3, exact` retains that range; its Next recommendation is **Genesis 1:4–2:3**. Focused translations retain their requested passage. The curated unit index is incomplete, so other boundaries require source-based discourse review. Explicit multi-chapter and whole-book requests become bounded sequences rather than loading the entire book into one response.

Working translations render YHWH as **Yahweh** and preserve consequential source distinctions. Supported OT–NT quotations or echoes retain recognizable target-language wording where the source grammar permits it. Choose one defensible main translation and footnote meaningful alternatives. Genesis 1:1 prefers “In the beginning God created…” with the temporal alternative in a note. Reuse established source-supported wording links without routine new retrieval; preserve real Hebrew/Greek/NT differences. Source restrictions retain translation rules and literary scope. A shared English phrase alone does not establish a source connection.

Version 0.1.9 introduced a general **study-dialogue policy**: answer questions, understand the claim actually intended, follow cumulative arguments, retain clarifications and correct the specific faulty premise or inference. Only what is directly and clearly stated in context is presented as an explicit textual assertion; doctrine and theology may still be strongly warranted through explained contextual and canonical reasoning. The policy respects the wisdom-forming purpose of Scripture's different genres and distinguishes direct statements, implications, corroboration, compatibility and synthesis. Follow-up questions receive focused answers rather than restarting the complete study template.

Both channels make source checks more deliberate: identify the evidence gap, reuse verified material, retrieve the relevant occurrence with adequate discourse, and stop when it is resolved. Independent primary-source analysis comes first. Standard/Detailed do not browse externally by default; Full permits selective deepening, normally at most two external sources, six complete secondary entries and 8,000 secondary characters. A consequential source gap permits a narrow identified lookup; an explicit research request can justify a separately scoped expansion. These are host instructions, not a server-enforced web firewall or a guarantee of interpretive accuracy.

Example requests after selecting the intended ChatGPT plugin:

```text
Study Genesis 1.
Study Genesis 1:1–3, exact.
Detailed study Romans 12:1–2, in Dutch.
Full word study ruach.
Produce a working translation of Genesis 1:1–3 and John 1:1–3.
Explain how these passages contribute to the argument, and correct any faulty reasoning.
Next.
```

### Runtime and tools

The host model in ChatGPT translates and reasons; the server retrieves evidence and checks structured packets. There is no hosted study-generation model, dictionary-replacement translation algorithm or separate model API key in the Worker. The runtime does not store the user's conversation; the host retains continuation state.

The [Cloudflare package](plugins/canonical-scripture-study/cloudflare/) supplies the native JavaScript Worker, verified Workers Static Assets, Streamable HTTP MCP endpoint and on-demand methodology documents. The Python CLI provides the corresponding local retrieval/planning operations and an optional stdio MCP adapter. Both use the same source profile and study configuration; parity checks compare their results.

| Hosted MCP tool | Purpose |
| --- | --- |
| `study_health` | Running version, source revision, coverage and deployment limits. |
| `study_plan` | Scope, depth, delivery/research policy, focused-task routing and continuation. |
| `fetch_passage` | Bounded native-source text or linguistic records with provenance. |
| `fetch_apparatus` | SBLGNT editorial edition-comparison entries. |
| `fetch_dss` | Paged physical readings, reconstruction status and separately attributed annotations. |
| `lookup_word` | One or two complete curated word studies and compact context pointers. |
| `lookup_lexical` | Selected attributed STEP/Open Scriptures records by ID. |
| `lookup_trajectory` | Bounded canonical seed dossiers with anchor pointers. |
| `evaluate_reading` | Validate a documented evidence-based reading assessment. |
| `check_handoff` | Legacy structured-packet check on regular servers; omitted from private Preview. |
| `get_study_instructions` | Retrieve published stage skills or method/translation references. |

All hosted tools are read-only. The eight [skills](plugins/canonical-scripture-study/skills/) cover study routing, source retrieval, textual comparison, reading evaluation, translation, exegesis, theology review and DSS research. JSON/schema checks establish contract integrity, not linguistic or theological truth.

## Included sources

| Source | Published material | Identity and terms |
| --- | --- | --- |
| [TAHOT](sources/tahot/) | All 39 attribution-restored book files; 305,652 word rows with the full source fields | STEP Bible / Tyndale House Cambridge; CC BY 4.0. An amalgamated study text, with Qere, restored parallels and Greek-based Hebrew reconstruction explicitly marked. |
| [WLC through OSHB](sources/leningrad/original/wlc_4_20_oshb/) | All 39 pinned OSIS XML books, including word IDs, lemmas, morphology, Qere/Ketiv and source notes | WLC 4.20 as distributed by Open Scriptures Hebrew Bible, revision `3d15126fb1ef74867fc1434be1942e837932691f`. WLC text public domain; OSHB annotations CC BY 4.0. |
| [UXLC](sources/leningrad/original/uxlc_2_4/) | All 39 original TXT books, UXLC 2.4, Build 27.5 | Unicode/XML Leningrad Codex; publisher permits copying biblical Hebrew text. Proper edition identity retained. |
| [SBLGNT](sources/sblgnt/) | All 27 clean main-text books and all 27 apparatus books, kept separate; 7,939 main-text verse rows | Edited by Michael W. Holmes; Society of Biblical Literature / Logos Bible Software; CC BY 4.0. The apparatus compares editorial editions. |
| [Brenton Greek LXX](sources/lxx/brenton/) | 52 native book files, original eBible USFM and 28,597 structured verse records | Identified eBible `grcbrent` distribution dated 8 April 2026; public domain. Native references and Greek form identity retained. |
| [DSS TF and enriched exports](sources/dss/2.0.1/) | All 79 supplied TF feature files, marked readings, passage reconstruction summaries, linguistic tables and physical-location indexes | ETCBC/Abegg Text-Fabric release 2.0.1; CC BY-NC 4.0. All 500,995 word nodes and 1,430,241 sign slots remain accounted for in the prepared exports. |
| [Selected lexical data](sources/lexical/) | 606 attributed supporting records: 500 STEP records and 106 Open Scriptures bindings/outlines | CC BY 4.0; selected source data supporting the initial word-study vocabulary. Full upstream lexicons are identified by download URLs and hashes. TBESH definition/gloss prose is excluded. |

Code and skills are MIT-licensed. See [source-specific attribution and terms](ATTRIBUTION.md). The DSS dataset retains its noncommercial condition; the repository does not grant one blanket licence over every source.

## Curated study knowledge

[Word and theme studies](knowledge/word-studies/) contains the first 50 enriched studies, with contextual translation keys, biblical/canonical development, source pointers and review status. These are original model-assisted study explanations, not another text edition or an independent manuscript witness. The collection can grow as further studies are completed; [the update process](knowledge/word-studies/UPDATING.md) retains stable IDs and a checked [lookup index](indexes/word-study-index.json).

## Retrieval layout

Source books are unpacked and directly readable. Original files are preserved byte for byte where indicated in [the preservation record](provenance/exact-source-file-preservation.json). The [file manifest](provenance/repository-file-manifest.json) identifies the exact files in this public snapshot.

- [Book catalogue](indexes/book-catalog.json): source identity, book file, chapter coverage, record counts and hashes.
- [Chapter index](indexes/chapter-index.jsonl): 4,150 native chapter spans with file paths, byte offsets, lengths and checksums. Counts refer to the record type of that source, such as word rows or verse records.
- [Verse-mapping development index](indexes/verse-mapping/README.md): pinned native inventories, chapter mappings, individually reviewed DSS links and explicit unresolved coverage; not a complete map or an active study feature.
- [DSS lookup indexes](indexes/dss/): smaller per-book copies of the physical-record and passage-status indexes. They retain original rows and locators; file paths within those rows are relative to `sources/dss/2.0.1/enriched/`.
- [Lexical entry index](indexes/lexical-entry-index.json): entry IDs and exact byte locations, retaining multiple candidates where needed.
- Structured verse JSONL files for WLC/UXLC and Brenton are split by book. Compact Leningrad records retain reading and word data; duplicate serialized views are omitted because the original XML/TXT remains available.

For a study request, the MVP selects the current portion, retrieves small verified native spans and passes bounded packets to the study pipeline. It can read a local checkout or lazily cache pinned GitHub data. The study host performs translation and interpretation using the skills; automatic reviewed cross-edition alignment remains future work. Repository retrieval does not require loading all these files into one model context or uploading them all as Custom GPT knowledge. Model context budgets still apply.

Larger references become a sequence: Genesis 1–2 gives chapter 1 first and chapter 2 on Next; Genesis 1:1–2:3 remains a single literary portion. Very long chapters use smaller portions. A whole-book request starts a bounded sequence instead of an unrestricted whole-book translation.

## Reading and evidence

Preserve the distinction between the physical manuscript, its modern edition, modern linguistic annotations and an interpretation. WLC and UXLC are related transcriptions of the same Leningrad manuscript, not two independent ancient witnesses. TAHOT's added/restored readings must retain their own status. WLC readable body exports include Ketiv, with Qere separately labelled; UXLC reading asterisks and transcription codes remain explicit.

DSS reconstruction, uncertainty, corrections and missing signs remain visible. Missing dataset coverage does not establish a manuscript omission. Analytical lexeme pointing and automatically derived morphology must not be described as surviving ink or independently reviewed analysis. Nonbiblical and unmapped material remains separately labelled.

Reference systems are native to their source. Hebrew and English chapter/verse numbers can differ; Brenton includes lettered verse labels and book/form differences. Cross-edition maps remain to be reviewed before automatic collation. No full critical apparatus is claimed for these datasets.

No Unicode normalization is applied during this repository preparation. Git text conversion is disabled to preserve source bytes and offsets. Source transcriptions and annotation values have not been silently corrected.

## Sources kept elsewhere or pending

The personal Rahlfs/CCAT export is excluded from this public repository. Swete remains pending corpus ingestion and verification. The 50 word/theme studies are published in the curated knowledge directory. Separate unpublished study drafts and private editorial corrections remain outside this snapshot. The MVP's code, skills and reviewable policies are now public in the plugin directory.

BibleProject and scholarly/contextual resources remain [attributed research links](resources/research-links.json), without mirroring their articles, videos or commentary collections. A link is a research lead, not a claim that every resource has been imported or reviewed.

Upstream repositories remain authoritative for their releases and updates. Report suspected source errors to the original maintainers and preserve their edition/version history. See [the transformation notes](provenance/public-data-transformations.json) and the source-specific notices before reusing the data.

## Local use and verification

The core CLI requires Python 3.10+ and no additional runtime dependencies. From the checkout root:

```bash
python3 plugins/canonical-scripture-study/scripts/bible.py health
python3 plugins/canonical-scripture-study/scripts/bible.py plan 'Genesis 1'
python3 plugins/canonical-scripture-study/scripts/bible.py passage 'Genesis 1:1-3' --sources WLC LXX TAHOT
python3 plugins/canonical-scripture-study/scripts/bible.py word ruach
python3 -m unittest discover -s plugins/canonical-scripture-study/tests -v
```

For the Worker, use Node.js 22+ in its package directory:

```bash
cd plugins/canonical-scripture-study/cloudflare
npm ci
npm test
npm run build
```

`npm test` prepares source assets and runs runtime/protocol checks; `npm run build` prepares assets and performs a Wrangler deployment dry run. The existing Cloudflare Workers Builds configuration watches `main` for Production and the configured `preview` branch for Preview. Check the intended service and authentication bindings before any manual deployment. See the [plugin guide](plugins/canonical-scripture-study/README.md) for the optional Python MCP adapter and [Cloudflare guide](plugins/canonical-scripture-study/cloudflare/README.md) for hosting details.

Release checks currently cover **39 Python tests**, **34 Worker tests** and **1,956 Python/Worker parity cases**: planning/continuation, conversational routing/recovery, active output layouts, source packets and edition identity, all 50 curated studies, selected lexical IDs, source-tampering guards, packet limits and authenticated MCP behavior. A deployment dry run checks packaging; authenticated live calls are checked after release. Dialogue instructions are exercised on source-based question/argument examples. These checks do not certify every generated study, guarantee host-model behavior or establish CPU use under every real-world request.

The source profile pins revision `054a5226027deb13827a04a6e68c56cbd3702f37`, distinct from the software release commit. Metadata and returned source spans are SHA-256 verified. Local checkouts read source bytes directly; standalone Python installations can lazily retrieve/cache pinned material. The Worker serves **13,369 prepared evidence assets**, checking each against its compiled hash. The builder checks configured file-count and individual-file limits; the whole corpus is not loaded into the model context.

## Current boundaries

- The ordinary passage router covers **66 base books**. Extra Greek books/forms and Psalm 151 have native Python access but no dedicated CLI/MCP passage routes.
- Equal verse numbers are not reviewed cross-edition alignment. Native numbering and book/form differences must be checked before comparison.
- The SBLGNT apparatus compares editions; it is not a complete manuscript apparatus. WLC and UXLC are related transcriptions, and DSS reconstructions are not surviving ink.
- Fifty curated studies, selected lexical records and six provisional canonical dossiers are starting evidence, not a complete lexicon, concordance or exhaustive canonical database. The 16,000-character word-packet ceiling retains complete curated entries and defers context pointers where necessary.
- The project has a preferred, correctable biblical/canonical framework. It does not claim neutrality or encode every current website conclusion; denominational systems are not the default interpretive premise.
- Private Rahlfs/CCAT material is excluded, Swete is not ingested, and external links are not a mirrored commentary collection.
- The host model generates study prose. The server does not perform background studies after a reply ends, guarantee successive chat messages or automatically publish new chat drafts.
- Source licences remain separate, especially the DSS noncommercial terms. Worker free-plan CPU and usage constraints require observation during real studies; no automatic paid-plan upgrade is implemented.

See [runtime access](plugins/canonical-scripture-study/references/runtime.md), [method](plugins/canonical-scripture-study/references/method.md), [translation key](plugins/canonical-scripture-study/references/translation-key.md), [source terms](ATTRIBUTION.md) and [review notes](plugins/canonical-scripture-study/REVIEW.md) for detailed contracts and limitations.

Development instructions stay in [AGENTS.md](AGENTS.md), with current [decisions](development/decisions.md), [backlog](development/backlog.md), [release status](development/release-status.md) and [benchmark evidence](development/benchmark-protocol.md). They are not bundled into runtime study instructions.
