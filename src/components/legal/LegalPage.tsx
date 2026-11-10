import { Link, useLocation } from 'react-router-dom';
import { Footer } from '../Footer';
import { LEGAL_CONTENT, LEGAL_PATHS, type LegalPath } from './legal-content';

function isLegalPath(value: string): value is LegalPath {
  return (LEGAL_PATHS as readonly string[]).includes(value);
}

export function LegalPage() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, '') || '/';
  if (!isLegalPath(path)) return null;
  const content = LEGAL_CONTENT[path];
  return (
    <div className="min-h-screen flex flex-col bg-[paper-2]">
      <main className="max-w-3xl mx-auto px-4 py-10 flex-grow w-full">
        <Link to="/" className="text-sm text-[accent] hover:underline">← 返回首页</Link>
        <h1 className="mt-4 text-2xl font-bold text-[ink]">{content.title}</h1>
        {content.sections.map((section) => (
          <section key={section.heading} className="mt-6">
            <h2 className="text-lg font-bold text-[ink]">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-2 text-[ink] leading-relaxed">{paragraph}</p>
            ))}
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
