import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { ViewType } from './types';

const NAV_GROUPS = [
  {
    label: '学科学习',
    views: [
      { value: 'knowledge', label: '知识点' },
      { value: 'formula', label: '公式宝典' },
      { value: 'mental-math', label: '速算口诀' },
      { value: 'tutorial', label: '教程' },
    ],
  },
  {
    label: '工具速查',
    views: [
      { value: 'cheatsheet', label: '速查表' },
      { value: 'practice', label: '专题练习' },
      { value: 'mastery', label: '融会贯通' },
      { value: 'notes', label: '学习笔记' },
    ],
  },
  {
    label: '经典阅读',
    views: [
      { value: 'zizhi', label: '资治通鉴' },
      { value: 'shiji', label: '史记' },
      { value: 'poetry', label: '古诗词' },
    ],
  },
  {
    label: 'AI 助手',
    views: [
      { value: 'ai-chat', label: 'AI 助教' },
    ],
  },
] as const;

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function MobileNav({ isOpen, onClose, activeView, onViewChange }: MobileNavProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="导航菜单">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 bg-white shadow-pop max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 h-[60px] border-b border-[rule]">
          <span className="text-[16px] font-medium text-[ink]">菜单</span>
          <button
            type="button"
            aria-label="关闭菜单"
            onClick={onClose}
            className="p-2 text-[ink-2] hover:text-[ink] hover:bg-[paper-2] rounded-[6px] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav aria-label="移动端导航" className="py-2">
          {NAV_GROUPS.map((group) => {
            const isExpanded = openGroup === group.label;
            return (
              <div key={group.label} className="border-b border-[divider] last:border-0">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setOpenGroup(isExpanded ? null : group.label)}
                  className="w-full text-left px-4 py-3 text-[14px] font-medium text-[ink] flex items-center justify-between"
                >
                  {group.label}
                  <svg
                    className={`w-4 h-4 text-[ink-3] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isExpanded && (
                  <div role="menu" aria-label={group.label}>
                    {group.views.map((view) => (
                      <button
                        key={view.value}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onViewChange(view.value);
                          onClose();
                        }}
                        className={`w-full text-left px-6 py-[10px] text-[14px] transition-colors ${
                          activeView === view.value
                            ? 'text-[accent] bg-[accent-soft] font-medium'
                            : 'text-[ink-2] hover:bg-[paper-2]'
                        }`}
                      >
                        {view.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-[divider] px-4 py-3">
          <LanguageSwitcher className="text-[14px] font-medium text-[accent] hover:underline" />
        </div>
      </div>
    </div>
  );
}
