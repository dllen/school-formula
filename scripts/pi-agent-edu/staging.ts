// scripts/pi-agent-edu/staging.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { getProjectRoot } from './config.js';

const ENVELOPE_KEY_TO_KIND: Record<string, string> = {
  tutorial: 'tutorials',
  questions: 'questions',
  knowledgePoints: 'knowledge',
  cheatsheets: 'cheatsheets',
  formulas: 'formulas',
  mnemonics: 'mental-math',
  techniques: 'techniques',
  prompts: 'prompts',
};

/** 从 agent 文本回复中提取 JSON 值（去围栏、去尾部文字）。 */
export function extractJson(text: string): unknown {
  let s = text.replace(/```(?:json)?/gi, '').trim();
  const start = s.search(/[[{]/);
  if (start === -1) throw new Error('未找到 JSON');
  s = s.slice(start);
  // 逐次从末尾裁剪，直到 JSON.parse 成功（容忍尾部 prose）
  for (let end = s.length; end > 0; end--) {
    if ('} ]'.includes(s[end - 1])) {
      try { return JSON.parse(s.slice(0, end)); } catch { /* 继续收缩 */ }
    }
  }
  throw new Error('JSON 解析失败');
}

/** 按信封键推断入库 kind（staging 目录名）。 */
export function inferKindFromEnvelope(json: unknown): string {
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    for (const key of Object.keys(json)) {
      const kind = ENVELOPE_KEY_TO_KIND[key];
      if (kind) return kind;
    }
  }
  throw new Error('无法识别信封类型');
}

/** 把生成的 JSON 文本写入 staging/<kind>/<timestamp>.json，返回路径。 */
export function saveToStaging(text: string, explicitKind?: string): string {
  const json = extractJson(text);
  const kind = explicitKind ?? inferKindFromEnvelope(json);
  const root = getProjectRoot();
  const name = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const target = join(root, 'staging', kind, `generated-${name}.json`);
  mkdirSync(join(root, 'staging', kind), { recursive: true });
  writeFileSync(target, JSON.stringify(json, null, 2), 'utf-8');
  return target;
}
