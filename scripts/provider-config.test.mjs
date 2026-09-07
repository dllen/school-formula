import { describe, test, expect } from 'vitest';
import { loadProviderConfig, createClient, PROVIDERS } from './provider-config.mjs';

describe('loadProviderConfig', () => {
  test('默认值: ollama', () => {
    const c = loadProviderConfig({});
    expect(c.provider).toBe('ollama');
    expect(c.baseUrl).toBe(PROVIDERS.ollama.baseUrl);
    expect(c.model).toBe('llama3');
  });

  test('CLI provider 通过 env 覆盖', () => {
    const c = loadProviderConfig({ GENERATE_PROVIDER: 'deepseek', GENERATE_API_KEY: 'sk-test', GENERATE_MODEL: 'deepseek-chat-v3' });
    expect(c.baseUrl).toBe('https://api.deepseek.com/v1');
    expect(c.apiKey).toBe('sk-test');
    expect(c.model).toBe('deepseek-chat-v3');
  });

  test('未知 provider 抛错', () => {
    expect(() => loadProviderConfig({ GENERATE_PROVIDER: 'invalid' })).toThrow(/unknown provider/);
  });

  test('非 ollama 无 key 抛错', () => {
    const config = loadProviderConfig({ GENERATE_PROVIDER: 'openai' });
    expect(config.apiKey).toBe('');
    expect(() => createClient(config)).toThrow(/apiKey required/);
  });

  test('所有 provider 都有合法 baseUrl 和 model', () => {
    for (const [name, p] of Object.entries(PROVIDERS)) {
      expect(p.baseUrl.startsWith('http')).toBe(true);
      expect(p.defaultModel.length).toBeGreaterThan(0);
    }
  });
});
