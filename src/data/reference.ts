/**
 * English printable reference charts — the content behind the `/en/` surface.
 * Language-neutral, high-intent study material (tables and formulas), authored in English.
 */
export interface ReferenceTable {
  slug: string;
  title: string;
  /** Short blurb shown on the index cards. */
  summary: string;
  /** Page meta description. */
  description: string;
  category: 'Math' | 'Physics' | 'English';
  headers?: string[];
  rows: string[][];
}

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

const squareRoot = (n: number): string => String(Number(Math.sqrt(n).toFixed(3)));

const MULTIPLICATION_CHART: ReferenceTable = {
  slug: 'multiplication-chart',
  title: 'Multiplication Chart (1–12)',
  summary: 'Every times table from 1 to 12 on one printable grid.',
  description:
    'A printable 1–12 multiplication chart showing every times table, handy for homework, home practice and classroom use.',
  category: 'Math',
  headers: ['×', ...range(1, 12).map(String)],
  rows: range(1, 12).map((row) => [String(row), ...range(1, 12).map((col) => String(row * col))]),
};

const SQUARES_AND_CUBES: ReferenceTable = {
  slug: 'squares-cubes-roots',
  title: 'Squares, Cubes & Square Roots',
  summary: 'n², n³ and √n for n from 1 to 20, rounded to 3 decimals.',
  description:
    'Printable table of squares, cubes and square roots for numbers 1 to 20, with irrational square roots rounded to three decimals.',
  category: 'Math',
  headers: ['n', 'n²', 'n³', '√n'],
  rows: range(1, 20).map((n) => [String(n), String(n * n), String(n ** 3), squareRoot(n)]),
};

const TRIG_IDENTITIES: ReferenceTable = {
  slug: 'trigonometric-identities',
  title: 'Trigonometric Identities',
  summary: 'Pythagorean, sum/difference, double-angle and half-angle identities.',
  description:
    'A printable summary of the trigonometric identities students need most: Pythagorean, sum and difference, double-angle and half-angle formulas.',
  category: 'Math',
  rows: [
    ['Pythagorean', 'sin²θ + cos²θ = 1'],
    ['', 'tanθ = sinθ / cosθ'],
    ['', '1 + tan²θ = sec²θ'],
    ['', '1 + cot²θ = csc²θ'],
    ['Sum / difference', 'sin(α ± β) = sinα cosβ ± cosα sinβ'],
    ['', 'cos(α ± β) = cosα cosβ ∓ sinα sinβ'],
    ['', 'tan(α ± β) = (tanα ± tanβ) / (1 ∓ tanα tanβ)'],
    ['Double angle', 'sin2α = 2 sinα cosα'],
    ['', 'cos2α = cos²α − sin²α = 2cos²α − 1 = 1 − 2sin²α'],
    ['', 'tan2α = 2tanα / (1 − tan²α)'],
    ['Half angle', 'sin²(α/2) = (1 − cosα) / 2'],
    ['', 'cos²(α/2) = (1 + cosα) / 2'],
  ],
};

const PHYSICS_CONSTANTS: ReferenceTable = {
  slug: 'physics-constants',
  title: 'Physical Constants',
  summary: 'Common physical constants with symbols and values.',
  description:
    'Printable table of common physical constants — gravitational acceleration, speed of light, Planck constant, Avogadro constant and more.',
  category: 'Physics',
  headers: ['Quantity', 'Symbol', 'Value'],
  rows: [
    ['Gravitational acceleration', 'g', '9.8 m/s² (or 10 m/s²)'],
    ['Speed of light in vacuum', 'c', '3.00 × 10⁸ m/s'],
    ['Planck constant', 'h', '6.63 × 10⁻³⁴ J·s'],
    ['Elementary charge', 'e', '1.60 × 10⁻¹⁹ C'],
    ['Electron mass', 'mₑ', '9.11 × 10⁻³¹ kg'],
    ['Proton mass', 'mₚ', '1.67 × 10⁻²⁷ kg'],
    ['Avogadro constant', 'Nₐ', '6.02 × 10²³ mol⁻¹'],
    ['Coulomb constant', 'k', '9.0 × 10⁹ N·m²/C²'],
  ],
};

const METRIC_CONVERSIONS: ReferenceTable = {
  slug: 'metric-conversions',
  title: 'Metric Unit Conversions',
  summary: 'Length, mass and time conversions in one table.',
  description:
    'Printable metric conversion table covering length, mass and time: kilometres to metres, kilograms to grams, hours to minutes and seconds.',
  category: 'Math',
  headers: ['Quantity', 'Conversion'],
  rows: [
    ['Length', '1 km = 1000 m'],
    ['', '1 m = 100 cm = 1000 mm'],
    ['', '1 cm = 10 mm'],
    ['Mass', '1 t = 1000 kg'],
    ['', '1 kg = 1000 g'],
    ['', '1 g = 1000 mg'],
    ['Time', '1 h = 60 min = 3600 s'],
    ['', '1 min = 60 s'],
    ['', '1 day = 24 h'],
  ],
};

const IRREGULAR_VERBS: ReferenceTable = {
  slug: 'irregular-verbs',
  title: 'Irregular Verbs',
  summary: 'Base form, past simple and past participle for common verbs.',
  description:
    'Printable list of common English irregular verbs with their past simple and past participle forms, for grammar practice and revision.',
  category: 'English',
  headers: ['Base form', 'Past simple', 'Past participle'],
  rows: [
    ['be', 'was / were', 'been'],
    ['begin', 'began', 'begun'],
    ['break', 'broke', 'broken'],
    ['bring', 'brought', 'brought'],
    ['buy', 'bought', 'bought'],
    ['come', 'came', 'come'],
    ['do', 'did', 'done'],
    ['drink', 'drank', 'drunk'],
    ['eat', 'ate', 'eaten'],
    ['find', 'found', 'found'],
    ['get', 'got', 'got / gotten'],
    ['give', 'gave', 'given'],
    ['go', 'went', 'gone'],
    ['have', 'had', 'had'],
    ['know', 'knew', 'known'],
    ['make', 'made', 'made'],
    ['read', 'read', 'read'],
    ['run', 'ran', 'run'],
    ['say', 'said', 'said'],
    ['see', 'saw', 'seen'],
    ['speak', 'spoke', 'spoken'],
    ['take', 'took', 'taken'],
    ['think', 'thought', 'thought'],
    ['write', 'wrote', 'written'],
  ],
};

export const REFERENCE_TABLES: ReferenceTable[] = [
  MULTIPLICATION_CHART,
  SQUARES_AND_CUBES,
  TRIG_IDENTITIES,
  PHYSICS_CONSTANTS,
  METRIC_CONVERSIONS,
  IRREGULAR_VERBS,
];

const REFERENCE_BY_SLUG = new Map(REFERENCE_TABLES.map((table) => [table.slug, table]));

export function getReferenceTable(slug: string): ReferenceTable | undefined {
  return REFERENCE_BY_SLUG.get(slug);
}

/** Route slugs, used to build the `/en/reference/:slug` route and sitemap entries. */
export const REFERENCE_SLUGS: readonly string[] = REFERENCE_TABLES.map((table) => table.slug);
