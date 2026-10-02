import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { AdUnit } from '../../ads/AdUnit';
import { getReferencePage } from '../../data/reference';
import { CATEGORY_COPY } from '../../data/reference/en/categories';
import { categoryPath, ENGLISH_HOME, isReferenceCategory } from '../../reference-routes';
import { BlockRenderer } from './blocks/BlockRenderer';
import { FaqSection } from './FaqSection';
import { PrintButton } from './PrintButton';
import { ReferenceLayout } from './ReferenceLayout';
import { ReferenceNotFound } from './ReferenceNotFound';
import { RelatedCharts } from './RelatedCharts';

/**
 * `/en/:category/:slug` —— 一张可打印的参考图表。
 *
 * 渲染顺序固定：面包屑 → H1 → intro → blocks → howToUse → 广告 → FAQ → related。
 * 广告落在数据块之后、FAQ 之前，是为了让打印输出与正文阅读都不被广告打断。
 */
export function ReferencePage(): ReactElement {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const candidate =
    category && slug && isReferenceCategory(category) ? getReferencePage(slug) : undefined;
  // 学科必须与 URL 一致，否则 /en/math/irregular-verbs/ 会产出同一份内容的第二个 URL。
  const page = candidate && candidate.category === category ? candidate : undefined;

  if (!page) {
    return (
      <ReferenceLayout>
        <ReferenceNotFound />
      </ReferenceLayout>
    );
  }

  const related = page.related
    .map((relatedSlug) => getReferencePage(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  return (
    <ReferenceLayout>
      <nav aria-label="Breadcrumb" className="text-sm text-[#646A73] print:hidden">
        <a href={ENGLISH_HOME} className="hover:text-[#1F2329] transition-colors">
          All charts
        </a>
        <span className="mx-2">/</span>
        <a href={categoryPath(page.category)} className="hover:text-[#1F2329] transition-colors">
          {CATEGORY_COPY[page.category].name}
        </a>
      </nav>

      <article className="mt-4 bg-white rounded-2xl border border-[#F0F1F2] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F0F1F2] bg-gradient-to-r from-blue-50 to-white flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2329]">{page.title}</h1>
            <p className="mt-1 text-sm text-[#646A73] print:hidden">{page.description}</p>
          </div>
          <span className="shrink-0 px-3 py-1 bg-blue-100 text-[#3370FF] text-xs font-medium rounded-full print:hidden">
            {CATEGORY_COPY[page.category].name}
          </span>
        </div>

        <div className="p-6">
          <p className="text-[#1F2329] leading-relaxed print:hidden">{page.intro}</p>

          <BlockRenderer blocks={page.blocks} />

          <section className="mt-10 print:hidden" aria-labelledby="how-to-use-heading">
            <h2 id="how-to-use-heading" className="text-xl font-bold text-[#1F2329]">
              How to use it
            </h2>
            <ul className="mt-4 space-y-2 list-disc pl-5 text-[#1F2329]">
              {page.howToUse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="mt-6 flex justify-end print:hidden">
            <PrintButton />
          </div>
        </div>
      </article>

      <div className="print:hidden">
        <AdUnit placement="referenceBottom" />
      </div>

      <FaqSection faq={page.faq} />

      <RelatedCharts pages={related} />
    </ReferenceLayout>
  );
}
