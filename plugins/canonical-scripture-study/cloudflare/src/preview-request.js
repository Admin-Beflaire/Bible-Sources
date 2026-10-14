import {ALIASES} from './engine.js';
import {charCount, StudyError} from './common.js';

const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const commands = [
  ...Object.values(ALIASES).flat().map(alias => [alias, alias]),
  ['full scripture study', 'full study'], ['full bible study', 'full study'],
  ['detailed scripture study', 'detailed study'], ['detailed bible study', 'detailed study'],
  ['standard scripture study', 'standard study'], ['standard bible study', 'standard study'],
  ['scripture study', 'study plan'], ['bible study', 'study plan'], ['study', 'study plan'],
  ['studie', 'studieplan'], ['translation', 'translation only'], ['vertaling', 'vertaling alleen'],
].sort(([a], [b]) => b.length - a.length).map(([alias, command]) => [new RegExp('^' + escape(alias) + '(?:\\s*:\\s*|\\s+|$)', 'i'), command]);
const introducers = [
  /^(?:please\s*[:,]?\s+|alstublieft\s+|alsjeblieft\s+)/i,
  /^(?:(?:can|could|would|will)\s+you\s+|(?:kun|kunt|zou)\s+je\s+)/i,
  /^(?:(?:give|show)\s+me\s+|(?:geef|toon)\s+(?:me|mij)\s+)/i,
];

// Recognize request phrasing around documented commands; never guess a book or scope.
// Kept out of Engine so regular Worker/Python parsing remains unchanged.
export function normalizePreviewRequest(query) {
  if (typeof query !== 'string' || !query.trim() || charCount(query) > 2000) throw new StudyError('query', 'Supply a study command or Bible reference under 2,000 characters.');
  let text = query.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
  for (let i = 0; i < 6; i++) {
    const before = text;
    for (const prefix of introducers) text = text.replace(prefix, '');
    if (text === before) break;
  }
  const candidate = text.replace(/^(?:a|an|the|een|de|het)\s+/i, '');
  for (const [pattern, command] of commands) {
    const match = pattern.exec(candidate);
    if (!match) continue;
    const target = candidate.slice(match[0].length).replace(/^(?:of|on|van|over)\s+/i, '').trim();
    return `${command}${target ? ' ' + target : ''}`;
  }
  return text;
}

export function planningRecovery(code) {
  const instruction = ['delivery_state', 'continuation_state'].includes(code)
    ? 'Recover the exact recent returned continuation state and retry study_plan Resume. If unavailable, ask which passage and part to resume; do not invent state.'
    : code === 'sources'
      ? 'Keep the requested source restriction. Correct a conflicting or invalid source argument, or report unavailable coverage and ask how to proceed; never silently substitute another edition.'
      : 'Correct the reported command, reference or option using the confirmed user request, then retry study_plan. Ask for missing or ambiguous input; never guess another passage.';
  return {planning_status: 'failed', can_retrieve: false, recovery: {retry_tool: 'study_plan', instruction, success_required_before: 'Scripture retrieval and substantive study output. A routing document or direct fetch is not a successful study plan.'}};
}
