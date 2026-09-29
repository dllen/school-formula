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

import { SessionManager } from '@earendil-works/pi-coding-agent';
import { print, prompt, selectOption } from './io.js';
import {
  createModelRuntime,
  getAvailableModels,
  baseConfig,
  withModel,
  getProjectRoot,
  type Config,
} from './config.js';
import { InteractiveSession, type SessionCreateOptions } from './session.js';
import { saveToStaging } from './staging.js';
import { parseCliArgs } from './cli/args.js';
import { errMsg, saveContent } from './cli/output.js';
import { showHelp } from './cli/help.js';
import { runWizard, buildPromptFromWizard } from './wizard/index.js';
import { kindFromTask, KNOWN_KINDS } from './wizard/mapping.js';

// Re-exports for external callers (tests in index.test.ts import these from './index.js').
export { buildPromptFromWizard } from './wizard/index.js';
export { kindFromTask } from './wizard/mapping.js';
export type { WizardResult } from './wizard/mapping.js';
export type { Task } from './wizard/data.js';

/** 当前会话对应的入库 kind（staging 目录名），仅新建会话时由 wizard 设置。 */
let currentKind: string | null = null;

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
    currentKind = kindFromTask(wizard.task);
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
        try {
          const target = saveToStaging(text, currentKind ?? undefined);
          print(`已保存生成内容到: ${target}`, 'success');
        } catch (err) {
          print(`无法保存：${errMsg(err)}（请确认最近一次回复是 JSON 信封）`, 'warn');
        }
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

      // 无参 → 当前 kind；白名单内纯字母数字/连字符 → 指定 kind；含 / 或 . → 旧行为写任意路径。
      const KIND_RE = /^[A-Za-z0-9-]+$/;
      let target: string;
      if (!pathArg) {
        try {
          target = saveToStaging(text, currentKind ?? undefined);
        } catch (err) {
          print(`无法保存：${errMsg(err)}（请确认最近一次回复是 JSON 信封）`, 'warn');
          continue;
        }
      } else if (KIND_RE.test(pathArg)) {
        if (!KNOWN_KINDS.has(pathArg)) {
          print(`未知 kind: ${pathArg}`, 'warn');
          continue;
        }
        try {
          target = saveToStaging(text, pathArg);
        } catch (err) {
          print(`无法保存：${errMsg(err)}（请确认最近一次回复是 JSON 信封）`, 'warn');
          continue;
        }
      } else {
        target = saveContent(text, pathArg);
      }
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
