import { appPathFor, EN, languageForPath } from '../i18n/languages';
import { resolveChineseContent } from './content-zh';
import { resolveEnglishContent } from './content-en';
import type { PageContent } from './types';

/**
 * Resolve any route to the page content used for its head tags. Total function:
 * unknown routes fall back to generic site copy rather than throwing.
 */
export function resolvePageContent(path: string): PageContent {
  const language = languageForPath(path);
  const appPath = appPathFor(path, language);
  return language === EN
    ? resolveEnglishContent(appPath, path, language)
    : resolveChineseContent(appPath, path, language);
}
