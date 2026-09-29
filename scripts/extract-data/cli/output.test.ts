import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeEnvelope } from './output.js';

let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'extract-output-'));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('writeEnvelope', () => {
  it('writes to staging/<kind>/extracted-<ts>.json (atomic)', () => {
    const env = { source: 'shiji-kb', extractedAt: '2026-09-29T00:00:00.000Z', volumes: [] };
    const result = writeEnvelope(env, { root, kind: 'shiji', timestamp: '2026-09-29T00-00-00-000Z' });
    expect(result.path).toBe(join(root, 'staging', 'shiji', 'extracted-2026-09-29T00-00-00-000Z.json'));
    expect(existsSync(result.path)).toBe(true);
    expect(existsSync(result.path + '.tmp')).toBe(false); // tmp 已 rename
    expect(JSON.parse(readFileSync(result.path, 'utf-8'))).toEqual(env);
  });

  it('dry-run returns path without writing', () => {
    const env = { source: 'x', extractedAt: '2026-09-29T00:00:00.000Z' };
    const result = writeEnvelope(env, { root, kind: 'shiji', timestamp: '2026-09-29T00-00-00-000Z', dryRun: true });
    expect(result.dryRun).toBe(true);
    expect(existsSync(result.path)).toBe(false);
  });

  it('creates staging/ subdir if missing', () => {
    const env = { source: 'x', extractedAt: '2026-09-29T00:00:00.000Z' };
    writeEnvelope(env, { root, kind: 'shiji', timestamp: '2026-09-29T00-00-00-000Z' });
    expect(existsSync(join(root, 'staging', 'shiji'))).toBe(true);
  });
});
