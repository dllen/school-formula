# pi-agent-edu

交互式 CLI 工具，通过 `@earendil-works/pi-coding-agent` SDK 生成中小学教育资源。

## 安装

### 前置要求

- **Node.js 18+**
- **pi agent 鉴权已配置**（`~/.pi/agent/auth.json` + `~/.pi/agent/models.json`）

```bash
# 安装依赖（含 @earendil-works/pi-coding-agent SDK）
npm install

# 配置鉴权（用 pi CLI 登录某个 Provider，或手动编辑 ~/.pi/agent/*）
pi auth login
```

> 本工具运行时通过 SDK 直读 `~/.pi/agent/` 配置，**不再 shell 调用 `pi` 二进制**；
> 但配置鉴权通常仍需借助 `pi auth login`。

### 运行

```bash
# 使用快捷命令（推荐）
npm run gen:dsl          # 启动引导模式
npm run gen:new          # 强制新建会话
npm run gen:continue     # 继续上次会话
npm run gen:sessions     # 列出会话
npm run gen:help         # 查看帮助

# 或直接使用脚本
./pi-agent-edu.sh

# 或直接运行
npx tsx index.ts

# 恢复最近会话
./pi-agent-edu.sh --continue

# 恢复指定会话
./pi-agent-edu.sh --continue <session-id>

# 列出会话
./pi-agent-edu.sh --sessions

# 查看帮助
./pi-agent-edu.sh --help
```

> **注意**：使用 `npm run` 而非 `pnpm`。`pnpm` 会在执行脚本前运行 `pnpm install` 检查，
> 可能遇到 `Ignored build scripts` 错误。

---

## 引导模式

新会话会自动启动引导模式，帮助你快速生成内容：

```
📚 欢迎使用 pi-agent-edu 教育智能体！

让我来引导你完成内容生成...

请选择学段：
  [1] 小学
  [2] 初中
  [3] 高中
> 2

请选择科目：
  [1] 数学
  [2] 物理
  [3] 化学
  ...
```

**引导流程：**
1. 选择学段（小学 / 初中 / 高中）
2. 选择科目（根据学段动态显示）
3. 选择年级
4. 选择任务类型
5. 如选择"练习题"，额外选择难度

---

## 交互命令

在交互模式中可用：

| 命令 | 说明 |
|------|------|
| `help`, `?` | 显示帮助 |
| `q`, `quit`, `exit` | 退出 |
| `退出` | 保存最近生成内容并退出 |
| `save`, `保存` | 保存最近生成内容到仓库（`save <路径>` 指定位置） |
| `btw <文字>` | 旁注：只对下一轮生效 |
| `model`, `provider` | 切换 AI 模型 |
| `thinking` | 切换思考级别 |

---

## 运行行为说明

- **系统提示词**：内置教育系统提示词（`prompts.ts` 的 `getSystemPrompt()`，定义「中学教师」角色、JSON 信封输出格式（8 种）与内容质量标准），通过 SDK 的 `DefaultResourceLoader` 注入。同时禁用了 skills / themes / prompt-templates（与内容生成无关，会污染上下文）；保留 `CLAUDE.md` / `AGENTS.md` 让 agent 了解仓库结构。
- **工具自动执行**：`read` / `grep` / `find` / `ls` / `bash` / `edit` / `write` 由 SDK **自动执行、无逐条确认**。请仅在信任的项目目录下运行——agent 能够修改文件、执行 shell 命令。

---

## 最佳实践

### 有效 Prompt 范例

**✅ 好的 Prompt**
```
生成【初中数学 - 初二 - 一次函数】的 TutorialUnit，包含10道练习题（easy:medium:hard = 4:4:2）
```

**❌ 不够好的 Prompt**
```
生成一次函数的练习题
```

**差异点：**
- 明确年段和学科
- 指定知识点而非章节名
- 明确难度分布

### 推荐工作流

1. **生成前先了解现有数据**
   ```
   > 读取 src/data/tutorials/index.ts 了解已有内容
   > 读取 src/data/tutorials/types.ts 了解格式要求
   > 读取 src/data/knowledge/ 了解知识点结构
   ```

2. **分步生成**
   - 先生成 1 个单元确认质量
   - 确认风格、格式无误后再批量生成

3. **生成后检查**
   - 用 `bash npx tsc` 检查类型错误
   - 用 `read` 验证输出格式
   - 用 `grep` 确认没有重复内容

### 工具使用策略

| 场景 | 推荐工具 | 示例 |
|------|----------|------|
| 查看数据格式 | `read` | `read src/data/tutorials/middle-math.ts` |
| 搜索相似内容 | `grep` | `grep "一次函数" src/data/tutorials/` |
| 确认文件存在 | `bash` | `bash ls src/data/tutorials/` |
| 写入新内容 | `write` | 先写临时文件，确认后移动 |
| 修改现有内容 | `edit` | 先 `read` 了解上下文 |

### 内容质量检查清单

生成内容后，按以下清单检查：

- [ ] **准确性**：计算题答案验算过，概念与课程标准一致
- [ ] **难度适切**：easy 题确实简单，hard 题有区分度
- [ ] **格式规范**：TypeScript 对象合法，id 全局唯一
- [ ] **教学价值**：题目有思维含量，不是纯记忆

### 常见问题

**Q: 生成的格式不合法怎么办？**
A: 分步生成，先确认结构再填充内容。先生成简单内容验证格式。

**Q: 内容与已有内容重复怎么办？**
A: 生成前先用 `grep` 搜索关键词，确认不存在再生成。

**Q: 题目难度不均衡怎么办？**
A: 明确指定 easy/medium/hard 各多少道，不要让 AI 自己决定。

---

## Prompt 模板参考

### TutorialUnit 生成

```bash
> 生成【初中数学 - 初一 - 有理数】TutorialUnit
> 生成【高中物理 - 必修一 - 匀变速直线运动】TutorialUnit
> 批量生成初中数学第一章5个单元
```

### 练习题生成

```bash
> 生成10道初中物理浮力练习题（easy:medium:hard = 4:4:2）
> 生成高中化学氧化还原练习题（选择题，8道）
> 生成初一数学第二章单元测试卷（45分钟）
```

### 错题分析

```bash
> 学生把幂的乘方和积的乘方公式混淆了，请分析并讲解
> 分析这道几何证明题的常见错误
```

### 学习规划

```bash
> 为期中考试生成数学复习计划（还有10天，每天1小时）
> 生成高考物理力学专题复习计划（还有1个月）
```

---

## 输出格式

系统提示词要求 AI 输出严格合法的 JSON「信封」对象（无 markdown 围栏、无解释文字）。信封只包含下列 8 种键之一，`save`/`退出` 按信封键映射到对应 staging 目录：

| 信封键 | 说明 | staging 目录 |
|--------|------|--------------|
| `tutorial` | 教程单元 | `tutorials` |
| `questions` | 题库 | `questions` |
| `knowledgePoints` | 知识点 | `knowledge` |
| `cheatsheets` | 速查表 | `cheatsheets` |
| `formulas` | 公式 | `formulas` |
| `mnemonics` | 口算口诀 | `mental-math` |
| `techniques` | 掌握度技巧 | `techniques` |
| `prompts` | 提示词模板 | `prompts` |

字段形状以 `src/data/` 下对应的 `types.ts` 为准（如 `src/data/tutorials/types.ts`）。

---

## 数据文件位置

`save`/`退出` 会把最近生成内容写入 `staging/<kind>/generated-<timestamp>.json`（`<kind>` 由信封键映射，见上文）。写入后，在仓库根目录运行 `npm run ingest` 将其合并进 `src/data/`：

```
staging/
├── tutorials/          # 教程单元（tutorial）
├── questions/          # 题库（questions）
├── knowledge/          # 知识点（knowledgePoints）
├── cheatsheets/        # 速查表（cheatsheets）
├── formulas/           # 公式（formulas）
├── mental-math/        # 口算口诀（mnemonics）
├── techniques/         # 掌握度技巧（techniques）
└── prompts/            # 提示词模板（prompts）
```

最终数据落在 `src/data/`：

```
src/data/
├── tutorials/          # 教程单元数据
│   ├── primary-*.ts   # 小学教程
│   ├── middle-*.ts     # 初中教程
│   ├── high-*.ts       # 高中教程
│   └── types.ts        # 类型定义
├── knowledge/          # 知识点结构
├── questions/         # 额外题库
└── prompts/           # 提示词模板
```
