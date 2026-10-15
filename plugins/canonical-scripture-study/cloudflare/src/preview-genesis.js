// Shared consumer of the verified Genesis correspondence index.
import {bounded, StudyError} from './common.js';
import {bundle, decode, encode, verify} from './store.js';
const ANCHOR = 'wlc-4.20-oshb';
const label = row => String(row.native_verse_label ?? row.verse);
export const GENESIS_MAPPING_GUIDANCE = 'GENESIS INDEX: fetch_passage uses reviewed Genesis edition extents, including renumbered, grouped and reordered units. Preserve native labels and meaningful wording differences. Grouped target context does not expand the requested translation scope or prove identical individual verse boundaries. Genesis fetch_dss uses reviewed physical identities: partial physical correspondence, reconstruction-only reference and provisional reference remain distinct; model review is not human or image review. Other books retain native-label candidate retrieval. Do not automatically add editions or DSS when sources are restricted, or research later study parts.';
export function genesisMappingHealth() {return {book:'Gen',edition_extent_coverage_complete:true,DSS_inventory_reviews:842,DSS_dispositions:{partial_physical_extent_reviewed:365,reconstruction_only_reference:234,provisional_reference:243},confident_DSS_alignment_complete:false,source_commit:bundle.genesis_mapping.source_commit,index_manifest_sha256:bundle.genesis_mapping.manifest_sha256,consumer:'released_channels',systematic_comparison_section_enabled:false};}
async function chapter(reader, c) {
  const map = JSON.parse(decode(await reader.store.asset(`mapping/Gen/${c}.json`)));
  if (map.source_commit !== reader.store.profile.commit) throw new StudyError('mapping_source','Genesis map does not match the pinned source.');
  return map;
}
const identity = ref => JSON.stringify(ref);
function compact(rel, includeNote) {return {id:rel.id,left:rel.left,right:rel.right,order_relation:rel.order_relation,scope:rel.scope,witness_relationship:rel.witness_relationship,review_status:rel.review.status,...(includeNote?{note:rel.note}:{})};}
export async function genesisPassage(reader, reference, sources = null, detail = 'text') {
  const portions=reader.refs.portions(reference),p=reader.refs.parse(portions[0].reference);
  if(p.book!=='Gen') return reader.passage(reference,sources,detail);
  if(!['text','linguistic'].includes(detail)) throw new StudyError('detail','Detail must be text or linguistic.');
  sources ??= ['WLC','LXX'];
  if(!Array.isArray(sources)||!sources.length||sources.length>4||sources.some(s=>!['WLC','UXLC','TAHOT','LXX','SBLGNT'].includes(s))) throw new StudyError('sources','Select one to four named public editions.');
  // An anchor-only request needs no comparison asset or unrequested edition.
  if(sources.every(s=>s==='WLC')) return reader.passage(reference,sources,detail);
  const maps=[];
  for(let c=p.start_chapter;c<=p.end_chapter;c++) maps.push(await chapter(reader,c));
  const routes=reader.refs.books.Gen.routes,packets=[],relations=new Map(),chapters=new Map();
  for(const source of new Set(sources)) {
    const route=routes[source];
    if(!route){packets.push({source,records:[],coverage_status:'edition_not_available_for_this_book'});continue;}
    const [dataset,book]=route;
    const selected=new Map();
    for(const map of maps) for(const rel of map.relations) {
      const anchors=rel.left.filter(ref=>ref[0]===ANCHOR&&p.contains(ref[2],Number(ref[3])));
      if(!anchors.length) continue;
      if(source==='WLC') for(const ref of anchors) selected.set(identity(ref),{ref,evidence:rel.left_evidence.find(e=>identity(e.native_reference)===identity(ref))});
      else if(rel.right[0][0]===dataset&&rel.right[0][1]===book){relations.set(rel.id,rel);for(const ref of rel.right) selected.set(identity(ref),{ref,evidence:rel.right_evidence.find(e=>identity(e.native_reference)===identity(ref))});}
    }
    const groups=new Map();
    for(const {ref,evidence} of selected.values()) {
      const key=JSON.stringify(ref.slice(0,3));
      if(!chapters.has(key)) chapters.set(key,await reader.nativeChapter(...ref.slice(0,3),detail));
      const packet=chapters.get(key),records=packet.records.filter(r=>label(r)===ref[3]);
      if(!records.length) throw new StudyError('mapping_extent','Mapped native extent is unavailable.');
      await verify(encode(records.map(r=>r.text??r.form??'').join('\n')),evidence.reading_text_sha256);
      if(!groups.has(key)) groups.set(key,{...packet,source,records:[]});
      groups.get(key).records.push(...records);
    }
    // Return native record order, independent of review authoring/ID order.
    for(const [key,group] of groups){const ids=new Set(group.records.map(r=>r.id));group.records=chapters.get(key).records.filter(r=>ids.has(r.id));packets.push(group);}
  }
  return bounded({requested_reference:reference,current_portion:reader.refs.label(p),translation_scope:reader.refs.label(p),pending_references:portions.slice(1).map(x=>x.reference),boundary_status:portions[0].boundary_status,source_packets:packets,alignment_status:'reviewed_Genesis_extents_not_identical_wording',verse_mapping:{...genesisMappingHealth(),relations:[...relations.values()].map(rel=>compact(rel,sources.includes('WLC')))},warnings:['Mapped grouped/reordered target extents may contain context outside the requested anchor verse; keep the requested translation scope.','WLC/UXLC are related transcriptions of the same manuscript. TAHOT flags and native Greek labels remain explicit.','Extent correspondence does not elect a preferred reading or enable an additional comparison-delivery stage.']});
}
export async function genesisDss(reader,reference,cursor=0,limit=1,includeLinguistics=true) {
  const portions=reader.refs.portions(reference),p=reader.refs.parse(portions[0].reference);
  if(p.book!=='Gen') return reader.dss(reference,cursor,limit,includeLinguistics);
  if(!Number.isSafeInteger(cursor)||cursor<0||!Number.isSafeInteger(limit)||limit<1||limit>3||typeof includeLinguistics!=='boolean') throw new StudyError('dss_page','Use a nonnegative cursor, one to three records and a boolean linguistic option.');
  const selected=new Map();
  for(let c=p.start_chapter;c<=p.end_chapter;c++) for(const link of (await chapter(reader,c)).dss_records) if(link.anchor_references.some(ref=>ref[0]===ANCHOR&&p.contains(ref[2],Number(ref[3])))) selected.set(`${link.physical_reference.scroll}/${link.physical_reference.record_id}`,link);
  const links=[...selected.values()].sort((a,b)=>`${a.physical_reference.scroll}/${a.physical_reference.record_id}`.localeCompare(`${b.physical_reference.scroll}/${b.physical_reference.record_id}`));
  if(cursor>links.length) throw new StudyError('dss_page','Cursor exceeds available physical records.');
  const records=[],statuses=new Map(),packs=new Map();
  for(const link of links.slice(cursor,cursor+limit)) {
    const a=link.source_annotation,key=`${a.chapter}/${a.verse}`;
    if(!packs.has(key)) packs.set(key,await reader.store.dssVerse('Gen',Number(a.chapter),Number(a.verse)));
    const pack=packs.get(key),physical=link.physical_reference;
    const found=pack.records.find(item=>item.metadata.scroll===physical.scroll&&item.metadata.record_id===physical.record_id);
    if(!found||found.evidence.sha256!==link.record_evidence.sha256) throw new StudyError('mapping_record','Reviewed DSS identity/evidence does not match its physical source record.');
    const item=structuredClone(found);if(!includeLinguistics) delete item.linguistics;
    item.verse_mapping=link;records.push(item);
    for(const status of pack.passage_status) if((status.item.metadata.record_ids.match(/L\d+-R\d+/g)??[]).includes(physical.record_id)) statuses.set(`${physical.scroll}/${status.order}`,status.item);
  }
  return bounded({reference:reader.refs.label(p),pending_references:portions.slice(1).map(x=>x.reference),total_records:links.length,cursor,next_cursor:cursor+records.length<links.length?cursor+records.length:null,records,passage_status:[...statuses.values()],coverage_status:links.length?'reviewed_physical_or_editorial_links':'no_reviewed_physical_link_not_evidence_of_omission',verse_mapping:genesisMappingHealth(),complete_verse_equivalence:false,status_scope:'whole_indexed_scroll_passage_for_returned_physical_records; counts_may_extend_beyond_the_current_page',licence:'CC BY-NC 4.0',attribution:'Abegg, Bowley and Cook; TF conversion by Jacobs, Naaijer and Roorda; ETCBC/dss 2.0.1',warnings:['Reconstruction-only and provisional references do not establish physical wording support.','Partial physical correspondences are not complete verse attestation; preserve uncertain, corrected and reconstructed signs.','Model transcription review is not human review or manuscript-image inspection.','Native annotations are preserved separately from reviewed WLC anchors.']});
}
