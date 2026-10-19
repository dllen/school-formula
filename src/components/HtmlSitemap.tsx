import { Link } from 'react-router-dom';
import { Footer } from './Footer';
import { buildHtmlSitemap, type SitemapGroup } from '../sitemap';

/**
 * `/sitemap` —— 人类可读、可被爬虫抓取的 HTML 站点地图。
 *
 * 与 `dist/sitemap.xml`（机器可读）互补：每个分组是一节，链接是 `<Link>`，
 * 因此不需要 JS 即可遍历，与首页的爬取权重一致。
 */
export function HtmlSitemap() {
  const groups = buildHtmlSitemap();

  return (
    <div className="min-h-screen bg-[#F5F6F7] font-sans text-slate-800 flex flex-col">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex-grow w-full">
        <header>
          <h1 className="text-3xl font-bold text-[#1F2329]">站点地图</h1>
          <p className="mt-2 max-w-3xl text-[#646A73]">
            拾艺院全部可索引页面：按学习视图、学段知识点、古诗词、英文速查表与英文学科入口分组，方便快速定位。
          </p>
        </header>

        {groups.map((group) => (
          <SitemapSection key={group.title} group={group} />
        ))}
      </main>
      <Footer />
    </div>
  );
}

function SitemapSection({ group }: { group: SitemapGroup }) {
  return (
    <section aria-labelledby={`sitemap-${group.title}`}>
      <h2 id={`sitemap-${group.title}`} className="text-xl font-bold text-[#1F2329] mb-4">
        {group.title}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
        {group.links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="text-[#3370FF] hover:text-blue-800 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
