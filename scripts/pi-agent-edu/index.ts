#!/usr/bin/env node

/**
 * pi-agent-edu CLI entry point.
 *
 * Usage:
 *   node index.ts               Start new session (wizard)
 *   node index.ts --sessions    List saved sessions
 *   node index.ts --continue    Resume last session
 *   node index.ts --continue <id>  Resume specific session
 *   node index.ts --new         Force new session
 */

import { parseArgs } from 'node:util';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { SessionManager } from '@earendil-works/pi-coding-agent';
import { print, prompt, selectOption } from './io.js';
import {
  createModelRuntime,
  getAvailableModels,
  baseConfig,
  withModel,
  getProjectRoot,
  type Config,
  type ModelChoice,
} from './config.js';
import { InteractiveSession, type SessionCreateOptions } from './session.js';

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

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Timestamp string for default output filenames (YYYY-MM-DD-HH-mm-ss). */
function timestampName(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

/**
 * Write generated content to a file inside the repo.
 * `path` is relative to the repo root unless absolute; defaults to
 * `scripts/pi-agent-edu/output/generated-<timestamp>.ts`.
 */
function saveContent(text: string, path?: string): string {
  const root = getProjectRoot();
  const target = path
    ? (path.startsWith('/') ? path : join(root, path))
    : join(root, 'scripts', 'pi-agent-edu', 'output', `generated-${timestampName()}.ts`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text, 'utf-8');
  return target;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function showHelp(): void {
  print(`pi-agent-edu CLI — 教育智能体交互工具

用法:
  node index.ts              启动新会话（引导模式）
  node index.ts --sessions   列出所有会话
  node index.ts --continue   继续上次会话
  node index.ts --continue <id>  继续指定会话
  node index.ts --new        强制新建会话
  node index.ts --help       显示本帮助

交互命令:
  help, ?         显示帮助
  q, quit, exit   退出
  退出            保存最近生成内容并退出
  save, 保存      保存最近生成内容到仓库（save <路径> 指定位置）
  btw <文字>      旁注：只对下一轮生效
  model, provider 切换 AI 模型
  thinking        切换思考级别
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
  model: string;
  stage: Stage;
  subject: string;
  grade: string;
  task: Task;
  difficulty?: string;
  questionCount?: string;
}

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
  if (task === '练习题') {
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
    case 'TutorialUnit（教程单元）':
      return `生成【${stage}${subject} - ${grade}】TutorialUnit，包含10道练习题（easy:medium:hard = 4:4:2）`;

    case '练习题': {
      const count = questionCount || '10';
      const diff = difficulty ? `（${difficulty}）` : '（easy:medium:hard = 4:4:2）';
      return `生成${count}道${stage}${subject}${grade}练习题${diff}`;
    }

    case '错题分析':
      return `${stage}${subject}${grade}错题分析：分析学习中的常见错误，提供典型例题和讲解`;

    case '学习规划':
      return `为${stage}${subject}${grade}生成学习计划（期中/期末复习规划）`;

    default:
      return `生成${stage}${subject}${grade}学习内容`;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseCliArgs();
  const runtime = await createModelRuntime();

  // --sessions: list native pi sessions for this project
  if (args.sessions) {
    const sessions = await SessionManager.list(getProjectRoot());
    if (sessions.length === 0) {
      print('没有已保存的会话', 'warn');
    } else {
      print(`\n会话列表 (共 ${sessions.length}):\n`, 'info');
      sessions.forEach((s) => {
        const date = s.modified.toLocaleString('zh-CN');
        print(`  [${s.id}] ${date}  (${s.messageCount} 条消息)`, 'info');
        if (s.firstMessage) {
          const first = s.firstMessage.length > 60 ? `${s.firstMessage.slice(0, 60)}...` : s.firstMessage;
          print(`    ${first}`, 'dim');
        }
      });
    }
    return;
  }

  // Discover available models (valid auth only)
  const models = await getAvailableModels(runtime);
  if (models.length === 0) {
    print('未检测到可用模型', 'error');
    print('', 'info');
    print('请先配置 pi 鉴权：', 'info');
    print('  pi auth login          # 登录某个 Provider', 'info');
    print('  或编辑 ~/.pi/agent/models.json 与 auth.json', 'info');
    return;
  }

  // Resolve session continuation
  const existingSessions = await SessionManager.list(getProjectRoot());
  let sessionOptions: SessionCreateOptions = {};
  let continuing = false;

  if (args.continue) {
    const id = args.continue;
    if (id) {
      const exact = existingSessions.find((s) => s.id === id);
      const matches = existingSessions.filter((s) => s.id.startsWith(id));
      if (exact) {
        sessionOptions = { sessionPath: exact.path };
        continuing = true;
        print(`继续会话 ${exact.id}`, 'success');
      } else if (matches.length === 1) {
        sessionOptions = { sessionPath: matches[0].path };
        continuing = true;
        print(`继续会话 ${matches[0].id}`, 'success');
      } else if (matches.length > 1) {
        print(`会话 id "${id}" 匹配到 ${matches.length} 个，请提供更完整的 id`, 'error');
        return;
      } else {
        print(`未找到会话 ${id}，将新建会话`, 'warn');
      }
    } else {
      sessionOptions = { continue: true };
      continuing = true;
      print('继续上次会话', 'success');
    }
  } else if (!args.new && existingSessions.length > 0) {
    // Default: ask whether to continue or start new
    print(`\n发现 ${existingSessions.length} 个历史会话`, 'info');
    print('  [1] 继续上次会话', 'info');
    print('  [2] 引导模式（新会话）', 'info');
    const choice = await prompt('请选择 [1/2]: ');
    if (choice === '1') {
      sessionOptions = { continue: true };
      continuing = true;
      print('继续上次会话', 'success');
    }
  }
  // else: new session (--new forced, or no history)

  // New sessions: wizard picks model + content. Continued sessions: restore from session.
  let config: Config;
  let wizardPrompt: string | null = null;
  if (continuing) {
    config = baseConfig();
  } else {
    const wizard = await runWizard(models);
    config = withModel(baseConfig(), wizard.provider, wizard.model);
    wizardPrompt = buildPromptFromWizard(wizard);
  }

  const session = await InteractiveSession.create(config, runtime, sessionOptions);

  // Graceful Ctrl+C: abort the agent and exit cleanly.
  let interrupted = false;
  process.on('SIGINT', () => {
    if (interrupted) process.exit(130);
    interrupted = true;
    print('\n⏹ 正在停止…（再按一次 Ctrl+C 强制退出）', 'warn');
    session
      .abort()
      .catch(() => {})
      .finally(() => {
        print('已退出', 'success');
        process.exit(130);
      });
  });

  // Send the wizard prompt (new sessions only)
  if (wizardPrompt) {
    print(`\n🎯 正在生成内容...\n`, 'thinking');
    print(`提示词：${wizardPrompt}\n`, 'dim');
    try {
      await session.prompt(wizardPrompt);
      process.stdout.write('\n');
    } catch (err) {
      print(`错误: ${errMsg(err)}`, 'error');
    }
  }

  print('\n--- pi-agent-edu 交互模式 ---', 'info');
  print('输入 help 查看可用命令，输入 q 退出\n', 'dim');

  let running = true;
  while (running) {
    const input = await prompt('> ');
    const raw = input.trim();
    if (!raw) continue;

    const lower = raw.toLowerCase();

    if (lower === 'q' || lower === 'quit' || lower === 'exit') {
      running = false;
      continue;
    }

    if (raw === '退出') {
      const text = session.getLastResponse();
      if (text) {
        const target = saveContent(text);
        print(`已保存生成内容到: ${target}`, 'success');
      }
      running = false;
      continue;
    }

    if (lower === 'help' || raw === '?') {
      showHelp();
      continue;
    }

    if (lower === 'save' || raw === '保存' || lower.startsWith('save ') || raw.startsWith('保存 ')) {
      const text = session.getLastResponse();
      if (!text) {
        print('还没有可保存的生成内容', 'warn');
        continue;
      }
      let pathArg: string | undefined;
      if (lower.startsWith('save ')) pathArg = raw.slice(5).trim();
      else if (raw.startsWith('保存 ')) pathArg = raw.slice(3).trim();
      const target = saveContent(text, pathArg || undefined);
      print(`已保存到: ${target}`, 'success');
      continue;
    }

    if (lower === 'btw' || lower.startsWith('btw ')) {
      const note = lower.startsWith('btw ') ? raw.slice(4).trim() : '';
      if (!note) {
        print('用法: btw <旁注文字>（只对下一轮生效）', 'warn');
      } else {
        session.sendNote(note);
        print(`已记录旁注（下一轮生效）: ${note}`, 'success');
      }
      continue;
    }

    if (lower === 'model' || lower === 'provider') {
      const available = await getAvailableModels(runtime);
      if (available.length === 0) {
        print('未检测到可用模型，请先配置 pi 鉴权', 'error');
        continue;
      }
      const selected = await selectOption(
        '请选择新的模型：',
        available,
        (m) => `${m.name} (${m.provider}/${m.model})${m.reasoning ? ' 🧠' : ''}`,
      );
      try {
        await session.setModel(selected.provider, selected.model);
        print(`已切换模型: ${selected.name}`, 'success');
      } catch (err) {
        print(`切换失败: ${errMsg(err)}`, 'error');
      }
      continue;
    }

    if (lower === 'thinking') {
      const level = session.cycleThinkingLevel();
      if (level) print(`思考级别: ${level}`, 'success');
      else print('当前模型不支持思考', 'warn');
      continue;
    }

    // Regular user message → send to agent
    print('', 'dim');
    try {
      await session.prompt(raw);
      process.stdout.write('\n');
    } catch (err) {
      print(`错误: ${errMsg(err)}`, 'error');
    }
  }

  const file = session.getSessionFile();
  if (file) print(`会话已保存到: ${file}`, 'dim');
  print('再见！', 'success');
}

// Only run main when executed directly (not imported for testing)
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => {
      // Flush streamed stdout before force-exiting (SDK keeps undici/telemetry handles alive).
      process.stdout.write('', () => process.exit(0));
    })
    .catch((err) => {
      print(`Fatal: ${errMsg(err)}`, 'error');
      process.exit(1);
    });
}
