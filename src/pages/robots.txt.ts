import type { APIRoute } from 'astro';
import {site as config,pathTo} from '../lib/site';
import {resolveDeployment} from '../../lib/deployment.mjs';
export const GET: APIRoute = ({site}) => new Response(`User-agent: *\n${resolveDeployment(config.deployment).public?'Allow: /':'Disallow: /'}\nSitemap: ${new URL(pathTo('sitemap.xml'),site).href}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
