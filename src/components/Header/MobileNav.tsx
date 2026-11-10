import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SettingsButton } from './SettingsButton';
import { useAuth } from '../../context/auth-context';
import { Icon } from '../icons/Icon';
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
  onOpenSettings: () => void;
}

export function MobileNav({ isOpen, onClose, activeView, onViewChange, onOpenSettings }: MobileNavProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="导航菜单">
      <div className="drawer__scrim" onClick={onClose} aria-hidden="true" />
      <div className="drawer__panel">
        <div className="drawer__head">
          <span className="text-body font-semibold text-ink">菜单</span>
          <button
            type="button"
            aria-label="关闭菜单"
            onClick={onClose}
            className="icon-btn"
          >
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        <nav aria-label="移动端导航">
          {NAV_GROUPS.map((group) => {
            const isExpanded = openGroup === group.label;
            return (
              <div key={group.label} className="drawer__group">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setOpenGroup(isExpanded ? null : group.label)}
                  className="drawer__toggle"
                >
                  {group.label}
                  <Icon name="chevron-down" className="w-4 h-4" />
                </button>
                {isExpanded && (
                  <div role="menu" aria-label={group.label}>
                    {group.views.map((view) => (
                      <button
                        key={view.value}
                        type="button"
                        role="menuitem"
                        data-active={activeView === view.value ? 'true' : undefined}
                        onClick={() => {
                          onViewChange(view.value);
                          onClose();
                        }}
                        className="drawer__item"
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

        <div className="drawer__foot">
          <LanguageSwitcher />
          <span className="ml-auto flex items-center gap-1">
            <SettingsButton onClick={onOpenSettings} />
            {isAuthenticated && user ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                退出登录
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent('open-auth-modal'));
                }}
              >
                登录
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
