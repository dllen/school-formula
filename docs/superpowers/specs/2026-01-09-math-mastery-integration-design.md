# 融会贯通 (math-mastery) 集成设计 spec

> 将 math-mastery 项目的核心能力（参数化随机出题引擎、学习路径、弱点追踪）以 React+TS 重写方式集成到 school-formula

## 1. 功能概述

新增「融会贯通」顶级导航模块，移植 math-mastery 的 70+ 个 K-12 数学解题方法，提供永不重样的随机出题、按依赖关系排序的学习路径、弱点追踪与复习。作为独立模块，不改动现有知识点/教程/题库功能。

## 2. 核心设计决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 移植范围 | 全量移植（70+ 方法） | 一次性覆盖 K-12，最大化价值 |
| 实现方式 | React+TS 重写 | 融入现有架构，TypeScript 安全 |
| 模块定位 | 独立顶级 Tab | 不改动现有功能，清晰隔离 |
| 进度存储 | localStorage 独立键 | 不与现有数据冲突 |
| 出题引擎 | 保留 qgen 核心逻辑 | 永不重样的参数化随机出题 |
| 图解/动画 | 先移植 SVG 数据，动画后续迭代 | 降低首版复杂度 |

## 3. 数据模型

### 3.1 Technique（解题方法）

```typescript
interface Technique {
  id: string;           // 唯一 ID，如 "chicken" "plant"
  grade: string;        // 年级，如 "一年级" "初三"
  stage: '小学' | '中学' | '高中';
  name: string;         // 方法名，如 "鸡兔同笼"
  summary: string;      // 一句话简介
  kou: string;          // 名师口诀
  steps: string[];      // 解题步骤（含 HTML）
  prereq: string | null; // 前置方法 id（形成学习路径链）
  fig?: string | null;  // SVG 图解描述
}
```

### 3.2 Question（题目）

```typescript
interface Question {
  q: string;            // 题目文本（含参数值）
  opts: string[];       // 选项（已打乱）
  ans: number;          // 正确答案索引
  level: number;        // 难度 1-3
  explain: string;      // 分步解析
  point: string;        // 得分点说明
  fig?: string | null;  // SVG 图标记
}
```

### 3.3 PracticeRecord（练习记录）

```typescript
interface PracticeRecord {
  techniqueId: string;
  totalAttempts: number;
  correctCount: number;
  lastPracticedAt: number;  // timestamp
  weakPoints: string[];     // 错题的知识点
}

interface MasteryProgress {
  records: Record<string, PracticeRecord>;
  currentPath: string[];    // 当前学习路径顺序
  completedTechniques: string[];
}
```

### 3.4 文件结构

```
src/data/mastery/
├── types.ts              # Technique, Question, PracticeRecord 类型
├── techniques.ts         # 70+ 方法数据
├── qgen/
│   ├── index.ts          # 统一出题入口 generateQuestions(techniqueId, n)
│   ├── generators.ts     # 各方法的参数化出题函数
│   └── utils.ts          # 选项生成、打乱、格式化工具
└── progress.ts           # localStorage 读写 + 弱点追踪逻辑
```

## 4. 出题引擎设计

### 4.1 核心接口

```typescript
/** 为指定方法生成 n 道不重样的随机题 */
function generateQuestions(techniqueId: string, n?: number): Question[];

/** 生成选项：正确答案 + n-1 个干扰项 */
function generateOptions(answer: number, make: () => number, count: number): string[];

/** 打乱数组 */
function shuffle<T>(arr: T[]): T[];
```

### 4.2 参数化出题模式

每个 technique 有一个生成函数，内部通过随机参数生成题目：

```typescript
// 示例：鸡兔同笼
function qChicken(): Question {
  const total = rand(10, 30);        // 随机头数
  const legs = rand(total * 2 + 2, total * 4 - 2);  // 随机腿数
  const rabbit = (legs - total * 2) / 2;
  const chicken = total - rabbit;
  return Q({
    q: `笼中有头 ${total} 个，腿 ${legs} 条，鸡兔各几何？`,
    ans: `${chicken} 兔 ${rabbit}`,
    // ...
  });
}
```

### 4.3 出题约束

- 所有参数保证题目有整数解
- 干扰项基于正确答案±偏移生成，避免明显错误
- 同一次 `qgen(n)` 调用内不重复

## 5. 学习路径

### 5.1 依赖链

通过 `prereq` 字段形成有向无环图（DAG），每个方法最多一个前置：

```
count → addsub → multi → division → fraction → ...
```

### 5.2 路径解锁规则

- 无前置条件的方法默认可学
- 有前置的方法需通过前置方法的"通关测试"后才解锁
- 通关标准：正确率 ≥ 80%

### 5.3 路径可视化

- 树状图展示所有方法及其依赖关系
- 已解锁：彩色可点击
- 已通关：绿色对勾
- 学习中：黄色高亮
- 未解锁：灰色锁定

## 6. 弱点追踪

### 6.1 追踪维度

- 每个方法的练习次数、正确率
- 错题的具体知识点标签
- 最近练习时间

### 6.2 复习推荐

- 正确率 < 60% 的方法标记为"薄弱"
- 3 天未练习的方法标记为"需复习"
- 复习时优先出之前错过的题型

### 6.3 存储

```typescript
STORAGE_KEY = 'math_mastery_progress'

// 读写函数
function loadProgress(): MasteryProgress;
function saveProgress(progress: MasteryProgress): void;
function recordAttempt(techniqueId: string, correct: boolean, point: string): void;
```

## 7. UI 设计

### 7.1 组件结构

```
src/components/
├── MasteryView.tsx           # 融会贯通主页面（路由分发）
├── MasteryPathView.tsx       # 学习路径（方法树状图）
├── MasteryPracticeView.tsx   # 练习页面（出题→答题→解析）
├── MasteryLibraryView.tsx    # 方法库（浏览所有方法）
├── MasteryProgressView.tsx   # 弱点追踪（进度+复习推荐）
└── mastery/
    ├── PathTree.tsx          # 路径树状图组件
    ├── QuestionCard.tsx      # 题目卡片
    ├── OptionButton.tsx      # 选项按钮
    ├── ExplanationPanel.tsx  # 分步解析面板
    ├── ProgressRing.tsx      # 进度环
    └── TechniqueBadge.tsx    # 方法标签
```

### 7.2 练习流程

1. **选择方法** → 从学习路径/方法库中选择一个方法
2. **出题** → `qgen(6)` 生成 6 道随机题
3. **答题** → 逐题作答（选择/填空），实时反馈对错
4. **解析** → 完成后展示每题的分步解析
5. **统计** → 正确率、得分点、薄弱标签
6. **记录** → 自动保存到 localStorage

### 7.3 导航入口

在 Header.tsx 的导航中新增「融会贯通」Tab，位于「公式」之后。

## 8. 与现有项目的关系

### 8.1 独立运行

- 不修改任何现有 view/component/data
- 不共享现有题库数据
- 进度存储使用独立 localStorage key

### 8.2 未来关联（可选）

- 知识点详情页可增加"相关方法"链接到融会贯通
- 提示词模板可增加"融会贯通出题"场景
- 未来可将 qgen 能力开放给提示词模板

## 9. 移植清单

### 9.1 数据移植（70+ 方法）

按年级分批移植，保持原有 `id`、`prereq`、`name`、`summary`、`kou`、`steps` 字段不变。

### 9.2 出题函数移植

- `js/qgen.js` → `src/data/mastery/qgen/index.ts`
- `js/qgen_junior.js` → `src/data/mastery/qgen/generators.ts`（小学部分）
- `js/qgen_high.js` → `src/data/mastery/qgen/generators.ts`（中学部分）
- 各 `qXxx()` 函数重写为 TS，保持参数化逻辑不变

### 9.3 图解移植

- `js/figures.js` → 保留 SVG 标记数据
- `js/animations.js` → 首版暂不移植动画，后续迭代

## 10. 验收标准

- [ ] Header 新增「融会贯通」Tab，点击切换到 MasteryView
- [ ] 学习路径页正确显示 70+ 方法的依赖关系树
- [ ] 选择方法后能生成 6 道不重样的随机题
- [ ] 答题流程完整：选择→反馈→解析→统计
- [ ] 进度自动保存到 localStorage，刷新后恢复
- [ ] 弱点追踪正确标记薄弱方法和需复习方法
- [ ] 未通关的前置方法正确锁定
- [ ] 方法库可浏览所有方法的口诀和步骤
- [ ] 现有功能（知识点、教程、题库、提示词）不受影响
- [ ] TypeScript 编译通过、Vite 构建成功

## 11. 实施计划概览

1. **数据层**：创建 `src/data/mastery/`，定义类型，移植 70+ 方法数据
2. **出题引擎**：移植 qgen 核心逻辑到 TS
3. **进度存储**：实现 localStorage 读写 + 弱点追踪
4. **UI 层**：创建 MasteryView 及子组件
5. **导航集成**：在 Header 和 Home 中新增 Tab
6. **测试**：验证出题、答题、进度全流程
