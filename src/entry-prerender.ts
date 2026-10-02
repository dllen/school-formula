import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { REFERENCE_PAGES } from './data/reference';
import { validateReferencePages } from './data/reference/validate';
import { render } from './entry-server';
import { injectPage, outputFileFor } from './prerender/inject';
import { writeOgImages } from './prerender/og';
import { PRERENDER_PATHS } from './prerender/routes';
import { buildRobotsTxt, buildSitemap } from './seo/files';
import { renderHead } from './seo/head';
import { buildSeoMeta } from './seo/meta';
import { writtenRouteSet } from './seo/og';

validateReferencePages(REFERENCE_PAGES);

const distDir = join(process.cwd(), 'dist');
const template = readFileSync(join(distDir, 'index.html'), 'utf8');

// og 图必须先渲染：页面上的 og:image 标签要以「哪些图真的写出来了」为准，而不是以
// 静态路由表为准。渲染失败的那页必须省略标签（spec:220），否则社交卡片会指向一个
// 不存在的文件。反过来先写页面的话，就拿不到这个信息了。
const ogWritten = await writeOgImages(distDir);
const ogRoutes = writtenRouteSet(ogWritten);

let written = 0;
for (const route of PRERENDER_PATHS) {
  const meta = buildSeoMeta(route, ogRoutes);
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

console.log(
  `prerendered ${written} pages (+ robots.txt, sitemap.xml, ${ogWritten.length} og images)`,
);
