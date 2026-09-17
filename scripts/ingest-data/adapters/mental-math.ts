// adapters/mental-math.ts
import { simpleArrayAdapter } from './simple-array';
import { getRoot } from '../paths';

const ARRAYS: Record<string, string> = {
  primary: 'PRIMARY_MNEMONICS', middle: 'MIDDLE_MNEMONICS', high: 'HIGH_MNEMONICS',
};

export const mentalMathAdapter = simpleArrayAdapter({
  kind: 'mental-math',
  envelopeKey: 'mnemonics',
  typeRef: { path: `${getRoot()}/src/data/mentalMath.ts`, name: 'MentalMathMnemonic', expr: 'MentalMathMnemonic[]' },
  file: 'src/data/mentalMath.ts',
  arrayName: (it) => ARRAYS[(it as { grade: string }).grade] ?? 'PRIMARY_MNEMONICS',
});
