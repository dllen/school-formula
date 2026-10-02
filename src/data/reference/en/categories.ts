import type { ReferenceCategory } from '../types';

export interface CategoryCopy {
  /** hub H1 与 `/en/` 索引卡上的学科名。 */
  name: string;
  /** `/en/` 索引卡上的一句话，约 50–80 字符。 */
  summary: string;
  /** hub 页导语，同时用作该 hub 的 meta description。 */
  intro: string;
}

/** 英文面的学科文案。修改学科措辞的唯一位置。 */
export const CATEGORY_COPY: Record<ReferenceCategory, CategoryCopy> = {
  math: {
    name: 'Math',
    summary: 'Times tables, roots, conversions and formula sheets.',
    intro:
      'Printable maths reference charts for arithmetic, algebra and geometry — times tables, squares and roots, unit conversions and formula sheets. Every chart is laid out to be printed at full size and kept on a desk or in a homework folder.',
  },
  science: {
    name: 'Science',
    summary: 'Constants, units and reference data for physics and chemistry.',
    intro:
      'Printable science reference charts: the constants and reference tables that come up in physics and chemistry homework. Each row gives the quantity, the symbol it is written with, and its value in SI units.',
  },
  english: {
    name: 'English',
    summary: 'Grammar, spelling and vocabulary reference lists.',
    intro:
      'Printable English reference charts covering grammar, spelling and vocabulary — word forms and the lists that are quicker to check than to recall. Each chart is laid out to be read at a glance and printed on a single page.',
  },
};
