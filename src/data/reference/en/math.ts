import { metricConversionGroups, type ConversionGroupKey } from '../neutral/conversions';
import { range } from '../neutral/numeric';
import { multiplicationRows, squaresCubesRootsRows } from '../neutral/tables';
import type { ReferencePage } from '../types';
import { HUNDREDS_CHART_BLANK_ROWS, HUNDREDS_CHART_ROWS } from './data/hundredsChart';
import { APV_FORMULAS } from './data/areaPerimeterVolumeFormulas';
import { CUSTOMARY_UNIT_CONVERSIONS_ROWS } from './data/customaryUnitConversions';
import { DIVISIBILITY_RULES_ROWS } from './data/divisibilityRules';
import { FRACTION_DECIMAL_PERCENT_ROWS } from './data/fractionDecimalPercent';
import { NUMBER_LINE_SVG } from './data/numberLine';
import { PLACE_VALUE_CHART_ROWS } from './data/placeValueChart';
import { PRIME_NUMBERS_ROWS } from './data/primeNumbers';
import { ROMAN_NUMERALS_ROWS } from './data/romanNumerals';

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
    summary: 'Every times table from 1 to 12 on one printable grid — free, and no signup needed.',
    description:
      'Printable 1–12 multiplication chart with every times table, handy for homework and home practice. Borders not shading, so it prints in black and white. Free.',
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
      {
        q: 'What patterns should I look for?',
        a: 'Every product is mirrored across the diagonal of square numbers, and the 10s, 11s and 5s columns run in obvious sequences. Spotting those three columns first turns the rest of the grid into something to predict rather than to learn cell by cell.',
      },
      {
        q: 'Does this help with long multiplication?',
        a: 'Yes, in two ways. Knowing the single-digit products cuts the time spent working them out, and the grid shows which double-digit products like 11 × 12 or 12 × 12 are still single cells, so they become the answer rather than another step to break down.',
      },
    ],
    related: ['squares-cubes-roots', 'metric-conversions', 'trigonometric-identities'],
  },
  {
    slug: 'squares-cubes-roots',
    category: 'math',
    title: 'Squares, Cubes & Square Roots',
    summary: 'n², n³ and √n for n from 1 to 20, rounded to 3 decimals — free to print.',
    description:
      'Printable table of squares, cubes and square roots for numbers 1 to 20, with irrational square roots rounded to three decimals. Free to print. Free to print.',
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
      {
        q: 'Why does the table stop at 20?',
        a: 'Past 20, the squares and cubes keep growing without adding patterns that students meet in everyday work, and the square roots become harder to read at a glance. Twenty covers the values most often asked about in algebra and geometry problems in middle and early high school.',
      },
      {
        q: 'How can I tell whether a square root is a whole number?',
        a: 'A square root is a whole number exactly when the original number is a perfect square — 1, 4, 9, 16, 25, 36 and so on. For any other input the decimal keeps going, so the rounded value in the table is a reading aid rather than an exact answer.',
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
      'Printable summary of the most-used trigonometric identities: Pythagorean, sum and difference, double-angle, half-angle formulas. Free to print. Free to print.',
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
      {
        q: 'What is the difference between an identity and an equation?',
        a: 'An equation asks you to find the angle that satisfies a condition and has at most a handful of solutions; an identity is a relation that holds for every angle. That is why identities can be substituted into problems to simplify them, rather than solved.',
      },
      {
        q: 'Do these identities work in degrees or radians?',
        a: 'Both, because the identities are algebraic relations between trigonometric functions rather than numerical values of angles. Convert to whichever unit your problem uses, then apply the identity without changing it.',
      },
      {
        q: 'Which identity should I start with if I am stuck?',
        a: 'Almost always sin²θ + cos²θ = 1. It is the one identity that turns a square of a function into a simpler expression, which then unlocks most of the rest.',
      },
    ],
    related: ['squares-cubes-roots', 'physics-constants', 'metric-conversions'],
  },
  {
    slug: 'metric-conversions',
    category: 'math',
    title: 'Metric Unit Conversions',
    summary: 'Length, mass and time conversions in one printable table, free to use.',
    description:
      'Printable metric conversion table covering length, mass and time: kilometres to metres, kilograms to grams, hours to minutes and seconds. Free. Free to print.',
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
      {
        q: 'Do I need to memorise the conversions?',
        a: 'Most of them follow the decimal trick, so recognising the prefix is enough. The exceptions are the time rows — those are the only ones worth memorising because the powers-of-ten rule does not apply.',
      },
      {
        q: 'What is the largest metric prefix on the table?',
        a: 'For length it is kilo- and for mass it is tonne, both of which convert to the base unit by a factor of one thousand. For time, the largest unit on the table is the day; larger intervals like weeks and months vary enough that they are not part of a fixed conversion table.',
      },
    ],
    related: ['physics-constants', 'multiplication-chart', 'squares-cubes-roots'],
  },
  {
    slug: 'hundreds-chart',
    category: 'math',
    title: 'Hundreds Chart (1–100)',
    summary: 'Printable 1–100 hundreds chart with a blank grid for counting and skip-counting practice.',
    description:
      'Printable hundreds chart from 1 to 100 in a 10×10 grid, plus a blank 10×10 grid for fill-in practice. A4 and Letter friendly, free. Free to print, no signup.',
    intro:
      'A hundreds chart is a 10-by-10 grid that lists the numbers from 1 to 100, row by row. It is one of the most-used early-grade classroom resources for kindergarten through grade 2, because every pattern children need in skip-counting and basic arithmetic is visible on a single sheet. Reading down a column shows the tens digit increasing by one while the ones digit stays the same. The blank grid underneath lets a child fill in numbers they are still learning, and is the reason to print this page rather than use a generic worksheet.',
    blocks: [
      {
        kind: 'table',
        headers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        rows: HUNDREDS_CHART_ROWS,
      },
      {
        kind: 'table',
        headers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        rows: HUNDREDS_CHART_BLANK_ROWS,
        caption: 'Blank grid for fill-in practice.',
      },
    ],
    howToUse: [
      'Start at 1 and read every number in order, either row-by-row or column-by-column — column reading is usually the harder and more useful one.',
      'Practice skip-counting by 2s, 5s and 10s: highlight every 5th cell to show the count by fives, then do the same for twos and tens.',
      'Use the blank grid to ask the child to write in a missing number. Pick a cell they cannot guess at random by asking for the number that sits between, say, 27 and 29.',
      'Print at 100% rather than "fit to page" so the 10×10 cells stay square — this matters for visual pattern work.',
    ],
    faq: [
      {
        q: 'What is a hundreds chart?',
        a: 'It is a 10-by-10 grid listing the numbers from 1 to 100, row by row. It is one of the most-used early-grade math resources because it shows place value, skip-counting and simple arithmetic patterns all at the same time.',
      },
      {
        q: 'What age or grade is a hundreds chart for?',
        a: 'It is most often used in kindergarten through second grade (ages 5 to 7) for counting to 100 and the basic patterns around it, and then again in grade 3 and 4 for multi-digit addition and subtraction practice.',
      },
      {
        q: 'Why is a hundreds chart useful for skip-counting?',
        a: 'Reading down any column shows how counting by 2s, 5s or 10s repeats the same pattern — twos skip a cell, fives skip four cells, tens skip nine cells — so the chart turns an abstract counting pattern into something a child can see and point at.',
      },
      {
        q: 'What is the blank grid for?',
        a: 'It turns the chart into a fill-in worksheet. A child fills in missing numbers, or counts by 2s, 5s or 10s and writes the numbers in the right cells, instead of looking at a finished chart and reading off an answer.',
      },
      {
        q: 'Does a hundreds chart work on A4 and Letter?',
        a: 'Yes. The grid is small enough that both sheet sizes leave comfortable margins around it without rescaling; print at 100% scale, not "fit to page", so the cells stay square.',
      },
    ],
    related: ['place-value-chart', 'number-line', 'multiplication-chart'],
  },
  {
    slug: 'place-value-chart',
    category: 'math',
    title: 'Place Value Chart',
    summary: 'Printable place value chart listing each digit position and its named place.',
    description:
      'Printable place value chart listing each digit position with its place name from millions down to thousandths. Free to print, black and white. Free to print.',
    intro:
      'A place value chart lists every digit position from millions down to thousandths, so a child can see at a glance what each digit in a number is worth. Reading the table left to right moves from the largest place to the smallest, and the comma marks the boundary between thousands and hundreds. The decimal row splits whole numbers from fractions, with tenths, hundredths and thousandths continuing the same naming pattern on the right. Keeping it printed next to a homework book turns place value from something to memorise into something a child can point at when they read or write any multi-digit number.',
    blocks: [
      {
        kind: 'table',
        headers: ['Value', 'Place'],
        rows: PLACE_VALUE_CHART_ROWS,
      },
    ],
    howToUse: [
      'Read each row from the largest value down to the smallest, and connect it to the matching digit position in a number like 12,345.67.',
      'Compare 0.45 with 0.5 by writing them on a chart — the digit in the tenths row decides, regardless of how many digits come after.',
      'Use the chart with whole-number arithmetic: place the digits of 1,247 in the right rows, then do the math row by row to see why regrouping works the way it does.',
      'Pair the chart with the number-line chart when teaching subtraction across zero — place 7 on the chart, then walk one step at a time down to negative values.',
    ],
    faq: [
      { q: 'What is place value?', a: 'It is the value of a digit based on its position in a number. The digit 3 in 345 stands for 300, but the same digit in 0.345 stands for three tenths.' },
      { q: 'What ages or grades use a place value chart?', a: 'Most often introduced in grade 2 for two- and three-digit whole numbers, then extended through grade 5 for decimals and large numbers.' },
      { q: 'Why does the chart go past thousands on the whole-number side?', a: 'The naming pattern extends without learning any new rule. Millions, hundred-thousands and ten-thousands are the next three places to the left of thousands, in the same powers-of-ten order as the rest of the chart.' },
      { q: 'Why does the chart go past ones on the decimal side?', a: 'Decimal places are the ones rule applied to fractions. Tenths, hundredths and thousandths continue the same naming and powers-of-ten pattern as the whole-number side, just in reverse.' },
      { q: 'Does this chart work for any number size?', a: 'Yes. It covers everything from millionths to millions, which is more than enough for elementary and middle-school work.' },
    ],
    related: ['hundreds-chart', 'number-line', 'multiplication-chart'],
  },
  {
    slug: 'number-line',
    category: 'math',
    title: 'Number Line (−20 to 100)',
    summary: 'Printable number line from negative twenty to one hundred with marks every ten.',
    description:
      'Printable number line from -20 to 100 with marks every ten units and labels at every ten, sized for a single A4 or Letter page. Free to print. Free to print.',
    intro:
      'A number line is a horizontal line with equally spaced marks for whole numbers, and the printed version below goes from negative twenty on the left to one hundred on the right. The marks every ten units are taller so a child can read them at a glance and count along in tens rather than in ones. Negative numbers to the left of zero let the same line work for early subtraction and for explaining what a number below zero means. The line is sized for a single sheet so it can sit on a desk or be taped to a wall, and it is easy to print on either A4 or Letter paper at full size.',
    blocks: [
      {
        kind: 'diagram',
        svg: NUMBER_LINE_SVG,
        caption: 'Number line from -20 to 100 with marks every ten units.',
      },
    ],
    howToUse: [
      'Have the child hop their finger from 0 toward a target number, counting aloud each time they cross a tall mark — this turns the line into a physical counting track.',
      'Use the line for subtraction by starting at the larger number and hopping left the right number of steps; for addition, start at one number and hop right.',
      'Show negative numbers by starting to the left of zero and hopping right; show "less than zero" by starting to the right of zero and hopping left.',
      'Practise counting on the line by saying each number aloud as the finger lands on its mark, especially across zero into negative values.',
    ],
    faq: [
      { q: 'What is a number line?', a: 'A horizontal line with equally spaced marks for numbers, used to show order and distance.' },
      { q: 'Why does this number line start at negative twenty?', a: 'Negative twenty covers early subtraction and lets the chart introduce numbers below zero without making the line too long for a single sheet.' },
      { q: 'Does this number line include fractions?', a: 'No. This is the whole-number version. A separate chart covers fractions and decimals.' },
      { q: 'Can I print this in black and white?', a: 'Yes. The line uses lines and text rather than fill or shading.' },
      { q: 'How do I read a number off the line?', a: 'Start at zero, count the marks to the right for a positive number and to the left for a negative. Each tall mark is ten; each short mark between them is one.' },
    ],
    related: ['hundreds-chart', 'place-value-chart', 'roman-numerals'],
  },
  {
    slug: 'roman-numerals',
    category: 'math',
    title: 'Roman Numerals Chart (1–3,000)',
    summary: 'Roman numerals from I to MMM, with the seven symbols and key combinations.',
    description:
      'Printable Roman numerals chart listing the seven basic symbols, the subtractive combinations for 4, 9, 40, 90, 400 and 900, and example values. Free. Free.',
    intro:
      'Roman numerals use the letters I, V, X, L, C, D and M as digits, with smaller symbols in front of larger ones meaning subtract. This chart lists the seven symbols, the six subtractive combinations that cover every number from 1 to 1,000, and the example values 1,999 and 3,000 so a reader sees the pattern keep going. They still appear on clock faces, on building cornerstones, and in the names of monarchs and popes. Children meet them most often when reading dates on older buildings, when learning about Roman history, and when looking at the credits of older films.',
    blocks: [
      {
        kind: 'table',
        headers: ['Roman', 'Value'],
        rows: ROMAN_NUMERALS_ROWS,
      },
    ],
    howToUse: [
      'Start by learning the seven symbols and their values, then learn the six subtractive combinations (IV, IX, XL, XC, CD, CM).',
      'Read any Roman numeral left to right: add the value of a symbol unless the next symbol to the right is larger, in which case subtract.',
      'Check your reading with the table: 1,999 is MCMXCIX, and the pattern keeps going for any larger year.',
      'Practise reading years: pick a year and write it in Roman numerals, then check it against a list of real dates.',
      'Practise writing the years of your own birth, school start and any recent event in Roman numerals as a small daily exercise.',
    ],
    faq: [
      { q: 'What is a Roman numeral?', a: 'A way of writing numbers using the letters I, V, X, L, C, D and M, with smaller symbols in front of larger ones meaning subtract.' },
      { q: 'Why does the chart list combinations like IV and IX?', a: 'Because Roman numerals use a subtractive rule: 4 is written IV (5 − 1), not IIII. The six combinations cover every value from 1 to 1,000.' },
      { q: 'Why does the chart stop at 3,000?', a: 'Past 3,000 the symbols keep repeating the same pattern, so the chart does not need to. MMM is the largest value without using overlines.' },
      { q: 'Where do Roman numerals still appear?', a: 'On clock faces, on building cornerstones, in the names of monarchs and popes, in film credits, and in the suffixes of Super Bowls.' },
      { q: 'Can I use Roman numerals for calculations?', a: 'In principle yes, but the position rules make arithmetic slow and error-prone. Today they are used for display, not for calculation.' },
      { q: 'What is the largest Roman numeral you can write without overlines?', a: 'MMM, which is 3,000. Past that, an overline (vinculum) multiplies the value beneath it by 1,000, so V̅ with an overline would be 5,000. The chart stops at MMM because the overline convention is rare in everyday use.' },
      { q: 'How do I write the current year in Roman numerals?', a: 'Break the year into thousands, hundreds, tens and ones, then translate each piece with the table. 2026, for example, is MMXXVI.' },
    ],
    related: ['hundreds-chart', 'prime-numbers', 'divisibility-rules'],
  },
  {
    slug: 'prime-numbers',
    category: 'math',
    title: 'Prime Numbers Chart (1–100)',
    summary: 'Every prime from 1 to 100 marked on a single grid, with a quick divisibility reminder.',
    description:
      'Printable prime numbers chart from 1 to 100, with primes marked and non-primes left blank. Includes a quick divisibility reminder. Free to print. Free to print.',
    intro:
      'A prime number is a whole number greater than 1 whose only factors are 1 and itself. The chart below marks which numbers from 1 to 100 are prime. Reading down, you can see why 1 is not prime, why every even number greater than 2 is not prime, and why 5 is the only prime ending in 5. The pattern that shows up at 2, 3, 5, 7, 11, 13, 17, 19 and beyond is the start of the famous "Ulam spiral", which keeps going forever because there is no largest prime.',
    blocks: [
      {
        kind: 'table',
        headers: ['n', 'Prime'],
        rows: PRIME_NUMBERS_ROWS,
      },
    ],
    howToUse: [
      'Read down and notice that 2 is the only even prime, and 5 is the only prime ending in 5.',
      'Test whether a number from 1 to 100 is prime by checking it is not divisible by 2, 3, 5 or 7 — once those four fail, no smaller prime can divide it.',
      'Pair the chart with the divisibility-rules page for a single self-contained reference sheet.',
      'Use the chart as a quick read-along when reviewing the prime-numbers song or poem your class has memorised.',
      'Cover the "Yes" column and have a child write the prime from 2 up to 100 by skipping non-primes.',
    ],
    faq: [
      { q: 'What is a prime number?', a: 'A whole number greater than 1 whose only factors are 1 and itself. 2, 3, 5, 7, 11, 13, 17 and 19 are the first eight primes.' },
      { q: 'Why is 1 not prime?', a: 'By the modern definition a prime must have exactly two distinct factors; 1 has only one (itself), so it is neither prime nor composite.' },
      { q: 'Why is 2 the only even prime?', a: 'Every other even number is divisible by 2, so it has at least the factors 1, 2 and itself — more than two factors — so it is not prime.' },
      { q: 'How many primes are below 100?', a: 'There are 25 primes between 1 and 100, and the chart marks all 25. The next prime after 97 is 101.' },
      { q: 'How do I test if a larger number is prime?', a: 'Trial-divide by every prime up to its square root. If none divide it, the number is prime.' },
      { q: 'Why does the prime-numbers test use 2, 3, 5 and 7?', a: 'Because those are the only primes less than or equal to the square root of 100. If none of them divide a number below 100, no smaller prime can either.' },
      { q: 'How do primes appear in the world?', a: 'In the patterns of insect wings, the seeds of sunflowers, the rings of pineapples, and the rhythm of cicada broods — all counted by prime intervals.' },
    ],
    related: ['divisibility-rules', 'hundreds-chart', 'roman-numerals'],
  },
  {
    slug: 'divisibility-rules',
    category: 'math',
    title: 'Divisibility Rules (2 to 12)',
    summary: 'Printable divisibility rules for 2 through 12 on a single page.',
    description:
      'Printable divisibility rules for the divisors 2 through 12, each phrased as a quick test a child can apply by hand. Free to print, no signup needed. Free.',
    intro:
      'A divisibility rule is a quick test that tells you whether a number is divisible by another without doing the long division. The rules below cover the divisors that come up most often in elementary and middle-school arithmetic: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 and 12. Most of them are about looking at the last digit, the last two digits or the sum of the digits. The rule for 7 is the trickiest — it uses the digit-sum trick in reverse — and the chart gives the exact wording so the test can be repeated.',
    blocks: [
      {
        kind: 'table',
        headers: ['Divisor', 'Rule'],
        rows: DIVISIBILITY_RULES_ROWS,
      },
    ],
    howToUse: [
      'Print one copy per child. Cover the answer column and have the child work each rule on a number of their choice.',
      'Use the chart as a quick check while doing long division or simplifying fractions — the rule tells you whether a common factor exists before you start.',
      'Pair with the prime-numbers chart on the back of the same sheet: the rules for 2, 3, 5 and 7 are exactly what the prime-numbers test uses.',
      'Use the chart as a self-quiz: pick a number, then apply each rule in turn and mark which ones pass.',
    ],
    faq: [
      { q: 'What is a divisibility rule?', a: 'A short test that tells you, without dividing, whether one number is divisible by another.' },
      { q: 'Why does the rule for 2 use the last digit?', a: 'A number is divisible by 2 exactly when its last digit is even (0, 2, 4, 6 or 8).' },
      { q: 'Why does the rule for 9 use the sum of the digits?', a: 'A number is divisible by 9 exactly when the sum of its digits is divisible by 9, and similarly for 3.' },
      { q: 'Why is the rule for 7 the longest one?', a: 'Because 10 ≡ 3 (mod 7), which makes the simple digit-sum rule messy. The form on the chart is the shortest rule that works by hand.' },
      { q: 'Why does the chart stop at 12?', a: 'Past 12 the rules either get long or follow from rules for smaller divisors. The twelve on the chart cover every divisor that comes up in everyday arithmetic.' },
      { q: 'Is there a rule for 7 that is shorter than the one on the chart?', a: 'Not really. The double-the-last-digit-and-subtract rule is the shortest known form that works by hand for all numbers.' },
      { q: 'Why does the rule for 11 use alternating digit sums?', a: 'Because 10 ≡ -1 (mod 11), so each place contributes its digit either positive or negative as the powers of 10 alternate sign.' },
    ],
    related: ['prime-numbers', 'hundreds-chart', 'fraction-decimal-percent'],
  },
  {
    slug: 'fraction-decimal-percent',
    category: 'math',
    title: 'Fraction & Percent Chart',
    summary: 'Common fractions with their decimal and percent values, on one printable table.',
    description:
      'Printable fraction, decimal and percent conversion chart covering halves, thirds, quarters, fifths and eighths. A4 and Letter friendly, free. Free to print.',
    intro:
      'This chart lists every common fraction with its decimal and percent equivalents, so a fraction line in a question can be turned into a percent on the same line. The fractions covered — halves, thirds, quarters, fifths and eighths — are the ones that come up most often in elementary and middle-school word problems. Reading down the chart, the percent column is the easiest one to remember because percents are all out of one hundred. The same three columns let a child read 1/4, 0.25 and 25% from a single row. The chart is sized for a single page and prints in black and white.',
    blocks: [
      {
        kind: 'table',
        headers: ['Fraction', 'Decimal', 'Percent'],
        rows: FRACTION_DECIMAL_PERCENT_ROWS,
      },
    ],
    howToUse: [
      'Use the chart to convert any fraction into a percent quickly — read across the row to find the percent.',
      'Reverse the chart for percentages: a question that asks "what is 80% of 250" can be turned into "what is 0.8 × 250" via the decimal column.',
      'Memorise the most common values first (1/2 = 50%, 1/4 = 25%, 3/4 = 75%, 1/3 ≈ 33.3%, 2/3 ≈ 66.7%); the chart covers the rest.',
      'Use the chart for mental-arithmetic practice: have a child convert a fraction into decimal in decimal and into percent, then check the chart.',
      'Use the chart to estimate before calculating: if 0.75 of a number is asked, you can already guess three quarters and then refine.',
    ],
    faq: [
      { q: 'Why do 1/3 and 2/3 have repeating decimals?', a: 'Because 3 does not divide any power of 10 evenly — every third decimal place must carry over, so the digit 3 (or 6) repeats forever.' },
      { q: 'What is the easiest way to convert a percent into a fraction?', a: 'Write the percent over 100 and simplify. 75% becomes 75/100, then 3/4.' },
      { q: 'What is the easiest way to convert a fraction into a percent?', a: 'Multiply by 100. 3/4 × 100 = 75, so 3/4 = 75%.' },
      { q: 'Why does this chart only go to eighths?', a: 'Halves, thirds, quarters, fifths and eighths cover almost every value that comes up in everyday word problems.' },
      { q: 'What is the percent column for?', a: 'It turns the fraction into a percent on the same row, so a question that asks for 25% of a number can be answered by reading across to 1/4.' },
      { q: 'Why does 1/3 appear as 0.333 instead of a rounded value?', a: 'Because 1/3 is a repeating decimal — its digits go on forever. The chart shows three decimal places because that is enough to compare values.' },
      { q: 'What fraction is the same as 12.5%?', a: '1/8. The percent column for 1/8 in the chart is exactly 12.5%.' },
    ],
    related: ['divisibility-rules', 'prime-numbers', 'multiplication-chart'],
  },
  {
    slug: 'area-perimeter-volume-formulas',
    category: 'math',
    title: 'Area & Volume Formulas',
    summary: 'Area, perimeter, volume and surface-area formulae for the standard shapes.',
    description:
      'Printable geometry formulas summary: area, perimeter and circumference for 2D shapes, and volume and surface area for 3D shapes. Free to print. Free to print.',
    intro:
      'This chart groups the geometry formulas most often needed in elementary and middle-school work into four groups: area of 2D shapes, perimeter and circumference of 2D shapes, volume of 3D shapes, and surface area of 3D shapes. Each line is a single formula with the variable letters spelled out, so it can be used without first going back to the textbook. The formulas are listed in the same order as they appear on a geometry test, so the chart works as a memory aid as well as a reference.',
    blocks: [
      {
        kind: 'formulas',
        groups: APV_FORMULAS,
      },
    ],
    howToUse: [
      'Group the formulas by the shape they apply to: rectangle formulas live with rectangles, prism formulas with prisms, and so on.',
      'Always write the variable names next to every number while computing a value — most mistakes here are unit mistakes, not arithmetic ones.',
      'Use the chart to double-check a formula you have just derived: a typo in a constant (like π vs 2π) is easier to spot when the formula is printed next to a list of alternatives.',
      'Pair the chart with the metric-conversions page when computing surface area in unfamiliar units.',
    ],
    faq: [
      { q: 'Why does the chart group formulas by shape?', a: 'Because the formula a child needs depends on the shape they are working with. Grouping by shape lets them jump straight to the right block rather than scanning a long list.' },
      { q: 'What is the difference between area and perimeter?', a: 'Area is the number of unit squares that fit inside a shape, while perimeter is the total length of its outline.' },
      { q: 'Why is volume 1/3 × base × h for a pyramid or cone?', a: 'Because a pyramid or cone fits inside a prism or cylinder of the same base and height, and occupies exactly one third of that prism.' },
      { q: 'Why is the surface area of a sphere 4πr² rather than πr²?', a: 'A sphere has four "great circles" of area πr² wrapped onto its surface, that is the same as the area of the circle that inscribes it, times four.' },
      { q: 'Does this chart include formulas for irregular shapes?', a: 'No. The chart covers the standard named shapes. For irregular shapes, the formula is usually broken into triangles or other standard pieces.' },
      { q: 'Why is the volume of a triangular prism "area of base × height"?', a: 'Because a prism is a stack of identical cross-sections; multiplying the cross-section area by the stack height counts the layers.' },
      { q: 'Why is the surface area of a cube 6 × s²?', a: 'A cube has 6 square faces, each with area s². The formula 6 × s² adds the areas of all six identical faces.' },
    ],
    related: ['multiplication-chart', 'squares-cubes-roots', 'metric-conversions'],
  },
  {
    slug: 'customary-unit-conversions',
    category: 'math',
    title: 'US Customary Unit Conversions',
    summary: 'Length, volume and mass conversions from US customary units to metric.',
    description:
      'Printable US customary unit conversion table covering length (inches to miles), volume (fluid ounces to gallons) and mass (ounces to short tons). Free.',
    intro:
      'This chart converts between US customary units and metric. Each row is a single equality — 1 inch is 2.54 cm, 1 gallon is about 3.785 L, 1 pound is about 453.6 g — so a problem that crosses the two systems becomes a single read instead of a chain of conversions. The chart is intended to sit on a desk next to a homework book so the values do not need to be memorised; they are looked up the moment they are needed.',
    blocks: [
      {
        kind: 'table',
        headers: ['Customary', 'Metric'],
        rows: CUSTOMARY_UNIT_CONVERSIONS_ROWS,
      },
    ],
    howToUse: [
      'Read across the row to find the metric equivalent of a customary value, or multiply by the equality to convert in the other direction.',
      'Round to the precision the problem needs: a cooking conversion in cups is fine to the nearest tenth of a litre, but a science experiment needs the precise 29.574 ml per fluid ounce.',
      'For mixed-unit problems, chain conversions: 5 ft 4 in is 5 × 30.48 + 4 × 2.54 cm.',
      'Use the chart as a sanity check during science experiments where you need an approximate metric value quickly.',
      'Print the chart on a single sheet so a child can refer to it while measuring with a customary ruler or scale.',
      'Use the chart for cooking conversions: 1 cup to millilitres, 1 ounce to grams for butter or flour.',
    ],
    faq: [
      { q: 'What is the US customary system?', a: 'It is the system used in the United States for everyday measurement: inches, pounds, gallons.' },
      { q: 'Why does the chart convert to metric, not to other customary units?', a: 'Because the metric system is the international default, and every problem that crosses a border, a textbook, or a science class needs the metric value.' },
      { q: 'Why are some values exact and some approximate?', a: 'The inch and the pound are defined by the metric system exactly; volumes and mass conversions to the short ton are approximate.' },
      { q: 'What is a short ton?', a: 'It is the US customary ton of 2,000 pounds, about 907 kg. The metric tonne (1,000 kg) is heavier.' },
      { q: 'Does this chart include temperature conversions?', a: 'No. Temperature converts with a formula, not a single equality per degree.' },
      { q: 'Why is 1 ounce defined as 28.350 g rather than a nicer number?', a: 'Because the avoirdupois ounce is defined as exactly 28.349523125 grams, and 28.350 is the value rounded to three decimal places.' },
      { q: 'Is the UK gallon the same as the US gallon?', a: 'No. The UK (imperial) gallon is about 4.546 L; the US gallon is about 3.785 L. The chart lists the US gallon because most US problems use it.' },
      { q: 'How do I convert a weight in pounds to kilograms without the chart?', a: 'Multiply by 0.45359237. The chart rounds this to the nearest tenth of a kilogram, which is close enough for most everyday purposes.' },
    ],
    related: ['multiplication-chart', 'squares-cubes-roots', 'metric-conversions'],
  },
];
