import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_DATA } from './data/knowledge';
import { render } from './entry-server';

describe('entry-server render', () => {
  it('renders the home page with the site footer brand', () => {
    const html = render('/');
    expect(html).toContain('拾艺院');
  });

  it('renders a knowledge detail page with the point title', () => {
    const first = KNOWLEDGE_DATA[0].subjects[0].knowledgePoints[0];
    const html = render(`/knowledge/${first.id}`);
    expect(html).toContain(first.title);
  });

  it('renders a view route without throwing', () => {
    expect(() => render('/practice')).not.toThrow();
    expect(render('/practice').length).toBeGreaterThan(0);
  });

  it('renders the English surface with real English content', () => {
    expect(render('/en')).toContain('Printable Study Reference');
    expect(render('/en/math/multiplication-chart')).toContain('Multiplication Chart');
  });
});
