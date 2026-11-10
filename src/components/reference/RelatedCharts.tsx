import type { ReactElement } from 'react';
import type { ReferencePage } from '../../data/reference/types';
import { referencePath } from '../../reference-routes';

/** 相关图表内链。空列表时整段不渲染，而不是留一个空标题。 */
export function RelatedCharts({ pages }: { pages: readonly ReferencePage[] }): ReactElement | null {
  if (pages.length === 0) return null;
  return (
    <section className="section print:hidden" aria-labelledby="related-heading">
      <h2 id="related-heading" className="section-head">
        Related charts
      </h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {pages.map((page) => (
          <li key={page.slug}>
            <a href={referencePath(page.category, page.slug)} className="link text-body-s">
              {page.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
