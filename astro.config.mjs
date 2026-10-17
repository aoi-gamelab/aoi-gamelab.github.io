import { defineConfig } from 'astro/config';
import settings from './site.config.json' with { type: 'json' };
import { resolveDeployment } from './lib/deployment.mjs';
const deployment = resolveDeployment(settings.deployment);
export default defineConfig({
  site: deployment.origin,
  base: deployment.base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false }
});
