import { Link } from 'react-router-dom';

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
    <footer className="mt-12 bg-white border-t border-[#F0F1F2] print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="页脚导航" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="text-[#646A73] hover:text-[#3370FF]">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4 text-sm text-[#646A73]">
          © {new Date().getFullYear()} 拾艺院 (Shi Yi Yuan). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
