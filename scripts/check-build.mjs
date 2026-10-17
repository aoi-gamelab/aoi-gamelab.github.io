import { readFile, readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import settings from '../site.config.json' with {type:'json'};
import {resolveDeployment} from '../lib/deployment.mjs';
const dist=path.resolve('dist');
const {base}=resolveDeployment(settings.deployment);
async function walk(dir){const files=[];for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);files.push(...entry.isDirectory()?await walk(file):[file]);}return files;}
const files=await walk(dist);const errors=[];let references=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=await readFile(file,'utf8');
 if(/file:\/\/|[A-Z]:\\Users\\|javascript:/i.test(html))errors.push(`${file}: forbidden local or script URL`);
 for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const raw=match[1];if(/^(?:https?:|data:|mailto:|tel:|#)/i.test(raw))continue;
  let target=decodeURIComponent(raw.replaceAll('&amp;','&').split(/[?#]/)[0]);
  if(!target)continue;
  if(target.startsWith('/')){
   if(!target.startsWith(base)){errors.push(`${path.relative(dist,file)}: missing base in ${raw}`);continue;}
   target=path.join(dist,target.slice(base.length));
  }else target=path.resolve(path.dirname(file),target);
  references++;
  if(!existsSync(target)&&!existsSync(path.join(target,'index.html')))errors.push(`${path.relative(dist,file)} -> ${raw}`);
 }
}
const source=await readdir('src/content/projects');
for(const name of source.filter(n=>n.endsWith('.json'))){const p=JSON.parse(await readFile(`src/content/projects/${name}`,'utf8'));if(!settings.showDemoProjects&&p.demo)continue;if(!existsSync(path.join(dist,'projects',p.slug,'index.html')))errors.push(`Missing page for ${p.slug}`);}
const report={base,htmlPages:files.filter(f=>f.endsWith('.html')).length,localReferences:references,errors};
await mkdir('test-results',{recursive:true});await writeFile('test-results/build-links.json',JSON.stringify(report,null,2));
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Build links OK: ${report.htmlPages} HTML pages, ${references} references, base=${base}`);
