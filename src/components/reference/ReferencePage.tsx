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
 * 渲染顺序固定：面包屑，标题块（含打印动作），intro，blocks，howToUse，广告，FAQ，related。
 * 广告落在数据块之后、FAQ 之前，是为了让打印输出与正文阅读都不被广告打断。
 * 打印输出保持原样：只有 H1 与数据块，其余分区都带 print:hidden。
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
      <nav aria-label="Breadcrumb" className="breadcrumb print:hidden">
        <a href={ENGLISH_HOME}>All charts</a>
        <span aria-hidden="true">/</span>
        <a href={categoryPath(page.category)}>{CATEGORY_COPY[page.category].name}</a>
      </nav>

      <div className="page-head mt-4">
        <div className="page-head__text">
          <h1 className="page-title">{page.title}</h1>
          <p className="page-lead max-w-prose print:hidden">{page.description}</p>
        </div>
        <PrintButton />
      </div>

      <p className="prose-body print:hidden">{page.intro}</p>

      <BlockRenderer blocks={page.blocks} />

      <section className="section print:hidden" aria-labelledby="how-to-use-heading">
        <h2 id="how-to-use-heading" className="section-head">
          How to use it
        </h2>
        <ul className="mt-3 max-w-prose list-disc space-y-2 pl-5 text-body text-ink">
          {page.howToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="mt-10 print:hidden">
        <AdUnit placement="referenceBottom" />
      </div>

      <FaqSection faq={page.faq} />

      <RelatedCharts pages={related} />
    </ReferenceLayout>
  );
}
