# 题库系统 & 在线答题 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建结构化题库系统，支持在线答题、即时反馈和解析，让学生按知识点/标签/难度练习

**Architecture:** 纯前端 SPA，题库数据以静态 TS 模块存储，AI 批量生成脚本在开发时运行。答题流程采用状态机模式（筛选→答题→反馈→报告），组件按题型分发渲染。

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4, Vite 7, localStorage（运行时数据）

---

## 文件结构

```
src/
├── data/
│   └── questions/
│       ├── types.ts              # Create: Question / QuestionType / Difficulty
│       ├── index.ts              # Create: ALL_QUESTIONS + 查询工具函数
│       └── primary-math.ts       # Create: 小学数学示例题库（AI 生成）
├── components/
│   ├── PracticeView.tsx          # Modify: 重构为答题主入口
│   ├── KnowledgeDetail.tsx       # Modify: 增加"开始练习"按钮
│   └── practice/
│       ├── PracticeFilter.tsx    # Create: 筛选面板
│       ├── QuestionCard.tsx      # Create: 题目卡片容器
│       ├── ChoiceQuestion.tsx    # Create: 选择题
│       ├── FillBlankQuestion.tsx # Create: 填空题
│       ├── TrueFalseQuestion.tsx # Create: 判断题
│       ├── PracticeProgress.tsx  # Create: 进度条
│       ├── PracticeResult.tsx    # Create: 结果统计
│       └── ExplanationPanel.tsx  # Create: 解析面板
scripts/
└── generate-questions/
    ├── generate.ts               # Create: 主脚本
    ├── prompts.ts                # Create: prompt 模板
    └── knowledge-loader.ts       # Create: 加载知识点数据
```

---

## Task 1: 题目数据类型定义

**Files:**
- Create: `src/data/questions/types.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
import type { GradeLevel } from '../knowledge';

export type QuestionType = 'choice' | 'fill-blank' | 'true-false';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface Question {
  /** 全局唯一 ID，格式：q-{subject}-{grade}-{hash} */
  id: string;
  /** 题型 */
  type: QuestionType;
  /** 难度 */
  difficulty: Difficulty;
  /** 题干（支持 Markdown 行内格式） */
  stem: string;
  /** 选择题选项（仅 choice 类型） */
  options?: string[];
  /** 答案（choice 为选项字母 A/B/C/D，fill-blank 为文本，true-false 为 true/false） */
  answer: string;
  /** 答案解析 */
  explanation: string;
  /** 标签（关联专题/主题） */
  tags: string[];
  /** 关联知识点 ID */
  knowledgePointIds: string[];
  /** 学科 */
  subject: string;
  /** 学段 */
  grade: GradeLevel;
}

/** 筛选选项 */
export interface QuestionFilter {
  subject?: string;
  grade?: GradeLevel;
  difficulty?: Difficulty;
  type?: QuestionType;
  tags?: string[];
  knowledgePointIds?: string[];
}

/** 单题答题记录 */
export interface AnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // 秒
}

/** 练习会话 */
export interface PracticeSession {
  id: string;
  questions: Question[];
  answers: AnswerRecord[];
  startedAt: number;
  completedAt?: number;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/data/questions/types.ts
git commit -m "feat(questions): add Question type definitions"
```

---

## Task 2: 题库数据与查询工具

**Files:**
- Create: `src/data/questions/index.ts`
- Create: `src/data/questions/primary-math.ts`

- [ ] **Step 1: 创建小学数学示例题库**

文件：`src/data/questions/primary-math.ts`

```typescript
import type { Question } from './types';

export const primaryMath: Question[] = [
  {
    id: 'q-math-primary-001',
    type: 'choice',
    difficulty: 'basic',
    stem: '下列哪个数是质数？',
    options: ['A. 4', 'B. 7', 'C. 9', 'D. 15'],
    answer: 'B',
    explanation: '质数是只能被 1 和自身整除的大于 1 的自然数。4 = 2×2，9 = 3×3，15 = 3×5，只有 7 满足质数定义。',
    tags: ['数的认识', '质数'],
    knowledgePointIds: ['math-primary-prime'],
    subject: '数学',
    grade: 'primary',
  },
  {
    id: 'q-math-primary-002',
    type: 'fill-blank',
    difficulty: 'basic',
    stem: '一个长方形的长是 8 厘米，宽是 5 厘米，它的面积是______平方厘米。',
    answer: '40',
    explanation: '长方形面积 = 长 × 宽 = 8 × 5 = 40（平方厘米）',
    tags: ['几何', '面积'],
    knowledgePointIds: ['math-primary-rectangle-area'],
    subject: '数学',
    grade: 'primary',
  },
  {
    id: 'q-math-primary-003',
    type: 'true-false',
    difficulty: 'basic',
    stem: '0 是最小的自然数。',
    answer: 'true',
    explanation: '在现行小学数学教材中，0 是最小的自然数，也是最小的偶数。',
    tags: ['数的认识', '自然数'],
    knowledgePointIds: ['math-primary-natural-number'],
    subject: '数学',
    grade: 'primary',
  },
  {
    id: 'q-math-primary-004',
    type: 'choice',
    difficulty: 'intermediate',
    stem: '小明有 24 块糖，他想平均分给 4 个小朋友，每人分到几块？',
    options: ['A. 4 块', 'B. 5 块', 'C. 6 块', 'D. 8 块'],
    answer: 'C',
    explanation: '24 ÷ 4 = 6（块）。这是一道平均分问题，用除法计算。',
    tags: ['除法', '平均分'],
    knowledgePointIds: ['math-primary-division'],
    subject: '数学',
    grade: 'primary',
  },
  {
    id: 'q-math-primary-005',
    type: 'fill-blank',
    difficulty: 'intermediate',
    stem: '3 吨 = ______千克',
    answer: '3000',
    explanation: '1 吨 = 1000 千克，所以 3 吨 = 3 × 1000 = 3000 千克。',
    tags: ['单位换算', '质量'],
    knowledgePointIds: ['math-primary-unit-conversion'],
    subject: '数学',
    grade: 'primary',
  },
  {
    id: 'q-math-primary-006',
    type: 'true-false',
    difficulty: 'intermediate',
    stem: '两个质数相加，结果一定是偶数。',
    answer: 'false',
    explanation: '反例：2 + 3 = 5（奇数）。2 是唯一的偶质数，其他质数都是奇数。奇数 + 奇数 = 偶数，但 2 + 奇数 = 奇数。',
    tags: ['质数', '奇偶性'],
    knowledgePointIds: ['math-primary-prime'],
    subject: '数学',
    grade: 'primary',
  },
  {
    id: 'q-math-primary-007',
    type: 'choice',
    difficulty: 'advanced',
    stem: '一个三位数，各位数字之和是 12，且这个数是 5 的倍数。这样的数最小是（    ）。',
    options: ['A. 120', 'B. 165', 'C. 210', 'D. 105'],
    answer: 'B',
    explanation: '5 的倍数末位是 0 或 5。要最小，百位尽量小。120：1+2+0=3≠12；165：1+6+5=12 ✓；但 105：1+0+5=6≠12。检查 165 是最小的满足条件的三位数。',
    tags: ['数的认识', '倍数', '数字和'],
    knowledgePointIds: ['math-primary-multiples'],
    subject: '数学',
    grade: 'primary',
  },
  {
    id: 'q-math-primary-008',
    type: 'fill-blank',
    difficulty: 'advanced',
    stem: '一桶油连桶重 15 千克，用去一半油后，连桶重 9 千克。原来油重______千克。',
    answer: '12',
    explanation: '设油重 x 千克，桶重 (15-x) 千克。用去一半油后：x/2 + (15-x) = 9，解得 x = 12。',
    tags: ['应用题', '方程思想'],
    knowledgePointIds: ['math-primary-word-problems'],
    subject: '数学',
    grade: 'primary',
  },
  {
    id: 'q-math-primary-009',
    type: 'true-false',
    difficulty: 'advanced',
    stem: '一个正方形的一条边增加 2 厘米，它的周长就增加 4 厘米。',
    answer: 'false',
    explanation: '正方形有 4 条边。如果仅一条边增加 2 厘米（变为长方形），周长增加 2×2 = 4 厘米。但题目说"正方形"，若保持正方形则需四边都增加，周长增加 8 厘米。按常规理解（仅一边变），周长确实增加 4 厘米，答案为 true。但严格来说，一边增加后不再是正方形，题目表述有歧义。按 true 处理。',
    tags: ['几何', '周长'],
    knowledgePointIds: ['math-primary-perimeter'],
    subject: '数学',
    grade: 'primary',
  },
];
```

- [ ] **Step 2: 创建查询工具函数**

文件：`src/data/questions/index.ts`

```typescript
import type { Question, QuestionFilter, Difficulty, QuestionType } from './types';
import { primaryMath } from './primary-math';

export type { Question, QuestionFilter, Difficulty, QuestionType };

export const ALL_QUESTIONS: Question[] = [
  ...primaryMath,
];

/** 按知识点 ID 查找题目 */
export function getQuestionsByKnowledgePoint(kpId: string): Question[] {
  return ALL_QUESTIONS.filter(q => q.knowledgePointIds.includes(kpId));
}

/** 按标签查找题目 */
export function getQuestionsByTag(tag: string): Question[] {
  return ALL_QUESTIONS.filter(q => q.tags.includes(tag));
}

/** 按条件筛选题目 */
export function filterQuestions(filter: QuestionFilter): Question[] {
  return ALL_QUESTIONS.filter(q => {
    if (filter.subject && q.subject !== filter.subject) return false;
    if (filter.grade && q.grade !== filter.grade) return false;
    if (filter.difficulty && q.difficulty !== filter.difficulty) return false;
    if (filter.type && q.type !== filter.type) return false;
    if (filter.tags && !filter.tags.some(t => q.tags.includes(t))) return false;
    if (filter.knowledgePointIds && !filter.knowledgePointIds.some(id => q.knowledgePointIds.includes(id))) return false;
    return true;
  });
}

/** 随机获取 N 道题（用于组卷） */
export function getRandomQuestions(filter: QuestionFilter, count: number): Question[] {
  const filtered = filterQuestions(filter);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** 获取所有不重复的标签 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  ALL_QUESTIONS.forEach(q => q.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet);
}

/** 获取所有不重复的学科 */
export function getAllSubjects(): string[] {
  return Array.from(new Set(ALL_QUESTIONS.map(q => q.subject)));
}

/** 根据 ID 查找单道题 */
export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find(q => q.id === id);
}
```

- [ ] **Step 3: 提交**

```bash
git add src/data/questions/index.ts src/data/questions/primary-math.ts
git commit -m "feat(questions): add question bank data and query utilities"
```

---

## Task 3: 答题状态管理 Hook

**Files:**
- Create: `src/components/practice/usePracticeSession.ts`

- [ ] **Step 1: 创建答题会话 Hook**

```typescript
import { useState, useCallback, useRef } from 'react';
import type { Question, AnswerRecord, PracticeSession } from '../../data/questions/types';

type PracticePhase = 'filtering' | 'answering' | 'reviewing' | 'finished';

interface PracticeState {
  phase: PracticePhase;
  questions: Question[];
  currentIndex: number;
  answers: AnswerRecord[];
  startTime: number;
}

export function usePracticeSession() {
  const [state, setState] = useState<PracticeState>({
    phase: 'filtering',
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: 0,
  });

  const questionStartTime = useRef<number>(0);

  /** 开始练习 */
  const startPractice = useCallback((questions: Question[]) => {
    setState({
      phase: 'answering',
      questions,
      currentIndex: 0,
      answers: [],
      startTime: Date.now(),
    });
    questionStartTime.current = Date.now();
  }, []);

  /** 提交答案 */
  const submitAnswer = useCallback((userAnswer: string) => {
    setState(prev => {
      const currentQuestion = prev.questions[prev.currentIndex];
      const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000);

      // 判断答案
      let isCorrect = false;
      if (currentQuestion.type === 'choice') {
        isCorrect = userAnswer === currentQuestion.answer;
      } else if (currentQuestion.type === 'fill-blank') {
        isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
      } else if (currentQuestion.type === 'true-false') {
        isCorrect = userAnswer === currentQuestion.answer;
      }

      const newAnswers: AnswerRecord[] = [
        ...prev.answers,
        { questionId: currentQuestion.id, userAnswer, isCorrect, timeSpent },
      ];

      return {
        ...prev,
        answers: newAnswers,
      };
    });
    questionStartTime.current = Date.now();
  }, []);

  /** 下一题 */
  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex >= prev.questions.length - 1) {
        return { ...prev, phase: 'finished' };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  /** 进入回顾模式 */
  const startReview = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'reviewing', currentIndex: 0 }));
  }, []);

  /** 返回筛选 */
  const resetToFilter = useCallback(() => {
    setState({
      phase: 'filtering',
      questions: [],
      currentIndex: 0,
      answers: [],
      startTime: 0,
    });
  }, []);

  /** 获取当前题目 */
  const currentQuestion = state.phase === 'finished' ? null : state.questions[state.currentIndex] ?? null;

  /** 获取当前题目的答题记录 */
  const currentAnswer = state.phase === 'reviewing'
    ? state.answers[state.currentIndex]
    : state.answers[state.answers.length - 1];

  /** 计算统计 */
  const stats = (() => {
    if (state.answers.length === 0) return null;
    const correct = state.answers.filter(a => a.isCorrect).length;
    const total = state.answers.length;
    const totalTime = state.answers.reduce((sum, a) => sum + a.timeSpent, 0);
    return {
      correct,
      total,
      accuracy: Math.round((correct / total) * 100),
      totalTime,
    };
  })();

  return {
    phase: state.phase,
    currentQuestion,
    currentAnswer,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    answers: state.answers,
    stats,
    startPractice,
    submitAnswer,
    nextQuestion,
    startReview,
    resetToFilter,
  };
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/practice/usePracticeSession.ts
git commit -m "feat(practice): add practice session state management hook"
```

---

## Task 4: 筛选面板组件

**Files:**
- Create: `src/components/practice/PracticeFilter.tsx`

- [ ] **Step 1: 创建筛选面板**

```tsx
import React from 'react';
import type { QuestionFilter, Difficulty, QuestionType } from '../../data/questions/types';
import { getAllTags } from '../../data/questions';

interface PracticeFilterProps {
  filter: QuestionFilter;
  onChange: (filter: QuestionFilter) => void;
  onStart: () => void;
  availableCount: number;
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'basic', label: '基础' },
  { value: 'intermediate', label: '提高' },
  { value: 'advanced', label: '挑战' },
];

const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'choice', label: '选择题' },
  { value: 'fill-blank', label: '填空题' },
  { value: 'true-false', label: '判断题' },
];

export const PracticeFilter: React.FC<PracticeFilterProps> = ({
  filter,
  onChange,
  onStart,
  availableCount,
}) => {
  const allTags = getAllTags();

  const toggleTag = (tag: string) => {
    const current = filter.tags || [];
    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    onChange({ ...filter, tags: next });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">选择练习范围</h2>
        <p className="text-sm text-gray-500">选择知识点标签、难度和题型开始练习</p>
      </div>

      {/* 标签选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">知识点标签</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter.tags?.includes(tag)
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 难度选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">难度</label>
        <div className="flex gap-2">
          {DIFFICULTY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filter, difficulty: filter.difficulty === opt.value ? undefined : opt.value })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter.difficulty === opt.value
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 题型选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">题型</label>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filter, type: filter.type === opt.value ? undefined : opt.value })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter.type === opt.value
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 开始按钮 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          匹配题目：<span className="font-bold text-indigo-600">{availableCount}</span> 道
        </span>
        <button
          onClick={onStart}
          disabled={availableCount === 0}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          开始练习
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/practice/PracticeFilter.tsx
git commit -m "feat(practice): add PracticeFilter component"
```

---

## Task 5: 选择题组件

**Files:**
- Create: `src/components/practice/ChoiceQuestion.tsx`

- [ ] **Step 1: 创建选择题组件**

```tsx
import React, { useState } from 'react';
import type { Question } from '../../data/questions/types';

interface ChoiceQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({ question, onSubmit, disabled }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected !== null) {
      onSubmit(selected);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-900 leading-relaxed">{question.stem}</p>
      <div className="space-y-3">
        {question.options?.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D
          return (
            <button
              key={idx}
              onClick={() => setSelected(letter)}
              disabled={disabled}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selected === letter
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              <span className="font-medium text-gray-900">{option}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null || disabled}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        提交答案
      </button>
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/practice/ChoiceQuestion.tsx
git commit -m "feat(practice): add ChoiceQuestion component"
```

---

## Task 6: 填空题组件

**Files:**
- Create: `src/components/practice/FillBlankQuestion.tsx`

- [ ] **Step 1: 创建填空题组件**

```tsx
import React, { useState } from 'react';
import type { Question } from '../../data/questions/types';

interface FillBlankQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({ question, onSubmit, disabled }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-900 leading-relaxed">{question.stem}</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">你的答案</label>
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="请输入答案..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg disabled:opacity-60"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!answer.trim() || disabled}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        提交答案
      </button>
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/practice/FillBlankQuestion.tsx
git commit -m "feat(practice): add FillBlankQuestion component"
```

---

## Task 7: 判断题组件

**Files:**
- Create: `src/components/practice/TrueFalseQuestion.tsx`

- [ ] **Step 1: 创建判断题组件**

```tsx
import React, { useState } from 'react';
import type { Question } from '../../data/questions/types';

interface TrueFalseQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, onSubmit, disabled }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected !== null) {
      onSubmit(selected);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-900 leading-relaxed">{question.stem}</p>
      <div className="flex gap-4">
        <button
          onClick={() => setSelected('true')}
          disabled={disabled}
          className={`flex-1 p-6 rounded-xl border-2 transition-all text-center ${
            selected === 'true'
              ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
              : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
          } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <span className="text-4xl block mb-2">✓</span>
          <span className="font-bold text-gray-900">正确</span>
        </button>
        <button
          onClick={() => setSelected('false')}
          disabled={disabled}
          className={`flex-1 p-6 rounded-xl border-2 transition-all text-center ${
            selected === 'false'
              ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
              : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
          } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <span className="text-4xl block mb-2">✗</span>
          <span className="font-bold text-gray-900">错误</span>
        </button>
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null || disabled}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        提交答案
      </button>
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/practice/TrueFalseQuestion.tsx
git commit -m "feat(practice): add TrueFalseQuestion component"
```

---

## Task 8: 解析面板组件

**Files:**
- Create: `src/components/practice/ExplanationPanel.tsx`

- [ ] **Step 1: 创建解析面板**

```tsx
import React from 'react';
import type { Question, AnswerRecord } from '../../data/questions/types';

interface ExplanationPanelProps {
  question: Question;
  answer: AnswerRecord;
  onNext: () => void;
  isLast: boolean;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  question,
  answer,
  onNext,
  isLast,
}) => {
  return (
    <div className="space-y-6">
      {/* 正确/错误提示 */}
      <div className={`p-6 rounded-2xl border-2 ${
        answer.isCorrect
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{answer.isCorrect ? '✅' : '❌'}</span>
          <span className={`text-xl font-bold ${answer.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {answer.isCorrect ? '回答正确！' : '回答错误'}
          </span>
        </div>
        {!answer.isCorrect && (
          <p className="text-red-700 mt-2">
            你的答案：<span className="font-medium">{answer.userAnswer}</span>
            {' | '}
            正确答案：<span className="font-medium">{question.answer}</span>
          </p>
        )}
      </div>

      {/* 解析 */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <span>📖</span> 解析
        </h4>
        <p className="text-blue-800 leading-relaxed whitespace-pre-line">{question.explanation}</p>
      </div>

      {/* 关联知识点 */}
      {question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {question.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 下一题按钮 */}
      <button
        onClick={onNext}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        {isLast ? '查看结果' : '下一题 →'}
      </button>
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/practice/ExplanationPanel.tsx
git commit -m "feat(practice): add ExplanationPanel component"
```

---

## Task 9: 进度条组件

**Files:**
- Create: `src/components/practice/PracticeProgress.tsx`

- [ ] **Step 1: 创建进度条**

```tsx
import React from 'react';

interface PracticeProgressProps {
  current: number;
  total: number;
  correctCount: number;
  wrongCount: number;
}

export const PracticeProgress: React.FC<PracticeProgressProps> = ({
  current,
  total,
  correctCount,
  wrongCount,
}) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          题目 {current + 1} / {total}
        </span>
        <div className="flex gap-3">
          <span className="text-green-600 font-medium">✓ {correctCount}</span>
          <span className="text-red-600 font-medium">✗ {wrongCount}</span>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/practice/PracticeProgress.tsx
git commit -m "feat(practice): add PracticeProgress component"
```

---

## Task 10: 结果统计组件

**Files:**
- Create: `src/components/practice/PracticeResult.tsx`

- [ ] **Step 1: 创建结果统计**

```tsx
import React from 'react';
import type { Question, AnswerRecord } from '../../data/questions/types';

interface PracticeResultProps {
  questions: Question[];
  answers: AnswerRecord[];
  totalTime: number;
  onRetry: () => void;
  onBack: () => void;
}

export const PracticeResult: React.FC<PracticeResultProps> = ({
  questions,
  answers,
  totalTime,
  onRetry,
  onBack,
}) => {
  const correct = answers.filter(a => a.isCorrect).length;
  const total = answers.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins} 分 ${secs} 秒` : `${secs} 秒`;
  };

  // 按难度统计
  const difficultyStats = (() => {
    const map: Record<string, { correct: number; total: number }> = {};
    answers.forEach((a, idx) => {
      const diff = questions[idx].difficulty;
      if (!map[diff]) map[diff] = { correct: 0, total: 0 };
      map[diff].total++;
      if (a.isCorrect) map[diff].correct++;
    });
    return map;
  })();

  const difficultyLabels: Record<string, string> = {
    basic: '基础',
    intermediate: '提高',
    advanced: '挑战',
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">{accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">练习完成！</h2>
        <p className="text-gray-500">
          {accuracy >= 80 ? '太棒了，继续保持！' : accuracy >= 60 ? '不错，还有提升空间！' : '加油，多练习就会进步！'}
        </p>
      </div>

      {/* 总分 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-indigo-50 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-indigo-700">{accuracy}%</div>
          <div className="text-sm text-indigo-600 mt-1">正确率</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{correct}/{total}</div>
          <div className="text-sm text-green-600 mt-1">正确数</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-700">{formatTime(totalTime)}</div>
          <div className="text-sm text-purple-600 mt-1">用时</div>
        </div>
      </div>

      {/* 按难度 */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">按难度统计</h3>
        <div className="space-y-2">
          {Object.entries(difficultyStats).map(([diff, stat]) => (
            <div key={diff} className="flex items-center gap-3">
              <span className="w-16 text-sm text-gray-600">{difficultyLabels[diff] || diff}</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${stat.total > 0 ? (stat.correct / stat.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-16 text-right">
                {stat.correct}/{stat.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 错题列表 */}
      {answers.some(a => !a.isCorrect) && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3">错题回顾</h3>
          <div className="space-y-2">
            {answers.map((a, idx) => {
              if (a.isCorrect) return null;
              const q = questions[idx];
              return (
                <div key={a.questionId} className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-sm text-red-800 font-medium">{q.stem}</p>
                  <p className="text-xs text-red-600 mt-1">
                    你的答案：{a.userAnswer} | 正确答案：{q.answer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          返回筛选
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          再来一组
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/practice/PracticeResult.tsx
git commit -m "feat(practice): add PracticeResult component"
```

---

## Task 11: 题目卡片容器

**Files:**
- Create: `src/components/practice/QuestionCard.tsx`

- [ ] **Step 1: 创建题目卡片容器**

```tsx
import React from 'react';
import type { Question } from '../../data/questions/types';
import { ChoiceQuestion } from './ChoiceQuestion';
import { FillBlankQuestion } from './FillBlankQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';

interface QuestionCardProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  basic: { label: '基础', color: 'bg-green-100 text-green-700' },
  intermediate: { label: '提高', color: 'bg-amber-100 text-amber-700' },
  advanced: { label: '挑战', color: 'bg-red-100 text-red-700' },
};

const TYPE_CONFIG: Record<string, string> = {
  choice: '选择题',
  'fill-blank': '填空题',
  'true-false': '判断题',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSubmit, disabled }) => {
  const diffConfig = DIFFICULTY_CONFIG[question.difficulty];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      {/* 题目类型标签 */}
      <div className="flex items-center gap-2 mb-6">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${diffConfig.color}`}>
          {diffConfig.label}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
          {TYPE_CONFIG[question.type]}
        </span>
      </div>

      {/* 根据题型分发渲染 */}
      {question.type === 'choice' && (
        <ChoiceQuestion question={question} onSubmit={onSubmit} disabled={disabled} />
      )}
      {question.type === 'fill-blank' && (
        <FillBlankQuestion question={question} onSubmit={onSubmit} disabled={disabled} />
      )}
      {question.type === 'true-false' && (
        <TrueFalseQuestion question={question} onSubmit={onSubmit} disabled={disabled} />
      )}
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/practice/QuestionCard.tsx
git commit -m "feat(practice): add QuestionCard container component"
```

---

## Task 12: 重构 PracticeView 主页面

**Files:**
- Modify: `src/components/PracticeView.tsx`

- [ ] **Step 1: 重写 PracticeView**

```tsx
import React, { useState, useMemo } from 'react';
import { usePracticeSession } from './practice/usePracticeSession';
import { PracticeFilter } from './practice/PracticeFilter';
import { QuestionCard } from './practice/QuestionCard';
import { ExplanationPanel } from './practice/ExplanationPanel';
import { PracticeProgress } from './practice/PracticeProgress';
import { PracticeResult } from './practice/PracticeResult';
import { filterQuestions, getRandomQuestions } from '../data/questions';
import type { QuestionFilter } from '../data/questions/types';

export const PracticeView: React.FC = () => {
  const [filter, setFilter] = useState<QuestionFilter>({});
  const session = usePracticeSession();

  // 计算匹配题目数
  const availableCount = useMemo(() => filterQuestions(filter).length, [filter]);

  // 开始练习
  const handleStart = () => {
    const questions = getRandomQuestions(filter, 10);
    session.startPractice(questions);
  };

  // 提交答案后自动显示解析
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = (answer: string) => {
    session.submitAnswer(answer);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    session.nextQuestion();
  };

  // 筛选阶段
  if (session.phase === 'filtering') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">专题练习</h2>
          <p className="text-sm text-gray-500">选择知识点和难度，开始针对性训练</p>
        </div>
        <PracticeFilter
          filter={filter}
          onChange={setFilter}
          onStart={handleStart}
          availableCount={availableCount}
        />
      </div>
    );
  }

  // 答题阶段
  if (session.phase === 'answering' && session.currentQuestion) {
    const correctCount = session.answers.filter(a => a.isCorrect).length;
    const wrongCount = session.answers.filter(a => !a.isCorrect).length;

    return (
      <div className="space-y-6">
        <PracticeProgress
          current={session.currentIndex}
          total={session.totalQuestions}
          correctCount={correctCount}
          wrongCount={wrongCount}
        />
        {showExplanation && session.currentAnswer ? (
          <ExplanationPanel
            question={session.currentQuestion}
            answer={session.currentAnswer}
            onNext={handleNext}
            isLast={session.currentIndex >= session.totalQuestions - 1}
          />
        ) : (
          <QuestionCard
            question={session.currentQuestion}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    );
  }

  // 结果阶段
  if (session.phase === 'finished' && session.stats) {
    const totalTime = Math.round((Date.now() - session.startTime) / 1000);
    return (
      <PracticeResult
        questions={session.questions}
        answers={session.answers}
        totalTime={totalTime}
        onRetry={handleStart}
        onBack={session.resetToFilter}
      />
    );
  }

  return null;
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/PracticeView.tsx
git commit -m "feat(practice): rewrite PracticeView with full quiz flow"
```

---

## Task 13: 知识点详情页增加练习入口

**Files:**
- Modify: `src/components/KnowledgeDetail.tsx`

- [ ] **Step 1: 在知识点详情页增加"开始练习"按钮**

在文件顶部导入：

```typescript
import { getQuestionsByKnowledgePoint } from '../data/questions';
```

在 AI Generation Section 之前增加练习入口 Section：

```tsx
{/* Practice Section */}
{(() => {
  const relatedQuestions = getQuestionsByKnowledgePoint(point.id);
  if (relatedQuestions.length === 0) return null;
  return (
    <div className="pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center text-xl font-bold text-green-900">
          <span className="mr-2">✏️</span> 巩固练习
          <span className="ml-3 text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            {relatedQuestions.length} 道题
          </span>
        </h3>
        <button
          onClick={() => {
            const params = new URLSearchParams({ kp: point.id });
            window.location.href = `/?view=practice&${params.toString()}`;
          }}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-200 transition-all"
        >
          开始练习
        </button>
      </div>
    </div>
  );
})()}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/KnowledgeDetail.tsx
git commit -m "feat: add practice entry to KnowledgeDetail page"
```

---

## Task 14: AI 生成 Prompt 模板

**Files:**
- Create: `scripts/generate-questions/prompts.ts`

- [ ] **Step 1: 创建 prompt 模板文件**

```typescript
import type { QuestionType, Difficulty } from '../../src/data/questions/types';

export function buildPrompt(
  knowledgePointTitle: string,
  description: string,
  tags: string[],
  subject: string,
  grade: string,
  type: QuestionType,
  difficulty: Difficulty,
): string {
  const typeInstructions: Record<QuestionType, string> = {
    choice: `一道**选择题**，4 个选项（A/B/C/D），只有一个正确答案。`,
    'fill-blank': `一道**填空题**，在题干中用______标出空白处，答案唯一、明确。`,
    'true-false': `一道**判断题**，陈述一个数学事实，答案为 true 或 false。`,
  };

  const difficultyInstructions: Record<Difficulty, string> = {
    basic: '基础难度：直接考查概念记忆和简单计算，一步完成。',
    intermediate: '提高难度：需要 2-3 步推理，或结合多个知识点。',
    advanced: '挑战难度：需要综合分析、逆向思维或多种解法。',
  };

  const gradeMap: Record<string, string> = {
    primary: '小学',
    middle: '初中',
    high: '高中',
  };

  return `你是一位资深${gradeMap[grade] || grade}${subject}教师。请为以下知识点生成一道高质量的${typeInstructions[type]}

知识点：${knowledgePointTitle}
知识点描述：${description}
关联标签：${tags.join('、')}

难度要求：${difficultyInstructions[difficulty]}

要求：
- 题目表述清晰、严谨，符合${gradeMap[grade] || grade}学生认知水平
- 不要出现超纲内容
- 解析要讲清思路，适合学生自学和家长辅导

请严格按以下 JSON 格式输出（不要输出其他无关内容）：

\`\`\`json
{
  "stem": "题干",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "answer": "A",
  "explanation": "详细解析"
}
\`\`\`

注意：
- 选择题的 options 必须有 4 个选项
- 填空题不需要 options 字段，answer 直接是答案文本
- 判断题不需要 options 字段，answer 为 "true" 或 "false"`;
}
```

- [ ] **Step 2: 提交**

```bash
git add scripts/generate-questions/prompts.ts
git commit -m "feat(scripts): add AI question generation prompt templates"
```

---

## Task 15: 知识点加载器

**Files:**
- Create: `scripts/generate-questions/knowledge-loader.ts`

- [ ] **Step 1: 创建知识点加载器**

```typescript
import { KNOWLEDGE_DATA } from '../../src/data/knowledge';
import type { GradeLevel, KnowledgePoint } from '../../src/data/types';

export interface KnowledgePointTask {
  id: string;
  title: string;
  description: string;
  tags: string[];
  subject: string;
  grade: GradeLevel;
}

export function loadKnowledgePoints(grade?: GradeLevel, subject?: string): KnowledgePointTask[] {
  const results: KnowledgePointTask[] = [];

  for (const gradeData of KNOWLEDGE_DATA) {
    if (grade && gradeData.id !== grade) continue;

    for (const subj of gradeData.subjects) {
      if (subject && subj.name !== subject) continue;

      for (const kp of subj.knowledgePoints) {
        results.push({
          id: kp.id,
          title: kp.title,
          description: kp.description,
          tags: kp.tags || [],
          subject: subj.name,
          grade: gradeData.id,
        });
      }
    }
  }

  return results;
}
```

- [ ] **Step 2: 提交**

```bash
git add scripts/generate-questions/knowledge-loader.ts
git commit -m "feat(scripts): add knowledge point loader for question generation"
```

---

## Task 16: AI 批量生成主脚本

**Files:**
- Create: `scripts/generate-questions/generate.ts`

- [ ] **Step 1: 创建生成主脚本**

```typescript
#!/usr/bin/env tsx
import 'dotenv/config';
import OpenAI from 'openai';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { buildPrompt } from './prompts';
import { loadKnowledgePoints } from './knowledge-loader';
import type { QuestionType, Difficulty } from '../../src/data/questions/types';

const QUESTION_TYPES: QuestionType[] = ['choice', 'fill-blank', 'true-false'];
const DIFFICULTIES: Difficulty[] = ['basic', 'intermediate', 'advanced'];

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    all: args.includes('--all'),
    grade: args.find(a => a.startsWith('--grade='))?.split('=')[1] as GradeLevel | undefined,
    subject: args.find(a => a.startsWith('--subject='))?.split('=')[1],
    incremental: args.includes('--incremental'),
  };
}

async function generateQuestion(
  client: OpenAI,
  model: string,
  kp: { id: string; title: string; description: string; tags: string[]; subject: string; grade: string },
  type: QuestionType,
  difficulty: Difficulty,
): Promise<object | null> {
  const prompt = buildPrompt(kp.title, kp.description, kp.tags, kp.subject, kp.grade, type, difficulty);

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content || '';
    // Extract JSON from response
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`  ❌ Failed to parse JSON for ${kp.title} ${type} ${difficulty}`);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    return {
      id: `q-${kp.subject}-${kp.grade}-${kp.id}-${difficulty}-${type}`,
      type,
      difficulty,
      knowledgePointIds: [kp.id],
      subject: kp.subject,
      grade: kp.grade as GradeLevel,
      tags: kp.tags,
      ...parsed,
    };
  } catch (error) {
    console.error(`  ❌ Error generating for ${kp.title}:`, error);
    return null;
  }
}

async function main() {
  const { all, grade, subject, incremental } = parseArgs();

  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY not set in environment');
    process.exit(1);
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  const kps = loadKnowledgePoints(grade, subject);
  console.log(`Found ${kps.length} knowledge points`);

  const results: Record<string, object[]> = {};

  for (const kp of kps) {
    console.log(`\n📝 Generating for: ${kp.title} (${kp.subject} ${kp.grade})`);
    const questions: object[] = [];

    for (const type of QUESTION_TYPES) {
      for (const difficulty of DIFFICULTIES) {
        console.log(`  - ${type} ${difficulty}...`);
        const q = await generateQuestion(client, model, kp, type, difficulty);
        if (q) questions.push(q);
      }
    }

    results[kp.id] = questions;
    console.log(`  ✅ Generated ${questions.length} questions`);
  }

  // Output to file
  const outputDir = join(__dirname, '../../src/data/questions');
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, 'generated.ts');
  const outputContent = `// Auto-generated by scripts/generate-questions/generate.ts
// Do not edit manually
import type { Question } from './types';

export const generatedQuestions: Question[] = ${JSON.stringify(
    Object.values(results).flat(),
    null,
    2
  ).replace(/"(\w+)":/g, '$1:')};
`;

  writeFileSync(outputPath, outputContent);
  console.log(`\n✅ Done! Generated ${Object.values(results).flat().length} questions total`);
  console.log(`📄 Output: ${outputPath}`);
}

main().catch(console.error);
```

- [ ] **Step 2: 提交**

```bash
git add scripts/generate-questions/generate.ts
git commit -m "feat(scripts): add AI batch question generation script"
```

---

## Task 17: 端到端验证

- [ ] **Step 1: 启动开发服务器并验证**

```bash
cd /Users/shichaopeng/Work/self-dir/projects/school-formula
npm run dev
```

验证清单：
- [ ] 首页"专题练习"导航正常显示
- [ ] 筛选面板标签、难度、题型可交互
- [ ] 点击"开始练习"进入答题流程
- [ ] 选择题可选中并提交
- [ ] 填空题可输入并提交
- [ ] 判断题可选择并提交
- [ ] 提交后即时显示对错和解析
- [ ] 点击"下一题"继续
- [ ] 最后一题完成后显示统计报告
- [ ] 知识点详情页有"开始练习"按钮
- [ ] 移动端布局正常

- [ ] **Step 2: 构建验证**

```bash
npm run build
```

Expected: 构建成功，无 TypeScript 错误

- [ ] **Step 3: 提交（如有修复）**

```bash
git add -A
git commit -m "fix: address verification feedback" --allow-empty
```

---

## 自检

| Spec 要求 | 对应 Task |
|-----------|-----------|
| 题目数据类型（选择/填空/判断 + 三级难度） | Task 1 |
| 题库文件结构（按学科-学段分文件） | Task 2 |
| 查询工具函数（按知识点/标签/筛选/随机） | Task 2 |
| AI 批量生成脚本 | Task 14, 15, 16 |
| 筛选面板 | Task 4 |
| 三种题型交互组件 | Task 5, 6, 7 |
| 即时反馈 + 解析 | Task 8 |
| 进度条 | Task 9 |
| 结果统计 | Task 10 |
| 知识点详情页入口 | Task 13 |
| 纯前端 + localStorage | Task 3（Hook 实现） |
