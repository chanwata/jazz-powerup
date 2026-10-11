"""One-time, checked edits to the existing app. No user progress is modified."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
index=root/'index.html';s=index.read_text()
if './src/score-lab.css' not in s:
    assert '<link rel="stylesheet" href="./src/dashboard.css">' in s
    s=s.replace('<link rel="stylesheet" href="./src/dashboard.css">','<link rel="stylesheet" href="./src/dashboard.css">\n  <link rel="stylesheet" href="./src/score-lab.css">')
if './src/score-lab.js' not in s:s=s.replace('</body>','  <script type="module" src="./src/score-lab.js"></script>\n</body>')
index.write_text(s)
app=root/'src/app.js';s=app.read_text()
if 'score-audio-start' not in s:
    assert 'const audio=new StudyAudio();' in s
    s=s.replace('const audio=new StudyAudio();',"const audio=new StudyAudio();\nwindow.addEventListener('score-audio-start',()=>audio.stop());")
start=' <section class="prose-section sound-section">'
if start in s:
    a=s.index(start);b=s.index('\n <section class="prose-section">',a);s=s[:a]+s[b:]
start=' <section class="prose-section"><div class="section-label">08 — ベースで試す'
if start in s:
    a=s.index(start);b=s.index('\n ${practicePanel(l)}',a);s=s[:a]+s[b:]
start=' return `<section class="prose-section practice-workshop"'
if '以前の練習記録も継続' not in s:
    a=s.index(start);b=s.index('\n}',a)
    s=s[:a]+''' return `<section class="prose-section practice-workshop" id="workshop"><div class="section-label">PRACTICE / 以前の練習記録も継続</div><h2>段階別の課題と、実際の録音。</h2><p class="workshop-intro">${esc(p.goal)}</p><div class="workshop-tasks">${exercises}</div><h2>実際の録音へ戻る。</h2><p class="micro">上の譜例は教材用の創作。以下は原盤を探すためのリンクで、録音の採譜と混同しないでください。</p><div class="recording-cases">${recordings}</div></section>`;'''+s[b:]
app.write_text(s)
for name in ['data.js','reading-a.js','reading-b.js','app.js']:
    f=root/'src'/name;s=f.read_text()
    s=s.replace('右手E–A–D–G–Bを保持、左手D2→C2→F2','低音D2→C2→F2をアプリで流し、左手E3–A3／右手D4–G4–B4を保持')
    s=s.replace('右手 E–A–D–G–B、左手 D→C。','低音D→Cはアプリ。左手E3–A3、右手D4–G4–B4。')
    s=s.replace('右手は E–A–D–G–B。','上声は左手E3–A3、右手D4–G4–B4。低音はアプリで鳴らす。')
    s=s.replace('右手E–A–D–G–B','両手でE3–A3–D4–G4–B4')
    f.write_text(s)
readme=root/'README.md'
if readme.exists():
    s=readme.read_text()
    if '## 譜例精読版' not in s:
        s+='\n\n'+(root/'docs/score-edition.md').read_text()
    s=s.replace('**14章にオリジナルの演奏用音列43本、段階別の実践課題42本、比較対象の録音28件を追加**。','**14章の33の五線譜例、段階別の実践課題42本、比較対象の録音28件を収録**。旧音列の実装用表示は、譜例精読版に置き換えました。')
    readme.write_text(s)
print('Installed 14 chapter notation edition; legacy completion/notes/ear state preserved.')
