import type { GradeData } from '../types';

import { math } from './high/math';
import { physics } from './high/physics';
import { chemistry } from './high/chemistry';
import { biology } from './high/biology';
import { politics } from './high/politics';
import { history } from './high/history';
import { geography } from './high/geography';

/**
 * High 学段数据（re-export 兼容层）
 * 实际知识点数据已拆分至 ./high/ 目录下的学科文件。
 * 此文件保留原始 GradeData 结构供下游消费者使用。
 */
export const highData: GradeData = {
  id: 'high',
  name: '高中',
  subjects: [
    {
      id: 'math-high',
      name: '数学',
      icon: '∫',
      knowledgePoints: math,
    },
    {
      id: 'physics-high',
      name: '物理',
      icon: '⚛️',
      knowledgePoints: physics,
    },
    {
      id: 'chemistry-high',
      name: '化学',
      icon: '⚗️',
      knowledgePoints: chemistry,
    },
    {
      id: 'biology-high',
      name: '生物',
      icon: '🦠',
      knowledgePoints: biology,
    },
    {
      id: 'politics-high',
      name: '思想政治',
      icon: '🚩',
      knowledgePoints: politics,
    },
    {
      id: 'history-high',
      name: '历史',
      icon: '🏺',
      knowledgePoints: history,
    },
    {
      id: 'geography-high',
      name: '地理',
      icon: '🗺️',
      knowledgePoints: geography,
    },
  ],
};
