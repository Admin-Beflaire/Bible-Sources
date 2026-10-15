import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Engine} from '../src/engine.js';
import {SourceStore,clearCache,bundle} from '../src/store.js';
import {genesisPassage,genesisDss} from '../src/preview-genesis.js';
const here=dirname(fileURLToPath(import.meta.url));
const make=()=>new Engine(new SourceStore({fetch:async req=>new Response(readFileSync(resolve(here,'../generated/assets',new URL(req.url).pathname.slice(1))))}));
test('Genesis Preview resolves TAHOT renumbering while legacy reader stays native and source restrictions hold',async()=>{
 const engine=make(),mapped=await genesisPassage(engine.reader,'Genesis 32:1',['TAHOT']);
 assert.equal(mapped.source_packets.length,1);assert.equal(mapped.source_packets[0].chapter,31);
 assert.ok(mapped.source_packets[0].records.every(r=>r.verse===55));
 assert.match(mapped.source_packets[0].records.map(r=>r.form).join(' ').normalize('NFD').replace(/\p{M}/gu,''),/לבן/);
 const native=await make().reader.passage('Genesis 32:1',['TAHOT']);assert.equal(native.source_packets[0].chapter,32);assert.ok(native.source_packets[0].records.every(r=>r.verse===1));
});
test('Greek grouped extents and relocated tower retain requested translation scope and native labels',async()=>{
 const group=await genesisPassage(make().reader,'Genesis 1:6',['LXX']);
 assert.deepEqual(group.source_packets.flatMap(p=>p.records.map(r=>r.native_verse_label)),['6','7']);assert.equal(group.translation_scope,'Genesis 1:6');assert.ok(group.verse_mapping.relations.every(r=>!r.note));
 assert.deepEqual(group.verse_mapping.relations[0].left.map(r=>r[3]),['6','7']);
 const moved=await genesisPassage(make().reader,'Genesis 35:21',['LXX']);assert.deepEqual(moved.source_packets.flatMap(p=>p.records.map(r=>r.native_verse_label)),['16']);assert.match(moved.source_packets[0].records[0].text,/πύργ/);
});
test('Genesis WLC-only and other books retain existing retrieval without mapping asset reads',async()=>{
 const e=make(),one=await genesisPassage(e.reader,'Genesis 1:1',['WLC']);assert.equal(e.store.metrics.asset_fetches<=1,true);assert.ok(!one.verse_mapping);
 const raw=await make().reader.passage('Exodus 1:1',['WLC']);const outside=await genesisPassage(make().reader,'Exodus 1:1',['WLC']);assert.deepEqual(outside,raw);
});
test('Genesis 1 complete unit fits existing packet budget and does not fetch DSS',async()=>{
 const result=await genesisPassage(make().reader,'Genesis 1:1-2:3',['WLC','LXX']);assert.equal(result.source_packets.filter(p=>p.source==='WLC').reduce((n,p)=>n+p.records.length,0),34);assert.ok(!result.records);assert.ok(JSON.stringify(result).length<60000);assert.deepEqual(result.source_packets.find(p=>p.source==='LXX'&&p.chapter===1).records.map(r=>r.verse),Array.from({length:31},(_,i)=>i+1));
});
test('Genesis DSS lookup preserves all opening dispositions, hashes, paging and uncertainty',async()=>{
 let cursor=0,records=[];
 do{const page=await genesisDss(make().reader,'Genesis 1:1-2',cursor,3,false);records.push(...page.records);cursor=page.next_cursor;assert.equal(page.complete_verse_equivalence,false);}while(cursor!==null);
 assert.equal(new Set(records.map(r=>r.metadata.scroll+'/'+r.metadata.record_id)).size,records.length);
 assert.ok(records.some(r=>r.verse_mapping.disposition==='reconstruction_only_reference'));
 assert.ok(records.some(r=>r.verse_mapping.disposition==='provisional_reference'));
 for(const r of records){assert.equal(r.evidence.sha256,r.verse_mapping.record_evidence.sha256);assert.ok(!r.linguistics);if(r.verse_mapping.disposition!=='partial_physical_extent_reviewed')assert.equal(r.verse_mapping.physical_letter_support,false);}
});
test('Final reviewed DSS identity is reachable and corrupt mapping assets fail closed',async()=>{
 const last=await genesisDss(make().reader,'Genesis 48:11',0,3,false);assert.ok(last.records.some(r=>r.metadata.record_id==='L1593199-R002'));
 clearCache();const store=new SourceStore({fetch:async req=>{const path=new URL(req.url).pathname.slice(1);const bytes=readFileSync(resolve(here,'../generated/assets',path));return new Response(path.startsWith('mapping/')?Buffer.concat([bytes,Buffer.from('x')]):bytes);}});
 await assert.rejects(()=>genesisPassage(new Engine(store).reader,'Genesis 32:1',['TAHOT']),e=>e.code==='source_hash');clearCache();
});
