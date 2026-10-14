import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Engine} from '../src/engine.js';
import {SourceStore} from '../src/store.js';
import {labelPreviewSources} from '../src/preview-sources.js';
const here = dirname(fileURLToPath(import.meta.url));
const make = () => new Engine(new SourceStore({fetch:async req=>new Response(readFileSync(resolve(here,'../generated/assets',new URL(req.url).pathname.slice(1))))}));

test('Preview labels actual pinned editions and aggregates records across chapter boundaries without altering evidence', async () => {
  const raw = await make().reader.passage('Genesis 1:1-2:3',['WLC','LXX']);
  const before = JSON.stringify(raw);
  const labelled = labelPreviewSources(raw);
  assert.equal(JSON.stringify(raw),before);
  assert.deepEqual(labelled.consulted_editions.map(p=>[p.source,p.dataset_id,p.records]),[['WLC','wlc-4.20-oshb',34],['LXX','LXX-GRCBRENT-20260408',34]]);
  assert.match(labelled.consulted_editions[1].edition_label,/Brenton Greek Septuagint/);
  labelled.source_packets.forEach((packet,i)=>{
    assert.deepEqual(packet.records,raw.source_packets[i].records);
    assert.deepEqual(packet.evidence,raw.source_packets[i].evidence);
  });
  assert.equal(labelled.alignment_status,raw.alignment_status);
});
test('Missing coverage is not reported as a consulted edition and unknown datasets receive no invented identity', async () => {
  const unavailable = labelPreviewSources(await make().reader.passage('Genesis 1:1',['SBLGNT']));
  assert.deepEqual(unavailable.consulted_editions,[]);
  assert.ok(!unavailable.source_packets[0].edition_label);
  const unknown = labelPreviewSources({source_packets:[{source:'LXX',dataset_id:'future-unreviewed-edition',records:[{text:'source text'}]}]});
  assert.ok(!unknown.source_packets[0].edition_label);
  assert.ok(!unknown.consulted_editions[0].edition_label);
  assert.equal(unknown.consulted_editions[0].dataset_id,'future-unreviewed-edition');
});
