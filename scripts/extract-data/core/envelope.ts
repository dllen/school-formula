// scripts/extract-data/core/envelope.ts

/** 信封基础字段（adapter 在 normalize 中扩展 kind-specific 数据）。 */
export interface BaseEnvelope {
  source: string;       // e.g. 'shiji-kb'
  extractedAt: string;  // ISO 8601
}

/** 运行时校验：返回错误列表，空数组 = 通过。 */
export function validateEnvelope(env: unknown): string[] {
  const errs: string[] = [];
  if (typeof env !== 'object' || env === null) {
    return ['envelope 必须是对象'];
  }
  const e = env as Record<string, unknown>;
  if (typeof e.source !== 'string' || !e.source) errs.push('source 缺失');
  if (typeof e.extractedAt !== 'string' || !e.extractedAt) errs.push('extractedAt 缺失');
  // ISO 8601 校验
  if (typeof e.extractedAt === 'string' && Number.isNaN(Date.parse(e.extractedAt))) {
    errs.push(`extractedAt 不是合法 ISO 8601: ${e.extractedAt}`);
  }
  return errs;
}
