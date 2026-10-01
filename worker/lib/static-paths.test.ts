import { describe, expect, it } from 'vitest';
import { assetCandidates } from './static-paths';

describe('assetCandidates', () => {
  it('serves file paths as-is', () => {
    expect(assetCandidates('/assets/index-abc.js')).toEqual(['/assets/index-abc.js']);
  });

  it('tries directory index.html then the SPA shell', () => {
    expect(assetCandidates('/tutorial')).toEqual(['/tutorial/index.html', '/index.html']);
    expect(assetCandidates('/')).toEqual(['/index.html']);
    expect(assetCandidates('/knowledge/p-math-1')).toEqual(['/knowledge/p-math-1/index.html', '/index.html']);
  });
});
