import { join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { ModelRuntime } from '@earendil-works/pi-coding-agent';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A selectable model with valid auth, resolved via ModelRuntime.getAvailable(). */
export interface ModelChoice {
  provider: string;
  model: string;
  name: string;
  /** Whether the model supports thinking/reasoning. */
  reasoning: boolean;
  contextWindow: number;
  maxTokens: number;
}

export type ThinkingLevel = 'off' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export const THINKING_LEVELS: readonly ThinkingLevel[] = [
  'off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max',
] as const;

export interface Config {
  /** Working directory for the agent (repo root, where read/bash/edit operate). */
  projectRoot: string;
  provider: string;
  model: string;
  thinkingLevel: ThinkingLevel;
  /** Built-in tool names enabled for the agent. */
  tools: string[];
}

const DEFAULT_TOOLS = ['read', 'grep', 'find', 'ls', 'bash', 'edit', 'write'];

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

/** Repo root: this file lives at <root>/scripts/pi-agent-edu/config.ts. */
export function getProjectRoot(): string {
  return fileURLToPath(new URL('../..', import.meta.url));
}

/** pi agent config dir (~/.pi/agent), source of auth.json + models.json. */
export function getAgentDir(): string {
  return join(homedir(), '.pi', 'agent');
}

// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------

/**
 * Create a ModelRuntime backed by the local pi agent config (~/.pi/agent).
 * No network model refresh: reads auth.json + models.json from disk.
 */
export function createModelRuntime(): Promise<ModelRuntime> {
  const agentDir = getAgentDir();
  return ModelRuntime.create({
    authPath: join(agentDir, 'auth.json'),
    modelsPath: join(agentDir, 'models.json'),
  });
}

/** Models that currently have valid auth configured, ready for selection. */
export async function getAvailableModels(runtime: ModelRuntime): Promise<ModelChoice[]> {
  const models = await runtime.getAvailable();
  return models.map((m) => ({
    provider: m.provider,
    model: m.id,
    name: m.name,
    reasoning: m.reasoning,
    contextWindow: m.contextWindow,
    maxTokens: m.maxTokens,
  }));
}

/** Resolve a model object by provider + model id, throwing if not found/auth'd. */
export function resolveModel(
  runtime: ModelRuntime,
  provider: string,
  model: string,
) {
  const resolved = runtime.getModel(provider, model);
  if (!resolved) {
    throw new Error(`模型不存在或未配置鉴权: ${provider}/${model}`);
  }
  return resolved;
}

export function baseConfig(): Config {
  return {
    projectRoot: getProjectRoot(),
    provider: '',
    model: '',
    thinkingLevel: 'medium',
    tools: [...DEFAULT_TOOLS],
  };
}

/** Attach an explicit provider/model to a config (for new sessions). */
export function withModel(config: Config, provider: string, model: string): Config {
  return { ...config, provider, model };
}
