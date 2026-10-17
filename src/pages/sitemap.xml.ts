import type { APIRoute } from 'astro';
import {allProjects,pathTo} from '../lib/site';
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export const GET: APIRoute = async ({site}) => {
 const projects=await allProjects();
 const routes=[{path:'',date:''},{path:'projects/',date:''},{path:'about/',date:''},...projects.map(p=>({path:`projects/${p.slug}/`,date:p.updatedAt}))];
 const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>`<url><loc>${escape(new URL(pathTo(r.path),site).href)}</loc>${r.date?`<lastmod>${r.date}</lastmod>`:''}</url>`).join('')+'</urlset>';
 return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
