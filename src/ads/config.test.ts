import { describe, expect, it } from 'vitest';
import { AD_SLOTS, ADSENSE_CLIENT_ID, isAdConfigured } from './config';

describe('AdSense config', () => {
  it('ships the real publisher id', () => {
    expect(ADSENSE_CLIENT_ID).toBe('ca-pub-3563451416072185');
  });

  it('defines a slot for every placement', () => {
    expect(Object.keys(AD_SLOTS)).toEqual(['knowledgeMid', 'knowledgeBottom', 'referenceBottom']);
    for (const slot of Object.values(AD_SLOTS)) {
      expect(slot.length).toBeGreaterThan(0);
    }
  });

  it('only considers an ad configured when both publisher and slot are present', () => {
    expect(isAdConfigured(ADSENSE_CLIENT_ID, AD_SLOTS.knowledgeMid)).toBe(true);
    expect(isAdConfigured('', AD_SLOTS.knowledgeMid)).toBe(false);
    expect(isAdConfigured(ADSENSE_CLIENT_ID, '')).toBe(false);
  });
});
