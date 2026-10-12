import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,earDrills} from '../src/data.js';
import {learningSignals,adaptiveLesson,renderAdaptiveLesson,LESSON_GUIDES} from '../src/learning-model.js';
import {normalizeLearningState,normalizeTutorFeedback,safeGitHubBase64,decodeGitHubBase64,verifyPrivateRepo,setGithubToken,forgetGithubToken,saveLearningToGitHub,hasGithubToken} from '../src/github-learning.js';

const lesson=n=>lessons.find(x=>x.id===n);
test('personalized explanations exist for all chapters and react to the learning memo',()=>{
 assert.equal(Object.keys(LESSON_GUIDES).length,14);
 let state={notes:{'01':'ガイドトーンの違いがわからない'},reflections:{},practiceDone:{},ear:{}};
 let a=adaptiveLesson('01',state,lesson('01'));
 assert.equal(a.signals.stage,'rebuild');
 assert.match(a.nextAction,/Dm7/);
 state.notes['01']='ガイドトーンの解決が理解できた、試してみる';
 state.reflections['01']='applied';
 a=adaptiveLesson('01',state,lesson('01'));
 assert.equal(a.signals.stage,'stretch');
 assert.match(a.nextAction,/3小節/);
 state['quiz-01']=1;
 assert.equal(adaptiveLesson('01',state,lesson('01')).signals.stage,'stretch');
 state['quiz-01']=0;
 const markup=renderAdaptiveLesson(lesson('01'),{...state,mentorFeedback:{'01':{title:'直したい点',explanation:'<script>alert(1)</script>'}}},x=>String(x).replaceAll('<','&lt;').replaceAll('>','&gt;'));
 assert.match(markup,/個別解説/);assert.match(markup,/&lt;script&gt;/);assert.doesNotMatch(markup,/<script>/);
});
test('private journal stores utf8 without corrupting Japanese text',()=>{
 const note='So What ♯11 と 3度 🎼 5:4';
 assert.equal(decodeGitHubBase64(safeGitHubBase64(note)),note);
});
test('state import validates keys, restricts notes, and excludes token material',()=>{
 const remote={notes:{'01':'段階的な理解','99':'should not import'},completed:{'01':true,'99':true},ear:{e1:'B',oops:'A'},reflections:{'01':'uncertain','99':'clear'},practiceDone:{'01:1':true,'99:1':true},studyEvents:[],reviews:{},weeklyTarget:3,homeMinutes:15,'quiz-01':0,token:'secret'};
 const state=normalizeLearningState(remote,lessons,earDrills);
 assert.equal(state.notes['01'],'段階的な理解');assert.equal(state.notes['99'],undefined);
 assert.deepEqual(Object.keys(state.completed),['01']);
 assert.deepEqual(Object.keys(state.reflections),['01']);
 assert.equal(state.token,undefined);
 assert.equal(state['quiz-01'],0);
 const mentor=normalizeTutorFeedback({version:1,lessons:{'01':{title:'総括',explanation:'1度の意味',listening:'F→Eを聴く'},'99':{explanation:'invalid'}}},lessons);
 assert.deepEqual(Object.keys(mentor),['01']);
 assert.throws(()=>normalizeTutorFeedback({version:2,lessons:{}},lessons));
});
test('GitHub repository must be private before journal data can be written',async()=>{
 const previous=globalThis.fetch;
 const previousStorage=globalThis.localStorage;
 globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
 const calls=[];
 globalThis.fetch=async (url,opts)=>{calls.push({url,opts});return {ok:true,status:200,json:async()=>({full_name:'chanwata/jazz-powerup-memory',private:false,owner:{login:'chanwata'}})}};
 setGithubToken('test-only-do-not-store');
 await assert.rejects(()=>verifyPrivateRepo(),/非公開/);
 await assert.rejects(()=>saveLearningToGitHub({},lessons,earDrills),/非公開/);
 assert.equal(calls.length,2);
 assert.ok(calls.every(x=>x.url==='https://api.github.com/repos/chanwata/jazz-powerup-memory'));
 assert.equal(hasGithubToken(),false);
 forgetGithubToken();
 globalThis.fetch=previous;
 globalThis.localStorage=previousStorage;
});
test('private GitHub API upload is explicit, checks SHA, and never serializes the session token',async()=>{
 const previousFetch=globalThis.fetch,previousStorage=globalThis.localStorage;
 const storage=new Map();let saved=null;let remoteSha=null;
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 globalThis.fetch=async (url,options)=>{
   if(url==='https://api.github.com/repos/chanwata/jazz-powerup-memory')return {ok:true,json:async()=>({full_name:'chanwata/jazz-powerup-memory',private:true,owner:{login:'chanwata'}})};
   if(url.endsWith('/contents/learning/state.json')&&(!options?.method||options.method==='GET')){
     return remoteSha?{ok:true,json:async()=>({sha:remoteSha,encoding:'base64',content:saved})}:{ok:false,status:404};
   }
   if(url.endsWith('/contents/learning/state.json')&&options?.method==='PUT'){
     const body=JSON.parse(options.body);
     assert.equal(body.branch,'main');
     assert.equal(body.sha,remoteSha||undefined);
     assert.equal(body.content.includes('github_pat_'),false);
     const obj=JSON.parse(decodeGitHubBase64(body.content));
     assert.equal(obj.data.notes['01'],'和声が分かんない');
     assert.equal(obj.data.secret,undefined);
     remoteSha='git-sha-123';saved=body.content;
     return {ok:true,json:async()=>({content:{sha:remoteSha}})};
   }
   throw Error('Unexpected network request '+url);
 };
 setGithubToken('github_pat_mock_token');
 const state={notes:{'01':'和声が分かんない'},completed:{'01':true},ear:{},secret:'github_pat_mock_token'};
 const first=await saveLearningToGitHub(state,lessons,earDrills);
 assert.equal(first.sha,remoteSha);
 assert.ok(storage.has('jazz-powerup-memory-synced-sha'));
 const second=await saveLearningToGitHub(state,lessons,earDrills);
 assert.equal(second.sha,remoteSha);
 forgetGithubToken();globalThis.fetch=previousFetch;globalThis.localStorage=previousStorage;
});
test('journal page presents current notes without requiring a GitHub connection',async()=>{
 const {renderJournalPage}=await import('../src/journal-ui.js');
 const html=renderJournalPage({notes:{'01':'初日の理解：FからEに半音で解決する'}},lessons,x=>String(x).replaceAll('<','&lt;').replaceAll('>','&gt;'));
 assert.match(html,/初日の理解/);
 assert.match(html,/非公開リポジトリ/);
 assert.match(html,/data-journal-connect/);
 assert.match(html,/GitHubに保存/);
 assert.doesNotMatch(html,/github_pat_[A-Za-z0-9]{12}/);
});

test('browser GitHub requests omit API version header to avoid browser preflight incompatibility',async()=>{
 const prev=globalThis.fetch;
 const calls=[];
 globalThis.fetch=async (url,opts)=>{calls.push(opts.headers);return {ok:true,status:200,json:async()=>({full_name:'chanwata/jazz-powerup-memory',private:true,owner:{login:'chanwata'}})};};
 setGithubToken('github_pat_test_only');
 try{assert.equal(await verifyPrivateRepo(),true);assert.equal(calls.length,1);assert.equal(calls[0]['X-GitHub-Api-Version'],undefined);assert.ok(calls[0].Authorization.startsWith('Bearer '));}
 finally{forgetGithubToken();globalThis.fetch=prev;}
});
test('403 diagnostics distinguish missing selected repository, write grant and rate limits',async()=>{
 const {explainGithubFailure}=await import('../src/github-learning.js');
 assert.match(explainGithubFailure(403,'接続','Resource not accessible by personal access token'),/Selected repositories/);
 assert.match(explainGithubFailure(403,'保存','Resource not accessible by personal access token'),/Read and write/);
 assert.match(explainGithubFailure(403,'保存','API rate limit exceeded','0'),/利用制限/);
 assert.match(explainGithubFailure(409,'保存','Conflict'),/main/);
});
