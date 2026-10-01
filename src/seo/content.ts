import type { ViewType } from '../components/Header/types';
import { getReferenceTable, REFERENCE_SLUGS } from '../data/reference';
import { KNOWLEDGE_DATA } from '../data/knowledge';
import type { GradeData, KnowledgePoint, Subject } from '../data/types';
import { appPathFor, languageForPath, type Language } from '../i18n/languages';
import { viewFromPath } from '../view-routes';
import { brandFor } from './site';

/** A breadcrumb entry. `path` is omitted for non-linkable levels (e.g. a grade). */
export interface Breadcrumb {
  name: string;
  path?: string;
}

/** Normalized page metadata a route resolves to, before URL/schema composition. */
export type PageContent =
  | { kind: 'home'; title: string; description: string; breadcrumbs: Breadcrumb[] }
  | { kind: 'view'; title: string; description: string; breadcrumbs: Breadcrumb[] }
  | {
      kind: 'knowledge';
      title: string;
      description: string;
      breadcrumbs: Breadcrumb[];
      resource: { name: string; description: string; subject: string; grade: string };
    };

interface KnowledgeEntry {
  point: KnowledgePoint;
  subject: Subject;
  grade: GradeData;
  /** 1-based rank among knowledge points sharing a title within the same subject+grade. */
  ordinal: number;
}

const KNOWLEDGE_INDEX: Map<string, KnowledgeEntry> = (() => {
  const index = new Map<string, KnowledgeEntry>();
  const titleCounts = new Map<string, number>();
  for (const grade of KNOWLEDGE_DATA) {
    for (const subject of grade.subjects) {
      for (const point of subject.knowledgePoints) {
        const key = `${point.title}\u0000${subject.name}\u0000${grade.name}`;
        const ordinal = (titleCounts.get(key) ?? 0) + 1;
        titleCounts.set(key, ordinal);
        index.set(point.id, { point, subject, grade, ordinal });
      }
    }
  }
  return index;
})();

const HOME_BREADCRUMB: Breadcrumb = { name: '首页', path: '/' };

/** Title/description copy for each non-knowledge view route. */
const VIEW_CONTENT: Record<Exclude<ViewType, 'knowledge'>, { title: string; description: string }> = {
  tutorial: {
    title: '系统教程',
    description:
      '按「教 · 学 · 练」结构编排的中小学系统教程，每课包含学习目标、知识讲解、例题精讲、亲子互动与课后练习。',
  },
  cheatsheet: {
    title: '速查表',
    description:
      '九九乘法表、除法表、常用汉字、成语、元素周期表、三角函数公式等可打印速查表，随时查阅。',
  },
  'mental-math': {
    title: '口算练习',
    description:
      '按学段与难度生成口算题，支持在线练习与即时批改，帮助中小学学生提升计算速度与准确率。',
  },
  formula: {
    title: '公式速查',
    description: '汇总数学、物理、化学等学科的常用公式，按主题分类，便于复习与解题时快速查阅。',
  },
  mastery: {
    title: '掌握度追踪',
    description: '解题技巧与掌握度进度追踪，帮助家长和学生定位薄弱知识点，规划复习路径。',
  },
  practice: {
    title: '题库练习',
    description: '分学段学科题库，支持选择题、判断题、填空题练习，自动批改并记录错题本。',
  },
  notes: {
    title: '学习笔记',
    description: '记录与整理学习笔记，把知识点、错题与心得集中沉淀，方便复习回顾。',
  },
  zizhi: {
    title: '《资治通鉴》阅读',
    description: '在线阅读《资治通鉴》部分篇章并配合注释，供学生进行古文阅读与文史积累。',
  },
  shiji: {
    title: '《史记》阅读',
    description: '在线阅读《史记》部分篇章并配合注释，供学生进行古文阅读与文史积累。',
  },
  'ai-chat': {
    title: 'AI 智能助教',
    description:
      'AI 智能助教：围绕知识点生成深度解析、生活场景、亲子互动与实战测验，帮助家长更有方法地辅导孩子。',
  },
};

function knowledgeIdFromAppPath(appPath: string): string | null {
  const match = /^\/knowledge\/([^/]+)\/?$/.exec(appPath);
  return match ? match[1] : null;
}

function referenceSlugFromAppPath(appPath: string): string | null {
  const match = /^\/reference\/([^/]+)\/?$/.exec(appPath);
  return match ? match[1] : null;
}

function resolveChineseContent(appPath: string, path: string, language: Language): PageContent {
  const brand = brandFor(language);

  if (appPath === '/') {
    return {
      kind: 'home',
      title: `${brand.name} - ${brand.tagline}`,
      description: brand.description,
      breadcrumbs: [HOME_BREADCRUMB],
    };
  }

  const knowledgeId = knowledgeIdFromAppPath(appPath);
  const entry = knowledgeId ? KNOWLEDGE_INDEX.get(knowledgeId) : undefined;
  if (entry) {
    const { point, subject, grade, ordinal } = entry;
    // A handful of knowledge points share a name within the same subject; the ordinal
    // keeps their <title> distinct so no two pages ship an identical title.
    const name = ordinal > 1 ? `${point.title}（${ordinal}）` : point.title;
    return {
      kind: 'knowledge',
      title: `${name} - ${subject.name}（${grade.name}） - ${brand.name}`,
      description: `【${grade.name}${subject.name}】${point.description}`,
      breadcrumbs: [
        HOME_BREADCRUMB,
        { name: `${grade.name} · ${subject.name}` },
        { name: point.title, path },
      ],
      resource: {
        name: point.title,
        description: point.description,
        subject: subject.name,
        grade: grade.name,
      },
    };
  }

  const view = viewFromPath(appPath);
  if (view && view !== 'knowledge') {
    const content = VIEW_CONTENT[view];
    return {
      kind: 'view',
      title: `${content.title} - ${brand.name}`,
      description: content.description,
      breadcrumbs: [HOME_BREADCRUMB, { name: content.title, path }],
    };
  }

  return { kind: 'view', title: brand.name, description: brand.description, breadcrumbs: [HOME_BREADCRUMB] };
}

/**
 * The English surface: a small set of printable reference charts (`/en/` and
 * `/en/reference/:slug`). Deliberately scoped — not a translation of the Chinese app.
 */
function resolveEnglishContent(appPath: string, path: string, language: Language): PageContent {
  const brand = brandFor(language);
  const home: Breadcrumb = { name: 'Home', path: '/en' };

  if (appPath === '/') {
    return {
      kind: 'home',
      title: `${brand.name} - ${brand.tagline}`,
      description: brand.description,
      breadcrumbs: [home],
    };
  }

  const slug = referenceSlugFromAppPath(appPath);
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

/**
 * Resolve any route to the page content used for its head tags. Total function:
 * unknown routes fall back to generic site copy rather than throwing.
 */
export function resolvePageContent(path: string): PageContent {
  const language = languageForPath(path);
  const appPath = appPathFor(path, language);
  return language.code === 'en'
    ? resolveEnglishContent(appPath, path, language)
    : resolveChineseContent(appPath, path, language);
}

/** English reference routes, reused by the prerender route list and sitemap. */
export const ENGLISH_REFERENCE_PATHS: readonly string[] = [
  '/en',
  ...REFERENCE_SLUGS.map((slug) => `/en/reference/${slug}`),
];
