// validate.ts
import ts from 'typescript';
import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { TypeRef } from './types';

const COMPILER_OPTIONS: ts.CompilerOptions = {
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  allowImportingTsExtensions: true,
  esModuleInterop: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
};

/** 用真实类型 `satisfies` 校验 value，返回错误列表（空=通过）。 */
export function typeCheck(value: unknown, ref: TypeRef, root: string): string[] {
  const tmpDir = join(root, 'scripts', 'ingest-data', '.tmp');
  mkdirSync(tmpDir, { recursive: true });
  const file = join(tmpDir, `check-${randomUUID()}.ts`);
  const relPath = relative(tmpDir, ref.path).replace(/\\/g, '/').replace(/\.ts$/, '');
  const importSpec = relPath.startsWith('.') ? relPath : `./${relPath}`;
  const source =
    `import type { ${ref.name} } from ${JSON.stringify(importSpec)};\n` +
    `const __payload = ${JSON.stringify(value)} satisfies ${ref.expr};\n` +
    `void __payload;\n`;
  writeFileSync(file, source, 'utf-8');
  const program = ts.createProgram([file], COMPILER_OPTIONS);
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter((d) => d.file?.fileName === file);
  rmSync(tmpDir, { recursive: true, force: true });
  return diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
}

export function duplicateIds(items: { id: string }[]): string[] {
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const it of items) {
    if (seen.has(it.id)) dups.add(it.id);
    seen.add(it.id);
  }
  return [...dups];
}

export function collidingIds(items: { id: string }[], existing: Set<string>): string[] {
  return items.map((it) => it.id).filter((id) => existing.has(id));
}
