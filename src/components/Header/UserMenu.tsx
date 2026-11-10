import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import { Icon } from '../icons/Icon';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new CustomEvent('open-auth-modal'));
        }}
        className="btn btn-primary"
      >
        登录
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="用户菜单"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((o) => !o)}
        className="icon-btn w-auto gap-1 px-1.5"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <span className="w-7 h-7 rounded-full bg-accent text-accent-ink flex items-center justify-center text-caption font-semibold" aria-hidden="true">
            {(user.nickname || user.email || 'U').charAt(0)}
          </span>
        )}
        <Icon name="chevron-down" className="w-3.5 h-3.5 text-ink-3" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="用户菜单"
          className="nav-panel right-0 left-auto w-60"
        >
          <div className="px-4 pb-3 border-b border-divider">
            <p className="text-body-s font-medium text-ink truncate">{user.nickname || user.email}</p>
            <p className="text-caption text-ink-3 truncate">{user.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-body-s text-error-ink hover:bg-paper-2 transition-colors"
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
}
