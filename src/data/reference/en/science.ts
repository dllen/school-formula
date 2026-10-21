import { physicalConstants } from '../neutral/constants';
import { PERIODIC_TABLE_ROWS } from './data/periodicTable';
import { SI_UNIT_PREFIXES_ROWS } from './data/siUnitPrefixes';
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
      {
        q: 'Why is the speed of light written to only three figures?',
        a: 'Because school problems almost never need more, and the unrounded value 299 792 458 m/s would clutter the row. Once a problem asks for the exact laboratory value, the table can be replaced with the cited figure from the textbook.',
      },
      {
        q: 'What does mₑ actually stand for?',
        a: 'The mass of an electron at rest, written with a subscript e so it is not confused with the proton mass mₚ on the row below. They look similar in print, which is why the how-to-use section calls the mix-up out before it happens.',
      },
    ],
    related: ['metric-conversions', 'trigonometric-identities', 'squares-cubes-roots'],
  },
  {
    slug: 'si-unit-prefixes',
    category: 'science',
    title: 'SI Unit Prefixes Chart',
    summary: 'The twenty-one SI prefixes from yocto to yotta, with symbol and power of ten.',
    description:
      'Printable SI unit prefixes chart listing all twenty-one prefixes from yocto- to yotta-, with the symbol and the power of ten each one represents. Free.',
    intro:
      'The SI prefix system multiplies or divides a unit by a power of ten, and the same twenty-one prefixes are used for every unit in the system. Reading the chart from top to bottom moves through the large prefixes first — yotta, zetta, exa, peta, tera, giga, mega, kilo — and then through hecto, deca, the unprefixed base, and down to the small ones such as milli, micro, nano and pico. Because every step is a factor of ten, a converted value is always a shift of the decimal point, and this chart makes those shifts countable rather than something to memorise.',
    blocks: [
      {
        kind: 'table',
        headers: ['Prefix', 'Symbol', 'Power of ten'],
        rows: SI_UNIT_PREFIXES_ROWS,
      },
    ],
    howToUse: [
      'To convert between prefixed units, count the rows between the two prefixes and move the decimal point that many places, in the direction the chart runs.',
      'Learn the four that matter every day — kilo, centi, milli and micro — and read the rest off the chart when a problem needs them.',
      'Check a conversion against the chart before writing an answer: 1 gigahertz is 10 to the 9 hertz, so 2.4 GHz becomes 2 400 000 000 Hz.',
    ],
    faq: [
      { q: 'What is an SI prefix?', a: 'A symbol placed in front of a unit that multiplies it by a power of ten. Kilo- means 1,000 and milli- means one thousandth, so a kilometre is 1,000 metres and a millimetre is one thousandth of a metre.' },
      { q: 'How many SI prefixes are there?', a: 'Twenty-one, from yocto- (10 to the minus 24) up to yotta- (10 to the 24). Only a handful are common: kilo, centi, milli and micro cover almost all everyday use.' },
      { q: 'Why do some prefixes use two letters, such as da for deca?', a: 'Because the single letters were already taken: d was already used for deci, so deca took da to keep the symbols unambiguous.' },
      { q: 'What is the base unit with no prefix?', a: 'A unit written on its own, such as a metre or a gram. The chart marks that position as the base row at 10 to the 0.' },
      { q: 'Does the metric system use prefixes for time?', a: 'Not for ordinary time units, because a day is not a power of ten. Metric prefixes apply to units such as the metre, gram, second, watt and hertz, but not to the minute, hour or day.' },
    ],
    related: ['physics-constants', 'metric-conversions', 'customary-unit-conversions'],
  },
  {
    slug: 'periodic-table',
    category: 'science',
    title: 'Printable Periodic Table',
    summary: 'All 118 elements with atomic number, symbol, name and period in one table.',
    description:
      'Printable periodic table listing all 118 chemical elements with atomic number, symbol, name and period number, from hydrogen to oganesson. Free to print.',
    intro:
      'This table lists every one of the 118 known chemical elements in atomic-number order, with the symbol, the full name and the period each one belongs to. Reading it in order makes the shell structure visible: the first two periods are short, then the table settles into a pattern of eight columns for the main group elements with the transition metals tucked between them. Atomic number is the one column worth memorising early, because every lookup — an ion written with charges, a molar mass, a group number in a question — starts from there. The chart prints on two sides of one sheet or across two sheets depending on paper size.',
    blocks: [
      {
        kind: 'table',
        headers: ['No.', 'Symbol', 'Name', 'Period'],
        rows: PERIODIC_TABLE_ROWS,
      },
    ],
    howToUse: [
      'Start by finding an element the child already knows, such as oxygen or iron, and use it to locate where its neighbours live before trying an unfamiliar one.',
      'Count across a period to show that atomic numbers increase by exactly one as you move right, and use that to check a question asking for the element after a given one.',
      'Use the Period column to answer questions about the same period or group without looking anything up, since both are read directly off the chart.',
    ],
    faq: [
      { q: 'How many elements are in the periodic table?', a: '118 confirmed elements, running from hydrogen at atomic number 1 to oganesson at 118. The chart lists all 118 in atomic-number order.' },
      { q: 'Why are the numbers in the second row not sequential?', a: 'Atomic numbers are always sequential. The first two rows of the traditional layout are offset because helium sits above the noble gases rather than above the halogens, so its position is shifted to make the group columns line up.' },
      { q: 'What is atomic number?', a: 'The number of protons in the nucleus of an atom, and the position of that element in this table. It is the most reliable way to identify an element and the one used when reading chemical formulae.' },
      { q: 'Does this table include element symbols for elements that have no common use?', a: 'Yes, all 118 symbols are listed, including the synthetic elements with no stable isotopes. Those rows are rarely needed in school work but make the table complete.' },
      { q: 'Can I print this as a single A4 page?', a: 'Yes, with small type it fits one sheet, though the later-period elements will be hard to read. For classroom use, printing two sheets per copy keeps the symbol and name legible.' },
    ],
    related: ['physics-constants', 'si-unit-prefixes', 'metric-conversions'],
  },
];
