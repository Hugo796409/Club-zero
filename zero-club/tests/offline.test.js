import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const root=new URL('../dist/',import.meta.url);
test('tous les fichiers hors ligne existent et les requêtes fonctionnent sans réseau',async()=>{
 const events={},stored=new Map();let claimed=false;
 const cache={async addAll(paths){for(const p of paths)stored.set(p,await readFile(new URL(p==='./'?'index.html':p,root)));},async match(req){return stored.get(typeof req==='string'?req:new URL(req.url).pathname.replace('/','./'));}};
 const context={URL,Response,self:{location:{origin:'https://zero.example'},clients:{async claim(){claimed=true;}},addEventListener(n,fn){events[n]=fn;}},caches:{async open(){return cache;},async keys(){return['zero-club-v1'];},async match(r){return cache.match(r);},async delete(){}},fetch:async()=>{throw Error('Offline');}};
 vm.runInNewContext(await readFile(new URL('sw.js',root),'utf8'),context);
 let work;events.install({waitUntil(p){work=p;}});await work;assert.equal(stored.size,8);
 events.activate({waitUntil(p){work=p;}});await work;assert.ok(claimed);
 for(const path of ['/','/app.js','/style.css','/engine.js','/manifest.webmanifest']){events.fetch({request:{method:'GET',url:'https://zero.example'+path},respondWith(p){work=p;}});assert.ok((await work).length);}
 events.fetch({request:{method:'GET',url:'https://zero.example/unknown',mode:'navigate'},respondWith(p){work=p;}});assert.match((await work).toString(),/ZERO CLUB/);
});
