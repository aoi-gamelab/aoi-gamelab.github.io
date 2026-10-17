import test from 'node:test';
import assert from 'node:assert/strict';
import {youtubeId,isReleaseAsset,matchesProject,sortProjects,relatedProjects,formatBytes} from '../lib/project-utils.mjs';
import {resolveDeployment} from '../lib/deployment.mjs';
const a={slug:'circle',title:'円を動かす',subtitle:'C++ DxLib',description:'キーボードで移動',category:'GAME',technologies:['C++','DxLib'],publishedAt:'2026-10-17'};
const b={...a,slug:'tool',title:'変換ツール',category:'TOOL',technologies:['Python'],publishedAt:'2026-10-01'};
test('検索はNFKC・大小文字・複数キーワード・複合フィルタに対応',()=>{
 assert.ok(matchesProject(a,{query:'ｃ＋＋ 円',category:'GAME',technology:'DxLib'}));
 assert.ok(!matchesProject(a,{query:'円 Python'}));assert.ok(!matchesProject(a,{category:'TOOL'}));assert.ok(!matchesProject(a,{technology:'Unity'}));assert.ok(matchesProject(a,{query:'  '}));
});
test('並び替えは元の配列を変更しない',()=>{const list=[a,b];assert.equal(sortProjects(list,'oldest')[0].slug,'tool');assert.equal(sortProjects(list)[0].slug,'circle');assert.equal(list[0],a);});
test('関連作品は自身を除き、カテゴリと技術で関連付ける',()=>{const c={...a,slug:'other-game'};assert.deepEqual(relatedProjects(a,[a,b,c]).map(p=>p.slug),['other-game']);assert.deepEqual(relatedProjects(a,[a,b]),[]);});
test('YouTube ID・watch・短縮・shorts・embedを読み取る',()=>{const id='abcdefghijk';for(const value of [id,`https://www.youtube.com/watch?v=${id}&t=2`,`https://youtu.be/${id}?t=3`,`https://www.youtube.com/shorts/${id}`,`https://www.youtube.com/embed/${id}`])assert.equal(youtubeId(value),id);for(const value of ['','javascript:alert(1)','https://youtube.com.evil.invalid/watch?v=abcdefghijk','https://www.youtube.com/watch?v=bad','http://youtu.be/abcdefghijk'])assert.equal(youtubeId(value),null);});
test('配布先はGitHub ReleasesのZIPアセットのみ',()=>{assert.ok(isReleaseAsset('https://github.com/owner/repo/releases/download/v1.0/sample.zip'));for(const url of ['https://github.com/owner/repo','https://github.com/owner/repo/releases/tag/v1','https://github.com/owner/repo/releases/download/v1/app.exe','https://github.com.evil.invalid/o/r/releases/download/v1/a.zip','javascript:alert(1)','http://github.com/o/r/releases/download/v1/a.zip'])assert.ok(!isReleaseAsset(url));});
test('Pagesのプロジェクト配下・ルート・独自ドメインを処理',()=>{assert.deepEqual(resolveDeployment({},{}),{origin:'http://localhost:4321',base:'/',public:false});assert.equal(resolveDeployment({},{GITHUB_REPOSITORY:'demo/archive'}).base,'/archive/');assert.equal(resolveDeployment({},{GITHUB_REPOSITORY:'demo/demo.github.io'}).base,'/');assert.equal(resolveDeployment({siteUrl:'https://site.invalid'},{BASE_PATH:'/collection/'}).base,'/collection/');assert.throws(()=>resolveDeployment({siteUrl:'javascript:bad'},{}));assert.throws(()=>resolveDeployment({siteUrl:'https://site.invalid/wrong'},{}));assert.throws(()=>resolveDeployment({basePath:'/../bad'},{}));});
test('ファイルサイズの表示',()=>{assert.equal(formatBytes(0),'未設定');assert.equal(formatBytes(2048),'2.0 KB');assert.equal(formatBytes(1048576),'1.0 MB');});
test('公開ユーザー名だけでは公開先確定と扱わない',()=>{assert.deepEqual(resolveDeployment({githubOwner:'aoi-gamelab'},{}),{origin:'http://localhost:4321',base:'/',public:false});assert.deepEqual(resolveDeployment({githubOwner:'aoi-gamelab'},{GITHUB_REPOSITORY:'aoi-gamelab/archive'}),{origin:'https://aoi-gamelab.github.io',base:'/archive/',public:true});});
