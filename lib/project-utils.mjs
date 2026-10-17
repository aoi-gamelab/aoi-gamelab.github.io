export const categoryLabels = { GAME: 'ゲーム', TOOL: 'ツール', EXPERIMENT: '実験', UI: 'UI', OTHER: 'その他' };
export function youtubeId(value = '') {
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:') return null;
    if (u.hostname === 'youtu.be') return /^[A-Za-z0-9_-]{11}$/.test(u.pathname.slice(1)) ? u.pathname.slice(1) : null;
    if (!['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(u.hostname)) return null;
    const id = u.pathname === '/watch' ? u.searchParams.get('v') : u.pathname.match(/^\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})\/?$/)?.[1];
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}
export function isReleaseAsset(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && u.hostname === 'github.com' && /^\/[^/]+\/[^/]+\/releases\/download\/[^/]+\/[^/]+\.zip$/i.test(u.pathname) && !u.username && !u.password;
  } catch { return false; }
}
export function matchesProject(project, { query = '', category = '', technology = '' } = {}) {
  const normalize = (s) => s.normalize('NFKC').toLocaleLowerCase('ja');
  const searchable = normalize([project.title, project.subtitle, project.description, project.category, ...project.technologies].join(' '));
  return (!category || project.category === category) && (!technology || project.technologies.includes(technology)) && normalize(query).trim().split(/\s+/).every(word => searchable.includes(word));
}
export function sortProjects(projects, order = 'newest') {
  return [...projects].sort((a, b) => (order === 'oldest' ? 1 : -1) * a.publishedAt.localeCompare(b.publishedAt) || a.slug.localeCompare(b.slug));
}
export function relatedProjects(project, projects, limit = 3) {
  return projects.filter(p => p.slug !== project.slug).map(p => ({ project: p, score: (p.category === project.category ? 3 : 0) + p.technologies.filter(t => project.technologies.includes(t)).length })).filter(p => p.score > 0).sort((a, b) => b.score - a.score || b.project.publishedAt.localeCompare(a.project.publishedAt)).slice(0, limit).map(p => p.project);
}
export function formatBytes(bytes) {
  if (!bytes) return '未設定';
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
}
