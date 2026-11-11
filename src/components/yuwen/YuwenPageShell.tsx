// src/components/yuwen/YuwenPageShell.tsx
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { pathForView } from '../../view-routes';

interface YuwenPageShellProps {
  children: ReactNode;
}

/** /yuwen 各页共用的页面骨架；导航高亮由 NavMenu 按路径判断，这里 activeView 传 null。 */
export function YuwenPageShell({ children }: YuwenPageShellProps) {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <Header activeView={null} onViewChange={(view) => navigate(pathForView(view))} />
      <main id="main" className="container-page pt-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
