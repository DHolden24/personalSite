# personalSite

Darren Holden's personal site: a list of projects, with a page for each project and its privacy policy. It's a static site built with [Vue](https://vuejs.org), [Vue Router](https://router.vuejs.org), [Naive UI](https://www.naiveui.com) and [Vite](https://vite.dev). There is no backend.

## Development

```sh
npm install
npm run dev       # dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Adding a project

Create a folder in `src/projects/` named after the project. The folder name becomes its URL (`/projects/<folder>`).

```
src/projects/<id>/
  project.js     Metadata: name, icon, tagline, description, status, links, ...
  privacy.md     Optional privacy policy, served at /projects/<id>/privacy
```

Copy `src/projects/liechtenoter/project.js` as a starting point. The project is picked up automatically, with no other files to edit.

## Structure

```
index.html              Vite entry page
vite.config.js          Build config, including the clean-URL plugin
src/
  main.js               App bootstrap
  App.vue               Page shell: header, theme toggle, router view
  router.js             Routes
  site.js               Owner name, tagline and links
  projects.js           Loads everything in src/projects/
  pageTitle.js          Sets the browser tab title per page
  views/                One component per page
  components/           Shared components
  projects/             One folder per project
public/                 Files copied to the site as-is (favicon, images)
```

## URLs and hosting

Routes use real paths (`/projects/liechtenoter/privacy`), not `#` URLs. A static host only serves files that exist, so the build copies `index.html` into a folder for every project route, plus a `404.html` for anything else. Every real page therefore returns HTTP 200, which matters for links like the Google Play privacy policy URL.

The site deploys to GitHub Pages through `.github/workflows/deploy.yml` on every push to `main`. In the repo settings, under **Pages**, set **Source** to **GitHub Actions**. The workflow works out the base path itself (`/personalSite/` on github.io, or `/` with a custom domain).
