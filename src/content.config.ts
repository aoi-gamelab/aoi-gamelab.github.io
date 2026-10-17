import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { isReleaseAsset, youtubeId } from '../lib/project-utils.mjs';
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v, '実在する日付をYYYY-MM-DDで入力してください');
const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1).max(100),
    subtitle: z.string().default(''),
    description: z.string().min(1),
    category: z.enum(['GAME', 'TOOL', 'EXPERIMENT', 'UI', 'OTHER']),
    technologies: z.array(z.string().min(1)).min(1),
    status: z.enum(['公開中', '配布準備中', '開発中', 'デモ']),
    publishedAt: date,
    updatedAt: date,
    featured: z.boolean().default(false),
    demo: z.boolean().default(false),
    thumbnail: z.string().default(''),
    heroImage: z.string().default(''),
    screenshots: z.array(z.object({ src: z.string(), alt: z.string().min(1) })).default([]),
    overview: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    technicalNotes: z.array(z.string()).default([]),
    youtubeUrl: z.string().default('').refine(v => !v || youtubeId(v) !== null, 'YouTube URLか11文字の動画IDを入力してください'),
    downloadUrl: z.string().default('').refine(v => !v || isReleaseAsset(v), 'GitHub ReleasesのZIPアセットURLを入力してください'),
    fileName: z.string().default(''),
    fileSize: z.number().int().nonnegative().default(0),
    version: z.string().default(''),
    platform: z.array(z.string()).default([]),
    requirements: z.array(z.string()).default([]),
    installationSteps: z.array(z.string()).default([]),
    changelog: z.array(z.object({ date, version: z.string(), changes: z.array(z.string()) })).default([])
  }).refine(p => p.updatedAt >= p.publishedAt, { message: '更新日は公開日以降にしてください' }).refine(p => !p.demo || (!p.downloadUrl && !p.youtubeUrl), { message: 'デモ作品には架空の配布・動画URLを設定しないでください' }).refine(p => !p.downloadUrl || (!!p.fileName && !!p.fileSize && !!p.version), { message: '配布時はファイル名・バイト数・バージョンも設定してください' })
});
export const collections = { projects };
