# Canonical Scripture Study — 0.1.18

*Study Scripture through its languages, context, and canonical story.*

A public, inspectable Bible study plugin combining biblical theology, canonical theology and contextual working translation. Eight skills guide the host model; a Python runtime supplies pinned, hash-verified passages and bounded knowledge packets. The runtime does not generate translations by replacing dictionary words.

## Start locally

Python 3.10 or later is required. From the repository root, the core CLI works without installing dependencies:

```bash
python3 plugins/canonical-scripture-study/scripts/bible.py health
python3 plugins/canonical-scripture-study/scripts/bible.py plan 'Full study Romans 12:1-2, in Dutch, with original language interlinear'
python3 plugins/canonical-scripture-study/scripts/bible.py passage 'Genesis 1:1-3' --sources WLC LXX TAHOT
python3 plugins/canonical-scripture-study/scripts/bible.py dss 'Genesis 1:27' --limit 1
python3 plugins/canonical-scripture-study/scripts/bible.py word testing
```

For the optional local MCP server:

```bash
cd plugins/canonical-scripture-study
python3 -m venv .venv
# Activate this environment using the command for your operating system.
python3 -m pip install '.[mcp]'
bible-study-mcp
```

Configure an MCP-capable host to start that environment's `bible-study-mcp` executable. Its standard input/output is the protocol; use the CLI for ordinary terminal JSON. The portable [plugin manifest](plugin.json), [MCP configuration](mcp.json), eight `skills/` folders and repository marketplace catalogue support package discovery on compatible surfaces. For a different Python environment, adjust the host's executable path. Installing the Python wheel installs the retrieval runtime; obtain the full repository plugin folder to use the skills and manifest.

The study interface is a ChatGPT conversation in Chat or Work. Once connected and installed, select **@Canonical Scripture Study** and ask for a passage study or a focused command. ChatGPT uses the skills to translate and explain the retrieved evidence.

The code and local runtime are published. A [free Cloudflare hosting package](cloudflare/) now supplies a native Worker, verified static source assets and a Streamable HTTP endpoint. Use its setup guide to deploy and then connect the actual HTTPS `/mcp` URL in ChatGPT. The existing OAuth deployment uses https://study.canonical-theology.com/mcp; Production runs 0.1.10; Preview runs 0.1.18 and the separate public endpoint was last successfully verified at 0.1.11, with distinct endpoints and rate-limit counters. This hosting path needs no model API key; ChatGPT performs the study. Publishing these files does not replace the existing personal plugin or create a public Plugins Directory listing.

The public MCP service uses **https://mcp.canonical-theology.com/mcp**, with **No authentication** and no additional sign-in. Requests are restricted to OpenAI's connector network and rate limited by shared connector IP and service. [mcp.public.json](mcp.public.json) is the remote public-package configuration; the local stdio configuration remains in `mcp.json`. See the [public network-access guide](cloudflare/README.md#public-mcp-without-an-additional-sign-in) for policy refresh, failure behavior and the limits of IP restrictions. A public directory listing still requires the separate verification/submission process.

Public submission is prepared separately in [publication/](publication/README.md), with its own remote manifest, approved bright icon, review cases and EU country targeting. The verified publisher pages are live; a real demo recording and the final portal checks remain required. The public directory listing has not been submitted or approved.

## Deployed version and updating ChatGPT

The manifest, Python adapter and Worker package use the same semantic version (**0.1.18**). Live checks verify Preview **0.1.18** and Production **0.1.10**. Public MCP was last successfully verified at **0.1.11**; its current connector health call returns an internal error while the public build suspension is unchanged. MCP `study_health.plugin_version` reflects the deployed Git commit, not this GitHub file until a successful Cloudflare deployment.

The dialogue policy introduced in 0.1.9 adds a shared study-dialogue policy: answer questions, retain clarified claims, assess cumulative contextual reasoning, distinguish explicit statements from inference, and correct the actual faulty step. Doctrine and theology remain reasoned from Scripture rather than demanded as isolated proof texts.

Version 0.1.10 adds per-user Cloudflare rate limiting (120 authenticated MCP POSTs/minute), bounded streamed requests, minified code, verified-source cache metrics and stored monitoring logs. See the [runtime controls and monitoring guide](cloudflare/README.md#runtime-controls-and-monitoring). Production and private Preview retain the same study policies and private runtime controls.

Changes to tools, shared MCP instructions or bundled on-demand study instructions take effect on the deployed server. Existing ChatGPT connections pointing to the same HTTPS `/mcp` endpoint do **not** need to be recreated. After a deployment, open the existing ChatGPT plugin connection and choose **Refresh** to rescan tool metadata and instructions, then test in a new conversation. The available UI may vary. The displayed plugin name/icon and any separately imported packaged skill files are not automatically replaced by a Worker deployment. Version changes may be visible through the `study_health` tool rather than the ChatGPT plugin card.

The [Preview delivery plan](delivery-preview-plan.md) bounds research to the next undelivered section. At every depth, check only evidence consequential to translation before presenting the complete working translation with numbered footnotes; defer historical surveys, full word studies and canonical/theological research to the section that needs them. Reuse checked evidence and avoid repeating findings. Full retains its depth.

Preview 0.1.13 adds a Preview-only override: Amsterdam server timestamps, one passage-study part per user turn, and a Next control where the host supports MCP UI. Type `Next` to advance the current study part; after the final part it advances the passage. `Next passage` explicitly skips to another passage. `preview_timestamp` and `study_delivery` are registered only when `PREVIEW_DELIVERY=true` on the private Preview deployment. Neither is registered on the public server, even if its environment is misconfigured. Refresh Preview tool metadata before testing. Timestamps measure clock checks and preparation up to a ready call, not the exact moment ChatGPT finishes rendering a response.

Outside that Preview override, the default delivery contract prefers successive visible assistant messages (orientation, verified translation and notes, exegesis, synthesis) within one user request. If ChatGPT cannot generate successive messages, provide the same content as a progressively streamed answer. MCP tools cannot themselves post chat messages or start background model work. `Next` still means the next Bible passage only.

## Commands and continuation

Ordinary studies use the enclosing literary unit and explain the adjustment: `Genesis 1` selects **Genesis 1:1–2:3**, including the seventh day. The curated unit registry is selective; the host reviews other boundaries from source discourse. Ask for `Genesis 1:1–3, exact` to keep a particular focus. Focused translation and source-retrieval commands retain their specified range. English is the default; an explicit language request and saved continuation are honoured.

Working translations preserve source-supported recognizable OT–NT quotation and echo wording. Consequential notes compare traditional and scholarly renderings and explain any consolidated working construction; real source differences stay visible.

Natural language is the interface; these are routing aliases, not registered native slash commands. Bare passages default to Standard and complete the bounded study, with verified translation and notes presented before deeper interpretation when the chat host permits progressive output. Choose Detailed or Full for greater depth; a focused command still performs its own task. Explicit commands perform the requested task.

| Command | Output |
| --- | --- |
| Standard study / bare passage | Working translation, relevant notes, brief context and explanation |
| Detailed study | Adds consequential terms, historical/cultural context, visible literary structure and bounded canonical links |
| Full study | Translation/notes, local language analysis, historical context, narrative/intertextual development, Christ/Spirit integration, theology/formation and supporting reference material |
| Translation only / Translate | Working translation in the chosen format with necessary context and notes |
| Word study / Woordstudie | **Standard** by default: concise meaning range, 2–3 key verse examples, verified source notes, brief synthesis |
| Full word study / Volledige woordstudie | **Full**: all supported attested senses, context and participant/relationship nuances, related concepts, verified lexical evidence, and distinct canonically grounded theological synthesis |
| Theme study | Relevant anchors and biblical/canonical development |
| Context and history | Literary, historical and cultural orientation |
| Exegesis only | Passage explanation without requiring a new full translation |
| Translation variance reconciliation | Actual source differences and an evidence-based assessment |
| Theology check | Fair claim reconstruction and contextual evidence review |
| DSS research | Paged physical records, reconstruction status and linguistic annotations |
| Next / Next chapter 2 / Next: Genesis 2 | Continue with the saved mode, depth, language and display format |

Examples: `Woordstudie ruach` (Standard), `Volledige woordstudie ruach` (Full), `Word study ruach, full` (Full). Explicitly choosing a depth does not change a word study into a passage study. Detailed remains supported as an intermediate depth option.

Full word studies are not limited to six examples: the default diagnostic verse target is only a starting point. The semantic inventory should cover every distinct supported usage and any separate homograph, testing local meaning against literary setting, syntactic roles, who performs/receives an action and their relationship. The study then compares related Hebrew/Greek concepts and separately explains canonical and theological development. Partial lexical coverage must be reported as a limitation, not passed off as an exhaustive concordance. The Standard contract remains compact.

For word-study citations, each important contextual sense should cite a real passage; consequential textual/translation claims identify the consulted edition. External lexicons (including BDB and HALOT) must be verified from their actual entries before being attributed or quoted. The selected STEP/OSHB supporting records and our own authored word studies do **not** stand in for a verified BDB/HALOT entry. When an exact lexicon cannot be consulted, the agent must say so rather than invent quotations, edition sections, page numbers or links. Full word studies include a short source list when external works were actually consulted.

English and Dutch aliases are supported. The host can normalize other languages into the documented commands and pass a language code.

The next-passage suggestion consults curated literary units before defaulting to a modern chapter boundary. After an exact study of Genesis 1:1–3, it recommends Genesis 1:4–2:3; after `Genesis 1, exact`, it recommends Genesis 2:1–3. An ordinary `Genesis 1` study already includes 1:1–2:3 and recommends Genesis 2:4–25. An explicit `Next chapter 2` remains a chapter request, and `Genesis 1–2` preserves its requested chapter portions. Explain scope adjustments before studying them. Where no reliable, bounded unit is indexed, review local discourse and retain a size-safe fallback; the curated index is intentionally incomplete.

Large requests become a sequence: **Genesis 1–2** gives Genesis 1, then Genesis 2 on **Next**. **Genesis 1:1–2:3** remains a single portion, followed by Genesis 2:4–25. A request for the whole of Isaiah starts at Isaiah 1. Psalm 119 uses its 22 eight-verse stanzas; Luke 1 uses 1–25, 26–56 and 57–80. Ten long chapters have curated study boundaries; others use explicitly provisional size boundaries that the host should review against discourse. Do not reject a valid request solely for length or silently discard the remainder.

Save `continuation_state` from a plan response. In the CLI, put this object (not the entire response) in `state.json` and run:

```bash
python3 scripts/bible.py plan Next --state state.json
```

The host retains this state between turns; the read-only server does not store the conversation. Retrieval is bounded, normally around a chapter with a soft ceiling of 45 verses; a selected literary unit may cross chapter breaks and need sequential packets. Dense linguistic or interlinear output may need smaller portions. Explain literary boundaries and respect exact scope. For dependent openings such as Romans 12’s “therefore,” retrieve enough prior discourse to explain the argument before translation.

## Translation and study method

The [Full-study coverage](../../development/full-study-reference-design.md) implemented and privately deployed in 0.1.18 draws on the original Theology 1.4.2 and the Theology/Christology/Pneumatology source/site structure. Develop consequential words, grammar, names and images locally. Explain narrative/covenantal development, actual intertextual relationships and warranted Christ/Spirit integration. Finish the existing final part with key terms/forms/contextual senses, explained key passages, relevant thematic tables, necessary abbreviations and sources actually consulted. Reuse checked evidence and the established working rendering; explain any warranted revision. Do not retrieve again merely to populate tables, invent lexicon access or copy the original bibliography. Standard/Detailed and focused tasks remain proportionate; systematic manuscript comparison stays inactive.

Use plain working translation, transliteration interlinear, or original-language interlinear. The last displays **original → transliteration → contextual gloss**, followed by a readable clause translation where helpful. Translate into English, Dutch or another requested language and label substantial output as a working translation.

Render YHWH as Yahweh. Preserve distinctions between Sheol, Hades, Gehenna, Tartarus and abyss; explain their contextual use. Do not force one gloss onto nephesh, psychē, aiōnios or other contested terms. Matthew 6:13 and James 1 use a related Greek testing/tempting family; agency, desire and context matter. A perceived translated contradiction must be checked against the actual forms and argument.

The preferred method serves Mark Gatzen's Christian formation project. It is an explicit working biblical/canonical theology, open to correction from Scripture and evidence. Denominational systems are not the default curriculum or premise. The complete current website claim profile has not been imported, so the MVP cannot claim to encode every project conclusion.

## Evidence and architecture

The skills form a modular pipeline: fetch and check alignment, collate, evaluate, translate/annotate, synthesize, review. Ordinary study output does not require structural handoffs. The legacy [JSON envelope schema](schemas/handoff.schema.json) supports actual structured integrations; private Preview removes check_handoff. Source integrity, coverage and linguistic review still apply.

Reading evaluation preserves a named base unless a documented assessment supports another attested reading. Christological usefulness, difficulty, brevity and numerical agreement never automatically elect a reading. The 17-entry textual-case registry flags special review; it does not automatically make the longest reading earliest. Bracket disputed study inclusions only from exact, identified source text. See [the method](references/method.md) and [translation key](references/translation-key.md).

Retrieval uses commit `054a5226027deb13827a04a6e68c56cbd3702f37`. A full checkout reads local spans; a standalone installed runtime lazily retrieves pinned GitHub metadata and byte spans and caches them. Set `BIBLE_STUDY_DATA` to a checkout or `BIBLE_STUDY_CACHE` to a cache directory. `BIBLE_STUDY_OFFLINE=1` requires already cached data. Metadata and returned spans are SHA-256 verified. No text normalization or source corrections are applied. [Runtime details](references/runtime.md) describe tools, provenance and limits.

Included readers cover WLC/OSHB, UXLC, all TAHOT fields, Brenton Greek, SBLGNT and its edition-comparison apparatus, and enriched DSS exports. The ordinary reference router covers 66 base books; additional Greek books and Psalm 151 need separate native-edition access (`Reader.native_chapter` in Python), and do not yet have dedicated CLI/MCP routing. Native numbering remains explicit: **book routes and equal verse numbers do not constitute reviewed cross-edition equivalence**. WLC/UXLC are related transcriptions, not independent witnesses. Greek surface tokenization provides stable derived IDs and exact character offsets, not an invented lemma/morphology layer.

The 50 complete word studies are retrieved one or two at a time with up to six compact context pointers; related entries are not automatically loaded. Selected lexical data is not a complete lexicon or concordance. Six provisional canonical seed dossiers supply up to six anchor pointers; the host retrieves relevant local contexts. Independent Hebrew/Greek and biblical-context analysis comes first. Standard and Detailed do not browse by default; Full uses BibleProject/academic leads selectively afterwards for a specific deepening question. These are research leads, not a mirrored commentary collection. New completed studies can grow the public collection through its existing review/update process; chat drafts are not automatically published.

## Limits and next work

Rahlfs stays outside the public profile. Swete is not ingested. The apparatus is not a full critical manuscript apparatus. Exact macro-variant witness spans, Greek/Hebrew verse maps, wider canonical dossiers, occurrence-level translation keys, further scholarly argument curation and the complete current working-theology profile still require review. DSS reconstruction does not equal surviving ink; missing coverage does not prove omission.

Code/skills are MIT licensed. Dataset licences remain separate, including **CC BY-NC 4.0 for DSS**. See the repository's attribution and source terms.

Run core checks with `python3 -m unittest discover -s tests -v`; run `python3 tests/mcp_smoke.py` after installing the MCP extra. [REVIEW.md](REVIEW.md) records what the MVP does and what it does not establish.

## Preview delivery and diagnostics — 0.1.18

Preview supplies the complete active skills and translation key in the planner's
`instruction_bundle`, without requiring a separate call for every instruction.
Default instruction reads return a short router; request `detail: full` only for a
specific missing document. Other channels retain their original instruction access.

The Preview router recognizes ordinary English/Dutch phrasing around documented commands, including `Give me the full study of genesis 1`. It retains the enclosing-unit policy and explicit options. Errors and incomplete input return a `recovery` instruction requiring repair or clarification and another successful `study_plan` before retrieval. `get_study_instructions` cannot replace that plan. Unknown books remain errors; the router does not guess a different passage.

Planning and Ready return an `output_contract` for the active part, refreshed with the real Ready timestamp before output. It specifies a first-line clock, H2 heading, brief scope preface, actual edition attribution, numbered paragraph footnotes (usually two to four sentences), observed diagnostics and exact Next label. Extended word studies, anthropology and doctrinal discussions belong in the appropriate later part. Preview source packets include `edition_label` and aggregate `consulted_editions`; the Greek LXX dataset is Brenton/eBible grcbrent. Missing coverage is not reported as a consulted edition. These are host instructions; the server does not certify the generated prose.

Debug reporting is on in private Preview only. It describes observed operations,
source/record counts, server timings, cache metrics and actual failures, not hidden
internal reasoning. `Debug off` and `Debug on` change visible reporting in the current
conversation; they do not toggle a server-wide setting or store a user preference.
Successful and domain-error Preview results include a real `preview_clock`; debug results
include compact `preview_debug` metrics. Arguments and conversation content are not
added to hosting logs.

For a connection with older tool metadata, the existing `study_plan` supports `Clock`
and `Ready`, `Next`, `Resume`, `Next passage` using `study_state: {preview_delivery: delivery_state}`.
It also declares the continuation UI, so rendering no longer depends only on the new
study_delivery tool. Refresh metadata to expose that UI and the typed evaluation
schema. Retaining an attested base with an alternative footnote does not require a
formal evaluation call; primary-reading changes or textual assessment still use the
strict evidence contract.

Footnote markers must appear beside affected verse wording, with concise matching
notes. Copy the returned part sequence exactly. A closing timestamp must come from a
fresh post-output clock call when the host supports it. Otherwise a footer explicitly
says Last server check and does not pretend to measure rendering completion.

Preview planning is metadata-only and returns a valid `retrieval_plan`; inspect dependent openings in the retrieved passage. Restrict editions with `sources`, or comma options such as `WLC only` or `sources WLC+LXX` when cached metadata lacks the new argument. The state retains restrictions through Next, Resume and Next passage. Translation rules, English default and scope remain active. Choose one main rendering and reuse established wording links.

Preview has 12 tools: the regular eleven minus check_handoff, plus two delivery/clock tools. Typed edition/detail schemas improve call discovery. Metrics are request-local and include operation IDs, real request/return clocks, actual source/record counts and failures. Ready means awaiting host output, and the server explicitly reports that output completion was not observed. Reuse the freshly returned clock instead of adding a duplicate Clock call.

Preview 0.1.18 passed 47 Python tests, 35 Worker tests, 1,956 parity cases, deterministic mapping rebuild and private/public packaging dry runs. The private build succeeded and live checks verified progress clocks, Full reference contracts, both final-part instruction bundles, Ready layout and retained Next preferences. See [release status](../../development/release-status.md) for release evidence, and [benchmarks](../../development/benchmark-protocol.md) for exploratory observations and local replay. One complete [Genesis Work study](../../development/host-observation-genesis1-2026-10-14.md) is now observed, including remaining presentation gaps. Actual next-passage execution, Chat and controlled host timing remain unverified; any later release still needs a fresh visible-output check.

### 0.1.18 presentation and Full reference correction

The complete 0.1.17 Work study delivered four parts on Genesis 1:1–2:3 in reported durations of 46s, 55s, 2m2s and 1m31s (5m14s total, excluding waits; exploratory only). It established useful translation and canonical coverage, but included internal-rule narration, a publisher assessment and missing progress clocks. Version 0.1.18 applies study guidance silently, integrates useful secondary research into an independent Scripture-grounded explanation and retains appropriate citations, attribution and warranted limits. Direct publisher assessment remains available when explicitly requested.

Planning now provides a concrete timestamp-first progress layout, and every returned clock reminds the host to use it for orientation and progress as well as substantive output. Reuse the newest tool clock without redundant calls. Full studies keep the same four parts and retained state; the final part bundles exegesis and theology guidance and adds the reference appendix described above. Source restrictions, translation-first retrieval and focused-task scope remain intact.

Validation passed: 47 Python tests, 35 Worker tests, 1,956 parity cases, deterministic mapping rebuild and private/public packaging dry runs. A fresh-context model composition using supplied source packets included the reference layer without rule/publisher narration; this is a limited example, not a real host UI check or speed benchmark. Private Preview deployment and live contract checks passed. A fresh complete host study remains pending. Production/public promotion requires separate authorization.

### Planned later: manuscript and translation differences

A separate section for translation variance across manuscripts depends on a full verse-mapping index for the supported source corpus. Keep the initial primary-source working translation and notes first. The later section will compare aligned readings, explain meaningful translation consequences and label source identity, uncertainty and coverage limits. Its proposed place is after translation and before local explanation. The comparison feature remains inactive and the four-part sequence is unchanged. The [development index](../../indexes/verse-mapping/README.md) now contains the complete pinned native inventory (106,223 verse references across five editions) and registers all 66,557 DSS physical records, including unassigned/nonbiblical material. The first [Genesis batch](../../development/verse-mapping-progress.md) now has 3,602 correspondences, including complete Hebrew-edition extent coverage and Greek chapters 1–20 and 35. Ten opening DSS records are separately classified as partial physical support, reconstruction-only references or provisional placement. Unique full-verse consonantal verification and individual model review are reported separately; no complete cross-source map or human review is claimed. See the [backlog](../../development/backlog.md).
