// Each folder in src/projects/ is one project: project.js holds its metadata
// and an optional privacy.md holds its privacy policy.
const metas = import.meta.glob('./projects/*/project.js', { eager: true, import: 'default' });
const policies = import.meta.glob('./projects/*/privacy.md', { eager: true, query: '?raw', import: 'default' });

const folderOf = (path) => path.split('/')[2];

export const projects = Object.entries(metas)
  .map(([path, meta]) => {
    const id = folderOf(path);
    return { ...meta, id, privacyPolicy: policies[`./projects/${id}/privacy.md`] ?? null };
  })
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const findProject = (id) => projects.find((p) => p.id === id);
