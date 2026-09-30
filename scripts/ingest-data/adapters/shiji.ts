// adapters/shiji.ts
import { simpleArrayAdapter } from './simple-array.js';
import { getRoot } from '../paths';

export const shijiAdapter = simpleArrayAdapter({
  kind: 'shiji',
  envelopeKey: 'volumes',
  typeRef: {
    path: `${getRoot()}/src/data/shiji.ts`,
    name: 'ShijiVolume',
    expr: 'ShijiVolume[]',
  },
  file: 'src/data/shiji.ts',
  arrayName: () => 'SHIJI_DATA',
  checks: (items) => {
    const errs: string[] = [];
    for (const it of items as Array<Record<string, unknown>>) {
      if (typeof it.id !== 'string' || !it.id) errs.push(`id 缺失: ${JSON.stringify(it)}`);
      if (typeof it.title !== 'string' || !it.title) errs.push(`title 缺失: ${it.id}`);
      if (typeof it.chapter !== 'string' || !it.chapter) errs.push(`chapter 缺失: ${it.id}`);
      if (!Array.isArray(it.content) || it.content.length === 0) {
        errs.push(`content 缺失或空: ${it.id}`);
      }
    }
    return errs;
  },
  dedupBy: (it) => `${it.title ?? ''}|${it.chapter ?? ''}`,
  dedupFields: ['title', 'chapter'],
});
