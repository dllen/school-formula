import { getReferencePage } from '../data/reference';
import type { Language } from '../i18n/languages';
import { ENGLISH_HOME, referenceSlugForAppPath } from '../reference-routes';
import { brandFor } from './site';
import type { Breadcrumb, PageContent } from './types';

/**
 * The English surface's page copy: a small set of printable reference charts
 * (`/en/` and `/en/reference/:slug`). Deliberately scoped — not a translation of the app.
 *
 * 注意：本阶段仍是 `kind: 'view'` 与 `{title} - {brand}` 标题格式。换成
 * `LearningResource` / `FAQPage` 与 "Printable …" 标题模板属于 SEO 阶段。
 */
export function resolveEnglishContent(appPath: string, path: string, language: Language): PageContent {
  const brand = brandFor(language);
  const home: Breadcrumb = { name: 'Home', path: ENGLISH_HOME };

  if (appPath === '/') {
    return {
      kind: 'home',
      title: `${brand.name} - ${brand.tagline}`,
      description: brand.description,
      breadcrumbs: [home],
    };
  }

  const slug = referenceSlugForAppPath(appPath);
  const page = slug ? getReferencePage(slug) : undefined;
  if (page) {
    return {
      kind: 'view',
      title: `${page.title} - ${brand.name}`,
      description: page.description,
      breadcrumbs: [home, { name: page.title, path }],
    };
  }

  return { kind: 'view', title: brand.name, description: brand.description, breadcrumbs: [home] };
}
