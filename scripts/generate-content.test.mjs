import { describe, test, expect } from 'vitest';
import { parseTutorialContent, validateTutorialContent } from './generate-content.mjs';

const SAMPLE = `# 🎯 本课目标
1. 理解分数的意义
2. 掌握分数加减法
3. 解决生活中的分数问题

# 📖 知识讲解
分数表示把单位"1"平均分成若干份...

# ✏️ 例题精讲
1. **题目**：1/2 + 1/3 = ?
   解答：先通分...
   思路：异分母分数相加，关键是...

# 🧩 亲子互动
准备材料：一张纸、剪刀

# 📝 课后练习
第 1 题：1/4 + 2/4 = ?
`;

describe('parseTutorialContent', () => {
  test('解析全部 5 节', () => {
    const tc = parseTutorialContent(SAMPLE);
    expect(tc.objectives.length).toBe(3);
    expect(tc.explanation.length).toBeGreaterThan(10);
    expect(tc.examples.length).toBe(1);
    expect(tc.examples[0].problem).toBe('1/2 + 1/3 = ?');
    expect(tc.interaction).toContain('纸');
    expect(tc.exercises.length).toBe(1);
  });

  test('无例题时返回空数组', () => {
    const tc = parseTutorialContent('# 🎯 本课目标\n1. a\n2. b\n3. c\n\n# 📖 知识讲解\nx\n\n# ✏️ 例题精讲\n（无）\n\n# 🧩 亲子互动\ny\n\n# 📝 课后练习\nz');
    expect(tc.examples).toEqual([]);
  });

  test('validateTutorialContent 合法数据通过', () => {
    const ex = { title: '分数加法', problem: '1/2+1/3=?', solution: '5/6', tip: '通分' };
    const ok = {
      objectives: ['a', 'b', 'c'],
      explanation: 'x'.repeat(250),
      examples: [ex],
      interaction: 'y'.repeat(50),
      exercises: [{ question: 'q', answer: 'a', explanation: 'e' }],
    };
    expect(() => validateTutorialContent(ok, 'p-math-1')).not.toThrow();
  });

  test('validateTutorialContent 目标不足报错', () => {
    const bad = {
      objectives: ['a'],
      explanation: 'x'.repeat(250),
      examples: [{ title: 't', problem: 'p', solution: 's', tip: 't' }],
      interaction: 'y'.repeat(50),
      exercises: [],
    };
    expect(() => validateTutorialContent(bad, 'p-math-1')).toThrow(/objectives/);
  });
});
