import {catalogA} from './catalog-a.js';
import {catalogB} from './catalog-b.js';
import {dayKey,shiftDay} from './dashboard.js';
export const catalog={...catalogA,...catalogB};
export const KNOWLEDGE_INTERVALS=[1,3,7,14,30];
export function allKnowledgeCards(){
 return Object.entries(catalog).flatMap(([id,ch])=>[
  ...ch.people.map((x,i)=>({id:`p:${id}:${i}`,lesson:id,kind:'person',item:x})),
  ...ch.albums.map((x,i)=>({id:`a:${id}:${i}`,lesson:id,kind:'album',item:x}))
 ]);
}
export const KNOWLEDGE_CARDS=allKnowledgeCards();
export const KNOWLEDGE_IDS=new Set(KNOWLEDGE_CARDS.map(c=>c.id));
export function validKnowledgeRecord(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return false;
 return Number.isInteger(raw.level)&&raw.level>=0&&raw.level<=5&&
 Number.isInteger(raw.attempts)&&raw.attempts>=0&&raw.attempts<=10000&&
 typeof raw.last==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw.last)&&
 typeof raw.due==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw.due);
}
export function normalizeKnowledgeMemory(input){
 return Object.fromEntries(Object.entries(input&&typeof input==='object'&&!Array.isArray(input)?input:{}).filter(([id,item])=>KNOWLEDGE_IDS.has(id)&&validKnowledgeRecord(item)).map(([id,item])=>[id,{level:item.level,attempts:item.attempts,last:item.last,due:item.due}]));
}
export function recallStats(state,lesson=null,now=new Date()){
 const today=dayKey(now),cards=KNOWLEDGE_CARDS.filter(c=>!lesson||c.lesson===lesson);
 const records=state.musicRecall||{};
 const attempted=cards.filter(c=>validKnowledgeRecord(records[c.id]));
 const due=cards.filter(c=>!validKnowledgeRecord(records[c.id])||records[c.id].due<=today);
 const learned=attempted.filter(c=>records[c.id].level>=2);
 return {total:cards.length,attempted:attempted.length,learned:learned.length,due:due.length};
}
export function nextRecallCard(state,lesson,now=new Date()){
 const today=dayKey(now),records=state.musicRecall||{};
 const cards=KNOWLEDGE_CARDS.filter(c=>c.lesson===lesson);
 return cards.filter(c=>!validKnowledgeRecord(records[c.id])||records[c.id].due<=today).sort((a,b)=>{
  const aDone=validKnowledgeRecord(records[a.id]),bDone=validKnowledgeRecord(records[b.id]);
  if(aDone!==bDone)return aDone?1:-1;
  return (records[a.id]?.due||'').localeCompare(records[b.id]?.due||'') || a.id.localeCompare(b.id);
 })[0]||null;
}
export function gradeKnowledgeCard(state,id,remembered,now=new Date()){
 if(!KNOWLEDGE_IDS.has(id))throw Error('未知の暗記カードです');
 state.musicRecall||={};
 const day=dayKey(now),prev=state.musicRecall[id];
 const level=remembered?Math.min(5,(prev?.level||0)+1):0;
 const due=shiftDay(day,remembered?KNOWLEDGE_INTERVALS[level-1]:1);
 state.musicRecall[id]={level,last:day,due,attempts:Math.min(10000,(prev?.attempts||0)+1)};
 return state.musicRecall[id];
}
