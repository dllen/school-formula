import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';


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
        className="px-4 py-2 text-[14px] font-medium text-white bg-[accent] rounded-[6px] hover:bg-[accent-hover] transition-colors"
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
        className="flex items-center gap-1 p-[6px] rounded-[6px] hover:bg-[paper-2] transition-colors"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-accent text-accent-ink flex items-center justify-center text-[13px] font-semibold" aria-hidden="true">
            {(user.nickname || user.email || 'U').charAt(0)}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-[ink-3] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="用户菜单"
          className="absolute right-0 top-full mt-2 w-60 bg-white rounded-[12px] shadow-pop border border-[rule] py-2 z-50"
        >
          <div className="px-4 py-3 border-b border-[divider]">
            <p className="text-[14px] font-medium text-[ink] truncate">{user.nickname || user.email}</p>
            <p className="text-[12px] text-[ink-3] truncate">{user.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-[10px] text-[14px] text-error-ink hover:bg-[paper-2] transition-colors"
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
}
