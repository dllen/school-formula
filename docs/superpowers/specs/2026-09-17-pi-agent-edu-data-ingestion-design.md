# pi-agent-edu 数据入库管线 设计文档

> 状态：待评审
> 日期：2026-09-17
> 关联：`docs/superpowers/specs/2026-09-17-pi-agent-edu-design.md`（生成侧工具本体）

## 概述

`pi-agent-edu` 目前能生成教程/练习题的文本，但 `save` 只是把原始响应 dump 到
`scripts/pi-agent-edu/output/generated-*.ts`，没有解析、校验、接入项目数据文件。

本设计把「生成」与「入库」拆成两个阶段（**Approach C**）：

1. **生成侧**（`pi-agent-edu`，或 Claude、或人工）：产出**规范 JSON payload** 到 `staging/`。
2. **入库侧**（新增 `scripts/ingest-data`）：读取 `staging/`，**确定性**地校验 → 合并进 `src/data/` → 接线 `index.ts`/`ALL_*` → 跑 `tsc` 确认。

关键性质：

- **入库脚本与生成器无关**：任何来源产生的规范 payload 都能入库。
- **schema 单一事实源**：校验直接 import `src/data/*/types.ts` 的真实类型，用 `tsc` 做类型校验，永不与真实类型漂移。
- **零代码执行**：入库只 `JSON.parse`，不 eval、不执行生成内容。

## 范围

覆盖 8 种数据类型：

| 类型 | 真实类型来源 |
|------|-------------|
| 教程 `Tutorial` | `src/data/tutorials/types.ts` |
| 题库 `Question` | `src/data/questions/types.ts` |
| 知识点 `KnowledgePoint` | `src/data/types.ts` |
| 速查表 `CheatSheet` | `src/data/cheatsheets.ts` |
| 公式 `Formula` | `src/data/formulas.ts` |
| 口算 `MentalMathMnemonic` | `src/data/mentalMath.ts` |
| 掌握度 `Technique` | `src/data/mastery/types.ts` |
| 提示词 `PromptTemplate` | `src/data/prompts/types.ts` |

**不纳入**（静态/经典文本，非 AI 生成）：古籍 `zizhi`/`shiji`、识字表 `characters2000/3500`、成语 `idioms`、元素周期表 `periodicTable`。

## Section 1 — Staging 契约

```
staging/                          # 仓库根，.gitignore
  tutorials/<id>.json             # { "tutorial": {…Tutorial} }
  questions/<id>.json             # { "questions": […Question] }
  knowledge/<id>.json             # { "grade": …, "subject": …, "knowledgePoints": […] }
  cheatsheets/<id>.json           # { "cheatsheets": […CheatSheet] }
  formulas/<id>.json              # { "formulas": […Formula] }
  mental-math/<id>.json           # { "grade": …, "mnemonics": […MentalMathMnemonic] }
  techniques/<id>.json            # { "techniques": […Technique] }
  prompts/<id>.json               # { "prompts": […PromptTemplate] }
```

- **payload 是纯 JSON**，字段形状与对应 `types.ts` 接口一一对应。
- `kind` 由目录决定；`<id>` 取该类型自身的 id（如 `m-math-7-u1`、`p-math-001`）。
- 枚举字段（`grade`/`subject`/`stage`/`scenario`）**沿用各类型自身的枚举**，由 `satisfies` 类型校验兜底，本文不重复列举枚举值。例如 `knowledge` 的 `grade` 为 `GradeLevel`（`primary|middle|high`），`subject` 为学科文件键（如 `math`，对应 `knowledge/<stage>/math.ts`）。
- 选 JSON 而非 TS：可被 `JSON.parse` 安全解析（零代码执行），且要求 LLM 输出严格 JSON 比要求合法 TS 字面量更易可靠。

## Section 2 — `scripts/ingest-data` 脚本结构

```
scripts/ingest-data/
  index.ts            # CLI: ingest <file|--all> / --list / --dry-run
  registry.ts         # kind → adapter
  validate.ts         # JSON.parse → 临时 .ts + satisfies → tsc --noEmit
  wire.ts             # 确定性编辑 index.ts / ALL_* 数组
  adapters/
    tutorial.ts
    question-bank.ts
    knowledge.ts
    cheatsheet.ts
    formula.ts
    mental-math.ts
    technique.ts
    prompt.ts
```

**每个 adapter 实现四步：`validate`（类型 + 业务规则）→ `merge`（写目标文件）→ `wire`（改 index/ALL_*）→ 报告。**

### 校验（两层）

1. **类型层（零漂移）**：把 payload 写成临时 `.ts`：
   ```ts
   import type { Tutorial } from '<abs>/src/data/tutorials/types';
   export const __payload = <json 字面量> satisfies Tutorial[];
   ```
   跑 `tsc --noEmit`。类型错 = 拒绝并报错。不用手写 zod/JSON-schema。
2. **业务规则层（确定性 TS）**：
   - id 全局唯一（对现有 `ALL_*` 数据 + payload 内部去重）
   - 教程每单元固定 10 题
   - 题库 `knowledgePointIds` 必须引用 `KNOWLEDGE_DATA` 中存在的 id
   - 枚举字段（`stage`/`scenario`/`grade`/`subject`）合法
   - 提示词 `usageCount`/`rating` 归零、`author` 置默认

### 合并与接线

沿用现有约定：追加进对应数组（如 `middle-math.ts` 的 `MIDDLE_MATH_TUTORIALS: Tutorial[]`），
需要接线时确定性编辑 `index.ts`（加 import 行 + 数组项）。最后跑完整 `npm run build` + `npm test`。

## Section 3 — 生成侧改动（pi-agent-edu）

1. **系统提示词**（`prompts.ts`）：删掉过期 TS 接口，改为「输出严格 JSON，字段形状以 `src/data/*/types.ts` 为准（用 `read` 确认）+ 每类型给一个最小 JSON 示例」。入库脚本 tsc 校验兜底。
2. **引导向导**（`index.ts`）：任务类型 4 → 8 种。
3. **`save`/`退出`**：写 `staging/<kind>/<id>.json`，并提示「运行 `npm run ingest` 入库」。

## Section 4 — adapter 清单

| kind | payload | 合并目标 | 接线 | 交叉校验 |
|------|---------|----------|------|----------|
| `tutorial` | `{ tutorial: Tutorial }` | `<stage>-<subject>.ts` 的 `XXX_TUTORIALS[]` | `index.ts` import + `ALL_TUTORIALS` | unit id 唯一；每单元 10 题；id 格式 `{l}-{s}-{g}-u{n}` |
| `question-bank` | `{ questions: Question[] }` | `<stage>-<subject>-questions.ts` | `index.ts` import + `ALL_QUESTIONS`（新学科时） | id 唯一；`knowledgePointIds ⊆ KNOWLEDGE_DATA`；`subject/grade` 枚举 |
| `knowledge` | `{ grade, subject, knowledgePoints[] }` | `knowledge/<stage>/<subject>.ts` 的 `KnowledgePoint[]` | 新学科时改 `knowledge/<stage>.ts` import + subjects | kp id 唯一；`tutorialContent` 形状 |
| `cheatsheet` | `{ cheatsheets: CheatSheet[] }` | `cheatsheets.ts` `ALL_CHEATSHEETS[]` | 无（单文件） | id 唯一 |
| `formula` | `{ formulas: Formula[] }` | `formulas.ts` | 无 | id 唯一；`grade/subject` 枚举 |
| `mental-math` | `{ grade, mnemonics: MentalMathMnemonic[] }` | `mentalMath.ts` | 无 | id 唯一 |
| `technique` | `{ techniques: Technique[] }` | `mastery/techniques.ts` `TECHNIQUES[]` | 无 | id 唯一；`stage ∈ 小学/中学/高中`；`prereq` 引用已存在技巧（可 null） |
| `prompt` | `{ prompts: PromptTemplate[] }` | `prompts/<scenario>/index.ts`（追加内联字面量） | 无（8 个 scenario 已在 `prompts/index.ts`） | id 唯一；`scenario` 枚举；`usageCount/rating` 归零 |

要点：速查表/公式/口算/掌握度 4 类「追加到单文件自包含数组、无需接线」，adapter 很薄。
真正要接线的只有 `tutorial`、`knowledge`（仅新学科）、`prompt`。

## Section 5 — 测试 + 安全

- **每个 adapter 单测**：合法 payload → 正确合并+接线（golden 文件对比）；非法 payload（类型错、id 重复、`knowledgePointId` 指向不存在、题量≠10）→ 拒绝并给出清晰错误。
- **`--dry-run`**：只校验不写盘，供人工/CI 预检。
- **安全边界**：只 `JSON.parse`（零代码执行）；只追加不覆盖；`wire` 带前后断言；入库后跑完整 `npm run build` + `npm test`。

## 分阶段交付

1. **P0 — 管线地基**：`ingest-data` 脚本骨架 + `tutorial`、`question-bank` 两个 adapter（垂直切片，覆盖「类型校验 + 业务规则 + 合并 + 接线」全链路）。
2. **P1 — 扩展 adapter**：`knowledge`、`cheatsheet`、`formula`、`mental-math`、`technique`、`prompt`（多数为薄 adapter）。
3. **P2 — 生成侧改造**：`pi-agent-edu` 系统提示词改 JSON、向导扩到 8 类型、`save` 写 staging。

## 开放问题 / 风险

- `knowledge/<stage>/<subject>.ts` 单个文件已很大（如 `primary/math.ts` 219KB），持续追加会进一步膨胀——是否在入库侧引入按需拆分（如超过阈值拆新文件），本轮暂不做，标记为后续项。
- 提示词 `PromptTemplate` 含运行时字段（`usageCount`/`rating`/`author`），生成侧无法合理产出——入库侧统一归零/置默认，语义由适配器封装。
- 教程 `Tutorial` 的 `units[]` 粒度：payload 一次携带一个完整 `Tutorial`（学科+年级+若干 unit）。批量章节生成时按 `Tutorial` 为单位拆多个 payload 文件。
