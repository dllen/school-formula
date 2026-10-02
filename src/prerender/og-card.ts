// src/prerender/og-card.ts
import type { ReferencePage } from '../data/reference/types';
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
  /** 可选的表格缩影。超过 8×8 的部分裁掉。 */
  grid?: string[][];
}

const CARD = { width: 1200, height: 630 } as const;
const GRID_MAX_ROWS = 8;
const GRID_MAX_COLS = 8;
const FORMULA_LINES = 3;

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
): SatoriElement => ({ type, props: { style, children } });

/** 表格前 8×8 格的缩影。格子越少字号越大，让 6 列的乘法表也能看清。 */
function gridPreview(rows: string[][]): SatoriElement | undefined {
  const cut = rows.slice(0, GRID_MAX_ROWS).map((row) => row.slice(0, GRID_MAX_COLS));
  if (cut.length === 0 || cut[0].length === 0) return undefined;

  const cols = cut[0].length;
  const fontSize = cols <= 6 ? 22 : 16;

  return el(
    'div',
    { display: 'flex', flexDirection: 'column', gap: 2, marginTop: 28 },
    cut.map((row, rowIndex) =>
      el(
        'div',
        { display: 'flex', gap: 2 },
        row.map((cell) =>
          el(
            'div',
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 34,
              border: '1px solid #D8DCE3',
              backgroundColor: rowIndex === 0 ? '#EDF2FF' : '#FFFFFF',
              fontSize,
              color: '#1F2329',
            },
            cell,
          ),
        ),
      ),
    ),
  );
}

/** 公式清单的前三行，用作没有表格时的缩影。 */
function formulaPreview(page: ReferencePage): string[] | undefined {
  const block = page.blocks.find((b) => b.kind === 'formulas');
  if (!block || block.kind !== 'formulas') return undefined;
  return block.groups.flatMap((group) => group.items).slice(0, FORMULA_LINES);
}

/**
 * 一张 OG 卡片的元素树。
 *
 * 卡片内容刻意包含该页数据的缩影——这正是「生成真图」相对「一张通用模板图」
 * 的全部意义。satori 的 CSS 支持是子集（flex 好、grid 一般），所以布局只用
 * flex + 固定像素，别引入百分比或 grid。
 */
export function buildOgCardFrom(input: OgCardInput, brand: BrandCopy): SatoriElement {
  const children: unknown[] = [
    el('div', { display: 'flex', fontSize: 26, color: '#3370FF', fontWeight: 700 }, brand.name),
    el(
      'div',
      { display: 'flex', marginTop: 16, fontSize: 58, lineHeight: 1.15, color: '#1F2329' },
      input.title,
    ),
    el('div', { display: 'flex', marginTop: 12, fontSize: 26, color: '#646A73' }, input.subtitle),
  ];

  if (input.grid && input.grid.length > 0) {
    const preview = gridPreview(input.grid);
    if (preview) children.push(preview);
  }

  return el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: CARD.width,
      height: CARD.height,
      padding: 64,
      backgroundColor: '#F5F6F7',
    },
    children,
  );
}

/** 从图表页数据构造卡片。表格页用表格缩影，公式页用前三条公式。 */
export function buildOgCard(page: ReferencePage, brand: BrandCopy): SatoriElement {
  const table = page.blocks.find((b) => b.kind === 'table');
  const formulas = formulaPreview(page);

  if (table && table.kind === 'table') {
    return buildOgCardFrom({ title: page.title, subtitle: page.summary, grid: table.rows }, brand);
  }

  if (formulas) {
    return buildOgCardFrom(
      {
        title: page.title,
        subtitle: page.summary,
        grid: formulas.map((line) => [line]),
      },
      brand,
    );
  }

  return buildOgCardFrom({ title: page.title, subtitle: page.summary }, brand);
}
