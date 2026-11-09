# 邮件发送（验证码 / 密码重置）

- **Status:** 生产使用 **Resend**；`syy.global` 已验证，`RESEND_API_KEY` 已配置为 Worker secret
- **相关代码:** `worker/lib/email.ts`、`worker/routes/auth.ts`（forgot / reset）
- **排错入口:** `npx wrangler tail`，关键字 `[email]`

## 当前配置

| 项 | 值 |
|---|---|
| 发件人（`FROM_EMAIL`） | `noreply@syy.global` |
| 通道优先级 | `EMAIL` 绑定 → `RESEND_API_KEY` → 日志兜底 |
| 生产实际走的通道 | Resend（未配置 `send_email` 绑定） |
| 域名验证 | Resend / Domains 里 `syy.global` 为 Verified |

> **已知问题**：`JWT_SECRET` 仍未配置。它不影响发信（`forgot` 不签 JWT），但会让登录、注册、`/api/user/me` 返回 500。
> 补法：`openssl rand -base64 48 | npx wrangler secret put JWT_SECRET`。

## 为什么以前收不到验证码

历史实现调用 MailChannels 的免费接口 `https://api.mailchannels.net/tx/v1/send`。
该服务已于 **2024-06-30 停止**（[官方公告](https://blog.mailchannels.com/important-update-mailchannels-email-sending-api-for-cloudflare-workers-to-be-terminated/)），现在直接返回 **401**。

而 `forgot` 处理器原先忽略发送结果、永远返回「验证码已发送」，所以表现为：

- 前端提示成功
- D1 里确实生成了验证码
- 用户永远收不到邮件
- Worker 日志里没有任何线索

现在 `sendVerificationEmail` 返回 `{ ok, reason }`，失败会写 `console.error`，用 `npx wrangler tail` 能看到原因。

## 通道一：Resend（当前使用）

### 1. 验证域名

[resend.com/domains](https://resend.com/domains) → **Add Domain** → `syy.global` → 按页面给出的记录在 Cloudflare DNS 添加：

| 类型 | 名称 | 用途 |
|---|---|---|
| MX | `send` | 接收退信（优先级 10） |
| TXT | `send` | SPF |
| TXT | `resend._domainkey` | DKIM |

要点：

- Cloudflare 里 **Name 只填前缀**（`send`），不要写全域名
- 记录类型是 MX/TXT，没有代理开关；如果以后出现 CNAME，必须选 **DNS only**
- 不要动 apex 上给 Email Routing 用的 SPF
- 加完回 Resend 点 **Verify**，通常 5–15 分钟

自查：

```bash
dig +short MX  send.syy.global @1.1.1.1
dig +short TXT send.syy.global @1.1.1.1
dig +short TXT resend._domainkey.syy.global @1.1.1.1
```

### 2. 写入 secret

```bash
npx wrangler secret put RESEND_API_KEY
```

控制台同理：Workers & Pages → `school-formula-api` → Settings → Variables and Secrets → Add → 类型 **Secret**。

### 3. 验证通道

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"from":"noreply@syy.global","to":"delivered@resend.dev","subject":"probe","text":"probe"}'
```

- `200`：通道正常
- `403` + `domain is not verified`：域名还没验证
- `401` + `restricted_api_key`：这把 key 只能发信，不能用 `/domains` 查询，属于正常现象

免费额度：3,000 封/月、100 封/天。

## 通道二：Cloudflare Email Service（备选）

域名已在 Cloudflare 上，不想用第三方时可选。

1. 控制台 → **Compute** → **Email Service** → **Email Sending** → **Onboard Domain**，选 `syy.global`
   （自动加 SPF / DKIM / DMARC，5–15 分钟生效）
2. 取消 `wrangler.toml` 里这两行的注释：

   ```toml
   [[send_email]]
   name = "EMAIL"
   ```

3. `npx wrangler deploy`
4. 代码会自动优先使用 `env.EMAIL`，Resend 退为兜底

限制：新账号每日额度较小，随发送质量提升；域名未 onboard 前只能发给账号内已验证的目标地址。

## 排错

| 现象 | 原因 | 处理 |
|---|---|---|
| 日志 `[email] Resend 发送失败: 403` | 域名未验证，或 `from` 不在已验证域名下 | 回 Resend 验证域名 / 检查 `FROM_EMAIL` |
| 日志 `[email] Cloudflare Email Service 发送失败` | 未 onboard 域名或绑定未生效 | 完成 onboard 后重新部署 |
| 日志 `[email] 没有可用的邮件通道` | 两个通道都没配 | 配 `RESEND_API_KEY` 或 `EMAIL` 绑定 |
| 接口 200 但收不到 | 进了垃圾箱、收件人不存在或被 Resend 抑制 | 查 Resend 后台的 Emails 与 Suppressions |
| `forgot` 返回 429 | 限流：5 次/小时（IP+邮箱） | 等窗口过期或换网络 |

## 应急取码（不依赖邮件）

验证码始终会写进 D1。控制台 → **Storage & Databases** → **D1** → `school-formula-db` → **Console**：

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
- 发送失败时前端仍提示成功（防邮箱枚举）；可在 `ENVIRONMENT !== 'production'` 时返回具体错误，方便自测。
- `RESEND_API_KEY` 已在对话与日志中出现过，建议在 Resend 轮换一次后重新 `wrangler secret put`。
