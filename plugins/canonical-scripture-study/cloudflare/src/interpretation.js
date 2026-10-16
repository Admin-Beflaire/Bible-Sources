// Research/presentation contracts for the host; this module does not infer readings.
// No passage names, expected interpretations, model calls or external network I/O.
import {config} from './common.js';

export const INTERPRETATION_CORE = 'TEXT-FIRST INTERPRETATION: Independently discover serious readings from language, literary argument and relevant historical evidence. Present each reading’s strongest defensible case, substantial objections and unresolved gaps. Distinguish direct statements, contextual inference, historical reconstruction, speculation and canonical synthesis. Assess cumulative evidence without demanding each observation prove the whole case. Do not assign percentages, likelihood labels, rankings or a preferred interpretive winner; do not pad thin cases for symmetry. State explicit textual claims clearly. A working translation still selects one defensible rendering with meaningful alternatives in notes. Do not impose an owner framework or import later doctrinal systems as passage alternatives. The reader weighs the evidence and exercises spiritual discernment.';

const stageGuidance = {
  translation_notes: 'Check ambiguity only when it materially affects rendering or a footnote: syntax, polysemy, idiom/euphemism, metaphor, wording links or variants. Choose one defensible main rendering, note meaningful alternatives, and defer the interpretive case study. Preserve every existing translation and scope rule.',
  local_explanation: 'Reconstruct the connected argument or narrative before evaluating readings. Independently notice ambiguous constructions, unusual expressions, omissions, unexplained consequences, referents and repeated details. Form text-grounded candidate explanations, then actively check for serious alternatives absent from the initial account; do not wait for the reader to name them. For a disputed reading use a neutral passage/expression search followed by a targeted search for its strongest case and substantial challenge, where permitted. An initial familiar reading or one commentary is not a completed discovery check. Test idiomatic and literal senses in the actual construction and speaker/participants; compare relevant biblical wording with its context, not identical words alone. Necessary cultural evidence may be checked here when it distinguishes readings; defer only the wider historical development. Present the best evidence and objections for every serious case, with no forced winner.',
  historical_context: 'Develop only historical questions left by the local cases; reuse their wording and evidence rather than rediscovering them. Check relevant kinship, inheritance, household/sexual relations, power, honor/shame, law, vows, religion, politics or economics as the passage requires. Distinguish the narrated period from composition, transmission and early readership. Identify a parallel’s date, place, source and whether it is directly attested, analogous or speculative; justify any transfer across societies/centuries. Explain how each warranted parallel supports or challenges a reading without converting a custom into an unreported event.',
  canonical_synthesis: 'Carry forward each serious reading and unresolved difficulty from exegesis. Explain development within the book and canon, distinguishing quotation, echo, thematic connection and theological synthesis. Mark conclusions that depend on a disputed premise; do not silently settle that premise or collapse real differences. Reconstruct the biblical argument before applying theology. Do not automatically turn a passage into a contest between later doctrinal systems; evaluate a system fairly when explicitly requested, as a distinct task. Leave the reader to weigh the evidence without selecting an interpretive winner.',
};

export function interpretationOutput(part, depth) {
  if (part === 'translation_notes') return {scope:'Consequential rendering alternatives in numbered footnotes; one main working translation. Defer developed interpretive cases.'};
  return {
    coverage:depth === 'full' ? 'Develop the competing cases substantially using inspected evidence.' : 'Cover meaningful alternatives and their decisive evidence proportionately; do not omit a serious case merely to keep the study short.',
    case_fields:['reading and textual anchor','strongest supporting case, including relevant language','substantial objections','evidence type and unresolved gaps'],
    presentation:'Use descriptive headings, not ranked labels. No percentages, likelihood labels, rankings or preferred winner. Unequal evidence needs no artificial balance. State direct textual claims clearly; distinguish them from inference and reconstruction.',
  };
}

export function interpretationWorkflow(part, depth, sourcePolicy) {
  const policy = config('method').interpretation_policy;
  const restricted = sourcePolicy.restricted === true;
  const translation = part === 'translation_notes';
  return {
    policy_version:policy.version,
    active_part:part,
    task:stageGuidance[part] ?? 'Answer the focused question from contextual evidence; discover and test serious alternatives where it requires interpretation.',
    ...(translation ? {} : {
      ...(['local_explanation','focused'].includes(part) ? {discovery:policy.discovery} : {}),
      evidence:policy.evidence,
      continuity:'Retain concise findings, source credit and unresolved questions in the conversation. Next state controls the part, not the evidence: reuse earlier findings without refetching them. If earlier evidence is missing, report the gap and retrieve only what this part requires. Do not create a new handoff/validation step.',
    }),
    research:{
      primary_first:true,
      routes:translation ? 'Use the active retrieval_plan and only consequential permitted checks.' : 'Reuse primary text and indexes first. For a consequential syntax question retrieve only the affected verses with fetch_passage detail linguistic. Use actual token/entry IDs for lookup_lexical; curated lookup_word records are leads, not independent lexica. Retrieve relevant biblical parallels with their contexts, respecting source restrictions. Do not fetch every witness or a whole chapter of linguistic data for one phrase.',
      external:restricted ? 'Excluded by the retained source selection. Report the evidence gap; do not bypass it with remembered scholarly claims.' : 'External search/retrieval belongs to available host tools; this MCP server has no academic search engine or model. Inspect primary historical texts or identifiable academic arguments when needed. Search snippets and uninspected bibliographies are leads, not consulted evidence. If host research is unavailable, identify the limitation rather than invent support.',
      expansion_trigger:translation ? 'Only an unresolved consequential rendering or footnote; no historical survey or later-part research.' : 'A concrete ambiguity, serious disputed reading or missing historical premise can justify bounded research at any depth, after primary analysis. A Full study alone does not require browsing.',
      ...(translation ? {} : {conditional_ceiling:{secondary_sources:restricted ? 0 : policy.secondary_source_ceiling[depth],secondary_entries:restricted ? 0 : 12,excerpt_characters:restricted ? 0 : 16000,kind:'Host research guidance, not a server-enforced quota or a target. Overrides default secondary budgets only for the identified question; never overrides source restrictions.'}}),
      stop:'Stop when the serious cases, material objections and remaining gaps are adequately represented. Do not collect agreement or repeat wording refinement. If the bounded research leaves a gap, preserve it explicitly.',
    },
  };
}
