import {lessons,earDrills} from './data.js';
import {StudyAudio,noteToMidi} from './audio.js';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORE='after-parker-v1';
function load(){try{const p=JSON.parse(localStorage.getItem(STORE));if(p && typeof p==='object')return p}catch{}return {}};
let state={completed:{},notes:{},ear:{},pianoMode:'app',startOctave:3,...load()};
const audio=new StudyAudio();
let currentView='lesson';let currentId='01';let selectedEarId=earDrills[0].id;
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){console.warn('Storage unavailable',e)}}
function progressUpdate(){const done=lessons.filter(l=>state.completed[l.id]).length;const percent=Math.round(done/lessons.length*100);$('progress-summary').textContent=`${done} / ${lessons.length} 完了`;$('progress-percent').textContent=`${percent}%`;$('progress-bar').style.width=percent+'%';}
function urlFor(l){return `https://www.youtube.com/results?search_query=${encodeURIComponent(l.query)}`;}
function sections(title,body){return `<section class="prose-section"><div class="section-label">${title}</div><p>${esc(body)}</p></section>`}
function toHtmlList(items){return items.map((t,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(t)}</p></li>`).join('')}
function tags(l){return `<span class="chip">${esc(l.era)}</span><span class="chip">${esc(l.tag)}</span><span class="chip subtle">${esc(l.minutes)} min</span>`}
function renderMenu(){
 const q=$('lesson-search').value.trim().toLocaleLowerCase();
 $('lesson-menu').innerHTML=lessons.filter(l=>(`${l.title} ${l.artist} ${l.era} ${l.tag} ${l.subtitle}`).toLocaleLowerCase().includes(q)).map(l=>`<a href="#/lesson/${l.id}" class="lesson-link ${currentView==='lesson'&&currentId===l.id?'selected':''}"><span class="lesson-no">${l.id}</span><span class="lesson-caption"><strong>${esc(l.title)}</strong><small>${esc(l.artist.split('/')[0].trim())} · ${l.era}</small></span><span class="done-mark">${state.completed[l.id]?'✓':''}</span></a>`).join('')||'<p class="muted small">該当なし</p>';
 progressUpdate();
}
function renderLesson(){
 const l=lessons.find(x=>x.id===currentId)||lessons[0];currentId=l.id;
 const i=lessons.indexOf(l),prev=lessons[i-1],next=lessons[i+1];
 const ex=l.examples.map((e,j)=>`<div class="sound-example"><div class="sound-copy"><span class="number-label">STUDY ${String(j+1).padStart(2,'0')}</span><strong>${esc(e.label)}</strong><p>${esc(e.description)}</p>${state.pianoMode==='real'?`<p class="piano-notes">実機演奏：${esc(formatSpec(e))}</p>`:''}</div><button class="play-button" data-play="${l.id}:${j}"><span aria-hidden="true">▶</span> 音を鳴らす</button></div>`).join('');
 const sources=l.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('');
 const checked=!!state.completed[l.id];
 $('app').innerHTML=`
 <div class="hero"><div class="hero-top"><span class="overline">LESSON ${l.id} / ${String(lessons.length).padStart(2,'0')} · ${esc(l.priority)}</span><div class="hero-chips">${tags(l)}</div></div><h1>${esc(l.title)}</h1><p class="hero-sub">${esc(l.subtitle)}</p><p class="hero-intro">${esc(l.premise)}</p></div>
 <div class="lesson-grid"><div class="article">
 ${sections('01 — 背景とジャズ史',l.history)}
 ${sections('02 — 理論を耳に結びつける',l.theory)}
 <section class="prose-section listen-section"><div class="section-label">03 — この録音を聴く</div><h2>${esc(l.album)}</h2><p class="artist">${esc(l.artist)}</p>${l.videoId?`<div class="verified-video"><button class="recording-link" data-embed-video="${l.videoId}" aria-label="${esc(l.album)} の公式YouTube録音をページ内で再生">▷ このページで公式録音を再生</button><div id="embedded-video" class="embedded-video"></div></div>`:""}<a class="recording-alt" href="${esc(urlFor(l))}" target="_blank" rel="noopener noreferrer">YouTubeで対象録音を探す ↗</a><p class="micro">${l.videoId?"確認済みの公式アーティストチャンネルの音源を使用。埋め込みが制限される場合は外部検索から。":"対象録音に対応した検索結果を新しいタブで開きます。権利者の音源が見つかった場合はそちらで聴いてください。"}</p><ol class="listening-points">${toHtmlList(l.listen)}</ol></section>
 <section class="prose-section sound-section"><div class="section-label">04 — 音で確かめる</div><h2>音符を読まずに、まず聴く。</h2><p class="micro">音はアプリ内のピアノ風シンセが生成する教材用モデルで、原曲の録音や採譜の再現ではありません。音量を小さめにして開始。</p><div class="mode-switch"><button data-mode="app" class="mode-btn ${state.pianoMode==='app'?'active':''}">アプリで鳴らす</button><button data-mode="real" class="mode-btn ${state.pianoMode==='real'?'active':''}">手元のピアノで試す</button></div><p id="piano-hint" class="hint">${state.pianoMode==='real'?'各音名を見ながら実機で再現。再生ボタンでも参考音を確認できます。':'再生ボタンから発音。聴き比べたら手元の楽器で再現してみて。'}</p>${ex}<button class="stop-button" data-stop>■ 停止</button></section>
 <section class="prose-section"><div class="section-label">05 — ベースで試す</div><div class="practice-box"><span class="smallcaps">PLAYING ASSIGNMENT</span><p>${esc(l.practice)}</p></div></section>
 <section class="prose-section"><div class="section-label">06 — ちょっとした話</div><p class="insider">${esc(l.insider)}</p></section>
 <section class="prose-section"><div class="section-label">07 — 知識の確認</div><h2>${esc(l.quiz.q)}</h2><div class="quiz-options">${l.quiz.options.map((o,j)=>`<button class="quiz-option" data-lesson-answer="${j}" ${state['quiz-'+l.id]!==undefined?'disabled':''}>${String.fromCharCode(65+j)}. ${esc(o)}</button>`).join('')}</div><div id="quiz-feedback" class="feedback ${state['quiz-'+l.id]===undefined?'hidden':''}">${state['quiz-'+l.id]===undefined?'':(state['quiz-'+l.id]===l.quiz.answer?'✓ 正解。':'別の角度で考えてみよう。')+' '+esc(l.quiz.why)}</div></section>
 <section class="prose-section"><div class="section-label">08 — 自分のメモ</div><textarea id="lesson-note" rows="5" placeholder="耳に残った音、試した運指、引っかかった理論……">${esc(state.notes[l.id]||'')}</textarea><p class="micro">自動保存（この端末内）。ほかの端末への同期はありません。</p><button class="complete-button ${checked?'done':''}" data-complete="${l.id}">${checked?'✓ 完了済み — 未完了に戻す':'このレッスンを完了にする →'}</button></section>
 <div class="next-row">${prev?`<a href="#/lesson/${prev.id}">← ${esc(prev.title)}</a>`:'<span></span>'}${next?`<a href="#/lesson/${next.id}">${esc(next.title)} →</a>`:'<a href="#/ear">耳トレに進む →</a>'}</div>
 </div><aside class="context-panel"><div class="context-card"><span class="overline">IN THIS SESSION</span><h3>今日の聴き方</h3><p>まず録音を聴く。次に短い教材音を再生。最後にベースかピアノで「音が違って聴こえる理由」を検証する。</p><div class="divider"></div><strong>基準は知識でなく耳</strong><p>理論上は同じスケールでも、下に置く音や発音タイミングで印象が変わる。</p></div><div class="context-card"><span class="overline">SOURCE NOTES</span><div class="source-list">${sources}</div><p class="micro">録音年・音楽家・制作情報は一次情報との照合を推奨。参考リンクは各権利者・組織の公開資料。</p></div></aside></div>`;
 const prior=state['quiz-'+l.id];if(prior!==undefined)markQuiz(l,prior);
 document.title=`${l.title} — AFTER PARKER`;
}
function markQuiz(l,guess){
 document.querySelectorAll('[data-lesson-answer]').forEach(b=>{const ans=Number(b.dataset.lessonAnswer);b.disabled=true;if(ans===l.quiz.answer)b.classList.add('correct');else if(ans===guess)b.classList.add('incorrect')});
}
function renderEar(){
 const answered=earDrills.filter(e=>state.ear[e.id]).length;
 $('app').innerHTML=`<div class="hero compact"><span class="overline">EAR TRAINING / 10 DRILLS</span><h1>和声を、耳で答える。</h1><p class="hero-intro">音を聴く前にコード名は表示しない。ピアノを使えるときは、回答後に実機でも同じ音を再現しよう。</p><p class="micro">${answered} / ${earDrills.length} トライ済み。音源はアプリ内合成音。音量に注意。</p></div><div class="ear-layout"><div class="ear-list">${earDrills.map(e=>`<button class="ear-select ${selectedEarId===e.id?'selected':''}" data-ear-id="${e.id}"><span class="ear-id">${esc(e.id.toUpperCase())}</span><span><strong>${esc(e.title)}</strong><small>Level ${e.level} ${state.ear[e.id]?'· 回答済':''}</small></span></button>`).join('')}</div><div class="ear-detail" id="ear-detail"></div></div>`;
 renderEarDetail();document.title='耳トレ — AFTER PARKER';
}
function renderEarDetail(){
 const d=earDrills.find(e=>e.id===selectedEarId)||earDrills[0];const guess=state.ear[d.id];
 $('ear-detail').innerHTML=`<div class="section-label">LISTEN / COMPARE / ANSWER</div><span class="smallcaps">${esc(d.title)} · Level ${d.level}</span><h2>${esc(d.question)}</h2><div class="ab-grid"><button class="ab-play" data-play-ear="${d.id}:A"><span class="ab-letter">A</span><span>▶ 再生</span></button><button class="ab-play" data-play-ear="${d.id}:B"><span class="ab-letter">B</span><span>▶ 再生</span></button></div><p class="micro">両方を何度でも聴き比べてから回答。端末スピーカーよりイヤホン推奨。</p><div class="answer-row"><button class="answer-choice ${guess==='A'?(d.correct==='A'?'correct':'incorrect'):''}" data-answer-ear="${d.id}:A">A と答える</button><button class="answer-choice ${guess==='B'?(d.correct==='B'?'correct':'incorrect'):''}" data-answer-ear="${d.id}:B">B と答える</button></div><div class="ear-reveal ${guess?'':'hidden'}"><span class="smallcaps">ANSWER / THEORY / PIANO</span><h3>${guess===d.correct?'正解！':'もう一度聴くとわかるはず。'} 正答は${d.correct}</h3><p>${esc(d.explanation)}</p><p class="piano-instruction"><strong>実機ピアノ：</strong>${esc(d.piano)}</p><div class="revealed-pitches"><p>A : ${formatSpec(d.a)}</p><p>B : ${formatSpec(d.b)}</p></div><button class="plain-button" data-clear-ear="${d.id}">回答をリセットして再挑戦</button></div></div>`;
}
function formatSpec(s){if(s.sequence)return s.sequence.map(x=>`${x.bass||''} [${(x.notes||[]).join(' ')}]`).join(' → ');return `${s.bass||''} [${(s.notes||[]).join(' ')}]`}
function pianoKeyboard(octave=3){
 const naturals=['C','D','E','F','G','A','B'];
 let white='',black='';
 for(let i=0;i<15;i++){
  const name=naturals[i%7],oct=octave+Math.floor(i/7),note=name+oct;
  white+=`<button type="button" class="key white" data-key-note="${note}" aria-label="${note}"><span>${note}</span></button>`;
  if(i<14 && ['C','D','F','G','A'].includes(name)){
   const left=(i+1)/15*100;const blackNote=(name==='E'||name==='B')?'':(name+'#'+oct);
   black+=`<button type="button" class="key black" data-key-note="${blackNote}" aria-label="${blackNote}" style="left:calc(${left}% - 1.65%)"><span>${blackNote}</span></button>`;
  }
 }
 return `<div class="piano-scroll"><div class="piano" role="group" aria-label="タップして鳴らせる2オクターブの鍵盤"><div class="white-keys">${white}</div>${black}</div></div>`;
}
function renderKeyboard(){
 $('app').innerHTML=`<div class="hero compact"><span class="overline">PIANO / THEORY / BASS</span><h1>鍵盤で音を確かめる。</h1><p class="hero-intro">手元のピアノがなければ、画面の鍵盤をタップ。単音を鳴らした後、教材の和音を再生して、その音が何度として機能するかを聴こう。</p></div><section class="prose-section"><div class="section-label">FREE PLAY</div><div class="keyboard-controls"><label for="octave-selector">開始オクターブ</label><select id="octave-selector"><option value="2" ${state.startOctave===2?'selected':''}>C2から</option><option value="3" ${state.startOctave===3?'selected':''}>C3から</option><option value="4" ${state.startOctave===4?'selected':''}>C4から</option></select><button class="plain-button" data-stop>■ 消音</button></div>${pianoKeyboard(state.startOctave)}<p class="micro">実機を使える場合は、同じ音名をピアノで弾いてください。音声入力による採点はありません。スマホではアプリ内のピアノ風シンセを再生できます。</p></section><section class="prose-section"><div class="section-label">HARMONIC REFRAMING</div><h2>固定した上声 × 動くベース</h2><p>右手は E–A–D–G–B。低音をD/C/Fに変えるだけで機能が変わる。まず音を聴き、次に各音の度数を言おう。</p><div class="keyboard-chords"><button data-preset-bass="D2">▶ Bass D</button><button data-preset-bass="C2">▶ Bass C</button><button data-preset-bass="F2">▶ Bass F</button></div><h2>自然11 / #11 の違い</h2><p>Fを低音に固定し、Aとの関係がB♭とBでどう変化するか。</p><div class="keyboard-chords"><button data-preset-11="Bb4">▶ 11th (B♭)</button><button data-preset-11="B4">▶ #11th (B)</button></div></section><section class="prose-section"><div class="section-label">MIDI / EXTERNAL PIANO</div><p>アコースティックピアノは課題に記載された音名を見て演奏。USB MIDI入力・マイク認識による自動採点は現バージョンでは非対応です。</p></section>`;
 document.title='鍵盤 — AFTER PARKER';
}
function renderIndex(){
 const glossary=[['Guide tones','コードの3度と7度など、和声機能を明示しやすい音。'],['Upper structure','ベースや基本和音の上側で響く構造。上部構造三和音はその特殊な場合。'],['Avoid note','安定した保持音としては扱いに注意が必要な音。絶対的な禁則ではない。'],['Lydian','メジャースケールの4度が#4になったモード。#11はその特徴音。'],['Cross-rhythm','共通の基準パルスに対する異なる周期やアクセントの関係。'],['Microtiming','基準となるグリッドからの発音位置の小さな偏差。'],['Modal jazz','固定的なコードチェンジよりモードや調性領域を土台とする即興。'],['Harmolodics','オーネット・コールマンの音楽思想。旋律・和声・リズムの関係を再考する。'],['M-Base','構造化された即興を通じた創造的実践の総称。変拍子のジャンル名ではない。'],['Tumbao','アフロ・キューバン音楽で用いられる反復的なリズムパターン。ベースの先取りも重要。']];
 const achieved=lessons.filter(l=>state.completed[l.id]).length;
 $('app').innerHTML=`<div class="hero compact"><span class="overline">INDEX / REFERENCE / BACKUP</span><h1>人・年・概念から横断する。</h1><p class="hero-intro">年代順に眺めると、発展は一本道でないことが見えてくる。教材の進捗とメモは自分の端末に保存。</p></div><section class="prose-section"><div class="section-label">COURSE INDEX</div><div class="index-grid">${lessons.map(l=>`<a class="index-card" href="#/lesson/${l.id}"><span class="overline">${l.era} · ${l.tag}</span><strong>${l.id} ${esc(l.title)}</strong><small>${esc(l.artist)}</small></a>`).join('')}</div></section><section class="prose-section"><div class="section-label">GLOSSARY / TERMS</div><div class="glossary">${glossary.map(([word,def])=>`<div><strong>${esc(word)}</strong><p>${esc(def)}</p></div>`).join('')}</div></section><section class="prose-section"><div class="section-label">PROGRESS & BACKUP</div><h2>${achieved} / ${lessons.length} レッスン完了</h2><p>端末を変える場合はJSONを書き出して、新端末で復元できます。自動同期はありません。</p><div class="backup-actions"><button class="plain-button" data-export>進捗・メモをJSON保存</button><label class="file-button">JSONを読み込んで復元<input id="import-progress" type="file" accept=".json,application/json" hidden></label><button class="plain-button danger" data-reset>すべてリセット</button></div></section>`;
 document.title='索引 — AFTER PARKER';
}
function route(){
 const parts=location.hash.replace(/^#\/?/,'').split('/');currentView=['lesson','ear','keyboard','index'].includes(parts[0])?parts[0]:'lesson';
 if(currentView==='lesson')currentId=lessons.some(l=>l.id===parts[1])?parts[1]:'01';
 audio.stop();
 document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===currentView));
 if(currentView==='lesson')renderLesson();else if(currentView==='ear')renderEar();else if(currentView==='keyboard')renderKeyboard();else renderIndex();
 renderMenu();window.scrollTo({top:0,behavior:'instant'});
}
function toast(msg){let el=$('toast');if(!el){el=document.createElement('div');el.id='toast';el.setAttribute('role','status');document.body.appendChild(el)}el.textContent=msg;el.classList.add('visible');clearTimeout(toast.handle);toast.handle=setTimeout(()=>el.classList.remove('visible'),2900)}
async function safePlay(task){try{await task();toast('再生中。音量に注意して聴いてみて。')}catch(err){toast(err.message||'音声を再生できませんでした')}}
$('lesson-search').addEventListener('input',renderMenu);
window.addEventListener('hashchange',route);
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-view]');if(nav){location.hash=`/${nav.dataset.view}`;return}
 const video=e.target.closest('[data-embed-video]');if(video){const id=video.dataset.embedVideo;if(!/^[\w-]{11}$/.test(id))return;const target=$('embedded-video');if(target){target.innerHTML=`<iframe title="公式アーティストのYouTube音源" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube-nocookie.com/embed/${id}?rel=0"></iframe>`;video.textContent='▶ プレーヤーを開きました';video.disabled=true}return}
 const stop=e.target.closest('[data-stop]');if(stop){audio.stop();toast('停止しました');return}
 const play=e.target.closest('[data-play]');if(play){const [id,index]=play.dataset.play.split(':');const l=lessons.find(l=>l.id===id);if(l?.examples[Number(index)])safePlay(()=>audio.playSequence(l.examples[Number(index)]));return}
 const mode=e.target.closest('[data-mode]');if(mode){state.pianoMode=mode.dataset.mode;save();renderLesson();return}
 const c=e.target.closest('[data-complete]');if(c){const id=c.dataset.complete;state.completed[id]=!state.completed[id];save();renderLesson();renderMenu();toast(state.completed[id]?'レッスンを完了にしました':'未完了に戻しました');return}
 const q=e.target.closest('[data-lesson-answer]');if(q){const l=lessons.find(l=>l.id===currentId);if(!l)return;const ans=Number(q.dataset.lessonAnswer);state['quiz-'+l.id]=ans;save();markQuiz(l,ans);$('quiz-feedback').textContent=(ans===l.quiz.answer?'✓ 正解。':'✦ 復習してみよう。')+l.quiz.why;$('quiz-feedback').classList.remove('hidden');return}
 const select=e.target.closest('[data-ear-id]');if(select){selectedEarId=select.dataset.earId;renderEar();return}
 const pear=e.target.closest('[data-play-ear]');if(pear){const [id,p]=pear.dataset.playEar.split(':');const d=earDrills.find(d=>d.id===id);const spec=d?.[p.toLowerCase()];if(spec)safePlay(()=>spec.sequence?audio.playSequence({...spec,bpm:75}):audio.playChord(spec));return}
 const ans=e.target.closest('[data-answer-ear]');if(ans){const [id,choice]=ans.dataset.answerEar.split(':');state.ear[id]=choice;save();renderEar();return}
 const clear=e.target.closest('[data-clear-ear]');if(clear){delete state.ear[clear.dataset.clearEar];save();renderEar();return}
 const key=e.target.closest('[data-key-note]');if(key){safePlay(()=>audio.playNote(key.dataset.keyNote));return}
 const pb=e.target.closest('[data-preset-bass]');if(pb){safePlay(()=>audio.playChord({bass:pb.dataset.presetBass,notes:['E3','A3','D4','G4','B4']}));return}
 const p11=e.target.closest('[data-preset-11]');if(p11){safePlay(()=>audio.playChord({bass:'F2',notes:['A3','E4',p11.dataset.preset11,'D4']}));return}
 const exportBtn=e.target.closest('[data-export]');if(exportBtn){const blob=new Blob([JSON.stringify({format:'after-parker-v1',savedAt:new Date().toISOString(),data:state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='after-parker-progress.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('JSONを書き出しました');return}
 const reset=e.target.closest('[data-reset]');if(reset){if(confirm('全レッスンの完了状況、メモ、耳トレの回答を削除しますか？')){state={completed:{},notes:{},ear:{},pianoMode:'app',startOctave:3};save();route();toast('端末内の学習履歴をリセットしました')}return}
});
document.addEventListener('change',async e=>{
 if(e.target.id==='octave-selector'){state.startOctave=Number(e.target.value);save();renderKeyboard();return}
 if(e.target.id==='import-progress'){
   try{const f=e.target.files?.[0];if(!f)return;if(f.size>1024*1024)throw new Error('ファイルが大きすぎます');const data=JSON.parse(await f.text());if(data.format!=='after-parker-v1'||typeof data.data!=='object'||data.data===null)throw new Error('未対応のJSON形式');
     const p=data.data;const ids=new Set(lessons.map(l=>l.id));const ears=new Set(earDrills.map(d=>d.id));
     state={completed:Object.fromEntries(Object.entries(p.completed||{}).filter(([k,v])=>ids.has(k)&&typeof v==='boolean')),notes:Object.fromEntries(Object.entries(p.notes||{}).filter(([k,v])=>ids.has(k)&&typeof v==='string').map(([k,v])=>[k,v.slice(0,50000)])),ear:Object.fromEntries(Object.entries(p.ear||{}).filter(([k,v])=>ears.has(k)&&['A','B'].includes(v))),pianoMode:['app','real'].includes(p.pianoMode)?p.pianoMode:'app',startOctave:[2,3,4].includes(p.startOctave)?p.startOctave:3};
     for(const l of lessons){if([0,1,2].includes(p['quiz-'+l.id]))state['quiz-'+l.id]=p['quiz-'+l.id]}
     save();route();toast('復元できました');
   }catch(err){toast('復元できません：'+err.message)}
 }
});
document.addEventListener('input',e=>{if(e.target.id==='lesson-note'){state.notes[currentId]=e.target.value;save()}});
if(!location.hash)location.hash='/lesson/01';route();
