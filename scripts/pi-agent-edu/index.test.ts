/**
 * Tests for index.ts wizard functions
 *
 * Note: runWizard() requires user input and is tested manually.
 * Only test pure functions that don't require I/O.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildPromptFromWizard } from './index.js';

const mockWizardResult = {
  provider: 'qwen-no-plan',
  model: 'deepseek-v4-flash',
  stage: '初中' as const,
  subject: '数学',
  grade: '初二',
  task: 'TutorialUnit（教程单元）' as const,
};

describe('index.ts - buildPromptFromWizard', () => {
  it('should build prompt for TutorialUnit', () => {
    const prompt = buildPromptFromWizard({ ...mockWizardResult });
    assert.ok(prompt.includes('初中数学'));
    assert.ok(prompt.includes('初二'));
    assert.ok(prompt.includes('TutorialUnit'));
    assert.ok(prompt.includes('4:4:2'));
  });

  it('should build prompt for practice questions with difficulty', () => {
    const result = {
      ...mockWizardResult,
      stage: '高中' as const,
      subject: '物理',
      grade: '高一',
      task: '练习题' as const,
      difficulty: 'hard',
    };

    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('高中物理'));
    assert.ok(prompt.includes('高一'));
    assert.ok(prompt.includes('hard'));
    assert.ok(prompt.includes('练习题'));
  });

  it('should build prompt for error analysis', () => {
    const result = {
      ...mockWizardResult,
      stage: '初中' as const,
      subject: '化学',
      grade: '初三',
      task: '错题分析' as const,
    };

    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('初中化学'));
    assert.ok(prompt.includes('初三'));
    assert.ok(prompt.includes('错题分析'));
    assert.ok(prompt.includes('常见错误'));
  });

  it('should build prompt for study plan', () => {
    const result = {
      ...mockWizardResult,
      stage: '小学' as const,
      subject: '数学',
      grade: '四年级',
      task: '学习规划' as const,
    };

    const prompt = buildPromptFromWizard(result);
    assert.ok(prompt.includes('小学数学'));
    assert.ok(prompt.includes('四年级'));
    assert.ok(prompt.includes('学习计划'));
  });

  it('should handle all school stages', () => {
    const stages = ['小学', '初中', '高中'] as const;
    for (const stage of stages) {
      const result = {
        ...mockWizardResult,
        stage,
        subject: '数学',
        grade: '一年级',
        task: '练习题' as const,
      };
      const prompt = buildPromptFromWizard(result);
      assert.ok(prompt.includes(stage), `should include ${stage}`);
    }
  });
});
