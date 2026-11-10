import type { ReactNode } from 'react';
import { ENGLISH_HOME } from '../../reference-routes';

/** Shared chrome for the English reference surface (header, footer, language link). */
export function ReferenceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <header className="site-header print:hidden">
        <div className="container-page">
          <div className="site-header__inner">
            <a href={ENGLISH_HOME} className="wordmark tap-44" aria-label="Shiyiyuan Study Reference">
              <span className="wordmark__mark" aria-hidden="true">
                拾
              </span>
              <span className="wordmark__text">
                <span className="wordmark__name">Shiyiyuan</span>
                <span className="wordmark__sub">Study Reference</span>
              </span>
            </a>

            <nav aria-label="Site" className="flex items-center gap-1">
              <a href={ENGLISH_HOME} className="nav-link tap-44">
                All charts
              </a>
              <a href="/" className="nav-link tap-44" lang="zh-CN">
                中文
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="page-main">
        <div className="container-page pt-10 pb-10">{children}</div>
      </main>

      <footer className="site-footer print:hidden">
        <div className="container-page">
          <div className="site-footer__inner">
            <p className="max-w-prose text-body-s text-ink-2">
              Free printable reference charts for students, parents and teachers.
            </p>

            <nav aria-label="Footer">
              <ul className="footer-links">
                <li>
                  <a href="/privacy" className="tap-44 inline-flex items-center">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="tap-44 inline-flex items-center">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="/about" className="tap-44 inline-flex items-center">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="tap-44 inline-flex items-center">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            <p className="max-w-prose text-label text-ink-3">
              Open a chart and use your browser&rsquo;s Print command; each one is laid out at full
              size.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
