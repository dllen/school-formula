import type { ReferencePage } from '../types';
import { IRREGULAR_VERB_ROWS } from './data/irregularVerbs';
import { PARTS_OF_SPEECH_ROWS } from './data/partsOfSpeech';
import { PHONICS_ROWS } from './data/phonicsSounds';
import { SIGHT_WORDS_ROWS } from './data/sightWords';

export const ENGLISH_PAGES: ReferencePage[] = [
  {
    slug: 'irregular-verbs',
    category: 'english',
    title: 'Irregular Verbs',
    summary: 'Base form, past simple and past participle for common verbs.',
    description:
      'Printable list of common English irregular verbs with their past simple and past participle forms, for grammar practice and revision. Free to print on one page.',
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
      'Read the whole list aloud once before memorising, because hearing the past simple and past participle together catches the silent letters that reading alone misses, especially in British pronunciation.',
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
      {
        q: 'Why do some past participles drop a letter that the past simple kept?',
        a: 'Some verbs shorten the past simple to form the past participle, while others keep the same form for both. "Write, wrote, written" keeps the change, but "buy, bought, bought" and "bring, brought, brought" do not. Spotting which group each verb falls into is a useful shortcut when revising a longer list.',
      },
    ],
    related: ['multiplication-chart', 'metric-conversions'],
  },
  {
    slug: 'phonics-sounds',
    category: 'english',
    title: 'Phonics Sounds Chart',
    summary: 'The 44 phonics sounds with a picture word for each, grouped as phonemes and graphemes.',
    description:
      'Printable phonics chart of the 44 sounds used in English with a picture word for each, grouped into phonemes and graphemes. Free to print on A4 or Letter.',
    intro:
      'English is written with about 44 distinct sounds, and this chart lists them with one picture word that starts with each sound. The upper half groups the consonants, the lower half the vowels and the pairs of letters that make a single sound. Reading the chart beside an early reader gives a child a written reference for the sound they are supposed to make, rather than a rule they have to remember from memory. The picture words are chosen so the target sound always comes first, which is what makes the chart usable while decoding an unfamiliar word.',
    blocks: [
      {
        kind: 'table',
        headers: ['Sound', 'Picture word'],
        rows: PHONICS_ROWS,
      },
    ],
    howToUse: [
      'Cover the picture word and ask the child to say a word starting with that sound, then check it against the printed word to see whether the sound matched.',
      'Use the chart while decoding: point at a letter combination in a book, find the same combination on the chart, and read the picture word to confirm the sound.',
      'Practise the vowel pairs (oo, ow, oi, ou, au, aw, ar, er, or, air, ear) as separate sounds, because these are the pairs most often confused when a child is learning to read.',
    ],
    faq: [
      { q: 'What is a phoneme?', a: 'The smallest unit of sound in a language. English uses around 44 of them, and the letters on the page are only symbols for them, so the same sound can be written in several ways.' },
      { q: 'What is a grapheme?', a: 'The written form of a sound — a letter or a pair of letters. The digraphs such as ch, sh, th and the vowel pairs such as oo and ow are graphemes, because each one stands for a single sound.' },
      { q: 'Why is the th sound listed twice?', a: 'There is one sound but two graphemes, voiced and unvoiced. In this and the breathy sound the throat vibration differs, and a chart that lists only one of them teaches children to say the wrong one.' },
      { q: 'How many vowel sounds are in English?', a: 'Twenty, counting the long and short forms and the diphthongs separately. They are listed in the lower half of the chart, which is where most reading difficulty comes from.' },
      { q: 'Do I need to teach phonics before a child can read?', a: 'Phonics is one of the two methods for teaching reading, the other being whole-word recognition. Most classroom schemes teach both together, because phonics explains unfamiliar words while whole-word recognition makes reading feel fast.' },
    ],
    related: ['sight-words', 'parts-of-speech', 'irregular-verbs'],
  },
  {
    slug: 'sight-words',
    category: 'english',
    title: 'Dolch Sight Words List',
    summary: 'The common sight words grouped by level, from pre-K through grade 3.',
    description:
      'Printable list of the common English sight words grouped by level from pre-K through grade 3, ready to cut into word cards for practice. Free to print.',
    intro:
      'A sight word is one a child recognises instantly, without sounding it out. This list groups the common ones by level, so a kindergartner works only with the pre-K and kindergarten rows rather than the whole list at once. These words make up a large share of the words in any ordinary page of text, which is why they are learned by sight rather than by decoding: knowing them lets a child read a sentence before they can explain the rule behind it. Each row on the chart is printed as one run of words so it can be cut into cards, or covered and read aloud as a recognition drill.',
    blocks: [
      {
        kind: 'table',
        headers: ['Level', 'Words'],
        rows: SIGHT_WORDS_ROWS,
      },
    ],
    howToUse: [
      'Work one level at a time and stop when the child reads a row without hesitating, rather than moving on to the next row because the date says so.',
      'Cover part of a row with a card and ask the child to read the words that are still visible, so recognition is tested rather than recall.',
      'Print a row, cut it into individual cards, and put one card on a card in a game, so the word is practised as well as recognised.',
    ],
    faq: [
      { q: 'What are sight words?', a: 'Words a reader recognises without decoding them letter by letter, such as the, was, their or because. They are the most common words in English, so recognising them speed up reading more than any other single step.' },
      { q: 'How many sight words are there?', a: 'The classic list has 220 words, graded from pre-K through grade 3. This chart shows the core ones at each level, which is what most children need.' },
      { q: 'Why are some sight words hard to sound out?', a: 'Because their spelling does not match their sound. Words like could, enough and people break the letter-sound rules, so they have to be learned as whole shapes instead of decoded.' },
      { q: 'Should sight words be taught before phonics?', a: 'The two are usually taught together. Sight words make reading feel fluent, phonics explains unfamiliar words, and either one on its own leaves a gap.' },
      { q: 'Can this list be printed on cards?', a: 'Yes. Each row is one run of words, so a row can be cut up into individual cards and used for a recognition or matching game.' },
    ],
    related: ['phonics-sounds', 'parts-of-speech', 'irregular-verbs'],
  },
  {
    slug: 'parts-of-speech',
    category: 'english',
    title: 'Parts of Speech Chart',
    summary: 'The eight parts of speech with a short definition and three example words each.',
    description:
      'Printable parts of speech chart listing the eight parts of English with a short definition and three example words each, nouns to interjections. Free to print.',
    intro:
      'Every English word belongs to one of eight parts of speech, and naming the part is the first step in understanding how a sentence works. The chart lists each one with a short definition and three picture examples, so the categories can be recognised by what they do in a sentence rather than by how they look on the page. A noun names a thing, a verb states an action or state, and an adjective or adverb describes one. The remaining four — pronouns, prepositions, conjunctions and interjections — are the linking parts that join the rest into a sentence. Printing the chart next to a writing exercise makes labelling a paragraph straightforward.',
    blocks: [
      {
        kind: 'table',
        headers: ['Part of speech', 'Definition', 'Examples'],
        rows: PARTS_OF_SPEECH_ROWS,
      },
    ],
    howToUse: [
      'Take a single paragraph and underline every noun in one colour, every verb in another, then read the sentence aloud to check whether the grouping makes sense.',
      'When a word is ambiguous, test it by putting it in the phrase a, an or the: if the word fits, it is usually a noun.',
      'Use the chart as a checklist while writing, so that a paragraph has subjects and verbs first, then the joining words that hold the sentences together.',
    ],
    faq: [
      { q: 'What are the parts of speech?', a: 'The categories a word can belong to: noun, pronoun, verb, adjective, adverb, preposition, conjunction and interjection. Together they cover every word in an English sentence.' },
      { q: 'Can a word be more than one part of speech?', a: 'Yes, and the context decides which one applies. Book is a noun in I read the book and a verb in I will book the room, so the sentence around the word is what determines its category.' },
      { q: 'What is the difference between an adjective and an adverb?', a: 'An adjective describes a noun, as in a tall building. An adverb describes a verb, an adjective or another adverb, as in she runs quickly.' },
      { q: 'Are conjunctions the same as prepositions?', a: 'No. A preposition relates one noun to another, as in on the table. A conjunction joins two words or clauses, as in the table is small but it is heavy.' },
      { q: 'Do children need to learn the names of all eight?', a: 'Nouns, verbs and adjectives come first, because they carry most of the meaning. The other five can be introduced gradually as the writing becomes more connected.' },
    ],
    related: ['phonics-sounds', 'sight-words', 'irregular-verbs'],
  },
];
