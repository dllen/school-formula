import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { print } from './io.js';

export interface Config {
  piPath: string;
  projectRoot: string;
  autoApproveTools: string[];
  sessionsDir: string;
}

const DEFAULT_CONFIG: Omit<Config, 'piPath'> = {
  projectRoot: '/Users/shichaopeng/Work/self-dir/projects/school-formula',
  autoApproveTools: ['read', 'grep', 'find', 'ls'],
  sessionsDir: '~/.pi-edu/sessions/',
};

function findPiBinary(): string | null {
  // Try PATH first
  try {
    const result = execSync('which pi', { encoding: 'utf-8', timeout: 5000 }).trim();
    if (result && existsSync(result)) return result;
  } catch {
    // not found in PATH
  }

  // Try common locations
  const candidates = [
    join(homedir(), '.local', 'bin', 'pi'),
    '/usr/local/bin/pi',
    '/opt/homebrew/bin/pi',
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

function getConfigPath(): string {
  return join(homedir(), '.pi-edu', 'config.json');
}

export async function loadConfig(): Promise<Config> {
  const piPath = findPiBinary();

  if (!piPath) {
    print('pi agent 未安装或不在 PATH 中', 'error');
    print('', 'info');
    print('请先安装 pi agent:', 'info');
    print('  npm install -g @pi-kit/pi', 'info');
    print('  或访问 https://pi.dev 获取安装说明', 'info');
    process.exit(1);
  }

  print(`使用 pi: ${piPath}`, 'success');

  return {
    ...DEFAULT_CONFIG,
    piPath,
  };
}
