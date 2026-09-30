import { describe, it, expect } from 'vitest';
import { hunterhugAdapter, type RawChapter, type HunterhugEnvelope } from './hunterhug.js';

describe('hunterhugAdapter', () => {
  it('has correct identity', () => {
    expect(hunterhugAdapter.kind).toBe('shiji');
    expect(hunterhugAdapter.name).toBe('Hunterhug 经典');
    expect(hunterhugAdapter.description).toBeTruthy();
  });

  it('normalize assigns ids v100, v101, ...', () => {
    const pages: RawChapter[] = [
      { url: 'x', title: '周本纪', chapter: '卷四', paragraphs: ['a'], interpretation: '' },
      { url: 'y', title: '秦始皇本纪', chapter: '卷六', paragraphs: ['b'], interpretation: '' },
    ];
    const env = hunterhugAdapter.normalize(pages) as HunterhugEnvelope;
    expect(env.source).toBe('hunterhug');
    expect(env.volumes).toHaveLength(2);
    expect(env.volumes[0]?.id).toBe('v100');
    expect(env.volumes[1]?.id).toBe('v101');
  });

  it('normalize handles empty pages', () => {
    const env = hunterhugAdapter.normalize([]) as HunterhugEnvelope;
    expect(env.volumes).toEqual([]);
    expect(env.source).toBe('hunterhug');
  });

  it('parseHtml extracts title, chapter, paragraphs', async () => {
    const html = `
      <html><body>
        <h1>周本纪 - 卷四</h1>
        <article>
          <p>周武王之母曰太姒...</p>
          <p>其后稷...</p>
        </article>
      </body></html>
    `;
    const parsed = (await hunterhugAdapter.parseHtml('http://x', html)) as RawChapter;
    expect(parsed.title).toBe('周本纪 - 卷四');
    expect(parsed.chapter).toBe('卷四');
    expect(parsed.paragraphs.length).toBeGreaterThanOrEqual(2);
  });
});
