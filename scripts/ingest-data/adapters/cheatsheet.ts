// adapters/cheatsheet.ts
import { simpleArrayAdapter } from './simple-array';
import { getRoot } from '../paths';

export const cheatsheetAdapter = simpleArrayAdapter({
  kind: 'cheatsheets',
  envelopeKey: 'cheatsheets',
  typeRef: { path: `${getRoot()}/src/data/cheatsheets.ts`, name: 'CheatSheet', expr: 'CheatSheet[]' },
  file: 'src/data/cheatsheets.ts',
  arrayName: () => 'ALL_CHEATSHEETS',
});
