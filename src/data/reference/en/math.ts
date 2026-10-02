import { metricConversionGroups, type ConversionGroupKey } from '../neutral/conversions';
import { range } from '../neutral/numeric';
import { multiplicationRows, squaresCubesRootsRows } from '../neutral/tables';
import type { ReferencePage } from '../types';
import { TRIG_IDENTITY_GROUPS } from './data/trigIdentities';

/** 分组显示名。英文文案就住在这里——neutral 层只给 key。 */
const METRIC_GROUP_LABELS: Record<ConversionGroupKey, string> = {
  length: 'Length',
  mass: 'Mass',
  time: 'Time',
};

/** 把 neutral 的分组键渲染成表格行：每组首行带分组名，其余留空表示延续上一组。 */
function metricConversionRows(): string[][] {
  return metricConversionGroups().flatMap((group) =>
    group.entries.map((entry, index) => [index === 0 ? METRIC_GROUP_LABELS[group.key] : '', entry]),
  );
}

export const MATH_PAGES: ReferencePage[] = [
  {
    slug: 'multiplication-chart',
    category: 'math',
    title: 'Multiplication Chart (1–12)',
    summary: 'Every times table from 1 to 12 on one printable grid.',
    description:
      'A printable 1–12 multiplication chart showing every times table, handy for homework, home practice and classroom use.',
    intro:
      'This 1–12 multiplication chart puts every times table on a single grid. Find the row for one number and the column for the other, and the cell where they meet is the product — so 7 × 8 is the number where row 7 meets column 8. Printing it and keeping it on a desk or in a homework folder gives children a fast way to check their own work instead of reaching for a calculator. It is also a compact way to notice the patterns that make times tables easier to remember: the diagonal of square numbers, the symmetry either side of it, and the easy 10s column.',
    blocks: [
      {
        kind: 'table',
        headers: ['×', ...range(1, 12).map(String)],
        rows: multiplicationRows(12),
      },
    ],
    howToUse: [
      'Put one finger on the row for the first number and one on the column for the second, then read the cell where they meet.',
      'Read down the 10s column first — it is the quickest win, and it makes the rest of the grid less intimidating.',
      'Print at 100% rather than "fit to page" so the grid stays square and easy to scan.',
    ],
    faq: [
      {
        q: 'What is a multiplication chart?',
        a: 'A grid that lists the product of every pair of numbers from 1 to 12. The row and the column each stand for one factor, and the cell where they meet is the answer.',
      },
      {
        q: 'Is this the same as a times table?',
        a: 'Yes. A chart shows all the times tables at once; a times table usually means one of the individual lines, such as the 7 times table.',
      },
      {
        q: 'Why does this chart stop at 12?',
        a: 'Twelve is the range most schools expect children to know by heart. Charts that go higher are useful for spotting larger patterns, but 12 covers the facts that come up in everyday arithmetic.',
      },
      {
        q: 'Can I print it in black and white?',
        a: 'Yes. The grid uses borders rather than shading, so it stays readable on a mono printer.',
      },
    ],
    related: ['squares-cubes-roots', 'metric-conversions', 'trigonometric-identities'],
  },
  {
    slug: 'squares-cubes-roots',
    category: 'math',
    title: 'Squares, Cubes & Square Roots',
    summary: 'n², n³ and √n for n from 1 to 20, rounded to 3 decimals.',
    description:
      'Printable table of squares, cubes and square roots for numbers 1 to 20, with irrational square roots rounded to three decimals.',
    intro:
      'This table gives the square, the cube and the square root of every whole number from 1 to 20. Squares and cubes appear constantly in algebra, area and volume problems, and square roots come up whenever a question asks for a side length or a standard deviation. Keeping the first twenty values in view turns them from something to work out into something to recognise, which is most of what makes these questions quick when they appear in a test.',
    blocks: [
      {
        kind: 'table',
        headers: ['n', 'n²', 'n³', '√n'],
        rows: squaresCubesRootsRows(20),
      },
    ],
    howToUse: [
      'Learn the squares of 1 to 12 first — they come up most often, and they are the ones tests expect you to know without working them out.',
      'Use the square root column as a sanity check: if an answer must lie between two whole numbers, the roots bracket it.',
      'Treat the rounded roots as a reading aid, not an exact value — most of them are irrational and go on forever.',
    ],
    faq: [
      {
        q: 'What is the difference between a square and a square root?',
        a: 'Squaring multiplies a number by itself and gives n². Finding the square root goes the other way: it asks which number, multiplied by itself, gives the number you started with.',
      },
      {
        q: 'Why is a cube called a cube?',
        a: 'Because a cube with edges of length n has a volume of n × n × n. The name comes from the shape, not from the algebra.',
      },
      {
        q: 'Why are the square roots rounded to three decimals?',
        a: 'Most square roots are irrational — they go on forever without repeating. Three decimals is enough to compare values or check an answer, but it is not an exact value, so avoid it in a calculation that needs precision.',
      },
      {
        q: 'What is a perfect square?',
        a: 'A number whose square root is a whole number, such as 1, 4, 9, 16, 25 and 36.',
      },
    ],
    related: ['multiplication-chart', 'trigonometric-identities', 'physics-constants'],
  },
  {
    slug: 'trigonometric-identities',
    category: 'math',
    title: 'Trigonometric Identities',
    summary: 'Pythagorean, sum/difference, double-angle and half-angle identities.',
    description:
      'A printable summary of the trigonometric identities students need most: Pythagorean, sum and difference, double-angle and half-angle formulas.',
    intro:
      'This sheet collects the trigonometric identities that come up most often in algebra, geometry and physics, grouped by the kind of problem they solve rather than by difficulty. Angles are written as α, β and θ, and every line holds for any angle. Use it as a lookup while working: start from the group that matches the shape of the problem in front of you, then work back towards the Pythagorean identities if you need something simpler to substitute in.',
    blocks: [{ kind: 'formulas', groups: TRIG_IDENTITY_GROUPS }],
    howToUse: [
      'Start from the Pythagorean identities — most of the others can be derived from them if you forget one.',
      'When a problem mixes two different angles, reach for the sum and difference group; when it doubles or halves one angle, use the double-angle and half-angle groups.',
      'Watch the ∓ and ± signs: they flip between the top and bottom lines of a sum or difference formula.',
    ],
    faq: [
      {
        q: 'What is a trigonometric identity?',
        a: 'An equation involving trigonometric functions that is true for every angle. Unlike an equation you solve, an identity is a fact you can substitute into a problem to make it simpler.',
      },
      {
        q: 'Which identities do I actually need to memorise?',
        a: 'In practice, sin²θ + cos²θ = 1 and the sum and difference formulas cover most exam questions. The double-angle and half-angle formulas can be derived from those.',
      },
      {
        q: 'What do the letters α, β and θ mean?',
        a: 'They are conventional names for angles, exactly like using x for an unknown. Which letter is used makes no difference to the formula.',
      },
      {
        q: 'Why do some formulas use both ± and ∓?',
        a: 'The two signs move together but in opposite directions. When the left side uses +, the matching term on the right uses −, and the other way round.',
      },
    ],
    related: ['squares-cubes-roots', 'physics-constants', 'metric-conversions'],
  },
  {
    slug: 'metric-conversions',
    category: 'math',
    title: 'Metric Unit Conversions',
    summary: 'Length, mass and time conversions in one table.',
    description:
      'Printable metric conversion table covering length, mass and time: kilometres to metres, kilograms to grams, hours to minutes and seconds.',
    intro:
      'This table covers the metric conversions that come up in science and maths homework: length from kilometres down to millimetres, mass from tonnes down to milligrams, and time from days down to seconds. Each row is a single equality you can read in either direction. The metric system is built on powers of ten, so most of these conversions are a matter of moving a decimal point rather than remembering an unrelated number, and a printed copy next to a homework book removes the need to look anything up.',
    blocks: [
      {
        kind: 'table',
        headers: ['Quantity', 'Conversion'],
        rows: metricConversionRows(),
      },
    ],
    howToUse: [
      'Move the decimal point instead of multiplying: one step down the prefixes is one place to the right.',
      'Write the unit next to every number while converting. Most mistakes here are unit mistakes, not arithmetic ones.',
      'Treat the time rows separately — unlike length and mass, time is not decimal, so the powers-of-ten shortcut does not apply.',
    ],
    faq: [
      {
        q: 'How do I convert between metric units?',
        a: 'Count the steps between the two prefixes and move the decimal point that many places in the matching direction. Kilo- to the base unit is three steps, so 2.5 km is 2500 m.',
      },
      {
        q: 'Why is time different from the other rows?',
        a: 'The metric prefixes work in powers of ten, but an hour has 60 minutes and a minute has 60 seconds. Time does not follow that pattern, so it needs its own rows.',
      },
      {
        q: 'What is a tonne?',
        a: 'A metric tonne is 1000 kilograms. It is sometimes written "metric ton" to distinguish it from the US short ton, which is about 907 kilograms.',
      },
      {
        q: 'Is a millilitre the same as a cubic centimetre?',
        a: 'Yes, exactly — 1 mL = 1 cm³. That is why volume and capacity convert so cleanly in the metric system.',
      },
    ],
    related: ['physics-constants', 'multiplication-chart', 'squares-cubes-roots'],
  },
];
