import { describe, test, expect } from 'vitest';
import { selectBestTemplate, ALL_PROMPTS } from '../src/data/prompts/index.ts';

describe('selectBestTemplate', () => {
  test('小学 explain 返回年级专属模板', () => {
    const t = selectBestTemplate('explain', 'primary', '数学');
    expect(t.gradeLevel).toBe('primary');
    expect(t.id).toContain('primary');
  });

  test('高中 interaction 返回高中版', () => {
    const t = selectBestTemplate('interaction', 'high', '物理');
    expect(t.gradeLevel).toBe('high');
  });

  test('无匹配模板时抛错', () => {
    expect(() => selectBestTemplate('explain', 'primary', '不存在学科×××')).toThrow(/no template/);
  });

  test('所有模板都有合法 scenario', () => {
    const valid = ['explain','generate','assess','plan','error-analysis','derivation','explore','interaction'];
    for (const p of ALL_PROMPTS) expect(valid).toContain(p.scenario);
  });
});
