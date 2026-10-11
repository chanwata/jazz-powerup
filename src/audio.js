const PITCH = {C:0,D:2,E:4,F:5,G:7,A:9,B:11};
export function noteToMidi(note) {
  const m = /^([A-G])([#b]?)(-?\d+)$/.exec(String(note));
  if (!m) throw new Error(`Unknown note: ${note}`);
  const offset = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  return (Number(m[3])+1)*12 + PITCH[m[1]] + offset;
}
export const frequency = note => 440*Math.pow(2,(noteToMidi(note)-69)/12);

export class StudyAudio {
  constructor(){this.ctx=null;this.master=null;this.bus=null;this.output=0.58;this.isPlaying=false;this.endHandle=null;}
  async ensure(){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) throw new Error('このブラウザはWeb Audioに対応していません');
    if(!this.ctx){
      this.ctx=new AC();
      const limiter=this.ctx.createDynamicsCompressor();
      limiter.threshold.value=-17;limiter.ratio.value=3;limiter.attack.value=0.003;limiter.release.value=0.15;
      limiter.connect(this.ctx.destination);
      this.master=this.ctx.createGain();this.master.gain.value=this.output;this.master.connect(limiter);
    }
    if(this.ctx.state==='suspended') await this.ctx.resume();
    return this.ctx;
  }
  stop(){
    if(this.endHandle){clearTimeout(this.endHandle);this.endHandle=null;}
    if(this.bus && this.ctx){
      const now=this.ctx.currentTime;
      this.bus.gain.cancelScheduledValues(now);
      this.bus.gain.setValueAtTime(Math.max(0.0001,this.bus.gain.value),now);
      this.bus.gain.exponentialRampToValueAtTime(0.0001,now+0.045);
    }
    this.isPlaying=false;
  }
  newBus(){
    this.stop();
    const bus=this.ctx.createGain();bus.gain.value=1;bus.connect(this.master);
    this.bus=bus;this.isPlaying=true;
    return bus;
  }
  tone(note,when,length,volume=0.18,bus=this.bus){
    const ctx=this.ctx; const base=frequency(note);
    const v=ctx.createGain();
    const attack=0.013,release=0.20;
    v.gain.setValueAtTime(0.0001,when);
    v.gain.exponentialRampToValueAtTime(volume,when+attack);
    v.gain.exponentialRampToValueAtTime(Math.max(volume*0.21,0.0002),when+Math.max(0.09,length*0.6));
    v.gain.exponentialRampToValueAtTime(0.0001,when+length+release);
    v.connect(bus);
    for(const [r,a,t] of [[1,0.88,'sine'],[2,0.095,'sine'],[3,0.025,'triangle']]){
      const osc=ctx.createOscillator();const g=ctx.createGain();
      osc.type=t;osc.frequency.value=base*r;g.gain.value=a;
      osc.connect(g);g.connect(v);osc.start(when);osc.stop(when+length+release+0.035);
      osc.onended=()=>{osc.disconnect();g.disconnect();};
    }
  }
  async playNote(note){
    await this.ensure();const bus=this.newBus();const when=this.ctx.currentTime+0.025;
    this.tone(note,when,1.6,0.27,bus);
    this.endHandle=setTimeout(()=>{this.isPlaying=false;this.endHandle=null;},1800);
  }
  async playChord(spec){
    await this.ensure();const bus=this.newBus();const at=this.ctx.currentTime+0.06;
    const notes=spec.notes || [];
    if(spec.bass) this.tone(spec.bass,at,2.05,0.30,bus);
    notes.forEach((n,i)=>this.tone(n,at+i*0.018,1.85,0.16/Math.sqrt(Math.max(1,notes.length/3)),bus));
    this.endHandle=setTimeout(()=>{this.isPlaying=false;this.endHandle=null;},2350);
  }
  async playSequence(spec){
    await this.ensure();const bus=this.newBus();
    const bpm=Math.min(220,Math.max(36,Number(spec.bpm)||78));
    const beat=60/bpm;const sequence=spec.sequence||[spec];
    let time=this.ctx.currentTime+0.08;
    for(const step of sequence){
      const duration=(step.beats||4)*beat;
      if(step.bass) this.tone(step.bass,time,Math.max(0.2,duration*0.84),0.29,bus);
      const notes=step.notes||[];
      notes.forEach((note,i)=>this.tone(note,time+Math.min(i*0.022,0.12),Math.max(0.19,duration*0.76),0.14/Math.sqrt(Math.max(1,notes.length/3)),bus));
      time+=duration;
    }
    const ms=(time-this.ctx.currentTime+0.30)*1000;
    this.endHandle=setTimeout(()=>{this.isPlaying=false;this.endHandle=null;},ms);
  }

  async playPattern(exercise,speed=1,repeat=1){
    await this.ensure();
    const bus=this.newBus();
    const rate=Math.min(1.3,Math.max(0.7,Number(speed)||1));
    const bpm=Math.min(240,Math.max(36,exercise.bpm*rate));
    const beat=60/bpm;
    let at=this.ctx.currentTime+0.09;
    const parse=raw=>String(raw||'').trim().split(/\\s+/).filter(Boolean).map(token=>{
      const m=/^([A-G][#b]?-?\\d+|_)@(\\d+(?:\\.\\d+)?)(?:\\/(\\d+(?:\\.\\d+)?))?$/.exec(token);
      if(!m)throw new Error('Invalid timed note: '+token);
      return {note:m[1],at:Number(m[2]),length:m[3]?Number(m[3]):0.72};
    });
    for(let cycle=0;cycle<Math.max(1,Math.min(2,repeat));cycle++){
      for(const part of exercise.bars){
        const count=Number(part.beats)||4;
        const upper=String(part.p||'').trim().split(/\\s+/).filter(Boolean);
        for(const [i,note] of upper.entries())this.tone(note,at+Math.min(0.08,i*0.013),Math.min(2.4,count*beat*0.80),0.11/Math.sqrt(Math.max(1,upper.length/2)),bus);
        for(const e of parse(part.b)){
          if(e.note!=='_')this.tone(e.note,at+e.at*beat,Math.min(Math.max(.12,e.length*beat),count*beat),0.28,bus);
        }
        for(const e of parse(part.lead)){
          if(e.note!=='_')this.tone(e.note,at+e.at*beat,Math.max(.12,e.length*beat),0.14,bus);
        }
        at+=count*beat;
      }
    }
    const ms=(at-this.ctx.currentTime+0.5)*1000;
    this.endHandle=setTimeout(()=>{this.isPlaying=false;this.endHandle=null;},ms);
  }
}
