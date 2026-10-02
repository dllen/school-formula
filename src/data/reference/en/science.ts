import { physicalConstants } from '../neutral/constants';
import type { ReferencePage } from '../types';

/** 数量名。英文文案就住在这里——neutral 层只给符号与数值。 */
const CONSTANT_NAMES: Record<string, string> = {
  g: 'Gravitational acceleration',
  c: 'Speed of light in vacuum',
  h: 'Planck constant',
  e: 'Elementary charge',
  mₑ: 'Electron mass',
  mₚ: 'Proton mass',
  Nₐ: 'Avogadro constant',
  k: 'Coulomb constant',
};

/** 渲染成表格行：数量名 + 符号 + 取值；有第二取值时按英文习惯用 "or" 连接。 */
function physicsConstantRows(): string[][] {
  return physicalConstants().map((constant) => [
    CONSTANT_NAMES[constant.symbol],
    constant.symbol,
    constant.alternate ? `${constant.value} (or ${constant.alternate})` : constant.value,
  ]);
}

export const SCIENCE_PAGES: ReferencePage[] = [
  {
    slug: 'physics-constants',
    category: 'science',
    title: 'Physical Constants',
    summary: 'Common physical constants with symbols and values, free to print.',
    description:
      'Printable table of common physical constants — gravitational acceleration, speed of light, Planck constant, Avogadro constant and more. Free to print.',
    intro:
      'This table lists the physical constants that appear in school and first-year physics: gravitational acceleration, the speed of light, the Planck constant, the elementary charge, the masses of the electron and proton, the Avogadro constant and the Coulomb constant. Each row gives the quantity, the symbol it is normally written with, and its value in SI units, to three significant figures — the precision most school problems expect. Printing it gives a single sheet to check a formula against while working.',
    blocks: [
      {
        kind: 'table',
        headers: ['Quantity', 'Symbol', 'Value'],
        rows: physicsConstantRows(),
      },
    ],
    howToUse: [
      'Check which value of g your course uses. Many courses use 10 m/s² to keep calculations simple, while the measured value is 9.8 m/s² — the table gives both.',
      'Keep the symbol column in view while reading a formula: mₑ and mₚ are easy to mix up.',
      'Copy the units along with the number. Dropping them is the most common source of wrong answers in these problems.',
    ],
    faq: [
      {
        q: 'What is a physical constant?',
        a: 'A quantity whose value does not change, whatever the situation. The speed of light in a vacuum is the same everywhere, so it is a constant rather than a variable.',
      },
      {
        q: 'Why does the table give two values for gravitational acceleration?',
        a: 'Both are in common use. 9.8 m/s² is the measured value, and 10 m/s² is a rounded version many courses use. Use whichever your course specifies.',
      },
      {
        q: 'How many significant figures should I use?',
        a: 'Match the precision of the question. These values are given to three significant figures, which is enough for most school work — carrying more digits does not make an answer more correct if the input was already rounded.',
      },
      {
        q: 'Are these values in SI units?',
        a: 'Yes. Masses are in kilograms, speeds in metres per second, the Planck constant in joule-seconds, and charge in coulombs.',
      },
    ],
    related: ['metric-conversions', 'trigonometric-identities', 'squares-cubes-roots'],
  },
];
