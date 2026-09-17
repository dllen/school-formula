// adapters/simple-array.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext, TypeRef } from '../types';
import { appendToConstArray, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

export interface SimpleArrayConfig {
  kind: string;
  envelopeKey: string;
  typeRef: TypeRef;
  /** 目标文件（相对仓库根）。 */
  file: string;
  /** 由单个 item 推导目标 const 数组名（用于按 grade 分数组）。 */
  arrayName: (item: any) => string;
  /** 额外业务校验（id 唯一之外）。 */
  checks?: (items: any[], ctx: IngestContext) => string[];
}

export function simpleArrayAdapter(cfg: SimpleArrayConfig): Adapter {
  return {
    kind: cfg.kind,
    typeRef: cfg.typeRef,
    extract(raw) {
      return (raw as Record<string, unknown>)[cfg.envelopeKey];
    },
    validate(value, ctx) {
      if (!Array.isArray(value)) return ['payload 必须是数组'];
      const items = value as { id: string }[];
      const errs: string[] = [];
      const existing = existingIds(cfg, ctx);
      for (const id of duplicateIds(items)) errs.push(`重复 id: ${id}`);
      for (const id of collidingIds(items, existing)) errs.push(`id 已存在: ${id}`);
      if (cfg.checks) errs.push(...cfg.checks(items, ctx));
      return errs;
    },
    merge(value, _raw, ctx) {
      const abs = join(ctx.root, cfg.file);
      const content = readFileSync(abs, 'utf-8');
      const items = value as any[];
      const groups = new Map<string, any[]>();
      for (const it of items) {
        const name = cfg.arrayName(it);
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name)!.push(it);
      }
      let updated = content;
      for (const [name, group] of groups) {
        updated = appendToConstArray(updated, name, group);
      }
      writeFileSync(abs, updated, 'utf-8');
      return { files: [abs], inserted: items.length };
    },
    wire() {
      return { files: [] };
    },
  };
}

function existingIds(cfg: SimpleArrayConfig, ctx: IngestContext): Set<string> {
  return extractIds(readFileSync(join(ctx.root, cfg.file), 'utf-8'));
}
