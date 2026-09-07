import type { GradeData } from '../types';

import { math } from './primary/math';
import { chinese } from './primary/chinese';
import { english } from './primary/english';
import { science } from './primary/science';
import { moral } from './primary/moral';

/**
 * Primary 学段数据（re-export 兼容层）
 * 实际知识点数据已拆分至 ./primary/ 目录下的学科文件。
 * 此文件保留原始 GradeData 结构供下游消费者使用。
 */
export const primaryData: GradeData = {
  id: 'primary',
  name: '小学',
  subjects: [
    {
      id: 'math-primary',
      name: '数学',
      icon: '🔢',
      knowledgePoints: math,
    },
    {
      id: 'chinese-primary',
      name: '语文',
      icon: '📝',
      knowledgePoints: chinese,
    },
    {
      id: 'english-primary',
      name: '英语',
      icon: '🔤',
      knowledgePoints: english,
    },
    {
      id: 'science-primary',
      name: '科学',
      icon: '🔬',
      knowledgePoints: science,
    },
    {
      id: 'moral-primary',
      name: '道德与法治',
      icon: '⚖️',
      knowledgePoints: moral,
    },
  ],
};
