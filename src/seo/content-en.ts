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
import type { BrandCopy } from './site';
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
        title: englishTitleFor(page.title, brand),
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
      title: englishTitleFor(`${copy.name} Charts`, brand),
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

/** 品牌短名，缺省退回全名。 */
function titleBrand(brand: BrandCopy): string {
  return brand.titleBrand ?? brand.name;
}

/**
 * 英文面标题模板：意图修饰词在前、品牌在后。
 *
 * 只写 "Printable" 不写 "PDF"——我们提供的是浏览器打印，不发 PDF 文件；
 * 宣称 PDF 而用户落地后找不到下载按钮就是跳出。
 */
export function englishTitleFor(subject: string, brand: BrandCopy): string {
  return `Printable ${subject} – Free | ${titleBrand(brand)}`;
}
