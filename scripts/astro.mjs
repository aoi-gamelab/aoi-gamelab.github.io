import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import path from 'node:path';
const pkg=JSON.parse(readFileSync('node_modules/astro/package.json','utf8'));
const result=spawnSync(process.execPath,[path.join('node_modules/astro',pkg.bin.astro),...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});
if(result.error)throw result.error;process.exit(result.status??1);
