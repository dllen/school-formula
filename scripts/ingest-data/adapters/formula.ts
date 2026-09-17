// adapters/formula.ts
import { simpleArrayAdapter } from './simple-array';
import { getRoot } from '../paths';

const ARRAYS: Record<string, string> = {
  primary: 'PRIMARY_FORMULAS', middle: 'MIDDLE_FORMULAS', high: 'HIGH_FORMULAS',
};

export const formulaAdapter = simpleArrayAdapter({
  kind: 'formulas',
  envelopeKey: 'formulas',
  typeRef: { path: `${getRoot()}/src/data/formulas.ts`, name: 'Formula', expr: 'Formula[]' },
  file: 'src/data/formulas.ts',
  arrayName: (it) => ARRAYS[(it as { grade: string }).grade] ?? 'PRIMARY_FORMULAS',
});
