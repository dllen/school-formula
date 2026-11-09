import type { Env } from '../types';

/**
 * 邮件发送。
 *
 * 历史实现调用 MailChannels 的免费接口（api.mailchannels.net），该服务已于
 * **2024-06-30 停止**，现在返回 401 —— 表现为「点了发送验证码但永远收不到」。
 *
 * 现在按优先级选择通道：
 *   1. `env.EMAIL`：Cloudflare Email Service 的 send_email 绑定（推荐，见 docs/email.md）
 *   2. `env.RESEND_API_KEY`：Resend HTTP API（免费 3k/月、100/天）
 *   3. 都没有：把验证码打印到 Worker 日志（本地验收用），并返回失败原因
 */

export interface EmailResult {
  ok: boolean;
  reason?: string;
}

export function generateVerificationCode(): string {
  const num = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return num.toString().padStart(6, '0');
}

function render(code: string): { subject: string; html: string; text: string } {
  return {
    subject: '拾艺院 邮箱验证',
    text: `您的验证码是 ${code}，10 分钟内有效。如非本人操作，请忽略此邮件。`,
    html: `<div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
    <h2>拾艺院 邮箱验证</h2>
    <p>您的验证码是：</p>
    <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${code}</span>
    </div>
    <p style="color: #888;">该验证码 10 分钟内有效。如非本人操作，请忽略此邮件。</p>
  </div>`,
  };
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function sendVerificationEmail(
  to: string,
  code: string,
  env: Env,
): Promise<EmailResult> {
  const from = env.FROM_EMAIL;

  // dev 兜底：没有发件地址时把验证码打到控制台（本地 wrangler dev 验收用）
  if (!from) {
    console.log(`[dev-verification] to=${to} code=${code}`);
    return { ok: false, reason: 'FROM_EMAIL 未配置' };
  }

  const { subject, html, text } = render(code);

  // 1) Cloudflare Email Service binding
  if (env.EMAIL) {
    try {
      await env.EMAIL.send({ to, from, subject, html, text });
      return { ok: true };
    } catch (err) {
      console.error('[email] Cloudflare Email Service 发送失败:', errorText(err));
      return { ok: false, reason: `cloudflare: ${errorText(err)}` };
    }
  }

  // 2) Resend
  const key = (env.RESEND_API_KEY ?? '').trim();
  if (key) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ from, to: [to], subject, html, text }),
      });
      if (!resp.ok) {
        const body = await resp.text().catch(() => '');
        console.error('[email] Resend 发送失败:', resp.status, body.slice(0, 300));
        return { ok: false, reason: `resend ${resp.status}` };
      }
      return { ok: true };
    } catch (err) {
      console.error('[email] Resend 请求异常:', errorText(err));
      return { ok: false, reason: `resend: ${errorText(err)}` };
    }
  }

  console.error('[email] 没有可用的邮件通道（EMAIL binding / RESEND_API_KEY 均未配置）');
  return { ok: false, reason: 'no provider' };
}
