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
    const text = collectText(
      buildOgCardFrom({ title: 'Only a title', subtitle: 'and a subtitle' }, brand),
    );
    expect(text).toContain('Only a title');
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
