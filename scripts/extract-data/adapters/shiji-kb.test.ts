import { describe, it, expect } from 'vitest';
import { shijiKbAdapter } from './shiji-kb.js';
import type { RawChapter } from './shiji-kb.js';
import type { ShijiEnvelope } from './shiji-kb.js';

interface VolumeWithId extends RawChapter {
  id: string;
}

describe('shijiKbAdapter', () => {
  it('has correct identity', () => {
    expect(shijiKbAdapter.kind).toBe('shiji');
    expect(shijiKbAdapter.name).toBeTruthy();
    expect(shijiKbAdapter.description).toBeTruthy();
  });

  it('normalize assigns ids v5, v6, ...', () => {
    const pages: RawChapter[] = [
      { url: 'x', title: '周本纪', chapter: '卷四', paragraphs: ['a'], interpretation: '' },
      { url: 'y', title: '秦始皇本纪', chapter: '卷六', paragraphs: ['b'], interpretation: '' },
    ];
    const env = shijiKbAdapter.normalize(pages) as ShijiEnvelope;
    expect(env.source).toBe('shiji-kb');
    expect(env.volumes).toHaveLength(2);
    const vol0 = env.volumes[0] as VolumeWithId;
    const vol1 = env.volumes[1] as VolumeWithId;
    expect(vol0.id).toBe('v5');
    expect(vol1.id).toBe('v6');
  });

  it('normalize handles empty pages', () => {
    const env = shijiKbAdapter.normalize([]) as ShijiEnvelope;
    expect(env.volumes).toEqual([]);
    expect(env.source).toBe('shiji-kb');
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
    const parsed = await shijiKbAdapter.parseHtml('http://x', html) as RawChapter;
    expect(parsed.title).toBe('周本纪 - 卷四');
    expect(parsed.chapter).toBe('卷四');
    expect(parsed.paragraphs.length).toBeGreaterThanOrEqual(2);
  });
});
