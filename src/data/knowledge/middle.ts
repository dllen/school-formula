import type { GradeData } from '../types';

import { math } from './middle/math';
import { physics } from './middle/physics';
import { chemistry } from './middle/chemistry';
import { biology } from './middle/biology';
import { chinese } from './middle/chinese';
import { english } from './middle/english';
import { history } from './middle/history';
import { geography } from './middle/geography';
import { moral } from './middle/moral';

/**
 * Middle 学段数据（re-export 兼容层）
 * 实际知识点数据已拆分至 ./middle/ 目录下的学科文件。
 * 此文件保留原始 GradeData 结构供下游消费者使用。
 */
export const middleData: GradeData = {
  id: 'middle',
  name: '初中',
  subjects: [
    {
      id: 'math-middle',
      name: '数学',
      icon: '📐',
      knowledgePoints: math,
    },
    {
      id: 'physics-middle',
      name: '物理',
      icon: '⚡',
      knowledgePoints: physics,
    },
    {
      id: 'chemistry-middle',
      name: '化学',
      icon: '🧪',
      knowledgePoints: chemistry,
    },
    {
      id: 'biology-middle',
      name: '生物',
      icon: '🧬',
      knowledgePoints: biology,
    },
    {
      id: 'chinese-middle',
      name: '语文',
      icon: '✒️',
      knowledgePoints: chinese,
    },
    {
      id: 'english-middle',
      name: '英语',
      icon: '🗽',
      knowledgePoints: english,
    },
    {
      id: 'history-middle',
      name: '历史',
      icon: '📜',
      knowledgePoints: history,
    },
    {
      id: 'geography-middle',
      name: '地理',
      icon: '🌍',
      knowledgePoints: geography,
    },
    {
      id: 'moral-middle',
      name: '道德与法治',
      icon: '⚖️',
      knowledgePoints: moral,
    },
  ],
};
