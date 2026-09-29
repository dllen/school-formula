import { describe, it, expect } from 'vitest';
import { validateEnvelope } from './envelope.js';

describe('validateEnvelope', () => {
  it('accepts a valid envelope', () => {
    const env = { source: 'shiji-kb', extractedAt: '2026-09-29T00:00:00.000Z', volumes: [] };
    expect(validateEnvelope(env)).toEqual([]);
  });

  it('rejects non-object', () => {
    expect(validateEnvelope(null)).toEqual(['envelope 必须是对象']);
    expect(validateEnvelope('string')).toEqual(['envelope 必须是对象']);
    expect(validateEnvelope(42)).toEqual(['envelope 必须是对象']);
  });

  it('rejects missing source', () => {
    const env = { extractedAt: '2026-09-29T00:00:00.000Z' };
    expect(validateEnvelope(env)).toContain('source 缺失');
  });

  it('rejects missing extractedAt', () => {
    const env = { source: 'shiji-kb' };
    expect(validateEnvelope(env)).toContain('extractedAt 缺失');
  });

  it('rejects invalid ISO 8601', () => {
    const env = { source: 'shiji-kb', extractedAt: 'not-a-date' };
    const errs = validateEnvelope(env);
    expect(errs.some(e => e.includes('extractedAt 不是合法 ISO 8601'))).toBe(true);
  });
});
