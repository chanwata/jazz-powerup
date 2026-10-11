export const lessons = [
{
 id:'01',era:'1940s',tag:'語法',title:'パーカーの後に何が残った？',subtitle:'ビバップは「速いコード進行」ではない',minutes:22,priority:'基盤',
 artist:'Charlie Parker / Dizzy Gillespie / Oscar Pettiford',album:'Charlie Parker — Confirmation（代表的な演奏を聴き比べる）',query:'Charlie Parker Confirmation 1953 jazz',
 premise:'ビバップの革新はコードを増やすことだけではない。単旋律のなかで、今鳴っていない和声を聴き手に推定させる技術を高度化した。ジャコの「Donna Lee」ともつながる話。',
 history:'パーカーとガレスピーが活躍した1940年代、ジャム・セッションや小編成の演奏は、スウィング時代の語彙を再編した。演奏を「過去から現在への単純な進歩」と決めつけず、スモール・コンボの社会的条件にも注目したい。',
 theory:'3度と7度はコードの性格・進行方向を明示しやすい。導音やクロマティック・アプローチは、次の強拍の到達点を予期させる。逆にテンションは単独ではコードを確定しない。',
 listen:['メロディがコードの根音を弾かずとも、和声進行が聴こえる箇所を探す。','ベースの拍頭を基準に、メロディの半音階的な着地の位置を聴く。','同じテーマでも誰がどこで緊張を作り、どこで開放するかを観察。'],
 practice:'ii–V–I（Dm7–G7–Cmaj7）の各コードで、ルートを一度も弾かずに4小節のベースソロを作る。3度・7度の着地位置だけ先に決める。',
 insider:'『Donna Lee』の作曲者表記には歴史的に混乱がある。一般的なパーカーへの帰属だけで済ませず、マイルスの主張や初期録音のクレジットも調べると面白い。',
 examples:[{label:'ガイドトーンが語る ii–V–I',description:'低音ルートを鳴らしつつ、ピアノの3度／7度が半音でつながる例。',bpm:90,sequence:[{bass:'D2',notes:['F3','C4'],beats:4},{bass:'G2',notes:['F3','B3'],beats:4},{bass:'C2',notes:['E3','B3'],beats:4}]}],
 quiz:{q:'Dm7→G7→Cmaj7で、F音は最初の2コードそれぞれ何度？',options:['3度 → ♭7度','♭7度 → 3度','9度 → 5度'],answer:0,why:'Dm7では短3度、G7では短7度。同じ音を保持するだけで和声が変わる。'},sources:[['The Charlie Parker Discography','https://www.jazzdisco.org/charlie-parker/']]
},
{
 id:'02',era:'1950s',tag:'業界',title:'Blue NoteとPrestigeの二つの現場',subtitle:'制作が演奏をどう変えるか',minutes:18,priority:'新領域',
 artist:'Hank Mobley / Sonny Rollins / Paul Chambers / Doug Watkins',album:'Soul Station（1960）と Saxophone Colossus（1956）',query:'Hank Mobley Soul Station Remember 1960',
 premise:'同じルディ・ヴァン・ゲルダーが録音していても、音楽の雰囲気が同じになるとは限らない。録音の現場にある条件が、演奏の構造を変える。',
 history:'Blue Noteのアルフレッド・ライオンはリハーサルを重視してミュージシャンに支払ったことで知られる。Prestigeのボブ・ワインストックは、比較的即興色の濃いセッションを多数制作した。いずれもすべての録音に当てはまる絶対的なルールではない。',
 theory:'編曲されたヒット、リフ、ユニゾンのキメが多い曲では、ベースの「正しい音」より、フレーズが誰とどこで合うかが重要。ブルース・フォームの長いソロでは、ラインの微小な変化が意味を持つ。',
 listen:['Soul Stationではテーマとアレンジの「準備された場所」を見つける。','Saxophone Colossusでは、同じ構造を即興によってどう変えるか聴く。','ポール・チェンバースとダグ・ワトキンスの4分音符の長さ、推進力を比べる。'],
 practice:'ブルース12小節を録音。Aテイクは4小節ごとに決めたリフ、Bテイクはワンテイク即興。後から「どちらが良い」ではなく、何が変わったかを比較する。',
 insider:'ルディ・ヴァン・ゲルダーは検眼士として働いた経験を持ち、両親の家のスタジオから名録音を量産した。',
 examples:[{label:'ブルースの設計',description:'ベースのI–IV–Vを聴く。同じルートでもリズムが解釈を変える。',bpm:104,sequence:[{bass:'F2',notes:['A3','Eb4','G4'],beats:4},{bass:'Bb2',notes:['D3','Ab3','C4'],beats:4},{bass:'F2',notes:['A3','Eb4','G4'],beats:4},{bass:'C3',notes:['E3','Bb3','D4'],beats:4}]}],
 quiz:{q:'両レーベルの録音の違いを説明する上で最も注意すべきことは？',options:['レーベルごとの傾向と個別作品を区別する','一方は常に即興しない','録音エンジニアが別人だった'],answer:0,why:'制作スタイルは傾向。録音毎の奏者、作曲、現場の条件を検証する。'},sources:[['Blue Note — History','https://www.bluenote.com/']]
},
{
 id:'03',videoId:'ylXk1LBvIqU',era:'1959',tag:'和声',title:'So What — ベースが調性を決める',subtitle:'同じ5音をD・C・Fの下に置いてみる',minutes:30,priority:'最優先',
 artist:'Miles Davis / Paul Chambers / Bill Evans',album:'Kind of Blue — So What（1959）',query:'Miles Davis So What Kind of Blue 1959 official audio',
 premise:'コードの種類は上声だけでは決まらない。E–A–D–G–Bという同じヴォイシングでも、低音がDならドリアン的、Cならメジャー系、Fならリディアン系に聴こえ得る。',
 history:'1959年前後は、コルトレーンの高速な和声進行の探究と、マイルスのモード的な音楽が並存した。両方でベースを弾いたのがポール・チェンバース。歴史は一直線ではない。',
 theory:'D + E A D G B はDの9,5,1,4,6を含むが3度を含まないため単体では長短を確定しない。Cを下に置けばC E G B D A＝Cmaj13系。Fを置けばF A E B D G＝Fmaj13(#11)系（5度省略）。文脈次第で異なる解釈もあり得る。',
 listen:['So Whatヴォイシングが入る瞬間に、ベースのDを意識して聴く。','ベースが対旋律に出たとき、何が調の重心を維持しているか。','テンションの数字ではなく「その音が何度に化けたか」を歌ってみる。'],
 practice:'ピアノでE–A–D–G–Bを保持し、左手またはベースでD→C→Fの順に鳴らす。目を閉じ、長3度・長7度・#11が出現する箇所を言語化する。',
 insider:'「So What」の冒頭のベースとピアノのやり取りは、コンピングと低音の役割交換を聴く絶好の入り口。',
 examples:[
 {label:'Bass D — モードの曖昧さ',description:'ピアノはE A D G B。Dは長短3度が欠けた中心音として聴こえる。',bpm:70,sequence:[{bass:'D2',notes:['E3','A3','D4','G4','B4'],beats:4},{bass:'D2',notes:['E3','A3','D4','G4','B4'],beats:4}]},
 {label:'Bass C — Cメジャーの明確化',description:'同じ5音。Cを足すことでE=3度、B=長7度になる。',bpm:70,sequence:[{bass:'C2',notes:['E3','A3','D4','G4','B4'],beats:4},{bass:'C2',notes:['E3','A3','D4','G4','B4'],beats:4}]},
 {label:'Bass F — Fリディアン',description:'B=#11。Fがルートになった瞬間に色が変わる。',bpm:70,sequence:[{bass:'F2',notes:['E3','A3','D4','G4','B4'],beats:4},{bass:'F2',notes:['E3','A3','D4','G4','B4'],beats:4}]}
 ],
 quiz:{q:'E–A–D–G–BにFの低音を置くと、Bは何度として機能する？',options:['#11','ナチュラル11','長7度'],answer:0,why:'FからBまでは増4度で、複音程では#11と解釈できる。'},sources:[['Miles Davis — Kind of Blue','https://www.milesdavis.com/albums/kind-of-blue/']]
},
{
 id:'04',videoId:'OVEOf7VCNgs',era:'1961',tag:'和声',title:'ラファロ — 対位法は誰の仕事？',subtitle:'ピアノが低音を譲り、ベースが歌う',minutes:23,priority:'高',
 artist:'Bill Evans / Scott LaFaro / Paul Motian',album:'Sunday at the Village Vanguard — Gloria’s Step（1961）',query:'Bill Evans Trio Gloria’s Step Scott LaFaro 1961',
 premise:'ウォーキングを停止した瞬間に自由になるのではない。全員がどこを支えるかを聴き直さなければ、ベースはただ低音の責任を放棄するだけになる。',
 history:'ラファロ以前にも高音域やメロディを使う先駆者は存在する。彼の重要性は、対話的な独立旋律をピアノトリオの持続的な関係として強めたこと。',
 theory:'対位法は同時に鳴る旋律どうしの関係。ベースがDを経由してEへ向かい、ピアノがBからAへ下行すれば、2本の線だけでも音程が変化し、和声的なドラマが生まれる。',
 listen:['ベースが高く出た直後のエヴァンスの左手の音域を聴く。','ポール・モチアンが拍を「数字で」示すのではなく、時間を空間化する瞬間を探す。','誰がテンポを保持しているか、と誰が音を出しているかを区別する。'],
 practice:'8小節のスタンダードを、ベースは4分ウォーキング→対旋律→休符主体の3種類で録音。ピアノの低音を弾く／弾かないも切り替える。',
 insider:'ラファロの演奏を単に「革新的なハイポジション奏法」と片づけると、ピアノとドラム側の変化を見落とす。',
 examples:[{label:'反行する二つの線',description:'ベースと上声が反対方向に動く。進行の推進力がどこから生まれるか。',bpm:78,sequence:[{bass:'D2',notes:['B3','E4','A4'],beats:2},{bass:'E2',notes:['A3','D4','G4'],beats:2},{bass:'F2',notes:['G3','C4','F4'],beats:2},{bass:'G2',notes:['F3','B3','E4'],beats:2}]}],
 quiz:{q:'ベースが高音域に出たとき、ピアニストの第一の判断は？',options:['左手の配置を聴いて調整する','必ず左手を止める','常にベースと同じ旋律を弾く'],answer:0,why:'音域の衝突が悪いのではなく、意図せず音楽的な役割が重なることに注意する。'},sources:[['Bill Evans discography','https://www.jazzdisco.org/bill-evans/']]
},
{
 id:'05',videoId:'fZ1pcOenxoo',era:'1959–60',tag:'和声',title:'Giant Steps — 三角形をベースで横断する',subtitle:'五度圏上の正三角形と、最短の声部連結',minutes:29,priority:'最優先',
 artist:'John Coltrane / Paul Chambers / Tommy Flanagan',album:'Giant Steps（1960）',query:'John Coltrane Giant Steps 1960 original Atlantic recording',
 premise:'B・G・E♭という長3度で離れた3つの主音。遠隔調への跳躍も、隣のコードとの声部連結として見ると急に近くなる。',
 history:'高速な転調ゲームの極端な探究。全員が同じ速度でそれを処理できるわけではない。録音の演奏と後世の教科書化は区別したい。',
 theory:'Bmaj7→D7→Gmaj7→B♭7→E♭maj7→Am7→D7。調の中心はB→G→E♭と長3度ずつ移る（向きによって短6度と表記する場合も）。ベースのルート移動は必ずしも最小ではないので、3度と7度を先に歌ってみる。',
 listen:['各トニックの到着を耳でつかむ。頭の中でB/G/E♭の3点を先に置く。','ベースのルートとピアノの内声の動きを分離して聴く。','速い進行の中で長い音を維持しているのは誰か。'],
 practice:'ピアノでコードの3度と7度だけを弾き、ベースはルート→3度→5度の3段階で弾く。最終的に「音を抜くと何が残るか」を録音する。',
 insider:'『Giant Steps』と『Kind of Blue』の両方でポール・チェンバースが演奏している事実を並べると、ジャズ史が一直線でないことが実感できる。',
 examples:[{label:'三つの主音の到着',description:'B / G / E♭への到着を、耳と低音で確認する。',bpm:105,sequence:[{bass:'B2',notes:['D#3','A#3'],beats:2},{bass:'D2',notes:['F#3','C4'],beats:2},{bass:'G2',notes:['B3','F#4'],beats:2},{bass:'Bb2',notes:['D3','Ab3'],beats:2},{bass:'Eb2',notes:['G3','D4'],beats:4}]}],
 quiz:{q:'B・G・E♭の関係を説明する最も適切な言葉は？',options:['長3度周期の3つの調性中心','全音音階の隣接音','五度圏で隣同士'],answer:0,why:'B→G→E♭→B は各主音が長3度の距離を持つ循環として整理できる。'},sources:[['Atlantic Records — John Coltrane','https://www.rhino.com/artist/john-coltrane']]
},
{
 id:'06',era:'1959–60s',tag:'思想',title:'ヘイデン — 和声をその場で作曲する',subtitle:'Ornette Colemanの自由は「何でもあり」ではない',minutes:21,priority:'高',
 artist:'Ornette Coleman / Charlie Haden / Billy Higgins',album:'The Shape of Jazz to Come（1959）— Lonely Woman',query:'Ornette Coleman Lonely Woman Shape of Jazz to Come',
 premise:'固定コードから離れることは、音楽的な基準が消えることではない。旋律の方向、低音の重心、フレーズの時間長から、その場の和声が立ち現れる。',
 history:'ヘイデンによれば、オーネットは和声の手がかりを示した上で、演奏者にソリストの動きに追随する自由を求めた。単なるルールの消去ではない。',
 theory:'例えば旋律がA→G→Fと降りるとき、ベースがDを維持すればDm系の重力、B♭を置けばB♭maj7系の彩り、Gを置けばG系の浮遊感が生まれる。コード名は結果であって命令ではない。',
 listen:['旋律が変わらず低音が変わった瞬間に注目。','ピアノのない編成で、どの楽器が一時的に調性を決めるか。','感情表現の大きな弧と、小さな音程の変化を同時に聴く。'],
 practice:'同じ3音の旋律A–G–Fの下にD、B♭、Gの低音を置いて録音。どれが「正しい」より、どの感情的方向が生まれるかを説明する。',
 insider:'「フリー」は演奏手順がないという意味ではない。オーネットは曲のイントロやエンディングの構造にもこだわっていた。',
 examples:[{label:'ひとつの旋律、3つの低音',description:'同じ上声 A G F に異なるルートを置く。',bpm:74,sequence:[{bass:'D2',notes:['A3','G4','F4'],beats:4},{bass:'Bb2',notes:['A3','G4','F4'],beats:4},{bass:'G2',notes:['A3','G4','F4'],beats:4}]}],
 quiz:{q:'コード進行が固定されない場合、ベースができることは？',options:['旋律に応じて一時的な和声の重心を作る','必ずルートを弾かない','音程の選択は無意味になる'],answer:0,why:'自由とは意味を作る責任が増えることでもある。'},sources:[['Ornette Coleman — official site','https://www.ornettecoleman.com/']]
},
{
 id:'07',era:'1950s–60s',tag:'業界',title:'ミンガス — 曲を集団で完成させる',subtitle:'Workshop、ブルース、文化的主張',minutes:24,priority:'高',
 artist:'Charles Mingus / Max Roach / Dannie Richmond',album:'Mingus Ah Um（1959）— Better Git It in Your Soul',query:'Charles Mingus Better Git It In Your Soul 1959',
 premise:'書いた旋律だけで作品が完成するのではない。各人の個性を生かす即興の設計も作曲の一部になる。',
 history:'ミンガスはエリントン的なオーケストレーション、ゴスペル、ブルース、集団即興を取り込み、Jazz Workshopを通じて音楽家の自発性を求めた。マックス・ローチらとのDebut Recordsでは制作の主導権にも取り組んだ。',
 theory:'ブルースは12小節の枠が同じでも、呼びかけと応答、フィル、拍の伸縮によって劇的な形になる。書くべきなのは全員の音符ではなく、変化を始める合図かもしれない。',
 listen:['リフが帰ってくるたび、合奏の重さがどう変わるか。','メロディ、叫び、伴奏の役割が入れ替わる瞬間。','ベースが形式の時計でありながら、語り手にもなっている箇所。'],
 practice:'8小節のリフ曲を作り、ベースがリフを保つA案と、各4小節の最後で応答するB案を聴き比べる。',
 insider:'ミンガスはベーシストであり作曲家であり、録音ビジネスを変えようとする経営者でもあった。',
 examples:[{label:'ブルースの呼びかけ／応答',description:'同じベースの動機が、上声の応答で表情を変える。',bpm:105,sequence:[{bass:'F2',notes:['A3','C4'],beats:2},{bass:'C3',notes:['Bb3','D4'],beats:2},{bass:'Bb2',notes:['D3','F3'],beats:2},{bass:'C3',notes:['E3','Bb3'],beats:2}]}],
 quiz:{q:'Jazz Workshop的な発想に一番近いのは？',options:['全体構想を示し、細部を奏者との即興で構築する','各奏者を完全に独立させる','作曲者が全音符を決定する'],answer:0,why:'作曲と即興を対立させず、合奏として設計する。'},sources:[['Mingus official','https://www.charlesmingus.com/']]
},
{
 id:'08',videoId:'TMvbUKqWYEs',era:'1964–65',tag:'リズム',title:'ギャリソン — 反復が自由を作る',subtitle:'A Love Supreme と「聴こえない拍」',minutes:23,priority:'高',
 artist:'John Coltrane / Jimmy Garrison / Elvin Jones / McCoy Tyner',album:'A Love Supreme — Acknowledgement / Pursuance（1965）',query:'John Coltrane A Love Supreme Acknowledgement original',
 premise:'複雑な展開をベース自身が毎回作る必要はない。同じモチーフを維持することで、周囲の変形を聴き取れるようにする。',
 history:'1960年代のコルトレーン・カルテットは、ギャリソンの低音、エルヴィンの多層的な時間、タイナーの四度和声が互いを増幅した。',
 theory:'F–A♭–F–B♭という動機を想定して、3拍や5拍の別周期をドラムに置く。ベースは4分の基準を保ち、二つの周期が何拍目で再び出会うかを耳で感じる。',
 listen:['4音モチーフの後で、上声が異なる調へ移るときの低音を聴く。','エルヴィンのシンバルを拍としてではなく、異なる周期が交差する層として捉える。','「Pursuance」でベースの役割が大きく変わる。'],
 practice:'同じ4音を2分間反復し、アクセントだけ3+3+2、5+3、4+4と移動する。その間にフレーズの重心がいつ変わるか録音。',
 insider:'A Love Supremeの4音の動機は、言葉の「A Love Supreme」とも結びつけて語られる。低音が作品全体の象徴的動機になった例。',
 examples:[{label:'モチーフの反復',description:'F–A♭–F–B♭を固定し、他の音で雰囲気を変化させるための足場。',bpm:94,sequence:[{bass:'F2',notes:['F3','Ab3','F3','Bb3'],beats:4},{bass:'F2',notes:['F3','Ab3','F3','Bb3'],beats:4}]}],
 quiz:{q:'一定のリフを保つ音楽的な価値は？',options:['周囲の変化を認識する基準を作る','変化が完全に消える','フレーズの自由がなくなる'],answer:0,why:'基準点があるほど、他パートの逸脱が意味を持つ。'},sources:[['John Coltrane official','https://www.johncoltrane.com/']]
},
{
 id:'09',era:'1967',tag:'和声',title:'ロン・カーター — 動く低音、動かないメロディ',subtitle:'Nefertiti の役割反転とsusの曖昧さ',minutes:28,priority:'最優先',
 artist:'Miles Davis / Wayne Shorter / Herbie Hancock / Ron Carter / Tony Williams',album:'Nefertiti（1967）',query:'Miles Davis Nefertiti 1967 full track',
 premise:'リードが同じメロディを何度も吹き、リズム隊が即興的に展開する。ベースは音域・密度・重心を変えることで、単音でも作曲的な働きをする。',
 history:'第2期マイルス・クインテットで、ロンが調性や拍の手がかりを担い、ハービーとトニーがそこから離れることがある。全員が完全に同じ仕組みで動く必要はない。',
 theory:'D7sus4（D G A C）でF♯を鳴らすと、G→F♯のsus解決またはGとF♯の半音摩擦が生まれ得る。F7に対するF♯＝♭9という別コードからの解釈は、前後関係なしに置き換えられない。',
 listen:['テーマの繰り返し回数ではなく、各回で音域や密度がどう変わったかをメモする。','トニーが音価を細かくした瞬間、ロンは音数を増やしたか減らしたか。','ピアノのsusが解決する瞬間と解決しない瞬間を区別する。'],
 practice:'D7sus4→F7sus4に対し、D→Fのルート維持、D→F♯→Fのクロマティック、F♯を長く保持する3案を録音。重心が変わるか確認。',
 insider:'「Nefertiti」は普通のソロ進行と主役・伴奏の関係が逆転している。作品の構造を、ベーシスト視点で分析すると面白い。',
 examples:[{label:'susから3度へ',description:'同じ低音D。G（sus4）がF♯（長3度）へ変わる。',bpm:68,sequence:[{bass:'D2',notes:['G3','A3','C4','E4'],beats:4},{bass:'D2',notes:['F#3','A3','C4','E4'],beats:4},{bass:'F2',notes:['Bb3','C4','Eb4','G4'],beats:4}]}],
 quiz:{q:'D7sus4上でF♯を長く鳴らした場合、必ず起きることは？',options:['長3度が加わり、ピアノのGとの関係が問題になる','Gメジャーに必ず解決する','F7が必ず♭9として聴こえる'],answer:0,why:'即座に機能和声へ移行するとは限らない。前後、音域、保持されるGの有無が重要。'},sources:[['Miles Davis — Nefertiti','https://www.milesdavis.com/albums/nefertiti/']]
},
{
 id:'10',era:'1969–70',tag:'制作',title:'テオ・マセロ — 編集も作曲になる',subtitle:'In a Silent Way、テープ編集と反復',minutes:20,priority:'新領域',
 artist:'Miles Davis / Teo Macero / Dave Holland',album:'In a Silent Way（1969）',query:'Miles Davis In A Silent Way 1969 full track',
 premise:'録音の「その場で起きたこと」を記録するだけでなく、後から素材を並べ替えて、セッションに存在しなかった形式を作る。',
 history:'マセロはサックス奏者で作曲家でもあり、ミンガスとJazz Composers Workshopで活動した。『In a Silent Way』では録音後の構成・反復が作品の形に大きく関わる。',
 theory:'A–B–A′のような回帰構造では、同じ音源でも前後が変わるため感情的な意味が変わる。これはサンプリングとループの美学を考える際の重要な先例。',
 listen:['最初のテーマが再び現れたとき、同じ音でも何を感じるか。','エレクトリック楽器による密度と、デイヴ・ホランドのベースの位置関係。','編集された「曲の時間」と、一度の演奏の「演奏時間」を区別する。'],
 practice:'自分の4小節を録音し、A–B–AとA–A–Bの順番で編集（無料DAW等でも可）。ベース自体を変えなくても作品の意味が変わるか聴く。',
 insider:'テオ・マセロを「ジャズ史の陰にいるもう一人の作曲家」と捉えると、後のビートメイキング史との橋が見えてくる。',
 examples:[{label:'同じAが戻る感覚',description:'A→B→Aをアプリで鳴らす。構成の知覚を確認。',bpm:70,sequence:[{bass:'D2',notes:['F3','A3','C4'],beats:4},{bass:'Bb2',notes:['D3','F3','A3'],beats:4},{bass:'D2',notes:['F3','A3','C4'],beats:4}]}],
 quiz:{q:'テープ編集が「作曲」になる理由は？',options:['素材の順序・反復・時間構造を新しく設計できる','録音ミスを消せるからだけ','演奏の情報を必ず失わせるから'],answer:0,why:'修復作業を超えて、作品の形式と物語を作り直せる。'},sources:[['Miles Davis — In a Silent Way','https://www.milesdavis.com/albums/in-a-silent-way/']]
},
{
 id:'11',era:'1970s',tag:'音響',title:'ECM — 音の終わりまで演奏する',subtitle:'楽器・残響・沈黙を含むベースの設計',minutes:21,priority:'高',
 artist:'Eberhard Weber / Manfred Eicher / Jan Erik Kongshaug',album:'The Colours of Chloë（1974）',query:'Eberhard Weber The Colours of Chloë 1974',
 premise:'音楽の対象が音符だけなら、音が鳴った後は副次的になる。でも残響も演奏の構成要素なら、消音、音価、音域が全体を変える。',
 history:'ECMは1969年に設立された。広い空間を思わせる録音が特徴とされる一方、自然残響だけでなく録音・ミックスの工夫でもその空間は作られる。',
 theory:'同じ和声を4拍保持する場合も、発音を長く保つ／途中で止める／上声だけ残すことで縦の響きが変化する。空間的な残像を「次の音」として聴く。',
 listen:['ベースのアタックに続いて聴こえる胴鳴りと残響。','音数の少ないところで、何が拍の区切りを作るか。','録音の距離感が演奏者の表現をどう変えるか。'],
 practice:'同じ2音を、レガート、スタッカート、4拍目だけ消音の3種類で録音。ピアノのダンパーを使える場合はペダルを切り替える。',
 insider:'ECMの音作りは「自然の音をそのまま」ではなく、設計された音響空間。音そのものへのフェティッシュという聴き方は重要。',
 examples:[{label:'残響と音の終端',description:'ここではピアノ風シンセの保持音と分離音を比較。実際のECMの録音音響を再現するものではない。',bpm:66,sequence:[{bass:'E2',notes:['G3','B3','D4'],beats:4},{bass:'E2',notes:['G3','B3','D4'],beats:4}]}],
 quiz:{q:'空間を重視する音作りで「演奏」に含めるべきなのは？',options:['発音・減衰・消音まで','ノートオンの位置だけ','マイクのブランドだけ'],answer:0,why:'同じ音高でも音の終わり方が音楽の構造を変える。'},sources:[['ECM Records','https://ecmrecords.com/']]
},
{
 id:'12',era:'1965–90s',tag:'文化',title:'ジャズは誰が決めるのか',subtitle:'AACM、ウィントン、教育と正典',minutes:23,priority:'新領域',
 artist:'Muhal Richard Abrams / Art Ensemble of Chicago / Wynton Marsalis',album:'Art Ensemble of Chicago — Nice Guys（1979）と Wynton Marsalis — Black Codes（1985）',query:'Art Ensemble of Chicago Nice Guys 1979',
 premise:'「何がジャズか」は音階や拍子だけでは決まらない。演奏の場、教育、録音会社、公共施設、批評家も音楽文化を形作る。',
 history:'AACMは1965年のシカゴで、演奏・教育・自己組織化を推進した。1980年代以降のウィントンとJazz at Lincoln Centerは、伝統の継承・教育・制度的評価に大きく関わった。両者とも音楽家の活動を支える制度作りという側面もある。',
 theory:'前衛的な集団即興と古典化されたスウィングは「自由／不自由」の単純な対立ではない。何を演奏するかだけでなく、誰が選曲するか、どんなレパートリーを後世に残すかを問う。',
 listen:['アンサンブル・オブ・シカゴの「little instruments」と音色の幅を聴く。','ウィントンのサウンドで、何をジャズの文法として提示しているか。','自分にとって「伝統を学ぶ」と「伝統に従う」はどう違うか。'],
 practice:'自身の10曲の理想セットリストを考え、何を正典に採用し何を排除したか1段落で書く。演奏課題は2種類のスタイルで同じブルースを弾き分ける。',
 insider:'AACMもJALCも「音楽を支える組織」という点では共通する。価値基準と組織の正当性が争点になる。',
 examples:[{label:'同じブルース、異なる解釈',description:'同じ音高集合の繰り返しでもリズムの切り方で印象が変わる。',bpm:98,sequence:[{bass:'F2',notes:['A3','C4','Eb4'],beats:4},{bass:'Bb2',notes:['Ab3','D4','F4'],beats:4}]}],
 quiz:{q:'AACMとJazz at Lincoln Centerを比較する最も精密な視点は？',options:['両者の組織目的、評価基準と継承するレパートリーを比較','片方だけが教育をした','人種の二項対立で説明しきる'],answer:0,why:'どちらも教育や演奏機会の創出に関わるが、歴史を捉える枠組みや方法が異なる。'},sources:[['AACM official','https://www.aacmchicago.org/'],['Jazz at Lincoln Center','https://jazz.org/']]
},
{
 id:'13',era:'1980s–2010s',tag:'リズム',title:'M-BaseからDilla Feelへ',subtitle:'周期の重ね合わせと、微小な時差は別物',minutes:27,priority:'高',
 artist:'Steve Coleman / J Dilla / Robert Glasper / Chris Dave / Derrick Hodge',album:'Steve Coleman — Rhythm People（1990）と Robert Glasper Experiment — Black Radio（2012）',query:'Robert Glasper Experiment Chris Dave live 2012',
 premise:'5:4のポリリズムと、スネアだけが数十ミリ秒遅れるマイクロタイミングを混同しない。どちらも時間を多層化するが、変化させている次元が異なる。',
 history:'M-Baseは単なる変拍子のジャンル名ではなく、構造化された即興を通じた創造的な言語の思想。J Dillaのビートと、Chris Daveの生演奏による変形は重なる部分があっても同義ではない。',
 theory:'ポリリズムは異なる周期や分割の重ね合わせ。マイクロタイミングは基準となる拍からの発音位置の偏差。ループ内で偏差が固定されても「不均等な気持ちよさ」は成立する。',
 listen:['ハイハット・スネア・ベースの発音位置を別々に追う。','ビートのズレが周期的に繰り返されるのか、毎回変わるのかを分ける。','基準の4分音符を誰も弾いていないときに体内で保持できるか。'],
 practice:'4分音符を弾いたまま、3連符のアクセントをもう一人に担当してもらう。次にキックをジャスト、スネアを少し遅らせたドラムループをDAWで作る。違いを言葉にする。',
 insider:'リズムのズレを「下手」と呼ぶか「スタイル」と呼ぶかは、何を基準に聴いているかという文化的・身体的な問題でもある。',
 examples:[{label:'5:4 と4分音符の対比',description:'ベースは4分の間隔で動き、上声に5等分のタイミングを模した短音を置く。',bpm:70,sequence:[{bass:'C2',notes:['E3','G3'],beats:4},{bass:'C2',notes:['E3','G3'],beats:4}]}],
 quiz:{q:'Dilla Feelに必ず必要なのはどちら？',options:['厳密な多拍子／ポリリズムとは限らない','必ず5:4を重ねる','スネアはすべて同じミリ秒数だけ遅れる'],answer:0,why:'ループ内の非等時性、楽器間の時間差などの組み合わせは音楽ごとに異なる。'},sources:[['Steve Coleman and Five Elements','https://m-base.com/']]
},
{
 id:'14',era:'横断',tag:'和声',title:'ベースはコードをどこまで変えられるか',subtitle:'Fmaj7の11th、sus、クラーベまで総仕上げ',minutes:35,priority:'最優先',
 artist:'Herbie Hancock / Ron Carter / Cachao / João Gilberto',album:'Maiden Voyage（1965）と Getz/Gilberto（1964）',query:'Herbie Hancock Maiden Voyage 1965 album title track',
 premise:'テンションは単独で意味を持たない。低音・上声・時間的位置が揃って初めて、音階内の音が「#11」「アヴォイド」「アプローチ」として聞かれる。',
 history:'キューバ系の先取りベースやブラジルの二拍系の安定した低音は、ウォーキングと別の方法で音楽の時間を組織する。アメリカのジャズ語法だけがベースの歴史ではない。',
 theory:'Fmaj7でA(長3度)とB♭(11th)を近接させると半音摩擦が生じやすい。B(#11)ならAとの直接的な半音衝突を避け、Fリディアンの色彩になる。ただしBもC(5度)とは半音。アヴォイドは絶対的な禁止音ではなく、配置と解決方向に依存する。',
 listen:['Maiden Voyageのsusを「解決前のコード」だけとして聴かない。','Getz/Gilbertoのベースの2拍系とギターの細分を分離して聴く。','Cachaoなどのトゥンバオで、和声の先取りがいつ起きるかを確認。'],
 practice:'ピアノでF–A–C–Eを押さえ、上声B♭→Aを聴く。次にB→C、B→Aを聴いて、半音の向きで気分が変わるか記録。さらにベースをF→Cへ変え、同じ上声が何度になったか答える。',
 insider:'「アヴォイド・ノート」は禁止ではなく、注意して使うべき長い保持音という理解が実用的。ジャズ理論の語彙は、必ず耳に戻して確認しよう。',
 examples:[
 {label:'Fmaj7 + B♭（自然11）',description:'A（長3度）とB♭が隣接。旋律的に解決すれば有効な緊張に変わる。',bpm:68,sequence:[{bass:'F2',notes:['A3','E4','Bb4','D4'],beats:4}]},
 {label:'Fmaj7 + B（#11）',description:'Aとの半音衝突は避け、リディアンの色彩が強くなる。',bpm:68,sequence:[{bass:'F2',notes:['A3','E4','B4','D4'],beats:4}]},
 {label:'Fmaj7 → F7sus4',description:'長7度から♭7度、3度からsus4への変化を耳で聴く。',bpm:68,sequence:[{bass:'F2',notes:['A3','C4','E4'],beats:4},{bass:'F2',notes:['Bb3','C4','Eb4'],beats:4}]}
 ],
 quiz:{q:'Fmaj7上のB♭を「絶対に弾いてはいけない」と言えない理由は？',options:['音域・声部連結・解決先・保持時間によって機能が変わる','#11のBは完全協和だから','ベーシストには和声への影響力がない'],answer:0,why:'「アヴォイド」は音楽的文脈を無視した絶対禁止ではない。'},sources:[['Herbie Hancock official','https://www.herbiehancock.com/']]
}
];

export const earDrills = [
 {id:'e1',level:1,title:'同じ上声、低音だけ変更',question:'より明確にメジャー7thとして聴こえるのは？',a:{bass:'D2',notes:['E3','A3','D4','G4','B4']},b:{bass:'C2',notes:['E3','A3','D4','G4','B4']},correct:'B',explanation:'CをベースにするとEが長3度、Bが長7度。Dでは長短3度が不在。',piano:'低音D→Cはアプリ。左手E3–A3、右手D4–G4–B4。'},
 {id:'e2',level:1,title:'Lydianの#11',question:'Fリディアンの#11を含むのは？',a:{bass:'F2',notes:['A3','E4','Bb4','D4']},b:{bass:'F2',notes:['A3','E4','B4','D4']},correct:'B',explanation:'Fに対してBが#11。B♭が自然11でAとの半音摩擦が生じる。',piano:'左手 F、右手 A E にB♭／Bを順に足す。'},
 {id:'e3',level:1,title:'長7度と短7度',question:'ドミナント7thはどちら？',a:{bass:'G2',notes:['B3','D4','F4']},b:{bass:'G2',notes:['B3','D4','F#4']},correct:'A',explanation:'G7の短7度はF。F#はGmaj7の長7度。',piano:'G+B+D+F と G+B+D+F#を弾き分ける。'},
 {id:'e4',level:2,title:'sus解決',question:'sus4が3度へ「解決」しているのはどちら？',a:{sequence:[{bass:'D2',notes:['G3','A3','C4'],beats:3},{bass:'D2',notes:['F#3','A3','C4'],beats:3}]},b:{sequence:[{bass:'D2',notes:['F#3','A3','C4'],beats:3},{bass:'D2',notes:['G3','A3','C4'],beats:3}]},correct:'A',explanation:'D7sus4のGがF#へ下がることで長3度が現れる。',piano:'D+C+Aを維持し、G→F#。'},
 {id:'e5',level:2,title:'半音で進むガイドトーン',question:'V7からIへの解決として聴こえるのは？',a:{sequence:[{bass:'G2',notes:['B3','F4'],beats:3},{bass:'C2',notes:['C4','E4'],beats:3}]},b:{sequence:[{bass:'G2',notes:['B3','F4'],beats:3},{bass:'F#2',notes:['B3','F4'],beats:3}]},correct:'A',explanation:'G7のB→C、F→Eが解決の方向を作る。',piano:'G7のB/FからCmajのC/Eへ声部を動かす。'},
 {id:'e6',level:2,title:'同じスケールの異なる重心',question:'リディアン的な#11が現れるのは？',a:{bass:'C2',notes:['E3','A3','D4','G4','B4']},b:{bass:'F2',notes:['E3','A3','D4','G4','B4']},correct:'B',explanation:'FをルートにするとBが#11になる。CをルートにするとBは長7度。',piano:'E–A–D–G–BをそのままにC→F。'},
 {id:'e7',level:2,title:'同じ旋律に別の低音',question:'Dマイナー系の重心を感じやすいのは？',a:{bass:'D2',notes:['F3','A3','C4']},b:{bass:'Bb2',notes:['F3','A3','C4']},correct:'A',explanation:'D+F+A+C はDm7。Bb+F+A+CはB♭maj9系に解釈できる。',piano:'上声F–A–C、左手D/B♭。'},
 {id:'e8',level:3,title:'altered tensionの解決',question:'G7(♭9)からCへの強い解決を含むのは？',a:{sequence:[{bass:'G2',notes:['B3','F4','Ab4'],beats:3},{bass:'C2',notes:['E3','G3','B3'],beats:3}]},b:{sequence:[{bass:'G2',notes:['B3','F4','Ab4'],beats:3},{bass:'G2',notes:['B3','F4','Ab4'],beats:3}]},correct:'A',explanation:'G7(♭9)はAbの緊張を含む。Cへの解決でその緊張を整理できる。',piano:'G+B+F+Ab → C+E+G+B。'},
 {id:'e9',level:3,title:'アプローチか保持か',question:'半音で緊張を解決するのは？',a:{sequence:[{bass:'F2',notes:['A3','E4','Bb4'],beats:2},{bass:'F2',notes:['A3','E4','A4'],beats:2}]},b:{sequence:[{bass:'F2',notes:['A3','E4','Bb4'],beats:2},{bass:'F2',notes:['A3','E4','Bb4'],beats:2}]},correct:'A',explanation:'B♭をAへ下げると長3度へ解決する。Bは同じ緊張を保持している。',piano:'F+Eを維持し、右手上声B♭→A。'},
 {id:'e10',level:3,title:'転調の着地点',question:'B→G→E♭というGiant Stepsの調性中心が聴こえるのは？',a:{sequence:[{bass:'B2',notes:['D#3','A#3'],beats:3},{bass:'G2',notes:['B3','F#4'],beats:3},{bass:'Eb2',notes:['G3','D4'],beats:3}]},b:{sequence:[{bass:'B2',notes:['D#3','A#3'],beats:3},{bass:'C2',notes:['E3','B3'],beats:3},{bass:'G2',notes:['B3','F#4'],beats:3}]},correct:'A',explanation:'長3度周期の3つの調性中心に到達するのはA。',piano:'Bmaj7、Gmaj7、E♭maj7を順に鳴らす。'}
];
