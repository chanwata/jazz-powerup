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

test('long-form editorial readings cover every lesson with references and usable listening tasks',async()=>{
 const {readingA}=await import('../src/reading-a.js');
 const {readingB}=await import('../src/reading-b.js');
 const readings={...readingA,...readingB};
 assert.deepEqual(Object.keys(readings).sort(),lessons.map(l=>l.id).sort());
 for(const [id,r] of Object.entries(readings)){
   for(const field of ['title','context','analysis','people','listenMap','lab','aside','refs'])assert.ok(r[field],`${id}: ${field}`);
   assert.ok(r.context.join('').length>200,`${id} context too short`);
   assert.ok(r.analysis.join('').length>300,`${id} analysis too short`);
   assert.ok(r.people.length>=3);
   assert.equal(r.listenMap.length,3);
   assert.ok(r.lab.length>=50);
   assert.ok(r.refs.length>=1);
   for(const [title,url] of r.refs)assert.ok(title&&/^https:\/\//.test(url),`${id} invalid source ${url}`);
 }
});

test('dashboard calculates recorded activities honestly and schedules spaced reviews',async()=>{
 const {dashboardSnapshot,logLearning,recordReview,dayKey,shiftDay}=await import('../src/dashboard.js');
 const {homeMarkup}=await import('../src/dashboard-view.js');
 const now=new Date(2026,9,11,12);
 const state={completed:{'03':true},practiceDone:{'03:0':true},ear:{e1:'B',e2:'A'},notes:{},studyEvents:[],reviews:{},weeklyTarget:3,homeMinutes:5};
 let s=dashboardSnapshot(state,lessons,earDrills,now);
 assert.equal(s.completed,1);assert.equal(s.active,0);assert.equal(s.practice,1);assert.equal(s.earCorrect,1);
 assert.equal(s.due[0].lesson.id,'03');
 logLearning(state,'practice','03:0',new Date(2026,9,10,12));
 logLearning(state,'ear','e1',now);
 s=dashboardSnapshot(state,lessons,earDrills,now);
 assert.equal(s.active,2);assert.equal(s.streak,2);assert.equal(s.totalEvents,2);
 assert.equal(dayKey(now),'2026-10-11');
 assert.equal(shiftDay('2026-12-31',1),'2027-01-01');
 let review=recordReview(state,'03',true,now);
 assert.equal(review.nextDue,'2026-10-12');
 s=dashboardSnapshot(state,lessons,earDrills,now);
 assert.equal(s.due.length,0);
 const markup=homeMarkup(s,state,x=>String(x));
 assert.match(markup,/SPACED RECALL/);
 assert.match(markup,/学習のリズム/);
 assert.match(markup,/#\/lesson\/01/);
 review=recordReview(state,'03',true,new Date(2026,9,12,12));
 assert.equal(review.nextDue,'2026-10-15');
 review=recordReview(state,'03',false,new Date(2026,9,13,12));
 assert.equal(review.nextDue,'2026-10-14');
 assert.equal(review.count,0);
});
