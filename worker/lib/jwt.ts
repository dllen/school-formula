import type { Env } from '../types';

function base64UrlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function importHMACSecret(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  );
}

export async function signJWT(subject: string, tier: string, env: Env, expiresIn: number = 900): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: subject, tier, iat: now, exp: now + expiresIn };
  const headerB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;
  const key = await importHMACSecret(env.JWT_SECRET);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));
  return `${signingInput}.${signatureB64}`;
}

export async function verifyJWT(token: string, env: Env): Promise<{ sub: string; tier: string } | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;
  const key = await importHMACSecret(env.JWT_SECRET);
  const signature = base64UrlDecode(signatureB64);
  const valid = await crypto.subtle.verify('HMAC', key, signature, new TextEncoder().encode(signingInput));
  if (!valid) return null;
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return { sub: payload.sub, tier: payload.tier };
}

export function generateRefreshToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}
