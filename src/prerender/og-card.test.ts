import { describe, expect, it } from 'vitest';
import { getReferencePage } from '../data/reference';
import { brandFor } from '../seo/site';
import { EN } from '../i18n/languages';
import { buildOgCard, buildOgCardFrom } from './og-card';

const brand = brandFor(EN);
const collectText = (node: unknown): string =>
  typeof node === 'string'
    ? node
    : Array.isArray(node)
      ? node.map(collectText).join('')
      : node && typeof node === 'object' && 'props' in node
        ? collectText((node as { props: { children?: unknown } }).props.children)
        : '';

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

    // 先取到局部变量再收窄——两次写 page.blocks[0] 的话 TS 不会跨访问收窄。
    const first = page.blocks[0];
    const grid = first.kind === 'table' ? first.rows : [];
    expect(collectText(buildOgCardFrom({ title: 'T', subtitle: 'S', grid }, brand))).toContain('144');
  });

  it('falls back to the first formula lines when the page has no table', () => {
    const page = getReferencePage('trigonometric-identities')!;
    const text = collectText(buildOgCard(page, brand));
    expect(text).toContain('sin²θ + cos²θ = 1');
  });

  it('omits the grid entirely when there is neither a table nor a formulas block', () => {
    const card = buildOgCardFrom({ title: 'Only a title', subtitle: 'and a subtitle' }, brand);

    // 断言的是「没有网格容器」，而不是「标题在」——标题在任何路径上都在，
    // 那样的断言在网格容器照常产出时也会通过，等于在它声称守护的 bug 上无法失败。
    const children = card.props.children as unknown[];
    expect(children).toHaveLength(3); // 品牌 + 标题 + 副标题，没有第四个网格节点
    for (const child of children) {
      const style = (child as { props?: { style?: { flexDirection?: string } } }).props?.style;
      expect(style?.flexDirection).not.toBe('column');
    }
  });

  it('previews a table page by extracting that table', () => {
    // 钉住 buildOgCard 的表格分支：删掉它就取不到表格最后一格。
    const text = collectText(buildOgCard(getReferencePage('multiplication-chart')!, brand));
    expect(text).toContain('144');
  });

  it('falls back cleanly for a page with neither a table nor a formulas block', () => {
    // 钉住 buildOgCard 的兜底分支：blocks 为空时不该产出网格容器。
    const page = { ...getReferencePage('multiplication-chart')!, blocks: [] };
    const card = buildOgCard(page, brand);
    expect(collectText(card)).toContain(page.title);
    expect(card.props.children as unknown[]).toHaveLength(3);
  });
});

describe('buildOgCardFrom grid bounds', () => {
  it('takes at most 8 rows and 8 columns', () => {
    const rows = Array.from({ length: 20 }, (_, r) =>
      Array.from({ length: 20 }, (_, c) => `${r}-${c}`),
    );
    const text = collectText(buildOgCardFrom({ title: 'T', subtitle: 'S', grid: rows }, brand));
    expect(text).toContain('7-7');
    expect(text).not.toContain('8-8');
  });
});
