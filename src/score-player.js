import {pitch,performanceEvents,scoreLength} from './score-model.js';
export class ScorePlayer {
 constructor(){this.context=null;this.bus=null;this.limiter=null;this.sources=[];this.frame=null;this.generation=0;this.onTick=()=>{};this.onStop=()=>{};}
 stop(){
  this.generation++;
  if(this.frame)cancelAnimationFrame(this.frame);this.frame=null;
  const now=this.context?.currentTime||0;
  if(this.bus){this.bus.gain.cancelScheduledValues(now);this.bus.gain.setValueAtTime(this.bus.gain.value,now);this.bus.gain.linearRampToValueAtTime(0,now+.025);}
  for(const s of this.sources){try{s.stop(now+.03);}catch{}}
  const oldBus=this.bus,oldLimiter=this.limiter;
  setTimeout(()=>{try{oldBus?.disconnect();oldLimiter?.disconnect();}catch{}},50);
  this.bus=null;this.limiter=null;this.sources=[];this.onStop();
 }
 async init(){
  const A=window.AudioContext||window.webkitAudioContext;
  if(!A)throw Error('このブラウザでは音声再生に対応していません。音名表を使って実機で確認できます。');
  if(!this.context)this.context=new A();
  if(this.context.state==='suspended')await this.context.resume();
  if(this.context.state!=='running')throw Error('音声を開始できません。もう一度再生をタップしてください。');
 }
 tone(note,at,duration,volume){
  const c=this.context,g=c.createGain();g.connect(this.bus);
  const end=at+duration,attack=Math.min(.012,duration*.15),rel=Math.min(.035,duration*.15);
  g.gain.setValueAtTime(.00001,at);g.gain.linearRampToValueAtTime(volume,at+attack);
  g.gain.exponentialRampToValueAtTime(Math.max(.0001,volume*.22),end-rel);
  g.gain.linearRampToValueAtTime(0,end);
  for(const [mult,gain] of [[1,.82],[2,.13],[3,.05]]){
   const o=c.createOscillator(),part=c.createGain();o.frequency.value=440*2**((pitch(note).midi-69)/12)*mult;
   part.gain.value=gain;o.connect(part);part.connect(g);o.start(at);o.stop(end+.01);this.sources.push(o);
   o.onended=()=>{o.disconnect();part.disconnect();};
  }
 }
 async play(score,{mode='all',speed=1,repeat=1,countIn=true}={}){
  this.stop();const token=this.generation;await this.init();if(token!==this.generation)return;
  window.dispatchEvent(new Event('score-audio-start'));
  const c=this.context,bus=c.createGain(),limiter=c.createDynamicsCompressor();
  limiter.threshold.value=-17;limiter.ratio.value=4;limiter.connect(c.destination);bus.gain.value=.65;bus.connect(limiter);this.bus=bus;this.limiter=limiter;
  const bpm=score.bpm*speed,beat=60/bpm,lead=countIn?4:0,start=c.currentTime+.08,origin=start+lead*beat,total=scoreLength(score),cycles=Math.min(4,Math.max(1,repeat));
  if(countIn)for(let i=0;i<4;i++)this.tone(i===0?'C6':'G5',start+i*beat,.045,.075);
  const ev=performanceEvents(score).filter(e=>mode==='all'||e.voice===mode);
  for(let loop=0;loop<cycles;loop++)for(const e of ev){
   const when=origin+(loop*total+e.at)*beat+(e.offsetMs||0)/1000;
   const dur=e.d*beat;
   e.p.forEach(note=>this.tone(note,when,dur,(e.voice==='bass'?.20:.12)/Math.sqrt(e.p.length)));
  }
  const finish=origin+cycles*total*beat+.12;
  const tick=()=>{
   if(token!==this.generation)return;
   const elapsed=(c.currentTime-origin)/beat;
   this.onTick({score,beat:elapsed<0?elapsed:elapsed%total,cycle:Math.max(0,Math.floor(elapsed/total)),bpm,total});
   if(c.currentTime>=finish){this.stop();return;}
   this.frame=requestAnimationFrame(tick);
  };tick();
 }
}
