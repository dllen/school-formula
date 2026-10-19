import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_DATA } from './data/knowledge';
import { render } from './entry-server';

describe('entry-server render', () => {
  it('renders the home page with the site footer brand', async () => {
    const html = await render('/');
    expect(html).toContain('拾艺院');
  });

  it('renders a knowledge detail page with the point title', async () => {
    const first = KNOWLEDGE_DATA[0].subjects[0].knowledgePoints[0];
    const html = await render(`/knowledge/${first.id}`);
    expect(html).toContain(first.title);
  });

  it('renders a view route without throwing', async () => {
    const html = await render('/practice');
    expect(html.length).toBeGreaterThan(0);
  });

  it('renders the English surface with real English content', async () => {
    const indexHtml = await render('/en');
    expect(indexHtml).toContain('Printable Study Reference');
    const chartHtml = await render('/en/math/multiplication-chart');
    expect(chartHtml).toContain('Multiplication Chart');
  });
});
