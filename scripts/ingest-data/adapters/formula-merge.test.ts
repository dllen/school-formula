// adapters/formula-merge.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { formulaAdapter } from './formula';
import { typeCheck } from '../validate';
import { getRoot } from '../paths';

const formula = {
  id: 'merge-smoke-001',
  name: '测试公式',
  expression: 'S = a²',
  grade: 'primary',
  subject: '数学',
  condition: 'a 为边长',
  hint: 'smoke',
};

test('formulaAdapter.merge 追加到临时 formulas.ts 且结果可解析', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ingest-formula-'));
  const dataDir = join(dir, 'src', 'data');
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(join(dataDir, 'formulas.ts'), readFileSync(join(getRoot(), 'src', 'data', 'formulas.ts'), 'utf-8'), 'utf-8');
  const ctx = { root: dir, dryRun: false, knowledgePointIds: new Set<string>() };
  const raw = { formulas: [formula] };

  const merged = formulaAdapter.merge([formula], raw, ctx);
  assert.equal(merged.inserted, 1);

  const content = readFileSync(join(dataDir, 'formulas.ts'), 'utf-8');
  assert.ok(content.includes(formula.id));

  // 合并结果在语法层面仍可解析（module resolution 不参与 transpileModule）
  const result = ts.transpileModule(content, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
    fileName: 'formulas.ts',
  });
  assert.deepEqual(result.diagnostics, []);

  // payload 自身满足真实 Formula 类型
  assert.deepEqual(typeCheck([formula], formulaAdapter.typeRef, getRoot()), []);

  rmSync(dir, { recursive: true, force: true });
});
