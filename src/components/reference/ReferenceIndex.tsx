import type { ReactElement } from 'react';
import { CATEGORY_COPY } from '../../data/reference/en/categories';
import { categoryPath, REFERENCE_CATEGORIES } from '../../reference-routes';
import { ReferenceLayout } from './ReferenceLayout';

/** `/en/` —— 英文面的落地页：站点简介 + 三个学科入口。 */
export function ReferenceIndex(): ReactElement {
  return (
    <ReferenceLayout>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2329]">Printable Study Reference</h1>
        <p className="mt-2 max-w-2xl text-[#646A73]">
          Free, printable reference charts for students, parents and teachers. Pick a subject to see
          every chart — open one and print it in a single click.
        </p>
      </section>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REFERENCE_CATEGORIES.map((category) => {
          const copy = CATEGORY_COPY[category];
          return (
            <li key={category}>
              <a
                href={categoryPath(category)}
                className="flex h-full flex-col bg-white rounded-2xl border border-[#F0F1F2] shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <h2 className="text-lg font-bold text-[#1F2329]">{copy.name}</h2>
                <p className="mt-2 text-sm text-[#646A73]">{copy.summary}</p>
              </a>
            </li>
          );
        })}
      </ul>
    </ReferenceLayout>
  );
}
