# 小学「科学」「道德与法治」学科教程补齐设计

> 状态：设计方案（待实施）
> 创建：2026-09-16

## 背景与目标

学科学习/教程（TutorialView）小学栏目目前仅覆盖语数英三科。科学（33 知识点）与道德与法治（32 知识点）在 `src/data/knowledge/primary/` 中已有完整的 `tutorialContent`（目标/讲解/例题/互动/练习），但**零教程封装**，UI 层也未暴露这两科。

**目标**：补齐科学、道法两科共 ~65 个统一重型结构（teach/learn/practice + 10 题/单元）的教程，复用现有 `TutorialUnitDetail` UI，体验与语数英一致。

## 关键决策

| 决策点 | 结论 | 理由 |
|--------|------|------|
| 补齐范围 | 仅科学 + 道法 | 数据已备，投入产出比最高；其余学科（美术/音乐/体育）无知识点数据，另案处理 |
| 教程结构 | 统一重型（teach/learn/practice + 10 题） | UI 零改造复用，用户体验一致 |
| 映射粒度 | 一知识点一单元 | 映射清晰，~65 单元可预估 |
| 内容生成 | AI 逐单元生成（脚本批量 + 人工审阅） | 质量最高；先跑 2–3 样本锁定风格，再批量 |
| 交付节奏 | Phase 1 科学(33) → Phase 2 道法(32) | 科学先跑通端到端流程，道法复用已验证 prompt |

## 数据映射设计

### 源 → 目标字段映射

源：`KnowledgePoint.tutorialContent`（`src/data/knowledge/primary/science.ts` / `moral.ts`）
目标：`TutorialUnit`（`src/data/tutorials/types.ts`）

| 源字段 | 目标字段 | 转换方式 |
|--------|----------|----------|
| `kp.id` (如 `p-sci-001`) | `unit.id` | 派生：`ps{grade}-u{order}`（科学）、`pm{grade}-u{order}`（道法） |
| `kp.title` | `unit.title` | 直接映射 |
| `tutorialContent.objectives` | `unit.objectives` | 直接映射 |
| `tutorialContent.explanation` 首段 | `teach.summary` | 提取首段或 AI 压缩 |
| `tutorialContent.explanation` 全文 | `learn.sections[0].content` | 结构化拆节（AI 负责分段 + 生成 mermaid 图解） |
| `tutorialContent.examples` | `learn.sections[].examples` | 映射为 Example，分布到对应节 |
| `tutorialContent.interaction` | `teach.hook` 素材 | AI 润色为 200–300 字故事/情境导入 |
| `kp.studyTips` | `learn.tips` | 直接映射 |
| `tutorialContent.exercises` (3-5 题) | `practice` (10 题) | AI 扩写到 10 题（4 easy + 4 medium + 2 hard） |
| 元信息拼接 | `aiContext` | `"grade + subject + title + objectives.join"` |

### 年级分配（关键缺口）

知识点数据**无 `grade` 字段**，每年级应 ~5–6 单元。需在生成脚本中内置年级映射表，按课程标准难度分配：

**科学（33 知识点）年级分配**（按 curriculum 难度）：

| 年级 | 知识点 ID | 单元数 |
|------|-----------|--------|
| 一年级 | p-sci-001, p-sci-002 | 2 |
| 二年级 | p-sci-003, p-sci-009, p-sci-010, p-sci-013 | 4 |
| 三年级 | p-sci-004, p-sci-011, p-sci-012, p-sci-014, p-sci-015 | 5 |
| 四年级 | p-sci-016, p-sci-017, p-sci-018, p-sci-019, p-sci-020 | 5 |
| 五年级 | p-sci-005, p-sci-021, p-sci-022, p-sci-023, p-sci-024, p-sci-025 | 6 |
| 六年级 | p-sci-026, p-sci-027, p-sci-028, p-sci-029, p-sci-030, p-sci-031, p-sci-032, p-sci-033 | 8 |

> 注：上述分配为初版估计，生成脚本中作为常量表 `SCIENCE_GRADE_MAP` / `MORAL_GRADE_MAP`，可人工调整。最终分配在 Phase 1 样本审阅时确认。

**道德与法治（32 知识点）年级分配**：同理建立 `MORAL_GRADE_MAP`，按「个人→学校→家庭→公共→国家→社会」的主题递进分配到 1–6 年级。

## UI 层改动（TutorialView.tsx）

改动范围极小，仅学科枚举与查找逻辑：

1. **Subject 类型扩展**：`'math' | 'chinese' | 'english'` → 加 `'science' | 'moral'`
2. **SUBJECTS 数组**加两项：
   - `{ id: 'science', name: '科学', icon: '🔬' }`
   - `{ id: 'moral', name: '道德与法治', icon: '⚖️' }`
3. **查找逻辑**从三元表达式改为 `subjectNameMap: Record<Subject, string>`

**无需改动**：`TutorialUnitDetail` / `TutorialTeachTab` / `TutorialLearnTab` / `TutorialPractice`（已学科无关）、`validatePracticeQuestionCount`（自动覆盖）、路由。

## AI 生成工作流

### 生成器脚本 `scripts/generate-tutorial.cjs`

- 读取源数据（`knowledge/primary/science.ts` / `moral.ts`）的 `tutorialContent`
- 按年级映射表拼装每个知识点的生成 prompt
- 调用 AI（走 OpenAI 兼容接口，复用项目 `services/ai.ts` 调用方式）
- Schema 校验输出（`TutorialUnit` 结构 + practice.length === 10）
- 写入 `src/data/tutorials/primary-science.ts` / `primary-moral.ts`
- **断点续跑**：已生成且校验通过的单元跳过

### Prompt 策略

每个单元的输入上下文：年级、学科、知识点标题、objectives、explanation、examples、interaction、exercises。

要求 AI 输出严格 JSON（`TutorialUnit` 结构），包含：
- `teach.hook`：200–300 字故事/情境导入，面向 6–12 岁学生
- `teach.summary`：一段话概括
- `learn.sections`：2–3 节，每节含 content（Markdown）+ 可选 mermaid diagram + examples
- `learn.tips`：2–4 条家长辅导提示
- `practice`：10 题（4 easy + 4 medium + 2 hard，题型覆盖 choice/fill/truefalse/solve，每种至少 1 个）
- `aiContext`：自动拼接

### 审阅流程

1. 每 Phase 先跑 2–3 样本单元（低/中/高年级各一）→ 用户审阅风格与质量
2. 通过后批量生成剩余单元（每批 5–8 单元）
3. 最终 `validatePracticeQuestionCount()` 全量校验

## 新增文件清单

```
src/data/tutorials/primary-science.ts   # 科学教程（export PRIMARY_SCIENCE_TUTORIALS）
src/data/tutorials/primary-moral.ts     # 道法教程（export PRIMARY_MORAL_TUTORIALS）
src/data/tutorials/index.ts             # 更新导出 + ALL_TUTORIALS 追加
src/components/TutorialView.tsx         # 学科枚举扩展（仅 3 处改动）
scripts/generate-tutorial.cjs           # AI 生成脚本
```

## 验收标准

- `npm run build` 通过（TypeScript 严格模式）
- `validatePracticeQuestionCount()` 全部通过（每单元严格 10 题）
- 每个学科抽查至少 3 个单元（低/中/高年级各一）人工审阅内容质量
- TutorialView 切换 5 学科正常，无"暂无教程"空占位
- 新学科单元卡片点击后进入完整 teach/learn/practice 三栏

## 交付节奏

| 阶段 | 范围 | 单元数 | 里程碑 |
|------|------|--------|--------|
| Phase 1 | 科学 全年级 1–6 | ~33 | 端到端流程验证，prompt 锁定 |
| Phase 2 | 道法 全年级 1–6 | ~32 | 复用已验证 prompt 快速铺开 |

每 Phase 内按「样本审阅 → 批量生成 → 全量校验」推进。

## 风险与对策

| 风险 | 对策 |
|------|------|
| AI 输出格式不稳定（JSON 解析失败） | 脚本做 schema 校验，失败单元标记重跑，记录错误日志 |
| 生成内容风格不一致 | 先锁定 2–3 seed 样本，后续 prompt 引用为 few-shot exemplar |
| 练习题题型单一 | prompt 显式要求题型分布（choice/fill/truefalse/solve 各 ≥1） |
| 年级分配不合理 | 样本审阅阶段确认 `GRADE_MAP`，不合理的单元可手工调整 order/grade |
| 知识点无 grade 字段 | 生成脚本内置映射表，不改动上游 `knowledge/` 数据（避免影响知识点详情页） |
