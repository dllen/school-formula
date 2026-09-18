/**
 * Tests for index.ts wizard functions
 *
 * Note: runWizard() requires user input and is tested manually.
 * Only test pure functions that don't require I/O.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildPromptFromWizard, kindFromTask } from './index.js';

const mockWizardResult = {
  provider: 'qwen-no-plan',
  model: 'deepseek-v4-flash',
  stage: '初中' as const,
  subject: '数学',
  grade: '初二',
  task: '教程单元' as const,
};

describe('index.ts - buildPromptFromWizard', () => {
  it('should build prompt for 教程单元', () => {
    const prompt = buildPromptFromWizard({ ...mockWizardResult });
    assert.ok(prompt.includes('初中数学'));
    assert.ok(prompt.includes('初二'));
    assert.ok(prompt.includes('TutorialUnit'));
    assert.ok(prompt.includes('4:4:2'));
  });

  it('should build prompt for 题库 with difficulty', () => {
    const result = {
      ...mockWizardResult,
      stage: '高中' as const,
      subject: '物理',
      grade: '高一',
      task: '题库' as const,
      difficulty: 'hard',
    };

    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('高中物理'));
    assert.ok(prompt.includes('高一'));
    assert.ok(prompt.includes('hard'));
    assert.ok(prompt.includes('练习题'));
    assert.ok(prompt.includes('questions'));
  });

  it('should build prompt for 知识点', () => {
    const result = {
      ...mockWizardResult,
      stage: '初中' as const,
      subject: '化学',
      grade: '初三',
      task: '知识点' as const,
    };

    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('初中化学'));
    assert.ok(prompt.includes('初三'));
    assert.ok(prompt.includes('知识点'));
    assert.ok(prompt.includes('knowledgePoints'));
  });

  it('should build prompt for 速查表', () => {
    const result = {
      ...mockWizardResult,
      stage: '小学' as const,
      subject: '数学',
      grade: '四年级',
      task: '速查表' as const,
    };

    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('小学数学'));
    assert.ok(prompt.includes('速查表'));
    assert.ok(prompt.includes('cheatsheets'));
  });

  it('should build prompt for 公式', () => {
    const result = { ...mockWizardResult, task: '公式' as const };
    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('公式'));
    assert.ok(prompt.includes('formulas'));
  });

  it('should build prompt for 口算', () => {
    const result = { ...mockWizardResult, task: '口算' as const };
    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('口算'));
    assert.ok(prompt.includes('mnemonics'));
  });

  it('should build prompt for 掌握度技巧', () => {
    const result = { ...mockWizardResult, task: '掌握度技巧' as const };
    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('掌握度技巧'));
    assert.ok(prompt.includes('techniques'));
  });

  it('should build prompt for 提示词模板', () => {
    const result = { ...mockWizardResult, task: '提示词模板' as const };
    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('提示词模板'));
    assert.ok(prompt.includes('prompts'));
  });

  it('should handle all school stages', () => {
    const stages = ['小学', '初中', '高中'] as const;
    for (const stage of stages) {
      const result = {
        ...mockWizardResult,
        stage,
        subject: '数学',
        grade: '一年级',
        task: '题库' as const,
      };
      const prompt = buildPromptFromWizard(result);
      assert.ok(prompt.includes(stage), `should include ${stage}`);
    }
  });
});

describe('index.ts - kindFromTask', () => {
  const expected: Record<string, string> = {
    教程单元: 'tutorials',
    题库: 'questions',
    知识点: 'knowledge',
    速查表: 'cheatsheets',
    公式: 'formulas',
    口算: 'mental-math',
    掌握度技巧: 'techniques',
    提示词模板: 'prompts',
  };

  for (const [task, kind] of Object.entries(expected)) {
    it(`maps ${task} -> ${kind}`, () => {
      assert.strictEqual(kindFromTask(task as Parameters<typeof kindFromTask>[0]), kind);
    });
  }
});
