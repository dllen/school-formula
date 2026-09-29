// scripts/extract-data/core/runner.ts
import type { Adapter } from './adapter.js';
import { shijiKbAdapter } from '../adapters/shiji-kb.js';

const REGISTRY: Adapter[] = [shijiKbAdapter];

export function listAdapters(): Adapter[] {
  return REGISTRY.slice();
}

export function getAdapter(kind: string): Adapter | undefined {
  return REGISTRY.find(a => a.kind === kind);
}

// 注：runAdapter 的真实实现在 Task 9 完成（adapter 接口在 Task 9 拆成 fetchHtml + parseHtml）。
// 本任务只把 registry 部分跑通，runAdapter 不导出、避免外部误用。
