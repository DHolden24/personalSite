# personalSite

Darren Holden's personal website. It's plain HTML, CSS and JavaScript, with no backend and no build step.

## Structure

```
index.html        Entry page
css/styles.css    Styles (theme colors are CSS custom properties)
js/main.js        Entry script (ES module)
js/theme.js       Light/dark theme toggle
assets/images/    Images and other static files
```

## Running locally

ES modules don't load over `file://`, so serve the folder with any static server:

```sh
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000.

## Deploying

The repo root is the site, so any static host works (GitHub Pages, Netlify, Cloudflare Pages, etc.) with no build command and `/` as the publish directory.
