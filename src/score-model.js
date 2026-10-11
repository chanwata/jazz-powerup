/** Notation and playback share these pitches, durations and offsets. */
export const esc = x => String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LETTERS = ['C','D','E','F','G','A','B'];
const CHROMA = [0,2,4,5,7,9,11];
export function pitch(p) {
  const m=/^([A-G])([#b]?)(-?\d+)$/.exec(String(p));
  if(!m) throw new Error(`音名が不正です: ${p}`);
  const i=LETTERS.indexOf(m[1]),oct=+m[3],alt=m[2]==='#'?1:m[2]==='b'?-1:0;
  return {letter:m[1],acc:m[2],oct,midi:(oct+1)*12+CHROMA[i]+alt,diatonic:oct*7+i};
}
export function displayPitch(p){return p.replace('#','♯').replace('b','♭');}
export function degree(p,root){
 if(!root)return '—';
 const a=pitch(p),b=pitch(root+'2');
 const step=(LETTERS.indexOf(a.letter)-LETTERS.indexOf(b.letter)+7)%7;
 let diff=((a.midi-b.midi)%12+12)%12-CHROMA[step];
 if(diff>6)diff-=12;if(diff< -6)diff+=12;
 const names=['R','9','3','11','5','13','7'];
 const alteration=diff<0?'♭'.repeat(-diff):'♯'.repeat(diff);
 return alteration+names[step];
}
export function beatName(at){
 const whole=Math.floor(at+1e-7),fract=at-whole;
 if(Math.abs(fract)<1e-6)return `${whole+1}拍目`;
 if(Math.abs(fract-.5)<1e-6)return `${whole+1}拍目裏`;
 return `小節頭＋${Number(at.toFixed(3))}拍`;
}
export function harmonicAt(bar,at){return (bar.changes||[{at:0,label:bar.label,root:bar.root}]).filter(c=>c.at<=at+1e-7).at(-1);}
export function eventsFor(score){
 let offset=0;const out=[];
 for(const [bi,bar] of score.bars.entries()){
  for(const voice of ['upper','bass']){
   let local=0;
   for(const [ei,e] of bar[voice].entries()){
    out.push({...e,bar:bi,voice,event:ei,at:offset+local,local,key:`${score.id}-${voice}-${bi}-${ei}`,root:harmonicAt(bar,local)?.root});
    local+=e.d;
   }
  }
  offset+=bar.beats||score.meter;
 }
 return out.sort((a,b)=>a.at-b.at||a.voice.localeCompare(b.voice));
}
export function validateScore(score){
 if(!score.id||!score.bars.length||score.bpm<36||score.bpm>240)throw Error('Invalid score header');
 for(const [i,bar] of score.bars.entries())for(const voice of ['upper','bass']){
  let sum=0;
  for(const e of bar[voice]){
   if(!Number.isFinite(e.d)||e.d<=0)throw Error(`${score.id}/${i}: duration`);
   if(!Array.isArray(e.p))throw Error('Pitches must be an array');
   e.p.forEach(pitch);sum+=e.d;
   if(e.offsetMs!==undefined&&(!Number.isFinite(e.offsetMs)||Math.abs(e.offsetMs)>500))throw Error('Invalid offset');
  }
  if(Math.abs(sum-(bar.beats||score.meter))>1e-7)throw Error(`${score.id} bar ${i+1} ${voice}: ${sum} beats`);
  if(voice==='upper'&&bar.upperTuplet&&bar.upper.length!==bar.upperTuplet)throw Error('Tuplet count mismatch');
 }
 const ev=eventsFor(score);
 for(const e of ev.filter(e=>e.tie)){
  const next=ev.find(x=>x.voice===e.voice&&Math.abs(x.at-(e.at+e.d))<1e-7);
  if(!next||next.p.join(',')!==e.p.join(','))throw Error(`${score.id}: tie does not connect identical pitches`);
 }
 return true;
}
export function performanceEvents(score){
 validateScore(score);const src=eventsFor(score),output=[];
 for(const voice of ['upper','bass']){
  let previous=null;
  for(const e of src.filter(e=>e.voice===voice)){
   if(!e.p.length){previous=null;continue;}
   if(previous?.tie && Math.abs(previous.at+previous.d-e.at)<1e-7 && previous.p.join(',')===e.p.join(',')){
    previous.d+=e.d;previous.tie=!!e.tie;previous.keys.push(e.key);
   }else{
    previous={...e,keys:[e.key]};output.push(previous);
   }
  }
 }
 return output.sort((a,b)=>a.at-b.at);
}
export function scoreLength(score){return score.bars.reduce((n,b)=>n+(b.beats||score.meter),0);}
export function eventRows(score){
 const ev=eventsFor(score);
 return ev.map(e=>{
  const before=ev.find(x=>x.voice===e.voice&&x.tie&&Math.abs(x.at+x.d-e.at)<1e-7);
  return {...e,held:!!before,label:e.p.length?e.p.map(displayPitch).join(' / '):'休符',degrees:e.p.length?e.p.map(n=>degree(n,e.root)).join(' / '):'—'};
 });
}
