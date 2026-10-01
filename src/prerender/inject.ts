export function injectAppHtml(template: string, appHtml: string): string {
  const placeholder = '<div id="root"></div>';
  if (!template.includes(placeholder)) {
    throw new Error('root placeholder not found in template');
  }
  return template.replace(placeholder, `<div id="root">${appHtml}</div>`);
}

export function outputFileFor(route: string): string {
  const dir = route.replace(/^\/+|\/+$/g, '');
  return dir === '' ? 'index.html' : `${dir}/index.html`;
}
