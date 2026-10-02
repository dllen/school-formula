# 运行存档：英文打印图表面重写（阶段 A+B）

日期：2026-10-02
结果：**已合入 `main`**（fast-forward 至 `3e2c08c`），特性分支 `feat/english-seo-ads` 已删除
规模：25 commits、55 files、+5371 / −330
验证：381 tests / 68 files、`tsc -b` clean、`eslint` clean、297 页预渲染、`dist/` 内零 `en/reference` 残留

## 这份存档是什么

这次改造按 superpowers 的 subagent-driven-development 流程执行：7 个任务，每个任务一个全新
implementer + 一个独立 reviewer，逐任务过 gate，最后跑一次整分支终审。本目录是那一轮运行的
原始产物，归档在这里是因为工作区目录 `.superpowers/` 被 gitignore——不主动归档就留不下痕迹。

| 文件 | 内容 |
|------|------|
| `ledger.md` | 运行台账。**先看这个**：预检扫描、每轮 dispatch、每次裁决（`Ruling:` 行）与退化的 minor 都在里面 |
| `task-N-brief.md` | 每个任务交给 implementer 的需求全文 |
| `task-N-report.md` | implementer 的实现报告与 TDD 证据；fix round 的报告追加在末尾 |
| `final-fix-report.md` | 终审后那一轮修复波（10 项）的报告 |

## 每轮 review 看到的具体 diff

未归档——因为它们可以用 git 完整复现，且合计 516K。review 报告的正文里写明了各自的范围，
按 SHAs 直接取即可，例如：

```bash
git diff 4221e7f..3e2c08c          # 整分支终审所看的完整范围
git diff 9fad058..8a4257c          # 终审后那一轮修复波
```

## 这次运行里值得记住的东西

**五轮 fix round 加上终审的两条 Important，全部源于计划文本，没有一条是 implementer 执行出错。**
它们收敛成两种形状：

1. **散文里声明的约束，负责强制它的机制其实没在强制。** 文案长度目标（两次：先是边界远松于目标，
   后来我在「修」它的时候又留了余量）、打印隐藏清单（计划散文说要隐藏，计划自己的代码清单却把
   `description`/`intro` 留在可见）、以及一句断言「标签会随语言文件走」的注释而代码恰恰相反。
2. **一个无法在它声称守护的 bug 上失败的测试。** 被删掉的 `rows.length > 0` 不变量、只匹配
   「三个学科之一」的跳转断言、以及用「字母 token 不超过 3 个字符」当判据的中立性测试——
   而泄漏进去的英文词正是 `day`，恰好 3 个字符。**判据是照着它要监管的那个常量校准的。**

两条都是 review 抓到的，不是实现抓到的。下一份计划（阶段 C、D）是同一个作者，值得把这两条
当成写计划时的自查清单。
