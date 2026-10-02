import type { ReferencePage } from '../types';
import { ENGLISH_PAGES } from './english';
import { MATH_PAGES } from './math';
import { SCIENCE_PAGES } from './science';

/** 英文面的全部图表页。顺序即 `/en/` 索引页与各学科 hub 上的展示顺序。 */
export const REFERENCE_PAGES_EN: readonly ReferencePage[] = [
  ...MATH_PAGES,
  ...SCIENCE_PAGES,
  ...ENGLISH_PAGES,
];
