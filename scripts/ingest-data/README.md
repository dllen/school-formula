# ingest-data

确定性的数据入库 CLI：读取 `staging/<kind>/*.json` 载荷，用真实的 `src/data/*/types.ts` 类型做 `satisfies` 校验，通过后合并进 `src/data/`，并接线 `index.ts` / `ALL_*`。

## 安装

```bash
cd scripts/ingest-data
npm install
```

> 使用 `npm` 而非 `pnpm`。`pnpm` 会在执行脚本前跑一次依赖状态检查，可能因 `Ignored build scripts` 报错。

## 用法

```bash
cd scripts/ingest-data

# 入库 staging/ 下全部文件
node --import tsx index.ts --all

# 列出 staging/ 下全部待入库文件
node --import tsx index.ts --list

# 只校验不写盘（dry-run）
node --import tsx index.ts --all --dry-run

# 只处理指定文件
node --import tsx index.ts staging/tutorials/foo.json
```

也可用 `ingest.sh` 快捷脚本：

```bash
./ingest.sh --all
./ingest.sh --list
./ingest.sh --dry-run
```

仓库根目录提供快捷命令（通过 `scripts/ingest-data/ingest.sh`）：

```bash
npm run ingest       # = --all
npm run ingest:list  # = --list
npm run ingest:dry   # = --dry-run
```

## staging 契约

`staging/` 下按 kind 分子目录，每个 JSON 文件是一个「信封对象」。文件名（`<id>.json`）仅用于识别，`id` 以载荷内部字段为准。

| 目录 | 信封形状 | 类型 |
|------|----------|------|
| `tutorials/<id>.json` | `{ "tutorial": { …Tutorial } }` | `Tutorial` |
| `questions/<id>.json` | `{ "questions": [ Question, … ] }` | `Question[]` |
| `knowledge/<id>.json` | `{ "grade": "…", "subject": "…", "knowledgePoints": [ KnowledgePoint, … ] }` | `KnowledgePoint[]` |
| `cheatsheets/<id>.json` | `{ "cheatsheets": [ CheatSheet, … ] }` | `CheatSheet[]` |
| `formulas/<id>.json` | `{ "formulas": [ Formula, … ] }` | `Formula[]` |
| `mental-math/<id>.json` | `{ "mnemonics": [ MentalMathMnemonic, … ] }` | `MentalMathMnemonic[]` |
| `techniques/<id>.json` | `{ "techniques": [ Technique, … ] }` | `Technique[]` |
| `prompts/<id>.json` | `{ "prompts": [ PromptTemplate, … ] }` | `PromptTemplate[]` |

约定：

- `grade` 既可是数值字符串（`"7"`），也可是学段单词（`"middle"`），由 `gradeToStage` 归一化为 `primary` / `middle` / `high`。
- `subject` 用学科中文名（如 `"数学"`），由 `SUBJECT_KEYS` 映射为文件键（`math`）。
- 文件按字典序处理（`listStaged` 排序），保证入库顺序确定。

## 适配器表

| kind | 目标文件 | 数组 / 接线 |
|------|----------|------------|
| `tutorials` | `src/data/tutorials/{stage}-{subject}.ts` | `{STAGE}_{SUBJECT}_TUTORIALS`；接线 `tutorials/index.ts` 的 `ALL_TUTORIALS` |
| `questions` | `src/data/questions/{stage}-{subject}-questions.ts` | `{stage}{Subject}Questions`；接线 `questions/index.ts` 的 `ALL_QUESTIONS` |
| `knowledge` | `src/data/knowledge/{stage}/{subject}.ts` | `{subject}`；接线 `knowledge/{stage}.ts` 的 `subjects` |
| `cheatsheets` | `src/data/cheatsheets.ts` | `ALL_CHEATSHEETS`（无需接线） |
| `formulas` | `src/data/formulas.ts` | `PRIMARY_FORMULAS` / `MIDDLE_FORMULAS` / `HIGH_FORMULAS`（按 grade） |
| `mental-math` | `src/data/mentalMath.ts` | `PRIMARY_MNEMONICS` / `MIDDLE_MNEMONICS` / `HIGH_MNEMONICS`（按 grade） |
| `techniques` | `src/data/mastery/techniques.ts` | `TECHNIQUES`（无需接线） |
| `prompts` | `src/data/prompts/{scenario}/index.ts` | `{SCENARIO}_PROMPTS`（无需接线，已在 `prompts/index.ts`） |

前 4 类薄适配器由 `adapters/simple-array.ts` 的 `simpleArrayAdapter` 工厂构造；后 4 类（`tutorials` / `questions` / `knowledge` / `prompts`）因需要按 grade/subject/scenario 定位目标文件或接线 index 而各自定制。

## 校验流程

每个文件依次执行 `extract → 类型校验 → 业务校验 → merge → wire`：

1. **类型层（`validate.typeCheck`）**：用 TypeScript 编译器 API，把载荷渲染成 `const __payload = … satisfies <Type>` 的临时文件，以 `strict` 模式编译；编译错误即校验失败。类型表达式（`TypeRef`）指向真实定义（如 `src/data/tutorials/types.ts` 的 `Tutorial`）。
2. **业务规则（`adapter.validate`）**：
   - id 唯一：载荷内部无重复，且不与目标文件既有 id 冲突（`duplicateIds` / `collidingIds`）。
   - `tutorials`：每个 `unit` 的练习题数量必须为 10。
   - `questions`：同载荷内 `subject` / `grade` 必须一致；每个 `knowledgePointId` 必须指向已存在的知识点（`index.ts` 预加载 `KNOWLEDGE_DATA` 全集）。
   - `prompts`：`extract` 阶段注入运行时默认字段 `usageCount: 0`、`rating: 0`、`author: 'pi-agent-edu'`。

`merge` 用 `tsedit.appendToConstArray` 把条目追加到目标 `const` 数组末尾（2 空格缩进渲染，JSON 是 TS 对象字面量子集）；`wire` 用 `insertLineAfter` / 字符串替换把新数组接入 `index.ts` 与 `ALL_*`。

## 验证

```bash
cd scripts/ingest-data
npm run typecheck   # tsc --noEmit
npm test            # 19 个测试

cd ../..            # 仓库根
npm run build       # 整库 tsc -b + vite build，确认合并后仍编译通过
```
