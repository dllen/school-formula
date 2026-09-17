/**
 * Tests for io.ts utilities
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

import { print } from './io.js';

describe('io.ts', () => {
  describe('print', () => {
    it('should not throw on any message type', () => {
      const types = ['info', 'success', 'warn', 'error', 'thinking', 'dim'] as const;
      for (const type of types) {
        assert.doesNotThrow(() => print(`Test message for ${type}`, type));
      }
    });

    it('should handle empty string', () => {
      assert.doesNotThrow(() => print('', 'info'));
    });

    it('should handle unicode characters', () => {
      assert.doesNotThrow(() => print('中文测试 🎉', 'success'));
    });

    it('should handle long strings', () => {
      const long = 'a'.repeat(1000);
      assert.doesNotThrow(() => print(long, 'info'));
    });
  });
});
