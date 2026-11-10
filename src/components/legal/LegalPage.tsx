import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { pathForView } from '../../view-routes';
import { Icon } from '../icons/Icon';
import { LEGAL_CONTENT, LEGAL_PATHS, type LegalPath } from './legal-content';

function isLegalPath(value: string): value is LegalPath {
  return (LEGAL_PATHS as readonly string[]).includes(value);
}

export function LegalPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname.replace(/\/+$/, '') || '/';
  if (!isLegalPath(path)) return null;
  const content = LEGAL_CONTENT[path];
  return (
    <div className="page-shell">
      <Header activeView="knowledge" onViewChange={(view) => navigate(pathForView(view))} />
      <main id="main" tabIndex={-1} className="page-main">
        <div className="container-page pt-10 pb-16">
          <Link
            to="/"
            className="tap-44 inline-flex items-center gap-1 text-label text-ink-2 transition-colors hover:text-ink"
          >
            <Icon name="arrow-left" className="h-4 w-4" />
            返回首页
          </Link>

          <article className="prose-body mt-6">
            <h1 className="page-title">{content.title}</h1>
            {content.sections.map((section) => (
              <section key={section.heading} className="section">
                <h2 className="section-head">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-ink">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
