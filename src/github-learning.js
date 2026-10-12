export const MEMORY_REPO='chanwata/jazz-powerup-memory';
export const MEMORY_PATH='learning/state.json';
export const MENTOR_PATH='learning/tutor-feedback.json';
export const STORAGE_KEY='after-parker-v1';
const SHA_KEY='jazz-powerup-memory-synced-sha';
const REPO_URL='https://api.github.com/repos/'+MEMORY_REPO;
let token='';
let verified=false;
const jsonHeaders=()=>({'Accept':'application/vnd.github+json','Authorization':'Bearer '+token});
export function explainGithubFailure(status,action,message='',remaining=null){
 const detail=String(message||'').slice(0,160);
 if((status===403||status===429)&&(remaining==='0'||/rate limit/i.test(detail)))return `GitHub APIの利用制限です（HTTP ${status}）。少し時間を置いて再試行してください。${detail}`;
 if(status===403){
  if(action==='接続')return `接続時HTTP 403：このTokenでは非公開の chanwata/jazz-powerup-memory にアクセスできません。Fine-grained TokenのResource ownerがchanwata、Selected repositoriesにjazz-powerup-memoryが含まれるか確認。GitHub: ${detail||'Forbidden'}`;
  if(action==='保存')return `保存時HTTP 403：TokenのRepository permissionsで Contents が Read and write になっているか確認してください。保存先は chanwata/jazz-powerup-memory の main です。GitHub: ${detail||'Forbidden'}`;
  return `読込時HTTP 403：選択したリポジトリへのContents Read以上の権限を確認。GitHub: ${detail||'Forbidden'}`;
 }
 if(status===401)return 'HTTP 401：Tokenが無効・失効している可能性があります。新しいFine-grained Tokenを作り、こちらに貼らずアプリに入力してください。';
 if(status===404&&action==='接続')return 'HTTP 404：Tokenから非公開リポジトリが見えていません。Repository accessの選択先とResource ownerを確認してください。';
 if(status===409&&action==='保存')return 'HTTP 409：GitHubのブランチまたはファイルの更新競合です。mainブランチが存在することを確認し、同期し直してください。';
 if(status===422&&action==='保存')return `HTTP 422：保存先のブランチ・ファイルまたはSHAが一致しません。GitHub: ${detail}`;
 return `GitHub APIエラー（${action} / HTTP ${status}）。${detail||'Tokenと保存先リポジトリの設定を確認してください。'}`;
}
export function setGithubToken(value){token=String(value||'').trim();verified=false;}
export function forgetGithubToken(){token='';verified=false;}
export function hasGithubToken(){return token.length>0&&verified;}
export function safeGitHubBase64(text){const bytes=new TextEncoder().encode(text);let binary='';for(let i=0;i<bytes.length;i+=8192){binary+=String.fromCharCode(...bytes.slice(i,i+8192));}return btoa(binary);}
export function decodeGitHubBase64(encoded){const binary=atob(String(encoded).replace(/\s/g,''));return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(binary,c=>c.charCodeAt(0)));}
async function github(path,options={}){
 if(!token)throw Error('まずGitHubのFine-grained Tokenを接続してください。');
 const url=REPO_URL+(path?'/'+path:'');
 const action=options.method==='PUT'?'保存':path?'読込':'接続';
 let response;
 try{response=await fetch(url,{...options,headers:{...jsonHeaders(),...(options.headers||{})},credentials:'omit',redirect:'error',cache:'no-store'});}
 catch(e){throw Error('GitHubへの'+action+'通信に失敗。ネットワークまたはCORSの問題の可能性があります。ブラウザを再読み込みして再試行してください。');}
 if(response.status===404&&options.allow404)return null;
 if(!response.ok){
   let message='';
   try{const body=await response.json();message=typeof body?.message==='string'?body.message:'';}catch{}
   const remaining=response.headers?.get?.('x-ratelimit-remaining')??null;
   const error=new Error(explainGithubFailure(response.status,action,message,remaining));
   error.httpStatus=response.status;
   throw error;
 }
 return response.json();
}
export async function tokenAccountLogin(){
 if(!token)throw Error('まずGitHub Tokenを入力してください。');
 let response;
 try{response=await fetch('https://api.github.com/user',{headers:jsonHeaders(),credentials:'omit',redirect:'error',cache:'no-store'});}
 catch{return null;}
 if(!response.ok)return null;
 try{
  const profile=await response.json();
  return typeof profile?.login==='string'&&/^[a-zA-Z0-9-]{1,39}$/.test(profile.login)?profile.login:null;
 }catch{return null;}
}
export async function verifyPrivateRepo(){
 let repo;
 try{repo=await github('',{});}
 catch(err){
  if(err?.httpStatus===404){
   const login=await tokenAccountLogin();
   if(login&&login.toLowerCase()!=='chanwata'){
    throw Error('Tokenの認証ユーザーは「'+login+'」です。保存先の所有者「chanwata」と違います。このTokenからは非公開リポジトリが見えません。GitHubでchanwataに切り替えてFine-grained Tokenを作成してください。Tokenの値は表示・保存しません。');
   }
   if(login){
    throw Error('Tokenの認証ユーザーは「'+login+'」で正しいですが、jazz-powerup-memoryが参照できません。Fine-grained Tokenの設定でResource owner＝chanwata、Repository access＝Only select repositories → jazz-powerup-memoryを選び、Contents＝Read and writeを確認してください。');
   }
  }
  throw err;
 }
 if(repo.full_name!==MEMORY_REPO||repo.private!==true||repo.owner?.login!=='chanwata')throw Error('保存先はchanwata/jazz-powerup-memoryという非公開リポジトリに限ります。公開リポジトリには学習メモを送信しません。');
 verified=true;
 return true;
}
async function readFile(path){if(!verified)await verifyPrivateRepo();const obj=await github('contents/'+path,{allow404:true});if(!obj)return null;if(obj.encoding!=='base64'||typeof obj.content!=='string')throw Error('GitHubから読み取れないファイル形式です。');return {data:JSON.parse(decodeGitHubBase64(obj.content)),sha:obj.sha};}
const validLesson=(id,lessons)=>lessons.some(x=>x.id===id);
const boolMap=(obj,match)=>Object.fromEntries(Object.entries(obj||{}).filter(([k,v])=>match(k)&&typeof v==='boolean'));
export function normalizeLearningState(remote,lessons,earDrills){
 if(!remote||typeof remote!=='object'||Array.isArray(remote))throw Error('学習ファイルの形式が不正です。');
 const ids=new Set(lessons.map(x=>x.id)),ears=new Set(earDrills.map(x=>x.id));
 const base={completed:{},notes:{},ear:{},practiceDone:{},practiceSpeed:1,pianoMode:'app',startOctave:3,studyEvents:[],reviews:{},weeklyTarget:3,homeMinutes:5,reflections:{}};
 base.completed=boolMap(remote.completed,id=>ids.has(id));
 base.notes=Object.fromEntries(Object.entries(remote.notes||{}).filter(([id,v])=>ids.has(id)&&typeof v==='string').map(([id,v])=>[id,v.slice(0,50000)]));
 base.ear=Object.fromEntries(Object.entries(remote.ear||{}).filter(([id,v])=>ears.has(id)&&['A','B'].includes(v)));
 base.practiceDone=boolMap(remote.practiceDone,k=>/^\d{2}:[012]$/.test(k)&&ids.has(k.slice(0,2)));
 base.practiceSpeed=[.75,1,1.25].includes(remote.practiceSpeed)?remote.practiceSpeed:1;
 base.pianoMode=['app','real'].includes(remote.pianoMode)?remote.pianoMode:'app';
 base.startOctave=[2,3,4].includes(remote.startOctave)?remote.startOctave:3;
 base.weeklyTarget=[2,3,4,5,7].includes(remote.weeklyTarget)?remote.weeklyTarget:3;
 base.homeMinutes=[5,15,25].includes(remote.homeMinutes)?remote.homeMinutes:5;
 base.reflections=Object.fromEntries(Object.entries(remote.reflections||{}).filter(([id,v])=>ids.has(id)&&['uncertain','clear','applied'].includes(v)));
 base.studyEvents=Array.isArray(remote.studyEvents)?remote.studyEvents.filter(e=>e&&/^\d{4}-\d{2}-\d{2}$/.test(e.day)&&['lesson','practice','quiz','ear','session','review-recalled','review-again'].includes(e.kind)&&typeof e.id==='string'&&typeof e.at==='string').slice(-1200).map(e=>({day:e.day,kind:e.kind,id:e.id.slice(0,24),at:e.at.slice(0,40)})):[];
 base.reviews=Object.fromEntries(Object.entries(remote.reviews||{}).filter(([id,v])=>ids.has(id)&&v&&Number.isInteger(v.count)&&v.count>=0&&v.count<=5&&/^\d{4}-\d{2}-\d{2}$/.test(v.nextDue)&&/^\d{4}-\d{2}-\d{2}$/.test(v.last)).map(([id,v])=>[id,{count:v.count,last:v.last,nextDue:v.nextDue,attempts:Number.isInteger(v.attempts)?v.attempts:1}]));
 for(const l of lessons){const answer=remote['quiz-'+l.id];if([0,1,2].includes(answer))base['quiz-'+l.id]=answer;}
 return base;
}
export function normalizeTutorFeedback(raw,lessons){
 if(!raw||raw.version!==1||!raw.lessons||typeof raw.lessons!=='object')throw Error('講師コメントのJSONが対応していません。');
 const allow=['title','explanation','listening','bassTask','question','updatedAt'];
 const out={};
 for(const [id,v] of Object.entries(raw.lessons)){
  if(!validLesson(id,lessons)||!v||typeof v!=='object'||typeof v.explanation!=='string')continue;
  const item={};for(const field of allow){if(typeof v[field]==='string')item[field]=v[field].slice(0,4000);}
  if(item.explanation)out[id]=item;
 }
 return out;
}
function saveMeta(sha){localStorage.setItem(SHA_KEY,JSON.stringify({sha,at:new Date().toISOString(),repo:MEMORY_REPO}));}
export function lastSync(){try{const x=JSON.parse(localStorage.getItem(SHA_KEY));if(x?.repo===MEMORY_REPO&&typeof x.sha==='string')return x;}catch{}return null;}
export async function saveLearningToGitHub(state,lessons,earDrills){
 await verifyPrivateRepo();
 const previous=await readFile(MEMORY_PATH);
 const last=lastSync();
 if(previous&&(!last||last.sha!==previous.sha))throw Error('GitHubにこの端末がまだ取り込んでいない変更があります。先に「GitHubから取り込む」で確認してください。上書きはしません。');
 const normalized=normalizeLearningState(state,lessons,earDrills);
 const text=JSON.stringify({format:'jazz-powerup-learning-v1',schemaVersion:1,updatedAt:new Date().toISOString(),data:normalized},null,2);
 if(new TextEncoder().encode(text).byteLength>850000)throw Error('メモが大きすぎて同期できません。JSONバックアップを保存して整理してください。');
 const body={message:'Update private Jazz Powerup learning journal',content:safeGitHubBase64(text),branch:'main'};
 if(previous)body.sha=previous.sha;
 const result=await github('contents/'+MEMORY_PATH,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 if(!result?.content?.sha)throw Error('GitHub側の保存結果を確認できません。');
 saveMeta(result.content.sha);
 return {sha:result.content.sha,bytes:text.length};
}
export async function readLearningFromGitHub(lessons,earDrills){
 await verifyPrivateRepo();
 const record=await readFile(MEMORY_PATH);
 if(!record)throw Error('学習ファイルがありません。まずこの端末の学習メモをGitHubに保存してください。');
 if(record.data?.format!=='jazz-powerup-learning-v1'||record.data?.schemaVersion!==1)throw Error('未対応のGitHub学習ファイルです。');
 const data=normalizeLearningState(record.data.data,lessons,earDrills);
 let mentor={};try{const note=await readFile(MENTOR_PATH);if(note)mentor=normalizeTutorFeedback(note.data,lessons);}catch(err){throw Error('学習ファイルは取得できましたが講師コメントに問題があります：'+err.message);}
 return {data:{...data,mentorFeedback:mentor},sha:record.sha,noteCount:Object.values(data.notes).filter(s=>s.trim()).length};
}
export async function readTutorFromGitHub(lessons){
 await verifyPrivateRepo();const mentor=await readFile(MENTOR_PATH);
 return mentor?normalizeTutorFeedback(mentor.data,lessons):{};
}
export function acceptRemoteSync(sha){saveMeta(sha);}
export const MENTOR_PROMPT=`GitHubに連携した私の非公開リポジトリ chanwata/jazz-powerup-memory の learning/state.json を読み、学習メモ、クイズ、練習済み項目を分析してください。次に、誤解している点と理解が進んだ点を区別し、音名・度数・拍を使った具体的な個別説明、耳の課題、ベース実践課題、思い出すための質問を作ってください。結果を同リポジトリの learning/tutor-feedback.json に次の形で書き戻してください： {"version":1,"lessons":{"01":{"title":"...","explanation":"...","listening":"...","bassTask":"...","question":"...","updatedAt":"ISO8601"}}}。対象は今回メモが更新された章を優先し、出典と推測を区別。サイト本体の共有リポジトリには私的メモを書かないこと。アクセス不能なら設定上の理由を説明してください。`;
