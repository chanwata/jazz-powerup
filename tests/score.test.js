import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreBook} from '../src/score-book.js';
import {degree,pitch,eventsFor,performanceEvents,validateScore,eventRows,scoreLength} from '../src/score-model.js';
import {renderScore} from '../src/score-render.js';
const all=Object.values(scoreBook).flatMap(c=>c.scores);
test('14 annotated chapters and 33 unique fully engravable scores',()=>{
 assert.equal(Object.keys(scoreBook).length,14);assert.equal(all.length,33);assert.equal(new Set(all.map(s=>s.id)).size,33);
 for(const c of Object.values(scoreBook)){
  assert.ok(c.principles.length>=3);assert.ok(c.walk.length>=3);assert.ok(c.practice.length>=3);assert.ok(c.hands&&c.caution&&c.check);
  for(const s of c.scores){assert.equal(validateScore(s),true);const svg=renderScore(s);assert.ok(svg.startsWith('<svg'));assert.ok(!svg.includes('NaN'));assert.match(svg,/data-event-key=/);assert.ok(eventRows(s).length>0);}
 }
});
test('degree spelling follows the bass reference, including ninths and elevenths',()=>{
 const expected={D:['9','5','R','11','13'],C:['3','13','9','5','7'],F:['7','3','13','9','♯11']};
 for(const [root,degrees] of Object.entries(expected))assert.deepEqual(['E3','A3','D4','G4','B4'].map(n=>degree(n,root)),degrees);
 assert.equal(degree('Bb4','F'),'11');assert.equal(degree('F3','D'),'♭3');assert.equal(degree('C4','D'),'♭7');
 assert.equal(pitch('Bb4').midi-pitch('A3').midi,13);assert.equal(pitch('B4').midi-pitch('A3').midi,14);
});
test('five quarters in four beats are exact, microtiming is an independent offset',()=>{
 const [a,b,c]=scoreBook['13'].scores;
 assert.deepEqual(eventsFor(a).filter(e=>e.voice==='upper'&&e.bar===0).map(e=>Number(e.local.toFixed(3))),[0,.8,1.6,2.4,3.2]);
 const be=performanceEvents(b).filter(e=>e.voice==='upper'),ce=performanceEvents(c).filter(e=>e.voice==='upper');
 assert.deepEqual(be.map(e=>e.at),ce.map(e=>e.at));assert.ok(ce.every(e=>e.offsetMs===75));assert.ok(be.every(e=>!e.offsetMs));
 assert.equal(scoreLength(a),8);
});
test('cross-bar anticipation is one sounding event, not an extra note on the downbeat',()=>{
 const s=scoreBook['14'].scores.find(s=>s.id==='14e');
 const notes=performanceEvents(s).filter(e=>e.voice==='bass');
 const tie=notes.find(e=>e.p[0]==='Bb1');assert.equal(tie.at,3);assert.equal(tie.d,2);assert.equal(tie.keys.length,2);
 assert.ok(!notes.some(e=>e.at===4));assert.equal(eventRows(s).filter(e=>e.held).length,1);
});
test('sus replacement and addition are different pitch sets; avoid example changes one note',()=>{
 const [,b,c]=scoreBook['09'].scores;
 assert.ok(!b.bars[1].upper[0].p.includes('G3'));assert.ok(c.bars[1].upper[0].p.includes('G3'));assert.ok(c.bars[1].upper[0].p.includes('F#3'));
 const [a14,b14,,d14]=scoreBook['14'].scores;
 assert.deepEqual(a14.bars[0].upper[0].p,['A3','E4','Bb4']);assert.deepEqual(b14.bars[0].upper[0].p,['A3','E4','B4']);assert.deepEqual(d14.bars[0].upper[0].p,['E4','Bb4']);
});
test('rests and missing thirds are not fabricated by the playback model',()=>{
 const [a,b]=scoreBook['11'].scores;assert.equal(performanceEvents(a).find(e=>e.voice==='bass').d,4);assert.equal(performanceEvents(b).find(e=>e.voice==='bass').d,1);
 assert.deepEqual(a.bars[0].upper,b.bars[0].upper);
 assert.throws(()=>validateScore({...a,bars:[{...a.bars[0],bass:[{p:['E2'],d:3}]}]}));
});
