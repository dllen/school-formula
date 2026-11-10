import type { ReactElement } from 'react';
import { Icon } from '../icons/Icon';

/** 图表页的 FAQ。同时是 FAQPage 结构化数据的数据源。 */
export function FaqSection({
  faq,
}: {
  faq: readonly { q: string; a: string }[];
}): ReactElement | null {
  if (faq.length === 0) return null;
  return (
    <section className="section print:hidden" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="section-head">
        Frequently asked questions
      </h2>
      <div className="mt-3 border-t border-rule">
        {faq.map((entry) => (
          <details key={entry.q} className="group border-b border-divider">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-title font-semibold text-ink transition-colors hover:text-accent-hover [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">{entry.q}</span>
              <Icon
                name="chevron-down"
                className="mt-1 h-4 w-4 shrink-0 text-ink-3 transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="max-w-prose pb-4 text-body-s text-ink-2">{entry.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
