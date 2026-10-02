// src/prerender/og.ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import satori from 'satori';
import { pagesInCategory } from '../data/reference';
import { CATEGORY_COPY } from '../data/reference/en/categories';
import type { ReferenceCategory, ReferencePage } from '../data/reference/types';
import { EN } from '../i18n/languages';
import {
  categoryPath,
  ENGLISH_HOME,
  REFERENCE_CATEGORIES,
  referencePath,
} from '../reference-routes';
import { brandFor } from '../seo/site';
import { buildOgCard, buildOgCardFrom } from './og-card';

const require = createRequire(import.meta.url);
const FONT_DIR = join(process.cwd(), 'assets', 'fonts');

/**
 * 一个待生成 OG 图的目标。刻意带上 kind，而不是从路径字符串反推是 hub 还是图表页——
 * 字符串反推很脆，判别联合也让 cardFor 成为一个干净的 switch。
 */
export type OgRoute =
  | { kind: 'home'; route: string; path: string }
  | { kind: 'hub'; route: string; path: string; category: ReferenceCategory }
  | { kind: 'chart'; route: string; path: string; page: ReferencePage };

/** `/en/`、三个学科 hub、六张图表页——只覆盖英文面 10 页。 */
export const OG_ROUTES: OgRoute[] = [
  { kind: 'home', route: ENGLISH_HOME, path: 'og/en.png' },
  ...REFERENCE_CATEGORIES.flatMap((category) => [
    { kind: 'hub' as const, route: categoryPath(category), path: `og/${category}.png`, category },
    ...pagesInCategory(category).map((page) => ({
      kind: 'chart' as const,
      route: referencePath(page.category, page.slug),
      path: `og/${page.category}/${page.slug}.png`,
      page,
    })),
  ]),
];

let initialised = false;

/** resvg 的 wasm 需要显式初始化，每进程一次即可。 */
async function ensureWasm(): Promise<void> {
  if (initialised) return;
  const wasmPath = require.resolve('@resvg/resvg-wasm/index_bg.wasm');
  await initWasm(readFileSync(wasmPath));
  initialised = true;
}

function loadFonts() {
  return [
    { name: 'Inter', weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', weight: 700 as const, style: 'normal' as const },
  ].map((font) => ({
    ...font,
    data: readFileSync(join(FONT_DIR, `inter-latin-${font.weight}-normal.woff`)),
  }));
}

/** 每个目标对应的卡片元素树。 */
function cardFor(entry: OgRoute) {
  const brand = brandFor(EN);

  switch (entry.kind) {
    case 'home':
      return buildOgCardFrom({ title: brand.name, subtitle: brand.tagline }, brand);
    case 'chart':
      return buildOgCard(entry.page, brand);
    case 'hub': {
      const copy = CATEGORY_COPY[entry.category];
      return buildOgCardFrom(
        { title: `Printable ${copy.name} Charts`, subtitle: copy.summary },
        brand,
      );
    }
  }
}

/**
 * 渲染并写入 OG 图。**逐张回退，绝不 throw**——一张图失败不该让整个部署挂掉；
 * 失败的那页在任务 6 之后会因为没有图而自然省略 og:image 标签。
 */
export async function writeOgImages(distDir: string): Promise<number> {
  await ensureWasm();
  const fonts = loadFonts();

  let written = 0;
  for (const entry of OG_ROUTES) {
    try {
      const svg = await satori(cardFor(entry) as never, {
        width: 1200,
        height: 630,
        fonts,
      });
      const resvg = new Resvg(svg);
      const rendered = resvg.render();
      const png = rendered.asPng();

      const outFile = join(distDir, entry.path);
      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, png);

      // wasm 版要求手动释放（该包的 README 原文：Wasm-based instances require manual
      // memory management via .free()）。10 张图的泄漏量可忽略，但图数一旦增长
      // （阶段 E 铺到 100 页）就是线性的。**先写盘再 free**——asPng() 的返回值
      // 若是 wasm 内存的视图，free 之后就读不到了。
      rendered.free();
      resvg.free();

      written++;
    } catch (error) {
      console.warn(`og: skipped ${entry.route} — ${(error as Error).message}`);
    }
  }

  return written;
}
