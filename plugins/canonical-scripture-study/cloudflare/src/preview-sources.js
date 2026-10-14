import {bounded} from './common.js';

// Labels describe the pinned dataset actually returned, not a generic witness family.
const editions = {
  'wlc-4.20-oshb': 'Westminster Leningrad Codex 4.20 / Open Scriptures Hebrew Bible',
  'uxlc-2.4': 'Unicode/XML Leningrad Codex 2.4',
  'TAHOT': 'Tyndale Amalgamated Hebrew Old Testament (STEP)',
  'LXX-GRCBRENT-20260408': 'Brenton Greek Septuagint (eBible grcbrent)',
  'SBLGNT': 'SBL Greek New Testament',
};
export function labelPreviewSources(result) {
  const source_packets = result.source_packets.map(packet => ({...packet, ...(editions[packet.dataset_id] ? {edition_label: editions[packet.dataset_id]} : {})}));
  const consulted = new Map();
  for (const packet of source_packets) {
    if (!packet.records.length) continue;
    const key = `${packet.source}:${packet.dataset_id}`;
    const item = consulted.get(key) ?? {source: packet.source, dataset_id: packet.dataset_id, ...(packet.edition_label ? {edition_label: packet.edition_label} : {}), records: 0};
    item.records += packet.records.length;
    consulted.set(key, item);
  }
  return bounded({...result, source_packets, consulted_editions: [...consulted.values()]});
}
