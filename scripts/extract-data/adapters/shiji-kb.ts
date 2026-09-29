// scripts/extract-data/adapters/shiji-kb.ts
// NOTE: 这是占位 stub，将在 Task 9 由真实实现替换。
import type { Adapter } from '../core/adapter.js';

export const shijiKbAdapter: Adapter = {
  kind: 'shiji',
  name: '史记知识库',
  description: '抽取 baojie.github.io/shiji-kb/ 的 12 本纪',
  listUrls: async () => [],
  fetchPage: async () => ({}),
  normalize: () => ({ source: 'shiji-kb', extractedAt: '2026-01-01T00:00:00.000Z' }),
};
