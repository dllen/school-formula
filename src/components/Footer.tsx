import { Link } from 'react-router-dom';
import { DonatePopover } from './DonatePopover';

const FOOTER_LINKS = [
  { label: '知识点', to: '/' },
  { label: '教程', to: '/tutorial' },
  { label: '速查表', to: '/cheatsheet' },
  { label: '题库练习', to: '/practice' },
  { label: '古诗词', to: '/poetry' },
  { label: '站点地图', to: '/sitemap' },
  { label: '隐私政策', to: '/privacy' },
  { label: '服务条款', to: '/terms' },
  { label: '关于我们', to: '/about' },
  { label: '联系我们', to: '/contact' },
] as const;

export function Footer() {
  return (
    <footer className="site-footer print:hidden">
      <div className="container-page">
        <div className="site-footer__inner">
          <nav aria-label="页脚导航">
            <ul className="footer-links">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-meta">
            <p className="text-label text-ink-3">
              © {new Date().getFullYear()} 拾艺院 (Shi Yi Yuan). All rights reserved.
            </p>
            <span className="footer-meta__sep" aria-hidden="true" />
            <DonatePopover triggerLabel="赞赏支持" />
          </div>
        </div>
      </div>
    </footer>
  );
}
