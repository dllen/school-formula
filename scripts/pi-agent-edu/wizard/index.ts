import { print, selectOption } from '../io.js';
import type { ModelChoice } from '../config.js';
import {
  STAGES,
  SUBJECTS_BY_STAGE,
  GRADES_BY_STAGE,
  TASKS,
  DIFFICULTIES,
  QUESTION_COUNTS,
  type Task,
} from './data.js';
import type { WizardResult } from './mapping.js';

export type { Task, WizardResult };

export async function runWizard(models: ModelChoice[]): Promise<WizardResult> {
  print('\n📚 欢迎使用 pi-agent-edu 教育智能体！\n', 'success');
  print('让我来引导你完成内容生成...\n', 'dim');

  // 0. Select model
  const selected = await selectOption(
    '请选择 AI 模型：',
    models,
    (m) => `${m.name} (${m.provider}/${m.model})${m.reasoning ? ' 🧠' : ''}`,
  );
  print(`已选择：${selected.name}\n`, 'info');

  // 1. Select stage
  const stage = await selectOption('请选择学段：', STAGES);
  print(`已选择：${stage}\n`, 'info');

  // 2. Select subject
  const subjects = SUBJECTS_BY_STAGE[stage];
  const subject = await selectOption('请选择科目：', subjects);
  print(`已选择：${subject}\n`, 'info');

  // 3. Select grade
  const grades = GRADES_BY_STAGE[stage];
  const grade = await selectOption('请选择年级：', grades);
  print(`已选择：${grade}\n`, 'info');

  // 4. Select task
  const task = await selectOption('请选择任务类型：', TASKS);
  print(`已选择：${task}\n`, 'info');

  // 5. Select difficulty and count (only for practice questions)
  let difficulty: string | undefined;
  let questionCount: string | undefined;
  if (task === '题库') {
    const diff = await selectOption('请选择题型难度：', DIFFICULTIES);
    print(`已选择：${diff}\n`, 'info');
    difficulty = diff.split('（')[0];

    const count = await selectOption('请选择题型数量：', QUESTION_COUNTS);
    print(`已选择：${count} 道题\n`, 'info');
    questionCount = count;
  }

  return { provider: selected.provider, model: selected.model, stage, subject, grade, task, difficulty, questionCount };
}

export function buildPromptFromWizard(result: WizardResult): string {
  const { stage, subject, grade, task, difficulty, questionCount } = result;
  switch (task) {
    case '教程单元':
      return `生成【${stage}${subject} - ${grade}】的 TutorialUnit，输出 JSON 信封 { "tutorial": {…} }，含 10 道练习题（easy:medium:hard = 4:4:2）`;
    case '题库': {
      const count = questionCount || '10';
      const diff = difficulty ? `（${difficulty}）` : '（basic:intermediate:advanced = 4:4:2）';
      return `生成 ${count} 道${stage}${subject}${grade}练习题，输出 JSON 信封 { "questions": [ …Question ] }，难度${diff}`;
    }
    case '知识点':
      return `生成【${stage}${subject} - ${grade}】知识点，输出 JSON 信封 { "grade", "subject", "knowledgePoints": [ … ] }`;
    case '速查表':
      return `生成【${stage}${subject}】速查表，输出 JSON 信封 { "cheatsheets": [ … ] }`;
    case '公式':
      return `生成【${stage}${subject}】公式，输出 JSON 信封 { "formulas": [ … ] }`;
    case '口算':
      return `生成【${stage}${subject}】口算口诀，输出 JSON 信封 { "grade", "mnemonics": [ … ] }`;
    case '掌握度技巧':
      return `生成【${stage}${subject}】掌握度技巧，输出 JSON 信封 { "techniques": [ … ] }`;
    case '提示词模板':
      return `生成【${stage}${subject}】提示词模板，输出 JSON 信封 { "prompts": [ … ] }`;
  }
}
