// src/prerender/og-card.ts
import type { ReferencePage } from '../data/reference/types';
import { OG_IMAGE_SIZE } from '../seo/og';
import type { BrandCopy } from '../seo/site';

/** satori 接受的元素形状（React 元素的子集），用纯对象写所以不需要 React。 */
export interface SatoriElement {
  type: string;
  props: {
    style?: Record<string, unknown>;
    children?: unknown;
  };
}

export interface OgCardInput {
  title: string;
  subtitle: string;
  /** 表格缩影。与 `lines` 互斥；超出上限的行列会裁掉。 */
  grid?: string[][];
  /**
   * 多行文本缩影——公式清单这类内容**不是网格**：它是一条条自由长度的等式，
   * 塞进为数字准备的等宽格子里必然折行重叠。走这一支，按行排版。
   */
  lines?: string[];
}

/**
 * 画布。尺寸来自 `OG_IMAGE_SIZE`（**唯一来源**，`og:image:width/height` 元数据与
 * satori 的渲染尺寸都取同一处），padding 是卡片自己的内边距。
 */
export const CARD = { ...OG_IMAGE_SIZE, padding: 64 } as const;
export const CARD_CONTENT_WIDTH = CARD.width - CARD.padding * 2;
export const CARD_CONTENT_HEIGHT = CARD.height - CARD.padding * 2;

/**
 * 头部三行与预览块间距。行高写成显式值并在这里复述一遍——布局必须在渲染之前
 * 就知道每块占多高，才能算出预览块还剩多少纵向空间。
 */
const TEXT = {
  brand: { fontSize: 26, lineHeight: 1.2 },
  title: { fontSize: 58, lineHeight: 1.15, marginTop: 16 },
  subtitle: { fontSize: 26, lineHeight: 1.25, marginTop: 12 },
  previewMarginTop: 20,
} as const;

/**
 * 表格缩影的几何与护栏。
 *
 * 导出是为了让测试能**钉住上限**：把 maxRows 改成 20 而列数不变时，测试必须变红
 * （20 行 × 31px 会顶出画布）。测试里写死 8 就做不到这点——高度预算会把行数先
 * 夹回去，断言照样通过。
 */
export const GRID_LIMITS = {
  maxRows: 8,
  maxCols: 8,
  /** 单元格文本上限；更长的截断——宁可少几个字，也不让文字撑破格子。 */
  maxChars: 26,
  minFontSize: 12,
  maxFontSize: 22,
  padX: 14,
  padY: 2,
  gap: 4,
  lineHeight: 1.2,
} as const;

/** 公式清单的几何与护栏。 */
const LINES = {
  maxChars: 64,
  minFontSize: 15,
  maxFontSize: 34,
  gap: 10,
  lineHeight: 1.45,
} as const;

const ELLIPSIS = '…';

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
): SatoriElement => ({ type, props: { style, children } });

const clamp = (lo: number, hi: number, value: number) => Math.min(hi, Math.max(lo, value));

// ---------------------------------------------------------------------------
// 文本宽度模型
// ---------------------------------------------------------------------------

// 布局要在「还不知道 satori 会怎么断行」的时候先把几何定下来，所以必须有一个宽度
// 模型。单个平均字宽常数在这里是不够的：'ill' 与 'MW' 的实际宽度差三倍，而本阶段
// 真实数据里既有 `Nₐ` 这种窄符号串，也有 `Gravitational acceleration` 这种长词。
//
// 模型刻意**偏高**——把格子开宽一点只是留白，低估才会让文字越出格子。模型偏了不会
// 静默画糊：src/prerender/og.test.ts 把 satori 真实渲染出的每个字形路径的 bbox 与
// 这里的几何逐一比对，越界就红。
const NARROW_CHARS = " .,:;'\"`|!ijltfr()[]/\\-";
const WIDE_CHARS = 'MWmw@%&';

function charWidthEm(ch: string): number {
  if (NARROW_CHARS.includes(ch)) return 0.36;
  if (WIDE_CHARS.includes(ch)) return 0.95;
  const cp = ch.codePointAt(0) ?? 0;
  if (cp >= 0x41 && cp <= 0x5a) return 0.75; // A-Z
  if (cp > 0x7e) return 0.7; // 希腊字母、上下标、数学符号
  return 0.62;
}

/** 一段文本在 fontSize 下的估算宽度（px）。 */
export function estimateTextWidth(text: string, fontSize: number): number {
  let em = 0;
  for (const ch of text) em += charWidthEm(ch);
  return em * fontSize;
}

/** 一个文本块在给定宽度下占几行。 */
function lineCount(text: string, fontSize: number, width: number): number {
  if (text.length === 0) return 1;
  return Math.max(1, Math.ceil(estimateTextWidth(text, fontSize) / width));
}

/** 截断到 maxChars，超出部分用省略号收尾。 */
function clipText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(0, maxChars - 1)).trimEnd()}${ELLIPSIS}`;
}

// ---------------------------------------------------------------------------
// 布局
// ---------------------------------------------------------------------------

/** 画布坐标系里的一个盒子。 */
export interface Box {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PreviewLayout {
  kind: 'grid' | 'lines' | 'none';
  /** 预览块在画布上的盒子；kind 为 none 时 width/height 为 0。 */
  box: { x: number; y: number; width: number; height: number };
  rows: number;
  columns: number;
  fontSize: number;
  /** 网格单元格（kind === 'grid'）。 */
  cells: Box[];
  /** 公式行（kind === 'lines'）。 */
  lines: Box[];
}

export interface OgCardLayout {
  preview: PreviewLayout;
  titleLines: number;
  subtitleLines: number;
}

const EMPTY_PREVIEW: PreviewLayout = {
  kind: 'none',
  box: { x: CARD.padding, y: 0, width: 0, height: 0 },
  rows: 0,
  columns: 0,
  fontSize: 0,
  cells: [],
  lines: [],
};

/** 头部三行加预览块上方间距占掉的高度。 */
function headerHeight(input: OgCardInput): { height: number; titleLines: number; subtitleLines: number } {
  const titleLines = lineCount(input.title, TEXT.title.fontSize, CARD_CONTENT_WIDTH);
  const subtitleLines = lineCount(input.subtitle, TEXT.subtitle.fontSize, CARD_CONTENT_WIDTH);
  const height =
    TEXT.brand.fontSize * TEXT.brand.lineHeight +
    TEXT.title.marginTop +
    titleLines * TEXT.title.fontSize * TEXT.title.lineHeight +
    TEXT.subtitle.marginTop +
    subtitleLines * TEXT.subtitle.fontSize * TEXT.subtitle.lineHeight;
  return { height, titleLines, subtitleLines };
}

/** 每一列的内容宽度（em，取该列最长单元格）。 */
function columnUnits(cells: string[][]): number[] {
  const columns = Math.max(0, ...cells.map((row) => row.length));
  return Array.from({ length: columns }, (_, c) =>
    Math.max(0, ...cells.map((row) => estimateTextWidth(row[c] ?? '', 1))),
  );
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

/** 按内容分配列宽，并选一个让所有单元格都放得下的字号；装不下就继续截断。 */
function gridPreview(rows: string[][], available: number): PreviewLayout {
  const cut = rows.slice(0, GRID_LIMITS.maxRows).map((row) => row.slice(0, GRID_LIMITS.maxCols).map((cell) => clipText(cell, GRID_LIMITS.maxChars)));
  const columns = Math.max(0, ...cut.map((row) => row.length));
  if (cut.length === 0 || columns === 0) return EMPTY_PREVIEW;

  // 补成矩形，缺格填空串——后面 widths/坐标都按矩形算。
  let cells = cut.map((row) => Array.from({ length: columns }, (_, c) => row[c] ?? ''));

  const overhead = columns * GRID_LIMITS.padX * 2 + (columns - 1) * GRID_LIMITS.gap;
  const textArea = CARD_CONTENT_WIDTH - overhead;
  let units = columnUnits(cells);

  // 字号：让每列在它按内容分到的宽度里都放得下。上限防止两列表格的字大得夸张。
  const fontSize = clamp(GRID_LIMITS.minFontSize, GRID_LIMITS.maxFontSize, textArea / sum(units));

  // 护栏：列多且每列都长到字号已经贴住下限还装不下时，继续截断最宽的那一列。
  // 当前数据到不了这里（最长的 metric-conversions 两列也只用掉三分之一宽度），
  // 但内容一变长就该有人兜住，而不是让文字自己溢出。
  if (fontSize <= GRID_LIMITS.minFontSize) {
    for (let guard = 0; guard < 256 && sum(units) * GRID_LIMITS.minFontSize > textArea; guard++) {
      const widest = units.indexOf(Math.max(...units));
      cells = cells.map((row) => {
        const next = [...row];
        next[widest] = next[widest].slice(0, Math.max(1, next[widest].length - 1));
        return next;
      });
      units = columnUnits(cells);
    }
  }

  const cellHeight = Math.ceil(fontSize * GRID_LIMITS.lineHeight) + GRID_LIMITS.padY * 2;
  const maxRowsByHeight = Math.max(
    1,
    Math.floor((available + GRID_LIMITS.gap) / (cellHeight + GRID_LIMITS.gap)),
  );
  const shownRows = Math.min(cells.length, GRID_LIMITS.maxRows, maxRowsByHeight);
  cells = cells.slice(0, shownRows);

  // 列宽：内容需要的宽度（units * fontSize）之外，把「字号被上限夹住后剩下的空间」
  // 按同一比例摊回去。于是表格铺满整个内容宽度，不再缩在左边三分之一。
  const stretch = Math.max(0, textArea - sum(units) * fontSize);
  const widths = units.map((u) => u * fontSize + (sum(units) === 0 ? 0 : (u / sum(units)) * stretch) + GRID_LIMITS.padX * 2);
  const width = sum(widths) + (columns - 1) * GRID_LIMITS.gap;
  const height = shownRows * cellHeight + (shownRows - 1) * GRID_LIMITS.gap;

  return {
    kind: 'grid',
    box: { x: CARD.padding, y: 0, width, height },
    rows: shownRows,
    columns,
    fontSize,
    cells: cells.flatMap((row, r) =>
      row.map((text, c) => ({
        text,
        x: CARD.padding + sum(widths.slice(0, c)) + c * GRID_LIMITS.gap,
        y: r * (cellHeight + GRID_LIMITS.gap),
        width: widths[c],
        height: cellHeight,
      })),
    ),
    lines: [],
  };
}

/** 公式这类多行文本：一行一条，按最长的一行选字号，行数服从纵向预算。 */
function linesPreview(lines: string[], available: number): PreviewLayout {
  const kept = lines.slice(0, 24).map((line) => clipText(line, LINES.maxChars));
  if (kept.length === 0) return EMPTY_PREVIEW;

  const longest = Math.max(...kept.map((line) => estimateTextWidth(line, 1)));
  const fontSize = clamp(LINES.minFontSize, LINES.maxFontSize, CARD_CONTENT_WIDTH / longest);
  const lineHeight = Math.ceil(fontSize * LINES.lineHeight);
  const maxLinesByHeight = Math.max(1, Math.floor((available + LINES.gap) / (lineHeight + LINES.gap)));
  const shown = kept.slice(0, maxLinesByHeight);
  const height = shown.length * lineHeight + (shown.length - 1) * LINES.gap;

  return {
    kind: 'lines',
    box: { x: CARD.padding, y: 0, width: CARD_CONTENT_WIDTH, height },
    rows: shown.length,
    columns: 1,
    fontSize,
    cells: [],
    lines: shown.map((text, index) => ({
      text,
      x: CARD.padding,
      y: index * (lineHeight + LINES.gap),
      width: CARD_CONTENT_WIDTH,
      height: lineHeight,
    })),
  };
}

/**
 * 一张卡片的几何：头部行数、预览块盒子、每个单元格/每行的盒子。
 *
 * 与 `buildOgCardFrom` 共用同一份计算——元素树的样式直接由它派生，
 * 所以测试里拿到的坐标就是 satori 真正拿到的坐标。
 */
export function measureOgCard(input: OgCardInput): OgCardLayout {
  const header = headerHeight(input);
  const available = Math.max(0, CARD_CONTENT_HEIGHT - header.height - TEXT.previewMarginTop);

  const preview =
    input.grid && input.grid.length > 0
      ? gridPreview(input.grid, available)
      : input.lines && input.lines.length > 0
        ? linesPreview(input.lines, available)
        : EMPTY_PREVIEW;

  // 预览块**贴底**（根节点在有预览时用 space-between）：它的 y 只由自身高度决定，
  // 与头部实际占了几行无关。头部行数是估出来的，用它去推 y 就等于把估算误差原样
  // 搬进坐标；贴底之后，估算偏差只会让头部与预览之间的留白变多变少（头部行数
  // 估多了，留白就大一点），不会让任何东西错位。
  const previewY =
    preview.kind === 'none' ? CARD.padding : CARD.height - CARD.padding - preview.box.height;

  preview.box = { ...preview.box, y: previewY };
  preview.cells = preview.cells.map((cell) => ({ ...cell, y: previewY + cell.y }));
  preview.lines = preview.lines.map((line) => ({ ...line, y: previewY + line.y }));

  return { preview, titleLines: header.titleLines, subtitleLines: header.subtitleLines };
}

// ---------------------------------------------------------------------------
// 元素树
// ---------------------------------------------------------------------------

const textStyle = (fontSize: number, lineHeight: number, color: string) => ({
  display: 'flex',
  fontSize,
  lineHeight,
  color,
});

/**
 * 一张 OG 卡片的元素树。
 *
 * 卡片内容刻意包含该页数据的缩影——这正是「生成真图」相对「一张通用模板图」的
 * 全部意义。satori 的 CSS 支持是子集（flex 好、grid 一般），所以布局只用
 * flex + 固定像素，别引入百分比或 grid。
 */
export function buildOgCardFrom(input: OgCardInput, brand: BrandCopy): SatoriElement {
  const { preview } = measureOgCard(input);

  const header = el(
    'div',
    { display: 'flex', flexDirection: 'column' },
    [
      el(
        'div',
        { ...textStyle(TEXT.brand.fontSize, TEXT.brand.lineHeight, '#3370FF'), fontWeight: 700 },
        brand.name,
      ),
      el(
        'div',
        {
          ...textStyle(TEXT.title.fontSize, TEXT.title.lineHeight, '#1F2329'),
          marginTop: TEXT.title.marginTop,
        },
        input.title,
      ),
      el(
        'div',
        {
          ...textStyle(TEXT.subtitle.fontSize, TEXT.subtitle.lineHeight, '#646A73'),
          marginTop: TEXT.subtitle.marginTop,
        },
        input.subtitle,
      ),
    ],
  );

  const previewNode =
    preview.kind === 'grid'
      ? el(
          'div',
          { display: 'flex', flexDirection: 'column', gap: GRID_LIMITS.gap },
          Array.from({ length: preview.rows }, (_, r) =>
            el(
              'div',
              { display: 'flex', gap: GRID_LIMITS.gap },
              preview.cells
                .filter((_, index) => Math.floor(index / preview.columns) === r)
                .map((cell) =>
                  el(
                    'div',
                    {
                      ...textStyle(preview.fontSize, GRID_LIMITS.lineHeight, '#1F2329'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: cell.width,
                      height: cell.height,
                      backgroundColor: r === 0 ? '#E6EEFF' : '#FFFFFF',
                    },
                    cell.text,
                  ),
                ),
            ),
          ),
        )
      : preview.kind === 'lines'
        ? el(
            'div',
            { display: 'flex', flexDirection: 'column', gap: LINES.gap },
            preview.lines.map((line) =>
              el(
                'div',
                { ...textStyle(preview.fontSize, LINES.lineHeight, '#1F2329'), whiteSpace: 'pre' },
                line.text,
              ),
            ),
          )
        : undefined;

  return el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      // 有预览块时贴底排（头部在上、数据块在下，中间的留白随头部实际行数伸缩）；
      // 没有预览块（首页）时居中，免得三行文案堆在顶上、下面空一大片。
      justifyContent: previewNode ? 'space-between' : 'center',
      width: CARD.width,
      height: CARD.height,
      padding: CARD.padding,
      backgroundColor: '#F5F6F7',
    },
    previewNode ? [header, previewNode] : [header],
  );
}

/** 公式清单全部条目。渲染时按纵向预算截断，这里不再提前丢内容。 */
function formulaLines(page: ReferencePage): string[] | undefined {
  const block = page.blocks.find((b) => b.kind === 'formulas');
  if (!block || block.kind !== 'formulas') return undefined;
  const lines = block.groups.flatMap((group) => group.items);
  return lines.length > 0 ? lines : undefined;
}

/**
 * 图表页 → 卡片入参。表格页给表格缩影，公式页给多行清单，两者都没有则只出头部。
 * 导出是为了让渲染之外的测试（字形覆盖、几何对齐）用**同一份**构造逻辑。
 */
export function chartCardInput(page: ReferencePage): OgCardInput {
  const table = page.blocks.find((b) => b.kind === 'table');
  const formulas = formulaLines(page);

  return {
    title: page.title,
    subtitle: page.summary,
    ...(table && table.kind === 'table'
      ? { grid: table.rows }
      : formulas
        ? { lines: formulas }
        : {}),
  };
}

/** 从图表页数据构造卡片。 */
export function buildOgCard(page: ReferencePage, brand: BrandCopy): SatoriElement {
  return buildOgCardFrom(chartCardInput(page), brand);
}
