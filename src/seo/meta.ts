import { languageForPath, type Language } from '../i18n/languages';
import { resolvePageContent } from './content';
import type { PageContent } from './types';
import { brandFor, SITE, type BrandCopy } from './site';

export interface AlternateLink {
  hreflang: string;
  href: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  /** Absolute canonical URL for this page. */
  canonical: string;
  /** Value for `<html lang>` and JSON-LD `inLanguage`. */
  htmlLang: string;
  alternates: AlternateLink[];
  og: { type: string; siteName: string; title: string; description: string; url: string; locale: string };
  twitter: { card: string; title: string; description: string };
  jsonLd: Record<string, unknown>[];
}

/**
 * Absolute canonical URL for a route. Directory routes resolve to their trailing-slash
 * form because that is what the worker serves (`/tutorial` → 308 → `/tutorial/`).
 */
export function canonicalUrl(path: string): string {
  const withoutQuery = path.split('#')[0].split('?')[0];
  const normalized =
    withoutQuery === '/' || withoutQuery === '' ? '/' : `${withoutQuery.replace(/\/+$/, '')}/`;
  return `${SITE.origin}${normalized}`;
}

function buildJsonLd(
  content: PageContent,
  canonical: string,
  language: Language,
  brand: BrandCopy,
): Record<string, unknown>[] {
  const context = 'https://schema.org';
  const inLanguage = language.code;

  if (content.kind === 'home') {
    return [
      {
        '@context': context,
        '@type': 'WebSite',
        name: brand.name,
        url: canonical,
        description: brand.description,
        inLanguage,
      },
      { '@context': context, '@type': 'Organization', name: brand.name, url: canonical },
    ];
  }

  if (content.kind === 'knowledge') {
    return [
      {
        '@context': context,
        '@type': 'LearningResource',
        name: content.resource.name,
        description: content.resource.description,
        url: canonical,
        inLanguage,
        learningResourceType: '知识点',
        educationalLevel: content.resource.grade,
        about: content.resource.subject,
      },
      breadcrumbJsonLd(content, context),
    ];
  }

  return [
    {
      '@context': context,
      '@type': 'WebPage',
      name: content.title,
      description: content.description,
      url: canonical,
      inLanguage,
    },
    breadcrumbJsonLd(content, context),
  ];
}

function breadcrumbJsonLd(content: PageContent, context: string): Record<string, unknown> {
  return {
    '@context': context,
    '@type': 'BreadcrumbList',
    itemListElement: content.breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: canonicalUrl(crumb.path) } : {}),
    })),
  };
}

/** Derive the complete head metadata for a route. Pure and total. */
export function buildSeoMeta(path: string): SeoMeta {
  const language = languageForPath(path);
  const brand = brandFor(language);
  const content = resolvePageContent(path);
  const canonical = canonicalUrl(path);
  const alternates: AlternateLink[] = [
    { hreflang: language.code, href: canonical },
    { hreflang: 'x-default', href: canonical },
  ];

  return {
    title: content.title,
    description: content.description,
    canonical,
    htmlLang: language.code,
    alternates,
    og: {
      type: content.kind === 'knowledge' ? 'article' : 'website',
      siteName: brand.name,
      title: content.title,
      description: content.description,
      url: canonical,
      locale: brand.ogLocale,
    },
    twitter: { card: 'summary', title: content.title, description: content.description },
    jsonLd: buildJsonLd(content, canonical, language, brand),
  };
}
