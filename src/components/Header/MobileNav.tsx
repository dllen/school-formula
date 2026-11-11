import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SettingsButton } from './SettingsButton';
import { useAuth } from '../../context/auth-context';
import { Icon } from '../icons/Icon';
import type { ViewType } from './types';
import { NAV_GROUPS } from './nav-items';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ViewType | null;
  onViewChange: (view: ViewType) => void;
  onOpenSettings: () => void;
}

export function MobileNav({ isOpen, onClose, activeView, onViewChange, onOpenSettings }: MobileNavProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const pathnameMatches = (target: string) => pathname === target || pathname.startsWith(target + '/');

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
                    {group.items.map((item) =>
                      item.to ? (
                        <Link
                          key={item.label}
                          to={item.to}
                          role="menuitem"
                          className="drawer__item"
                          data-active={pathnameMatches(item.to) ? 'true' : undefined}
                          onClick={onClose}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          key={item.label}
                          type="button"
                          role="menuitem"
                          className="drawer__item"
                          data-active={activeView === item.view ? 'true' : undefined}
                          onClick={() => {
                            if (item.view) onViewChange(item.view);
                            onClose();
                          }}
                        >
                          {item.label}
                        </button>
                      ),
                    )}
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
