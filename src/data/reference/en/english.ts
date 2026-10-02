import type { ReferencePage } from '../types';
import { IRREGULAR_VERB_ROWS } from './data/irregularVerbs';

export const ENGLISH_PAGES: ReferencePage[] = [
  {
    slug: 'irregular-verbs',
    category: 'english',
    title: 'Irregular Verbs',
    summary: 'Base form, past simple and past participle for common verbs.',
    description:
      'Printable list of common English irregular verbs with their past simple and past participle forms, for grammar practice and revision.',
    intro:
      'This list gives the base form, the past simple and the past participle of 24 common English irregular verbs. Irregular verbs do not take -ed, so their past forms have to be learned rather than worked out. The three columns line up with the three places these forms are needed: the base form after "to", the past simple for finished actions, and the past participle after "have" or "has". Printing it keeps the three forms side by side, which makes the pattern behind each verb easier to see than a dictionary entry does.',
    blocks: [
      {
        kind: 'table',
        headers: ['Base form', 'Past simple', 'Past participle'],
        rows: IRREGULAR_VERB_ROWS,
      },
    ],
    howToUse: [
      'Cover the last two columns and test yourself from the base form — recognition is much easier than recall, and recall is what exams ask for.',
      'Read the past participle aloud with "have" in front of it, because that is how it appears in a sentence.',
      'Group the verbs by pattern as you learn them: "break, broke, broken" and "speak, spoke, spoken" change in the same way.',
    ],
    faq: [
      {
        q: 'What makes a verb irregular?',
        a: 'Its past simple and past participle are not formed by adding -ed. "Walk" becomes "walked", which is regular; "go" becomes "went", which is not.',
      },
      {
        q: 'What is the difference between past simple and past participle?',
        a: 'The past simple stands on its own for a finished action: "I wrote a letter." The past participle needs an auxiliary verb: "I have written a letter."',
      },
      {
        q: 'Why does "read" look the same in all three columns?',
        a: 'The spelling is identical, but the pronunciation changes. The base form and the past participle rhyme with "feed"; the past simple rhymes with "red".',
      },
      {
        q: 'Why does "get" have two past participles?',
        a: '"Got" is standard in British English and "gotten" in American English. Both are correct — pick one and stay consistent.',
      },
    ],
    related: [],
  },
];
