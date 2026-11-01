# adirar.github.io

Portfolio site of Aditya Raikwar, PhD: https://adirar.github.io

## What's in this folder

- `site-src/` is the source code (Astro). All content (projects, publications,
  skills, certificates, lab kit, timeline) lives in `site-src/src/data/*.json`.
- Everything else at the top level (`index.html`, `ai/`, `xr/`, `_astro/`,
  `images/`, `404.html`, `robots.txt`, `sitemap.xml`) is the built site that
  GitHub Pages serves. Don't edit these by hand; they are regenerated.

## View it on your computer

Opening `index.html` directly will look unstyled, because the site uses
paths from the web root. To preview locally, install Node.js 22 or later, then:

```
cd site-src
npm install
npm run dev
```

and open the address it prints (usually http://localhost:4321).

## Publish a change

1. Edit the files in `site-src/src/` (usually the JSON files in `src/data/`).
2. Run `site-src/deploy.sh` to rebuild the site into the top level of this folder.
3. Commit and push to the `main` branch; GitHub Pages updates in about a minute.
