import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const base = '/study-abroad-pinwheel';
const textExtensions = new Set(['.html', '.css', '.js', '.xml', '.txt']);

// Astro already prefixes generated /_astro assets when `base` is configured.
// Only rewrite root-relative content and navigation paths that the theme itself owns.
const replacements = [
  ['="/images/', `="${base}/images/`],
  ["='/images/", `='${base}/images/`],
  ['url("/images/', `url("${base}/images/`],
  ["url('/images/", `url('${base}/images/`],
  ['url(/images/', `url(${base}/images/`],
  ['href="/"', `href="${base}/"`],
  ["href='/'", `href='${base}/'`],
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name))) continue;

    let content = fs.readFileSync(full, 'utf8');
    for (const [from, to] of replacements) {
      content = content.replaceAll(from, to);
    }
    fs.writeFileSync(full, content);
  }
}

walk(root);

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (index.includes(`${base}${base}/_astro/`)) {
  throw new Error('GitHub Pages base path was duplicated for Astro assets');
}
if (index.includes('="/_astro/') || index.includes("='/_astro/")) {
  throw new Error('Root-level Astro asset paths remain in dist/index.html');
}
