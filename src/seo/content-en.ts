import { getReferencePage, pagesInCategory } from '../data/reference';
import { CATEGORY_COPY } from '../data/reference/en/categories';
import type { Language } from '../i18n/languages';
import {
  categoryPath,
  ENGLISH_HOME,
  isReferenceCategory,
  referencePartsForAppPath,
  referencePath,
} from '../reference-routes';
import { brandFor } from './site';
import type { Breadcrumb, PageContent } from './types';

/**
 * 英文面的页面文案：`/en/`、三个学科 hub 与各张图表页。
 * 有意保持狭窄——这不是中文 app 的翻译。
 */
export function resolveEnglishContent(
  appPath: string,
  path: string,
  language: Language,
): PageContent {
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

  const parts = referencePartsForAppPath(appPath);
  if (parts && isReferenceCategory(parts.category)) {
    const page = getReferencePage(parts.slug);
    if (page && page.category === parts.category) {
      return {
        kind: 'reference',
        title: `${page.title} - ${brand.name}`,
        description: page.description,
        breadcrumbs: [
          home,
          { name: CATEGORY_COPY[page.category].name, path: categoryPath(page.category) },
          { name: page.title, path },
        ],
        resource: {
          name: page.title,
          description: page.description,
          category: CATEGORY_COPY[page.category].name,
        },
        faq: page.faq,
      };
    }
  }

  const hub = /^\/([^/]+)\/?$/.exec(appPath);
  if (hub && isReferenceCategory(hub[1])) {
    const copy = CATEGORY_COPY[hub[1]];
    return {
      kind: 'hub',
      title: `${copy.name} Reference Charts - ${brand.name}`,
      description: copy.intro,
      breadcrumbs: [home, { name: copy.name, path }],
      category: copy.name,
      charts: pagesInCategory(hub[1]).map((page) => ({
        name: page.title,
        path: referencePath(page.category, page.slug),
      })),
    };
  }

  return { kind: 'view', title: brand.name, description: brand.description, breadcrumbs: [home] };
}
