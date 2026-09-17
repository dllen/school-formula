/**
 * Tests for config.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { baseConfig, withModel, getProjectRoot, getAgentDir, THINKING_LEVELS } from './config.js';

describe('config.ts', () => {
  describe('baseConfig', () => {
    it('should return defaults with empty provider/model', () => {
      const c = baseConfig();
      assert.strictEqual(c.provider, '');
      assert.strictEqual(c.model, '');
      assert.strictEqual(c.thinkingLevel, 'medium');
      assert.ok(c.tools.includes('read'));
      assert.ok(c.tools.includes('bash'));
      assert.ok(c.tools.includes('edit'));
    });
  });

  describe('withModel', () => {
    it('should attach provider and model without mutating the base', () => {
      const base = baseConfig();
      const c = withModel(base, 'deepseek', 'deepseek-v4-pro');
      assert.strictEqual(c.provider, 'deepseek');
      assert.strictEqual(c.model, 'deepseek-v4-pro');
      assert.strictEqual(base.provider, '');
    });
  });

  describe('getProjectRoot', () => {
    it('should resolve to the repo root (contains package.json)', () => {
      const root = getProjectRoot();
      assert.ok(existsSync(`${root}/package.json`), `expected package.json at ${root}`);
    });
  });

  describe('getAgentDir', () => {
    it('should end with .pi/agent', () => {
      assert.ok(getAgentDir().endsWith('/.pi/agent'));
    });
  });

  describe('THINKING_LEVELS', () => {
    it('should list all 7 thinking levels', () => {
      assert.deepStrictEqual(
        [...THINKING_LEVELS],
        ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'],
      );
    });
  });
});
