import { describe, test, expect } from 'vitest';
import { validateFields } from './generate-fields.mjs';

describe('validateFields', () => {
  const base = {
    funEmoji: '🔢',
    funFact: 'f',
    funStory: 's',
    funQuestion: 'q',
    funQuestionAnswer: 'a',
    detailedExplanation: 'x'.repeat(150),
    studyTips: ['t1', 't2'],
    practiceQuestions: [1, 2, 3].map(i => ({ question: `q${i}`, answer: 'a', briefTip: 't' })),
  };

  test('合法字段通过', () => {
    expect(() => validateFields(base, 'p-math-1')).not.toThrow();
  });

  test('explanation 过短报错', () => {
    expect(() => validateFields({ ...base, detailedExplanation: 'short' }, 'p-math-1')).toThrow(/too short/);
  });

  test('练习题少于 3 报错', () => {
    expect(() => validateFields({ ...base, practiceQuestions: [1, 2] }, 'p-math-1')).toThrow(/≥3|practiceQuestions/);
  });

  test('studyTips 为空报错', () => {
    expect(() => validateFields({ ...base, studyTips: [] }, 'p-math-1')).toThrow(/studyTips/);
  });

  test('缺少 fun 字段时报错', () => {
    const { funEmoji, ...rest } = base;
    expect(() => validateFields(rest, 'p-math-1')).toThrow(/funEmoji|fun\*/);
  });
});
