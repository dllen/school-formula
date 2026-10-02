import { DEFAULT_LANGUAGE, type Language } from '../i18n/languages';

/** Canonical origin. All canonical/OG/alternate URLs are absolute against this. */
export const SITE = {
  origin: 'https://syy.global',
} as const;

export interface BrandCopy {
  /** Full site name: title suffix, `og:site_name` and JSON-LD name. */
  name: string;
  /**
   * 短品牌名，**只用于 `<title>`**。全名（如 `Shiyiyuan Study Reference`，26 字符）
   * 拼进标题会让总长超过 Google 约 60 字符的截断点，把意图修饰词挤掉。
   * 不设则退回 `name`（中文标题因此不受影响）。
   */
  titleBrand?: string;
  /** Short one-line positioning used in the home title. */
  tagline: string;
  /** Default page description for the home page and unknown routes. */
  description: string;
  /** Open Graph locale (underscored, e.g. `en_US`). */
  ogLocale: string;
}

/** Site copy per language code. This is the one place to change brand wording. */
const BRAND: Record<string, BrandCopy> = {
  'zh-CN': {
    name: '拾艺院 · 核心知识点库',
    tagline: '中小学核心知识点学习平台',
    description:
      '拾艺院是面向中小学家长与学生的核心知识点学习平台，提供分学段学科知识点、系统教程、题库练习、速查表与 AI 智能助教。',
    ogLocale: 'zh_CN',
  },
  en: {
    name: 'Shiyiyuan Study Reference',
    titleBrand: 'Shiyiyuan',
    tagline: 'Free printable math & science reference charts',
    description:
      'Free, printable reference charts for students, parents and teachers: multiplication tables, square and cube roots, trigonometric identities, physics constants, metric conversions and English irregular verbs.',
    ogLocale: 'en_US',
  },
};

export function brandFor(language: Language = DEFAULT_LANGUAGE): BrandCopy {
  return BRAND[language.code] ?? BRAND[DEFAULT_LANGUAGE.code];
}
