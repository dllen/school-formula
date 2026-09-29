import { mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';

export interface WriteEnvelopeOptions {
  /** 仓库根（staging/ 所在）。 */
  root: string;
  /** adapter kind（如 'shiji'）。 */
  kind: string;
  /** 写到哪：默认 staging/<kind>/extracted-<iso>.json */
  stagingDir?: string;
  /** ISO 时间戳；默认 new Date().toISOString()。 */
  timestamp?: string;
  /** 干跑模式：返回要写的内容与路径，不实际写盘。 */
  dryRun?: boolean;
}

export interface WriteResult {
  path: string;
  bytes: number;
  dryRun: boolean;
}

/** 把 envelope 安全地写到 staging/<kind>/extracted-<ts>.json（tmp + rename）。 */
export function writeEnvelope(envelope: unknown, opts: WriteEnvelopeOptions): WriteResult {
  const ts = (opts.timestamp ?? new Date().toISOString()).replace(/[:.]/g, '-');
  const dir = opts.root + '/' + (opts.stagingDir ?? 'staging') + '/' + opts.kind;
  const finalPath = dir + '/extracted-' + ts + '.json';
  const tmpPath = finalPath + '.tmp';
  const content = JSON.stringify(envelope, null, 2);

  if (opts.dryRun) {
    return { path: finalPath, bytes: content.length, dryRun: true };
  }

  mkdirSync(dirname(tmpPath), { recursive: true });
  writeFileSync(tmpPath, content, 'utf-8');
  renameSync(tmpPath, finalPath);

  return { path: finalPath, bytes: content.length, dryRun: false };
}
