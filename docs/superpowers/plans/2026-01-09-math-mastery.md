# 融会贯通 (math-mastery) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 math-mastery 的核心能力（参数化随机出题引擎、学习路径、弱点追踪）以 React+TS 重写方式集成到 school-formula，作为独立顶级模块「融会贯通」。

**Architecture:** 新增 `src/data/mastery/` 数据层（类型 + 70+ 方法 + qgen 引擎 + 进度存储），新增 `src/components/` UI 层（MasteryView + 4 个子页面 + 6 个子组件），在 Header/Home 中新增导航 Tab。

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4, Vite 7

---

## 文件结构

```
src/
├── data/
│   └── mastery/                      # 新增：融会贯通数据层
│       ├── types.ts                  # Technique, Question, PracticeRecord 类型
│       ├── techniques.ts             # 70+ 方法数据
│       ├── qgen/
│       │   ├── index.ts              # 统一出题入口
│       │   ├── generators.ts         # 各方法出题函数（70+）
│       │   └── utils.ts              # shuffle, rand, generateOptions
│       └── progress.ts               # localStorage 读写 + 弱点追踪
├── components/
│   ├── MasteryView.tsx               # 融会贯通主页面（子路由分发）
│   ├── MasteryPathView.tsx           # 学习路径（方法树状图）
│   ├── MasteryPracticeView.tsx       # 练习页面（出题→答题→解析）
│   ├── MasteryLibraryView.tsx        # 方法库（浏览所有方法）
│   ├── MasteryProgressView.tsx       # 弱点追踪（进度+复习推荐）
│   ├── mastery/
│   │   ├── PathTree.tsx              # 路径树状图
│   │   ├── QuestionCard.tsx          # 题目卡片
│   │   ├── OptionButton.tsx          # 选项按钮
│   │   ├── ExplanationPanel.tsx      # 分步解析面板
│   │   ├── ProgressRing.tsx          # 进度环
│   │   └── TechniqueBadge.tsx        # 方法标签
│   ├── Header.tsx                    # 修改：新增导航 Tab
│   └── Home.tsx                      # 修改：新增 mastery view 渲染
```

---

## Task 1: 创建数据层 — 类型和工具函数

**Files:**
- Create: `src/data/mastery/types.ts`
- Create: `src/data/mastery/qgen/utils.ts`
- Create: `src/data/mastery/progress.ts`

- [ ] **Step 1: 创建 types.ts**

创建 `src/data/mastery/types.ts`：

```typescript
export interface Technique {
  id: string;
  grade: string;
  stage: '小学' | '中学' | '高中';
  name: string;
  summary: string;
  kou: string;
  steps: string[];
  prereq: string | null;
  fig?: string | null;
}

export interface Question {
  q: string;
  opts: string[];
  ans: number;
  level: number;
  explain: string;
  point: string;
  fig?: string | null;
}

export interface PracticeRecord {
  techniqueId: string;
  totalAttempts: number;
  correctCount: number;
  lastPracticedAt: number;
  weakPoints: string[];
}

export interface MasteryProgress {
  records: Record<string, PracticeRecord>;
  completedTechniques: string[];
}
```

- [ ] **Step 2: 创建 qgen/utils.ts**

创建 `src/data/mastery/qgen/utils.ts`：

```typescript
/** 生成 [min, max] 范围内的随机整数 */
export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 打乱数组（Fisher-Yates） */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 生成选项：正确答案 +干扰项，返回打乱后的选项和正确答案索引 */
export function generateOptions(
  correct: string,
  distractors: string[]
): { opts: string[]; ans: number } {
  const all = [correct, ...distractors];
  const shuffled = shuffle(all);
  const ans = shuffled.indexOf(correct);
  return { opts: shuffled, ans };
}

/** 生成数值型选项 */
export function generateNumOptions(
  answer: number,
  count: number = 4
): { opts: string[]; ans: number } {
  const distractors = new Set<string>();
  while (distractors.size < count - 1) {
    const offset = rand(1, Math.max(3, Math.floor(Math.abs(answer) * 0.3) + 1));
    const sign = Math.random() > 0.5 ? 1 : -1;
    const d = answer + sign * offset;
    if (d !== answer && d >= 0) {
      distractors.add(String(d));
    }
  }
  return generateOptions(String(answer), [...distractors]);
}
```

- [ ] **Step 3: 创建 progress.ts**

创建 `src/data/mastery/progress.ts`：

```typescript
import type { MasteryProgress, PracticeRecord } from '../types';

const STORAGE_KEY = 'math_mastery_progress';

export function loadProgress(): MasteryProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { records: {}, completedTechniques: [] };
}

export function saveProgress(progress: MasteryProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordAttempt(
  techniqueId: string,
  correct: boolean,
  point: string
): MasteryProgress {
  const progress = loadProgress();
  const record: PracticeRecord = progress.records[techniqueId] || {
    techniqueId,
    totalAttempts: 0,
    correctCount: 0,
    lastPracticedAt: 0,
    weakPoints: [],
  };

  record.totalAttempts++;
  if (correct) {
    record.correctCount++;
  } else {
    if (!record.weakPoints.includes(point)) {
      record.weakPoints.push(point);
    }
  }
  record.lastPracticedAt = Date.now();

  progress.records[techniqueId] = record;

  // 通关标准：正确率 >= 80% 且至少练习 5 次
  const accuracy = record.correctCount / record.totalAttempts;
  if (accuracy >= 0.8 && record.totalAttempts >= 5) {
    if (!progress.completedTechniques.includes(techniqueId)) {
      progress.completedTechniques.push(techniqueId);
    }
  }

  saveProgress(progress);
  return progress;
}

export function isTechniqueUnlocked(
  techniqueId: string,
  techniques: { id: string; prereq: string | null }[]
): boolean {
  const technique = techniques.find(t => t.id === techniqueId);
  if (!technique || !technique.prereq) return true;
  const progress = loadProgress();
  return progress.completedTechniques.includes(technique.prereq);
}

export function getWeakTechniques(): string[] {
  const progress = loadProgress();
  const weak: string[] = [];
  for (const [id, record] of Object.entries(progress.records)) {
    const accuracy = record.correctCount / record.totalAttempts;
    if (accuracy < 0.6) weak.push(id);
  }
  return weak;
}

export function getReviewTechniques(): string[] {
  const progress = loadProgress();
  const now = Date.now();
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  const review: string[] = [];
  for (const [id, record] of Object.entries(progress.records)) {
    if (now - record.lastPracticedAt > threeDays) {
      review.push(id);
    }
  }
  return review;
}
```

- [ ] **Step 4: 提交**

```bash
git add src/data/mastery/types.ts src/data/mastery/qgen/utils.ts src/data/mastery/progress.ts
git commit -m "feat(mastery): add types, qgen utils, and progress storage"
```

---

## Task 2: 移植出题引擎

**Files:**
- Create: `src/data/mastery/qgen/generators.ts`
- Create: `src/data/mastery/qgen/index.ts`

- [ ] **Step 1: 创建 generators.ts**

创建 `src/data/mastery/qgen/generators.ts`，移植 math-mastery 的 qgen_junior.js 和 qgen_high.js 中的所有出题函数。

每个函数返回一个 Question 对象，使用 utils 中的 rand/shuffle/generateOptions。

```typescript
import type { Question } from '../types';
import { rand, generateOptions, generateNumOptions } from './utils';

function Q(q: string, opts: string[], ans: number, level: number, explain: string, point: string): Question {
  return { q, opts, ans, level, explain, point };
}

// ========== 小学 ==========

function qCount(): Question {
  const n = rand(1, 20);
  const arr = Array.from({ length: n }, () => '●').join('');
  const { opts, ans } = generateNumOptions(n);
  return Q(
    `数一数，下图中有几个●？\n${arr}`,
    opts, ans, 1,
    `一个一个地数，一共有 ${n} 个。`,
    '数数与数位'
  );
}

function qAddSub(): Question {
  const a = rand(10, 50);
  const b = rand(10, 50);
  const isAdd = Math.random() > 0.5;
  const answer = isAdd ? a + b : a - b;
  const { opts, ans } = generateNumOptions(answer);
  return Q(
    `${a} ${isAdd ? '+' : '-'} ${b} = ？`,
    opts, ans, 1,
    isAdd
      ? `${a} + ${b} = ${answer}，先算个位，再算十位。`
      : `${a} - ${b} = ${answer}，注意退位。`,
    '100以内加减法'
  );
}

function qMulti(): Question {
  const a = rand(2, 9);
  const b = rand(2, 9);
  const answer = a * b;
  const { opts, ans } = generateNumOptions(answer);
  return Q(
    `${a} × ${b} = ？`,
    opts, ans, 1,
    `${a} × ${b} = ${answer}，口诀：${a < b ? '' : ''}${['','','二二得四','二三得六','二四得八','二五一十','二六十二','二七十四','二八十六','二七十八','三三得九','三四十二','三五十五','三六十八','三七二十一','三八二十四','三九二十七','四四十六','四五二十','四六二十四','四七二十八','四八三十二','四九三十五','五五二十五','五六三十','五七三十五','五八四十','五九三十六','六六三十六','六七四十二','六八四十八','六九五十七','七七四十八','七八五十六','七九六十三','八八六十四','八九七十二','九九八十一'][a * 10 + b] || ''}`,
    '乘法口诀'
  );
}

// ... 继续移植所有 70+ 个出题函数
// 每个方法对应一个 qXxx() 函数，保持参数化随机逻辑

export const GENERATORS: Record<string, () => Question> = {
  count: qCount,
  addsub: qAddSub,
  multi: qMulti,
  // ... 注册所有生成器
};
```

**移植要点**：
- 从 `js/qgen_junior.js` 移植小学 10 个方法
- 从 `js/qgen_high.js` 移植初中 15 个方法 + 高中 24 个方法 + 高阶 30+ 主题
- 保持随机参数范围不变
- 使用 `generateOptions` / `generateNumOptions` 替代原生的 opts 函数
- 保持 explain 和 point 文本不变

- [ ] **Step 2: 创建 qgen/index.ts**

```typescript
import type { Question } from '../types';
import { GENERATORS } from './generators';

export function generateQuestions(techniqueId: string, n: number = 6): Question[] {
  const gen = GENERATORS[techniqueId];
  if (!gen) return [];
  const out: Question[] = [];
  for (let i = 0; i < n; i++) {
    out.push(gen());
  }
  return out;
}

export function getSupportedTechniques(): string[] {
  return Object.keys(GENERATORS);
}
```

- [ ] **Step 3: 提交**

```bash
git add src/data/mastery/qgen/
git commit -m "feat(mastery): port qgen question generation engine"
```

---

## Task 3: 移植方法数据

**Files:**
- Create: `src/data/mastery/techniques.ts`

- [ ] **Step 1: 移植 techniques.ts**

从 math-mastery 的 `js/data.js` 中移植 `window.TECHNIQUES` 数组，保持字段不变：

```typescript
import type { Technique } from './types';

export const TECHNIQUES: Technique[] = [
  // ========== 小学 ==========
  {
    id: 'count',
    grade: '一年级',
    stage: '小学',
    name: '数数与数位',
    summary: '搞清数位顺序与计数单位，是全部运算的地基。',
    kou: '个十位，从右起；数位对齐再比较；满十进一要牢记。',
    steps: ['从 1 开始一个一个数', '满十进一', '看清数位顺序'],
    prereq: null,
  },
  {
    id: 'addsub',
    grade: '一年级',
    stage: '小学',
    name: '100以内加减法',
    summary: '掌握进位加法和退位减法。',
    kou: '个位对个位，十位对十位；进位别忘记，退位要仔细。',
    steps: ['对齐数位', '从个位算起', '进位/退位处理'],
    prereq: 'count',
  },
  // ... 继续移植所有 70+ 个方法
];

/** 按阶段分组 */
export function getTechniquesByStage(stage: '小学' | '中学' | '高中'): Technique[] {
  return TECHNIQUES.filter(t => t.stage === stage);
}

/** 获取学习路径（按 prereq 排序） */
export function getLearningPath(): Technique[] {
  const ordered: Technique[] = [];
  const map = new Map(TECHNIQUES.map(t => [t.id, t]));
  const visited = new Set<string>();

  function visit(t: Technique) {
    if (visited.has(t.id)) return;
    if (t.prereq && map.has(t.prereq)) {
      visit(map.get(t.prereq)!);
    }
    ordered.push(t);
    visited.add(t.id);
  }

  TECHNIQUES.forEach(visit);
  return ordered;
}

/** 根据 ID 查找 */
export function getTechniqueById(id: string): Technique | undefined {
  return TECHNIQUES.find(t => t.id === id);
}
```

- [ ] **Step 2: 提交**

```bash
git add src/data/mastery/techniques.ts
git commit -m "mastery: port 70+ technique definitions from math-mastery"
```

---

## Task 4: 创建 UI 组件

**Files (all created in this task):**
- `src/components/MasteryView.tsx`
- `src/components/MasteryPathView.tsx`
- `src/components/MasteryPracticeView.tsx`
- `src/components/MasteryLibraryView.tsx`
- `src/components/MasteryProgressView.tsx`
- `src/components/mastery/PathTree.tsx`
- `src/components/mastery/QuestionCard.tsx`
- `src/components/mastery/OptionButton.tsx`
- `src/components/mastery/ExplanationPanel.tsx`
- `src/components/mastery/ProgressRing.tsx`
- `src/components/mastery/TechniqueBadge.tsx`

- [ ] **Step 1: 创建基础组件**

**TechniqueBadge.tsx**:
```tsx
import type { Technique } from '../../data/mastery/types';

interface Props {
  technique: Technique;
  status: 'locked' | 'unlocked' | 'learning' | 'completed';
  onClick?: () => void;
}

export const TechniqueBadge: React.FC<Props> = ({ technique, status, onClick }) => {
  const base = 'px-3 py-1.5 rounded-full text-xs font-medium transition-all';
  const styles = {
    completed: 'bg-green-100 text-green-700 border border-green-200',
    learning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    unlocked: 'bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer hover:bg-blue-200',
    locked: 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60',
  };

  return (
    <span className={`${base} ${styles[status]}`} onClick={status !== 'locked' ? onClick : undefined}>
      {technique.name}
      {status === 'completed' && ' ✓'}
      {status === 'locked' && ' 🔒'}
    </span>
  );
};
```

**OptionButton.tsx**:
```tsx
interface Props {
  label: string;
  index: number;
  selected: boolean | null;
  correctIndex: number;
  onClick: () => void;
}

export const OptionButton: React.FC<Props> = ({ label, index, selected, correctIndex, onClick }) => {
  let cls = 'w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ';
  if (selected === null) {
    cls += 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer';
  } else if (index === correctIndex) {
    cls += 'border-green-500 bg-green-50 text-green-700 font-medium';
  } else if (index === selected) {
    cls += 'border-red-500 bg-red-50 text-red-700';
  } else {
    cls += 'border-gray-200 opacity-50';
  }

  return (
    <button className={cls} onClick={onClick} disabled={selected !== null}>
      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
      {label}
    </button>
  );
};
```

**ProgressRing.tsx**:
```tsx
interface Props {
  value: number;       // 0-100
  size?: number;
  strokeWidth?: number;
}

export const ProgressRing: React.FC<Props> = ({ value, size = 60, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none"
        stroke={value >= 80 ? '#22c55e' : value >= 60 ? '#eab308' : '#ef4444'}
        strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" className="transition-all duration-500" />
    </svg>
  );
};
```

**QuestionCard.tsx**:
```tsx
import type { Question } from '../../data/mastery/types';
import { OptionButton } from './OptionButton';

interface Props {
  question: Question;
  questionIndex: number;
  selected: number | null;
  onSelect: (index: number) => void;
}

export const QuestionCard: React.FC<Props> = ({ question, questionIndex, selected, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
          第 {questionIndex + 1} 题
        </span>
        <span className="text-xs text-gray-400">难度：{'⭐'.repeat(question.level)}</span>
      </div>
      <p className="text-gray-800 font-medium mb-4 whitespace-pre-line">{question.q}</p>
      <div className="space-y-2">
        {question.opts.map((opt, idx) => (
          <OptionButton key={idx} label={opt} index={idx} selected={selected}
            correctIndex={question.ans} onClick={() => onSelect(idx)} />
        ))}
      </div>
    </div>
  );
};
```

**ExplanationPanel.tsx**:
```tsx
import type { Question } from '../../data/mastery/types';

interface Props {
  question: Question;
  correct: boolean;
}

export const ExplanationPanel: React.FC<Props> = ({ question, correct }) => {
  return (
    <div className={`mt-4 rounded-xl p-4 border ${correct ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span>{correct ? '✅' : '❌'}</span>
        <span className="font-medium text-sm">{correct ? '回答正确！' : '回答错误'}</span>
      </div>
      <div className="text-sm text-gray-700">
        <p className="font-medium mb-1">📝 解析：</p>
        <p className="whitespace-pre-line">{question.explain}</p>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <span className="font-medium">得分点：</span>{question.point}
      </div>
    </div>
  );
};
```

**PathTree.tsx**:
```tsx
import type { Technique } from '../../data/mastery/types';
import { TechniqueBadge } from './TechniqueBadge';
import type { MasteryProgress } from '../../data/mastery/types';

interface Props {
  techniques: Technique[];
  progress: MasteryProgress;
  onSelect: (technique: Technique) => void;
}

export const PathTree: React.FC<Props> = ({ techniques, progress, onSelect }) => {
  const getStatus = (t: Technique): 'locked' | 'unlocked' | 'learning' | 'completed' => {
    if (progress.completedTechniques.includes(t.id)) return 'completed';
    if (t.prereq && !progress.completedTechniques.includes(t.prereq)) return 'locked';
    if (progress.records[t.id]) return 'learning';
    return 'unlocked';
  };

  const stages = ['小学', '中学', '高中'] as const;

  return (
    <div className="space-y-8">
      {stages.map(stage => {
        const items = techniques.filter(t => t.stage === stage);
        if (items.length === 0) return null;
        return (
          <div key={stage}>
            <h3 className="text-lg font-bold text-gray-800 mb-3">{stage}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map(t => (
                <TechniqueBadge key={t.id} technique={t} status={getStatus(t)}
                  onClick={() => getStatus(t) !== 'locked' && onSelect(t)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: 创建主页面组件**

**MasteryView.tsx**:
```tsx
import { useState } from 'react';
import { MasteryPathView } from './MasteryPathView';
import { MasteryPracticeView } from './MasteryPracticeView';
import { MasteryLibraryView } from './MasteryLibraryView';
import { MasteryProgressView } from './MasteryProgressView';
import type { Technique } from '../data/mastery/types';

type SubView = 'path' | 'practice' | 'library' | 'progress';

export const MasteryView: React.FC = () => {
  const [subView, setSubView] = useState<SubView>('path');
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);

  const handleSelectTechnique = (t: Technique) => {
    setSelectedTechnique(t);
    setSubView('practice');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">融会贯通</h1>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {([['path', '学习路径'], ['practice', '练习'], ['library', '方法库'], ['progress', '进度']] as [SubView, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setSubView(key)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${subView === key ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {subView === 'path' && <MasteryPathView onSelect={handleSelectTechnique} />}
        {subView === 'practice' && <MasteryPracticeView technique={selectedTechnique} />}
        {subView === 'library' && <MasteryLibraryView onSelect={handleSelectTechnique} />}
        {subView === 'progress' && <MasteryProgressView />}
      </div>
    </div>
  );
};
```

**MasteryPathView.tsx**:
```tsx
import { useState, useEffect } from 'react';
import { TECHNIQUES } from '../../data/mastery/techniques';
import { loadProgress } from '../../data/mastery/progress';
import type { Technique, MasteryProgress } from '../../data/mastery/types';
import { PathTree } from './mastery/PathTree';

interface Props {
  onSelect: (technique: Technique) => void;
}

export const MasteryPathView: React.FC<Props> = ({ onSelect }) => {
  const [progress, setProgress] = useState<MasteryProgress>({ records: {}, completedTechniques: [] });

  useEffect(() => { setProgress(loadProgress()); }, []);

  return (
    <div>
      <p className="text-gray-500 mb-6">按依赖关系排列的学习路径。完成前置方法后才能解锁下一个。</p>
      <PathTree techniques={TECHNIQUES} progress={progress} onSelect={onSelect} />
    </div>
  );
};
```

**MasteryPracticeView.tsx**:
```tsx
import { useState, useEffect, useCallback } from 'react';
import type { Technique, Question } from '../../data/mastery/types';
import { generateQuestions } from '../../data/mastery/qgen';
import { recordAttempt } from '../../data/mastery/progress';
import { QuestionCard } from './mastery/QuestionCard';
import { ExplanationPanel } from './mastery/ExplanationPanel';

interface Props {
  technique: Technique | null;
}

export const MasteryPracticeView: React.FC<Props> = ({ technique }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (technique) {
      setQuestions(generateQuestions(technique.id, 6));
      setCurrentIdx(0);
      setSelected(null);
      setCorrectCount(0);
      setShowExplanation(false);
      setFinished(false);
    }
  }, [technique]);

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null || !questions[currentIdx]) return;
    setSelected(idx);
    setShowExplanation(true);
    const correct = idx === questions[currentIdx].ans;
    if (correct) setCorrectCount(prev => prev + 1);
    if (technique) {
      recordAttempt(technique.id, correct, questions[currentIdx].point);
    }
  }, [selected, questions, currentIdx, technique]);

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  if (!technique) {
    return <div className="text-center py-12 text-gray-400">请从学习路径或方法库中选择一个方法开始练习</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center py-12 text-gray-400">该方法的出题引擎尚未就绪，敬请期待</div>;
  }

  if (finished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">{accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}</div>
        <h3 className="text-xl font-bold mb-2">练习完成！</h3>
        <p className="text-gray-600 mb-4">正确率：{correctCount}/{questions.length}（{accuracy}%）</p>
        <p className="text-sm text-gray-400 mb-6">
          {accuracy >= 80 ? '恭喜通关！可以继续下一个方法了。' : '继续加油，多练习几次就能通关！'}
        </p>
        <button onClick={() => { setQuestions(generateQuestions(technique.id, 6)); setCurrentIdx(0); setSelected(null); setCorrectCount(0); setFinished(false); setShowExplanation(false); }}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          再练一组
        </button>
      </div>
    );
  }

  const current = questions[currentIdx];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{technique.name}</span>
        <span className="text-sm text-gray-400">{currentIdx + 1} / {questions.length}</span>
      </div>
      <QuestionCard question={current} questionIndex={currentIdx} selected={selected} onSelect={handleSelect} />
      {showExplanation && (
        <>
          <ExplanationPanel question={current} correct={selected === current.ans} />
          <button onClick={handleNext}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">
            {currentIdx + 1 >= questions.length ? '查看结果' : '下一题'}
          </button>
        </>
      )}
    </div>
  );
};
```

**MasteryLibraryView.tsx**:
```tsx
import { useState } from 'react';
import { TECHNIQUES, getTechniquesByStage } from '../../data/mastery/techniques';
import type { Technique } from '../../data/mastery/types';

interface Props {
  onSelect: (technique: Technique) => void;
}

export const MasteryLibraryView: React.FC<Props> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('');

  const filtered = TECHNIQUES.filter(t => {
    if (stageFilter && t.stage !== stageFilter) return false;
    if (search && !t.name.includes(search) && !t.summary.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="text" placeholder="搜索方法..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">全部</option>
          <option value="小学">小学</option>
          <option value="中学">中学</option>
          <option value="高中">高中</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(t => (
          <button key={t.id} onClick={() => onSelect(t)}
            className="text-left bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{t.grade}</span>
              <span className="font-medium text-gray-900">{t.name}</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{t.summary}</p>
            {t.kou && <p className="text-xs text-amber-600 mt-2 italic">"{t.kou}"</p>}
          </button>
        ))}
      </div>
    </div>
  );
};
```

**MasteryProgressView.tsx**:
```tsx
import { useState, useEffect } from 'react';
import { loadProgress, getWeakTechniques, getReviewTechniques } from '../../data/mastery/progress';
import { TECHNIQUES } from '../../data/mastery/techniques';
import type { MasteryProgress } from '../../data/mastery/types';
import { ProgressRing } from './mastery/ProgressRing';

export const MasteryProgressView: React.FC = () => {
  const [progress, setProgress] = useState<MasteryProgress>({ records: {}, completedTechniques: [] });

  useEffect(() => { setProgress(loadProgress()); }, []);

  const weak = getWeakTechniques();
  const review = getReviewTechniques();
  const totalMastered = progress.completedTechniques.length;
  const totalTechniques = TECHNIQUES.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6">
        <ProgressRing value={Math.round((totalMastered / totalTechniques) * 100)} size={80} />
        <div>
          <p className="text-2xl font-bold text-gray-900">{totalMastered} / {totalTechniques}</p>
          <p className="text-sm text-gray-500">已通关方法</p>
        </div>
      </div>

      {weak.length > 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
          <h3 className="font-bold text-red-800 mb-2">⚠️ 薄弱方法（正确率 &lt; 60%）</h3>
          <div className="flex flex-wrap gap-2">
            {weak.map(id => {
              const t = TECHNIQUES.find(x => x.id === id);
              return t ? <span key={id} className="px-2 py-1 bg-white rounded text-xs text-red-700">{t.name}</span> : null;
            })}
          </div>
        </div>
      )}

      {review.length > 0 && (
        <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-4">
          <h3 className="font-bold text-yellow-800 mb-2">🔄 需要复习（3天未练习）</h3>
          <div className="flex flex-wrap gap-2">
            {review.map(id => {
              const t = TECHNIQUES.find(x => x.id === id);
              return t ? <span key={id} className="px-2 py-1 bg-white rounded text-xs text-yellow-700">{t.name}</span> : null;
            })}
          </div>
        </div>
      )}

      {totalMastered === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>还没有练习记录，快去学习路径开始第一个方法吧！</p>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 3: 提交**

```bash
git add src/components/MasteryView.tsx src/components/MasteryPathView.tsx src/components/MasteryPracticeView.tsx src/components/MasteryLibraryView.tsx src/components/MasteryProgressView.tsx src/components/mastery/
git commit -m "feat(mastery): add MasteryView and all sub-components"
```

---

## Task 5: 导航集成

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Home.tsx`
- Modify: `src/data/types.ts` (ViewType union)

- [ ] **Step 1: 更新 ViewType**

在 `src/data/types.ts` 中 ViewType union 新增 `'mastery'`。

- [ ] **Step 2: 更新 Header.tsx**

在导航按钮列表中新增：
```tsx
{ key: 'mastery', label: '融会贯通', icon: '🧠' }
```

- [ ] **Step 3: 更新 Home.tsx**

新增 import 和渲染分支：
```tsx
import { MasteryView } from './MasteryView';
// ...
{currentView === 'mastery' && <MasteryView />}
```

- [ ] **Step 4: 提交**

```bash
git add src/data/types.ts src/components/Header.tsx src/components/Home.tsx
git commit -m "feat(mastery): integrate mastery tab into navigation"
```

---

## Task 6: 验收测试

- [ ] **Step 1: 类型检查**
```bash
npx tsc --noEmit
```

- [ ] **Step 2: 构建**
```bash
npx vite build
```

- [ ] **Step 3: 功能验证**
- [ ] Header 显示「融会贯通」Tab
- [ ] 学习路径页正确显示方法树状图
- [ ] 方法库可搜索和筛选
- [ ] 选择方法后能生成 6 道随机题
- [ ] 答题→反馈→解析流程完整
- [ ] 进度页显示正确率和弱点
- [ ] 未通关的前置方法正确锁定
- [ ] localStorage 持久化正常
- [ ] 现有功能不受影响

---

## 实施顺序总结

| 顺序 | Task | 内容 |
|------|------|------|
| 1 | Task 1 | 数据层基础（类型 + 工具 + 进度存储） |
| 2 | Task 2 | 出题引擎移植 |
| 3 | Task 3 | 70+ 方法数据移植 |
| 4 | Task 4 | UI 组件 |
| 5 | Task 5 | 导航集成 |
| 6 | Task 6 | 验收测试 |
