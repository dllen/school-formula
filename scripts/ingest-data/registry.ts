// registry.ts
import type { Adapter } from './types';
import { cheatsheetAdapter } from './adapters/cheatsheet';
import { formulaAdapter } from './adapters/formula';
import { mentalMathAdapter } from './adapters/mental-math';
import { techniqueAdapter } from './adapters/technique';

// 后续 task 会把其余 adapter 加进来。
const adapters: Adapter[] = [
  cheatsheetAdapter,
  formulaAdapter,
  mentalMathAdapter,
  techniqueAdapter,
];

export const registry: Map<string, Adapter> = new Map(adapters.map((a) => [a.kind, a]));

export function getAdapter(kind: string): Adapter {
  const a = registry.get(kind);
  if (!a) throw new Error(`未知数据类型: ${kind}`);
  return a;
}
