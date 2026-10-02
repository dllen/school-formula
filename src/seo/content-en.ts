import { getReferenceTable } from '../data/reference';
import type { Language } from '../i18n/languages';
import { ENGLISH_HOME, referenceSlugForAppPath } from '../reference-routes';
import { brandFor } from './site';
import type { Breadcrumb, PageContent } from './types';

/**
 * The English surface's page copy: a small set of printable reference charts
 * (`/en/` and `/en/reference/:slug`). Deliberately scoped — not a translation of the app.
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
  const table = slug ? getReferenceTable(slug) : undefined;
  if (table) {
    return {
      kind: 'view',
      title: `${table.title} - ${brand.name}`,
      description: table.description,
      breadcrumbs: [home, { name: table.title, path }],
    };
  }

  return { kind: 'view', title: brand.name, description: brand.description, breadcrumbs: [home] };
}
