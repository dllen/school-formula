import { describe, it, expect } from 'vitest';
import { dutongjianAdapter } from './dutongjian.js';
import type { RawChapter, DutongjianEnvelope } from './dutongjian.js';

describe('dutongjianAdapter', () => {
  it('has correct identity', () => {
    expect(dutongjianAdapter.kind).toBe('zizhi');
    expect(dutongjianAdapter.name).toBeTruthy();
    expect(dutongjianAdapter.description).toBeTruthy();
  });

  it('normalize assigns ids v18, v19, ...', () => {
    const pages: RawChapter[] = [
      { url: 'x', title: '周纪三', period: '威烈王二十三年', paragraphs: ['a'], interpretation: '' },
      { url: 'y', title: '周纪四', period: '显王元年', paragraphs: ['b'], interpretation: '' },
    ];
    const env = dutongjianAdapter.normalize(pages) as DutongjianEnvelope;
    expect(env.source).toBe('dutongjian');
    expect(env.volumes).toHaveLength(2);
    expect(env.volumes[0]?.id).toBe('v18');
    expect(env.volumes[1]?.id).toBe('v19');
  });

  it('normalize handles empty pages', () => {
    const env = dutongjianAdapter.normalize([]) as DutongjianEnvelope;
    expect(env.volumes).toEqual([]);
    expect(env.source).toBe('dutongjian');
  });

  it('parseHtml extracts title, period, paragraphs', async () => {
    const html = `
      <html><body>
        <h1 class="chapter-title">周纪三</h1>
        <div class="period">威烈王二十三年（戊寅，公元前四〇三年）</div>
        <article>
          <p>初命晋大夫魏斯、赵籍、韩虔为诸侯。</p>
          <p>臣光曰：天子之职莫大于礼。</p>
        </article>
      </body></html>
    `;
    const parsed = (await dutongjianAdapter.parseHtml('http://x', html)) as RawChapter;
    expect(parsed.title).toBe('周纪三');
    expect(parsed.period).toContain('威烈王二十三年');
    expect(parsed.paragraphs.length).toBeGreaterThanOrEqual(2);
  });
});
