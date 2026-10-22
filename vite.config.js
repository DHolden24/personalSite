import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Static hosts serve real files, so a deep link like /projects/liechtenoter/privacy
// only works if that path has an index.html. This copies the app shell to every
// project route (and to 404.html for anything else) so clean URLs return 200.
function staticRoutes() {
  let outDir;
  return {
    name: 'static-routes',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const shell = join(outDir, 'index.html');
      const copyShell = (route) => {
        const target = join(outDir, route, 'index.html');
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(shell, target);
      };

      const projectsDir = 'src/projects';
      for (const id of readdirSync(projectsDir)) {
        copyShell(`projects/${id}`);
        if (existsSync(join(projectsDir, id, 'privacy.md'))) copyShell(`projects/${id}/privacy`);
      }
      copyFileSync(shell, join(outDir, '404.html'));
    },
  };
}

export default defineConfig({
  // GitHub Pages serves project sites from /<repo>/; the deploy workflow sets BASE_PATH.
  base: `${process.env.BASE_PATH ?? ''}/`,
  plugins: [vue(), staticRoutes()],
  test: {
    environment: 'happy-dom',
  },
});
