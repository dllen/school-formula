import { describe, it, expect, vi } from 'vitest';
import { fetchWithRetry } from './http.js';

function mockFetch(responses: Array<{ status: number } | Error>): typeof fetch {
  let i = 0;
  return vi.fn(async () => {
    const r = responses[i++];
    if (!r) throw new Error('no more mock responses');
    if (r instanceof Error) throw r;
    return new Response('body', { status: r.status });
  }) as unknown as typeof fetch;
}

describe('fetchWithRetry', () => {
  it('returns immediately on 2xx', async () => {
    const f = mockFetch([{ status: 200 }]);
    const res = await fetchWithRetry('http://x', { fetchImpl: f, maxRetries: 3 });
    expect(res.status).toBe(200);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 4xx', async () => {
    const f = mockFetch([{ status: 404 }]);
    await expect(fetchWithRetry('http://x', { fetchImpl: f, maxRetries: 3 })).rejects.toThrow(/404/);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('retries 5xx up to maxRetries+1 attempts', async () => {
    // Use maxRetries: 1 for speed (only 1s backoff instead of 7s)
    const f = mockFetch([{ status: 503 }, { status: 503 }]);
    await expect(fetchWithRetry('http://x', { fetchImpl: f, maxRetries: 1 })).rejects.toThrow();
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('succeeds on retry after 5xx', async () => {
    const f = mockFetch([{ status: 503 }, { status: 200 }]);
    const res = await fetchWithRetry('http://x', { fetchImpl: f, maxRetries: 3 });
    expect(res.status).toBe(200);
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('retries on network error', async () => {
    const f = mockFetch([new Error('ECONNRESET'), { status: 200 }]);
    const res = await fetchWithRetry('http://x', { fetchImpl: f, maxRetries: 3 });
    expect(res.status).toBe(200);
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('sends User-Agent header', async () => {
    const f = mockFetch([{ status: 200 }]);
    await fetchWithRetry('http://x', { fetchImpl: f, maxRetries: 0, userAgent: 'test/1.0' });
    const call = (f as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[1].headers['User-Agent']).toBe('test/1.0');
  });
});
