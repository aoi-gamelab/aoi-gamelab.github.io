import {readFile,readdir,stat} from 'node:fs/promises';
import settings from '../site.config.json' with {type:'json'};
import {resolveDeployment} from '../lib/deployment.mjs';
import {isReleaseAsset} from '../lib/project-utils.mjs';
const deployment=resolveDeployment(settings.deployment);let missing=0;
console.log('公開準備チェック（アップロード・公開操作は行いません）');
if(!deployment.public){console.log(`未設定: 公開先（GitHubユーザー名=${settings.deployment.githubOwner||'未設定'}、リポジトリ名=${settings.deployment.githubRepository||'未設定'}、またはSITE_URLを設定）`);missing++;}else console.log('Pages URL:',deployment.origin+deployment.base);
if(!settings.youtubeUrl){console.log('未設定: YouTubeチャンネルURL');missing++;}
for(const name of await readdir('src/content/projects')){
 if(!name.endsWith('.json'))continue;const p=JSON.parse(await readFile(`src/content/projects/${name}`,'utf8'));if(p.demo)continue;
 if(!p.downloadUrl){console.log(`配布準備中: ${p.title}（GitHub ReleasesのZIP URL）`);missing++;}else if(!isReleaseAsset(p.downloadUrl)){console.log(`不正な配布URL: ${p.slug}`);missing++;}
 if(!p.youtubeUrl)console.log(`動画URL未設定: ${p.title}（動画セクションは非表示）`);
 try{const size=(await stat(`release-assets/${p.fileName}`)).size;if(size!==p.fileSize){console.log(`サイズ不一致: ${p.fileName} JSON=${p.fileSize}, ZIP=${size}`);missing++;}}catch{console.log(`ローカルZIPなし: ${p.fileName}（Releasesへアップロード済みなら問題ありません）`);}
}
console.log(`${missing}件の公開・配布用の設定が残っています。`);if(missing)process.exitCode=1;
