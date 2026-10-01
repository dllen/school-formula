import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { render } from './entry-server';
import { injectPage, outputFileFor } from './prerender/inject';
import { PRERENDER_PATHS } from './prerender/routes';
import { buildRobotsTxt, buildSitemap } from './seo/files';
import { renderHead } from './seo/head';
import { buildSeoMeta } from './seo/meta';

const distDir = join(process.cwd(), 'dist');
const template = readFileSync(join(distDir, 'index.html'), 'utf8');

let written = 0;
for (const route of PRERENDER_PATHS) {
  const meta = buildSeoMeta(route);
  const html = injectPage(template, {
    appHtml: render(route),
    headHtml: renderHead(meta),
    htmlLang: meta.htmlLang,
  });
  const outFile = join(distDir, outputFileFor(route));
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  written++;
}

writeFileSync(join(distDir, 'robots.txt'), buildRobotsTxt());
writeFileSync(join(distDir, 'sitemap.xml'), buildSitemap(PRERENDER_PATHS));

console.log(`prerendered ${written} pages (+ robots.txt, sitemap.xml)`);
