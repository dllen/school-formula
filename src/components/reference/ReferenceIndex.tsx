import type { ReactElement } from 'react';
import { pagesInCategory } from '../../data/reference';
import { CATEGORY_COPY } from '../../data/reference/en/categories';
import { categoryPath, REFERENCE_CATEGORIES } from '../../reference-routes';
import { Icon } from '../icons/Icon';
import { ReferenceLayout } from './ReferenceLayout';

/** `/en/` —— 英文面的落地页：站点简介 + 三个学科入口。 */
export function ReferenceIndex(): ReactElement {
  return (
    <ReferenceLayout>
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="page-title">Printable Study Reference</h1>
          <p className="page-lead max-w-prose">
            Free, printable reference charts for students, parents and teachers. Pick a subject to
            see every chart. Open one and print it in a single click.
          </p>
        </div>
      </div>

      <ul className="border-t border-rule">
        {REFERENCE_CATEGORIES.map((category) => {
          const copy = CATEGORY_COPY[category];
          const count = pagesInCategory(category).length;
          return (
            <li key={category} className="border-b border-divider">
              <a
                href={categoryPath(category)}
                className="group -mx-3 flex items-start justify-between gap-4 rounded-md px-3 py-5 transition-colors hover:bg-paper-2"
              >
                <span className="min-w-0">
                  <h2 className="text-section font-semibold text-ink">{copy.name}</h2>
                  <span className="mt-1 block max-w-prose text-body-s text-ink-2">
                    {copy.summary}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3 pt-1">
                  <span className="tabular text-caption text-ink-3">
                    {count === 1 ? '1 chart' : `${count} charts`}
                  </span>
                  <Icon
                    name="chevron-right"
                    className="h-4 w-4 text-rule-strong transition-colors group-hover:text-ink-2"
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </ReferenceLayout>
  );
}
