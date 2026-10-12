import {theoryA} from './theory-a.js';
import {theoryB} from './theory-b.js';
import {catalog} from './knowledge-memory.js';
import {nextRecallCard,recallStats} from './knowledge-memory.js';
export const theoryAtlas={...theoryA,...theoryB};
export function theoryMarkup(l,deep,adaptiveHtml,esc){
 const t=theoryAtlas[l.id],history=deep?.context||[];
 if(!t)return '';
 const concepts=t.concepts.map(([name,body],i)=>`<article class="atlas-concept"><span class="atlas-concept-n">0${i+1}</span><div><h3>${esc(name)}</h3><p>${esc(body)}</p></div></article>`).join('');
 const formulas=t.formulas.map((f,i)=>`<article class="atlas-formula"><div class="atlas-formula-top"><span>VOICE-LEADING STUDY ${String(i+1).padStart(2,'0')}</span><strong>${esc(f.label)}</strong></div><p class="atlas-formula-notes">${esc(f.notes)}</p><p>${esc(f.why)}</p></article>`).join('');
 return `<div class="atlas-reading"><div class="atlas-heading"><span class="overline">THEORY / 構造を理解する</span><h2>${esc(t.title)}</h2><p class="atlas-essential">まず答えたい問い：${esc(t.question)}</p></div>
 ${adaptiveHtml}
 <section class="atlas-section"><div class="atlas-section-head"><span class="overline">01 — PRINCIPLES</span><h2>3つの原理を、正確な言葉で。</h2></div><div class="atlas-concepts">${concepts}</div></section>
 <section class="atlas-section"><div class="atlas-section-head"><span class="overline">02 — WHAT ACTUALLY SOUNDS</span><h2>コードと音名から説明する。</h2><p>原曲のコピー譜ではなく、原理を抽出するための学習用音列。</p></div><div class="atlas-formulas">${formulas}</div></section>
 <section class="atlas-section atlas-contrast"><span class="overline">03 — COMMON TRAP</span><h2>ありがちな誤解</h2><p>${esc(t.counter)}</p></section>
 <section class="atlas-section atlas-mini-lab"><span class="overline">04 — TEST IT ON YOUR BASS</span><h2>耳と指への橋渡し</h2><p>${esc(t.practice)}</p><button class="atlas-jump" data-lesson-tab="score">→ 五線譜と音声で確かめる</button></section>
 <section class="atlas-section atlas-history"><span class="overline">05 — CONTEXT / その理論が生まれた現場</span>${history.map(x=>`<p>${esc(x)}</p>`).join('')}<div class="atlas-vocab">${t.terms.map(x=>`<span>${esc(x)}</span>`).join('')}</div></section>
 </div>`;
}

export function listeningMarkup(l,deep,esc){
 const points=deep?.listenMap||l.listen||[];
 return `<div class="atlas-listening"><header class="atlas-heading"><span class="overline">LISTEN / 譜例と音源で検証</span><h2>理論を、本当に聴き取れるか。</h2><p>五線譜は学習用の創作例。まず原盤を聴き、その後に分離再生で『何を変えたか』を確かめる。</p></header>
 <section class="atlas-recording-primary"><span class="overline">MASTER RECORDING</span><h3>${esc(l.album)}</h3><p>${esc(l.artist)}</p>${l.videoId?`<button class="recording-link" data-embed-video="${l.videoId}">▷ 確認済み音源をページ内で再生</button><div id="embedded-video" class="embedded-video"></div>`:''}<a class="atlas-jump" href="https://www.youtube.com/results?search_query=${encodeURIComponent(l.query)}" target="_blank" rel="noopener noreferrer">原盤を検索して聴く ↗</a>
 <ol class="atlas-listening-map">${points.map((p,i)=>`<li><span>${i+1}</span>${esc(p)}</li>`).join('')}</ol></section>
 <div id="score-slot" class="atlas-score-slot"><p>五線譜を準備しています…</p></div>
 </div>`;
}

export function knowledgePanelMarkup(l,state,esc,reveal=false){
 const ch=catalog[l.id];if(!ch)return '';
 const current=nextRecallCard(state,l.id),stats=recallStats(state,l.id);
 const quiz=current?`<div class="knowledge-recall"><div class="knowledge-recall-title"><span class="overline">ACTIVE RECALL / 記憶の定着</span><span class="atlas-pill">${stats.total-stats.due} / ${stats.total} 本日確認済</span></div>
 <h3>${current.kind==='person'?'誰のことだろう？':'この名盤のタイトルは？'}</h3>
 <p class="knowledge-prompt">${current.kind==='person'?`${esc(current.item.role)}。${esc(current.item.identity)}`:`${current.item.year}年・${esc(current.item.label)}・${esc(current.item.leader)}。${esc(current.item.focus)}`}</p>
 ${reveal?`<div class="knowledge-reveal"><span>ANSWER</span><h3>${esc(current.kind==='person'?current.item.name:current.item.title)}</h3><p>${esc(current.kind==='person'?current.item.connect:current.item.memory)}</p></div>
 <div class="knowledge-grade"><button data-knowledge-grade="${current.id}:yes">思い出せた</button><button data-knowledge-grade="${current.id}:again" class="quiet">まだ曖昧</button></div>`:`<button class="knowledge-reveal-button" data-knowledge-reveal="${current.id}">答えを思い出してから開く →</button>`}
 <small>覚えられたカードは1・3・7・14・30日後に再登場。理解度の自己評価で、実測の記憶強度ではありません。</small></div>`:`<div class="knowledge-recall all-clear"><span class="overline">ACTIVE RECALL</span><h3>この章のカードを今日の分まで確認した。</h3><p>${stats.attempted} / ${stats.total}カードに挑戦済み。忘れかけた頃にまた出会おう。</p></div>`;
 const players=ch.people.map((p,i)=>`<article class="atlas-person"><div class="atlas-person-index">${String(i+1).padStart(2,'0')}</div><div><h3>${esc(p.name)}</h3><div class="atlas-meta">${esc(p.role)}</div><p>${esc(p.identity)}</p><p><b>人脈で覚える：</b>${esc(p.connect)}</p><p class="atlas-ear-note"><b>耳で識別：</b>${esc(p.ear)}</p></div></article>`).join('');
 const albums=ch.albums.map((a,i)=>`<article class="atlas-album"><div class="atlas-album-top"><span class="atlas-album-number">0${i+1}</span><span class="atlas-year">${esc(a.year)} · ${esc(a.label)}</span></div><h3>${esc(a.title)}</h3><div class="atlas-meta">${esc(a.leader)}</div><p class="atlas-lineup"><b>参加者（抜粋）：</b>${esc(a.players)}</p><p><b>聴くポイント：</b>${esc(a.focus)}</p><p class="atlas-memory-hook"><b>覚え方：</b>${esc(a.memory)}</p><a class="atlas-album-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(a.leader+' '+a.title+' album')}" target="_blank" rel="noopener noreferrer">このアルバムを聴く ↗</a></article>`).join('');
 return `<div class="atlas-people"><header class="atlas-heading"><span class="overline">PERSONNEL / LABELS / RECORDINGS</span><h2>人脈ごと覚える、ジャズの名盤。</h2><p>単なる人名リストではなく「誰が誰と録ったか」「その盤を音で識別できるか」を覚える。年は原則として初出の発売年。録音年とは区別する。</p></header>
 ${quiz}
 <section class="atlas-section"><div class="atlas-section-head"><span class="overline">01 — THE PLAYERS</span><h2>4人のキーパーソン</h2></div><div class="atlas-person-list">${players}</div></section>
 <section class="atlas-section"><div class="atlas-section-head"><span class="overline">02 — DEEP CATALOGUE</span><h2>覚えたい4枚のアルバム</h2></div><div class="atlas-albums">${albums}</div></section>
 <section class="atlas-section atlas-source-section"><span class="overline">03 — RECORDING CREDITS / 出典</span><p>ラインナップは抜粋で、同一アルバム内に異なるセッションがある場合は曲別確認が必要。</p>${ch.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</section>
 </div>`;
}

export function archiveResultsMarkup(kind,query,esc){
 const q=String(query||'').trim().toLowerCase();
 const items=Object.entries(catalog).flatMap(([id,ch])=>kind==='people'?ch.people.map(x=>({id,item:x,kind:'person'})):ch.albums.map(x=>({id,item:x,kind:'album'})));
 const filtered=items.filter(({id,item})=>(id+' '+Object.values(item).join(' ')).toLowerCase().includes(q));
 const results=filtered.map(({id,item,kind})=>kind==='person'?
 `<a href="#/lesson/${id}/people" class="archive-result"><span class="archive-index">${id} / PLAYER</span><strong>${esc(item.name)}</strong><small>${esc(item.role)} — ${esc(item.identity)}</small><span class="archive-open">第${id}章へ ↗</span></a>`:
 `<a href="#/lesson/${id}/people" class="archive-result"><span class="archive-index">${esc(item.year)} · ${esc(item.label)}</span><strong>${esc(item.title)}</strong><small>${esc(item.leader)} — ${esc(item.memory)}</small><span class="archive-open">第${id}章へ ↗</span></a>`).join('');
 return `<p class="archive-count">${filtered.length}件 / ${items.length}件表示。名前・レーベル・年・楽器・参加者から検索。</p><div class="archive-results">${results||'<p>該当する人物・アルバムはありません。</p>'}</div>`;
}

export function archivePageMarkup(kind,query,esc,completed=0){
 const people=Object.values(catalog).reduce((n,x)=>n+x.people.length,0),albums=Object.values(catalog).reduce((n,x)=>n+x.albums.length,0);
 return `<div class="atlas-archive"><header class="hero compact"><span class="overline">PERSONNEL & ALBUM ENCYCLOPEDIA</span><h1>名前を、録音と一緒に覚える。</h1><p class="hero-intro">${people}人の奏者・制作者と${albums}枚のアルバム。録音の背景と関連するミュージシャンを追う、横断検索できるジャズ事典。</p></header>
 <div class="archive-controls"><div class="archive-switch"><button data-archive-kind="albums" class="${kind==='albums'?'active':''}">アルバム ${albums}</button><button data-archive-kind="people" class="${kind==='people'?'active':''}">人物 ${people}</button></div><label class="archive-search"><span>検索</span><input id="archive-search" type="search" value="${esc(query)}" placeholder="例：Paul Chambers、ECM、1959、ベース"></label></div>
 <div id="archive-items">${archiveResultsMarkup(kind,query,esc)}</div>
 <div class="archive-footer"><h2>学習データ・バックアップ</h2><p>${completed}/14レッスン完了。進捗・メモをJSON保存できる。GitHubへの非公開同期は学習ログから。</p><div class="backup-actions"><button class="plain-button" data-export>進捗とメモをJSON保存</button><label class="file-button">JSONを読み込む<input id="import-progress" type="file" accept=".json,application/json" hidden></label><button class="plain-button danger" data-reset>すべてリセット</button><a href="#/journal">GitHub学習ログ ↗</a></div></div>
 </div>`;
}
