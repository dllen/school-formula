import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface SessionMeta {
  id: string;
  createdAt: string;
  summary: string;
}

function getSessionsDir(): string {
  return join(homedir(), '.pi-edu', 'sessions');
}

function getSessionsIndexPath(): string {
  return join(getSessionsDir(), 'sessions.json');
}

export function ensureSessionsDir(): void {
  mkdirSync(getSessionsDir(), { recursive: true });
}

export function listSessions(): SessionMeta[] {
  const indexPath = getSessionsIndexPath();
  if (!existsSync(indexPath)) return [];
  try {
    const content = readFileSync(indexPath, 'utf-8');
    const sessions = JSON.parse(content) as SessionMeta[];
    return sessions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function saveSession(id: string, summary: string): void {
  ensureSessionsDir();
  const indexPath = getSessionsIndexPath();
  const sessions = listSessions();
  const existing = sessions.findIndex((s) => s.id === id);
  const meta: SessionMeta = { id, createdAt: new Date().toISOString(), summary };

  if (existing >= 0) {
    sessions[existing] = meta;
  } else {
    sessions.unshift(meta);
  }

  writeFileSync(indexPath, JSON.stringify(sessions, null, 2), 'utf-8');
}

export function getSessionPath(id: string): string {
  return join(getSessionsDir(), `${id}.json`);
}

export function saveSessionMessages(id: string, messages: unknown[]): void {
  ensureSessionsDir();
  const path = getSessionPath(id);
  writeFileSync(path, JSON.stringify(messages, null, 2), 'utf-8');
}

export function loadSessionMessages(id: string): unknown[] | null {
  const path = getSessionPath(id);
  if (!existsSync(path)) return null;
  try {
    const content = readFileSync(path, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function newSessionId(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}
