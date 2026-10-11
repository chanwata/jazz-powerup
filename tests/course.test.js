import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {lessons,earDrills} from '../src/data.js';
import {noteToMidi,frequency} from '../src/audio.js';

test('14 unique complete lessons',()=>{
  assert.equal(lessons.length,14);
  assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
  for(const l of lessons){
    for(const k of ['id','era','title','subtitle','artist','album','query','premise','history','theory','listen','practice','insider','examples','quiz'])assert.ok(l[k],`${l.id} ${k}`);
    assert.ok(l.listen.length>=3,`${l.id} listening points`);
    assert.ok(l.examples.length>=1,`${l.id} sound examples`);
    assert.equal(l.quiz.options.length,3);
    assert.ok(Number.isInteger(l.quiz.answer)&&l.quiz.answer>=0&&l.quiz.answer<3);
    for(const ex of l.examples){assert.ok(ex.sequence.length>0);assert.ok(ex.bpm>=40&&ex.bpm<=240);for(const step of ex.sequence){assert.ok(step.beats>0);if(step.bass)noteToMidi(step.bass);for(const n of step.notes||[])noteToMidi(n)}}
  }
});

test('all ear exercises have valid notes and answers',()=>{
  assert.equal(earDrills.length,10);
  assert.equal(new Set(earDrills.map(d=>d.id)).size,earDrills.length);
  for(const d of earDrills){assert.ok(['A','B'].includes(d.correct));assert.ok(d.explanation);for(const s of [d.a,d.b]){const steps=s.sequence||[s];for(const x of steps){if(x.bass)noteToMidi(x.bass);for(const n of x.notes||[])noteToMidi(n)}}}
});

test('note frequency parser handles accidentals and octaves',()=>{
  assert.equal(noteToMidi('C4'),60);
  assert.equal(noteToMidi('F#3'),54);
  assert.equal(noteToMidi('Bb2'),46);
  assert.equal(noteToMidi('Ab4'),68);
  assert.ok(Math.abs(frequency('A4')-440)<1e-7);
  assert.throws(()=>noteToMidi('H4'));
});

test('deployment and static application files exist',()=>{
  for(const path of ['index.html','src/app.js','src/audio.js','src/style.css','.github/workflows/bootstrap.yml','favicon.svg','.nojekyll'])assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
  const page=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.match(page,/src\/app\.js/);assert.match(page,/src\/style\.css/);
  const workflow=readFileSync(new URL('../.github/workflows/bootstrap.yml',import.meta.url),'utf8');
  assert.match(workflow,/actions\/deploy-pages@v4/);assert.match(workflow,/npm test/);
});
