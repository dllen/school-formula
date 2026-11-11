// src/data/yuwen/types.ts
//
// 小学语文（人教版生字）数据模型。数据文件由 scripts/ingest-data 生成，
// 本文件与 index.ts 是手写代码。

/** 一册课本。units 保留原站单元划分，供复习/听写页使用。 */
export interface YuwenBook {
  id: string;
  title: string;
  grade: 1 | 2 | 3 | 4 | 5;
  term: 'a' | 'b';
  lessonCount: number;
  charCount: number;
  units: YuwenUnit[];
}

export interface YuwenUnit {
  no: number;
  lessonIds: string[];
}

/** 一课。chars 按课文顺序排列（去重）。 */
export interface YuwenLesson {
  id: string;
  bookId: string;
  unitNo: number;
  title: string;
  preview: string;
  chars: string[];
}

/** 单字。readings 来自拼音表与单字页；radicals 是所属部件名。 */
export interface YuwenChar {
  ch: string;
  readings: YuwenReading[];
  radicals: string[];
  /** 组词：只取单字页默认展示的前 10 个（不取 details 里的扩展词）。 */
  words: string[];
}

export interface YuwenReading {
  py: string;
  stem: string;
  lessonId?: string;
  words: string[];
}

/** 拼音表条目。rows 按声调分组，chars 保持原站顺序。 */
export interface YuwenStem {
  stem: string;
  rows: { py: string; chars: string[] }[];
}

export interface YuwenDuoyin {
  ch: string;
  readings: { py: string; words: string[]; lessonId?: string }[];
}

/** 部件 → 含该部件的字。label 如「提土旁」，仅用于展示。 */
export interface YuwenRadical {
  name: string;
  label?: string;
  chars: string[];
}

/** 抽取端写入 staging 的信封。 */
export interface YuwenEnvelope {
  source: string;
  extractedAt: string;
  books: YuwenBook[];
  lessons: YuwenLesson[];
  chars: YuwenChar[];
  stems: YuwenStem[];
  duoyin: YuwenDuoyin[];
  radicals: YuwenRadical[];
}
