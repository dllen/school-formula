const DEFAULT_USER_AGENT = 'extract-data/0.1 (+school-formula)';
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 60_000;

export interface FetchOptions {
  /** 重试次数（不含首次），默认 3。 */
  maxRetries?: number;
  /** 单次超时 ms，默认 60000。 */
  timeoutMs?: number;
  /** 自定义 User-Agent。 */
  userAgent?: string;
  /** 测试用：注入 fetch。 */
  fetchImpl?: typeof fetch;
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/** 判定是否值得重试：5xx 或网络错误（fetch reject）。 */
function shouldRetry(status: number | null, err: unknown): boolean {
  if (err) return true;
  if (status === null) return true;
  if (status >= 500 && status < 600) return true;
  return false;
}

/** 带重试的 fetch。4xx 不重试；5xx 与网络错误指数退避 1s/2s/4s。 */
export async function fetchWithRetry(url: string, opts: FetchOptions = {}): Promise<Response> {
  const maxRetries = opts.maxRetries ?? DEFAULT_MAX_RETRIES;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const userAgent = opts.userAgent ?? DEFAULT_USER_AGENT;
  const fetchImpl = opts.fetchImpl ?? fetch;

  let lastErr: unknown;
  let lastStatus: number | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const backoffMs = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
      await sleep(backoffMs);
    }
    try {
      const res = await fetchImpl(url, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: { 'User-Agent': userAgent },
      });
      lastStatus = res.status;
      if (!shouldRetry(res.status, null)) return res;
      lastErr = undefined;
    } catch (err) {
      lastErr = err;
      lastStatus = null;
    }
  }
  if (lastErr) throw lastErr;
  throw new Error(`fetch ${url} failed after ${maxRetries + 1} attempts (last status ${lastStatus})`);
}

/** 串行限速：在调用之间 sleep。 */
export async function rateLimit(intervalMs: number): Promise<void> {
  await sleep(intervalMs);
}
