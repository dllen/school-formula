/**
 * Language routing. The URL prefix is the single source of truth for which language a
 * page renders in: an unprefixed path is the default language, `/en/...` is English.
 * (This owns *which* language a path is; per-language copy lives in `src/seo/site.ts`.)
 */
export interface Language {
  /** BCP-47 code, used for `hreflang` and `<html lang>`. */
  code: string;
  /** URL prefix that selects this language. Empty string = unprefixed default. */
  prefix: string;
}

export const LANGUAGES: readonly Language[] = [
  { code: 'zh-CN', prefix: '' },
  { code: 'en', prefix: '/en' },
];

export const DEFAULT_LANGUAGE: Language = LANGUAGES[0];

/** The language a path belongs to; falls back to the default for unprefixed paths. */
export function languageForPath(path: string): Language {
  const match = LANGUAGES.find(
    (language) => language.prefix && (path === language.prefix || path.startsWith(`${language.prefix}/`)),
  );
  return match ?? DEFAULT_LANGUAGE;
}

/** Strip the language prefix: `/en/reference/x` → `/reference/x`; `/en` → `/`. */
export function appPathFor(path: string, language: Language = languageForPath(path)): string {
  if (!language.prefix) return path === '' ? '/' : path;
  const rest = path.slice(language.prefix.length);
  return rest === '' ? '/' : rest;
}
