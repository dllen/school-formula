// src/prerender/og.ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import satori from 'satori';
import { CATEGORY_COPY } from '../data/reference/en/categories';
import { EN } from '../i18n/languages';
import { OG_ROUTES, type OgRoute } from '../seo/og-routes';
import { englishChartSubject } from '../seo/content-en';
import { brandFor } from '../seo/site';
import { CARD, buildOgCardFrom, chartCardInput } from './og-card';
import type { OgCardInput, SatoriElement } from './og-card';

export { OG_ROUTES, type OgRoute };

const require = createRequire(import.meta.url);
const FONT_DIR = join(process.cwd(), 'assets', 'fonts');

let initialised = false;

/** resvg 的 wasm 需要显式初始化，每进程一次即可。 */
async function ensureWasm(): Promise<void> {
  if (initialised) return;
  const wasmPath = require.resolve('@resvg/resvg-wasm/index_bg.wasm');
  await initWasm(readFileSync(wasmPath));
  initialised = true;
}

/**
 * 构建期字体。
 *
 * Inter 只覆盖 latin 子集（230 个码点），而英文面数据的正文里有 √、θ、α、β、∓、
 * 上标 ⁴⁷⁸⁹⁻ 与下标 ₐₑₚ——satori 会把它们画成 .notdef 豆腐块（实测：Inter 单独渲染
 * 这七个字符给出逐字节相同的路径）。所以配一个伴随字体。
 *
 * DejaVu Sans 是唯一一个被验证同时覆盖希腊字母、数学符号与上下标块的可用字体
 * （@fontsource 的 Noto Sans Math / Noto Sans / Charis SIL / Gentium Plus 都不含
 * U+2090-209A，STIX Two Math 也不含）。satori **确实跨字体回退**，且是逐字形的：
 * 有 Inter 的字形仍走 Inter，缺的才落到伴随字体上——这两点都是实测出来的，见
 * src/prerender/og.test.ts 的字形覆盖断言。
 */
function loadFonts() {
  const inter = [
    { name: 'Inter', weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', weight: 700 as const, style: 'normal' as const },
  ].map((font) => ({
    ...font,
    data: readFileSync(join(FONT_DIR, `inter-latin-${font.weight}-normal.woff`)),
  }));

  const companion = readFileSync(join(FONT_DIR, 'dejavu-sans-latin-400-normal.woff'));
  return [
    ...inter,
    // 400 与 700 都注册同一份数据：卡片上现在只有品牌行是粗体（纯 ASCII），但让
    // 「粗体 + 伴随字形」变成未知数没有意义——多一份引用而已，不额外读盘。
    { name: 'DejaVu Sans', weight: 400 as const, style: 'normal' as const, data: companion },
    { name: 'DejaVu Sans', weight: 700 as const, style: 'normal' as const, data: companion },
  ];
}

export type OgFonts = ReturnType<typeof loadFonts>;

/**
 * 每个目标对应的卡片入参。导出是为了让字形覆盖与几何对齐测试用**同一份**构造逻辑——
 * 测试自己再拼一遍的话，改了一处另一处不会跟着变，测的就不是真正渲染的那张卡。
 */
export function cardInputFor(entry: OgRoute): OgCardInput {
  const brand = brandFor(EN);

  switch (entry.kind) {
    case 'home':
      return { title: brand.name, subtitle: brand.tagline };
    case 'chart':
      return chartCardInput(entry.page);
    case 'hub': {
      const copy = CATEGORY_COPY[entry.category];
      // 学科名与 "Charts" 后缀取自 content-en.ts 的同一个函数，SERP 标题用的是
      // 它的完整模板——两处不再各拼一遍，改一处不会让卡片与标题分叉。
      return { title: englishChartSubject(copy.name), subtitle: copy.summary };
    }
  }
}

/** 每个目标对应的卡片元素树。 */
export function cardFor(entry: OgRoute): SatoriElement {
  return buildOgCardFrom(cardInputFor(entry), brandFor(EN));
}

export { loadFonts };

/** 准备渲染器：wasm 初始化 + 字体载入。两者都是进程级前置条件，不随单页变化。 */
async function prepareRenderer(): Promise<ReturnType<typeof loadFonts>> {
  await ensureWasm();
  return loadFonts();
}

/**
 * 渲染并写入 OG 图。**逐张回退，绝不 throw**——一张图失败不该让整个部署挂掉；
 * 失败的那页在任务 6 之后会因为没有图而自然省略 og:image 标签。
 *
 * `prepare` 默认就是真实实现。留这个形参是为了让「前置条件失败」那条路径**可测**：
 * 字体缺失时 loadFonts 会 throw，而 FONT_DIR 在模块加载时就固定成
 * `join(process.cwd(), 'assets', 'fonts')` 了，测试没有别的办法让它失败
 * （除非真去删仓库里的字体文件）。
 */
export async function writeOgImages(
  distDir: string,
  prepare: () => Promise<ReturnType<typeof loadFonts>> = prepareRenderer,
): Promise<OgRoute[]> {
  // wasm 初始化与字体载入要在逐张 try 之外（它们不是单页的事），但**同样必须被兜住**：
  // writeOgImages 是被 entry-prerender.ts 顶层 await 的，从这里抛出去就是一个
  // unhandled rejection，整个 `npm run build` 直接死——spec:220 明文禁止
  // （"渲染失败回退，不 throw……而不是挂掉构建"），而 spec:381 恰好点名了这个场景
  // （"不提交字体文件它直接报错"）。前置条件失败 = 一张图也做不出来，所以整批跳过，
  // 留一条醒目的警告；构建日志里的 `0 og images` 会同时把它暴露出来。
  let fonts: ReturnType<typeof loadFonts>;
  try {
    fonts = await prepare();
  } catch (error) {
    console.warn(`og: skipped all ${OG_ROUTES.length} cards — ${(error as Error).message}`);
    return [];
  }

  const written: OgRoute[] = [];
  for (const entry of OG_ROUTES) {
    try {
      const svg = await satori(cardFor(entry) as never, {
        width: CARD.width,
        height: CARD.height,
        fonts,
      });
      const resvg = new Resvg(svg);
      const rendered = resvg.render();
      const png = rendered.asPng();

      const outFile = join(distDir, entry.path);
      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, png);

      // 文件确实落盘了才计入——free 失败不该让一张已经在磁盘上的图漏报。
      written.push(entry);

      // wasm 版要求手动释放（该包的 README 原文：Wasm-based instances require manual
      // memory management via .free()）。10 张图的泄漏量可忽略，但图数一旦增长
      // （阶段 E 铺到 100 页）就是线性的。**先写盘再 free**——asPng() 的返回值
      // 若是 wasm 内存的视图，free 之后就读不到了。
      // 单独兜一层：释放失败只警告，不能把一张已经写好的图报成 "skipped"。
      try {
        rendered.free();
        resvg.free();
      } catch (error) {
        console.warn(`og: leak on ${entry.route} — ${(error as Error).message}`);
      }
    } catch (error) {
      console.warn(`og: skipped ${entry.route} — ${(error as Error).message}`);
    }
  }

  return written;
}
