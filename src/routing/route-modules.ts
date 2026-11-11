import type React from 'react';
import { lazyWithPreload } from './lazy-with-preload';

export type RouteKey =
  | 'home'
  | 'knowledgeDetail'
  | 'poemDetail'
  | 'referenceIndex'
  | 'referenceCategory'
  | 'referencePage'
  | 'yuwenIndex'
  | 'yuwenBook'
  | 'yuwenLesson'
  | 'yuwenReview'
  | 'yuwenTingxie'
  | 'yuwenChar'
  | 'yuwenPinyinIndex'
  | 'yuwenPinyinStem'
  | 'yuwenDuoyin';

export const ROUTE_COMPONENTS = {
  home: lazyWithPreload<object>(() => import('../components/Home').then((m) => ({ default: m.Home as unknown as React.ComponentType<object> }))),
  knowledgeDetail: lazyWithPreload<object>(() => import('../components/KnowledgeDetail').then((m) => ({ default: m.KnowledgeDetail as unknown as React.ComponentType<object> }))),
  poemDetail: lazyWithPreload<object>(() => import('../components/poetry/PoemDetail').then((m) => ({ default: m.PoemDetail as unknown as React.ComponentType<object> }))),
  referenceIndex: lazyWithPreload<object>(() => import('../components/reference/ReferenceIndex').then((m) => ({ default: m.ReferenceIndex as unknown as React.ComponentType<object> }))),
  referenceCategory: lazyWithPreload<object>(() => import('../components/reference/ReferenceCategory').then((m) => ({ default: m.ReferenceCategory as unknown as React.ComponentType<object> }))),
  referencePage: lazyWithPreload<object>(() => import('../components/reference/ReferencePage').then((m) => ({ default: m.ReferencePage as unknown as React.ComponentType<object> }))),
  yuwenIndex: lazyWithPreload<object>(() => import('../components/yuwen/YuwenIndexPage').then((m) => ({ default: m.YuwenIndexPage as unknown as React.ComponentType<object> }))),
  yuwenBook: lazyWithPreload<object>(() => import('../components/yuwen/YuwenBookPage').then((m) => ({ default: m.YuwenBookPage as unknown as React.ComponentType<object> }))),
  yuwenLesson: lazyWithPreload<object>(() => import('../components/yuwen/YuwenLessonPage').then((m) => ({ default: m.YuwenLessonPage as unknown as React.ComponentType<object> }))),
  yuwenReview: lazyWithPreload<object>(() => import('../components/yuwen/YuwenReviewPage').then((m) => ({ default: m.YuwenReviewPage as unknown as React.ComponentType<object> }))),
  yuwenTingxie: lazyWithPreload<object>(() => import('../components/yuwen/YuwenTingxiePage').then((m) => ({ default: m.YuwenTingxiePage as unknown as React.ComponentType<object> }))),
  yuwenChar: lazyWithPreload<object>(() => import('../components/yuwen/YuwenCharPage').then((m) => ({ default: m.YuwenCharPage as unknown as React.ComponentType<object> }))),
  yuwenPinyinIndex: lazyWithPreload<object>(() => import('../components/yuwen/YuwenPinyinIndexPage').then((m) => ({ default: m.YuwenPinyinIndexPage as unknown as React.ComponentType<object> }))),
  yuwenPinyinStem: lazyWithPreload<object>(() => import('../components/yuwen/YuwenPinyinStemPage').then((m) => ({ default: m.YuwenPinyinStemPage as unknown as React.ComponentType<object> }))),
  yuwenDuoyin: lazyWithPreload<object>(() => import('../components/yuwen/YuwenDuoyinPage').then((m) => ({ default: m.YuwenDuoyinPage as unknown as React.ComponentType<object> }))),
} satisfies Record<RouteKey, unknown>;
