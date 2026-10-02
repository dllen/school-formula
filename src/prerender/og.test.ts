// @vitest-environment node
// resvg 的 wasm 需要真实的 Node 全局；happy-dom 环境会干扰它的初始化。
import { describe, expect, it } from 'vitest';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import satori from 'satori';
import { CARD, measureOgCard } from './og-card';
import { OG_ROUTES, cardFor, cardInputFor, loadFonts, writeOgImages } from './og';

describe('OG_ROUTES', () => {
  it('covers the English surface only: home, three hubs, six charts', () => {
    expect(OG_ROUTES).toHaveLength(10);
    // 名字里的 1/3/6 必须真被断言。只写 toHaveLength(10) 的话，把一张图表页换成
    // 第二个 hub 照样能过——真正有鉴别力的是这条拆分。
    expect(OG_ROUTES.filter((entry) => entry.kind === 'home')).toHaveLength(1);
    expect(OG_ROUTES.filter((entry) => entry.kind === 'hub')).toHaveLength(3);
    expect(OG_ROUTES.filter((entry) => entry.kind === 'chart')).toHaveLength(6);
    expect(OG_ROUTES.map((entry) => entry.path)).toContain('og/en.png');
    expect(OG_ROUTES.map((entry) => entry.path)).toContain('og/math.png');
    expect(OG_ROUTES.map((entry) => entry.path)).toContain('og/math/multiplication-chart.png');
  });

  it('never writes outside dist/og', () => {
    for (const entry of OG_ROUTES) {
      expect(entry.path.startsWith('og/')).toBe(true);
      expect(entry.path).not.toContain('..');
    }
  });

  it('does not touch the Chinese pages', () => {
    // 不能只写 startsWith('/en')：'/english/…' 也满足它，而那不是英文面。
    for (const entry of OG_ROUTES) {
      expect(entry.route === '/en/' || entry.route.startsWith('/en/'), entry.route).toBe(true);
    }
  });
});

describe('writeOgImages', () => {
  it('writes one distinct 1200×630 PNG per route', async () => {
    const distDir = mkdtempSync(join(tmpdir(), 'og-test-'));
    try {
      const written = await writeOgImages(distDir);
      expect(written).toHaveLength(10);
      // 返回值是「真的写成功的路由」——标签的有无以它为准，所以它必须与 OG_ROUTES 一一对应。
      expect(new Set(written.map((entry) => entry.path))).toEqual(
        new Set(OG_ROUTES.map((entry) => entry.path)),
      );

      // 逐张核对：文件真在盘上、是真 PNG、尺寸对。只读回一张的话，
      // 「渲染一张然后复制十份」这种 bug 能整个溜过去。
      const pngs = OG_ROUTES.map((entry) => {
        const png = readFileSync(join(distDir, entry.path));
        // PNG 魔术字节
        expect(png.subarray(0, 8), entry.path).toEqual(
          Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        );
        expect(png.byteLength, entry.path).toBeGreaterThan(2000);
        // PNG 的 IHDR：宽在 16..19 字节、高在 20..23，都是大端。
        expect(png.readUInt32BE(16), entry.path).toBe(1200);
        expect(png.readUInt32BE(20), entry.path).toBe(630);
        return png;
      });

      // 十张内容互不相同——同一张图复制十份同样是坏的。
      expect(new Set(pngs.map((png) => png.toString('base64'))).size).toBe(10);

      expect(readdirSync(join(distDir, 'og/math'))).toContain('metric-conversions.png');
    } finally {
      rmSync(distDir, { recursive: true, force: true });
    }
  }, 120_000);

  it('degrades to zero cards instead of rejecting when the renderer cannot be prepared', async () => {
    // spec:220 —— 渲染失败回退，不 throw。字体缺失（spec:381 恰好点名的场景
    // "不提交字体文件它直接报错"）与 wasm 初始化失败都发生在这里，而 writeOgImages
    // 是被 entry-prerender.ts 顶层 await 的：从这里抛出去就是 unhandled rejection，
    // 整个 `npm run build` 死。这条用例就是钉住那个「不 throw」。
    const distDir = mkdtempSync(join(tmpdir(), 'og-fallback-'));
    try {
      await expect(
        writeOgImages(distDir, () => Promise.reject(new Error('ENOENT: missing font'))),
      ).resolves.toHaveLength(0);
    } finally {
      rmSync(distDir, { recursive: true, force: true });
    }
  });
});

// ---------------------------------------------------------------------------
// 渲染层的鉴别力
//
// 下面两组断言都**不经过元素树**：它们拿 satori 真正吐出来的 SVG 来说话。
// 上一轮那两个缺陷（字体缺字画成豆腐块、写死 56px 的格子里文字折行重叠）之所以
// 能在 451 个测试全绿的情况下出厂，就是因为所有断言都停在元素树那一层——树里
// 字符串当然是对的，坏掉的是栅格化那一步。
// ---------------------------------------------------------------------------

/**
 * 一条 SVG path 的包围盒。
 *
 * satori 给文本用的都是绝对命令（M/L/Q/Z），但解析按命令元数走，不靠「所有数字
 * 交替是 x/y」这种巧合——`A` 是 7 个参数，靠交替会错位。
 */
function pathBBox(d: string): { minX: number; minY: number; maxX: number; maxY: number } {
  const ARITY: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  let cx = 0;
  let cy = 0;
  let startX = 0;
  let startY = 0;
  let command = '';
  let index = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const cover = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  while (index < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[index])) {
      command = tokens[index];
      index += 1;
      if (command === 'Z' || command === 'z') {
        cx = startX;
        cy = startY;
        continue;
      }
    }
    const arity = ARITY[command.toUpperCase()];
    if (arity === undefined) throw new Error(`unsupported path command ${command} in ${d.slice(0, 40)}`);
    const args: number[] = [];
    for (let k = 0; k < arity; k++) args.push(Number(tokens[index + k]));
    index += arity;

    const relative = command === command.toLowerCase();
    const originX = relative ? cx : 0;
    const originY = relative ? cy : 0;
    if (command.toUpperCase() === 'H') {
      cx = originX + args[0];
    } else if (command.toUpperCase() === 'V') {
      cy = originY + args[0];
    } else {
      for (let k = 0; k + 1 < args.length; k += 2) cover(originX + args[k], originY + args[k + 1]);
      cx = originX + args[args.length - 2];
      cy = originY + args[args.length - 1];
      if (command.toUpperCase() === 'M') {
        startX = cx;
        startY = cy;
      }
    }
    cover(cx, cy);
  }
  return { minX, minY, maxX, maxY };
}

/** SVG 里每一段文本的包围盒，按文档顺序。satori 把一段文本放进一个 `<g>`。 */
function textInkBoxes(svg: string): { minX: number; minY: number; maxX: number; maxY: number }[] {
  const boxes: { minX: number; minY: number; maxX: number; maxY: number }[] = [];
  for (const group of svg.matchAll(/<g>([\s\S]*?)<\/g>/g)) {
    let box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (const path of group[1].matchAll(/\bd="([^"]*)"/g)) {
      const next = pathBBox(path[1]);
      box = {
        minX: Math.min(box.minX, next.minX),
        minY: Math.min(box.minY, next.minY),
        maxX: Math.max(box.maxX, next.maxX),
        maxY: Math.max(box.maxY, next.maxY),
      };
    }
    if (box.minX !== Infinity) boxes.push(box);
  }
  return boxes;
}

async function renderSvg(entry: (typeof OG_ROUTES)[number], fonts: unknown) {
  return satori(cardFor(entry) as never, {
    width: CARD.width,
    height: CARD.height,
    fonts: fonts as never,
  });
}

/**
 * 在这套字体下画不出来的字符（.notdef 豆腐块）。
 *
 * 判据不是「查 cmap」，而是**真的渲染一遍**：豆腐块的特征是每个缺字都给出逐字节
 * 相同的路径，所以先渲染一个必然缺失的字符（U+4E2D 中文，两套字体都没有）拿到
 * 参照包围盒，再逐字比对。这条判据本身就被测过——见下面那条「能被 ☃ 之类骗过吗」。
 */
async function unrenderableChars(chars: Iterable<string>, fonts: unknown): Promise<string[]> {
  const probe = async (text: string) => {
    const svg = await satori(
      { type: 'div', props: { style: { display: 'flex', fontSize: 40 }, children: text } } as never,
      { width: 240, height: 96, fonts: fonts as never },
    );
    return textInkBoxes(svg)[0];
  };

  const notdef = await probe('中');
  const missing: string[] = [];
  for (const ch of chars) {
    if (/\s/.test(ch)) continue;
    const box = await probe(ch);
    const same =
      box !== undefined &&
      Math.abs(box.minX - notdef.minX) < 0.05 &&
      Math.abs(box.maxX - notdef.maxX) < 0.05 &&
      Math.abs(box.minY - notdef.minY) < 0.05 &&
      Math.abs(box.maxY - notdef.maxY) < 0.05;
    if (same) missing.push(ch);
  }
  return missing;
}

/** 卡片用到的全部字符（文本节点）与其盒子（预览块的单元格 / 公式行）。 */
function cardChars(node: unknown, into: Set<string>): void {
  if (typeof node === 'string') {
    for (const ch of node) into.add(ch);
  } else if (Array.isArray(node)) {
    for (const child of node) cardChars(child, into);
  } else if (node && typeof node === 'object' && 'props' in node) {
    cardChars((node as { props: { children?: unknown } }).props.children, into);
  }
}

describe('card glyph coverage', () => {
  it('draws every character the cards use, in the fonts that ship with them', async () => {
    const fonts = loadFonts();
    const chars = new Set<string>();
    for (const entry of OG_ROUTES) cardChars(cardFor(entry), chars);

    expect(chars.size).toBeGreaterThan(50);
    // 这批字符正是 Inter 的 latin 子集缺、而英文面正文里真实存在的那些
    // （希腊字母、根号、上标 ⁴⁷⁸⁹⁻、下标 ₐₑₚ）。少一个就说明卡片内容变了，
    // 断言得跟着变——这也是这条用例存在的意义。
    for (const ch of '√θαβ⁴⁷⁸⁹⁻ₐₑₚ') expect([...chars], ch).toContain(ch);

    expect(await unrenderableChars(chars, fonts)).toEqual([]);
  }, 120_000);

  it('would catch a character the shipped fonts cannot draw', async () => {
    // 这条是上一条的鉴别力证明：判据本身必须能对「画不出来的字符」变红。
    // 没有它，上一条可能只是一个恒真的断言——C1 正是这么溜过去的。
    //
    // 反面样本用 CJK 而不是 brief 举例的 ☃：伴随字体 DejaVu Sans 覆盖 U+2603，
    // ☃ 在这套字体里是**画得出来**的，拿它当反例会得到一个不动的假红点。
    const fonts = loadFonts();
    expect(await unrenderableChars('中文', fonts)).toHaveLength(2);
    // 而它认得出正常字符，不是因为「什么都判成缺」。
    expect(await unrenderableChars('A√θₑ', fonts)).toEqual([]);
  }, 120_000);
});

describe('card text stays inside its own box', () => {
  it('renders every cell and formula line within the box the layout promised', async () => {
    const fonts = loadFonts();
    // 收集**所有**越界再断言，而不是撞到第一条就停：把格子改回 56px 时，第一条
    // 报出来的越界量可能只有零点几像素，看不出问题的规模。
    const problems: string[] = [];
    let violations = 0;

    for (const entry of OG_ROUTES) {
      const layout = measureOgCard(cardInputFor(entry));
      const expected = (
        layout.preview.kind === 'grid' ? layout.preview.cells : layout.preview.lines
      ).filter((box) => box.text !== '');
      const svg = await renderSvg(entry, fonts);
      // 前三段文本是品牌 / 标题 / 副标题，之后才是预览块。
      const [brand, title, subtitle, ...previewInk] = textInkBoxes(svg);
      expect([brand, title, subtitle].every(Boolean), entry.route).toBe(true);
      expect(previewInk, entry.route).toHaveLength(expected.length);

      expected.forEach((box, index) => {
        const ink = previewInk[index];
        const spill = Math.max(
          box.x - ink.minX,
          ink.maxX - (box.x + box.width),
          box.y - ink.minY,
          ink.maxY - (box.y + box.height),
        );
        if (spill <= 0.5) return;
        violations += 1;
        if (problems.length < 6) {
          problems.push(`${entry.route} ${JSON.stringify(box.text)} 越出自己的格子 ${spill.toFixed(1)}px`);
        }
      });
    }

    expect(violations, problems.join('\n')).toBe(0);
  }, 120_000);
});
