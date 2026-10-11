export const REVIEW_INTERVALS=[1,3,7,14,30];
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s);
export function dayKey(date=new Date()){
 const d=date instanceof Date?date:new Date(date);
 return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
}
export function shiftDay(day,offset){
 const [y,m,d]=day.split('-').map(Number);return dayKey(new Date(y,m-1,d+offset,12));
}
export function logLearning(state,kind,id='',when=new Date()){
 if(!state.studyEvents||!Array.isArray(state.studyEvents))state.studyEvents=[];
 const day=dayKey(when);
 state.studyEvents.push({day,kind,id:String(id).slice(0,24),at:when.toISOString()});
 state.studyEvents=state.studyEvents.slice(-1200);
 return state;
}
export function recordReview(state,id,remembered,when=new Date()){
 if(!state.reviews||typeof state.reviews!=='object'||Array.isArray(state.reviews))state.reviews={};
 const today=dayKey(when),old=state.reviews[id];
 const count=remembered?Math.min(5,Math.max(0,Number(old?.count)||0)+1):0;
 const nextDue=shiftDay(today,remembered?REVIEW_INTERVALS[count-1]:1);
 state.reviews[id]={count,last:today,nextDue,attempts:(old?.attempts||0)+1};
 logLearning(state,remembered?'review-recalled':'review-again',id,when);
 return state.reviews[id];
}
export function dashboardSnapshot(state,lessons,earDrills,now=new Date()){
 const today=dayKey(now),days=Array.from({length:7},(_,i)=>shiftDay(today,i-6));
 const raw=Array.isArray(state.studyEvents)?state.studyEvents:[];
 const entries=raw.filter(x=>x&&validDate(x.day)&&typeof x.kind==='string');
 const week=days.map((day,i)=>({day,count:entries.filter(e=>e.day===day).length,weekday:['日','月','火','水','木','金','土'][new Date(...day.split('-').map((v,j)=>j===1?Number(v)-1:Number(v))).getDay()]}));
 const active=week.filter(x=>x.count>0).length;
 const unique=new Set(entries.map(x=>x.day));
 let streak=0,at=unique.has(today)?today:shiftDay(today,-1);
 while(unique.has(at)&&streak<1200){streak++;at=shiftDay(at,-1);}
 const completed=lessons.filter(x=>state.completed?.[x.id]).length;
 const practice=lessons.reduce((n,x)=>n+[0,1,2].filter(k=>state.practiceDone?.[x.id+':'+k]===true).length,0);
 const earAnswered=earDrills.filter(x=>['A','B'].includes(state.ear?.[x.id]));
 const earCorrect=earAnswered.filter(x=>state.ear[x.id]===x.correct).length;
 const target=[2,3,4,5,7].includes(state.weeklyTarget)?state.weeklyTarget:3;
 const oldReviews=(state.reviews&&typeof state.reviews==='object')?state.reviews:{};
 const reviewCandidates=lessons.filter(x=>state.completed?.[x.id]).map(x=>({
  lesson:x,review:oldReviews[x.id]||null,
  due:!oldReviews[x.id]?.nextDue||oldReviews[x.id]?.nextDue<=today
 }));
 const due=reviewCandidates.filter(x=>x.due).sort((a,b)=>(a.review?.nextDue||'').localeCompare(b.review?.nextDue||''));
 const next=lessons.find(x=>!state.completed?.[x.id])||lessons[0];
 const badges=[
  {name:'最初の1歩',earned:entries.length>0,desc:'何かを一つ実践して記録'},
  {name:'耳で確かめる',earned:earAnswered.length>=3,desc:'耳トレを3問以上回答'},
  {name:'指先に移す',earned:practice>=5,desc:'練習課題を5つ完了'},
  {name:'自分の言葉に',earned:lessons.some(x=>String(state.notes?.[x.id]||'').trim().length>=20),desc:'20文字以上の学習メモ'},
  {name:'再会する音',earned:entries.some(x=>x.kind==='review-recalled'||x.kind==='review-again'),desc:'復習を一度実施'}
 ];
 return {today,week,active,streak,target,completed,practice,earAnswered:earAnswered.length,earCorrect,due,next,reviewCandidates,badges,totalEvents:entries.length};
}
export function reviewForDashboard(snap){return snap.due[0]||null;}
