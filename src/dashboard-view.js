import {reviewForDashboard} from './dashboard.js';
const pct=(a,b)=>Math.round(100*Math.min(1,Math.max(0,a/Math.max(1,b))));
const pad=n=>String(n).padStart(2,'0');
export function homeMarkup(s,state,esc,reveal=false){
 const lesson=s.next;
 const review=reviewForDashboard(s),reviewLesson=review?.lesson;
 const total=14,ratio=pct(s.completed,total);
 const plan=[5,15,25].includes(state.homeMinutes)?state.homeMinutes:5;
 const headline=s.totalEvents===0?'次の1音から、深くなる。':s.active===0?'今日の5分から、また始めよう。':'積み上げた音を、次の発見へ。';
 const activity=s.week.map((d,i)=>`<div class="heat-day" title="${esc(d.day)}：${d.count}件の学習操作"><span class="heat-cell ${d.count?'active':''}" style="--heat:${Math.min(d.count,5)}"></span><small>${esc(d.weekday)}</small></div>`).join('');
 const badges=s.badges.map(b=>`<div class="dash-milestone ${b.earned?'is-earned':'is-locked'}"><span aria-hidden="true">${b.earned?'✦':'○'}</span><span><strong>${esc(b.name)}</strong><small>${esc(b.desc)}</small></span></div>`).join('');
 const reviewWidget=reviewLesson?`<article class="home-review">
  <div class="home-card-head"><span class="overline">SPACED RECALL / 復習</span><span class="dash-tag">${review.review?'復習予定':'復習の候補'}</span></div>
  <h3>${esc(reviewLesson.title)}</h3><p class="home-question">${esc(reviewLesson.quiz.q)}</p>
  ${reveal?`<div class="home-answer"><strong>考え方を確認する</strong><p>${esc(reviewLesson.quiz.why)}</p><span class="micro">思い出せたかどうかを自分で判定。採点の自動判定ではありません。</span></div>
  <div class="home-review-actions"><button data-home-review="${reviewLesson.id}:yes">思い出せた</button><button data-home-review="${reviewLesson.id}:again" class="quiet">もう一度練習する</button></div>`:
  `<button class="home-primary" data-home-reveal>考えてから答えを見る →</button>`}
  <p class="micro">復習間隔は自己評価に応じた目安（1・3・7・14・30日）。レッスンの理解度を自動測定しているわけではありません。</p>
 </article>`:`<article class="home-review"><span class="overline">SPACED RECALL</span><h3>復習したい音を、ここに集めよう。</h3><p>まずレッスンを一つ完了すると、内容を思い出す復習カードが現れる。今日から始めても大丈夫。</p><a class="home-inline" href="#/lesson/${lesson.id}">最初のレッスンへ ↗</a></article>`;
 const studyBlock=plan===5?
 ['耳で1つの違いを聴く','コードの役割を口で説明する','ベースで1フレーズ試す']:
 plan===15?['原盤の聴取ポイントを1つ追う','音声実例を2つ比較する','練習課題の1段階を演奏する']:
 ['音楽史・理論の章を読む','原盤を3周のガイドで聴く','ベースの練習課題を録って比較する'];
 const planned=studyBlock.map((x,i)=>`<li><span>0${i+1}</span>${esc(x)}</li>`).join('');
 return `<div class="home-page">
 <section class="dash-hero">
  <div class="overline">AFTER PARKER / YOUR PRACTICE SPACE</div>
  <div class="dash-hero-layout"><div><p class="dash-intro">JAZZ IS A PRACTICE</p><h1>${esc(headline)}</h1><p>読むだけじゃない。聴き分けて、思い出して、ベースで試す。今日の小さな発見が、明日の音を変える。</p>
  <div class="dash-hero-actions"><a class="dash-main-link" href="#/lesson/${lesson.id}">今日のレッスンへ <span aria-hidden="true">↗</span></a><a class="dash-second-link" href="#/ear">耳トレで始める →</a><a class="dash-second-link" href="#/journal">学習ログ・個別化 ↗</a><a class="dash-second-link" href="#/index">名盤・人物辞典 ↗</a></div></div>
  <div class="dash-donut" style="--progress:${ratio}%"><div><strong>${ratio}<small>%</small></strong><span>LESSONS COMPLETE</span></div></div></div>
 </section>
 <section class="dash-stats" aria-label="学習の実績">
  <div><small>完了したレッスン</small><strong>${s.completed}<span> / ${total}</span></strong><em>コースの進捗</em></div>
  <div><small>実践した練習</small><strong>${s.practice}<span> / 42</span></strong><em>ベース・ピアノ実験</em></div>
  <div><small>耳トレ正答</small><strong>${s.earCorrect}<span> / ${s.earAnswered}</span></strong><em>回答済みの中で</em></div>
  <div><small>最近の学習日</small><strong>${s.active}<span> / 7</span></strong><em>直近7日間</em></div>
 </section>
 <div class="dash-columns">
  <div class="dash-main-column">
   <section class="dash-section">
    <div class="dash-section-label">01 / YOUR NEXT MOVE</div>
    <div class="dash-section-title"><h2>今日は、ここから。</h2><p>迷わないように、最初の一歩だけ。</p></div>
    <article class="dash-feature">
      <span class="dash-tag">NEXT LESSON · ${esc(lesson.era)}</span>
      <h3>${esc(lesson.title)}</h3><p>${esc(lesson.subtitle)}</p>
      <div class="dash-feature-foot"><span>${esc(lesson.artist)}</span><a href="#/lesson/${lesson.id}">レッスンを開く ↗</a></div>
    </article>
   </section>
   <section class="dash-section">
    <div class="dash-section-label">02 / QUICK PRACTICE</div>
    <div class="dash-section-title"><h2>${plan}分の、音楽的な投資。</h2><p>短くても、受け身の読書だけで終わらせない。</p></div>
    <div class="home-session">
      <div class="session-time" role="group" aria-label="練習する時間">${[5,15,25].map(n=>`<button data-home-minutes="${n}" class="${plan===n?'active':''}" aria-pressed="${plan===n}">${n} min</button>`).join('')}</div>
      <ol class="session-tasks">${planned}</ol>
      <div class="session-action">
       <a href="#/lesson/${lesson.id}">教材に移動する →</a>
       <button data-home-session-done>今日の練習を記録 ✓</button>
      </div>
      <p class="micro">実際に練習した後に記録しよう。時間は自己申告で、タイマーによる計測ではありません。</p>
    </div>
   </section>
   <section class="dash-section">
    <div class="dash-section-label">03 / RETRIEVAL PRACTICE</div>
    <div class="dash-section-title"><h2>読むより、思い出す。</h2><p>一度覚えたことを、別の日に取り出す。</p></div>
    ${reviewWidget}
   </section>
   <section class="dash-section">
    <div class="dash-section-label">04 / THE ROAD AHEAD</div><div class="dash-section-title"><h2>耳で強化したい3つの領域。</h2><p>診断で見えた重点テーマに、いつでも戻れる。</p></div>
    <div class="home-focus-grid">
     ${[['03','モードの重心','ベースをD・C・Fに移す'],['14','#11とアヴォイド','同じ和音の色を聴き分ける'],['05','声部連結','高速転調を横の線で捉える']].map(([id,label,sub])=>`<a href="#/lesson/${id}"><span class="home-focus-num">${id}</span><strong>${label}</strong><small>${sub}</small><span aria-hidden="true">↗</span></a>`).join('')}
    </div>
   </section>
  </div>
  <aside class="dash-side-column">
   <section class="dash-side-card">
    <span class="overline">CONSISTENCY / 直近7日</span><h3>学習のリズム</h3><div class="heat-row" aria-label="直近7日間の活動履歴">${activity}</div>
    <div class="dash-side-stat"><span>活動した日</span><strong>${s.active}日</strong></div>
    <div class="dash-side-stat"><span>連続した日</span><strong>${s.streak}日</strong></div>
    <p class="micro">連続が途切れても大丈夫。記録はこの機能の導入後から始まります。</p>
   </section>
   <section class="dash-side-card">
    <span class="overline">YOUR WEEKLY TARGET</span><h3>無理のない目標</h3>
    <p>7日のうち、${s.target}日触れることを目安に。</p><div class="weekly-meter"><span style="width:${pct(s.active,s.target)}%"></span></div>
    <div class="dash-side-stat"><strong>${Math.min(s.active,s.target)} / ${s.target} 日</strong><small>${s.active>=s.target?'今週の目安に到達':'一回の短い練習でも一歩'}</small></div>
    <div class="weekly-selector" role="group" aria-label="7日間の学習目標">${[2,3,4,5,7].map(n=>`<button aria-pressed="${s.target===n}" class="${s.target===n?'active':''}" data-home-weekly="${n}">${n}日</button>`).join('')}</div>
    <p class="micro">目標は自分で調整できる。休息日を作っても問題ありません。</p>
   </section>
   <section class="dash-side-card">
    <span class="overline">MILESTONES</span><h3>できるようになったこと</h3><div class="dash-milestones">${badges}</div>
   </section>
   <section class="dash-side-card learning-science">
    <span class="overline">LEARNING SCIENCE / 学習科学</span><h3>続けるための3つの工夫</h3>
    <p><strong>思い出す</strong> ―― 読み直す前に自分で答える（想起練習）。</p>
    <p><strong>少し空ける</strong> ―― 同じ音に別の日に戻る（分散学習）。</p>
    <p><strong>音にする</strong> ―― 理論を耳と指で検証し、自分の理解を言葉にする。</p>
    <a href="https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html" target="_blank" rel="noopener noreferrer">学習科学のレビューを読む ↗</a>
    <p class="micro">復習と学習記録を支える一般的な心理学的知見に基づく設計。ドーパミン量や脳の変化を測定・保証するものではありません。</p>
   </section>
  </aside>
 </div>
 </div>`;
}
