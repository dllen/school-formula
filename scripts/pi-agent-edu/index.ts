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
import { print, prompt, confirm } from './io.js';
import { loadConfig } from './config.js';
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
  } else if (!args.new) {
    // Default: try to resume most recent session
    const sessions = listSessions();
    if (sessions.length > 0) {
      const useLast = await confirm(`发现上一个会话 [${sessions[0].id}]，是否继续？`);
      if (useLast) {
        sessionId = sessions[0].id;
        messages = loadSessionMessages(sessionId) ?? [];
      } else {
        sessionId = newSessionId();
        messages = [];
        print(`创建新会话 ${sessionId}`, 'info');
      }
    } else {
      sessionId = newSessionId();
      print(`创建新会话 ${sessionId}`, 'info');
    }
  } else {
    sessionId = newSessionId();
    messages = [];
    print(`创建新会话 ${sessionId}`, 'info');
  }

  // Create session instance (real session stores messages internally)
  const session = new InteractiveSession(config, sessionId);

  // -------------------------------------------------------------------------
  // Interactive loop
  // -------------------------------------------------------------------------

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

main().catch((err) => {
  print(`Fatal: ${err instanceof Error ? err.message : String(err)}`, 'error');
  process.exit(1);
});
