import { beforeEach, describe, expect, it } from 'vitest';
import { adScriptUrl, ensureAdSenseScript, pushAd } from './adsense';

const adWindow = () => window as Window & { adsbygoogle?: unknown[] };

beforeEach(() => {
  document.getElementById('adsbygoogle-js')?.remove();
  adWindow().adsbygoogle = undefined;
});

describe('adScriptUrl', () => {
  it('carries the publisher id', () => {
    expect(adScriptUrl('ca-pub-123')).toContain('adsbygoogle.js?client=ca-pub-123');
  });
});

describe('ensureAdSenseScript', () => {
  it('does nothing without a client id', () => {
    ensureAdSenseScript('');
    expect(document.getElementById('adsbygoogle-js')).toBeNull();
  });

  it('does not add a second loader when one is already present', () => {
    const existing = document.createElement('script');
    existing.id = 'adsbygoogle-js';
    document.getElementById('adsbygoogle-js')?.remove();
    document.head.appendChild(existing);
    ensureAdSenseScript('ca-pub-123');
    expect(document.querySelectorAll('#adsbygoogle-js')).toHaveLength(1);
  });
});

describe('pushAd', () => {
  it('pushes a unit exactly once per element', () => {
    const ins = document.createElement('ins');
    pushAd(ins);
    pushAd(ins);
    expect(adWindow().adsbygoogle).toHaveLength(1);
  });

  it('pushes each distinct element', () => {
    pushAd(document.createElement('ins'));
    pushAd(document.createElement('ins'));
    expect(adWindow().adsbygoogle).toHaveLength(2);
  });
});
