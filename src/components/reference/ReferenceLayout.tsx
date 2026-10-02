import type { ReactNode } from 'react';
import { ENGLISH_HOME } from '../../reference-routes';

/** Shared chrome for the English reference surface (header, footer, language link). */
export function ReferenceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F6F7] font-sans text-slate-800 flex flex-col">
      <header className="bg-white border-b border-[#E5E6EB] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <a href={ENGLISH_HOME} className="flex items-center gap-2">
            <span
              className="bg-[#3370FF] text-white w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[18px] font-semibold"
              aria-hidden="true"
            >
              拾
            </span>
            <span className="text-[18px] font-semibold text-[#1F2329]">Shiyiyuan Study Reference</span>
          </a>
          <nav aria-label="Site" className="flex items-center gap-4 text-sm">
            <a href={ENGLISH_HOME} className="text-[#646A73] hover:text-[#1F2329] transition-colors">
              All charts
            </a>
            <a href="/" className="text-[#3370FF] hover:underline" lang="zh-CN">
              中文
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex-grow w-full">{children}</main>

      <footer className="py-8 text-center text-sm text-[#8F959E] bg-white border-t border-[#F0F1F2]">
        <p>Free printable reference charts for students, parents and teachers.</p>
      </footer>
    </div>
  );
}
