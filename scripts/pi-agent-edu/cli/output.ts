import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { getProjectRoot } from '../config.js';

export function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Timestamp string for default output filenames (YYYY-MM-DD-HH-mm-ss). */
export function timestampName(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

/**
 * Write generated content to a file inside the repo.
 * `path` is relative to the repo root unless absolute; defaults to
 * `scripts/pi-agent-edu/output/generated-<timestamp>.ts`.
 */
export function saveContent(text: string, path?: string): string {
  const root = getProjectRoot();
  const target = path
    ? (path.startsWith('/') ? path : join(root, path))
    : join(root, 'scripts', 'pi-agent-edu', 'output', `generated-${timestampName()}.ts`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text, 'utf-8');
  return target;
}
