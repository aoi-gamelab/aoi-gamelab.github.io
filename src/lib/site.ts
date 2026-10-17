import settings from '../../site.config.json';
import { getCollection, type CollectionEntry } from 'astro:content';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
export const site = settings;
export type Project = CollectionEntry<'projects'>['data'];
export function pathTo(path = '') { return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`; }
export function imagePath(value = '') {
  const clean = value.replace(/^\//, '');
  if (clean && !clean.includes('..') && existsSync(resolve('public', clean))) return pathTo(clean);
  return pathTo('images/fallback.svg');
}
export const dateLabel = (date: string) => date.replaceAll('-', '.');
export async function allProjects(): Promise<Project[]> {
  const entries = await getCollection('projects');
  const projects = entries.map(p => p.data).filter(p => settings.showDemoProjects || !p.demo);
  if (new Set(projects.map(p => p.slug)).size !== projects.length) throw new Error('作品のslugが重複しています');
  return projects.sort((a,b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));
}
