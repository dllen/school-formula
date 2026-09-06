import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { NavMenu } from './NavMenu';
import { UserMenu } from './UserMenu';
import { SettingsButton } from './SettingsButton';
import { MobileNav } from './MobileNav';
import { SettingsModal } from '../SettingsModal';
import { AuthModal } from '../AuthModal';
import type { ViewType } from './types';

interface HeaderProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Header({ activeView, onViewChange }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsAuthOpen(true);
    window.addEventListener('open-auth-modal', handler);
    return () => window.removeEventListener('open-auth-modal', handler);
  }, []);

  return (
    <header className="bg-white border-b border-[#E5E6EB] sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-center h-[60px]">
          <Logo />

          <div className="flex items-center gap-3">
            <NavMenu activeView={activeView} onViewChange={onViewChange} />
            <UserMenu />
            <SettingsButton onClick={() => setIsSettingsOpen(true)} />
          </div>

          <button
            type="button"
            aria-label="打开导航菜单"
            aria-expanded={isMobileNavOpen}
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden p-2 text-[#646A73] hover:text-[#1F2329] hover:bg-[#F5F6F7] rounded-[6px] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeView={activeView}
        onViewChange={onViewChange}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      {isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />}
    </header>
  );
}
