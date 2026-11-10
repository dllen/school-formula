import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { pagesInCategory } from '../../data/reference';
import { CATEGORY_COPY } from '../../data/reference/en/categories';
import { ENGLISH_HOME, isReferenceCategory, referencePath } from '../../reference-routes';
import { Icon } from '../icons/Icon';
import { ReferenceLayout } from './ReferenceLayout';
import { ReferenceNotFound } from './ReferenceNotFound';

/** `/en/:category` —— 一个学科的图表 hub，同时是该科图表的内链枢纽。 */
export function ReferenceCategory(): ReactElement {
  const { category } = useParams<{ category: string }>();

  if (!category || !isReferenceCategory(category)) {
    return (
      <ReferenceLayout>
        <ReferenceNotFound />
      </ReferenceLayout>
    );
  }

  const copy = CATEGORY_COPY[category];
  const pages = pagesInCategory(category);

  return (
    <ReferenceLayout>
      <nav aria-label="Breadcrumb" className="breadcrumb print:hidden">
        <a href={ENGLISH_HOME}>All charts</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{copy.name}</span>
      </nav>

      <div className="page-head mt-4">
        <div className="page-head__text">
          <h1 className="page-title">{copy.name}</h1>
          <p className="page-lead max-w-prose">{copy.intro}</p>
        </div>
      </div>

      <ul className="border-t border-rule">
        {pages.map((page) => (
          <li key={page.slug} className="border-b border-divider">
            <a
              href={referencePath(page.category, page.slug)}
              className="group -mx-3 flex items-start justify-between gap-4 rounded-md px-3 py-4 transition-colors hover:bg-paper-2"
            >
              <span className="min-w-0">
                <h2 className="text-title font-semibold text-ink">{page.title}</h2>
                <span className="mt-1 block max-w-prose text-body-s text-ink-2">{page.summary}</span>
              </span>
              <Icon
                name="chevron-right"
                className="mt-1 h-4 w-4 shrink-0 text-rule-strong transition-colors group-hover:text-ink-2"
              />
            </a>
          </li>
        ))}
      </ul>
    </ReferenceLayout>
  );
}
