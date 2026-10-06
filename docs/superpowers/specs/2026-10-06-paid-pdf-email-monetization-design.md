# 出海变现扩张设计：付费 PDF 订阅 + Email drip（流量门控触发版）

日期：2026-10-06
状态：已确认（修订：从 all-in 改为 **Milestone Gate** 触发版）
上游：[2026-10-02 英文打印图表面扩充设计](./2026-10-02-english-seo-ads-design.md)（在其阶段 D/E 之上叠加变现层）
备选：[d098fae（被本版本取代的 all-in 方案）](https://github.com/dllen/school-formula/commit/d098fae)

## 背景

10-02 spec 锚定了「英文打印图表面 + AdSense」的窄面路线，目前阶段 A/B/C 已合并、阶段 D（合规四页 + AdSlot 修占位）即将进入、E（6→40→100 页）排期未定。AdSense 是被动流量变现，**单一变现路径**使 100 页英文图表 + 50k+ 流量的天花板被压到「流量 × $2-5 RPM ≈ $100-250/月」区间。

本次改造在 10-02 阶段 D/E 之上**叠加变现层**，把单一广告收入扩展为「广告 + 付费 PDF + 订阅 + 邮件列表」的混合引擎。

### 为什么改成「流量门控触发」（从 all-in 退一步）

原 spec（d098fae）设想 F1-F5 一次性推完（3-4 个月）。本次修订改为 **Milestone Gate 触发**：在 SEO 流量未到临界点之前**不动支付/Email/Drip 任何基础设施**，只把工程精力集中在内容产能（10-02 阶段 E）与 SEO（10-02 阶段 D）。

理由：

- **付费产品需要流量才有转化率**：月 PV < 10k 时，PDF Pack 月销可能 < 5 份，养不起支付/客服成本
- **避免过早沉没成本**：Stripe + Resend + Puppeteer 是 2-3 个月工作量；如果 SEO 模型本身有问题（半年流量未过 10k），这些投入归零
- **保留所有技术决策**：本 spec Sections 1-9 的设计**仍然是「触发后该怎么做」的标准答案**——只是不立即动手
- **门控是单行道**：每个 Gate 通过才启动下一阶段；任一 Gate 未通过即暂停，回到「纯 AdSense + 内容」状态

## 现状盘点

**已完成（10-02 阶段 A+B+C 产物）**
- `/en/` 6 张可打印图表分节式渲染（Block[] 渲染组件、数据模块原子替换、学科 hub 分层）
- SSG 预渲染管线 + 301 重定向 + GA4 接入
- og:image 构建期 satori + resvg-wasm（英文 10 页）
- 现有 Cloudflare Workers 后端：`auth/user/ai` 三组路由、JWT、密码哈希、邮件发送工具

**基础设施现状**
- **Stripe 完全未接入**（`grep -r 'stripe\|Stripe' src/ worker/` 零结果）
- **现有 D1 schema** 已有 `users.tier` 字段（`'free' | 'plus' | 'pro'`）+ `subscriptions` 表骨架，但 `payment_provider` / `payment_id` 列均为 `TEXT` 空值，无真实订阅
- **`subscriptions` 表无 Stripe 字段**（无 `stripe_customer_id` / `stripe_subscription_id` / `current_period_end`）
- **Resend / 任何邮件营销服务** 未集成

**前置条件缺口**
- 当前没有任何付费产品形态（plus/pro 是预留字段）
- 没有 Email 收集点
- 没有 PDF 资产（前端页面 ≠ PDF 文件）
- 没有 Stripe API key / Webhook secret

## 已确认的决策

| 决策点 | 结论 |
|---|---|
| 变现产品形态 | **混合**：$29 一次性买断全部图表 PDF + $9.99/月订阅拿持续新增内容（每月练习题、教师备注、新图表 30 天独占） |
| 账户体系 | **复用现有 users 表 + tier 字段**，不做独立英文账户；按地区做合规切分（中/英/欧） |
| 支付服务 | **Stripe Checkout**（hosted）+ Webhook；不上 Paddle / LemonSqueezy |
| PDF 生成 | **构建期 pre-build**（Puppeteer + headless Chrome 渲染 → dist/pdfs/*.pdf）；不用 client print、不用 runtime |
| Email 服务 | **Resend** + 自写 drip cron（前期）；量起来后迁 Loops |
| Email 收集形态 | **Inline 表单**（每张图表页底部 + hub 页），**不弹窗**（教育类弹窗跳出率 >85%） |
| 数据存储 | **D1**（Cloudflare 原生、与现有 auth/user 共表）；新增 `email_subscribers`、`payments`、`pdf_downloads` 三表 |
| 启动策略 | **流量门控触发**（Plan A）：先证明 SEO 模型，月 PV ≥ 10k 才启动支付侧 |
| Gate 0（现在） | 仅做 10-02 阶段 D（合规四页）+ E（6→100 页内容）；AdSense 持续优化 |
| Gate 1 触发（月 PV ≥ 10k 持续 3 个月） | 启动 F1（Stripe + D1 migration）+ F2（PDF Pack 一次性买断）；**跳过订阅与 Drip** |
| Gate 2 触发（PDF Pack 月销 ≥ 30 份 持续 2 个月） | 启动 F3（月度/年订阅） |
| Gate 3 触发（订阅月活 ≥ 100 人 持续 2 个月） | 启动 F4（完整 Drip + Resend 全套） |
| Gate 4（持续） | F5 内容增量（每月新图表 + 练习题 + 教师备注） |
| 合规 | GDPR / CAN-SPAM / Stripe Tax；`/pricing` `/checkout` 加 `noindex`；隐私政策增补「营销邮件 + 付费订阅」条款 |
| 联系邮箱 | `support@syy.global`（沿用 10-02 决策） |
| Gate 监测 | GA4 月度 review；任一 Gate 未通过即暂停，回到 Gate 0 + 内容扩容 |

## Section 1：产品形态与定价

### 双轨定价模型

| 产品 | 价格 | 包含 | 目标用户 |
|---|---|---|---|
| **PDF Pack（一次性买断）** | $29 | 全部当前图表的高清 PDF（带封面、目录、术语表、品牌页、无水印） | 家长、个体教师、想要永久参考 |
| **Pro Subscription（月度订阅）** | $9.99/月 或 $99/年（省 17%） | 上述全部 + 每月新增内容（练习题、教师备注、新图表 30 天独占） | 教师、内容重度用户、长期用户 |

### 双轨的协同

- **PDF Pack 是「软落地页」**：drip 序列第 7 天的预告邮件可写「你想要的图表都在这个包里」
- **订阅是 LTV 引擎**：月度新增内容是续订的真实钩子
- **价格对照驱动订阅**：当 PDF Pack 涨到 50+ 张（≥$50 等值），$9.99/月「持续拿新内容」反而更划算，订阅转化率自然提升

### 价格调整策略

- 启动期 $29 / $9.99：用户基数小，价格敏感度低
- 100 页达成后：PDF Pack 不变（已购者保护），订阅价试涨到 $12.99/月
- 不做 Black Friday 等促销（教育类用户对促销不敏感，避免训练坏习惯）

### Tier 字段映射

沿用现有 `users.tier` 枚举，扩展为：

| tier | 含义 | 触发 |
|---|---|---|
| `free` | 未付费 | 默认 |
| `pack` | 一次性买断 PDF Pack | Stripe `checkout.session.completed` → payment.kind = 'pdf_pack' |
| `plus` | 月度订阅活跃 | Stripe `subscription.created` / `subscription.updated` → status = 'active' |
| `pro` | 年度订阅活跃 | 同上，price_id 命中年度 SKU |

## Section 2：PDF 内容策略

### 三层结构

```
┌──────────────────────────────────────────────────────────────────┐
│ Layer 1: PDF Pack 内容（一次性 $29 全部包含）                      │
│   = 现有网页的高清 PDF 化，零创作成本                                │
│   = 封面 / 目录 / 术语表 / 品牌页 + 每张图表独立 PDF                 │
└──────────────────────────────────────────────────────────────────┘
                          ▲
                          │ 共享基础包（PDF Pack 持有者免费获得）
                          │
┌──────────────────────────────────────────────────────────────────┐
│ Layer 2: Pro 订阅独享内容（$9.99/月 仅订阅可访问）                   │
│   = 每月 1-2 张新图表（web 公开后 30 天独占）                        │
│   = 每月 1 套练习题 PDF（PDF only，付费钩子）                       │
│   = 教师备注 PDF（教学建议、配套活动）                               │
└──────────────────────────────────────────────────────────────────┘
                          ▲
                          │ PDF only 内容（订阅核心续订钩子）
                          │
┌──────────────────────────────────────────────────────────────────┐
│ Layer 3: Web-to-PDF 不重复造内容（设计原则）                       │
│   = PDF 包内容是网页内容的「精美打包版」，不是新创作                  │
│   = 新创作全部在订阅侧（Layer 2）                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 30 天独占窗口（防倒灌）

- 新图表先在 `plus` tier 后台可见 30 天，再公开到 web
- 避免付费用户「我订阅了但网页上也有」的相对剥夺感
- 30 天后该图表自动归入 PDF Pack（持包者重新下载更新版 PDF）

### 水印策略

- 未登录/未付费预览版：图表 PDF **前 3 页** 高清无水印（让用户感受质量），第 4 页起加斜线水印 + 品牌 logo
- 付费版：全部高清无水印
- 水印在构建时**预烧**到 PDF（不能用脚本绕过；不能用 OCR 抹掉重排——因为是矢量）

## Section 3：账户体系与地区切分

### 复用现有 users 表

- 不新建独立英文账户，复用现有 `users` + `sessions` + JWT 体系
- 现有 `tier` 字段 `'free' | 'plus' | 'pro'` 扩展为 `'free' | 'pack' | 'plus' | 'pro'`（见 Section 1 映射表）
- 现有 `subscriptions` 表新增 Stripe 字段（见 Section 7）

### 地区切分（合规）

按用户 IP / 账单地址分三个区域，分别走不同的营销话术与税务策略：

| 区域 | 营销话术 | 税务 | 价格 |
|---|---|---|---|
| `cn` | 中文；强调 plus/pro 已有的"助教免广告"卖点 | 不上 Stripe Tax（境内合规走微信/支付宝，本期不实现） | 显示 ¥199 / ¥79（待与 plus/pro 对齐） |
| `intl` | 英文；本设计主战场 | Stripe Tax 自动计算 | $29 / $9.99 |
| `eu` | 英文；额外弹 GDPR 同意 | Stripe Tax + 反向计费（B2C 模式需收增值税） | $29 / $9.99（含税） |

**本期只实现 `intl` + `eu` 两个区域**；`cn` 沿用现有 plus/pro 流程不动。地区识别由前端请求 `Cloudflare-IPCountry` header，Worker 在 `/api/checkout/create-session` 时根据地区选 Stripe 账户与价格 ID。

## Section 4：支付链路（Stripe Checkout + Webhook）

### 流程图

```
[用户点 CTA]                    [前端]
   │                              │
   │  1. POST /api/checkout/create-session
   │     { price_kind: 'pdf_pack' | 'subscription_monthly' | 'subscription_yearly' }
   ▼                              ▼
[Worker] ───────────────────────► 创建 Stripe Checkout Session
   │                              │
   │  2. session.url = checkout.stripe.com/...
   │                              │
   ◄──────────────────────────────┘
   │                              │
   │  3. window.location = session.url
   │                              │
   │  [用户在 Stripe 页面完成支付]
   │                              │
   │  4. Stripe webhook → POST /api/webhooks/stripe
   ▼                              │
[Worker]                          │
   │                              │
   │  5. 验签 + 解析事件类型          │
   │     checkout.session.completed → 更新 payment + 触发一次性买断逻辑
   │     customer.subscription.created/updated/deleted → 更新 subscription 状态
   │     invoice.payment_succeeded/failed → 触发续费成功/失败邮件
   │                              │
   │  6. 写 D1 (payments / subscriptions) │
   │                              │
   ◄──────────────────────────────┘
   │                              │
   │  7. success URL = /checkout/success?session_id=xxx
   │                              │
   │  [前端]                       │
   │  GET /api/checkout/verify?session_id=xxx
   │     → 轮询直到 D1 状态写完（最多 5s）
   │  → 渲染成功页 + 解锁 UI
```

### 路由清单（新增）

| 路径 | 方法 | 用途 | Worker 路由文件 |
|---|---|---|---|
| `/api/checkout/create-session` | POST | 创建 Stripe Checkout Session（按地区选 price_id） | `routes/checkout.ts` |
| `/api/checkout/verify` | GET | 校验 session_id 是否完成支付 | `routes/checkout.ts` |
| `/api/webhooks/stripe` | POST | Stripe 事件 webhook（**需验签**） | `routes/webhooks.ts` |
| `/api/subscription/me` | GET | 当前用户的订阅状态 | `routes/subscription.ts` |
| `/api/subscription/cancel` | POST | 取消订阅（立即 / 期末） | `routes/subscription.ts` |
| `/api/pdf/:slug` | GET | 限流后的 PDF 文件代理（带 access_token） | `routes/pdf.ts` |

### 环境变量（wrangler.toml 新增）

```toml
[vars]
STRIPE_PUBLIC_KEY = "pk_live_..."        # 前端用
# secret 用 wrangler secret put 注入
# STRIPE_SECRET_KEY = "sk_live_..."
# STRIPE_WEBHOOK_SECRET = "whsec_..."
STRIPE_PRICE_PDF_PACK = "price_..."      # 一次性 PDF Pack
STRIPE_PRICE_SUB_MONTHLY = "price_..."   # 月度订阅
STRIPE_PRICE_SUB_YEARLY = "price_..."    # 年度订阅
STRIPE_TAX_ENABLED = "true"              # 是否启用 Stripe Tax（eu 区域 true）
```

### 价格 ID 与地区

- Stripe Dashboard 创建 3 个 Product × 2 个 Tax Behavior 配置（`intl` 走 inclusive, `eu` 走 exclusive with reverse charge）
- Worker 启动时 cache `Stripe.api.prices.list()`，按 metadata.region 索引

### 订阅生命周期事件

| Stripe 事件 | Worker 动作 |
|---|---|
| `checkout.session.completed` | 写 `payments` 表（kind, amount, currency, status）；`kind='pdf_pack'` 时把 user.tier 升级为 `pack` |
| `customer.subscription.created` | 写 `subscriptions` 表（status='active', current_period_end, price_id）；升级 user.tier 为 `plus` 或 `pro` |
| `customer.subscription.updated` | 更新 status / current_period_end；过期则降级 user.tier 为 `free` |
| `customer.subscription.deleted` | 立即降级 user.tier 为 `free` |
| `invoice.payment_succeeded` | 触发续费成功邮件（drip 复用 Resend） |
| `invoice.payment_failed` | 触发续费失败邮件 + dunning（D+3 / D+7 / D+14 三封） |

## Section 5：PDF 生成流水线

### 构建期 pre-build（CI 步骤）

在 `vite build` 之后增加一个 `scripts/build-pdfs.mjs` 步骤：

```javascript
// scripts/build-pdfs.mjs 核心逻辑（伪代码）
import puppeteer from '@cloudflare/puppeteer'; // 或本地 puppeteer-core
import { referencePages } from '../src/data/reference/index.js';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const PDF_OUT = 'dist/pdfs';
if (!existsSync(PDF_OUT)) mkdirSync(PDF_OUT, { recursive: true });

// 1. 启动本地 preview server（vite preview）
const server = spawn('npx', ['vite', 'preview', '--port', '4173']);
await waitForServer('http://localhost:4173');

// 2. 对每张图表页 navigate + waitForSelector + page.pdf()
for (const page of referencePages) {
  const browser = await puppeteer.launch();
  const tab = await browser.newPage();
  await tab.goto(`http://localhost:4173/en/reference/${page.category}/${page.slug}/?print=1`, { waitUntil: 'networkidle0' });
  await tab.waitForSelector('[data-pdf-ready]'); // 图表渲染完成的标记
  const pdf = await tab.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>', // 不要默认 header
    footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
  });
  writeFileSync(`${PDF_OUT}/${page.slug}.pdf`, pdf);
  await browser.close();
}

// 3. 生成 cover.pdf / toc.pdf / glossary.pdf / brand.pdf
// 4. 打包 dist/pdfs/all-charts-v1.zip（一次性买断用）

server.kill();
```

### print=1 query 参数的客户端作用

- 隐藏 nav / hub 链接 / 广告位
- 隐藏 FAQ / related（PDF 包只装数据 + 极简排版）
- 设置 `@media print` 的更激进的样式（去掉边距、加粗标题、强制黑白友好）
- 暴露 `data-pdf-ready` 属性供 Puppeteer 等待

### 水印构建时预烧

- 在 `scripts/build-pdfs.mjs` 增加 `--watermark` flag
- 对前 3 页之后的内容，用 Puppeteer 的 `page.evaluate` 注入 `<div class="watermark">PREVIEW — syy.global</div>` CSS 覆盖层
- 该 div 用 fixed positioning + 旋转 -30 度 + 透明度 0.15，**无法被脚本绕过**

### PDF 文件存储与分发

- 小量（< 100MB）：`dist/pdfs/` 由 Worker 当静态资源 serve（路径 `/pdfs/<slug>.pdf`）
- 量大后：迁 Cloudflare R2（与 Workers 集成最自然；价格 $0.015/GB/月）
- API 路径：`/api/pdf/:slug` 代理分发，**强制 access_token 校验**（防外链盗用）

### Puppeteer 在 CI 的依赖

- 选用 `@cloudflare/puppeteer`（如果 100 页内）或 `puppeteer` 本地（如果希望开发环境也能跑）
- CI 镜像需要 Chrome 依赖（GitHub Actions `ubuntu-latest` 自带）
- 构建时间预估：100 页 × 3s/页 = 5 分钟；可并行化（Puppeteer Cluster / 多 browser 实例）

## Section 6：Email 收集与 Drip 序列

### Resend 集成

- API key 走 `wrangler secret put RESEND_API_KEY`
- 发件域名：`mail.syy.global`（需配置 SPF / DKIM / DMARC，Resend 提供向导）
- 模板用 React Email（与现有 React 项目天然兼容）

### Email 收集点（不弹窗）

| 位置 | 表单文案 | 字段 | 提交后 |
|---|---|---|---|
| 每张图表页底部（H2 后） | "Get new printable charts weekly" | email | 显示"Check your inbox" + 触发 Day 0 drip |
| 学科 hub 页（数学/科学/英语三页） | "Get the 10 most popular charts in [subject]" | email + subject | 同上 |
| PDF Pack 落地页 | "Send me a sample PDF" | email | 立即发样张 PDF + 触发 Day 0 drip |
| 订阅落地页 | "Join the waitlist for early access" | email | 进入 waitlist 标签 |

**显式 opt-in**：checkbox 必勾选（默认未勾）；勾选框文案"我同意接收 syy.global 的教育类邮件，可随时退订"

### Inline 表单组件

```typescript
// src/components/email/InlineSubscribeForm.tsx
// - 默认嵌入页面，不弹窗
// - 提交走 /api/email/subscribe
// - 失败 fallback：邮箱保存到 localStorage，下次访问重试
// - 成功：show "Check your inbox" 提示，2.5s 后表单淡出
```

### Drip 序列（Day 0 → Day 30）

| Day | 主题 | 模板 | 内容 | CTA | 触发条件 |
|---|---|---|---|---|---|
| 0 | Welcome | `welcome.html` | 欢迎 + 1 张精选图表链接 | 浏览图表库 | opt-in 立即 |
| 3 | Most popular | `popular-3.html` | 推 3 张历史最高下载量图表 | 查看图表 | Day 0 发送成功 |
| 7 | Soft upsell | `upsell-soft.html` | "PDF Pack + 订阅 正在准备，waitlist 优先" | 加入 waitlist | opt-in 后第 7 天 |
| 14 | Feedback | `feedback.html` | "你希望我们加什么图表？" | 1-click 投票（链接到 Tally / Google Form） | opt-in 后第 14 天 |
| 30 | Re-engage | `reengage-30.html` | "我们新增了 X 张图表，看看？" | 回到站内 | opt-in 后第 30 天 |

### Drip 引擎（前期自写）

```typescript
// worker/cron/email-drip.ts
// 每小时跑一次：扫 email_subscribers 表，按 (opt_in_at + day_N) 匹配待发邮件
// 幂等：email_drip_log 表 (subscriber_id, day_N, sent_at) 防重复
// 失败重试：最多 3 次，间隔 1h/6h/24h
// 退订：邮件底部链接 unsubscribe?token=xxx → POST /api/email/unsubscribe
```

Cron trigger 通过 `wrangler.toml` 的 `[triggers]` 配置：

```toml
[triggers]
crons = ["0 * * * *"]  # 每小时
```

### 退订（CAN-SPAM 合规）

- 每封邮件底部含退订链接 `https://syy.global/email/unsubscribe?token=<hmac(email, secret)>`
- 退订后 status='unsubscribed'，停止 drip + 营销邮件
- 不退订 transactional 邮件（支付成功、订阅到期等系统通知）

### 后期迁移 Loops 的触发条件

- 当 drip 模板数 > 10 且需要分人群（A/B 测试、按学科）时迁 Loops
- 迁移成本低（仅替换 `worker/cron/email-drip.ts` 与 `routes/email.ts` 的实现，前端表单接口不变）

## Section 7：数据存储（D1 Schema 扩展）

### 现有表（沿用）

- `users`（已有）：扩字段
- `subscriptions`（已有）：扩字段
- `sessions` / `email_verifications` / `login_logs`：不动

### 字段扩展（migration `0002_paid_pdfs.sql`）

```sql
-- users 表扩展
ALTER TABLE users ADD COLUMN locale TEXT DEFAULT 'intl';  -- cn | intl | eu
ALTER TABLE users ADD COLUMN marketing_opt_in INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;

-- subscriptions 表扩展（Stripe 字段）
ALTER TABLE subscriptions ADD COLUMN stripe_subscription_id TEXT UNIQUE;
ALTER TABLE subscriptions ADD COLUMN stripe_price_id TEXT;
ALTER TABLE subscriptions ADD COLUMN current_period_end TEXT;
ALTER TABLE subscriptions ADD COLUMN cancel_at_period_end INTEGER DEFAULT 0;

-- tier CHECK 约束扩展（pack / plus / pro / free）
-- SQLite 修改 CHECK 约束需要重建表：
CREATE TABLE users_new (
  ... 同上 ... tier TEXT DEFAULT 'free' CHECK(tier IN ('free','pack','plus','pro'))
);
INSERT INTO users_new SELECT * FROM users;
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;
```

### 新增表

```sql
-- 邮件订阅者（Drip 主表）
CREATE TABLE email_subscribers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  locale TEXT DEFAULT 'intl',
  source TEXT,                          -- 'inline_chart' | 'hub_math' | 'pack_landing' | 'waitlist'
  subject_interest TEXT,                -- 'math' | 'science' | 'english' | null
  tags TEXT,                            -- JSON 数组: ["waitlist","pack_purchased"]
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','unsubscribed','bounced')),
  confirm_token TEXT,
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX idx_email_subscribers_locale ON email_subscribers(locale);

-- Drip 发送日志（幂等）
CREATE TABLE email_drip_log (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  subscriber_id TEXT NOT NULL REFERENCES email_subscribers(id) ON DELETE CASCADE,
  day_n INTEGER NOT NULL,               -- 0 | 3 | 7 | 14 | 30
  template TEXT NOT NULL,                -- 'welcome' | 'popular-3' | ...
  sent_at TEXT DEFAULT (datetime('now')),
  resend_id TEXT,                        -- Resend message id
  status TEXT DEFAULT 'sent' CHECK(status IN ('sent','failed','bounced')),
  error TEXT,
  UNIQUE(subscriber_id, day_n)
);
CREATE INDEX idx_email_drip_log_subscriber ON email_drip_log(subscriber_id);

-- 支付订单（一次性 + 订阅首期）
CREATE TABLE payments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,                   -- 游客 checkout 时 email 已知
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  kind TEXT NOT NULL CHECK(kind IN ('pdf_pack','subscription')),
  amount INTEGER NOT NULL,               -- 美分
  currency TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending','succeeded','failed','refunded')),
  locale TEXT,
  metadata TEXT,                          -- JSON: utm_source, etc.
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_email ON payments(email);
CREATE INDEX idx_payments_status ON payments(status);

-- PDF 下载日志（限流 + 分析）
CREATE TABLE pdf_downloads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  email TEXT,
  slug TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  referer TEXT,
  downloaded_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_pdf_downloads_slug ON pdf_downloads(slug);
CREATE INDEX idx_pdf_downloads_user_id ON pdf_downloads(user_id);
CREATE INDEX idx_pdf_downloads_downloaded_at ON pdf_downloads(downloaded_at);
```

### 迁移策略

- 用 D1 的 `wrangler d1 migrations apply` 流程（已有 CI 脚本可参考）
- 迁移前备份：D1 export → R2 bucket
- 迁移后跑校验脚本：随机抽 100 个 users，验证 tier 字段未被破坏

## Section 8：SEO 与合规

### noindex 标签

以下路径加 `<meta name="robots" content="noindex,nofollow" />`：
- `/pricing`
- `/checkout`
- `/checkout/success`
- `/account/billing`
- `/account/subscription`
- `/email/unsubscribe`

由 `src/seo/meta.ts` 在生成 meta 时按路径判断。

### Email 合规

- **CAN-SPAM**：每封营销邮件含物理地址（`support@syy.global` → 自动回复含地址）+ 清晰退订链接
- **GDPR（EEA 用户）**：
  - Email 表单明确 opt-in（checkbox 默认未勾）
  - 注册时收集 explicit consent（额外勾选"我同意按隐私政策处理我的数据"）
  - 数据访问请求：`/api/user/export` 返回用户所有数据 JSON（30 天内）
  - 数据删除请求：`/api/user/delete` 软删除 + 30 天后硬删除
- **CCPA（加州用户）**：「Do Not Sell My Personal Information」链接（虽然我们不卖，但加州法律要求声明）
- **CASL（加拿大）**：所有营销邮件需 explicit consent（与 GDPR 同实现）

### Stripe Tax

- `STRIPE_TAX_ENABLED=true`（eu 区域）
- Stripe Dashboard 启用 Tax，配置 product tax codes
- Checkout Session `automatic_tax: { enabled: true }`
- Webhook 收到 `tax.calculation.created/updated` 事件

### 隐私政策与条款（增补现有合规四页）

阶段 D 完成的 `/privacy` `/about` `/contact` `/terms` 四页需增补：
- `/privacy`：Email 营销条款、Stripe 数据处理、Cookie 清单（Stripe / GA4 / AdSense / Resend tracking）
- `/terms`：订阅自动续费条款（"订阅将自动续费，可随时取消；取消将在当前周期结束时生效"）

### Cookie 同意（CMP）

- 沿用 10-02 阶段 D 计划的 Google Funding Choices CMP（TCF v2.2 认证）
- 营销邮件不需要 cookie 同意（基于邮箱 opt-in）
- Stripe Checkout 在 Stripe 域名内，自己处理 cookie 同意

## Section 9：Analytics 关键事件（GA4）

10-02 阶段 C 已接入 GA4。本期新增以下事件（通过 `gtag('event', ...)` 推送）：

| 事件名 | 参数 | 触发位置 |
|---|---|---|
| `email_signup` | source, locale, subject_interest | Inline 表单提交成功 |
| `email_signup_confirmed` | source | Drip Day 0 邮件点击 confirm |
| `checkout_started` | price_kind, locale, user_id (if logged in) | CTA 按钮点击 |
| `checkout_completed` | price_kind, amount, locale | Stripe success URL 渲染 |
| `subscription_cancelled` | reason, period_end | 取消订阅按钮 |
| `pdf_downloaded` | slug, user_tier, is_pack_holder | /api/pdf/:slug 200 响应 |
| `pack_purchased` | amount, locale | payments 表写入 kind=pdf_pack |
| `subscription_started` | price_kind, locale | subscriptions 表写入 |
| `drip_email_sent` | day_n, template | email_drip_log 表写入 |

### 自定义维度

- `user_tier`：free / pack / plus / pro（设置在 GA4 user property）
- `email_subscriber_status`：confirmed / unsubscribed
- `locale`：cn / intl / eu

### 关键漏斗

| 漏斗 | 步骤 | 期望转化率 |
|---|---|---|
| Email 漏斗 | 看到表单 → 提交 → Day 0 邮件打开 → Day 3 邮件打开 → Day 7 waitlist 注册 | 100% / 70% / 50% / 35% / 5% |
| 购买漏斗 | CTA 点击 → Checkout 创建 → 支付完成 | 100% / 95% / 60% |
| 续订漏斗 | D+30 自动续费 → 续费成功邮件 → 下月活跃 | 100% / 95% / 80% |

## Section 10：Milestone Gates 与启动集

> 本节是本 spec 的**执行主干**——所有其他 section（1-9）是「触发后该怎么做」的技术参考。Gate 未通过则不动手。

### Gate 总览

```
  ┌─────────────────────────────────────────────────────────────┐
  │ Gate 0（现在）                                              │
  │   仅做：10-02 阶段 D（合规四页 + AdSlot 修占位）            │
  │       + 阶段 E（6→40→100 页内容 + SEO 沉淀）                 │
  │   监测：GA4 月 PV、CTR、SEO 排名                              │
  │   持续优化：AdSense 广告位 / 标题 / 内链 / 速度               │
  └─────────────────────────────────────────────────────────────┘
                              │
                              ▼  月 PV ≥ 10k 持续 3 个月
  ┌─────────────────────────────────────────────────────────────┐
  │ Gate 1 触发 → 启动 F1（基础设施）+ F2（PDF Pack 一次性）    │
  │   跳过 F3 / F4 / F5                                          │
  │   目标：月销 PDF Pack ≥ 30 份                                │
  └─────────────────────────────────────────────────────────────┘
                              │
                              ▼  PDF Pack 月销 ≥ 30 份 持续 2 个月
  ┌─────────────────────────────────────────────────────────────┐
  │ Gate 2 触发 → 启动 F3（月度/年订阅）                         │
  │   目标：订阅月活 ≥ 100 人                                    │
  └─────────────────────────────────────────────────────────────┘
                              │
                              ▼  订阅月活 ≥ 100 人
  ┌─────────────────────────────────────────────────────────────┐
  │ Gate 3 触发 → 启动 F4（完整 Drip + Resend 全套）            │
  │   目标：Email 列表 ≥ 5,000 / 打开率 ≥ 40%                     │
  └─────────────────────────────────────────────────────────────┘
                              │
                              ▼  Gate 3 稳定 3 个月
  ┌─────────────────────────────────────────────────────────────┐
  │ Gate 4 启动 F5（内容增量：每月新图表 + 练习题 + 教师备注）   │
  │   与 Gate 1-3 并行持续运行                                   │
  └─────────────────────────────────────────────────────────────┘
```

### Gate 0：当前动作清单（不做任何支付基础设施）

**只做**：

1. 10-02 阶段 D：合规四页（/privacy /about /contact /terms）+ AdSlot 占位修复
2. 10-02 阶段 E：6 → 40 → 100 页内容扩写
3. AdSense 优化（广告位密度、位置、标题意图词）
4. SEO 基础设施持续运营（内链、JSON-LD、og:image、sitemap）

**不做**（Gate 1 触发前不允许做）：

- ❌ Stripe 接入（Dashboard 配置 / API key / Webhook）
- ❌ D1 schema migration（`0002_paid_pdfs.sql`）
- ❌ Puppeteer PDF 流水线（`scripts/build-pdfs.mjs`）
- ❌ Resend / 任何邮件服务
- ❌ Inline Email 收集表单
- ❌ `/pricing` `/checkout` 落地页
- ❌ 订阅相关代码（无论中文 plus/pro 还是英文订阅）

**Gate 0 验收**：
- 100 张图表全部上线 + sitemap.xml 含全部
- 合规四页就绪 + AdSense 账号申请提交
- 月 PV ≥ 10k（GA4 验证）+ 持续 3 个月

### Gate 1 启动集：F1（Stripe 基础）+ F2（PDF Pack 一次性买断）

> Gate 1 触发后**同时启动 F1 与 F2**——因为 F2 完全依赖 F1 的 Stripe 接入。

#### F1：Stripe 基础设施（1-2 周）

1. Stripe Dashboard 创建产品（PDF Pack × 2 region：intl + eu）
2. Worker 新增 `routes/checkout.ts` + `routes/webhooks.ts`
3. D1 migration `0002_paid_pdfs.sql` 落地
4. wrangler.toml 配置 Stripe secrets
5. Webhook 验签 + 事件路由（仅处理 `checkout.session.completed`）
6. 用户 tier 升级逻辑：`hasTierAccess` 扩展支持 `pack` tier
7. 测试：Stripe CLI 模拟 webhook → D1 状态正确

**F1 验收**：
- `npm test` 含 stripe webhook 签名校验测试
- `npm run build` 通过
- 手动跑通：游客 checkout → webhook → D1.users.tier = 'pack'

#### F2：PDF Pack 一次性买断（2-3 周）

1. `scripts/build-pdfs.mjs` 实现（Puppeteer + 现有 vite preview）
2. `print=1` 客户端模式（隐藏 nav / 广告 / 链接）
3. `/api/pdf/:slug` 路由 + access_token 校验
4. `/pricing` 落地页（**单轨**：只展示 PDF Pack）
5. `/checkout/success` 页面
6. PDF Pack 持有者 UI 解锁（隐藏"购买" CTA，显示"下载 PDF"）
7. 测试：构建期 100 张 PDF 生成 + 文件大小 < 1MB/张 + 跨浏览器一致性

**F2 验收**：
- 6 张图表手动跑通构建 → PDF 文件正确
- 游客 checkout → 收到 magic link email → 下载 PDF
- 已登录用户 checkout → tier 升级 → UI 解锁

### Gate 2 启动集：F3（月度/年订阅）

> 仅做**订阅**，**不做 Drip**。Drip 留到 Gate 3。

1. Stripe Subscription 创建 + Webhook 处理（`customer.subscription.created/updated/deleted`）
2. `/pricing` 落地页扩为**双轨**（PDF Pack + Subscription）
3. `/account/subscription` 用户自助管理页
4. 取消订阅流程（立即取消 / 期末取消两种 UX）
5. dunning 邮件（D+3 / D+7 / D+14 三封，**走 Resend 但用 transactional 模板而非 drip 引擎**）
6. 测试：Stripe test clock 模拟订阅生命周期

**F3 验收**：
- 订阅创建 → Day 30 自动续费 → 用户收到 invoice 邮件
- 取消订阅 → 期末不续费 → tier 自动降级

### Gate 3 启动集：F4（完整 Drip 引擎）

> 这一阶段才需要 Resend drip 引擎与 Inline Email 表单。

1. Resend API 集成 + React Email 模板（welcome / popular-3 / upsell-soft / feedback / reengage-30）
2. `worker/cron/email-drip.ts` 每小时 cron
3. Inline 表单组件 + `/api/email/subscribe` + `/api/email/confirm` + `/api/email/unsubscribe`
4. DMARC / SPF / DKIM 配置 `mail.syy.global`
5. `/email/unsubscribe?token=xxx` 落地页
6. 测试：Drip 5 封全部到达收件箱（mail-tester.com ≥ 9/10）

**F4 验收**：
- 5 封 drip 全部送达 + 退订 1-click 生效
- Inline 表单转化率 ≥ 2%（GA4）

### Gate 4（持续）：F5 内容增量

> Gate 3 稳定运行 3 个月后才启动。

1. 新图表创作流程接入订阅 30 天独占窗口
2. 每月 1 套练习题 PDF 创作（订阅独享）
3. 教师备注 PDF（每月 1 篇）
4. 月度内容回顾邮件（订阅用户专属 Day 30 变体）

**F5 验收**：每月 1 张新图表 + 1 套练习题稳定产出；订阅 D+30 留存 ≥ 75%

### Gate 测量与决策

#### GA4 报告配置（现在就建好 Gate 监测）

- **Saved Report #1**：「Monthly Traffic Gate」—— `page_path matches /en/reference/`，过去 30 天 PV、UV、CTR
- **Saved Report #2**：「SEO Performance」—— 自然搜索关键词 + 排名 + CTR
- **Saved Report #3**：「AdSense Revenue」—— RPM × CTR × PV 月度趋势
- 每月 1 号自动邮件给 owner

#### 月度 review 决策树

```
月 PV < 5k
  └── 暂停：SEO 模型未起来；回到 Gate 0 加内容
5k ≤ 月 PV < 10k
  └── 继续 Gate 0：扩内容 + 优化 SEO；下月再 review
月 PV ≥ 10k（首次）
  └── 标记「Gate 1 观察期」开始
持续 3 个月月 PV ≥ 10k
  └── ✅ Gate 1 通过 → 启动 F1+F2
任意连续 2 个月月 PV 跌回 < 8k
  └── ❌ Gate 1 未通过 → 回到 Gate 0 排查
```

#### Gate 失败的退出路径

任一 Gate 失败（连续 2 个月未达阈值）→ 回到 Gate 0，把 spec 归档为 `docs/superpowers/specs/archived/2026-10-06-paid-pdf-email-monetization-design.milestone-blocked.md`，并：

- 删除 Resend / Stripe 相关依赖与代码（防止腐烂）
- 保留 Inline Email 表单（作为「纯 list-building」工具）
- 重新评估是否需要修订 Gate 阈值（$9.99 订阅定价是否过高？SEO 模型是否需要调整？）

## Section 11：Gate 评估时间表与可能路径

### 时间表（best-case 推演）

| 月份 | 假设条件 | Gate 状态 | 动作 |
|---|---|---|---|
| M1 (2026-10) | 100 页已上（继承 10-02 阶段 E） | Gate 0 启动 | AdSense + SEO 优化 |
| M2 | 月 PV 5k，SEO 排名爬升中 | Gate 0 继续 | 扩内容 + 内链 |
| M3 | 月 PV 8k | Gate 0 继续 | 同上 |
| M4 | 月 PV 12k（**首次破 10k**） | Gate 1 观察期开始 | 监测稳定性 |
| M5 | 月 PV 14k | Gate 1 观察期 | 同上 |
| M6 | 月 PV 18k（**连续 3 个月 ≥ 10k**） | **Gate 1 通过** | 启动 F1 (Stripe 接入) |
| M7-8 | F1 + F2 并行开发 | Gate 1 进行中 | Stripe + PDF Pack |
| M9 | F2 上线，PDF Pack 月销 15 份 | Gate 2 观察期 | 优化定价 + 落地页 |
| M10 | 月销 25 份 | Gate 2 观察期 | 同上 |
| M11 | 月销 35 份（**连续 2 个月 ≥ 30**） | **Gate 2 通过** | 启动 F3 (订阅) |
| M12 | F3 上线，订阅月活 30 人 | Gate 3 观察期 | 优化订阅 UX |
| M13 | 订阅月活 70 人 | Gate 3 观察期 | 同上 |
| M14 | 订阅月活 110 人（**首次破 100**） | **Gate 3 通过** | 启动 F4 (Drip) |
| M15+ | Drip 持续，列表积累 | Gate 4 启动 F5 内容增量 | 每月新图表 + 练习题 |

### 三种可能路径

**Path A（理想）**：上述时间表按节奏推进 → 14 个月后到 F4 + F5 持续

**Path B（SEO 顺利但付费冷启动慢）**：
- M4-M6 提前到 M2-M4（SEO 起来比预期快）
- 但 PDF Pack 月销破 30 可能要 M9-M11（用户对付费有抵抗）
- 应对：把 Gate 2 阈值从 30 降到 15（前提是月销在稳定增长）

**Path C（SEO 起来慢）**：
- 6 个月内月 PV 未到 10k → SEO 模型需要修订
- 应对：要么调内容方向（更窄的「教师素材」聚焦），要么调 SEO 策略（更激进的长尾 keyword 覆盖），要么承认模型不工作回到纯内容订阅（中文 plus/pro）

### Gate 数据看板

每月 1 号自动生成「出海仪表盘」（GA4 + Stripe + Resend API 拼装），给 owner 一封邮件摘要：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
出海仪表盘 / 2026-11
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AdSense 月收入：$XXX (上月 $XXX, Δ ±XX%)
月 PV：XX,XXX (上月 XX,XXX, Δ ±XX%)
GA4 自然搜索占比：XX%

Gate 状态：
  Gate 0 → 进行中（M2/12）
  Gate 1 → 未启动（距触发还差月 PV X,XXX）

订阅侧（暂未启动）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 测试策略

| 层 | 内容 | 工具 |
|---|---|---|
| Stripe Webhook | 签名校验 + 6 个事件路由 + D1 写入幂等性 | vitest + mock fetch |
| Tier 升级逻辑 | hasTierAccess 矩阵 + tier transition 状态机 | vitest |
| PDF 生成 | 100 张图表文件大小 < 1MB + 关键文本存在 + 跨浏览器一致性 | vitest + Playwright |
| Drip 引擎 | 5 个 day 触发 + 幂等 + 失败重试 + 退订跳过 | vitest + mock D1 |
| Email 模板 | 5 封 HTML 渲染 + 关键 CTA 存在 + 退订链接可达 | vitest + cheerio |
| 集成 | 游客 checkout → D1 → Email → PDF 下载 | Playwright E2E |
| 合规 | CAN-SPAM 字段齐备 + GDPR opt-in 显式勾选 + 退订 1-click | vitest |

## 风险与注意点

### R1：Stripe 在中国大陆的可用性（**高**）

**问题**：Stripe 不支持中国大陆商户。本设计 `cn` 区域暂不实现，假设 `intl` + `eu` 用户全部走 Stripe。

**缓解**：
- 客户端按 `Cloudflare-IPCountry` 路由 cn 用户到现有 plus/pro 流程（不暴露 Stripe 价格）
- 香港/澳门/台湾用户走 `intl`（Stripe 支持）
- 长期若要服务 cn 付费用户，需独立接微信/支付宝（不在本期）

### R2：Webhook 事件顺序与幂等性（中）

**问题**：Stripe 不保证事件按顺序到达，可能重复；D1 写入必须幂等。

**缓解**：
- `payments.stripe_session_id` + `subscriptions.stripe_subscription_id` 加 `UNIQUE` 约束
- 写库前先 `SELECT` 检查，存在则更新而非插入
- 测试覆盖：同一事件重复发送 3 次，D1 状态一致

### R3：Puppeteer 在 CI 的不稳定性（中）

**问题**：GitHub Actions 上 Chrome 偶发 OOM 或超时。

**缓解**：
- 选用 `@cloudflare/puppeteer`（Cloudflare 维护的 fork）或 `puppeteer-core` + 自带 Chromium
- 每张图表超时 30s（page.pdf 默认 30s）
- 构建并行度限制为 4（避免 OOM）
- 构建失败回退：保留上一次的 `dist/pdfs/`，不阻断部署（仅日志告警）

### R4：Email 送达率（中）

**问题**：新域名 `mail.syy.global` 缺信誉，第一周邮件可能进垃圾箱。

**缓解**：
- 启动前用 mail-tester.com 跑分 ≥ 9/10
- Resend 推荐的 SPF / DKIM / DMARC 三件套必须就位
- 前 100 个订阅者手动监控打开率（> 40% 才算健康）
- 准备 fallback：换 Mailgun（如果 Resend 信誉不行）

### R5：用户对自动续费的抵触（低-中）

**问题**：教育类用户对订阅模式敏感，可能产生退款请求。

**缓解**：
- 订阅落地页明确"可随时取消，取消将在期末生效"
- 取消流程简单（无 dark pattern，一键确认）
- 前 30 天无理由退款（人工处理）
- 客服邮箱 `support@syy.global` 24h 响应承诺

### R6：PDF 文件被外链盗用（低-中）

**问题**：付费 PDF URL 一旦泄露可被第三方网站嵌入。

**缓解**：
- `access_token` 校验（短期 JWT，绑定 user_id + ip）
- PDF 文件加水印（用户邮箱后 4 位 + 下载时间戳）
- `pdf_downloads` 表限流（每用户每 slug 每小时 ≤ 10 次）

## 附录 A：定价心理模型对照

| 用户类型 | 推荐 | 理由 |
|---|---|---|
| 家长 | PDF Pack（一次性） | 一次性需求，不订阅 |
| 个体教师 | 订阅（$9.99/月） | 长期用、需要新内容 |
| 学校教师 | 订阅（年付 $99/年省 $20） | 学校预算年度化 |
| 内容重度用户 | 订阅 | 练习题 + 教师备注是续订理由 |
| 路人首次访问 | Email opt-in（免费） | drip 序列培养 |

## 附录 B：路由清单总览

```
/pricing                      # 静态落地页（noindex）
/checkout/success             # 支付成功页（noindex）
/account/billing              # 用户自助管理（noindex）
/account/subscription         # 订阅详情（noindex）
/email/unsubscribe            # 退订落地页（noindex）

/api/checkout/create-session  # POST：创建 Stripe Checkout Session
/api/checkout/verify          # GET：校验 session_id 完成状态
/api/webhooks/stripe          # POST：Stripe webhook 入口（验签）
/api/subscription/me          # GET：当前用户订阅状态
/api/subscription/cancel      # POST：取消订阅
/api/pdf/:slug                # GET：限流后的 PDF 文件代理（access_token）
/api/email/subscribe          # POST：Email 收集
/api/email/confirm            # GET：邮件 confirm 链接
/api/email/unsubscribe        # POST：退订（token 校验）

# Worker Cron
*/1h                          # drip 引擎扫表发送
```

## 非目标

- **中国大陆付费流程**（`cn` 区域）—— 沿用现有 plus/pro，本设计不动
- **PDF 文件的离线 DRM**——本期水印足够，不做 DRM
- **企业发票 / VAT 退税**——超出 MVP，按需追加
- **多币种展示**——本期固定 USD（$29 / $9.99），按 IP 自动用 Stripe Tax 转 local currency
- **教师社群冷启动**——属于营销动作，不是产品功能
- **Affiliate / Sponsored 内容**——属于 10-02 之后的扩张讨论，本设计不涉及
- **PDF 包捆绑销售**（如"PDF Pack + 1 年订阅"）——先把单品跑通，捆绑后续考虑
- **Gift Card / 礼品订阅**——复杂度高，不在 MVP
- **API 嵌入（让其他站点用我们的图表）**——属于 B2B SaaS 范畴，是后续 spec

## 上线 Checklist（按 Gate 分组）

### Gate 0 上线 Checklist（**现在**就要做）

- [ ] GA4 Saved Report #1/#2/#3 配置就绪（Monthly Traffic Gate / SEO Performance / AdSense Revenue）
- [ ] 月度 review 邮件订阅配置（每月 1 号自动发摘要）
- [ ] AdSense 账号申请提交（10-02 阶段 D 完成后立即）
- [ ] 100 张图表上线 + sitemap.xml 含全部
- [ ] 合规四页就绪
- [ ] 内链密度、标题意图词、JSON-LD 抽样通过
- [ ] **不启动** Stripe / Resend / Puppeteer 任何基础设施

### Gate 1 启动 Checklist（PV ≥ 10k 持续 3 个月后）

- [ ] Stripe Dashboard 创建 PDF Pack 产品（intl + eu 两个 Tax Behavior）
- [ ] wrangler secrets 注入 STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET + 三个 STRIPE_PRICE_*
- [ ] D1 migration `0002_paid_pdfs.sql` 在 staging 跑通
- [ ] `scripts/build-pdfs.mjs` 在 CI 跑通（产物 < 100MB）+ 文件大小断言
- [ ] `/pricing` 单轨落地页上线
- [ ] `/api/pdf/:slug` access_token 校验
- [ ] 游客 + 登录用户各跑通一次 checkout 流程
- [ ] GA4 事件 `checkout_started` / `checkout_completed` / `pack_purchased` 埋点
- [ ] Stripe webhook 失败告警（Cloudflare Workers Logs）
- [ ] 月度 review 加 PDF Pack 月销行

### Gate 2 启动 Checklist（PDF Pack 月销 ≥ 30 份持续 2 个月后）

- [ ] Stripe Subscription 创建（monthly + yearly 两 SKU）
- [ ] `/pricing` 扩为双轨
- [ ] `/account/subscription` 自助管理页
- [ ] dunning 邮件（D+3 / D+7 / D+14 transactional 模板）
- [ ] Stripe test clock 跑通订阅生命周期
- [ ] GA4 事件 `subscription_started` / `subscription_cancelled` 埋点

### Gate 3 启动 Checklist（订阅月活 ≥ 100 人后）

- [ ] Resend 域名 SPF / DKIM / DMARC 配置完成
- [ ] mail-tester.com 评分 ≥ 9/10
- [ ] 5 封 drip 模板（React Email）+ cron trigger
- [ ] Inline 表单组件 + 退订 1-click
- [ ] GDPR / CAN-SPAM 文案 review
- [ ] 隐私政策 / 条款 增补营销邮件 + 订阅条款
- [ ] Funding Choices CMP（10-02 阶段 D）已上线
- [ ] Resend 送达率告警 + 退订率告警

### Gate 4 启动 Checklist（Gate 3 稳定 3 个月后）

- [ ] 每月新图表 + 练习题 + 教师备注创作流程建立
- [ ] 订阅 30 天独占窗口接入发布流水线
- [ ] 月度内容回顾邮件模板
- [ ] 订阅留存看板（GA4 cohort）

