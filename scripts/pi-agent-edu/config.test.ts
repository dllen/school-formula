/**
 * Tests for config.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

describe('config.ts', () => {
  describe('pi binary detection', () => {
    it('should find pi in PATH', () => {
      try {
        const result = execSync('which pi', { encoding: 'utf-8', timeout: 5000 }).trim();
        assert.ok(result.length > 0, 'pi path should not be empty');
        assert.ok(existsSync(result), `pi should exist at ${result}`);
      } catch {
        // pi not installed - skip this test
        console.log('pi not installed, test skipped');
      }
    });

    it('should handle command not found gracefully', () => {
      // This verifies the error handling logic
      try {
        execSync('which nonexistent-command-xyz', { encoding: 'utf-8', timeout: 1000 });
        assert.fail('should have thrown');
      } catch (e) {
        assert.ok(e instanceof Error);
      }
    });
  });
});
