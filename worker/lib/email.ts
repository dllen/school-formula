import type { Env } from '../types';

// 邮件发送：Cloudflare MailChannels（Cloudflare 官方免费方案）
// 文档：https://developers.cloudflare.com/email-security/email-workers/send-email-workers/
// 使用前提（配置一次即可，无第三方 SaaS）：
//  1. Cloudflare Dashboard → 域名 → DNS → 新增 TXT 记录：
//       名称 @    内容 v=spf1 include:_spf.mx.cloudflare.net ~all
//  2. Cloudflare Dashboard → Email → Email Workers → 启用并验证发件地址（发件域名验证）
//  3. MailChannels 自动附加 Route/Return-Path 等 DKIM 签名，收件方不再判垃圾邮件
// 收费：免费层 3000 封/月；超出后需绑定自有额度或切换其他服务。
// dev 兜底：未配置发件地址时把验证码打印到 wrangler dev 控制台，便于本地验收。
const MAIL_ENDPOINT = 'https://api.mailchannels.net/tx/v1/send';

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

  const from = env.FROM_EMAIL;

  // dev 兜底：未配置发件地址时打印验证码到控制台（本地 wrangler dev 验收用）
  if (!from) {
    console.log(`[dev-verification] to=${to} code=${code}`);
    return false;
  }

  try {
    const resp = await fetch(MAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from, name: '拾艺院' },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });
    return resp.ok;
  } catch {
    return false;
  }
}
