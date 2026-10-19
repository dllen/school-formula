import { CATEGORY_COPY } from './data/reference/en/categories';
import { REFERENCE_PAGES } from './data/reference';
import { LEGAL_CONTENT, LEGAL_PATHS } from './components/legal/legal-content';
import { ALL_POEMS } from './data/poems';
import { KNOWLEDGE_DATA } from './data/knowledge';
import {
  categoryPath,
  ENGLISH_HOME,
  referencePath,
} from './reference-routes';
import { VIEW_PATHS } from './view-routes';

/** Canonical path of the HTML sitemap page. Also serves as the constant the prerender
 *  pipeline imports when it needs to register the route and decide whether to keep it
 *  in the XML sitemap. */
export const HTML_SITEMAP_PATH = '/sitemap';

/** A single link inside a sitemap group. */
export interface SitemapLink {
  label: string;
  path: string;
}

/** A named group of links rendered as one `<section>` on the HTML sitemap page. */
export interface SitemapGroup {
  title: string;
  links: SitemapLink[];
}

/** 中文视图名：与 `src/seo/content-zh.ts` 的 `VIEW_CONTENT` 取相同措辞。 */
const VIEW_LABELS: Record<keyof typeof VIEW_PATHS, string> = {
  tutorial: '教程',
  cheatsheet: '速查表',
  'mental-math': '口算练习',
  formula: '公式速查',
  mastery: '掌握度',
  practice: '题库练习',
  notes: '学习笔记',
  zizhi: '《资治通鉴》阅读',
  shiji: '《史记》阅读',
  'ai-chat': 'AI 智能助教',
  poetry: '古诗词',
};

/**
 * Build every group the HTML sitemap renders, in display order.
 *
 * The XML sitemap (built from PRERENDER_PATHS) keeps a flat list with `/sitemap` removed;
 * the HTML sitemap groups them so a human or a crawler can scan them by topic.
 */
export function buildHtmlSitemap(): SitemapGroup[] {
  const learningViews: SitemapGroup = {
    title: '学习视图',
    links: [
      { label: '首页（知识点）', path: '/' },
      ...(Object.entries(VIEW_PATHS) as [keyof typeof VIEW_PATHS, string][]).map(
        ([key, path]) => ({ label: VIEW_LABELS[key], path }),
      ),
    ],
  };

  const knowledgeGroups: SitemapGroup[] = KNOWLEDGE_DATA.map((grade) => ({
    title: grade.name,
    links: grade.subjects.flatMap((subject) =>
      subject.knowledgePoints.map((point) => ({
        label: `${subject.name} · ${point.title}`,
        path: `/knowledge/${point.id}`,
      })),
    ),
  }));

  const poetryGroup: SitemapGroup = {
    title: '古诗词',
    links: ALL_POEMS.map((poem) => ({
      label: poem.title,
      path: `/poetry/${poem.id}`,
    })),
  };

  const englishReference: SitemapGroup = {
    title: 'English reference',
    links: [
      { label: 'English home', path: ENGLISH_HOME },
      ...REFERENCE_PAGES.map((page) => ({
        label: page.title,
        path: referencePath(page.category, page.slug),
      })),
    ],
  };

  const englishHubs: SitemapGroup = {
    title: 'English hubs',
    links: (Object.keys(CATEGORY_COPY) as Array<keyof typeof CATEGORY_COPY>).map((category) => ({
      label: CATEGORY_COPY[category].name,
      path: categoryPath(category),
    })),
  };

  const legalGroup: SitemapGroup = {
    title: '站点信息',
    links: LEGAL_PATHS.map((p) => ({ label: LEGAL_CONTENT[p].title, path: p })),
  };

  return [learningViews, ...knowledgeGroups, poetryGroup, englishReference, englishHubs, legalGroup];
}

/** Flatten the grouped structure into a list of paths in display order. */
export function flattenSitemap(groups: readonly SitemapGroup[]): string[] {
  return groups.flatMap((group) => group.links.map((link) => link.path));
}
