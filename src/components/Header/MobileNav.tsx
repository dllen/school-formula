import { useState } from 'react';
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
    label: '古籍阅读',
    views: [
      { value: 'zizhi', label: '资治通鉴' },
      { value: 'shiji', label: '史记' },
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
      <div className="absolute top-0 left-0 right-0 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 h-[60px] border-b border-[#E5E6EB]">
          <span className="text-[16px] font-medium text-[#1F2329]">菜单</span>
          <button
            type="button"
            aria-label="关闭菜单"
            onClick={onClose}
            className="p-2 text-[#646A73] hover:text-[#1F2329] hover:bg-[#F5F6F7] rounded-[6px] transition-colors"
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
              <div key={group.label} className="border-b border-[#F0F1F2] last:border-0">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setOpenGroup(isExpanded ? null : group.label)}
                  className="w-full text-left px-4 py-3 text-[14px] font-medium text-[#1F2329] flex items-center justify-between"
                >
                  {group.label}
                  <svg
                    className={`w-4 h-4 text-[#8F959E] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                            ? 'text-[#3370FF] bg-[#E1EAFF] font-medium'
                            : 'text-[#646A73] hover:bg-[#F5F6F7]'
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
      </div>
    </div>
  );
}
