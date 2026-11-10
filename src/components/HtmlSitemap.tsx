import { Link, useNavigate } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { pathForView } from '../view-routes';
import { buildHtmlSitemap, type SitemapGroup } from '../sitemap';

/**
 * `/sitemap` —— 人类可读、可被爬虫抓取的 HTML 站点地图。
 *
 * 与 `dist/sitemap.xml`（机器可读）互补：每个分组是一节，链接是 `<Link>`，
 * 因此不需要 JS 即可遍历，与首页的爬取权重一致。行与行之间是发丝线，
 * 长分组用多栏排布，让一千多个页面仍能快速扫描。
 */
export function HtmlSitemap() {
  const groups = buildHtmlSitemap();
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <Header activeView="knowledge" onViewChange={(view) => navigate(pathForView(view))} />
      <main id="main" tabIndex={-1} className="page-main">
        <div className="container-page pt-10 pb-16">
          <div className="page-head">
            <div className="page-head__text">
              <h1 className="page-title">站点地图</h1>
              <p className="page-lead max-w-prose">
                拾艺院全部可索引页面：按学习视图、学段知识点、古诗词、英文速查表与英文学科入口分组，方便快速定位。
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {groups.map((group, index) => (
              <SitemapSection key={group.title} group={group} index={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SitemapSection({ group, index }: { group: SitemapGroup; index: number }) {
  const headingId = `sitemap-group-${index}`;
  return (
    <section aria-labelledby={headingId}>
      <div className="flex items-baseline gap-3">
        <h2 id={headingId} className="text-subhead font-semibold text-ink">
          {group.title}
        </h2>
        <span className="h-px flex-1 bg-divider" aria-hidden="true" />
        <span className="tabular text-caption text-ink-3">{group.links.length} 个页面</span>
      </div>
      <ul className="mt-2 columns-1 gap-x-10 sm:columns-2 xl:columns-3">
        {group.links.map((link) => (
          <li key={link.path} className="break-inside-avoid border-b border-divider">
            <Link
              to={link.path}
              className="block py-2 text-body-s text-ink-2 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
