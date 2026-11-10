import type { ReactNode } from 'react';
import { ENGLISH_HOME } from '../../reference-routes';

/** Shared chrome for the English reference surface (header, footer, language link). */
export function ReferenceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[paper-2] font-sans text-ink flex flex-col">
      <header className="bg-white border-b border-[rule] sticky top-0 z-40 print:hidden">
        <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <a href={ENGLISH_HOME} className="flex items-center gap-2">
            <span
              className="bg-[accent] text-white w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[18px] font-semibold"
              aria-hidden="true"
            >
              拾
            </span>
            <span className="text-[18px] font-semibold text-[ink]">Shiyiyuan Study Reference</span>
          </a>
          <nav aria-label="Site" className="flex items-center gap-4 text-sm">
            <a href={ENGLISH_HOME} className="text-[ink-2] hover:text-[ink] transition-colors">
              All charts
            </a>
            <a href="/" className="text-[accent] hover:underline" lang="zh-CN">
              中文
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex-grow w-full">{children}</main>

      <footer className="py-8 text-center text-sm text-[ink-3] bg-white border-t border-[divider] print:hidden">
        <p>Free printable reference charts for students, parents and teachers.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm print:hidden">
          <a href="/privacy" className="text-[ink-2] hover:text-[ink] transition-colors">Privacy</a>
          <a href="/terms" className="text-[ink-2] hover:text-[ink] transition-colors">Terms</a>
          <a href="/about" className="text-[ink-2] hover:text-[ink] transition-colors">About</a>
          <a href="/contact" className="text-[ink-2] hover:text-[ink] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
