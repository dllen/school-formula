import { describe, expect, it } from 'vitest';
import { getReferencePage } from '../data/reference';
import { EN } from '../i18n/languages';
import { brandFor } from '../seo/site';
import {
  CARD,
  CARD_CONTENT_WIDTH,
  GRID_LIMITS,
  buildOgCard,
  buildOgCardFrom,
  estimateTextWidth,
  measureOgCard,
} from './og-card';
import type { OgCardInput, OgCardLayout } from './og-card';

const brand = brandFor(EN);

const collectText = (node: unknown): string =>
  typeof node === 'string'
    ? node
    : Array.isArray(node)
      ? node.map(collectText).join('')
      : node && typeof node === 'object' && 'props' in node
        ? collectText((node as { props: { children?: unknown } }).props.children)
        : '';

/** 卡片根节点的子孙文本节点数量（用来做结构断言，不靠字符串拼接的巧合）。 */
const countTextNodes = (node: unknown): number =>
  typeof node === 'string'
    ? 1
    : Array.isArray(node)
      ? node.reduce<number>((total, child) => total + countTextNodes(child), 0)
      : node && typeof node === 'object' && 'props' in node
        ? countTextNodes((node as { props: { children?: unknown } }).props.children)
        : 0;

const pageInput = (slug: string): OgCardInput => {
  const page = getReferencePage(slug)!;
  const table = page.blocks.find((block) => block.kind === 'table');
  const formulas = page.blocks.find((block) => block.kind === 'formulas');
  return {
    title: page.title,
    subtitle: page.summary,
    ...(table && table.kind === 'table'
      ? { grid: table.rows }
      : formulas && formulas.kind === 'formulas'
        ? { lines: formulas.groups.flatMap((group) => group.items) }
        : {}),
  };
};

describe('buildOgCard', () => {
  it('shows the chart title and the brand', () => {
    const page = getReferencePage('multiplication-chart')!;
    const text = collectText(buildOgCard(page, brand));
    expect(text).toContain('Multiplication Chart (1–12)');
    expect(text).toContain('Shiyiyuan');
  });

  it('previews the first table block as a grid', () => {
    const page = getReferencePage('multiplication-chart')!;
    const card = buildOgCard(page, brand);
    // 根节点是纵向 flex
    expect((card.props.style as { flexDirection?: string }).flexDirection).toBe('column');

    const first = page.blocks[0];
    const grid = first.kind === 'table' ? first.rows : [];
    const layout = measureOgCard({ title: 'T', subtitle: 'S', grid });
    expect(layout.preview.kind).toBe('grid');
    // 第一行逐格等于传进来的数据第一行（被 8 列上限裁过），不是兜底路径的空网格。
    const firstRow = layout.preview.cells.slice(0, layout.preview.columns).map((cell) => cell.text);
    expect(firstRow).toEqual(grid[0].slice(0, GRID_LIMITS.maxCols));
  });

  it('renders a formulas page as a text list, not as a one-column grid', () => {
    // 公式不是网格：把它塞进为数字准备的等宽格子里，长等式就会折行重叠。
    const layout = measureOgCard(pageInput('trigonometric-identities'));
    expect(layout.preview.kind).toBe('lines');
    expect(layout.preview.cells).toHaveLength(0);
    expect(layout.preview.lines.map((line) => line.text)).toContain('sin²θ + cos²θ = 1');
    // 每行都占满内容宽度——而不是一个 56px 宽的「格子」。
    for (const line of layout.preview.lines) {
      expect(line.width).toBe(CARD_CONTENT_WIDTH);
    }
  });

  it('omits the preview entirely when there is neither a table nor a formulas block', () => {
    const card = buildOgCardFrom({ title: 'Only a title', subtitle: 'and a subtitle' }, brand);
    const layout = measureOgCard({ title: 'Only a title', subtitle: 'and a subtitle' });

    // 断言的是「没有预览块」，而不是「标题在」——标题在任何路径上都在，那样的断言
    // 在预览块照常产出时也会通过，等于在它声称守护的 bug 上无法失败。
    expect(layout.preview.kind).toBe('none');
    // 结构断言：整棵树只剩品牌 / 标题 / 副标题三个文本节点，没有第四个。
    expect(countTextNodes(card)).toBe(3);
  });

  it('previews a table page by taking that page own table', () => {
    const layout = measureOgCard(pageInput('multiplication-chart'));
    const block = getReferencePage('multiplication-chart')!.blocks[0];
    if (block.kind !== 'table') throw new Error('expected a table block');
    // 逐格比对第一行——比「文本里含某个子串」结实，也不会被相邻格子拼出来的
    // 巧合子串骗过（旧断言断的 '144' 其实是 '21' 与 '44' 拼起来的）。
    const firstRow = layout.preview.cells
      .filter((cell) => cell.y === layout.preview.cells[0].y)
      .map((cell) => cell.text);
    expect(firstRow).toEqual(block.rows[0].slice(0, GRID_LIMITS.maxCols));
  });

  it('falls back cleanly for a page with neither a table nor a formulas block', () => {
    const page = { ...getReferencePage('multiplication-chart')!, blocks: [] };
    const layout = measureOgCard({ title: page.title, subtitle: page.summary });
    expect(layout.preview.kind).toBe('none');
    expect(countTextNodes(buildOgCard(page, brand))).toBe(3);
  });
});

describe('measureOgCard grid bounds', () => {
  it('takes at most GRID_LIMITS.maxRows rows and GRID_LIMITS.maxCols columns', () => {
    const rows = Array.from({ length: 20 }, (_, r) =>
      Array.from({ length: 20 }, (_, c) => `${r}-${c}`),
    );
    const layout = measureOgCard({ title: 'T', subtitle: 'S', grid: rows });
    // 钉住的是常量本身，不是数字 8：把 maxRows 改成 20 必须让这条变红
    // （高度预算会把行数先夹回去，所以写死 8 反而测不出常量被改大）。
    expect(layout.preview.rows).toBe(GRID_LIMITS.maxRows);
    expect(layout.preview.columns).toBe(GRID_LIMITS.maxCols);
  });

  it('keeps every card preview inside the card body', () => {
    for (const slug of [
      'multiplication-chart',
      'squares-cubes-roots',
      'metric-conversions',
      'physics-constants',
      'irregular-verbs',
      'trigonometric-identities',
    ]) {
      const layout = measureOgCard(pageInput(slug));
      const box = layout.preview.box;
      expect(box.x, slug).toBeGreaterThanOrEqual(CARD.padding);
      expect(box.x + box.width, slug).toBeLessThanOrEqual(CARD.width - CARD.padding);
      expect(box.y, slug).toBeGreaterThanOrEqual(CARD.padding);
      expect(box.y + box.height, slug).toBeLessThanOrEqual(CARD.height - CARD.padding);
    }
  });

  it('gives every cell a box wide enough for its own text', () => {
    // 旧实现把格子写死成 56×34、字号只按列数选，`1 km = 1000 m` 于是折行重叠。
    // 这条不变量就是那个 bug 的反面：每格的文字宽度必须装得进这一格自己的文字区。
    for (const slug of [
      'multiplication-chart',
      'squares-cubes-roots',
      'metric-conversions',
      'physics-constants',
      'irregular-verbs',
      'trigonometric-identities',
    ]) {
      const layout = measureOgCard(pageInput(slug));
      for (const cell of layout.preview.cells) {
        const textArea = cell.width - GRID_LIMITS.padX * 2;
        expect(estimateTextWidth(cell.text, layout.preview.fontSize), `${slug}: ${cell.text}`).toBeLessThanOrEqual(
          textArea,
        );
      }
    }
  });

  it('gives every formula line room for its own text', () => {
    const layout = measureOgCard(pageInput('trigonometric-identities'));
    for (const line of layout.preview.lines) {
      expect(estimateTextWidth(line.text, layout.preview.fontSize)).toBeLessThanOrEqual(line.width);
    }
  });

  it('sizes columns from their content instead of a fixed 56px', () => {
    // 两列的 metric-conversions：内容列远长于数量列，列宽必须跟着内容走。
    const layout = measureOgCard(pageInput('metric-conversions'));
    const widths = [...new Set(layout.preview.cells.map((cell) => cell.width))];
    expect(widths.length).toBeGreaterThan(1);
    expect(Math.max(...widths)).toBeGreaterThan(200);
    // 整个表格铺满内容宽度，而不是缩在左边 56px 一格的窄条里。
    expect(layout.preview.box.width).toBe(CARD_CONTENT_WIDTH);
  });

  it('truncates a cell that is far longer than any real content', () => {
    const layout = measureOgCard({
      title: 'T',
      subtitle: 'S',
      grid: [['x'.repeat(200)]],
    });
    const [cell] = layout.preview.cells;
    expect(cell.text.length).toBeLessThanOrEqual(GRID_LIMITS.maxChars);
    expect(cell.text.endsWith('…')).toBe(true);
  });
});

describe('measureOgCard lines', () => {
  it('keeps the formula list inside the card body', () => {
    const layout: OgCardLayout = measureOgCard(pageInput('trigonometric-identities'));
    const box = layout.preview.box;
    expect(box.y).toBeGreaterThanOrEqual(CARD.padding);
    expect(box.y + box.height).toBeLessThanOrEqual(CARD.height - CARD.padding);
    expect(layout.preview.rows).toBeGreaterThan(0);
  });
});
