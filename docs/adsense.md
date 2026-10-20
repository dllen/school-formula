# AdSense 集成说明

- **Status:** 待办（needs human action before AdSense serves real ads）

## 概述

AdSense 单元已经接入到 src/ads/config.ts 的 AD_SLOTS 配置里：knowledgeMid / knowledgeBottom（中文知识点详情页）+ referenceBottom（英文速查表页）。三个 slot id 默认是 null，所以默认配置（adSlots=[]）下不会渲染广告，也不会留空白——这是 fail-safe。

## 上线步骤

1. 在 Google AdSense 后台为本站（syy.global）创建 3 个广告单元，把 id 复制出来。
2. 在 GitHub repo 的 Settings → Secrets and variables → Actions 增加三个 secret：
   - VITE_ADSENSE_SLOT_KNOWLEDGE_MID
   - VITE_ADSENSE_SLOT_KNOWLEDGE_BOTTOM
   - VITE_ADSENSE_SLOT_REFERENCE_BOTTOM
3. 触发一次 push（或 workflow_dispatch）到 main，CI 会在 Build 步骤把这三个 secret 注入为 Vite 环境变量（VITE_* 前缀会被打包进产物）。
4. 部署完成后验证：
   ```bash
   curl -s https://syy.global/en/math/multiplication-chart/ | grep adsbygoogle || true
   ```
   本地 build（不带 secret）应当 0 个 adsbygoogle；CI 设置后 >0。
5. 在 AdSense 后台 → Privacy & messaging 启用 EEA/UK 的认证 CMP（Google 的 Privacy & messaging 即可），保证 EU/UK 用户合规。

## 失败模式

- slot id 没填：`isAdConfigured()` 返回 false，AdUnit 不渲染（占位 0px，不污染页面）。
- publisher id 缺失：`ADSENSE_CLIENT_ID` fallback 到仓库常量 ca-pub-3563451416072185；如果希望覆盖，在 .env.development / .env.production 写 VITE_ADSENSE_CLIENT_ID。
- 打印预览：AdUnit 容器加了 `print:hidden`，浏览器打印时广告不出现。
