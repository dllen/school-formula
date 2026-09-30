// adapters/zizhi.ts
import { simpleArrayAdapter } from './simple-array.js';
import { getRoot } from '../paths';

export const zizhiAdapter = simpleArrayAdapter({
  kind: 'zizhi',
  envelopeKey: 'volumes',
  typeRef: {
    path: `${getRoot()}/src/data/zizhi.ts`,
    name: 'ZizhiVolume',
    expr: 'ZizhiVolume[]',
  },
  file: 'src/data/zizhi.ts',
  arrayName: () => 'ZIZHI_DATA',
  checks: (items) => {
    const errs: string[] = [];
    for (const it of items as Array<Record<string, unknown>>) {
      if (typeof it.id !== 'string' || !it.id) errs.push(`id 缺失: ${JSON.stringify(it)}`);
      if (typeof it.title !== 'string' || !it.title) errs.push(`title 缺失: ${it.id}`);
      if (typeof it.period !== 'string' || !it.period) errs.push(`period 缺失: ${it.id}`);
      if (!Array.isArray(it.content) || it.content.length === 0) {
        errs.push(`content 缺失或空: ${it.id}`);
      }
    }
    return errs;
  },
});
