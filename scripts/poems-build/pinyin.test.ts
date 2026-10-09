import { describe, it, expect } from 'vitest';
import { generatePinyin, POEM_PRONUNCIATION_OVERRIDES } from './pinyin';

describe('generatePinyin', () => {
  it('returns one string per input line', () => {
    const lines = ['床前明月光', '疑是地上霜'];
    const out = generatePinyin(lines);
    expect(out).toHaveLength(lines.length);
  });

  it('output contains tone-marked pinyin separated by spaces', () => {
    const out = generatePinyin(['静夜思']);
    expect(out[0]).toContain('jìng');
    expect(out[0]).toMatch(/\s/);
  });

  it('POEM_PRONUNCIATION_OVERRIDES wins over default pronunciation', async () => {
    POEM_PRONUNCIATION_OVERRIDES['__test_key__'] = 'A';
    try {
      const out = generatePinyin(['__test_key__']);
      expect(out[0]).toBe('A');
    } finally {
      delete POEM_PRONUNCIATION_OVERRIDES['__test_key__'];
    }
  });
});