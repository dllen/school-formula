import type { GradeLevel } from '../types';

export type Dynasty = 'tang' | 'song';

export type PoemForm =
  | '五言绝句'
  | '七言绝句'
  | '五言律诗'
  | '七言律诗'
  | '五言古诗'
  | '七言古诗'
  | '词';

export type PoemTheme =
  | '咏物'
  | '写景'
  | '抒情'
  | '送别'
  | '思乡'
  | '边塞'
  | '田园'
  | '咏史'
  | '哲理'
  | '节日'
  | '爱情'
  | '闺怨'
  | '讽喻'
  | '其他';

export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: Dynasty;
  form: PoemForm;
  grade: GradeLevel;
  content: string[];
  pinyin: string[];
  translation: string;
  appreciation: string;
  theme: PoemTheme;
  cipai?: string;
}

export type DynastyFilter = 'all' | Dynasty;
export type GradeFilter = 'all' | GradeLevel;
export type ThemeFilter = 'all' | PoemTheme;