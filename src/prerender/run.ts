import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { REFERENCE_PAGES } from '../data/reference';
import { validateReferencePages } from '../data/reference/validate';
import { render } from '../entry-server';
import { injectPage, outputFileFor } from './inject';
import { writeOgImages } from './og';
import { PRERENDER_PATHS, XML_SITEMAP_PATHS } from './routes';
import { buildRobotsTxt, buildSitemap } from '../seo/files';
import { GA4_MEASUREMENT_ID } from '../seo/analytics';
import { renderHead } from '../seo/head';
import { buildSeoMeta } from '../seo/meta';
import { writtenRouteSet } from '../seo/og';

/**
 * The prerender work lives in a function, not at module scope.
 *
 * Why: this file is the SSR entry chunk. Rollup hoists every module the
 * lazily-imported route chunks share (KNOWLEDGE_DATA, ALL_POEMS, the SEO
 * constants, storage helpers) into this chunk and re-exports them. If this
 * module had a top-level `await`, the entry would be an async module whose
 * evaluation blocks until that await settles — and the route chunks, which
 * import *back* into this chunk for those shared exports, would be waiting on
 * an entry that is itself waiting on them. The import never resolves, the
 * prerender hangs on its first route, and Node exits with "unsettled
 * top-level await".
 *
 * Keeping the await inside `run()` means the chunk's exports are ready the
 * moment the module is evaluated, so the circular reference resolves.
 */
export async function run(): Promise<void> {
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
    const appHtml = await render(route);
    const html = injectPage(template, {
      appHtml,
      headHtml: renderHead(meta, GA4_MEASUREMENT_ID),
      htmlLang: meta.htmlLang,
    });
    const outFile = join(distDir, outputFileFor(route));
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, html);
    written++;
  }

  writeFileSync(join(distDir, 'robots.txt'), buildRobotsTxt());
  writeFileSync(join(distDir, 'sitemap.xml'), buildSitemap(XML_SITEMAP_PATHS));

  console.log(
    `prerendered ${written} pages (+ robots.txt, sitemap.xml, ${ogWritten.length} og images)`,
  );
}
