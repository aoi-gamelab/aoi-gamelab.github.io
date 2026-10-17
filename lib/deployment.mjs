export function resolveDeployment(config, env = process.env) {
  const repository = env.GITHUB_REPOSITORY || '';
  const [envOwner, envRepo] = repository.split('/');
  const owner = config.githubOwner || envOwner || '';
  const repo = config.githubRepository || envRepo || '';
  const customOrigin = env.SITE_URL || config.siteUrl;
  let origin = customOrigin || (owner && repo ? `https://${owner}.github.io` : 'http://localhost:4321');
  const parsed = new URL(origin);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('SITE_URL must be an http(s) URL');
  if (parsed.pathname !== '/' || parsed.search || parsed.hash) throw new Error('SITE_URL contains only the origin. Put the path in basePath.');
  origin = parsed.origin;
  const explicitBase = env.BASE_PATH || config.basePath;
  const inferredBase = repo && repo.toLowerCase() !== `${owner}.github.io`.toLowerCase() ? `/${repo}/` : '/';
  const rawBase = explicitBase || (customOrigin ? '/' : inferredBase);
  if (rawBase.includes('..') || /[?#\\]/.test(rawBase)) throw new Error('Invalid basePath');
  const base = '/' + rawBase.split('/').filter(Boolean).join('/') + '/';
  return { origin, base: base === '//' ? '/' : base, public: !['localhost', '127.0.0.1'].includes(parsed.hostname) };
}
