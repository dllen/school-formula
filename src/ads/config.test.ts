import { describe, expect, it } from 'vitest';
import { AD_SLOTS, ADSENSE_CLIENT_ID, isAdConfigured } from './config';

describe('AdSense config', () => {
  it('ships the real publisher id', () => {
    expect(ADSENSE_CLIENT_ID).toBe('ca-pub-3563451416072185');
  });

  it('defines a slot for every placement', () => {
    expect(Object.keys(AD_SLOTS)).toEqual(['knowledgeMid', 'knowledgeBottom', 'referenceBottom']);
  });

  // 这条是回归护栏：slot 的默认值曾经是占位串 '0000000000'，而它是 truthy，
  // 于是 isAdConfigured() 返回 true，中英所有页面（含预渲染 HTML）都在渲染一个
  // slot 非法的 <ins>，页面上留一块永远不会被填充的空白。
  it('leaves a slot null, not a truthy placeholder, when no slot id was configured', () => {
    const env = import.meta.env as Record<string, string | undefined>;
    const pairs = [
      ['VITE_ADSENSE_SLOT_KNOWLEDGE_MID', AD_SLOTS.knowledgeMid],
      ['VITE_ADSENSE_SLOT_KNOWLEDGE_BOTTOM', AD_SLOTS.knowledgeBottom],
      ['VITE_ADSENSE_SLOT_REFERENCE_BOTTOM', AD_SLOTS.referenceBottom],
    ] as const;

    for (const [envKey, slot] of pairs) {
      if (env[envKey]) {
        expect(slot).toBe(env[envKey]);
      } else {
        expect(slot).toBeNull();
      }
    }
  });

  it('only considers an ad configured when both publisher and a real slot id are present', () => {
    expect(isAdConfigured(ADSENSE_CLIENT_ID, '1234567890')).toBe(true);
    expect(isAdConfigured('', '1234567890')).toBe(false);
    expect(isAdConfigured(ADSENSE_CLIENT_ID, null)).toBe(false);
    expect(isAdConfigured(ADSENSE_CLIENT_ID, '')).toBe(false);
  });
});
