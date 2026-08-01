import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const base = '/study-abroad-pinwheel';
const textExtensions = new Set(['.html', '.css', '.js', '.xml', '.txt']);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name))) continue;

    let content = fs.readFileSync(full, 'utf8');
    content = content
      .replaceAll('="/images/', `="${base}/images/`)
      .replaceAll("='/images/", `='${base}/images/`)
      .replaceAll('url("/images/', `url("${base}/images/`)
      .replaceAll("url('/images/", `url('${base}/images/`)
      .replaceAll('url(/images/', `url(${base}/images/`)
      .replaceAll('href="/signin', `href="${base}/signin`)
      .replaceAll('href="/signup', `href="${base}/signup`)
      .replaceAll('href="/password-reset', `href="${base}/password-reset`)
      .replaceAll('href="/categories', `href="${base}/categories`)
      .replaceAll('href="/"', `href="${base}/"`);
    fs.writeFileSync(full, content);
  }
}

walk(root);
