import type { ViewType } from '../components/Header/types';
import { LEGAL_CONTENT, LEGAL_PATHS, type LegalPath } from '../components/legal/legal-content';
import { KNOWLEDGE_DATA } from '../data/knowledge';
import { ALL_POEMS } from '../data/poems';
import {
  YUWEN_BOOKS,
  YUWEN_CHARS,
  YUWEN_DUOYIN,
  YUWEN_LESSONS,
  charByChar,
  stemByStem,
} from '../data/yuwen';
import type { GradeData, KnowledgePoint, Subject } from '../data/types';
import type { Language } from '../i18n/languages';
import { HTML_SITEMAP_PATH } from '../sitemap';
import { viewFromPath } from '../view-routes';
import { brandFor } from './site';
import type { BrandCopy } from './site';
import type { Breadcrumb, PageContent } from './types';

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
  poetry: {
    title: '古诗词学习',
    description:
      '收录新课标必背唐诗宋词，按朝代、学段、题材筛选。每首含原文、拼音、译文与赏析，方便中小学生背诵与理解。',
  },
};

/** Resolve an unprefixed route to the Chinese app's page copy. */
export function resolveChineseContent(appPath: string, path: string, language: Language): PageContent {
  const brand = brandFor(language);

  if (appPath === '/') {
    return {
      kind: 'home',
      title: `${brand.name} - ${brand.tagline}`,
      description: brand.description,
      breadcrumbs: [HOME_BREADCRUMB],
    };
  }

  const knowledgeId = /^\/knowledge\/([^/]+)\/?$/.exec(appPath)?.[1];
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

  const poemId = /^\/poetry\/([^/]+)\/?$/.exec(appPath)?.[1];
  const poem = poemId ? ALL_POEMS.find((p) => p.id === poemId) : undefined;
  if (poem) {
    const dynastyLabel = poem.dynasty === 'tang' ? '唐' : '宋';
    return {
      kind: 'poem',
      title: `${poem.title}（${dynastyLabel}·${poem.author}） - ${brand.name}`,
      description: poem.appreciation
        ? `${poem.translation} ${poem.appreciation}`
        : poem.translation,
      breadcrumbs: [
        HOME_BREADCRUMB,
        { name: '古诗词', path: '/poetry' },
        { name: poem.title, path },
      ],
      resource: {
        name: poem.title,
        description: poem.translation,
        author: poem.author,
        dynasty: dynastyLabel,
      },
    };
  }

  if (appPath === HTML_SITEMAP_PATH) {
    return {
      kind: 'view',
      title: `站点地图 - ${brand.name}`,
      description: '拾艺院全部可索引页面索引：按学段、学科、古诗词与英文速查表分类。',
      breadcrumbs: [HOME_BREADCRUMB, { name: '站点地图', path: HTML_SITEMAP_PATH }],
    };
  }

  if ((LEGAL_PATHS as readonly string[]).includes(appPath)) {
    const c = LEGAL_CONTENT[appPath as LegalPath];
    return {
      kind: 'view',
      title: `${c.title} - ${brand.name}`,
      description: c.description,
      breadcrumbs: [HOME_BREADCRUMB, { name: c.title, path: appPath }],
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

  const yuwen = resolveYuwenContent(appPath, brand);
  if (yuwen) return yuwen;

  return { kind: 'view', title: brand.name, description: brand.description, breadcrumbs: [HOME_BREADCRUMB] };
}

const YUWEN_BASE_CRUMB: Breadcrumb = { name: '小学语文', path: '/yuwen' };

function notFoundYuwen(title: string, description: string): PageContent {
  return {
    kind: 'view',
    title,
    description,
    breadcrumbs: [HOME_BREADCRUMB, YUWEN_BASE_CRUMB],
  };
}

/** /yuwen 及子路由的 head 文案，全部按数据派生；未知子路径返回 null 走兜底。 */
function resolveYuwenContent(appPath: string, brand: BrandCopy): PageContent | null {
  if (appPath !== '/yuwen' && !appPath.startsWith('/yuwen/')) return null;
  const crumbBase = [HOME_BREADCRUMB, YUWEN_BASE_CRUMB];

  if (/^\/yuwen\/?$/.test(appPath)) {
    return {
      kind: 'view',
      title: '小学语文生字表（人教版 1–5 年级） - ' + brand.name,
      description:
        '人教版小学语文 1–5 年级共 ' + YUWEN_BOOKS.length + ' 册、' + YUWEN_LESSONS.length + ' 课、' +
        YUWEN_CHARS.length + ' 个生字：按课文查读音、同音字、形近字与组词，可按单元复习并打印听写单。',
      breadcrumbs: crumbBase,
    };
  }

  const bookMatch = /^\/yuwen\/book\/([^/]+)\/?$/.exec(appPath);
  if (bookMatch) {
    const book = YUWEN_BOOKS.find((b) => b.id === bookMatch[1]);
    if (!book) return notFoundYuwen('小学语文 - ' + brand.name, '没有这册课本。');
    return {
      kind: 'view',
      title: book.title + '生字表（' + book.lessonCount + ' 课 · ' + book.charCount + ' 字） - ' + brand.name,
      description:
        book.title + '按单元列出全部课文与生字，可进入单课看读音与组词，或按单元做生字复习、打印听写单。',
      breadcrumbs: [...crumbBase, { name: book.title, path: '/yuwen/book/' + book.id }],
    };
  }

  const lessonMatch = /^\/yuwen\/lesson\/([^/]+)\/?$/.exec(appPath);
  if (lessonMatch) {
    const lesson = YUWEN_LESSONS.find((l) => l.id === lessonMatch[1]);
    if (!lesson) return notFoundYuwen('小学语文 - ' + brand.name, '没有这一课。');
    const book = YUWEN_BOOKS.find((b) => b.id === lesson.bookId);
    return {
      kind: 'view',
      title: lesson.title + ' · 生字与组词 - ' + brand.name,
      description:
        (book ? book.title + ' · ' : '') + lesson.title + ' 的 ' + lesson.chars.length +
        ' 个生字：读音、同音字、形近字与组词，可一键生成听写单。',
      breadcrumbs: [
        ...crumbBase,
        ...(book ? [{ name: book.title, path: '/yuwen/book/' + book.id }] : []),
        { name: lesson.title, path: '/yuwen/lesson/' + lesson.id },
      ],
    };
  }

  const reviewMatch = /^\/yuwen\/(review|tingxie)\/([1-5][ab])\/(\d+)\/?$/.exec(appPath);
  if (reviewMatch) {
    const book = YUWEN_BOOKS.find((b) => b.id === reviewMatch[2]);
    if (!book) return notFoundYuwen('小学语文 - ' + brand.name, '没有这个单元。');
    const isTingxie = reviewMatch[1] === 'tingxie';
    return {
      kind: 'view',
      title:
        book.title + '第 ' + reviewMatch[3] + ' 单元' + (isTingxie ? '听写单' : '生字复习') + ' - ' + brand.name,
      description:
        book.title + '第 ' + reviewMatch[3] + ' 单元的' +
        (isTingxie
          ? '可打印听写单：按课本顺序或打乱，可选是否给词语提示、是否附答案。'
          : '生字复习：按课文分组列出本单元全部生字。'),
      breadcrumbs: [
        ...crumbBase,
        { name: book.title, path: '/yuwen/book/' + book.id },
        { name: '第 ' + reviewMatch[3] + ' 单元', path: '/yuwen/review/' + book.id + '/' + reviewMatch[3] },
      ],
    };
  }

  const charMatch = /^\/yuwen\/char\/([^/]+)\/?$/.exec(appPath);
  if (charMatch) {
    let ch: string;
    try {
      ch = decodeURIComponent(charMatch[1]);
    } catch {
      // 非法百分号编码：当作未知路由，走通用兜底而不是抛错
      return null;
    }
    const item = charByChar(ch);
    if (!item) return notFoundYuwen('小学语文 - ' + brand.name, '没有这个字。');
    const readings = item.readings.map((r) => r.py).join('、');
    return {
      kind: 'view',
      title: ch + '（' + readings + '）的读音、笔顺、组词与字形 - ' + brand.name,
      description:
        '「' + ch + '」的读音（' + readings + '）、笔顺动画、同音字、含该字的字形与组词，以及它出现在哪一课。',
      breadcrumbs: [...crumbBase, { name: ch, path: '/yuwen/char/' + ch }],
    };
  }

  if (/^\/yuwen\/pinyin\/?$/.test(appPath)) {
    return {
      kind: 'view',
      title: '拼音表 · 按韵母与声调查生字 - ' + brand.name,
      description: '按韵母与声调排列全部生字，点击任一字进入读音、组词与笔顺详情。',
      breadcrumbs: [...crumbBase, { name: '拼音表', path: '/yuwen/pinyin' }],
    };
  }

  const stemMatch = /^\/yuwen\/pinyin\/([^/]+)\/?$/.exec(appPath);
  if (stemMatch) {
    const stem = stemByStem(stemMatch[1]);
    if (!stem) return notFoundYuwen('小学语文 - ' + brand.name, '没有这个韵母。');
    return {
      kind: 'view',
      title: '拼音表 · ' + stem.stem + ' 的生字 - ' + brand.name,
      description: '韵母 ' + stem.stem + ' 下按声调排列的全部生字，可进入单字看读音与组词。',
      breadcrumbs: [
        ...crumbBase,
        { name: '拼音表', path: '/yuwen/pinyin' },
        { name: stem.stem, path: '/yuwen/pinyin/' + stem.stem },
      ],
    };
  }

  if (/^\/yuwen\/duoyin\/?$/.test(appPath)) {
    return {
      kind: 'view',
      title: '多音字（' + YUWEN_DUOYIN.length + ' 个） - ' + brand.name,
      description: '小学阶段常见的 ' + YUWEN_DUOYIN.length + ' 个多音字：每个读音列出常用词与它出现的课文。',
      breadcrumbs: [...crumbBase, { name: '多音字', path: '/yuwen/duoyin' }],
    };
  }

  return null;
}
