import type React from 'react';
import { lazyWithPreload } from './lazy-with-preload';

export type RouteKey =
  | 'home'
  | 'knowledgeDetail'
  | 'poemDetail'
  | 'referenceIndex'
  | 'referenceCategory'
  | 'referencePage';

export const ROUTE_COMPONENTS = {
  home: lazyWithPreload<object>(() => import('../components/Home').then((m) => ({ default: m.Home as unknown as React.ComponentType<object> }))),
  knowledgeDetail: lazyWithPreload<object>(() => import('../components/KnowledgeDetail').then((m) => ({ default: m.KnowledgeDetail as unknown as React.ComponentType<object> }))),
  poemDetail: lazyWithPreload<object>(() => import('../components/poetry/PoemDetail').then((m) => ({ default: m.PoemDetail as unknown as React.ComponentType<object> }))),
  referenceIndex: lazyWithPreload<object>(() => import('../components/reference/ReferenceIndex').then((m) => ({ default: m.ReferenceIndex as unknown as React.ComponentType<object> }))),
  referenceCategory: lazyWithPreload<object>(() => import('../components/reference/ReferenceCategory').then((m) => ({ default: m.ReferenceCategory as unknown as React.ComponentType<object> }))),
  referencePage: lazyWithPreload<object>(() => import('../components/reference/ReferencePage').then((m) => ({ default: m.ReferencePage as unknown as React.ComponentType<object> }))),
} satisfies Record<RouteKey, unknown>;
