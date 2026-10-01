import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { render } from './entry-server';
import { injectAppHtml, outputFileFor } from './prerender/inject';
import { PRERENDER_PATHS } from './prerender/routes';

const distDir = join(process.cwd(), 'dist');
const template = readFileSync(join(distDir, 'index.html'), 'utf8');

let written = 0;
for (const route of PRERENDER_PATHS) {
  const html = injectAppHtml(template, render(route));
  const outFile = join(distDir, outputFileFor(route));
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  written++;
}

console.log(`prerendered ${written} pages`);
