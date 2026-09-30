import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inspectHtml } from './inspect.js';

let root: string;
const SAMPLE_HTML = readFileSync(join(import.meta.dirname, '..', '__fixtures__', 'sample.html'), 'utf-8');

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'inspect-test-'));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('inspectHtml', () => {
  it('returns parsed report from injected HTML', async () => {
    const fakeFetch = (async () => new Response(SAMPLE_HTML, { status: 200 })) as unknown as typeof fetch;
    const report = await inspectHtml(
      { url: 'https://example.com/page', save: false, maxHeadings: 20 },
      { root, fetchImpl: fakeFetch }
    );
    expect(report.fetchedBytes).toBe(SAMPLE_HTML.length);
    expect(report.headings.length).toBeGreaterThan(0);
    expect(report.headings[0]?.text).toContain('周本纪');
    const articleP = report.candidates.find((c) => c.selector === 'article p');
    expect(articleP?.paragraphs).toBe(10);
  });

  it('saves fixture to .fixtures/<adapter>/<hash>-<ts>.html when save=true', async () => {
    const fakeFetch = (async () => new Response(SAMPLE_HTML, { status: 200 })) as unknown as typeof fetch;
    const report = await inspectHtml(
      { url: 'https://example.com/page', adapterKind: 'shiji', save: true, maxHeadings: 20 },
      { root, fetchImpl: fakeFetch }
    );
    expect(report.fixturePath).toBeDefined();
    expect(existsSync(report.fixturePath!)).toBe(true);
    expect(readFileSync(report.fixturePath!, 'utf-8')).toBe(SAMPLE_HTML);
  });

  it('does not save fixture when save=false', async () => {
    const fakeFetch = (async () => new Response(SAMPLE_HTML, { status: 200 })) as unknown as typeof fetch;
    const report = await inspectHtml(
      { url: 'https://example.com/page', save: false, maxHeadings: 20 },
      { root, fetchImpl: fakeFetch }
    );
    expect(report.fixturePath).toBeUndefined();
  });

  it('extracts top class names', async () => {
    const fakeFetch = (async () => new Response(SAMPLE_HTML, { status: 200 })) as unknown as typeof fetch;
    const report = await inspectHtml(
      { url: 'https://example.com/page', save: false, maxHeadings: 20 },
      { root, fetchImpl: fakeFetch }
    );
    const chapterTitle = report.topClasses.find((c) => c.cls === 'chapter-title');
    expect(chapterTitle?.count).toBeGreaterThanOrEqual(1);
  });
});
