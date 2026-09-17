import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { print, prompt } from './io.js';

export interface Config {
  apiKey: string;
  model: string;
  autoApproveTools: string[];
  sessionsDir: string;
}

const DEFAULT_CONFIG: Omit<Config, 'apiKey'> = {
  model: 'pi-agent',
  autoApproveTools: ['read', 'grep', 'find'],
  sessionsDir: '~/.pi-edu/sessions/',
};

function getConfigPath(): string {
  return join(homedir(), '.pi-edu', 'config.json');
}

export async function loadConfig(): Promise<Config> {
  const configPath = getConfigPath();
  const configDir = join(homedir(), '.pi-edu');

  // 尝试加载现有配置
  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      const config = JSON.parse(content) as Config;
      if (config.apiKey) return config;
    } catch {
      // 读取失败，引导创建
    }
  }

  // 引导用户创建配置
  print('首次使用，需要配置 pi API Key', 'warn');
  print('请访问 https://pi.dev 获取 API Key', 'info');

  const apiKey = await prompt('请输入 PI_API_KEY: ');
  if (!apiKey.trim()) {
    print('API Key 不能为空', 'error');
    process.exit(1);
  }

  const model = await prompt(`模型名称 (默认: ${DEFAULT_CONFIG.model}): `);

  const config: Config = {
    ...DEFAULT_CONFIG,
    apiKey: apiKey.trim(),
    model: model.trim() || DEFAULT_CONFIG.model,
  };

  mkdirSync(configDir, { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  print('配置已保存到 ' + configPath, 'success');

  return config;
}
