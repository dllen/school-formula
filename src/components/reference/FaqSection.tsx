import type { ReactElement } from 'react';

/** 图表页的 FAQ。同时是 FAQPage 结构化数据的数据源。 */
export function FaqSection({
  faq,
}: {
  faq: readonly { q: string; a: string }[];
}): ReactElement | null {
  if (faq.length === 0) return null;
  return (
    <section className="mt-10 print:hidden" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-bold text-[#1F2329]">
        Frequently asked questions
      </h2>
      <dl className="mt-4 space-y-3">
        {faq.map((entry) => (
          <div key={entry.q} className="bg-white rounded-xl border border-[#F0F1F2] p-5">
            <dt className="font-semibold text-[#1F2329]">{entry.q}</dt>
            <dd className="mt-1 text-sm text-[#646A73]">{entry.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
