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

export const ZH: Language = { code: 'zh-CN', prefix: '' };
export const EN: Language = { code: 'en', prefix: '/en' };

export const LANGUAGES: readonly Language[] = [ZH, EN];

export const DEFAULT_LANGUAGE: Language = ZH;

/** The language a path belongs to; falls back to the default for unprefixed paths. */
export function languageForPath(path: string): Language {
  const match = LANGUAGES.find(
    (language) => language.prefix && (path === language.prefix || path.startsWith(`${language.prefix}/`)),
  );
  return match ?? DEFAULT_LANGUAGE;
}

/** Absolute path for a route in a given language: `localizedPath(EN)` → `/en/`. */
export function localizedPath(language: Language, appPath = '/'): string {
  const suffix = appPath === '/' || appPath === '' ? '/' : `${appPath.replace(/\/+$/, '')}/`;
  return `${language.prefix}${suffix}` || '/';
}

/** Strip the language prefix and trailing slash: `/en/reference/x/` → `/reference/x`. */
export function appPathFor(path: string, language: Language = languageForPath(path)): string {
  const rest = language.prefix ? path.slice(language.prefix.length) : path;
  const trimmed = rest.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}
