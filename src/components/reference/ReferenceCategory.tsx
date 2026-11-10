import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { pagesInCategory } from '../../data/reference';
import { CATEGORY_COPY } from '../../data/reference/en/categories';
import { ENGLISH_HOME, isReferenceCategory, referencePath } from '../../reference-routes';
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
      <nav aria-label="Breadcrumb" className="text-sm text-[ink-2] print:hidden">
        <a href={ENGLISH_HOME} className="hover:text-[ink] transition-colors">
          All charts
        </a>
      </nav>

      <section className="mt-4">
        <h1 className="text-3xl font-bold text-[ink]">{copy.name}</h1>
        <p className="mt-2 max-w-2xl text-[ink-2]">{copy.intro}</p>
      </section>

      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pages.map((page) => (
          <li key={page.slug}>
            <a
              href={referencePath(page.category, page.slug)}
              className="flex h-full flex-col bg-white rounded-2xl border border-[divider] shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <h2 className="text-lg font-bold text-[ink]">{page.title}</h2>
              <p className="mt-2 text-sm text-[ink-2]">{page.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </ReferenceLayout>
  );
}
