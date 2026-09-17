#!/usr/bin/env node

/**
 * pi-agent-edu CLI entry point.
 *
 * Usage:
 *   node index.ts              Start new session
 *   node index.ts --sessions   List saved sessions
 *   node index.ts --continue   Resume last session
 *   node index.ts --continue <id>   Resume specific session
 *   node index.ts --new        Force new session
 */

import { parseArgs } from 'node:util';
import { print, prompt, confirm, selectOption } from './io.js';
import { loadConfig, getAvailableProviders } from './config.js';
import { listSessions, newSessionId, loadSessionMessages } from './storage.js';
import { InteractiveSession } from './session.js';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

interface CliArgs {
  sessions: boolean;
  continue: string | null;
  new: boolean;
}

function parseCliArgs(): CliArgs {
  const { values } = parseArgs({
    options: {
      sessions: { type: 'boolean', short: 'l' },
      continue: { type: 'string', short: 'c' },
      new: { type: 'boolean', short: 'n' },
    },
  });

  return {
    sessions: values.sessions === true,
    continue: values.continue ?? null,
    new: values.new === true,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function showHelp(): void {
  print(`pi-agent-edu CLI — 教育智能体交互工具

用法:
  node index.ts              启动新会话
  node index.ts --sessions   列出所有会话
  node index.ts --continue  继续上次会话
  node index.ts --continue <id>  继续指定会话
  node index.ts --new       强制新建会话
  node index.ts --help      显示本帮助

交互命令:
  help, ?         显示帮助
  q, quit, exit   退出（会询问是否保存）
  save            保存当前会话
`, 'info');
}

// ---------------------------------------------------------------------------
// Wizard mode - guide user through content generation
// ---------------------------------------------------------------------------

const STAGES = ['小学', '初中', '高中'] as const;
type Stage = typeof STAGES[number];

const SUBJECTS_BY_STAGE: Record<Stage, readonly string[]> = {
  '小学': ['数学', '语文', '英语', '科学', '道德与法治'],
  '初中': ['数学', '物理', '化学', '语文', '英语', '历史', '地理', '道德与法治'],
  '高中': ['数学', '物理', '化学', '生物', '语文', '英语', '历史', '地理', '政治'],
};

const GRADES_BY_STAGE: Record<Stage, readonly string[]> = {
  '小学': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  '初中': ['初一', '初二', '初三'],
  '高中': ['高一', '高二', '高三'],
};

const TASKS = ['TutorialUnit（教程单元）', '练习题', '错题分析', '学习规划'] as const;
type Task = typeof TASKS[number];

const DIFFICULTIES = ['easy（容易）', 'medium（中等）', 'hard（困难）'] as const;

const QUESTION_COUNTS = ['5', '10', '15', '20'] as const;

interface WizardResult {
  provider: string;
  stage: Stage;
  subject: string;
  grade: string;
  task: Task;
  difficulty?: string;
  questionCount?: string;
}

export async function runWizard(): Promise<WizardResult> {
  print('\n📚 欢迎使用 pi-agent-edu 教育智能体！\n', 'success');
  print('让我来引导你完成内容生成...\n', 'dim');

  // 0. Select provider
  const providers = getAvailableProviders();
  let providerId = 'openai';
  if (providers.length > 0) {
    const selected = await selectOption('请选择 AI Provider：', providers, (p) => `${p.name} (${p.id})`);
    providerId = selected.id;
    print(`已选择：${selected.name}\n`, 'info');
  }

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
  if (task === '练习题') {
    const diff = await selectOption('请选择题型难度：', DIFFICULTIES);
    print(`已选择：${diff}\n`, 'info');
    difficulty = diff.split('（')[0];

    const count = await selectOption('请选择题型数量：', QUESTION_COUNTS);
    print(`已选择：${count} 道题\n`, 'info');
    questionCount = count;
  }

  return { provider: providerId, stage, subject, grade, task, difficulty, questionCount };
}

export function buildPromptFromWizard(result: WizardResult): string {
  const { stage, subject, grade, task, difficulty, questionCount } = result;

  switch (task) {
    case 'TutorialUnit（教程单元）':
      return `生成【${stage}${subject} - ${grade}】TutorialUnit，包含10道练习题（easy:medium:hard = 4:4:2）`;

    case '练习题': {
      const count = questionCount || '10';
      const diff = difficulty ? `（${difficulty}）` : '（easy:medium:hard = 4:4:2）';
      return `生成${count}道${stage}${subject}${grade}练习题${diff}`;
    }

    case '错题分析':
      return `${stage}${subject}${grade}错题分析：分析学习中的常见错误，提供典型例题和讲解`;

    case '学习规划': {
      return `为${stage}${subject}${grade}生成学习计划（期中/期末复习规划）`;
    }

    default:
      return `生成${stage}${subject}${grade}学习内容`;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseCliArgs();

  if (args.sessions) {
    const sessions = listSessions();
    if (sessions.length === 0) {
      print('没有已保存的会话', 'warn');
    } else {
      print(`\n会话列表 (共 ${sessions.length}):\n`, 'info');
      sessions.forEach((s) => {
        const date = new Date(s.createdAt).toLocaleString('zh-CN');
        print(`  [${s.id}] ${date}`, 'info');
        if (s.summary) print(`    ${s.summary}`, 'dim');
      });
    }
    return;
  }

  // Load config (first-time:引导设置API Key)
  const config = await loadConfig();

  // Determine session ID
  let sessionId: string;
  let messages: unknown[] = [];

  if (args.continue) {
    sessionId = args.continue;
    messages = loadSessionMessages(sessionId) ?? [];
    if (messages.length === 0) {
      print(`会话 ${sessionId} 无消息记录，将作为新会话开始`, 'warn');
    } else {
      print(`继续会话 ${sessionId} (${messages.length} 条消息)`, 'success');
    }
  } else if (args.new) {
    // Force new session with wizard
    sessionId = newSessionId();
    messages = [];
    print(`创建新会话 ${sessionId}`, 'info');
  } else {
    // Default: ask user
    const sessions = listSessions();
    if (sessions.length > 0) {
      print(`\n发现 ${sessions.length} 个已保存的会话`, 'info');
      print('  [1] 继续上次会话', 'info');
      print('  [2] 引导模式（新会话）', 'info');
      const choice = await prompt('请选择 [1/2]: ');
      if (choice === '1') {
        sessionId = sessions[0].id;
        messages = loadSessionMessages(sessionId) ?? [];
        print(`继续会话 ${sessionId} (${messages.length} 条消息)`, 'success');
      } else {
        sessionId = newSessionId();
        messages = [];
        print(`创建新会话 ${sessionId}`, 'info');
      }
    } else {
      // No sessions: run wizard by default
      sessionId = newSessionId();
      messages = [];
      print(`创建新会话 ${sessionId}`, 'info');
    }
  }

  // Run wizard for new sessions (when no messages loaded from resume)
  if (messages.length === 0) {
    const wizardResult = await runWizard();
    const wizardPrompt = buildPromptFromWizard(wizardResult);
    print(`\n🎯 正在生成内容...\n`, 'thinking');
    print(`提示词：${wizardPrompt}\n`, 'dim');
    messages.push({ role: 'user', content: wizardPrompt });

    // Update config with provider from wizard
    config.provider = wizardResult.provider;
  }

  // Create session instance (real session stores messages internally)
  const session = new InteractiveSession(config, sessionId);

  // -------------------------------------------------------------------------
  // Interactive loop
  // -------------------------------------------------------------------------

  // If we have a wizard prompt, send it first
  const pendingWizardPrompt = messages.find((m) => typeof (m as {role?: string; content?: string}).content === 'string')
    ? (messages.shift() as {role: string; content: string}).content
    : null;

  if (pendingWizardPrompt) {
    print('', 'dim');
    try {
      const response = await session.prompt(pendingWizardPrompt);
      print(`\n${response}`, 'info');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      print(`错误: ${msg}`, 'error');
    }
  }

  print('\n--- pi-agent-edu 交互模式 ---', 'info');
  print('输入 help 查看可用命令，输入 q 退出\n', 'dim');

  let running = true;
  while (running) {
    const input = await prompt('> ');

    if (!input.trim()) continue;

    const cmd = input.trim().toLowerCase();

    if (cmd === 'q' || cmd === 'quit' || cmd === 'exit') {
      const shouldSave = await confirm('是否保存当前会话？');
      if (shouldSave) {
        // Session stores messages internally; save minimal meta
        const { saveSession } = await import('./storage.js');
        saveSession(sessionId, `Session ${sessionId}`);
        print(`会话已保存: ${sessionId}`, 'success');
      }
      running = false;
      continue;
    }

    if (cmd === 'help' || cmd === '?') {
      showHelp();
      continue;
    }

    if (cmd === 'save') {
      const { saveSession } = await import('./storage.js');
      saveSession(sessionId, `Session ${sessionId}`);
      print('会话已保存', 'success');
      continue;
    }

    // Regular user message → send to agent
    print('', 'dim');
    try {
      const response = await session.prompt(input);
      print(`\n${response}`, 'info');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      print(`错误: ${msg}`, 'error');
    }
  }

  print('再见！', 'success');
}

// Only run main when executed directly (not imported for testing)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    print(`Fatal: ${err instanceof Error ? err.message : String(err)}`, 'error');
    process.exit(1);
  });
}
