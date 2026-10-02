import type { ReactElement } from 'react';
import type { ReferencePage } from '../../data/reference/types';
import { referencePath } from '../../reference-routes';

/** 相关图表内链。空列表时整段不渲染，而不是留一个空标题。 */
export function RelatedCharts({ pages }: { pages: readonly ReferencePage[] }): ReactElement | null {
  if (pages.length === 0) return null;
  return (
    <section className="mt-10 print:hidden" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-bold text-[#1F2329]">
        Related charts
      </h2>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pages.map((page) => (
          <li key={page.slug}>
            <a
              href={referencePath(page.category, page.slug)}
              className="block h-full bg-white rounded-xl border border-[#F0F1F2] p-5 hover:shadow-md transition-shadow"
            >
              <span className="block font-semibold text-[#1F2329]">{page.title}</span>
              <span className="mt-1 block text-sm text-[#646A73]">{page.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
