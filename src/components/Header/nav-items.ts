import type { ViewType } from './types';

export interface NavItem {
  label: string;
  /** 走 Home 的视图切换（pathForView）。 */
  view?: ViewType;
  /** 独立页面路由，如 /yuwen。 */
  to?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: '学科学习',
    items: [
      { label: '知识点', view: 'knowledge' },
      { label: '公式宝典', view: 'formula' },
      { label: '速算口诀', view: 'mental-math' },
      { label: '教程', view: 'tutorial' },
    ],
  },
  {
    label: '工具速查',
    items: [
      { label: '小学语文', to: '/yuwen' },
      { label: '速查表', view: 'cheatsheet' },
      { label: '专题练习', view: 'practice' },
      { label: '融会贯通', view: 'mastery' },
      { label: '学习笔记', view: 'notes' },
    ],
  },
  {
    label: '经典阅读',
    items: [
      { label: '资治通鉴', view: 'zizhi' },
      { label: '史记', view: 'shiji' },
      { label: '古诗词', view: 'poetry' },
    ],
  },
  {
    label: 'AI 助手',
    items: [{ label: 'AI 助教', view: 'ai-chat' }],
  },
];
