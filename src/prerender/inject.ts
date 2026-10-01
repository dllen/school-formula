const ROOT_PLACEHOLDER = '<div id="root"></div>';
const HTML_TAG = /<html\b[^>]*>/;
const TITLE_ELEMENT = /<title>[\s\S]*?<\/title>/;

export interface PageParts {
  /** Server-rendered app HTML. */
  appHtml: string;
  /** Generated head content (title + meta/link/script tags). */
  headHtml: string;
  /** Language for the `<html lang>` attribute. */
  htmlLang: string;
}

/**
 * Assemble the final static page: set `<html lang>`, swap the template's `<title>` for the
 * generated head tags, then mount the server-rendered app HTML into the root placeholder.
 */
export function injectPage(template: string, parts: PageParts): string {
  if (!template.includes(ROOT_PLACEHOLDER)) {
    throw new Error('root placeholder not found in template');
  }
  if (!TITLE_ELEMENT.test(template)) {
    throw new Error('title element not found in template');
  }
  return template
    .replace(HTML_TAG, () => `<html lang="${parts.htmlLang}">`)
    .replace(TITLE_ELEMENT, () => parts.headHtml)
    .replace(ROOT_PLACEHOLDER, () => `<div id="root">${parts.appHtml}</div>`);
}

export function outputFileFor(route: string): string {
  const dir = route.replace(/^\/+|\/+$/g, '');
  return dir === '' ? 'index.html' : `${dir}/index.html`;
}
