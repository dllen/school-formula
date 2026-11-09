# 邮件发送（验证码 / 密码重置）

- **Status:** 发送层已改造；生产尚未配置通道，验证码目前不会真正发出
- **相关代码:** `worker/lib/email.ts`、`worker/routes/auth.ts`（forgot / reset）

## 为什么收不到验证码

历史实现调用 MailChannels 的免费接口 `https://api.mailchannels.net/tx/v1/send`。
该服务已于 **2024-06-30 停止**（[官方公告](https://blog.mailchannels.com/important-update-mailchannels-email-sending-api-for-cloudflare-workers-to-be-terminated/)），现在直接返回 **401**。

而 `forgot` 处理器原先忽略发送结果、永远返回「验证码已发送」，所以表现为：

- 前端提示成功
- D1 里确实生成了验证码
- 用户永远收不到邮件
- Worker 日志里没有任何线索

现在 `sendVerificationEmail` 返回 `{ ok, reason }`，失败会写 `console.error`，用 `npx wrangler tail` 能看到原因。

## 方案一：Cloudflare Email Service（推荐）

域名已在 Cloudflare 上，不需要第三方。

1. 控制台 → **Compute** → **Email Service** → **Email Sending** → **Onboard Domain**，选 `syy.global`。
   Cloudflare 会自动加 SPF / DKIM / DMARC 记录（生效通常 5–15 分钟）。
2. 取消 `wrangler.toml` 里这两行的注释：

   ```toml
   [[send_email]]
   name = "EMAIL"
   ```

3. 部署：`npx wrangler deploy`。
4. 验证：注册页/忘记密码各点一次，然后 `npx wrangler tail` 看有没有 `[email] ... 发送失败`。

限制：新账号每日发送额度较小，会随发送质量逐步提升；域名未 onboard 前只能发给账号内已验证的目标地址。

## 方案二：Resend

1. 注册 [resend.com](https://resend.com)，添加并验证 `syy.global`（加 DKIM/SPF 记录，Cloudflare DNS 里点几下）。
2. 创建 API key，写入 secret：

   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```

3. 部署即可，代码会自动走 Resend（不需要改 `wrangler.toml`）。

免费额度：3,000 封/月、100 封/天。

## 快速取回当前验证码（应急）

邮件恢复前，验证码仍然会写进 D1。控制台 → **Storage & Databases** → **D1** → `school-formula-db` → **Console**：

```sql
SELECT email, code, expires_at, created_at
FROM email_verifications
WHERE purpose = 'reset_password'
ORDER BY created_at DESC
LIMIT 5;
```

取最新一条的 `code`，10 分钟内有效。

## 后续可以改进

- 验证码目前明文存库：改成存 SHA-256 哈希，校验时哈希比对。
- `email_verifications` 没有清理任务：加一个 Cron Trigger 删除过期行。
- 发送失败时前端仍提示成功（防邮箱枚举），但可以在响应里带一个不影响安全的提示位，或只在 `ENVIRONMENT !== 'production'` 时返回错误。
