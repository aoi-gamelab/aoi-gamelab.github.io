import {mkdir,writeFile,access} from 'node:fs/promises';
const slug=process.argv[2];
if(!slug||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)){console.error('使い方: npm run new:project -- my-project（英小文字・数字・ハイフン）');process.exit(1);}
const file=`src/content/projects/${slug}.json`;
try{await access(file);console.error('同じslugの作品が既にあります。上書きしません。');process.exit(1);}catch(error){if(error.code!=='ENOENT')throw error;}
const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo'}).format(new Date());
const project={slug,title:'作品タイトル',subtitle:'短いサブタイトル',description:'作品の内容を1〜2文で説明します。',category:'GAME',technologies:['C++','DxLib'],status:'開発中',publishedAt:today,updatedAt:today,featured:false,demo:false,thumbnail:'',heroImage:'',screenshots:[],overview:['何を作ったか、どんな人に使ってほしいかを紹介します。'],features:[],technicalNotes:[],youtubeUrl:'',downloadUrl:'',fileName:'',fileSize:0,version:'',platform:['Windows 11'],requirements:[],installationSteps:[],changelog:[]};
await mkdir('src/content/projects',{recursive:true});await writeFile(file,JSON.stringify(project,null,2)+'\n',{flag:'wx'});console.log(`作成しました: ${file}\nこのJSONを編集し、npm run buildで確認してください。`);
