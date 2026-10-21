# English SEO 周报

基线（2026-10-19）：GSC 已收录 **待 GSC 验证** 页；近 28 天 impressions **待 GSC 验证**、clicks **待 GSC 验证**；sitemap 303 URL；主包 6,367,037 B / gzip 1,596,712 B；首页 TTFB 待测。

| 周 | 日期 | 新增页 | 英文页总数 | 收录数 | Impressions | Clicks | 平均排名 | 首屏 JS | 备注 |
| 2026-W21 | 2026-10-21 | 13 | 20 | 待 GSC 验证 | 待 GSC 验证 | 待 GSC 验证 | 待 GSC 验证 | entry 2.0MB raw / 644KB gzip | Task 1-14 完成；Task 15 内容页 13 张上线，预渲染 322 页 |
|----|------|--------|------------|--------|-------------|--------|----------|---------|------|

## G2 Gate 复盘（2026-10-21，分支 feat/english-seo-foundation）

**技术侧（本地可验证，全部达标）**

| 指标 | 目标 | 实测 |
|---|---|---|
| 预渲染页面数 | ≥ 320 | **322** |
| 英文图表页 | ≥ 20 | **24**（13 math + 3 science + 4 english）|
| sitemap URL | 覆盖全部 | **321** |
| 每页站内链接 | ≥ 5 | 首页 48 / 知识点 18 / 英文图表 13 |
| /sitemap 可达链接 | 全站 | **332**（每个 URL 1 次点击可达）|
| 入口 chunk | ≤ 1.5MB raw | **2.03MB raw / 639KB gzip** |
| 测试 | 全绿 | **505/505 通过** |
| lint / build | 0 错误 | 通过，322 页 |

**内容侧**

- 14 个目标页全部上线（backlog 14/14 已完成）
- 参考页校验加严：proseWords ≥ 400、related ≥ 2、FAQ ≥ 3
- 题库清理：704 处重复 ID 修正（小学道法前缀 q-pm 改为 q-pmo）、59 处未替换占位符修复、9 处 knowledgePointIds 断链修复
- 新增 src/data/questions/integrity.test.ts 作为长期回归防线

**需要人来补的部分（我没有权限）**

| 项 | 状态 | 谁来做 |
|---|---|---|
| GSC 收录数 / impressions / clicks | 待填 | 需要 syy.global 的 Search Console 权限 |
| Bing Webmaster 验证与提交 | 未做 | 同上 |
| AdSense 三个 slot 的 GitHub secrets | 未注入 | AdSense 后台创建广告单元后配置 |
| CMP（EEA/UK） | 未启用 | AdSense Privacy & messaging |
| Pinterest 分发 | 未做 | 可选 |

**G2 判定**

- 技术侧：**通过**。收录路径、页面深度、包体、内容质量都达标。
- 流量侧：**无法判定**，缺 GSC 数据。合并后需提交 sitemap 并观察 2–4 周：
  - 收录率 ≥ 80% 且 30 天 impressions ≥ 1,000 → 继续扩到 40 页
  - 收录率 < 50% 或 impressions < 200 → 先查 canonical/robots/JS 渲染，仍无改善则转 B 方案
- W16 终止条件（20 页全部收录且技术全绿仍无 impressions 增长）尚未触发，需要 4 周真实数据。
