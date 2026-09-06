import type { Env } from '../types';

export function generateVerificationCode(): string {
  const num = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return num.toString().padStart(6, '0');
}

export async function sendVerificationEmail(to: string, code: string, env: Env): Promise<boolean> {
  const subject = '拾艺院 邮箱验证';
  const html = `<div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
    <h2>拾艺院 邮箱验证</h2>
    <p>您的验证码是：</p>
    <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${code}</span>
    </div>
    <p style="color: #888;">该验证码 10 分钟内有效。如非本人操作，请忽略此邮件。</p>
  </div>`;

  try {
    const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: env.SENDGRID_FROM_EMAIL, name: '拾艺院' },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });
    return resp.ok;
  } catch { return false; }
}
