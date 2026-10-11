import {esc,pitch,degree,displayPitch,eventsFor} from './score-model.js';
import {symbols} from './score-symbols.js';
const W=900,MW=387,LEFT=96,SYSTEM=397;
function glyph(name,x,y,h){
 const {path,box:[x0,y0,x1,y1]}=symbols[name],k=h/(y1-y0);
 return `<path d="${path}" transform="translate(${x-x0*k} ${y+y1*k}) scale(${k} ${-k})" fill="currentColor"/>`;
}
const text=(x,y,t,size=13,anchor='middle',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" ${extra}>${esc(t)}</text>`;
const line=(x1,y1,x2,y2,w=1,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${w}" ${extra}/>`;
function pitchY(p,voice,row){
 const d=pitch(p).diatonic+(voice==='bass'?7:0);
 const base=voice==='upper'?30:18;
 return row*SYSTEM+(voice==='upper'?140:283)-(d-base)*5;
}
function value(d,tuplet){
 const nominal=tuplet?d*tuplet/4:d;
 const n=[4,3,2,1.5,1,.75,.5,.25].find(x=>Math.abs(x-nominal)<1e-6);
 if(!n)throw Error(`Unsupported engraved duration ${d}`);
 return {base:n===3?2:n===1.5?1:n===.75?.5:n,dotted:[3,1.5,.75].includes(n)};
}
function rest(x,top,d,tuplet){
 const v=value(d,tuplet);let g='';
 if(v.base>=2){const y=top+(v.base===4?10:20);g=`<rect x="${x-6}" y="${v.base===4?y:y-4}" width="12" height="4"/>`;}
 else g=glyph(v.base>=1?'quarterRest':'eighthRest',x-7,top+5,v.base>=1?33:25);
 if(v.dotted)g+=`<circle cx="${x+12}" cy="${top+15}" r="1.7"/>`;
 return g;
}
export function scoreGeometry(score){return {width:W,height:Math.ceil(score.bars.length/2)*SYSTEM+8,left:LEFT,measureWidth:MW,systemHeight:SYSTEM};}
export function renderScore(score){
 const events=eventsFor(score),rows=Math.ceil(score.bars.length/2);let out='';const positions=new Map();
 for(let row=0;row<rows;row++){
  const count=Math.min(2,score.bars.length-row*2),end=LEFT+MW*count;
  for(const [voice,top] of [['upper',100],['bass',243]]){
   for(let i=0;i<5;i++)out+=line(42,row*SYSTEM+top+i*10,end,row*SYSTEM+top+i*10,.8);
   out+=glyph(voice==='upper'?'treble':'bass',48,row*SYSTEM+(voice==='upper'?74:244),voice==='upper'?82:37);
   out+=text(83,row*SYSTEM+top+19,score.meter,20,'middle','font-family="serif" font-weight="bold"');
   out+=text(83,row*SYSTEM+top+37,4,20,'middle','font-family="serif" font-weight="bold"');
  }
  out+=text(44,row*SYSTEM+65,'鍵盤 · 実音',12,'start');out+=text(44,row*SYSTEM+221,'ベース · 1oct高く記譜',12,'start');
  out+=line(42,row*SYSTEM+100,42,row*SYSTEM+283,1.4);
  for(let j=0;j<count;j++){
   const bi=row*2+j,bar=score.bars[bi],x0=LEFT+j*MW,beats=bar.beats||score.meter,pw=(MW-69)/beats;
   out+=`<g data-measure="${bi}"><rect class="sl-bar-highlight" x="${x0}" y="${row*SYSTEM+75}" width="${MW}" height="223" fill="#e9d7b1" opacity="0"/></g>`;
   out+=text(x0+8,row*SYSTEM+21,`${bi+1}`,12,'start','fill="#7f8c88"');
   for(const ch of bar.changes||[{at:0,label:bar.label}])out+=text(x0+38+ch.at*pw,row*SYSTEM+42,ch.label,17,'start','font-weight="700"');
   for(let k=0;k<beats;k++){
    const x=x0+38+k*pw;
    out+=text(x,row*SYSTEM+78,k+1,12,'middle','fill="#7f8c88"');
    out+=line(x,row*SYSTEM+87,x,row*SYSTEM+292,.5,'stroke-dasharray="2 5" opacity=".25"');
   }
   for(const voice of ['upper','bass'])out+=line(x0+MW,row*SYSTEM+(voice==='upper'?100:243),x0+MW,row*SYSTEM+(voice==='upper'?140:283),bi===score.bars.length-1?2:1);
   const local=events.filter(e=>e.bar===bi);
   for(const e of local){
    const x=x0+38+e.local*pw,top=row*SYSTEM+(e.voice==='upper'?100:243),tuplet=e.voice==='upper'?bar.upperTuplet:0;
    const val=value(e.d,tuplet);let draw='';
    if(!e.p.length){draw=rest(x,top,e.d,tuplet);}
    else{
     const sorted=e.p.map(p=>({p,y:pitchY(p,e.voice,row)})).sort((a,b)=>a.y-b.y);
     const up=sorted.reduce((n,a)=>n+a.y,0)/sorted.length>top+20;
     const cols=[];
     for(let k=0;k<sorted.length;k++){
      const {p,y}=sorted[k],pinfo=pitch(p);
      const offset=k&&Math.abs(sorted[k-1].y-y)===5?7:0;
      const nx=x+offset;
      if(y<top)for(let ly=top-10;ly>=y-0.1;ly-=10)draw+=line(nx-10,ly,nx+10,ly,1.2);
      if(y>top+40)for(let ly=top+50;ly<=y+0.1;ly+=10)draw+=line(nx-10,ly,nx+10,ly,1.2);
      let col=cols.findIndex(c=>c.every(yy=>Math.abs(yy-y)>23));if(col<0){col=cols.length;cols.push([]);}cols[col].push(y);
      // Explicit accidentals, including naturals, avoid inherited-state ambiguity.
      draw+=glyph(pinfo.acc==='#'?'sharp':pinfo.acc==='b'?'flat':'natural',x-19-col*12,y-13,25);
      draw+=`<ellipse cx="${nx}" cy="${y}" rx="${val.base===4?7.8:6.5}" ry="4.4" transform="rotate(-18 ${nx} ${y})" fill="${val.base>=2?'white':'currentColor'}" stroke="currentColor" stroke-width="1.4"/>`;
      if(val.dotted)draw+=`<circle cx="${nx+13}" cy="${y-(Math.round((y-top)/5)%2===0?4:0)}" r="1.8"/>`;
     }
     if(val.base<4){
      const high=sorted[0].y,low=sorted.at(-1).y,sx=x+(up?6:-6),sy=up?low:high,ey=up?high-29:low+29;
      draw+=line(sx,sy,sx,ey,1.5);
      if(val.base<=.5){
       const dir=up?1:-1;
       draw+=`<path d="M${sx} ${ey} Q${sx+14} ${ey+dir*10} ${sx+8} ${ey+dir*23} Q${sx+14} ${ey+dir*7} ${sx} ${ey+dir*5}" fill="currentColor"/>`;
      }
     }
     positions.set(e.key,{x,y:sorted.at(-1).y,row,voice:e.voice});
     if(e.voice==='bass'){
      draw+=text(x,row*SYSTEM+324,e.p.map(displayPitch).join('/'),12);
      draw+=text(x,row*SYSTEM+343,e.p.map(p=>degree(p,e.root)).join('/'),12,'middle','fill="#286e66" font-weight="700"');
     }
     if(e.offsetMs)draw+=text(x,row*SYSTEM+192,`+${e.offsetMs}ms`,12,'middle','fill="#a64f36"');
    }
    out+=`<g class="sl-note" data-event-key="${e.key}" aria-label="${esc(`${e.voice==='bass'?'低音':'上声'} ${e.p.length?e.p.map(displayPitch).join(' '):'休符'} ${e.d}拍`)}">${draw}</g>`;
   }
   if(bar.upperTuplet){
    const x1=x0+38,x2=x0+38+(beats-beats/bar.upperTuplet)*pw;
    out+=`<path d="M${x1} ${row*SYSTEM+58} v-5 H${(x1+x2)/2-18} M${(x1+x2)/2+18} ${row*SYSTEM+53} H${x2} v5" fill="none" stroke="currentColor"/>`;
    out+=text((x1+x2)/2,row*SYSTEM+58,`${bar.upperTuplet}:4`,13);
   }
  }
 }
 for(const e of events.filter(e=>e.tie)){
  const n=events.find(x=>x.voice===e.voice&&Math.abs(x.at-(e.at+e.d))<1e-6),a=positions.get(e.key),b=n&&positions.get(n.key);
  if(a&&b&&a.row===b.row)out+=`<path d="M${a.x+8} ${a.y+10} Q${(a.x+b.x)/2} ${Math.max(a.y,b.y)+34} ${b.x-8} ${b.y+10}" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
 }
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(score.title)}" viewBox="0 0 ${W} ${rows*SYSTEM+8}" width="${W}" height="${rows*SYSTEM+8}" style="color:#172b28;background:white;font-family:Arial,'Hiragino Kaku Gothic ProN',sans-serif"><title>${esc(score.title)}</title><desc>上段は実音の鍵盤譜。下段は通常のベース譜と同じく実音より1オクターブ高い記譜。下の音名は実音。全ての音に臨時記号を明記。</desc>${out}</svg>`;
 return svg;
}
