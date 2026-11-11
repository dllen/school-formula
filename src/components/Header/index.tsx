import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavMenu } from './NavMenu';
import { UserMenu } from './UserMenu';
import { SettingsButton } from './SettingsButton';
import { MobileNav } from './MobileNav';
import { SettingsModal } from '../SettingsModal';
import { AuthModal } from '../AuthModal';
import type { ViewType } from './types';

interface HeaderProps {
  activeView: ViewType | null;
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
    <header className="site-header">
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>

      <div className="container-page">
        <div className="site-header__inner">
          <Logo />

          <div className="header-actions">
            <NavMenu activeView={activeView} />

            <div className="header-actions nav-desktop-only">
              <LanguageSwitcher />
              <SettingsButton onClick={() => setIsSettingsOpen(true)} />
              <UserMenu />
            </div>

            <button
              type="button"
              aria-label="打开导航菜单"
              aria-expanded={isMobileNavOpen}
              onClick={() => setIsMobileNavOpen(true)}
              className="icon-btn nav-mobile-only"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeView={activeView}
        onViewChange={onViewChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      {isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />}
    </header>
  );
}
