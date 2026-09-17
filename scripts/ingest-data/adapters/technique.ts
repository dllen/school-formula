// adapters/technique.ts
import { simpleArrayAdapter } from './simple-array';
import { getRoot } from '../paths';

export const techniqueAdapter = simpleArrayAdapter({
  kind: 'techniques',
  envelopeKey: 'techniques',
  typeRef: { path: `${getRoot()}/src/data/mastery/types.ts`, name: 'Technique', expr: 'Technique[]' },
  file: 'src/data/mastery/techniques.ts',
  arrayName: () => 'TECHNIQUES',
});
