import test from 'node:test';
import assert from 'node:assert/strict';
import {practiceA} from '../src/practice-a.js';
import {practiceB} from '../src/practice-b.js';
import {lessons} from '../src/data.js';
import {noteToMidi} from '../src/audio.js';
import {execFileSync} from 'node:child_process';
const plans={...practiceA,...practiceB};
function timedTokens(raw){return String(raw||'').trim().split(/\s+/).filter(Boolean).map(token=>{const m=/^([A-G][#b]?-?\d+|_)@(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/.exec(token);assert.ok(m,`Invalid timed note: ${token}`);return {note:m[1],time:+m[2],len:m[3]?+m[3]:.72}})}
test('all chapters have three concrete audio examples and three graded practice steps',()=>{
 assert.deepEqual(Object.keys(plans).sort(),lessons.map(x=>x.id).sort());
 for(const [id,p] of Object.entries(plans)){
   assert.ok(p.goal.length>=20,`${id} goal`);
   assert.ok(p.examples.length>=3,`${id} examples`);
   assert.equal(p.tasks.length,3,`${id} steps`);
   assert.ok(p.recordings.length>=2,`${id} references`);
   for(const [j,ex] of p.examples.entries()){
     assert.ok(ex.title&&ex.hear.length>=15&&ex.why.length>=15,`${id} example ${j} descriptions`);
     assert.ok(ex.bpm>=40&&ex.bpm<=220);
     assert.ok(ex.bars.length>=2);
     for(const bar of ex.bars){
       const beats=bar.beats||4;
       assert.ok(beats>=1&&beats<=8);
       assert.ok(bar.h);
       assert.ok(bar.b);
       for(const hit of [...timedTokens(bar.b),...timedTokens(bar.lead)]){
         assert.ok(hit.time>=0&&hit.time<beats,`${id} event exceeds bar: ${hit.note}@${hit.time}`);
         assert.ok(hit.len>0&&hit.len<=8);
         if(hit.note!=='_')noteToMidi(hit.note);
       }
       for(const note of String(bar.p||'').split(/\s+/).filter(Boolean))noteToMidi(note);
     }
   }
   for(const task of p.tasks){assert.ok(task.level?.length>=4,`${id} level`);for(const field of ['setup','action','check'])assert.ok(task[field]?.length>=8,`${id} ${field}`);}
   for(const rec of p.recordings)assert.ok(rec.title&&rec.focus&&rec.apply);
 }
});
test('application and audio engine parse successfully',()=>{for(const file of ['src/app.js','src/audio.js','src/practice-a.js','src/practice-b.js'])assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',file]));});
