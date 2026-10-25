import type { GradeData } from '../types';

import { math } from './primary/math';
import { mathGrade1 } from './primary/math-grade1.generated';
import { mathGrade2 } from './primary/math-grade2.generated';
import { mathGrade3 } from './primary/math-grade3.generated';
import { mathGrade4 } from './primary/math-grade4.generated';
import { mathGrade5 } from './primary/math-grade5.generated';
import { mathGrade6 } from './primary/math-grade6.generated';
import { chinese } from './primary/chinese';
import { chineseGrade1 } from './primary/chinese-grade1.generated';
import { chineseGrade2 } from './primary/chinese-grade2.generated';
import { chineseGrade3 } from './primary/chinese-grade3.generated';
import { chineseGrade4 } from './primary/chinese-grade4.generated';
import { chineseGrade5 } from './primary/chinese-grade5.generated';
import { chineseGrade6 } from './primary/chinese-grade6.generated';
import { english } from './primary/english';
import { englishGrade3 } from './primary/english-grade3.generated';
import { englishGrade4 } from './primary/english-grade4.generated';
import { englishGrade5 } from './primary/english-grade5.generated';
import { englishGrade6 } from './primary/english-grade6.generated';
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
      knowledgePoints: [...math, ...mathGrade1, ...mathGrade2, ...mathGrade3, ...mathGrade4, ...mathGrade5, ...mathGrade6],
    },
    {
      id: 'chinese-primary',
      name: '语文',
      icon: '📝',
      knowledgePoints: [...chinese, ...chineseGrade1, ...chineseGrade2, ...chineseGrade3, ...chineseGrade4, ...chineseGrade5, ...chineseGrade6],
    },
    {
      id: 'english-primary',
      name: '英语',
      icon: '🔤',
      knowledgePoints: [...english, ...englishGrade3, ...englishGrade4, ...englishGrade5, ...englishGrade6],
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
