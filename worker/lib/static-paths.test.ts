import { describe, expect, it } from 'vitest';
import { assetCandidates, isSeoFile } from './static-paths';

describe('assetCandidates', () => {
  it('serves file paths as-is', () => {
    expect(assetCandidates('/assets/index-abc.js')).toEqual(['/assets/index-abc.js']);
  });

  it('tries directory index.html then the SPA shell', () => {
    expect(assetCandidates('/tutorial')).toEqual(['/tutorial/index.html', '/index.html']);
    expect(assetCandidates('/')).toEqual(['/index.html']);
    expect(assetCandidates('/knowledge/p-math-1')).toEqual(['/knowledge/p-math-1/index.html', '/index.html']);
  });

  it('serves robots.txt and sitemap.xml as files with no SPA fallback', () => {
    expect(assetCandidates('/robots.txt')).toEqual(['/robots.txt']);
    expect(assetCandidates('/sitemap.xml')).toEqual(['/sitemap.xml']);
  });

  it('does not fall back to the app shell under the prerendered /en/ surface', () => {
    expect(assetCandidates('/en/math/multiplication-chart')).toEqual([
      '/en/math/multiplication-chart/index.html',
    ]);
    expect(assetCandidates('/en/typo')).toEqual(['/en/typo/index.html']);
    expect(assetCandidates('/en')).toEqual(['/en/index.html']);
  });

  it('keeps the app-shell fallback for the Chinese app', () => {
    expect(assetCandidates('/tutorial')).toEqual(['/tutorial/index.html', '/index.html']);
    expect(assetCandidates('/unknown')).toEqual(['/unknown/index.html', '/index.html']);
  });
});

describe('isSeoFile', () => {
  it('recognises the generated site files', () => {
    expect(isSeoFile('/robots.txt')).toBe(true);
    expect(isSeoFile('/sitemap.xml')).toBe(true);
    expect(isSeoFile('/index.html')).toBe(false);
    expect(isSeoFile('/tutorial')).toBe(false);
  });
});
