import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (isAuthenticated && user) {
    return (
      <div ref={ref} className="relative">
        <button onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
            {user.nickname?.[0] || user.email[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
            {user.nickname || user.email.split('@')[0]}
          </span>
          {user.tier !== 'free' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white uppercase font-bold">
              {user.tier}
            </span>
          )}
        </button>
        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user.tier} 会员</p>
            </div>
            <button onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
              退出登录
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setShowLogin(true)}
        className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
        登录
      </button>
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />
      )}
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />
      )}
    </>
  );
}
