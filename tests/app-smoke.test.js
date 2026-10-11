import test from 'node:test';
import assert from 'node:assert/strict';

test('existing app boots and renders learning log and adaptive lesson',async()=>{
 const dom={};const listeners={},windows={};const store=new Map();
 const element=id=>dom[id] ||= {id,textContent:'',innerHTML:'',outerHTML:'',style:{},addEventListener:()=>{},value:''};
 globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
 globalThis.location={hash:'#/journal'};
 globalThis.document={getElementById:element,querySelectorAll:()=>[],addEventListener:(type,handler)=>listeners[type]=handler,title:''};
 globalThis.window={addEventListener:(type,handler)=>windows[type]=handler,scrollTo:()=>{}};
 await import('../src/app.js?smoke-test=1');
 assert.match(dom.app.innerHTML,/LEARNING MEMORY/);
 assert.match(dom.app.innerHTML,/GitHubの履歴を取り込む/);
 globalThis.location.hash='#/lesson/01';windows.hashchange();
 assert.match(dom.app.innerHTML,/adaptive-panel/);
 assert.match(dom.app.innerHTML,/PERSONAL LEARNING/);
 const memo={target:{id:'lesson-note',value:'ガイドトーンがわからない'}};
 listeners.input(memo);
 assert.match(element('adaptive-panel').outerHTML,/理解が曖昧なところから組み直そう/);
 assert.equal(JSON.parse(store.get('after-parker-v1')).notes['01'],'ガイドトーンがわからない');
});
