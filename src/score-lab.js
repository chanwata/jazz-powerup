import {scoreBook,scoreSources} from './score-book.js';
import {esc,displayPitch,degree,beatName,eventRows,scoreLength} from './score-model.js';
import {renderScore} from './score-render.js';
import {ScorePlayer} from './score-player.js';
const app=document.getElementById('app'),player=new ScorePlayer();let currentCard=null;
const findScore=id=>Object.values(scoreBook).flatMap(x=>x.scores).find(s=>s.id===id);
function rowTable(score){return `<div class="sl-table-wrap"><table><caption>音名・発音位置・基準音に対する度数（音名は実音）</caption><thead><tr><th>小節／位置</th><th>声部</th><th>音名</th><th>度数</th><th>長さ</th></tr></thead><tbody>${eventRows(score).map(e=>`<tr><td>${e.bar+1}小節・${beatName(e.local)}${e.offsetMs?`<br>＋${e.offsetMs}ms`:''}</td><td>${e.voice==='bass'?'低音':'上声'}${e.held?'（タイ継続）':''}</td><td>${esc(e.label)}</td><td>${esc(e.degrees)}</td><td>${Number(e.d.toFixed(3))}拍${e.d===.8?'（5連符）':''}</td></tr>`).join('')}</tbody></table></div>`;}
function card(score){
 return `<article class="sl-card" id="score-${score.id}" data-score-card="${score.id}"><div class="sl-card-head"><h3>${esc(score.title)}</h3><span>♩ = ${score.bpm} · ${score.bars.length}小節</span></div>
 <div class="sl-sheet" tabindex="0" role="region" aria-label="${esc(score.title)}。横にスクロールして譜面全体を確認">${renderScore(score)}</div>
 <p class="sl-notation-note">下段の音名・再生は実音。ベースの五線だけ実音より1オクターブ上。♮も省略せず表示する学習用表記。</p>
 <div class="sl-controls"><button data-sl-play="${score.id}" data-part="all">▶ 全体</button><button data-sl-play="${score.id}" data-part="bass">▶ 低音のみ</button><button data-sl-play="${score.id}" data-part="upper">▶ 上声のみ</button><button class="sl-quiet" data-sl-stop>■ 停止</button></div>
 <div class="sl-options"><label>速度 <select data-sl-speed><option value="0.75">75%（${Math.round(score.bpm*.75)} BPM）</option><option value="1" selected>100%（${score.bpm} BPM）</option><option value="1.25">125%（${Math.round(score.bpm*1.25)} BPM）</option></select></label><label>反復 <select data-sl-repeat><option value="1">1回</option><option value="2">2回</option><option value="4">4回</option></select></label><label><input type="checkbox" data-sl-count checked> 4拍カウント</label><button class="sl-link" data-sl-svg="${score.id}">譜例をSVG保存</button></div>
 <p class="sl-status" role="status" aria-live="polite">音量を小さくして再生。タップした声部だけを聴ける。</p>${rowTable(score)}</article>`;
}
function markup(ch){return `<section class="score-lab" id="score-lab"><header class="sl-header"><span class="overline">SCORE STUDY / 一音ずつ、理由を読む</span><h2>${esc(ch.title)}</h2><p class="sl-question">${esc(ch.question)}</p><p>ここでは原盤の印象評ではなく、条件を固定した創作譜例で仕組みを検証する。音符・音名表・再生は同じデータから生成している。</p></header>
 <div class="sl-reading"><h3>まず、何を比較するのか</h3>${ch.principles.map(p=>`<p>${esc(p)}</p>`).join('')}</div>
 <aside class="sl-hands"><strong>ピアノの分担</strong><p>${esc(ch.hands)}</p><p class="sl-small">C4＝中央ド。上段は鍵盤の実音、下段のベース五線は通常のベース譜に合わせ1oct高く記譜。低音をアプリに任せ、上声を両手に分けてもよい。</p></aside>
 <div class="sl-reading-order"><span>① 全体を聴く</span><span>② 上声／低音を分離</span><span>③ 表と解説を照合</span><span>④ 実機で再現</span></div>
 <div class="sl-cards">${ch.scores.map(card).join('')}</div>
 <section class="sl-analysis"><h3>この拍で、何が起きているか</h3>${ch.walk.map((w,i)=>`<article><span>${String(i+1).padStart(2,'0')} · ${esc(w.where)}</span><h4>${esc(w.sound)}</h4><p>${esc(w.reason)}</p></article>`).join('')}</section>
 <section class="sl-practice"><h3>譜例から、自分の演奏へ</h3><ol>${ch.practice.map(p=>`<li>${esc(p)}</li>`).join('')}</ol><p><strong>確認すること：</strong>${esc(ch.check)}</p></section>
 <aside class="sl-caution"><strong>ここを取り違えない</strong><p>${esc(ch.caution)}</p></aside>
 ${(scoreSources[ch.source]||[]).map(r=>`<p class="sl-source"><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)} ↗</a><br>${esc(r.scope)}</p>`).join('')}
 <p class="sl-small">音符記号はNoto Music由来のSVGアウトライン（SIL OFL 1.1）。音色はブラウザ内の教材用合成音で、原盤や実機ピアノではない。保存データや従来の練習チェックは変更しない。</p></section>`;}
function mount(){
 const parts=location.hash.replace(/^#\/?/,'').split('/');
 if(parts[0]!=='lesson'){player.stop();return;}
 const id=scoreBook[parts[1]]?parts[1]:'01',hero=app.querySelector('.hero');
 if(!hero||app.querySelector('#score-lab'))return;
 const holder=document.createElement('div');holder.innerHTML=markup(scoreBook[id]);const target=app.querySelector('#score-slot');if(target)target.replaceChildren(holder.firstElementChild);else hero.after(holder.firstElementChild);
}
player.onTick=info=>{
 if(!currentCard)return;
 const activeBar=Math.floor(info.beat/4),label=currentCard.querySelector('.sl-status');
 // A readable live status, without flooding screen readers every animation frame.
 const message=info.beat<0?`カウント ${Math.max(1,Math.ceil(info.beat+4))} / 4`:`${info.cycle+1}周目 · ${activeBar+1}小節 ${Math.floor(info.beat%4)+1}拍目 · ${Math.round(info.bpm)} BPM`;
 if(label.textContent!==message)label.textContent=message;
 currentCard.querySelectorAll('[data-measure]').forEach(g=>g.querySelector('rect').setAttribute('opacity',info.beat>=0&&+g.dataset.measure===activeBar?'.28':'0'));
};
player.onStop=()=>{if(currentCard){currentCard.querySelectorAll('.sl-bar-highlight').forEach(x=>x.setAttribute('opacity','0'));const s=currentCard.querySelector('.sl-status');if(s)s.textContent='停止。比較したい声部を選んで再生できます。';}currentCard=null;};
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-sl-play]');
 if(b){
  const score=findScore(b.dataset.slPlay),c=b.closest('[data-score-card]');if(!score||!c)return;
  player.stop();currentCard=c;
  try{
   // play() stops its previous context; restore the UI pointer after that synchronous step.
   const promise=player.play(score,{mode:b.dataset.part,speed:+c.querySelector('[data-sl-speed]').value,repeat:+c.querySelector('[data-sl-repeat]').value,countIn:c.querySelector('[data-sl-count]').checked});
   currentCard=c;await promise;
  }catch(err){currentCard=c;c.querySelector('.sl-status').textContent=err.message;}
  return;
 }
 if(e.target.closest('[data-sl-stop]')){player.stop();return;}
 const download=e.target.closest('[data-sl-svg]');
 if(download){
  const score=findScore(download.dataset.slSvg),blob=new Blob([renderScore(score)],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`after-parker-${score.id}.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);return;
 }
 if(!e.target.closest('.score-lab')&&e.target.closest('[data-play],[data-play-practice],[data-play-ear],[data-key-note],[data-preset-bass],[data-preset-11],[data-stop],[data-view],[data-ear-id]'))player.stop();
});
window.addEventListener('hashchange',()=>{player.stop();queueMicrotask(mount);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)player.stop();});
new MutationObserver(m=>{if(m.some(x=>x.target===app))mount();}).observe(app,{childList:true});
mount();
