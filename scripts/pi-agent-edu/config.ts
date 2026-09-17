import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { print } from './io.js';

export interface Config {
  piPath: string;
  provider: string;
  model?: string;
  projectRoot: string;
  autoApproveTools: string[];
  sessionsDir: string;
}

const DEFAULT_CONFIG: Omit<Config, 'piPath' | 'provider'> = {
  projectRoot: '/Users/shichaopeng/Work/self-dir/projects/school-formula',
  autoApproveTools: ['read', 'grep', 'find', 'ls'],
  sessionsDir: '~/.pi-edu/sessions/',
};

function findPiBinary(): string | null {
  try {
    const result = execSync('which pi', { encoding: 'utf-8', timeout: 5000 }).trim();
    if (result && existsSync(result)) return result;
  } catch {
    // not found
  }

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

function getAvailableProviders(): { id: string; name: string }[] {
  try {
    const modelsPath = join(homedir(), '.pi', 'agent', 'models.json');
    if (!existsSync(modelsPath)) return [];

    const content = readFileSync(modelsPath, 'utf-8');
    const data = JSON.parse(content);
    const providers = data.providers as Record<string, { name?: string; models?: unknown[] }>;

    return Object.entries(providers)
      .filter(([, p]) => p.models && (p.models as unknown[]).length > 0)
      .map(([id, p]) => ({
        id,
        name: p.name || id,
      }));
  } catch {
    return [];
  }
}

export { getAvailableProviders };

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

  // Provider is set by wizard or defaults to 'openai'
  return {
    ...DEFAULT_CONFIG,
    piPath,
    provider: 'openai',
  };
}
