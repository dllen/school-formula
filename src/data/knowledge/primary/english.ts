/* eslint-disable no-useless-escape */
import type { KnowledgePoint } from '../../types';

export const english: KnowledgePoint[] = [
{
                    id: 'p-eng-001',
                    title: '字母与语音',
                    description: '26个字母读写，元音与辅音发音规则。',
                    funEmoji: '🔡',
                    funFact: '英语只有26个字母，却能组合出超过100万个单词！这是世界上最强大的"积木系统"。',
                    funStory: '你知道吗？英语单词是有"家族"的。比如"act"是"做"，加上前缀后缀就变成了action（行动）、active（活跃的）、actor（演员）、activity（活动）。记住一个词根，就能认识一串单词！',
                    funQuestion: '为什么"minute"（分钟）和"minute"（微小的）拼写一样？',
                    funQuestionAnswer: '它们是同形异义词！minute（分钟）来自拉丁语pars minuta（小的部分），minute（微小的）来自拉丁语minutus（小的）。',
                    detailedExplanation: `
            **26个字母**：Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
            **元音字母**：A E I O U
            **发音规则**：
            - 开音节：以元音字母结尾的音节，元音发字母本身的音 (e.g., name, hi)。
            - 闭音节：以辅音字母结尾的音节，元音发短音 (e.g., bag, hot)。
          `,
                    studyTips: [
                        '唱字母歌辅助记忆。',
                        '多听原版音频，模仿发音，特别是"th", "v", "r"等难点音。'
                    ],
                    practiceQuestions: [
                        { question: '英语中有多少个元音字母？', answer: '5个 (A, E, I, O, U)' },
                        { question: 'bike中i的发音是长音还是短音？', answer: '长音' }
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can write all 26 English letters correctly in both upper case and lower case',
                        'Can say the name of each letter and its most common sound (phonics)',
                        'Understand that A, E, I, O, U are vowel letters and the rest are consonants',
                        'Can tell whether a vowel says its long name or short sound in simple words'
                      ],
                      explanation: `English has **26 letters**, and they are the building blocks of every word you will ever read or write. Let us meet them properly.

Each letter has a **name** (what we say when we recite the alphabet: "A, B, C…") and a **sound** (what we say when we read a word). The sound is called its **phonics**. For example, the letter **B** is named "bee", but its sound is /b/ as in **ball**.

The 26 letters are split into two teams:
- **Vowels**: **A, E, I, O, U** — these are the "engines" of every syllable; almost every word needs one.
- **Consonants**: all the other 21 letters — they usually give a short, quick sound like /b/, /d/, /k/.

A handy trick for short words: if a vowel is "closed in" by a consonant (like the **i** in **pig**), it usually says its **short sound** (/ɪ/). If the vowel is at the end or has a silent **e** pulling it (like the **i** in **bike**), it often says its **long name** (/aɪ/ — "eye"). So **bike** has a long i, but **pig** has a short i.`,
                      examples: [
                        {
                          title: '基础：说出字母的名称和声音',
                          problem: 'Letter B — what is its name and what is its most common sound?',
                          solution: 'Name: "bee". Sound: /b/ (like the start of **ball**, **book**, **bus**).',
                          tip: 'Sing the alphabet song for the name; look at the first sound of a familiar word for the phonics.'
                        },
                        {
                          title: '进阶：元音还是辅音？',
                          problem: 'Which of these letters are vowels: C, E, M, O, R?',
                          solution: 'E and O are vowels. C, M, R are consonants.',
                          tip: 'Remember the vowel team: A-E-I-O-U. Every other letter is a consonant.'
                        },
                        {
                          title: '挑战：长音还是短音？',
                          problem: 'Does the letter "i" in "kite" say its long sound or short sound? What about the "o" in "dog"?',
                          solution: '"kite" → long i (/aɪ/), because of the silent e at the end. "dog" → short o (/ɒ/), because the vowel is closed in by a consonant.',
                          tip: 'Silent e at the end of a word often makes the vowel before it say its long name.'
                        }
                      ],
                      interaction: `🎵 **"字母声音寻宝" Alphabet Sound Hunt**（约 8 分钟）

1. 家长和孩子一起唱一遍《字母歌》（A-B-C-D-E-F-G…），边唱边用手指在空中"写"字母。
2. 家长说一个物品名（如 "apple"），孩子拍出第一个字母的手势并说出声音 /æ/。
3. 进阶：家长说一个声音（如 /b/），孩子说出字母名 "B" 并举起家里以 b 开头的物品（book, banana…）。
4. 最后玩"长音 vs 短音"：家长举卡片 bike/pig, cube/cub, rope/rop，孩子喊 "long!" 或 "short!"。

💡 目的：把抽象的字母名和声音变成身体动作和游戏，建立早期的音素意识（phonemic awareness）。`,
                      exercises: [
                        { question: '写出字母表中第 7 个字母的大小写。', answer: 'G g', explanation: 'A B C D E F G — G 是第 7 个。' },
                        { question: '判断对错：英语中有 6 个元音字母。', answer: '错，有 5 个（A, E, I, O, U）', explanation: '标准英语字母表有 5 个元音字母，Y 有时做元音但不是基本元音。' },
                        { question: '哪个单词中的 a 发长音：cat 还是 cake？', answer: 'cake', explanation: 'cake 末尾有 silent e，所以 a 发长音 /eɪ/；cat 的 a 发短音 /æ/。' },
                        { question: '请举出 3 个以辅音 /d/ 开头的英语单词。', answer: '开放性题，如 dog, door, desk, duck。', explanation: '只要单词首音是 /d/ 即可，鼓励孩子从身边物品找例子。' }
                      ]
                    }
                },
{
                    id: 'p-eng-002',
                    title: '基础词汇',
                    description: '颜色、数字、家庭成员、身体部位、食物、动物、学校用品。',
                    funEmoji: '🌈',
                    funFact: '英语中颜色词汇非常丰富：红色就有red、crimson（深红）、scarlet（鲜红）、ruby（红宝石色）等十几种说法！',
                    funStory: '在英语中，颜色还代表情绪。"blue"是蓝色也是"忧郁"，"green"是绿色也是"嫉妒"（green with envy）。所以当你感觉blue的时候，其实是心情"蓝"了！',
                    funQuestion: '"black tea"为什么不是"黑茶"？',
                    funQuestionAnswer: '是红茶！英国人看到茶叶颜色深就叫black tea，中国人看茶汤颜色叫red tea。',
                    detailedExplanation: `
            **Colors**: red, blue, green, yellow, orange, purple, black, white.
            **Numbers**: one, two, three... ten, eleven, twelve... hundred.
            **Family**: father, mother, brother, sister, grandfather, grandmother.
            **Body**: head, eye, ear, nose, mouth, hand, foot, leg.
          `,
                    studyTips: [
                        '使用单词卡片（Flashcards）进行记忆。',
                        '分类记忆法：把同类的单词放在一起记。',
                        '在生活中指物认词，如指着苹果说"Apple"。'
                    ],
                    practiceQuestions: [
                        { question: '"蓝色"用英语怎么说？', answer: 'blue' },
                        { question: 'twenty-one 是多少？', answer: '21' },
                        { question: '"grandmother" 和 "grandfather" 合称什么？', answer: 'grandparents（祖父母/外祖父母）' }
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can read, spell and say the English words for colours, numbers, family members, body parts and food',
                        'Can group English words into topics (e.g. all fruit words together) to remember them faster',
                        'Can point to a real object and say its English name',
                        'Can use a simple sentence like "This is a …" or "I like …" with the new words'
                      ],
                      explanation: `Words are like tools in a toolbox. The more words you know, the more you can say! In this topic we collect the most useful **basic vocabulary** and sort it into groups so they are easy to remember.

**Colours**: **red, blue, green, yellow, orange, purple, black, white, pink, brown**. Try this: look around the room and name three colours in English — "The **sky** is blue, the **apple** is red, the **leaf** is green!"

**Numbers**: **one, two, three … ten**, then **eleven, twelve … twenty**. Numbers are everywhere: your age, your house number, the time on the clock.

**Family**: **father, mother, brother, sister, grandfather, grandmother** (grandma/grandpa for short). Together, grandfather and grandmother are called **grandparents**; father and mother are your **parents**.

**Body**: **head, eye, ear, nose, mouth, hand, arm, leg, foot (feet)**. Touch your **nose** and say "nose" — that makes the word stick.

**Food & Animals**: **apple, banana, rice, fish, bread …** and **cat, dog, rabbit, bird, elephant …** — these are words children love because they connect to real life.

The best trick? **Stick a word card on the real object** (a "door" label on the door) and say it every time you pass.`,
                      examples: [
                        {
                          title: '基础：按主题归类单词',
                          problem: 'Which word does NOT belong: apple, banana, carrot, orange?',
                          solution: 'carrot. Apple, banana and orange are fruit; carrot is a vegetable.',
                          tip: 'Sorting words into groups (fruit vs. vegetable) makes them much easier to remember.'
                        },
                        {
                          title: '进阶：用单词说句子',
                          problem: 'Look at the colours of three things in your room and make a sentence for each using "The … is …"',
                          solution: 'Sample: "The book is red." "The bag is blue." "The chair is black."',
                          tip: 'Use "The + thing + is + colour" to describe what you see around you.'
                        },
                        {
                          title: '挑战：数一数、说一说',
                          problem: 'How many people are in your family? Say their relationships in English (e.g. father, mother, …).',
                          solution: 'Sample: "There are four people in my family: my father, my mother, my brother and me."',
                          tip: 'Start with the people you see every day — family words are the most personal and memorable.'
                        }
                      ],
                      interaction: `🖍️ **"单词闪卡接力" Flashcard Relay**（约 8 分钟）

1. 准备 15-20 张单词卡（一面图、一面英文），覆盖颜色、动物、食物三个主题。
2. 家长快速举起卡片，孩子抢答英文单词，答对得 1 分。
3. 进阶轮：孩子拿到卡片后必须用它说一个完整句子，如 "I like bananas." 或 "The cat is white." 说对额外加 1 分。
4. 最后把所有卡片按主题分成三堆，和孩子一起检查分对了没有。

💡 目的：通过"看图说词"和"用词造句"两个层次，把被动识别变成主动输出。`,
                      exercises: [
                        { question: '把下列单词按类别分成三组：red, apple, dog, green, banana, cat。', answer: 'Colours: red, green. Fruit: apple, banana. Animals: dog, cat.', explanation: '每个单词属于一个主题，按主题归类是记忆词汇的好方法。' },
                        { question: '填空：My father and my mother are my ______.', answer: 'parents', explanation: 'father 和 mother 合称 parents。' },
                        { question: '用英语说出你身体的五个部位。', answer: '开放性题，如 head, eye, ear, nose, hand。', explanation: '指着自己的身体部位说出对应英文，联系实物加深记忆。' },
                        { question: '翻译：我有一个红色的苹果和两根黄色的香蕉。', answer: 'I have a red apple and two yellow bananas.', explanation: '注意颜色放在名词前（red apple），以及 banana 的复数加 s。' }
                      ]
                    }
                },
{
                    id: 'p-eng-003',
                    title: '日常交际用语',
                    description: '问候、介绍、道别、感谢、道歉、请求。',
                    funEmoji: '👋',
                    funFact: '英语中"How are you?"不是真的问你怎么样，而是一种问候，就像中文的"吃了吗"，回答"I\'m fine"就够了！',
                    funStory: '有个中国学生刚到国外，别人问他"How are you?"他详细描述了自己的身体状况，对方惊呆了！其实这就像中国人见面说"你好"，不需要真的回答"我很好"。',
                    funQuestion: '英国人见面最喜欢聊什么话题？',
                    funQuestionAnswer: '天气！因为英国天气多变，"It\'s a lovely day, isn\'t it?"是最常见的闲聊开场白。',
                    detailedExplanation: `
             - Hello! / Hi!
             - How are you? - I'm fine, thank you.
             - What's your name? - My name is...
             - Nice to meet you.
             - Goodbye! / See you later.
             - Thank you. / Thanks.
             - I'm sorry.
             - Can you help me?
          `,
                    studyTips: [
                        '多和同学或老师用英语打招呼。',
                        '观看简单的英文动画片，模仿角色的对话。'
                    ],
                    practiceQuestions: [
                        { question: '别人对你说 "Thank you!"，你应该怎么回答？', answer: "You're welcome. / That's OK." },
                        { question: '"Nice to meet you." 的常见回答是什么？', answer: 'Nice to meet you, too.' },
                        { question: '想请别人帮忙，应该怎么说？', answer: 'Can you help me? / Please help me.' }
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can greet others with "Hello / Hi / Good morning" and respond naturally',
                        'Can say goodbye using "Goodbye / See you later"',
                        'Can say "Thank you" and reply with "You\'re welcome"',
                        'Can make simple requests with "Can you help me?" and say "I\'m sorry" when needed'
                      ],
                      explanation: `Every language starts with hello. In English, the same idea can be said in a few friendly ways — and you choose the one that fits the moment.

**Greetings** (saying hello):
- **"Hello!" / "Hi!"** — works any time, with anyone.
- **"Good morning / Good afternoon / Good evening"** — for a specific time of day.
- **"How are you?"** — a friendly check-in. The usual reply is **"I\'m fine, thank you."** (It is just a greeting, not a real question about your health!)

**Introductions** (saying who you are):
- **"What\'s your name?"** → **"My name is Lily."** (or just "I\'m Lily.")
- **"Nice to meet you."** → **"Nice to meet you, too."**

**Thanking & Apologising**:
- **"Thank you." / "Thanks."** → **"You\'re welcome." / "That\'s OK."**
- **"I\'m sorry."** → **"That\'s OK. / It\'s OK."**

**Requests** (asking for help):
- **"Can you help me?"** or **"Please help me."** — polite ways to ask.

Real-life tip: when a classmate says "Hi!" to you in the hallway, just smile and say "Hi!" back. That is a real English conversation already!`,
                      examples: [
                        {
                          title: '基础：选择合适的问候',
                          problem: 'It is 8:00 in the morning. You see your teacher. What do you say?',
                          solution: '"Good morning, teacher!" (We use "Good morning" in the morning, not "Good afternoon".)',
                          tip: 'Match the greeting to the time: morning → Good morning; afternoon → Good afternoon.'
                        },
                        {
                          title: '进阶：完成对话',
                          problem: 'A new classmate says "Nice to meet you." What is your reply?',
                          solution: '"Nice to meet you, too."',
                          tip: 'Add "too" to show you feel the same way — it is the standard polite reply.'
                        },
                        {
                          title: '挑战：情景反应',
                          problem: 'Your friend says "Thank you for the pencil!" Choose the best reply: (a) I\'m sorry (b) You\'re welcome (c) Goodbye.',
                          solution: '(b) "You\'re welcome." — the correct reply to "Thank you".',
                          tip: 'Pair them up: "Thank you" → "You\'re welcome"; "I\'m sorry" → "That\'s OK."'
                        }
                      ],
                      interaction: `🎭 **"角色扮演小剧场" Role-play Theatre**（约 8 分钟）

1. 家长和孩子各选一张"情景卡"：① 早上见到老师 ② 遇到新同学 ③ 借同学橡皮 ④ 不小心碰到别人。
2. 两人分角色用英语表演对话，至少交换 2-3 个来回。例如：
   - A: "Hello! What\'s your name?"  B: "My name is Tom. Nice to meet you."  A: "Nice to meet you, too."
3. 交换角色再演一遍，鼓励孩子加上表情和手势。
4. 挑战升级：关掉中文提示，只看图卡，全程用英语完成。

💡 目的：把固定句型放进真实情景，让孩子开口说英语变得自然、不害羞。`,
                      exercises: [
                        { question: '别人对你说 "How are you?"，你应该怎么回答？', answer: "I'm fine, thank you.", explanation: '"How are you?" 是问候，标准回答是 "I\'m fine, thank you."' },
                        { question: '选择正确答案：— Thank you. — ______.  (A) Goodbye  (B) You\'re welcome  (C) I\'m sorry', answer: 'B', explanation: '对 "Thank you" 的回答是 "You\'re welcome."（不客气）。' },
                        { question: '把下列句子按合理顺序排列，组成一段初次见面的对话：(a) Nice to meet you, too. (b) Hello! My name is Amy. (c) Hi! I\'m Bob. Nice to meet you.', answer: 'b → c → a', explanation: '先自我介绍，对方也自我介绍并说 Nice to meet you，最后用 Nice to meet you, too 回应。' },
                        { question: '你想请妈妈帮你拿一本书，用英语怎么说？', answer: 'Can you help me (get the book)? / Please help me.', explanation: '用 "Can you help me?" 是礼貌请求帮助的表达。' }
                      ]
                    }
                },
{
                    id: 'p-eng-004',
                    title: '基本语法',
                    description: '名词单复数、人称代词、be动词、一般现在时、现在进行时。',
                    funEmoji: '📐',
                    funFact: '英语语法其实比中文简单！中文没有时态变化，却有量词（一只鸡、一条鱼、一张纸），英语没有量词，却有时态变化。',
                    funStory: '英语中最常见的动词是"be"，它有三种形式：am、are、is。记住口诀："I用am，you用are，is连着他她它"。比如：I am happy. You are smart. He is tall.',
                    funQuestion: '为什么"I am a student"有"a"，而"我是学生"没有"一个"？',
                    funQuestionAnswer: '英语可数名词前面必须加冠词a/an或the，这是英语的规则。中文不需要量词。',
                    detailedExplanation: `
            **Be动词**：I am, You are, He/She/It is, We/They are. (口诀：我用am，你用are，is连着他她它)
            **单复数**：一般加s，特殊变化要记清 (book-books, box-boxes, man-men)。
            **现在进行时**：be + v-ing (I am reading.)
          `,
                    studyTips: [
                        '多造句，把语法规则用到句子里去理解。',
                        '注意动词的第三人称单数变化（play-plays, go-goes）。'
                    ],
                    practiceQuestions: [
                        { question: 'He ____ (is/are) a student.', answer: 'is' },
                        { question: 'They are ____ (run) now.', answer: 'running' }
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can choose the correct form of "be" (am / is / are) to match the subject',
                        'Can change a singular noun to its plural form with -s / -es and recognise common irregular ones',
                        'Can make a present continuous sentence with "be + verb-ing" for an action happening now',
                        'Can use personal pronouns (I, you, he, she, it, we, they) to replace nouns'
                      ],
                      explanation: `Grammar is like the "rules of the road" for sentences — once you know them, you can say things clearly and correctly. In this topic we learn four small but powerful rules.

**1. The verb "be" (am / is / are)** — it changes shape depending on who we are talking about:
- **I am** (I'm) → I am a student.
- **You are** (You're) → You are my friend. (one person OR many)
- **He / She / It is** (He's) → He is tall. She is kind. It is a cat.
- **We / They are** (We're) → We are happy. They are teachers.
Remember the rhyme: **"I 用 am，you 用 are，is 连着他、她、它。"**

**2. Personal pronouns** — tiny words that replace names so we do not repeat them:
- **I, you, he, she, it, we, they** (subject pronouns).
- Example: "Lily is 8. **She** is a student." (instead of "Lily is a student" again.)

**3. Singular and plural nouns** — how to show "one" vs. "more than one":
- Most nouns: add **-s** (book → books, pen → pens).
- After s, x, sh, ch: add **-es** (box → boxes, watch → watches).
- Irregular: you just have to remember — **man → men, child → children, foot → feet**.

**4. Present continuous (现在进行时)** — for an action happening RIGHT NOW:
- Structure: **am / is / are + verb-ing**.
- "I **am reading**." "She **is singing**." "They **are playing**."
- To make -ing: usually just add -ing (play → playing); drop a silent e (make → making); double the last letter in some short words (run → running, swim → swimming).`,
                      examples: [
                        {
                          title: '基础：选对 be 动词',
                          problem: 'Choose the correct word: He ____ a teacher. (am / is / are)',
                          solution: 'is. "He" goes with "is". → He is a teacher.',
                          tip: 'Singular subjects (he/she/it) use "is"; plural (we/they) use "are"; "I" uses "am".'
                        },
                        {
                          title: '进阶：名词变复数',
                          problem: 'Write the plural of: bus, tomato, child, box.',
                          solution: 'buses, tomatoes, children, boxes.',
                          tip: 'bus/box add -es (ends in s or x); tomato adds -es (ends in o, a few words do this); child is irregular (children).'
                        },
                        {
                          title: '挑战：用现在进行时写句子',
                          problem: 'Look at this scene: "The boy / football / now." Make a sentence in the present continuous.',
                          solution: 'The boy is playing football now.',
                          tip: 'Structure: subject (The boy) + is + verb-ing (playing) + the rest (football now). The word "now" is a clue for present continuous.'
                        }
                      ],
                      interaction: `🏃 **"语法快问快答" Grammar Lightning Race**（约 8 分钟）

1. 家长快速说一个主语（如 "I", "the cats", "my mother"），孩子抢答正确的 be 动词（am/is/are），答对得 1 分。
2. 第二轮：家长说单数名词（如 "bus", "mouse"），孩子说出复数形式。
3. 第三轮"动作猜猜猜"：家长做一个动作（如读书、喝水），孩子用现在进行时造句："You are drinking water." 家长答 "Yes, I am!" 或 "No, I\'m not — I\'m…"
4. 最后 2 分钟：孩子当小老师，考家长三个题。

💡 目的：通过快速反应和动作游戏，把语法规则变成"肌肉记忆"，避免死记硬背。`,
                      exercises: [
                        { question: 'I ____ 10 years old. (am / is / are)', answer: 'am', explanation: '"I" 永远和 "am" 搭配。' },
                        { question: '写出下列名词的复数：sheep, knife, baby, watch。', answer: 'sheep, knives, babies, watches', explanation: 'sheep 单复数同形；knife 变 f 为 v 加 es；baby 辅音+y 变 i 加 es；watch 加 es。' },
                        { question: '用现在进行时改写句子：She reads a book every day. → She ____ a book now.', answer: 'is reading', explanation: '"now" 表示正在发生，用 be + v-ing：is reading。' },
                        { question: '改错：They is playing games.', answer: 'They are playing games.', explanation: '"They" 是复数，be 动词用 are，不用 is。' },
                        { question: '用人称代词替换划线部分："Tom and I" → ______', answer: 'We', explanation: '"Tom and I" 是第一人称复数，用 we。' }
                      ]
                    }
                },
{
                    id: 'p-eng-005',
                    title: '自然拼读',
                    description: '字母组合发音规则、音节划分、拼读技巧。',
                    funEmoji: '🔊',
                    funFact: '英语中约80%的单词符合自然拼读规则！掌握Phonics，即使遇到不认识的单词，你也能正确读出它的发音。这就是为什么欧美小朋友很少背单词，因为他们会"拼着读"！',
                    funStory: '想象一下，单词就像一辆汽车，每个字母是一个零件。辅音字母是车轮，元音字母是发动机。sh_组合在一起像"嘘——"的声音（shh），ch_组合像火车"哐哐"声（ch-ch）。当你学会这些"零件"的发音，拼在一起就能让汽车跑起来——读出单词啦！',
                    funQuestion: '"ship"和"sheep"发音有什么不同？',
                    funQuestionAnswer: 'ship /ʃɪp/ 中i发短音ɪ，sheep /ʃiːp/ 中ee发长音iː。字母组合"ee"通常发长音/iː/，而单个辅音后面的i发短音/ɪ/。',
                    detailedExplanation: `
            **辅音字母组合**：
            - sh → /ʃ/ ship, fish, wash
            - ch → /tʃ/ chip, much, chair
            - th → /θ/ think, mouth（清音）或 /ð/ this, mother（浊音）
            - wh → /w/ what, white
            - ph → /f/ phone, photo

            **元音字母组合**：
            - ai/ay → /ei/ rain, day
            - ee/ea → /iː/ feet, seat
            - oa/ow → /əʊ/ boat, show
            - oo → /uː/ food 或 /u/ book
            - ou/ow → /au/ house, cow

            **音节划分规则**：
            - 一归后：两个元音之间有一个辅音，辅音归后面（ba-con）
            - 二分开：两个元音之间有两个辅音，分别归属（but-ter）

            **拼读三步法**：
            1. 找出字母组合，读出每个音素
            2. 把音素连起来读
            3. 听一听是不是学过的单词
          `,
                    studyTips: [
                        '多听原版音频，先听清楚发音再模仿拼读。',
                        '准备一个"字母组合表"，把学过的组合归类整理。',
                        '遇到长单词先划分音节，一部分一部分拼，再连起来读。'
                    ],
                    practiceQuestions: [
                        { question: '写出"ch"的三个例词。', answer: 'chip, chair, much, teach, chicken（任选三个）' },
                        { question: '"boat"中哪个字母组合发 /əʊ/ 音？', answer: 'oa 组合发 /əʊ/ 音' },
                        { question: '把 "strawberry" 划分成音节。', answer: 'straw-ber-ry（三个音节）' }
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can say the sounds of common consonant teams: sh, ch, th, wh, ph',
                        'Can read vowel teams (ai/ay, ee/ea, oa/ow, oo, ou/ow) and tell their usual sounds',
                        'Can split a longer word into syllables to read it part by part',
                        'Can use the three-step phonics method to read an unfamiliar word'
                      ],
                      explanation: `Phonics is a superpower: it lets you **read a word you have never seen before** by "sounding it out". About 80% of English words follow phonics rules — so once you know the rules, you can read most things!

**Consonant teams (辅音字母组合)** — two consonants that join to make one new sound:
- **sh** → /ʃ/ (like "shh! be quiet"): **ship, fish, wash**
- **ch** → /tʃ/ (like a train "choo-choo"): **chip, chair, much**
- **th** → /θ/ (tongue between teeth, unvoiced): **think, mouth, three**
- **th** → /ð/ (tongue between teeth, voiced): **this, mother, that**
- **wh** → /w/: **what, white, whale**
- **ph** → /f/ (yes, /f/!): **phone, photo, elephant**

**Vowel teams (元音字母组合)** — when two vowels go walking, usually the first one does the talking:
- **ai / ay** → /eɪ/: **rain, day, play**
- **ee / ea** → /iː/: **feet, seat, tree**
- **oa / ow** → /əʊ/: **boat, show, coat**
- **oo** → /uː/ (food) OR /ʊ/ (book) — you have to try both
- **ou / ow** → /aʊ/: **house, cow, cloud**

**Three-step phonics method (拼读三步法)**:
1. **Spot the teams** — circle any consonant or vowel teams.
2. **Sound each part** — say each sound in order.
3. **Blend and check** — slide the sounds together and see if it makes a known word.`,
                      examples: [
                        {
                          title: '基础：读出字母组合的发音',
                          problem: 'What sound does "sh" make in "ship"? Read the word aloud.',
                          solution: '"sh" = /ʃ/. Blend: /ʃ/ + /ɪ/ + /p/ → "ship" /ʃɪp/.',
                          tip: 'When you see "sh", always say the "shh" sound; do not read s and h separately.'
                        },
                        {
                          title: '进阶：拼读一个生词',
                          problem: 'Use the three-step method to read: "throat".',
                          solution: 'Step 1: teams = "th" + "oa" + "t". Step 2: /θ/ + /r/ + /əʊ/ + /t/. Step 3: blend → "throat" /θrəʊt/.',
                          tip: 'oa says /əʊ/ (like "boat"); th at the start of a word is usually the unvoiced /θ/.'
                        },
                        {
                          title: '挑战：划分音节再拼读',
                          problem: 'Split "strawberry" into syllables, then read it.',
                          solution: 'Two consonants between vowels → split in the middle: straw-ber-ry. Read: /strɔː/ + /bə/ + /ri/ → "strawberry".',
                          tip: 'Rule of thumb: two vowels with two consonants between them → split between the consonants (but-ter).'
                        }
                      ],
                      interaction: `🦘 **"自然拼读跳房子" Phonics Hopscotch**（约 10 分钟）

1. 在地上用粉笔或胶带画 6-8 个格子，每格写一个字母组合：sh, ch, th, ai, ee, oa, oo。
2. 孩子跳到一个格子，大声读出它的发音（如 "sh → /ʃ/!"），然后读出一个含该组合的单词（如 "ship"）。
3. 家长随机写一个新词卡片（如 "cloud", "photo", "rain"），孩子先圈出字母组合，再三步拼读。
4. 进阶挑战：家长说一个声音 /θ/，孩子跳到 "th" 格并说三个含 th 的单词。

💡 目的：把"看字母→想声音→拼出词"的解码过程变成身体游戏，强化拼读自动化。`,
                      exercises: [
                        { question: '写出含 "ch" 的 3 个单词。', answer: '开放性题，如 chair, chip, much, chicken, watch。', explanation: '只要单词中含字母组合 ch 且发 /tʃ/ 即可。' },
                        { question: '"food" 和 "book" 中的 "oo" 发音相同吗？', answer: '不同。food 中 oo 发长音 /uː/，book 中 oo 发短音 /ʊ/。', explanation: 'oo 有两种常见发音，需要结合单词记忆；moon/food 是长音，book/look 是短音。' },
                        { question: '用三步拼读法读出：sheep。', answer: 'sh (/ʃ/) + ee (/iː/) + p (/p/) → /ʃiːp/ sheep。', explanation: '先找组合 sh 和 ee，分别读出声音，再连起来。' },
                        { question: '划分音节：butterfly。', answer: 'but-ter-fly（三个音节）', explanation: '两个元音间有两个辅音 tt → 分开：but-ter-fly。' }
                      ]
                    }
                },
{
                    id: 'p-eng-006',
                    title: '时态拓展',
                    description: '一般过去时、一般将来时的基本用法与时态判断。',
                    funEmoji: '⏰',
                    funFact: '英语有12种时态，但小学阶段只需要掌握其中最常用的4种！时态就像时间机器，让你准确地说出事情是"刚才发生"还是"将要发生"。',
                    funStory: '小明说"I eat breakfast every day"（我每天吃早饭），这是现在的事。但如果他说"I ate breakfast yesterday"（昨天吃了早饭），动词eat变成了ate！英语用动词的变化来表示时间，就像给照片贴上"昨天""明天"的标签。学会了时态，你就能准确告诉别人事情发生在什么时候了！',
                    funQuestion: '为什么"He goes to school"中go要加es，而"He will go to school"中go不加？',
                    funQuestionAnswer: '一般现在时中第三人称单数要加s/es，但一般将来时中will后面的动词用原形，不需要变化。',
                    detailedExplanation: `
            **一般现在时**：表示经常做的事或事实。
            - 结构：主语 + 动词原形/第三人称单数
            - 第三人称单数变化：加s/es（work-works, go-goes, watch-watches）
            - 时间标志词：always, usually, often, sometimes, every day

            **一般过去时**：表示过去发生的事。
            - 结构：主语 + 动词过去式
            - 规则变化：加ed（play-played）；以e结尾加d（live-lived）；辅音+y结尾改y为i加ed（study-studied）
            - 不规则变化：go-went, eat-ate, see-saw, do-did（需要逐个记忆）
            - 时间标志词：yesterday, last week/month/year, ago, just now

            **一般将来时**：表示将要发生的事。
            - 结构1：主语 + will + 动词原形
            - 结构2：主语 + be going to + 动词原形
            - 时间标志词：tomorrow, next week/month/year, in the future

            **时态判断技巧**：找时间标志词 → 确定时态 → 用对应动词形式
          `,
                    studyTips: [
                        '记住口诀：现在时看"经常"，过去时看"已经"，将来时看"将要"。',
                        '不规则动词过去式要专门记忆，可以做成卡片每天复习。',
                        '做题时先找时间词，再确定时态，最后写动词形式。'
                    ],
                    practiceQuestions: [
                        { question: '写出下列动词的过去式：go, eat, see, do, play', answer: 'go→went, eat→ate, see→saw, do→did, play→played' },
                        { question: '用所给词的正确形式填空：She ____ (watch) TV every evening.', answer: 'watches（一般现在时第三人称单数）' },
                        { question: '把这句话改成一般将来时：I visit my grandma next Sunday.', answer: 'I will visit my grandma next Sunday. / I am going to visit my grandma next Sunday.' }
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can tell the difference between present simple, past simple and future by spotting time words',
                        'Can make present simple sentences with the third-person singular -s / -es ending',
                        'Can change regular verbs to past (-ed) and recall common irregular past forms',
                        'Can make future sentences with "will + verb" and "be going to + verb"'
                      ],
                      explanation: `English has many tenses, but in primary school we only need the **three most useful ones**. Think of them as a time line: **before → now → later**.

**1. Present simple (一般现在时)** — for habits, routines and facts.
- Structure: **subject + verb** (add **-s / -es** when the subject is he / she / it).
- "I **play** football every day." BUT "Tom **plays** football every day."
- Spelling: most add -s (work → works); add -es after s/x/ch/sh/o (watch → watches, go → goes); consonant + y → ies (study → studies).
- Time clues: **always, usually, often, sometimes, every day**.

**2. Past simple (一般过去时)** — for something that already happened.
- Structure: **subject + past verb**.
- Regular: add **-ed** (play → played; live → lived; stop → stopped).
- Irregular: you must memorise these — **go → went, eat → ate, see → saw, do → did, buy → bought**.
- Time clues: **yesterday, last week/month/year, ago, just now**.

**3. Future simple (一般将来时)** — for something that has not happened yet.
- Two structures: **will + verb** OR **be going to + verb**.
- "I **will visit** my grandma." = "I **am going to visit** my grandma."
- Time clues: **tomorrow, next week/month/year, in the future**.

**The golden trick**: find the **time word** first → pick the tense → use the correct verb form.`,
                      examples: [
                        {
                          title: '基础：找时间词、定时态',
                          problem: 'Which tense? "She ____ (watch) TV every evening."',
                          solution: 'Present simple → "watches". The phrase "every evening" signals a habit; with "she" we add -es.',
                          tip: '"Every evening" = routine → present simple; third person → watches.'
                        },
                        {
                          title: '进阶：写出过去式',
                          problem: 'Write the past tense of: go, eat, see, do, dance.',
                          solution: 'go → went, eat → ate, see → saw, do → did, dance → danced.',
                          tip: 'The first four are irregular (memorise them!); dance is regular → just add -d.'
                        },
                        {
                          title: '挑战：按要求变换句子',
                          problem: 'Change to future: "I play basketball every Saturday." (use "next Saturday")',
                          solution: 'I will play basketball next Saturday. / I am going to play basketball next Saturday.',
                          tip: 'Change the time word (every Saturday → next Saturday) and use "will + verb" or "be going to + verb".'
                        }
                      ],
                      interaction: `🎰 **"时态大转盘" Tense Spinner**（约 8 分钟）

1. 做一个三格转盘：一般现在时 / 一般过去时 / 一般将来时，每格贴上时间词提示卡（every day, yesterday, tomorrow）。
2. 孩子转转盘，家长说一个动词原形（如 "go"），孩子根据转盘结果造句：转到"过去时"就说出 went 并造句 "I went to the park yesterday."
3. 进阶：家长说一个完整句子但故意用错时态（如 "I watch TV yesterday"），孩子当"小医生"找错并改正。
4. 挑战：连续转 5 次，每次必须换一个不同的主语（I / she / they…）。

💡 目的：通过"时间词→时态→动词形式"的链条反应，建立时态判断的直觉。`,
                      exercises: [
                        { question: 'He ____ (go) to school every day. (用所给词的正确形式填空)', answer: 'goes', explanation: 'every day 是一般现在时的标志；he 是第三人称单数，go 加 es。' },
                        { question: '写出下列动词的过去式：study, stop, buy, live。', answer: 'studied, stopped, bought, lived', explanation: 'study→辅音+y 变 i 加 ed；stop 双写 p 加 ed；buy 不规则→bought；live 直接加 d。' },
                        { question: '把下列句子改为一般将来时：She reads a book tonight.', answer: 'She will read a book tonight. / She is going to read a book tonight.', explanation: '将来时用 will 或 be going to，动词用原形 read。' },
                        { question: '改错：I goed to the park yesterday.', answer: 'I went to the park yesterday.', explanation: 'go 的过去式是不规则变化 went，不是 goed。' },
                        { question: '给下面每个时间词配上一个正确的时态：last Monday / usually / next week。', answer: 'last Monday → 一般过去时；usually → 一般现在时；next week → 一般将来时。', explanation: '时间词是判断时态的"信号灯"。' }
                      ]
                    }
                },
{
                    id: 'p-eng-009',
                    title: '字母认读',
                    description: '26个英文字母的大小写与发音。',
                    funEmoji: '🍎',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，字母认读就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有字母认读的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「字母认读」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「字母认读」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **字母认读** 是英语学习的重要内容。26个英文字母的大小写与发音。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出字母认读，激发学习热情。',
                      '**分步渐进**：将字母认读拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「字母认读」的基本含义是什么？', answer: '（基础题）26个英文字母的大小写与发音。' },
                      { question: '举一个生活中与「字母认读」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「字母认读」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can recognise and write all 26 letters in both upper case and lower case',
                        'Can say the alphabet in order from A to Z',
                        'Can tell which letters are vowels and which are consonants',
                        'Can find English letters and words in everyday life (on signs, packaging, books)'
                      ],
                      explanation: `The English alphabet has **26 letters**, and every word you will ever read is built from these 26 friends. Learning to recognise them is the very first step in reading English.

Each letter comes in two forms:
- **Upper case (大写)**: A, B, C … — used at the start of a sentence and for names.
- **Lower case (小写)**: a, b, c … — used for most of the writing you will do.

A handy chant to remember the five vowels: **"A, E, I, O, U — and sometimes Y."** All the other 21 letters are consonants.

Real-life tip: English is everywhere — on your **T-shirt**, your **cereal box**, the **traffic sign** ("STOP"), and the **app icons** on a tablet. Whenever you spot a letter, say its name and sound out loud. That turns the whole world into your classroom!`,
                      examples: [
                        {
                          title: '基础：辨认大小写',
                          problem: 'Write the lower case of: G, M, R, T, W.',
                          solution: 'g, m, r, t, w.',
                          tip: 'Say the letter, then write both forms together: "G g, M m" — it helps your brain link the pair.'
                        },
                        {
                          title: '进阶：按顺序背字母',
                          problem: 'Which letter comes after P? Which letter comes before M?',
                          solution: 'After P comes Q. Before M comes L.',
                          tip: 'Sing the alphabet song slowly and point to each letter on a chart — music makes memorising easy.'
                        },
                        {
                          title: '挑战：在生活中找字母',
                          problem: 'Look around your room and find 5 things with English letters on them. Say the first letter of each item.',
                          solution: 'Sample: the word "Milk" on a carton starts with M; "Rice" starts with R; "STOP" on a card starts with S.',
                          tip: 'Turn it into a daily game: every time you see English outside, shout the first letter!'
                        }
                      ],
                      interaction: `🔤 **"字母身体操" Alphabet Body Game**（约 6 分钟）

1. 家长随机说一个字母，孩子用身体摆出它的大写形状（如 T 形站立、S 形扭动），家长猜是哪个字母。
2. 交换角色：孩子说字母，家长来摆，看谁摆得最像、猜得最快。
3. 最后一起唱《字母歌》，每唱到一个字母就在空中用手指"写"出它的小写。
4. 挑战：家长说一个单词（如 "cat"），孩子依次摆出 c、a、t 三个字母。

💡 目的：把字母形状和名称通过全身动作内化，让孩子"用身体记住字母"，特别适合低年级动觉学习者。`,
                      exercises: [
                        { question: '英语字母表一共有多少个字母？', answer: '26 个。', explanation: '从 A 到 Z 共 26 个字母。' },
                        { question: '写出字母表中紧邻在 F 前后的两个字母。', answer: 'E 和 G', explanation: '顺序是 E, F, G。' },
                        { question: '找出下列字母中的元音字母：B, E, K, O, Y。', answer: 'E 和 O（Y 有时作元音，但基本元音是 E 和 O）。', explanation: '基本元音是 A, E, I, O, U。' },
                        { question: '你身边有哪些物品上印有英文字母？举出 3 个。', answer: '开放性题，如书本封面、文具盒、零食包装。', explanation: '鼓励孩子在生活中主动发现英语，建立"英语在身边"的意识。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-010',
                    title: '元音字母',
                    description: 'a/e/i/o/u的发音规律与拼读。',
                    funEmoji: '✏️',
                    funFact: '英语是世界通用的桥梁。',
                    funStory: '在英语学习的奇妙旅程中，元音字母就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有元音字母的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「元音字母」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「元音字母」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **元音字母** 是英语学习的重要内容。a/e/i/o/u的发音规律与拼读。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出元音字母，激发学习热情。',
                      '**分步渐进**：将元音字母拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「元音字母」的基本含义是什么？', answer: '（基础题）a/e/i/o/u的发音规律与拼读。' },
                      { question: '举一个生活中与「元音字母」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「元音字母」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can name the five vowel letters A, E, I, O, U and explain why they are special',
                        'Can tell the difference between the long sound and short sound of each vowel in simple words',
                        'Can spot the vowel letter in a word and guess whether it says its name or its short sound',
                        'Can read simple CVC and silent-e words by using vowel rules'
                      ],
                      explanation: `The five **vowel letters — A, E, I, O, U** — are the "engines" of almost every English syllable. Without a vowel, most words cannot be pronounced! (That is why they are so special.)

Each vowel has at least two common sounds:
- Its **long sound** — it says its own **letter name**: A /eɪ/, E /iː/, I /aɪ/, O /əʊ/, U /juː/.
- Its **short sound** — a quick, clipped sound: A /æ/, E /e/, I /ɪ/, O /ɒ/, U /ʌ/.

How to guess which sound a vowel will make in a short word?
- If the vowel is **closed in** by a consonant (like the **a** in **cat**), it usually says its **short sound** /æ/.
- If the word has a silent **e** at the end pulling the vowel (like the **a** in **cake**), the vowel often says its **long name** /eɪ/.

A fun way to remember the vowels: sing **"A, E, I, O, U"** to the tune of "Twinkle, Twinkle, Little Star". Whenever you meet a new short word, first find the vowel, then decide — long name or short sound?`,
                      examples: [
                        {
                          title: '基础：说出元音的长音和短音',
                          problem: 'What is the long sound and short sound of the letter "o"? Give one example word for each.',
                          solution: 'Long o = /əʊ/ as in "nose"; short o = /ɒ/ as in "dog".',
                          tip: 'Long o says its name "oh"; short o is a quick clipped sound like in "hot".'
                        },
                        {
                          title: '进阶：判断单词中元音的发音',
                          problem: 'Does the "a" in "hat" or "hate" say the long sound?',
                          solution: '"hate" says the long sound /eɪ/ (silent e pulls it); "hat" says the short sound /æ/.',
                          tip: 'Silent e at the end is a big clue — it often makes the vowel before it say its long name.'
                        },
                        {
                          title: '挑战：读出含元音的生词',
                          problem: 'Use the vowel rule to read: "cube".',
                          solution: 'Silent e at the end → the "u" says its long name /juː/. Read: /kjuːb/ → "cube".',
                          tip: 'Look for silent e first; if it is there, the earlier vowel usually says its letter name.'
                        }
                      ],
                      interaction: `🎯 **"元音投篮" Vowel Shoot**（约 8 分钟）

1. 在地上贴 5 个篮子（或纸盒），分别写上 A, E, I, O, U。
2. 家长举起单词卡（如 "cake", "cat", "bike", "pig"），孩子先判断元音发长音还是短音，然后把球投进对应元音的篮子。
3. 投中后大声读出单词，并说明原因："cake — long a, because of the silent e!"
4. 进阶：家长说一个声音 /ɪ/，孩子找出含短 i 的单词卡（如 "fish", "milk"）并投进 I 篮。

💡 目的：把抽象的"长音/短音"判断变成一个有动作、有目标的游戏，强化 silent-e 规则。`,
                      exercises: [
                        { question: '英语中有哪 5 个元音字母？', answer: 'A, E, I, O, U', explanation: '这 5 个字母是元音，其余 21 个是辅音。' },
                        { question: '判断："pen" 中的 e 发长音还是短音？', answer: '短音 /e/', explanation: 'e 被辅音 n 关在中间，发短音。' },
                        { question: '哪个单词中的 i 发长音：sit 还是 kite？', answer: 'kite', explanation: 'kite 末尾有 silent e，所以 i 发长音 /aɪ/。' },
                        { question: '写出 3 个含长音 a 的单词。', answer: '开放性题，如 cake, name, face, lake。', explanation: '含 silent e 或开音节的 a 通常发长音 /eɪ/。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-011',
                    title: '音标入门',
                    description: '48个国际音标的认读，学习自然拼读。',
                    funEmoji: '/flag_uk',
                    funFact: '每天一个小单词，一年就是365个新朋友。',
                    funStory: '在英语学习的奇妙旅程中，音标入门就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有音标入门的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「音标入门」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「音标入门」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **音标入门** 是英语学习的重要内容。48个国际音标的认读，学习自然拼读。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出音标入门，激发学习热情。',
                      '**分步渐进**：将音标入门拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「音标入门」的基本含义是什么？', answer: '（基础题）48个国际音标的认读，学习自然拼读。' },
                      { question: '举一个生活中与「音标入门」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「音标入门」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can understand that phonetic symbols are a code for sounds, not new letters',
                        'Can read common vowel and consonant symbols such as /æ/, /iː/, /ʃ/, /θ/',
                        'Can look up the pronunciation of a new word in a dictionary using its phonetic symbols',
                        'Can use phonics and phonetic symbols together to read unfamiliar words'
                      ],
                      explanation: `Phonetic symbols (音标) are like a **secret code for sounds**. The same English letter can make different sounds in different words (think of "a" in "cat", "cake" and "car"). Phonetic symbols solve this problem — **one symbol always means one sound**, so you can read any word correctly, even the first time you see it.

There are **48 symbols** in the International Phonetic Alphabet for English: 20 vowel sounds and 28 consonant sounds. In primary school, you do not need to master all 48 at once — start with the ones that confuse you most.

A few symbols to begin with:
- **/æ/** — the short a in **cat**
- **/iː/** — the long ee in **sheep**
- **/ʃ/** — the "sh" sound in **ship**
- **/θ/** — the "th" sound in **think** (stick your tongue out!)
- **/ð/** — the "th" sound in **this**
- **/ɒ/** — the short o in **dog**

How to use them: when you look up a word in a dictionary, you will see symbols in slashes / / or brackets [ ]. Read the symbols one by one, then blend the sounds. This works even for brand-new words — that is the power of phonetic symbols!`,
                      examples: [
                        {
                          title: '基础：说出音标对应的单词',
                          problem: 'You see the symbol /iː/. Which English sound does it match? Give a word that uses it.',
                          solution: '/iː/ is the long "ee" sound, like in "sheep", "feet", "tree".',
                          tip: 'The colon (ː) means the sound is long — hold it a little longer.'
                        },
                        {
                          title: '进阶：借助音标读生词',
                          problem: 'A dictionary shows "mouth" → /maʊθ/. Read it using the symbols.',
                          solution: '/m/ + /aʊ/ + /θ/ → "mouth". The /θ/ needs your tongue between your teeth.',
                          tip: 'Read each symbol in order, then blend — just like phonics, but with symbols instead of letters.'
                        },
                        {
                          title: '挑战：区分两个容易混淆的音',
                          problem: 'Which word has /θ/ and which has /ð/: "think" or "this"?',
                          solution: '"think" has /θ/ (unvoiced — no vibration); "this" has /ð/ (voiced — your throat vibrates).',
                          tip: 'Put your fingers gently on your throat: if you feel a buzz, it is the voiced /ð/; if not, it is /θ/.'
                        }
                      ],
                      interaction: `🎙️ **"音标镜子练习" Mirror Sound Lab**（约 8 分钟）

1. 家长和孩子各拿一面小镜子，看自己的嘴巴。家长说一个音标（如 /θ/），孩子观察并模仿：舌尖要伸出一点放在上下齿之间。
2. 家长举起单词卡（ship, sheep, think, this, dog, door），孩子先"破译"音标（如果卡片背面有音标）再读出单词。
3. 对比游戏：家长读两对单词 "sip/zip" 和 "thin/tin"，孩子听辨首音不同，并用镜子检查自己的舌头和嘴唇位置。
4. 挑战：孩子选一个自己容易读错的单词，查字典抄下音标，教家长读。

💡 目的：把"看不见的声音"变成"看得见的口型"，用镜子建立正确的发音肌肉记忆。`,
                      exercises: [
                        { question: '英语国际音标一共有多少个？', answer: '48 个（20 个元音，28 个辅音）。', explanation: '这是国际音标（IPA）中英语使用的标准数量。' },
                        { question: '音标 /ʃ/ 对应哪个字母组合？举一个例词。', answer: '对应字母组合 sh，如 ship。', explanation: '/ʃ/ 就是 "shh" 的声音。' },
                        { question: '下面哪个单词含 /ð/？think, this, three', answer: 'this', explanation: 'this 中的 th 发浊音 /ð/；think 和 three 发清音 /θ/。' },
                        { question: '查字典写出 "apple" 的音标。', answer: '/ˈæpl/', explanation: '第一个元音是 /æ/，注意重音符号 ˈ 在第一个音节前。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-012',
                    title: '日常问候',
                    description: 'Hello/Good morning等日常交际用语。',
                    funEmoji: '🇺🇸',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，日常问候就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有日常问候的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「日常问候」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「日常问候」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **日常问候** 是英语学习的重要内容。Hello/Good morning等日常交际用语。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出日常问候，激发学习热情。',
                      '**分步渐进**：将日常问候拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「日常问候」的基本含义是什么？', answer: '（基础题）Hello/Good morning等日常交际用语。' },
                      { question: '举一个生活中与「日常问候」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「日常问候」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can greet people appropriately by time of day: Good morning / afternoon / evening',
                        'Can ask "How are you?" and reply with "I\'m fine, thank you"',
                        'Can say goodbye with "Goodbye / See you later"',
                        'Can use greetings naturally when meeting English teachers or visitors'
                      ],
                      explanation: `Greetings are the **handshake of language** — they start every conversation on a friendly note. In English, the greeting you choose often depends on the **time of day**.

- **Morning** (before about 12:00): **"Good morning!"**
- **Afternoon** (12:00–about 18:00): **"Good afternoon!"**
- **Evening** (after about 18:00): **"Good evening!"**
- **Any time, informal**: **"Hello!"** or **"Hi!"**

After the hello, people often check in with each other:
- **"How are you?"** → **"I\'m fine, thank you. And you?"** (or "I\'m great!", "I\'m OK.")
- Remember: this is usually a greeting, not a real question about your health — a short, positive answer is perfect.

When it is time to part:
- **"Goodbye!" / "Bye!"**
- **"See you later." / "See you tomorrow."**

Real-life tip: every time you see your English teacher at school, try saying "Good morning, teacher!" It is a small habit that builds big confidence.`,
                      examples: [
                        {
                          title: '基础：按时间选问候',
                          problem: 'It is 7:30 in the morning. You meet your mum. What do you say?',
                          solution: '"Good morning, Mum!" (We use "Good morning" before noon.)',
                          tip: 'Match the greeting to the clock: before 12 → morning; 12–6 → afternoon; after 6 → evening.'
                        },
                        {
                          title: '进阶：完成问候对话',
                          problem: 'A: "Hi! How are you?"  B: "______"',
                          solution: '"I\'m fine, thank you. And you?"',
                          tip: 'Always thank the person ("thank you") and return the question ("And you?").'
                        },
                        {
                          title: '挑战：情景选择',
                          problem: 'School is over. You are leaving your friend. Which is the best goodbye? (a) Good morning (b) See you tomorrow (c) How are you',
                          solution: '(b) "See you tomorrow." — a natural goodbye when you will meet again.',
                          tip: 'Good morning = hello at morning; See you… = goodbye; How are you = check-in question.'
                        }
                      ],
                      interaction: `👋 **"问候接力赛" Greeting Relay**（约 6 分钟）

1. 家长和孩子站成一排，家长举起"时间卡"（太阳=早上、中午太阳=下午、月亮=晚上），孩子立刻说出对应的问候语。
2. 家长说 "How are you?"，孩子回答并反问 "And you?"，家长再回答，完成一个完整来回。
3. 加入"道别"环节：家长举起"放学"图片，孩子说出道别语（"See you tomorrow!"）。
4. 挑战：全程不许说中文，连续完成 5 轮不卡顿。

💡 目的：把问候语变成"条件反射"，让孩子在真实场景中脱口而出。`,
                      exercises: [
                        { question: '下午 3 点见到老师，你应该说什么？', answer: 'Good afternoon, teacher!', explanation: 'afternoon（下午）用 Good afternoon。' },
                        { question: '回答：— How are you? — ______', answer: "I'm fine, thank you.", explanation: '这是 How are you 的标准友好回答。' },
                        { question: '放学时和同学道别，用英语怎么说？', answer: 'Goodbye! / See you tomorrow!', explanation: '道别用 Goodbye 或 See you…。' },
                        { question: '判断对错：晚上见到爸爸时说 "Good morning, Dad!"', answer: '错，晚上应该说 Good evening。', explanation: '晚上用 evening，早上才用 morning。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-013',
                    title: '自我介绍',
                    description: 'My name is.../I am...等基本介绍用语。',
                    funEmoji: '🔤',
                    funFact: '英语是世界通用的桥梁。',
                    funStory: '在英语学习的奇妙旅程中，自我介绍就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有自我介绍的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「自我介绍」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「自我介绍」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **自我介绍** 是英语学习的重要内容。My name is.../I am...等基本介绍用语。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出自我介绍，激发学习热情。',
                      '**分步渐进**：将自我介绍拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「自我介绍」的基本含义是什么？', answer: '（基础题）My name is.../I am...等基本介绍用语。' },
                      { question: '举一个生活中与「自我介绍」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「自我介绍」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can say own name using "My name is …" or "I\'m …"',
                        'Can say own age with "I am … years old"',
                        'Can introduce oneself in a short paragraph (name, age, class, hobby)',
                        'Can ask another person\'s name with "What\'s your name?"'
                      ],
                      explanation: `Introducing yourself is one of the **first real things** you can do in a new language. In English, there are a few friendly, standard ways to do it.

**Saying your name**:
- **"My name is Lily."** — the full, polite form.
- **"I\'m Lily."** — shorter and very common.
- Both are correct; "I\'m …" sounds more casual and natural in everyday chat.

**Saying your age**:
- **"I am eight years old."** or **"I\'m eight."**
- Tip: just say the number — English speakers often drop "years old" in casual talk.

**Putting it together** (a mini self-introduction):
> "Hello! My name is Lily. I am eight years old. I study in Class 2, Grade 3. I like drawing and reading. Nice to meet you!"

**Asking others**:
- **"What\'s your name?"** (What is your name?)
- **"How old are you?"**

Real-life tip: practise a 30-second self-introduction and use it the first day of a new English class — it makes a great first impression!`,
                      examples: [
                        {
                          title: '基础：介绍自己的名字',
                          problem: 'How do you say "我叫王明" in English?',
                          solution: '"My name is Wang Ming." or "I\'m Wang Ming."',
                          tip: 'Both are correct; "I\'m Wang Ming" is more casual and natural.'
                        },
                        {
                          title: '进阶：介绍年龄',
                          problem: 'How do you say "我今年 9 岁"?',
                          solution: '"I am nine years old." or simply "I\'m nine."',
                          tip: '"years old" can be left out in everyday conversation.'
                        },
                        {
                          title: '挑战：做一个完整的自我介绍',
                          problem: 'Introduce yourself in English. Include: name, age and one hobby.',
                          solution: 'Sample: "Hi! I\'m Tom. I\'m ten years old. I like playing football."',
                          tip: 'Use the pattern: name → age → hobby. Keep it simple and smile!'
                        }
                      ],
                      interaction: `🌟 **"自我介绍接龙" Self-Intro Circle**（约 8 分钟）

1. 家长和孩子轮流用英语自我介绍，每人说 3 句（名字、年龄、爱好）。
2. 第二轮升级：在第 2 句后加一个新信息，如班级 "I\'m in Class 4, Grade 2." 或最喜欢的水果 "I like apples."
3. 玩"猜一猜"：家长用英语介绍一位动画人物的名字和年龄（"My name is Peppa. I\'m four."），孩子猜是谁。
4. 挑战：孩子对着镜子做一个完整的 30 秒英语自我介绍，录下来回听。

💡 目的：把固定句型（My name is… / I'm…）通过反复输出变成自然表达，克服开口紧张。`,
                      exercises: [
                        { question: '你想告诉新同学"我叫小红"，用英语怎么说？', answer: 'My name is Xiaohong. / I\'m Xiaohong.', explanation: 'My name is 和 I\'m 都可以介绍名字。' },
                        { question: '翻译：I am seven years old. → 中文是什么意思？', answer: '我今年 7 岁。', explanation: 'I am + 数字 + years old 表示年龄。' },
                        { question: '补全自我介绍：Hello! ____ Tom. ____ 9 years old.', answer: "My name is / I'm; I'm", explanation: '第一空介绍名字，第二空介绍年龄。' },
                        { question: '你想知道新朋友的名字，应该问什么？', answer: "What's your name?", explanation: "What's your name? 是询问对方名字的标准句型。" }
                      ]
                    }
                }
,
{
                    id: 'p-eng-014',
                    title: '家庭成员',
                    description: 'father/mother/brother/sister等家庭成员单词。',
                    funEmoji: '📚',
                    funFact: '每天一个小单词，一年就是365个新朋友。',
                    funStory: '在英语学习的奇妙旅程中，家庭成员就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有家庭成员的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「家庭成员」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「家庭成员」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **家庭成员** 是英语学习的重要内容。father/mother/brother/sister等家庭成员单词。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出家庭成员，激发学习热情。',
                      '**分步渐进**：将家庭成员拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「家庭成员」的基本含义是什么？', answer: '（基础题）father/mother/brother/sister等家庭成员单词。' },
                      { question: '举一个生活中与「家庭成员」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「家庭成员」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can say the English words for close family members: father, mother, brother, sister, grandfather, grandmother',
                        'Can explain the difference between parents / grandparents / grandchildren',
                        'Can introduce family members in short sentences ("This is my …")',
                        'Can ask and answer "Who is he / she?" about family'
                      ],
                      explanation: `Family words are some of the **most personal and useful** English words you can learn. Let us meet the family!

**Core members**:
- **father** (dad) and **mother** (mum) → together they are your **parents**
- **brother** (a boy sibling) and **sister** (a girl sibling)
- **grandfather** (grandpa) and **grandmother** (grandma) → together they are your **grandparents**

**Useful patterns**:
- "This is my father." — use **This is …** when you introduce someone nearby.
- "He is tall." / "She is kind." — use **he** for males, **she** for females.
- "Who is he / she?" → "He is my brother."

A couple of tips:
- **parents** = father + mother; **grandparents** = grandfather + grandmother.
- **uncle / aunt / cousin** are for extended family — you will meet them later.

Real-life idea: point to a family photo and say each person\'s English word. "This is my mother. This is my sister. We are a happy family!"`,
                      examples: [
                        {
                          title: '基础：说出家庭成员的英文',
                          problem: 'Your father\'s father — what do you call him in English?',
                          solution: 'Grandfather (or grandpa).',
                          tip: '"father\'s father" = grandfather; "mother\'s mother" = grandmother.'
                        },
                        {
                          title: '进阶：介绍家人',
                          problem: 'How do you say "这是我姐姐" in English?',
                          solution: '"This is my sister." (Use "This is …" for introductions.)',
                          tip: 'For older sister you can also say "my elder sister", but "my sister" is enough in most cases.'
                        },
                        {
                          title: '挑战：回答关于家人的问题',
                          problem: 'A: "Who is she?" (pointing at your mum in a photo)  B: "______"',
                          solution: '"She is my mother."',
                          tip: '"Who is she?" asks about a female → answer with "She is my …".'
                        }
                      ],
                      interaction: `👨‍👩‍👧‍👦 **"家庭树贴贴乐" Family Tree Sticker**（约 8 分钟）

1. 家长画一棵简单的"家庭树"轮廓（树干上留出 6 个空格：father, mother, brother, sister, grandfather, grandmother）。
2. 孩子把对应的单词卡贴到正确的位置，贴的时候大声读出 "father!" "mother!"…
3. 家长指着树上的一个位置问 "Who is he / she?"，孩子回答 "He is my grandfather."
4. 挑战：孩子拿一张真实家庭照片，用英语向家长介绍 3 位家人。

💡 目的：把单词和真实家人建立情感联系，让记忆更牢固、更有温度。`,
                      exercises: [
                        { question: 'father 和 mother 合称什么？', answer: 'parents', explanation: 'parents 是 father 和 mother 的合称。' },
                        { question: '翻译：She is my grandmother.', answer: '她是我的奶奶（外婆）。', explanation: 'grandmother = 奶奶/外婆。' },
                        { question: '回答：Who is he? (指你的哥哥)', answer: 'He is my brother.', explanation: '男性用 he，哥哥是 brother。' },
                        { question: '写出 grandfather 的简称。', answer: 'grandpa', explanation: 'grandpa 是 grandfather 的口语简称。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-015',
                    title: '颜色单词',
                    description: 'red/blue/green/yellow等常见颜色词汇。',
                    funEmoji: '🗣️',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，颜色单词就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有颜色单词的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「颜色单词」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「颜色单词」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **颜色单词** 是英语学习的重要内容。red/blue/green/yellow等常见颜色词汇。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出颜色单词，激发学习热情。',
                      '**分步渐进**：将颜色单词拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「颜色单词」的基本含义是什么？', answer: '（基础题）red/blue/green/yellow等常见颜色词汇。' },
                      { question: '举一个生活中与「颜色单词」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「颜色单词」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can read, spell and say 10 common colour words: red, blue, green, yellow, orange, purple, black, white, pink, brown',
                        'Can describe objects using "The … is + colour" and "It is + colour"',
                        'Can ask and answer "What colour is …?"',
                        'Can use colours in real-life situations (describing clothes, food, nature)'
                      ],
                      explanation: `Colours are everywhere, and learning their English names lets you **describe the world** around you. Here are the most useful ones to start with.

**The basic colour words**:
- **red** 🔴 — apple, fire truck, Chinese flag
- **blue** 🔵 — sky, sea, jeans
- **green** 🟢 — leaf, grass, frog
- **yellow** 🟡 — banana, sun, lemon
- **orange** 🟠 — orange fruit, carrot, pumpkin
- **purple** 🟣 — grape, lavender, eggplant
- **black** ⚫ — night, tyres, panda\'s eyes
- **white** ⚪ — snow, cloud, milk
- **pink** — cherry blossom, pig, cake
- **brown** — chocolate, wood, bear

**How to use them**:
- **"What colour is it?"** → **"It is red."**
- **"The apple is red."** / **"The sky is blue."**

Tip: many colour words come from real things — **orange** is named after the fruit, and **pink** after a flower. That makes them easier to remember!`,
                      examples: [
                        {
                          title: '基础：说出颜色的英文',
                          problem: 'What colour is a banana? Say it in English.',
                          solution: '"A banana is yellow." or "It is yellow."',
                          tip: 'Link the colour to a real object you know — banana = yellow.'
                        },
                        {
                          title: '进阶：用 What colour 提问和回答',
                          problem: 'Ask about the colour of the traffic light that means "stop".',
                          solution: '"What colour is the stop light?" → "It is red."',
                          tip: 'Use "What colour is + 东西?" to ask about any object\'s colour.'
                        },
                        {
                          title: '挑战：描述一幅图',
                          problem: 'Look out the window. Describe three things and their colours in English.',
                          solution: 'Sample: "The sky is blue. The tree is green. The car is white."',
                          tip: 'Use "The + thing + is + colour" for every object you see.'
                        }
                      ],
                      interaction: `🎨 **"颜色寻宝大作战" Colour Scavenger Hunt**（约 8 分钟）

1. 家长说一种颜色（如 "red!"），孩子 10 秒内找到家里一件该颜色的物品并指着说 "The … is red!"
2. 交换角色：孩子说颜色，家长找（家长可以故意找错，让孩子纠正："No — that is blue!"）。
3. 进阶"调色游戏"：家长说 "Red and yellow"，孩子抢答混合色 "orange!"，并找出橙色物品。
4. 挑战：孩子闭眼，家长描述一件物品的颜色，孩子猜是什么。

💡 目的：把颜色单词和实物一一对应，建立"音-义-物"的直接联结，避免中文翻译中介。`,
                      exercises: [
                        { question: '"绿色"用英语怎么说？', answer: 'green', explanation: 'green 是绿色。' },
                        { question: '完成问答：— What colour is the sun? — ______', answer: 'It is yellow.', explanation: '太阳是黄色的，回答用 It is yellow。' },
                        { question: '红色和黄色混合是什么颜色（用英语回答）？', answer: 'orange', explanation: 'red + yellow = orange。' },
                        { question: '用英语描述你身上 3 件物品的颜色。', answer: '开放性题，如 "My T-shirt is white. My shoes are black. My bag is blue."', explanation: '用 "My + 物品 + is + 颜色" 句式描述。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-016',
                    title: '数字单词',
                    description: 'one到twenty，认读与拼写数字单词。',
                    funEmoji: '🎵',
                    funFact: '英语是世界通用的桥梁。',
                    funStory: '在英语学习的奇妙旅程中，数字单词就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有数字单词的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「数字单词」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「数字单词」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **数字单词** 是英语学习的重要内容。one到twenty，认读与拼写数字单词。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出数字单词，激发学习热情。',
                      '**分步渐进**：将数字单词拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「数字单词」的基本含义是什么？', answer: '（基础题）one到twenty，认读与拼写数字单词。' },
                      { question: '举一个生活中与「数字单词」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「数字单词」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can read, spell and say the number words from one to twenty',
                        'Can understand spoken numbers and point to the correct numeral',
                        'Can use number words in everyday English (age, counting objects)',
                        'Can ask and answer "How many …?" using number words'
                      ],
                      explanation: `Numbers are one of the **most practical** vocabulary groups in English. You need them for your age, the time, counting toys, and shopping. Let us learn them step by step.

**1 to 12** — each is a unique word to memorise:
**one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve**

**13 to 19** — most end in **-teen** (think: "teenager"!):
**thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen**
Watch out: thirteen (not "threeteen"), fifteen (not "fiveteen").

**The tens** — end in **-ty**:
**twenty** (20). Later you will meet thirty, forty, fifty …

**Patterns that help**:
- 13–19: add **-teen** to the base number (with small spelling changes).
- 20, 30, 40 …: add **-ty** (twen-ty, thir-ty, for-ty).

**Using numbers in English**:
- "How many apples?" → "Five apples."
- "I am nine years old."
- "My phone number is …" (read each digit separately: "three one zero …")

Real-life idea: count your steps in English when you walk downstairs — "one, two, three …" — a great daily drill!`,
                      examples: [
                        {
                          title: '基础：数字与单词配对',
                          problem: 'Write the English word for 15 and 20.',
                          solution: '15 = fifteen; 20 = twenty.',
                          tip: '15 ends in -teen (fifteen); 20 ends in -ty (twenty).'
                        },
                        {
                          title: '进阶：用 How many 问答',
                          problem: 'A: "How many pencils are on the desk?" (There are 8.)  B: "______"',
                          solution: '"There are eight pencils." or simply "Eight."',
                          tip: '"How many + 复数名词?" asks about quantity — answer with a number.'
                        },
                        {
                          title: '挑战：听数字、写单词',
                          problem: 'Your teacher says "seventeen". Write the numeral and the word.',
                          solution: 'Numeral: 17. Word: seventeen.',
                          tip: 'The -teen ending tells you it is in the teens (13–19).'
                        }
                      ],
                      interaction: `🔢 **"数字跳数" Number Jump**（约 6 分钟）

1. 在地上贴 10 张数字卡（1–10），家长说一个英文数字，孩子跳到对应的卡片上。
2. 进阶：家长说 "three plus four"，孩子先算出 7 再跳到 7。
3. 倒数挑战：从 ten 倒数到 one，每数一个做一个蹲起。
4. 生活应用：让孩子用英语报出自己的年龄、门牌号（逐位读）。

💡 目的：把数字单词和"听-说-动作"结合，建立快速的英语数感反应。`,
                      exercises: [
                        { question: '写出 11、14、18 的英文单词。', answer: 'eleven, fourteen, eighteen', explanation: '11 = eleven（特殊）；14 = fourteen；18 = eighteen（注意只有一个 t）。' },
                        { question: 'How many books are on your desk? (根据实际情况回答)', answer: '开放性题，如 "There are six books."', explanation: '用 "There are + 数字 + 复数名词" 回答数量。' },
                        { question: 'twenty 是数字几？', answer: '20', explanation: 'twenty = 20。' },
                        { question: '判断：thirteen 和 thirty 是同一个数吗？', answer: '不是。thirteen = 13，thirty = 30。', explanation: '-teen 是十几，-ty 是几十，注意区分。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-017',
                    title: '动物单词',
                    description: 'cat/dog/rabbit等常见动物词汇。',
                    funEmoji: '🌟',
                    funFact: '每天一个小单词，一年就是365个新朋友。',
                    funStory: '在英语学习的奇妙旅程中，动物单词就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有动物单词的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「动物单词」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「动物单词」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **动物单词** 是英语学习的重要内容。cat/dog/rabbit等常见动物词汇。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出动物单词，激发学习热情。',
                      '**分步渐进**：将动物单词拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「动物单词」的基本含义是什么？', answer: '（基础题）cat/dog/rabbit等常见动物词汇。' },
                      { question: '举一个生活中与「动物单词」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「动物单词」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can read, spell and say common animal words: cat, dog, rabbit, bird, fish, elephant, monkey, panda, tiger, lion',
                        'Can describe animals using "It is …" and "It can …" (big, small, fast, can fly)',
                        'Can ask and answer "What is it? / What animal is it?"',
                        'Can talk about favourite animals with "I like …"'
                      ],
                      explanation: `Animals are a **favourite topic** for young learners — and knowing their English names lets you talk about pets, zoo trips and nature shows.

**Common animal words**:
- **Pets**: **cat, dog, rabbit, fish, bird**
- **Farm animals**: **cow, pig, horse, sheep, duck, chicken**
- **Wild / zoo animals**: **elephant, monkey, panda, tiger, lion, giraffe, snake**

**Describing animals**:
- "The elephant **is big**." / "The rabbit **is small**."
- "The bird **can fly**." / "The fish **can swim**."
- "The panda is **black and white**."

**Talking about favourites**:
- "**What** is your favourite animal?" → "**I like pandas.**" or "**My favourite animal is the panda.**"

Real-life idea: next time you visit a zoo or watch an animal video, name three animals in English and say one thing about each. "Look — a tiger! It is big and strong!"`,
                      examples: [
                        {
                          title: '基础：说出动物的英文',
                          problem: 'What is "熊猫" in English? What about "老虎"?',
                          solution: '"熊猫" = panda; "老虎" = tiger.',
                          tip: 'Link each animal to a picture — visual memory is strongest for animal words.'
                        },
                        {
                          title: '进阶：描述动物',
                          problem: 'Describe a bird in English using "It is …" and "It can …".',
                          solution: '"The bird is small. It can fly."',
                          tip: 'Use "It is + 形容词" for appearance and "It can + 动词" for ability.'
                        },
                        {
                          title: '挑战：用英语介绍最喜欢的动物',
                          problem: 'Say your favourite animal and two reasons in English.',
                          solution: 'Sample: "I like dolphins. They are cute and they can swim fast."',
                          tip: 'Pattern: I like + animal. They are + adjective. They can + verb.'
                        }
                      ],
                      interaction: `🐾 **"动物模仿秀" Animal Charades**（约 8 分钟）

1. 准备动物卡片，孩子抽一张，用动作和声音模仿这种动物（不能说话），家长猜英文单词。
2. 交换角色：家长模仿，孩子猜并大声说出英文 "It is a cat!"
3. 进阶：猜中后，孩子必须用一句话描述该动物："The cat is small. It can run fast."
4. 挑战：孩子当"小导游"，带家长逛"家庭动物园"，用英语介绍 3 种动物。

💡 目的：通过模仿和描述，把动物单词、形容词和 can 句型同时练到。`,
                      exercises: [
                        { question: '"兔子"用英语怎么说？', answer: 'rabbit', explanation: 'rabbit = 兔子。' },
                        { question: '用英语描述：The elephant is ______ and ______.', answer: '开放性题，如 "big; strong"', explanation: '用形容词描述大象的外形特征。' },
                        { question: '回答：What is your favourite animal?', answer: '开放性题，如 "I like pandas."', explanation: 'I like + 动物 是表达喜好的标准句型。' },
                        { question: '判断："Sheep" 的复数形式是 "sheeps"，对吗？', answer: '不对，sheep 单复数同形，复数仍是 sheep。', explanation: 'sheep 是不规则名词，单复数同形。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-018',
                    title: '水果单词',
                    description: 'apple/banana/orange等水果词汇。',
                    funEmoji: '🦉',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，水果单词就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有水果单词的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「水果单词」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「水果单词」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **水果单词** 是英语学习的重要内容。apple/banana/orange等水果词汇。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出水果单词，激发学习热情。',
                      '**分步渐进**：将水果单词拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「水果单词」的基本含义是什么？', answer: '（基础题）apple/banana/orange等水果词汇。' },
                      { question: '举一个生活中与「水果单词」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「水果单词」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can read, spell and say common fruit words: apple, banana, orange, grape, strawberry, watermelon, peach, pear',
                        'Can ask and answer "Do you like …?" and "What fruit do you like?"',
                        'Can use single and plural forms correctly (one apple / two apples)',
                        'Can express likes and dislikes about fruit with "I like … / I don\'t like …"'
                      ],
                      explanation: `Fruit words are **deliciously easy** to learn because you can see, touch, taste and smell them — all at once! That makes them stick in your memory fast.

**Common fruit words**:
- **apple** 🍎 — red or green, crunchy
- **banana** 🍌 — yellow, soft, sweet
- **orange** 🍊 — orange, juicy, round
- **grape** 🍇 — small, purple or green, grows in bunches
- **strawberry** 🍓 — red, sweet, little seeds outside
- **watermelon** 🍉 — big, green outside, red inside
- **peach** 🍑 — soft, fuzzy skin
- **pear** 🍐 — sweet, juicy, bell-shaped

**Talking about fruit**:
- "**Do you like apples?**" → "**Yes, I do.**" / "**No, I don\'t.**"
- "**What fruit do you like?**" → "**I like strawberries.**"
- "**I don\'t like lemons. They are too sour.**"

Tip: fruit words are real objects — learning them while eating is the best method! Hold an apple and say "apple" five times.`,
                      examples: [
                        {
                          title: '基础：说出水果的英文',
                          problem: 'What is "草莓" and "葡萄" in English?',
                          solution: '"草莓" = strawberry; "葡萄" = grape.',
                          tip: 'Draw a quick picture next to each word — the image helps you remember.'
                        },
                        {
                          title: '进阶：Do you like 问答',
                          problem: 'A: "Do you like bananas?"  B: (You like them.) "______"',
                          solution: '"Yes, I do."',
                          tip: '"Do you like + 名词?" → 肯定回答 "Yes, I do." 否定回答 "No, I don\'t."'
                        },
                        {
                          title: '挑战：表达喜好并说明原因',
                          problem: 'Say which fruit you like and why, in English.',
                          solution: 'Sample: "I like watermelon because it is sweet and cool in summer."',
                          tip: 'Pattern: I like + fruit + because + reason. It makes your answer more interesting.'
                        }
                      ],
                      interaction: `🍎 **"水果市场" Fruit Market Role-play**（约 8 分钟）

1. 把几种真实水果（或水果卡片）摆在桌上，孩子当"摊主"，家长当"顾客"。
2. 家长问："Do you like oranges?" 孩子回答并用英语介绍："Yes! Oranges are sweet and juicy."
3. 进阶：家长说 "I like strawberries." 孩子问 "Why?" 家长给出原因，练习 because 句型。
4. 挑战：角色互换，孩子来当顾客，用英语"买"3 种水果并向家长推荐。

💡 目的：在模拟购物的真实情境中反复操练"Do you like…?"和"I like…because…"。`,
                      exercises: [
                        { question: '"香蕉"用英语怎么说？', answer: 'banana', explanation: 'banana = 香蕉。' },
                        { question: 'Do you like apples? (作肯定回答)', answer: 'Yes, I do.', explanation: 'Do you like 的肯定回答是 Yes, I do。' },
                        { question: '写出 "strawberry" 的复数形式。', answer: 'strawberries', explanation: '辅音+y 结尾，变 y 为 i 加 es。' },
                        { question: '用英语说：我喜欢西瓜，因为它们很甜。', answer: 'I like watermelon because they are sweet.', explanation: 'because 引导原因从句，watermelon 此处用复数泛指。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-019',
                    title: '文具单词',
                    description: 'pencil/ruler/eraser等学习用品词汇。',
                    funEmoji: '🍎',
                    funFact: '英语是世界通用的桥梁。',
                    funStory: '在英语学习的奇妙旅程中，文具单词就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有文具单词的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「文具单词」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「文具单词」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **文具单词** 是英语学习的重要内容。pencil/ruler/eraser等学习用品词汇。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出文具单词，激发学习热情。',
                      '**分步渐进**：将文具单词拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「文具单词」的基本含义是什么？', answer: '（基础题）pencil/ruler/eraser等学习用品词汇。' },
                      { question: '举一个生活中与「文具单词」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「文具单词」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can read, spell and say common stationery words: pencil, ruler, eraser, pen, book, bag, crayon',
                        'Can ask and answer "What is this / that?" with "It is a …"',
                        'Can request items politely: "Can I use your …?" and "Here you are"',
                        'Can use "I have …" to describe own stationery'
                      ],
                      explanation: `Stationery words are **right in your schoolbag** — you can practise them every single day at school. That makes them some of the easiest words to make stick.

**Common stationery words**:
- **pencil** ✏️ — for writing and drawing (you can erase it)
- **ruler** 📏 — for measuring and drawing straight lines
- **eraser** — for rubbing out pencil mistakes
- **pen** 🖊️ — for writing (ink, harder to erase)
- **book** 📖 — for reading
- **schoolbag / bag** 🎒 — for carrying everything
- **crayon** 🖍️ — for colouring pictures

**Using them in conversation**:
- "**What is this?**" (holding a pencil) → "**It is a pencil.**"
- "**Can I use your ruler?**" → "**Sure. Here you are.**" → "**Thank you.**"
- "**I have a new pencil case.**"

Real-life idea: label your own stationery at home with sticky notes — "pencil", "ruler", "eraser" — and say the word every time you use it.`,
                      examples: [
                        {
                          title: '基础：说出文具的英文',
                          problem: 'What is "橡皮" and "尺子" in English?',
                          solution: '"橡皮" = eraser; "尺子" = ruler.',
                          tip: 'Pick up the real object and say the word — touch and say works wonders.'
                        },
                        {
                          title: '进阶：用 What is this 问答',
                          problem: 'A: "What is this?" (pointing at a pen)  B: "______"',
                          solution: '"It is a pen."',
                          tip: '"What is this?" → "It is a / an + 名词." 元音开头的名词前用 an。'
                        },
                        {
                          title: '挑战：礼貌借文具',
                          problem: 'You need to borrow a classmate\'s eraser. Say the whole exchange in English.',
                          solution: 'A: "Can I use your eraser?"  B: "Sure. Here you are."  A: "Thank you."  B: "You\'re welcome."',
                          tip: '"Can I use your + 名词?" is a polite way to borrow something.'
                        }
                      ],
                      interaction: `🎒 **"文具大搜寻" Stationery Scavenge**（约 6 分钟）

1. 家长说出一个英文文具单词，孩子从笔袋/书桌里快速找出对应物品并大声重复单词。
2. 进阶：家长用 "What is this?" 指着一件文具提问，孩子回答 "It is a ruler."
3. 角色扮演"借文具"：孩子礼貌地说 "Can I use your pen?"，家长回答 "Here you are."
4. 挑战：孩子闭上眼睛，家长拿走一件文具，孩子用英语猜 "Is it the eraser?"

💡 目的：把单词学习和日常上学场景紧密绑定，做到"学了就马上能用"。`,
                      exercises: [
                        { question: '"铅笔"用英语怎么说？', answer: 'pencil', explanation: 'pencil = 铅笔。' },
                        { question: 'What is this? (指着书包)', answer: 'It is a bag (schoolbag).', explanation: 'What is this 用 It is a… 回答。' },
                        { question: '你想借同学的橡皮，用英语怎么说？', answer: 'Can I use your eraser?', explanation: 'Can I use your… 是礼貌请求借用的句型。' },
                        { question: '判断："eraser" 前面用 "a" 还是 "an"？', answer: 'an eraser', explanation: 'eraser 以元音音素开头，前面用 an。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-020',
                    title: '人称代词',
                    description: 'I/you/he/she/they等代词的使用。',
                    funEmoji: '✏️',
                    funFact: '每天一个小单词，一年就是365个新朋友。',
                    funStory: '在英语学习的奇妙旅程中，人称代词就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有人称代词的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「人称代词」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「人称代词」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **人称代词** 是英语学习的重要内容。I/you/he/she/they等代词的使用。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出人称代词，激发学习热情。',
                      '**分步渐进**：将人称代词拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「人称代词」的基本含义是什么？', answer: '（基础题）I/you/he/she/they等代词的使用。' },
                      { question: '举一个生活中与「人称代词」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「人称代词」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can use the seven subject pronouns: I, you, he, she, it, we, they',
                        'Can match each pronoun to the right person or thing (I = myself, he = a boy, it = an animal/thing)',
        'Can replace a noun with the correct pronoun in a sentence',
        'Can tell the difference between "he" (a male person) and "she" (a female person)'
                      ],
                      explanation: `Pronouns are **tiny words that do a big job** — they replace names and nouns so we do not have to repeat them. Imagine saying "Lily is 8. Lily is a student. Lily likes reading." That sounds tiring! With pronouns: "Lily is 8. **She** is a student. **She** likes reading."

The seven subject pronouns:

| Pronoun | When to use | Example |
|---------|-------------|---------|
| **I** | talking about myself | **I** am a student. |
| **you** | talking to one person or many | **You** are my friend. |
| **he** | one male person (boy/man) | **He** is tall. |
| **she** | one female person (girl/woman) | **She** is kind. |
| **it** | one animal or thing | **It** is a cat. |
| **we** | I + other people | **We** are happy. |
| **they** | more than one person, animal or thing | **They** are teachers. |

Quick trick: **he = boy, she = girl, it = thing/animal, they = more than one.**

Real-life tip: when you see a picture of a boy, point and say "He is …"; of a girl, "She is …"; of a dog, "It is …".`,
                      examples: [
                        {
                          title: '基础：选择合适的代词',
                          problem: 'Replace the underlined word with a pronoun: "Tom is a student. _____ is 10."',
                          solution: '"He." Tom is a boy → use "he". → He is 10.',
                          tip: 'A boy or man → he; a girl or woman → she; a thing/animal → it.'
                        },
                        {
                          title: '进阶：代词与名词配对',
                          problem: 'Choose the right pronoun: "My mum and I are at home. _____ are cooking."',
                          solution: '"We." "My mum and I" includes myself → use "we".',
                          tip: '"I + 别人" = we; "he/she/it 单独" = he/she/it; "两个以上" = they.'
                        },
                        {
                          title: '挑战：用代词改写句子',
                          problem: 'Rewrite using a pronoun: "The apples are red."',
                          solution: '"They are red." (More than one apple → they.)',
                          tip: 'Plural nouns (apples, books, cats) → they; singular things → it.'
                        }
                      ],
                      interaction: `👆 **"指一指、说一说" Point and Say**（约 6 分钟）

1. 家长指着自己说 "I"，指着孩子说 "you"，指着爸爸的照片说 "he"，指着妈妈的照片说 "she"，指着家里的猫/玩具说 "it"。
2. 孩子反过来指并说出代词，家长判断对错。
3. 进阶：家长说 "the boys / the girls / the books"，孩子说出 "they"。
4. 挑战：用 5 个不同的代词各造一个句子，连成一段小介绍。

💡 目的：把抽象的代词变成"这个人/那个东西"的具体指向，建立直观理解。`,
                      exercises: [
                        { question: '"My sister is kind." 用代词替换 My sister。', answer: 'She is kind.', explanation: 'sister 是女性，用 she。' },
                        { question: '"The dog is cute." 用代词替换 The dog。', answer: 'It is cute.', explanation: 'dog 是动物，用 it。' },
                        { question: '"My friends and I" 用哪个代词替换？', answer: 'We', explanation: 'I + 别人 = we。' },
                        { question: '判断："he" 可以用来指一只猫吗？', answer: '一般不用，动物用 it；但如果知道是公猫且当宠物家庭成员，口语中偶尔也用 he/she。', explanation: '普通情况下动物用 it，宠物有时用 he/she 表示性别或亲近。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-021',
                    title: 'be动词',
                    description: 'am/is/are的用法与主谓一致。',
                    funEmoji: '/flag_uk',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，be动词就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有be动词的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「be动词」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「be动词」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **be动词** 是英语学习的重要内容。am/is/are的用法与主谓一致。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出be动词，激发学习热情。',
                      '**分步渐进**：将be动词拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「be动词」的基本含义是什么？', answer: '（基础题）am/is/are的用法与主谓一致。' },
                      { question: '举一个生活中与「be动词」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「be动词」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can choose the correct form of "be" — am, is, are — to match the subject',
                        'Can say the rhyme "I 用 am，you 用 are，is 连着他她它" and apply it',
                        'Can make negative sentences with "am not / is not (isn\'t) / are not (aren\'t)"',
                        'Can make Yes/No questions with "be" (e.g. "Is she …?") and give short answers'
                      ],
                      explanation: `The verb **"be"** is the most common verb in English, and it changes shape depending on who or what you are talking about. Think of it as a chameleon — same meaning, different outfits.

**The three forms**:
- **am** → only with **I**
  - "I **am** a student." / "I **am** happy."
- **is** → with **he, she, it** and any singular noun
  - "He **is** tall." / "The cat **is** cute."
- **are** → with **you, we, they** and any plural noun
  - "You **are** my friend." / "They **are** teachers."

**The magic rhyme**: **"I 用 am，you 用 are，is 连着他、她、它。"**

**Making it negative**: just add **not**.
- "I am **not** tired." → "I\'m not tired."
- "She is **not** here." → "She isn\'t here."
- "They are **not** ready." → "They aren\'t ready."

**Making a Yes/No question**: move "be" to the front.
- "He is tall." → "**Is** he tall?" → "**Yes, he is.** / **No, he isn\'t.**"

Real-life tip: whenever you describe someone or something in English, you almost always need a form of "be"!`,
                      examples: [
                        {
                          title: '基础：选对 be 动词',
                          problem: 'Fill in the blank: My mother ____ a doctor. (am / is / are)',
                          solution: '"is." My mother = she (singular) → is. → My mother is a doctor.',
                          tip: 'My mother is a singular person → use "is".'
                        },
                        {
                          title: '进阶：变成否定句',
                          problem: 'Change to negative: "We are classmates."',
                          solution: '"We are not classmates." or "We aren\'t classmates."',
                          tip: 'Add "not" after the be verb, or use the contraction aren\'t.'
                        },
                        {
                          title: '挑战：变成一般疑问句并回答',
                          problem: 'Change to a question: "It is a panda." Then give a positive short answer.',
                          solution: '"Is it a panda?" → "Yes, it is."',
                          tip: 'Move "is" to the front; short answer uses the same be verb: "Yes, it is."'
                        }
                      ],
                      interaction: `🎣 **"be 动词钓鱼" Be-verb Fishing**（约 8 分钟）

1. 准备一些"鱼"卡片，每张写一个主语（I, she, the dogs, my friends, Tom, they）。
2. 孩子"钓"到一张后，必须说出正确的 be 动词（如钓到 "she" → "is!"），说对才能保留卡片。
3. 进阶：拿到卡片后用该主语造一个肯定句，再变成否定句和疑问句。
4. 挑战：家长快速说一个句子（如 "I am a teacher"），孩子抢答变成疑问句 "Are you a teacher?"

💡 目的：通过反复匹配主语和 be 动词，把"主谓一致"变成自动反应。`,
                      exercises: [
                        { question: 'I ____ a girl. (am / is / are)', answer: 'am', explanation: 'I 永远搭配 am。' },
                        { question: '把下列句子变成否定句：They are happy.', answer: 'They are not happy. / They aren\'t happy.', explanation: 'be 动词后加 not 构成否定。' },
                        { question: '把下列句子变成一般疑问句：She is a nurse.', answer: 'Is she a nurse?', explanation: 'is 提到句首，首字母大写，句末用问号。' },
                        { question: '回答：Are you a student? (肯定回答)', answer: 'Yes, I am.', explanation: 'Are you 的肯定回答是 Yes, I am。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-022',
                    title: '名词单复数',
                    description: '加s/es的变化规则，不规则变化。',
                    funEmoji: '🇺🇸',
                    funFact: '英语是世界通用的桥梁。',
                    funStory: '在英语学习的奇妙旅程中，名词单复数就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有名词单复数的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「名词单复数」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「名词单复数」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **名词单复数** 是英语学习的重要内容。加s/es的变化规则，不规则变化。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出名词单复数，激发学习热情。',
                      '**分步渐进**：将名词单复数拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「名词单复数」的基本含义是什么？', answer: '（基础题）加s/es的变化规则，不规则变化。' },
                      { question: '举一个生活中与「名词单复数」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「名词单复数」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can change singular nouns to plural by adding -s or -es correctly',
                        'Can spell the plural of nouns ending in s, x, sh, ch, o (add -es) and consonant + y (change to -ies)',
                        'Can recognise common irregular plurals: man/men, child/child, foot/feet, sheep (no change)',
                        'Can use singular and plural nouns correctly with "is / are" and "a / an / many"'
                      ],
                      explanation: `In English, nouns have a **singular form** (one) and a **plural form** (more than one). Most of the time the change is simple, but there are a few special rules to watch for.

**Rule 1: Just add -s** (the easy one!)
- book → book**s**, pen → pen**s**, cat → cat**s**, dog → dog**s**

**Rule 2: Add -es** after s, x, sh, ch, ss
- bus → bus**es**, box → box**es**, watch → watch**es**, dress → dress**es**

**Rule 3: Consonant + y → drop y, add -ies**
- baby → bab**ies**, strawberry → strawberr**ies**, city → cit**ies**
- But vowel + y → just add -s: boy → boy**s**, day → day**s**

**Rule 4: Some nouns ending in f or fe → change to -ves**
- knife → kni**ves**, leaf → lea**ves**, wife → wi**ves**

**Rule 5: Irregular plurals** — you just have to memorise these!
- man → **men**, woman → **women**, child → **children**, foot → **feet**, tooth → **teeth**, mouse → **mice**
- Some never change: **sheep, deer, fish**

Real-life tip: when you learn a new noun, always learn its plural at the same time — like a pair of shoes!`,
                      examples: [
                        {
                          title: '基础：写出复数',
                          problem: 'Write the plural of: cat, bus, box.',
                          solution: 'cats, buses, boxes.',
                          tip: 'cat → add -s; bus and box end in s/x → add -es.'
                        },
                        {
                          title: '进阶：辅音+y 的变化',
                          problem: 'Write the plural of: baby, boy, city, day.',
                          solution: 'babies, boys, cities, days.',
                          tip: 'Consonant + y (baby, city) → -ies; vowel + y (boy, day) → -s.'
                        },
                        {
                          title: '挑战：写出不规则复数',
                          problem: 'Write the plural of: man, child, foot, sheep.',
                          solution: 'men, children, feet, sheep.',
                          tip: 'The first three are irregular (memorise them); sheep never changes.'
                        }
                      ],
                      interaction: `🃏 **"单复数翻配" Singular-Plural Match**（约 8 分钟）

1. 准备 12 对卡片（一张单数、一张复数），打乱后背面朝上排成矩阵。
2. 孩子每次翻两张，如果单复数配对（如 cat / cats）并大声读出，就收走；否则翻回去。
3. 进阶：配对成功后用复数名词造一个句子，如 "The cats are sleeping."
4. 挑战：专门翻"不规则卡片"（man/men, child/children, foot/feet），看谁记得牢。

💡 目的：通过配对游戏把规则和不规则复数都练到，强化"学名词必学复数"的习惯。`,
                      exercises: [
                        { question: '写出下列名词的复数：watch, tomato, knife, sheep。', answer: 'watches, tomatoes, knives, sheep', explanation: 'watch 加 es；tomato 以 o 结尾加 es；knife 变 f 为 v 加 es；sheep 单复数同形。' },
                        { question: '改错：There are two childs in the room.', answer: 'There are two children in the room.', explanation: 'child 的复数是 children，不是 childs。' },
                        { question: '用 is 或 are 填空：The strawberries ____ red.', answer: 'are', explanation: 'strawberries 是复数，be 动词用 are。' },
                        { question: '写出 woman 的复数形式。', answer: 'women', explanation: 'woman 是不规则变化，复数是 women。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-023',
                    title: '一般现在时',
                    description: 'I play/He plays，动词第三人称单数变化。',
                    funEmoji: '🔤',
                    funFact: '每天一个小单词，一年就是365个新朋友。',
                    funStory: '在英语学习的奇妙旅程中，一般现在时就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有一般现在时的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「一般现在时」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「一般现在时」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **一般现在时** 是英语学习的重要内容。I play/He plays，动词第三人称单数变化。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出一般现在时，激发学习热情。',
                      '**分步渐进**：将一般现在时拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「一般现在时」的基本含义是什么？', answer: '（基础题）I play/He plays，动词第三人称单数变化。' },
                      { question: '举一个生活中与「一般现在时」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「一般现在时」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can use the present simple to talk about habits, routines and facts',
                        'Can add -s / -es to the verb when the subject is he / she / it (third person singular)',
                        'Can spell third-person verbs correctly (play→plays, go→goes, watch→watches, study→studies)',
                        'Can spot time words that signal the present simple: every day, usually, often, sometimes'
                      ],
                      explanation: `The **present simple** is the tense you use for things that happen **again and again** — your habits, your daily routine, and facts that are always true.

**Basic structure**:
- **I / You / We / They + verb (no ending)**
  - "I **play** football." / "They **like** apples."
- **He / She / It + verb + s/es**
  - "He **plays** football." / "She **likes** apples."

**Third-person spelling rules**:
- Most verbs: add **-s** → play → play**s**, read → read**s**
- After s, x, ch, sh, o: add **-es** → watch → watch**es**, go → go**es**, wash → wash**es**
- Consonant + y: change y to i, add **-es** → study → stud**ies**, fly → fl**ies**

**Time words that love the present simple**:
**always, usually, often, sometimes, every day, every morning, on Mondays**

**Negative and question** (need do / does):
- "I **don't like** lemons." / "He **doesn't like** lemons."
- "**Do** you **like** tea?" / "**Does** she **like** tea?"

Real-life tip: describe your morning routine in English — "I get up at 7. I brush my teeth. I eat breakfast." That is the present simple in action!`,
                      examples: [
                        {
                          title: '基础：选对动词形式',
                          problem: 'She ____ (go) to school by bus every day. (go / goes)',
                          solution: '"goes." She = third person singular, every day = habit → add -es. → She goes to school by bus every day.',
                          tip: 'Third person (she) + habit (every day) → verb + s/es.'
                        },
                        {
                          title: '进阶：第三人称拼写',
                          problem: 'Write the third-person form: watch, study, play, do.',
                          solution: 'watches, studies, plays, does.',
                          tip: 'watch → -es; study → -ies; play → -s (vowel+y); do → does (irregular).'
                        },
                        {
                          title: '挑战：变成否定句',
                          problem: 'Change to negative: "Tom likes tomatoes."',
                          solution: '"Tom doesn\'t like tomatoes."',
                          tip: 'Third person negative: use "doesn\'t + verb (no -s)". The -s moves to doesn\'t!'
                        }
                      ],
                      interaction: `☀️ **"我的一天" My Daily Routine Chain**（约 8 分钟）

1. 孩子用一般现在时介绍自己的一天："I get up at 7. I eat breakfast. I go to school…" 至少说 5 个动作。
2. 家长接着用第三人称转述："He gets up at 7. He eats breakfast…" 练习第三人称加 s。
3. 进阶：家长故意说错一句（如 "He go to school"），孩子当小老师改正。
4. 挑战：用 usually / sometimes 造句："I usually do my homework at 6. Sometimes I watch TV."

💡 目的：把一般现在时和个人真实生活绑定，让"习惯"和"第三人称加 s"自然关联。`,
                      exercises: [
                        { question: 'He ____ (watch) TV every evening.', answer: 'watches', explanation: 'he 是第三人称单数，watch 加 es。' },
                        { question: '把下列句子改为否定句：I like carrots.', answer: "I don't like carrots.", explanation: '第一人称否定用 don\'t + 动词原形。' },
                        { question: '写出 go 的第三人称单数形式。', answer: 'goes', explanation: 'go 以 o 结尾，加 es。' },
                        { question: '改错：She study English every day.', answer: 'She studies English every day.', explanation: 'she 是第三人称，study 要变 ies。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-024',
                    title: '现在进行时',
                    description: 'be+动词ing形式，表达正在发生的动作。',
                    funEmoji: '📚',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，现在进行时就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有现在进行时的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「现在进行时」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「现在进行时」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **现在进行时** 是英语学习的重要内容。be+动词ing形式，表达正在发生的动作。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出现在进行时，激发学习热情。',
                      '**分步渐进**：将现在进行时拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「现在进行时」的基本含义是什么？', answer: '（基础题）be+动词ing形式，表达正在发生的动作。' },
                      { question: '举一个生活中与「现在进行时」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「现在进行时」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can make present continuous sentences with "be + verb-ing" for actions happening now',
                        'Can spell the -ing form correctly (playing, making, running, swimming)',
                        'Can tell the difference between present simple (habits) and present continuous (happening now)',
                        'Can use time clues like "now, right now, look!, listen!" to choose the present continuous'
                      ],
                      explanation: `The **present continuous** is your "live broadcast" tense — you use it for things that are happening **right now, at this very moment**. If you can see it going on, use this tense.

**Structure**: **am / is / are + verb-ing**
- "I **am reading** a book (now)."
- "She **is singing** a song (look!)."
- "They **are playing** football (right now)."

**How to make the -ing form**:
- Most verbs: just add **-ing** → play → play**ing**, read → read**ing**
- Silent e at the end: **drop the e**, add -ing → make → mak**ing**, dance → danc**ing**
- Short vowel + one consonant: **double the consonant** → run → runn**ing**, swim → swim**ing**, sit → sitt**ing**

**Present simple vs. present continuous**:
- Present simple = habits: "I **play** football every Saturday."
- Present continuous = happening now: "I **am playing** football (now)."
- Clue words for present continuous: **now, right now, at the moment, look!, listen!**

Real-life tip: when you watch a cartoon in English, pause it and say what is happening: "The cat is running. The dog is sleeping."`,
                      examples: [
                        {
                          title: '基础：变成 -ing 形式',
                          problem: 'Write the -ing form: make, run, write, swim.',
                          solution: 'making, running, writing, swimming.',
                          tip: 'make → drop e; run/swim → double the last letter; write → drop e.'
                        },
                        {
                          title: '进阶：用现在进行时造句',
                          problem: 'Look at the action: "The boy / football / now." Make a sentence.',
                          solution: 'The boy is playing football now.',
                          tip: 'The boy (he) → is; play → playing; add "now".'
                        },
                        {
                          title: '挑战：区分两种时态',
                          problem: 'Which tense? "She ____ (dance) in the room now." vs "She ____ (dance) every day."',
                          solution: 'First: "is dancing" (now → present continuous). Second: "dances" (every day → present simple, third person).',
                          tip: '"now" → continuous (be + -ing); "every day" → simple (verb + s).'
                        }
                      ],
                      interaction: `🎬 **"动作直播员" Live Action Reporter**（约 8 分钟）

1. 家长做一个动作（如喝水、看书），孩子当"直播员"用英语解说："You are drinking water!"
2. 孩子做动作，家长来解说，然后一起改成否定句（"I\'m not sleeping"）和疑问句（"Are you reading?"）。
3. 进阶：家长说一个习惯（"I play basketball every Sunday"），孩子立刻说一个"现在"的动作（"I am talking now"）作对比。
4. 挑战：看一段无声动画片，孩子用英语"直播"画面里正在发生的事。

💡 目的：把"be + v-ing"和"此刻正在发生"建立直接联系，用身体动作强化记忆。`,
                      exercises: [
                        { question: '写出下列动词的 -ing 形式：take, sit, look, run。', answer: 'taking, sitting, looking, running', explanation: 'take 去 e；sit/run 双写末字母；look 直接加 ing。' },
                        { question: '用所给词的正确形式填空：Listen! She ____ (sing).', answer: 'is singing', explanation: 'Listen! 提示正在发生，用现在进行时。' },
                        { question: '改错：They is playing games now.', answer: 'They are playing games now.', explanation: 'They 是复数，be 动词用 are。' },
                        { question: '用现在进行时描述：你的爸爸妈妈现在在做什么？（造一个句子）', answer: '开放性题，如 "My father is reading a newspaper."', explanation: 'am/is/are + v-ing 表示此刻正在进行的动作。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-025',
                    title: '一般将来时',
                    description: 'will与be going to表示将要发生的动作。',
                    funEmoji: '🗣️',
                    funFact: '英语是世界通用的桥梁。',
                    funStory: '在英语学习的奇妙旅程中，一般将来时就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有一般将来时的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「一般将来时」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「一般将来时」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **一般将来时** 是英语学习的重要内容。will与be going to表示将要发生的动作。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出一般将来时，激发学习热情。',
                      '**分步渐进**：将一般将来时拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「一般将来时」的基本含义是什么？', answer: '（基础题）will与be going to表示将要发生的动作。' },
                      { question: '举一个生活中与「一般将来时」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「一般将来时」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can make future sentences with "will + verb" for quick decisions, promises and predictions',
                        'Can make future sentences with "be going to + verb" for plans and intentions',
                        'Can spot future time words: tomorrow, next week/month/year, tonight, soon',
                        'Can use the negative forms "will not (won\'t)" and "be not going to"'
                      ],
                      explanation: `The **future simple** lets you talk about things that **have not happened yet** — your plans, hopes and predictions. In English, you have two handy ways to build it.

**Structure 1: will + verb**
- Use for: quick decisions, promises, offers, predictions.
- "I **will help** you." (offer) / "It **will rain** tomorrow." (prediction)
- Negative: "will **not**" → **won\'t**. "I **won\'t be** late."
- Question: "**Will** you **come**?" → "**Yes, I will.** / **No, I won\'t.**"

**Structure 2: be going to + verb**
- Use for: plans and intentions you decided before.
- "I **am going to visit** my grandma next Sunday." (a plan)
- "Look at those clouds! It **is going to rain**." (evidence now)

**Time clues for the future**:
**tomorrow, tonight, next week / month / year, in the future, soon, in 2030**

Real-life tip: at bedtime, say one thing you will do tomorrow in English — "I will read a story tomorrow." That is a real future sentence!`,
                      examples: [
                        {
                          title: '基础：用 will 造句',
                          problem: 'You promise your mum you will finish homework. Say it in English.',
                          solution: '"I will finish my homework."',
                          tip: '"will + 动词原形" 表示承诺或将来要做的事，动词不加 s。'
                        },
                        {
                          title: '进阶：用 be going to 表达计划',
                          problem: 'You plan to see a film this weekend. Say it with "be going to".',
                          solution: '"I am going to see a film this weekend."',
                          tip: 'be going to 表示事先计划好的事，注意 be 要和主语一致（I am / she is / they are）。'
                        },
                        {
                          title: '挑战：变成否定和疑问',
                          problem: 'Change to negative and question: "She will come tomorrow."',
                          solution: 'Negative: "She won\'t come tomorrow." Question: "Will she come tomorrow?"',
                          tip: 'will 的否定用 won\'t；疑问句把 will 提到主语前。'
                        }
                      ],
                      interaction: `🔮 **"未来愿望瓶" Future Wish Jar**（约 8 分钟）

1. 家长和孩子各拿 3 张纸条，用将来时写下/画下"明天的计划"，如 "I am going to play football."
2. 把纸条折好放进"愿望瓶"，轮流抽取并大声读出句子。
3. 进阶：抽到后把它变成否定句和疑问句（"I won\'t play football." / "Will you play football?"）。
4. 挑战：用 will 许一个"周末愿望"，家长和孩子互相用 "Will you…?" 提问。

💡 目的：通过"写计划—读计划—变句型"的闭环，把 will 和 be going to 的结构练熟。`,
                      exercises: [
                        { question: '用 will 翻译：我明天会早点起床。', answer: 'I will get up early tomorrow.', explanation: 'will + 动词原形 get up 表示将来。' },
                        { question: '把下列句子改为否定句：He is going to swim.', answer: "He isn't going to swim. / He's not going to swim.", explanation: 'be going to 的否定在 be 后加 not。' },
                        { question: '写出 "will not" 的缩写形式。', answer: "won't", explanation: 'will not 缩写为 won\'t。' },
                        { question: '用 be going to 造句：我打算下周末去看望奶奶。', answer: 'I am going to visit my grandma next weekend.', explanation: 'be going to + 动词原形 表示计划。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-026',
                    title: '形容词比较级',
                    description: 'bigger/biggest等比较级与最高级变化。',
                    funEmoji: '🎵',
                    funFact: '每天一个小单词，一年就是365个新朋友。',
                    funStory: '在英语学习的奇妙旅程中，形容词比较级就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有形容词比较级的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「形容词比较级」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「形容词比较级」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **形容词比较级** 是英语学习的重要内容。bigger/biggest等比较级与最高级变化。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出形容词比较级，激发学习热情。',
                      '**分步渐进**：将形容词比较级拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「形容词比较级」的基本含义是什么？', answer: '（基础题）bigger/biggest等比较级与最高级变化。' },
                      { question: '举一个生活中与「形容词比较级」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「形容词比较级」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can form comparatives with "-er" for short adjectives (taller, bigger, faster)',
                        'Can form superlatives with "-est" for short adjectives (tallest, biggest, fastest)',
                        'Can use "more / the most" for longer adjectives (more beautiful)',
                        'Can compare two things using "… than …" and three or more using "the … in / of"'
                      ],
                      explanation: `When you want to **compare** things — who is taller, which is bigger, what is the best — you need the **comparative** and **superlative** forms of adjectives. English changes the adjective to do this.

**Short adjectives (1 syllable, or 2 ending in -y)**: add **-er / -est**
- tall → tall**er** → tall**est**
- big → bigg**er** → bigg**est** (double the g!)
- fast → fast**er** → fast**est**
- happy → happ**ier** → happ**iest** (y → i)

**Longer adjectives (2+ syllables, not ending in -y)**: use **more / the most**
- beautiful → **more** beautiful → **the most** beautiful
- interesting → **more** interesting → **the most** interesting

**Irregular ones to memorise**:
- good → **better** → **the best**
- bad → **worse** → **the worst**
- many/much → **more** → **the most**

**How to use them**:
- Comparative (2 things): "Tom is **taller than** Lily."
- Superlative (3+ things): "Tom is **the tallest in** the class."

Real-life tip: compare things at home — "The elephant is bigger than the dog. The blue whale is the biggest animal."`,
                      examples: [
                        {
                          title: '基础：写出比较级和最高级',
                          problem: 'Write the comparative and superlative of: tall, big, happy.',
                          solution: 'tall → taller → tallest; big → bigger → biggest; happy → happier → happiest.',
                          tip: 'big 双写 g；happy 变 y 为 i；tall 直接加 -er/-est。'
                        },
                        {
                          title: '进阶：用 than 比较',
                          problem: 'Compare a cheetah and a turtle: fast.',
                          solution: '"The cheetah is faster than the turtle."',
                          tip: '两者比较用 比较级 + than。'
                        },
                        {
                          title: '挑战：用最高级造句',
                          problem: 'Say that the Yangtze River is the longest river in China.',
                          solution: '"The Yangtze River is the longest river in China."',
                          tip: '三者及以上比较用 the + 最高级 + in/of…。'
                        }
                      ],
                      interaction: `📏 **"比比看" Compare It!**（约 8 分钟）

1. 家长拿出三本书（大、中、小），孩子用英语排序："big / bigger / the biggest"，并造句 "The red book is bigger than the blue one."
2. 进阶：比身高——孩子和家长站一起，说 "My dad is taller than me. He is the tallest in my family."
3. 挑战：家长说一个形容词（如 beautiful），孩子说出比较级和最高级，再用最高级说一个真实事实（"the most beautiful city"）。
4. 特别轮：专门练不规则变化 good→better→best, bad→worst。

💡 目的：把比较级/最高级和实物对比结合，让抽象的语法变成看得见的大小、高矮。`,
                      exercises: [
                        { question: '写出下列形容词的比较级和最高级：hot, nice, good。', answer: 'hotter/hottest; nicer/nicest; better/best', explanation: 'hot 双写 t；nice 直接加 r/st；good 是不规则变化。' },
                        { question: '用 than 比较：This book is interesting. That book is more interesting.', answer: 'That book is more interesting than this one.', explanation: '两者比较用 比较级 + than。' },
                        { question: '改错：He is the taller in the class.', answer: 'He is the tallest in the class.', explanation: '三者及以上用最高级 tallest，不是比较级 taller。' },
                        { question: '写出 bad 的最高级。', answer: 'the worst', explanation: 'bad 是不规则变化：bad → worse → worst。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-027',
                    title: '特殊疑问句',
                    description: 'What/Where/When/Who等疑问词引导的问句。',
                    funEmoji: '🌟',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，特殊疑问句就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有特殊疑问句的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「特殊疑问句」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「特殊疑问句」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **特殊疑问句** 是英语学习的重要内容。What/Where/When/Who等疑问词引导的问句。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出特殊疑问句，激发学习热情。',
                      '**分步渐进**：将特殊疑问句拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「特殊疑问句」的基本含义是什么？', answer: '（基础题）What/Where/When/Who等疑问词引导的问句。' },
                      { question: '举一个生活中与「特殊疑问句」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「特殊疑问句」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can match each question word to the right kind of information: What (thing), Where (place), When (time), Who (person), How (way/condition), Why (reason)',
                        'Can build a wh- question in the correct order: "Wh- word + be/do/does + subject + verb"',
                        'Can answer a wh- question with a full sentence (not just "Yes/No")',
        'Can choose the right question word for a given answer'
                      ],
                      explanation: `Wh- questions are your **information-gathering tools**. Unlike Yes/No questions, they ask for a real piece of information — a thing, a place, a time, a person, or a reason.

**The main question words**:

| Question word | Ask about | Example |
|---------------|-----------|---------|
| **What** | a thing / an action | "What is this?" "What do you like?" |
| **Where** | a place | "Where is my book?" |
| **When** | a time | "When is your birthday?" |
| **Who** | a person | "Who is she?" |
| **How** | a way / condition | "How are you?" "How do you go to school?" |
| **Why** | a reason | "Why are you late?" (answer with "because …") |

**Question structure**:
- With "be": **Wh- + be + subject** → "Where **is** your mum?"
- With other verbs: **Wh- + do/does + subject + verb** → "What **do** you **like**?" "Where **does** she **live**?"

**Key rule**: a wh- question is answered with **information**, not "Yes" or "No".
- "What is your name?" → "My name is Lily." (NOT "Yes.")

Real-life tip: play "20 Questions" — think of an animal and let the other person ask wh- questions to guess it!`,
                      examples: [
                        {
                          title: '基础：选对疑问词',
                          problem: 'Fill in the right word: "____ is your bag?" (answer: "It is on the desk.")',
                          solution: '"Where." The answer tells a place → use "Where".',
                          tip: 'Match the answer type: place → Where, thing → What, person → Who, time → When.'
                        },
                        {
                          title: '进阶：把句子变成特殊疑问句',
                          problem: 'Ask about the underlined word: "Tom goes to school by bus." (Tom)',
                          solution: '"Who goes to school by bus?"',
                          tip: 'Replace the person with Who; the rest of the sentence stays the same.'
                        },
                        {
                          title: '挑战：根据答句提问',
                          problem: 'The answer is "Because it is rainy." What is the question?',
                          solution: '"Why are you staying inside?" (or similar "Why …?" question)',
                          tip: '"Because" answers "Why" — they always come as a pair.'
                        }
                      ],
                      interaction: `❓ **"猜猜我是谁" Wh- Question Guessing Game**（约 8 分钟）

1. 孩子想好一个家人或动画角色，家长用 wh- 问题提问："What colour is his cap?" "Where does he live?" "Who is his friend?"
2. 孩子只能用完整句子回答，家长根据线索猜出是谁。
3. 进阶：角色换成真实物品（如孩子书包里的一件文具），家长用 wh- 问题猜。
4. 挑战：孩子当小记者，用 5 个不同的 wh- 问题采访家长，记录答案。

💡 目的：通过"提问—回答"的真实对话功能，让孩子理解每个疑问词到底在问什么。`,
                      exercises: [
                        { question: '"How are you?" 问的是什么？', answer: '问的是状况/心情（你好吗？）。', explanation: 'How 问方式或状况，How are you 是问候。' },
                        { question: '对划线部分提问：My birthday is in June. (June)', answer: 'When is your birthday?', explanation: 'June 是时间，用 When 提问。' },
                        { question: '"Why" 的回答通常以什么词开头？', answer: 'because', explanation: 'Why 问原因，because 给出原因。' },
                        { question: '改错：What you like?', answer: 'What do you like?', explanation: '实义动词 like 需要助动词 do 来构成疑问。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-028',
                    title: '一般疑问句',
                    description: 'Do you...?/Can you...?及肯否定回答。',
                    funEmoji: '🦉',
                    funFact: '英语是世界通用的桥梁。',
                    funStory: '在英语学习的奇妙旅程中，一般疑问句就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有一般疑问句的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「一般疑问句」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「一般疑问句」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **一般疑问句** 是英语学习的重要内容。Do you...?/Can you...?及肯否定回答。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出一般疑问句，激发学习热情。',
                      '**分步渐进**：将一般疑问句拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「一般疑问句」的基本含义是什么？', answer: '（基础题）Do you...?/Can you...?及肯否定回答。' },
                      { question: '举一个生活中与「一般疑问句」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「一般疑问句」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can make Yes/No questions by moving "be" (am/is/are) to the front of the sentence',
                        'Can make Yes/No questions with "do/does" for sentences with ordinary verbs',
                        'Can give short answers: "Yes, I am / No, I\'m not", "Yes, he does / No, he doesn\'t"',
                        'Can tell the difference between a Yes/No question and a wh- question'
                      ],
                      explanation: `**Yes/No questions** are questions whose answer is simply "Yes" or "No". They are the simplest questions to build — and mastering them makes conversations flow much more smoothly.

**Type 1: Sentences with "be"** → move **be** to the front.
- Statement: "She **is** a teacher."
- Question: "**Is** she a teacher?" → "**Yes, she is.** / **No, she isn\'t.**"

**Type 2: Sentences with "can"** → move **can** to the front.
- Statement: "He **can swim**."
- Question: "**Can** he swim?" → "**Yes, he can.** / **No, he can\'t.**"

**Type 3: Sentences with ordinary verbs** → add **do / does** at the front.
- Statement: "You **like** apples."
- Question: "**Do** you like apples?" → "**Yes, I do.** / **No, I don\'t.**"
- Statement: "She **likes** apples."
- Question: "**Does** she like apples?" → "**Yes, she does.** / **No, she doesn\'t.**" (note: likes → like, no -s after does!)

Real-life tip: the short answer always uses the SAME helping verb as the question — "Do…?" → "Yes, I do."; "Is…?" → "Yes, he is."`,
                      examples: [
                        {
                          title: '基础：be 动词的一般疑问句',
                          problem: 'Change to a question: "They are students."',
                          solution: '"Are they students?"',
                          tip: 'Move "are" to the front; the rest stays the same.'
                        },
                        {
                          title: '进阶：含实义动词的疑问句',
                          problem: 'Change to a question: "Tom likes football."',
                          solution: '"Does Tom like football?" (likes → like after does)',
                          tip: 'Third person uses "does"; the main verb drops its -s and returns to the base form.'
                        },
                        {
                          title: '挑战：给出否定回答',
                          problem: 'Question: "Can you swim?" Give a negative short answer.',
                          solution: '"No, I can\'t."',
                          tip: 'Short negative answer: No + subject + helping verb + not (can\'t / don\'t / isn\'t …).'
                        }
                      ],
                      interaction: `🎯 **"是还是否" Yes or No Challenge**（约 8 分钟）

1. 家长做一个陈述（如 "You are a teacher"），孩子快速把它变成一般疑问句 "Are you a teacher?" 并回答 "No, I\'m not!"
2. 进阶：家长说 "I like winter." 孩子变成 "Do you like winter?" 并回答。
3. 反向游戏：家长说一个问题（"Can a fish fly?"），孩子用完整短回答 "No, it can\'t." 并说明原因。
4. 挑战：连续快问快答 10 题，看孩子能不能在 3 秒内变成疑问句并回答。

💡 目的：通过反复的"陈述→疑问"转换，把 do/does 和 be 的疑问结构变成自动反应。`,
                      exercises: [
                        { question: '把下列句子变成一般疑问句：He is tall.', answer: 'Is he tall?', explanation: 'be 动词 is 提到句首。' },
                        { question: '把下列句子变成一般疑问句：They play basketball.', answer: 'Do they play basketball?', explanation: '实义动词 play 需要助动词 do 构成疑问。' },
                        { question: '用否定短回答：Does she like cats?', answer: "No, she doesn't.", explanation: 'Does 提问用 doesn\'t 否定回答，动词还原为 like。' },
                        { question: '改错：Do he like music?', answer: 'Does he like music?', explanation: '第三人称单数用 does，不用 do。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-029',
                    title: 'There be句型',
                    description: '某地有某物，be动词与主语的一致。',
                    funEmoji: '🍎',
                    funFact: '每天一个小单词，一年就是365个新朋友。',
                    funStory: '在英语学习的奇妙旅程中，There be句型就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有There be句型的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「There be句型」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「There be句型」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **There be句型** 是英语学习的重要内容。某地有某物，be动词与主语的一致。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出There be句型，激发学习热情。',
                      '**分步渐进**：将There be句型拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「There be句型」的基本含义是什么？', answer: '（基础题）某地有某物，be动词与主语的一致。' },
                      { question: '举一个生活中与「There be句型」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「There be句型」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can use "There is + singular noun" and "There are + plural noun" to say what exists in a place',
                        'Can choose "is" or "are" correctly based on the noun after it (the real subject)',
                        'Can make negative sentences with "There is not / There are not"',
                        'Can make Yes/No questions with "Is there …? / Are there …?" and give short answers'
                      ],
                      explanation: `The **There be** structure tells us **what exists or can be found in a place**. It is like pointing at a room and listing what is inside.

**Structure**:
- **There is + a / an + singular noun** → "There **is a** book on the desk."
- **There are + plural noun** → "There **are three** books on the desk."

**The golden rule**: the verb (is / are) matches the **first noun after it** (the real subject), not the word "There".
- "There **is** a pen and two books." (a pen = singular → is)
- "There **are** two books and a pen." (two books = plural → are)
(This is called the "proximity rule" — the verb agrees with the closest noun.)

**Negative**: add **not**.
- "There **isn\'t a** cat in the room." / "There **aren\'t any** trees here."

**Question**: move **is / are** to the front.
- "**Is there** a library near here?" → "**Yes, there is.** / **No, there isn\'t.**"
- "**Are there** any apples?" → "**Yes, there are.** / **No, there aren\'t.**"

Real-life tip: describe your bedroom — "There is a bed. There are two windows. There isn\'t a computer."`,
                      examples: [
                        {
                          title: '基础：选 is 还是 are',
                          problem: 'Fill in: There ____ a dog in the park. / There ____ five dogs in the park.',
                          solution: '"is" (a dog = singular); "are" (five dogs = plural).',
                          tip: 'Look at the noun right after "There" — singular → is, plural → are.'
                        },
                        {
                          title: '进阶：就近原则',
                          problem: 'Fill in: There ____ a chair and two tables in the room.',
                          solution: '"is." The first noun after "There" is "a chair" (singular) → use "is".',
                          tip: 'With "A and B", the verb agrees with A (the closest noun).'
                        },
                        {
                          title: '挑战：变成疑问句并回答',
                          problem: 'Change to a question: "There is a supermarket near my home." Give a positive answer.',
                          solution: '"Is there a supermarket near your home?" → "Yes, there is."',
                          tip: 'Move "is" to the front; short answer repeats "there is".'
                        }
                      ],
                      interaction: `🏠 **"我的房间" My Room Tour**（约 8 分钟）

1. 孩子带家长"参观"自己的房间，用 There be 句型介绍："There is a bed. There are three books on the desk."
2. 进阶：家长故意说错一句（如 "There is three books"），孩子当小老师改正。
3. 疑问句游戏：家长闭眼，孩子描述一个物品的位置，家长用 "Is there a …?" 提问，孩子回答。
4. 挑战：用 There be 描述一幅房间图（或照片），至少说 5 句，包含肯定、否定和疑问。

💡 目的：把 There be 和"介绍空间"的真实功能绑定，让孩子在描述环境中自然使用。`,
                      exercises: [
                        { question: 'There ____ some water in the glass. (is / are)', answer: 'is', explanation: 'water 是不可数名词，视为单数，用 is。' },
                        { question: '把下列句子变成否定句：There are two chairs in the room.', answer: "There aren't two chairs in the room. / There are not two chairs in the room.", explanation: 'are 后加 not 构成否定。' },
                        { question: '把下列句子变成一般疑问句：There is a library in our school.', answer: 'Is there a library in our school?', explanation: 'is 提到句首构成疑问。' },
                        { question: '改错：There are a bag on the desk.', answer: 'There is a bag on the desk.', explanation: 'a bag 是单数，用 is。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-030',
                    title: '情态动词',
                    description: 'can/must/should等情态动词的基本用法。',
                    funEmoji: '✏️',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，情态动词就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有情态动词的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「情态动词」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「情态动词」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **情态动词** 是英语学习的重要内容。can/must/should等情态动词的基本用法。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出情态动词，激发学习热情。',
                      '**分步渐进**：将情态动词拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「情态动词」的基本含义是什么？', answer: '（基础题）can/must/should等情态动词的基本用法。' },
                      { question: '举一个生活中与「情态动词」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「情态动词」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can use "can / can\'t" to talk about ability (what you are able to do)',
                        'Can use "must / mustn\'t" to talk about rules and strong obligation',
                        'Can use "should / shouldn\'t" to give advice',
                        'Can remember the key rule: modal verbs are always followed by the base verb (no -s, no -ing, no to)'
                      ],
                      explanation: `**Modal verbs** are helper verbs that add meaning to the main verb — ability, permission, obligation, or advice. In primary school, the most important ones are **can, must and should**.

**can / can\'t** → ability (能/不能) and permission (可以)
- "I **can swim**." (ability) / "**Can** I go out?" (permission)
- "She **can\'t fly**." (She is not able to fly.)

**must / mustn\'t** → strong rule or obligation (必须/禁止)
- "You **must wear** a helmet when riding a bike." (rule)
- "You **mustn\'t touch** the fire." (prohibition — it is dangerous)

**should / shouldn\'t** → advice (应该/不应该)
- "You **should drink** more water." (good advice)
- "You **shouldn\'t eat** too much candy." (advice against something)

**The golden rule**: after a modal verb, use the **base verb** (原形) — no -s, no -ing, no "to".
- ✅ "He **can play** football." ❌ "He can plays…" ❌ "He can to play…"

Real-life tip: make family rules in English — "We must do homework first. We shouldn\'t watch TV too late."`,
                      examples: [
                        {
                          title: '基础：用 can 表达能力',
                          problem: 'Say in English: "我会游泳，但我不会打篮球。"',
                          solution: '"I can swim, but I can\'t play basketball."',
                          tip: 'can + 动词原形 表示能力；can\'t 表示不会。'
                        },
                        {
                          title: '进阶：用 must / should 说规则和建议',
                          problem: 'Give a rule about crossing the road and a tip about health.',
                          solution: 'Rule: "We must look left and right before crossing." Tip: "You should eat more vegetables."',
                          tip: 'must 用于强制规则，should 用于友好建议。'
                        },
                        {
                          title: '挑战：改正句子',
                          problem: 'Find the mistake: "She can speaks English."',
                          solution: '"She can speak English." (after can, use the base verb speak, NOT speaks)',
                          tip: 'Modal verbs never change the next verb — always the base form.'
                        }
                      ],
                      interaction: `📋 **"家庭英语小规则" Family Rules Poster**（约 8 分钟）

1. 家长和孩子一起讨论 3 条家庭规则，用 must / shouldn\'t 写成英语卡片，如 "We must go to bed before 10."
2. 孩子用 can 介绍自己的 3 项能力："I can ride a bike. I can speak English. I can\'t cook."
3. 进阶：角色互换，孩子当"家长"，用 should 给家长提建议："You should exercise more."
4. 挑战：把所有句子变成否定句和一般疑问句（如 "Can you swim?"）。

💡 目的：把情态动词和真实家庭生活绑定，让"can/must/should + 动词原形"在语境中自然习得。`,
                      exercises: [
                        { question: '用 can 或 can\'t 填空：I ____ sing, but I ____ dance.', answer: "can; can't", explanation: 'can 表示能力，can\'t 表示不能。' },
                        { question: '用 must 或 should 填空：You ____ brush your teeth every day. (规则/强烈建议)', answer: 'must', explanation: 'must 表示必须做的事（强烈义务）。' },
                        { question: '改错：He musts finish his homework.', answer: 'He must finish his homework.', explanation: 'must 后面的动词用原形，must 本身也不加 s。' },
                        { question: '用 should 提一个学习建议。', answer: '开放性题，如 "You should read English every day."', explanation: 'should + 动词原形 给出建议。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-031',
                    title: '介词',
                    description: 'in/on/at等介词的基本用法与固定搭配。',
                    funEmoji: '/flag_uk',
                    funFact: '英语是世界通用的桥梁。',
                    funStory: '在英语学习的奇妙旅程中，介词就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有介词的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「介词」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「介词」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **介词** 是英语学习的重要内容。in/on/at等介词的基本用法与固定搭配。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出介词，激发学习热情。',
                      '**分步渐进**：将介词拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「介词」的基本含义是什么？', answer: '（基础题）in/on/at等介词的基本用法与固定搭配。' },
                      { question: '举一个生活中与「介词」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「介词」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can use "in / on / at" to talk about place correctly',
                        'Can use "in / on / at" to talk about time correctly',
                        'Can use other common prepositions: under, behind, next to, between, in front of',
        'Can choose the right preposition in common verb + preposition combinations'
                      ],
                      explanation: `**Prepositions** are tiny words that show **where** something is (place) or **when** something happens (time). They are small but very important — using the wrong one can confuse your listener!

**Place prepositions**:
- **in** → inside something (in the box, in the room, in China)
- **on** → on a surface (on the desk, on the wall, on the floor)
- **at** → a specific point or place (at school, at home, at the bus stop)
- Others: **under** the bed, **behind** the door, **next to** the window, **between** A and B, **in front of** the house

**Time prepositions** (the "in / on / at" triangle):
- **in** → months, years, seasons, parts of the day: **in** July, **in** 2025, **in** the morning
- **on** → days and dates: **on** Monday, **on** Children's Day, **on** the 5th of May
- **at** → clock times and points of time: **at** 7 o'clock, **at** night, **at** noon

**Common fixed pairs**:
- good **at**, interested **in**, arrive **at** (a place) / arrive **in** (a city/country)

Real-life tip: play "Where is the pencil?" — hide a pencil and give clues: "It is under the book."`,
                      examples: [
                        {
                          title: '基础：选对地点介词',
                          problem: 'The book is ____ the desk. The picture is ____ the wall.',
                          solution: '"on the desk" (surface); "on the wall" (surface).',
                          tip: 'Flat surfaces → on; enclosed spaces → in; specific spots → at.'
                        },
                        {
                          title: '进阶：选对时间介词',
                          problem: 'Fill in: I go to school ____ 7:30. My birthday is ____ June.',
                          solution: '"at 7:30" (clock time → at); "in June" (month → in).',
                          tip: 'Clock time → at; day → on; month/year/season → in.'
                        },
                        {
                          title: '挑战：用介词描述位置',
                          problem: 'Describe where the cat is relative to the sofa, using a preposition.',
                          solution: 'Sample: "The cat is under the sofa." / "The cat is behind the sofa."',
                          tip: 'Look at the real position, then pick the preposition that matches it.'
                        }
                      ],
                      interaction: `🔍 **"介词寻宝" Preposition Treasure Hunt**（约 8 分钟）

1. 家长把一个小玩具藏在房间里，用介词线索提示孩子："It is under something." "It is behind the door."
2. 孩子根据线索找到后，用完整句子公布位置："The toy is behind the door!"
3. 进阶：角色互换，孩子藏、家长找，孩子用介词给线索。
4. 挑战：加入时间介词问答——"When is your birthday?" "It is in March. It is on the 12th."

💡 目的：把介词和真实空间位置对应，建立"图-词"直接反应，避免死记硬背。`,
                      exercises: [
                        { question: 'The bird is ____ the tree. (in / on)', answer: 'in', explanation: '鸟在树的枝叶里面，用 in；on the tree 通常用于长在树上的东西（如苹果）。' },
                        { question: 'We have a party ____ Children\'s Day. (in / on / at)', answer: 'on', explanation: '节日/具体某一天用 on。' },
                        { question: '用适当的介词填空：The cat is hiding ____ the bed.', answer: 'under / behind / next to', explanation: '根据实际位置选择合适的介词。' },
                        { question: '判断：at 用于月份。对吗？', answer: '不对，月份用 in；at 用于具体时刻。', explanation: 'in 用于月/年/季节，at 用于钟点。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-032',
                    title: '日期与月份',
                    description: 'January到December，星期的表达方式。',
                    funEmoji: '🇺🇸',
                    funFact: '每天一个小单词，一年就是365个新朋友。',
                    funStory: '在英语学习的奇妙旅程中，日期与月份就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有日期与月份的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「日期与月份」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「日期与月份」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **日期与月份** 是英语学习的重要内容。January到December，星期的表达方式。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出日期与月份，激发学习热情。',
                      '**分步渐进**：将日期与月份拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「日期与月份」的基本含义是什么？', answer: '（基础题）January到December，星期的表达方式。' },
                      { question: '举一个生活中与「日期与月份」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「日期与月份」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can read, spell and say the twelve months from January to December',
                        'Can say the days of the week: Monday through Sunday',
                        'Can say dates correctly using ordinal numbers: "January the first" or "the first of January"',
                        'Can ask and answer "When is your birthday?" and "What\'s the date today?"'
                      ],
                      explanation: `Dates and months are **everyday English** — you need them for birthdays, holidays, school events and planning. Let us learn them in an orderly way.

**The twelve months**:
**January, February, March, April, May, June, July, August, September, October, November, December**
Tip: learn them in chunks of three and say them like a rhythm.

**The days of the week**:
**Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday**
Monday to Friday are "weekdays"; Saturday and Sunday are the "weekend".

**Saying dates** — use **ordinal numbers** (序数词):
- 1st = first, 2nd = second, 3rd = third, 4th = fourth … 21st = twenty-first, 31st = thirty-first
- Two common patterns:
  - "January **the first**" (British style, spoken)
  - "**The first of January**" (British style, spoken)
  - "January 1st" (American style, written)

**Key questions**:
- "**When is your birthday?**" → "**It is in June.**" / "**It is on June 5th.**"
- "**What day is it today?**" → "**It is Monday.**"
- "**What\'s the date today?**" → "**It is September 13th.**"

Real-life tip: put an English calendar on your wall and say the date every morning: "Today is Monday, September 13th."`,
                      examples: [
                        {
                          title: '基础：说出月份和星期',
                          problem: 'Which month comes after August? Which day comes after Friday?',
                          solution: 'After August comes September. After Friday comes Saturday.',
                          tip: 'Months: … August, September, October … Week: … Friday, Saturday, Sunday.'
                        },
                        {
                          title: '进阶：用序数词说日期',
                          problem: 'How do you say "6 月 3 日" in English?',
                          solution: '"June the third" or "the third of June" or "June 3rd".',
                          tip: '3 日 = the third (3rd); remember 1st, 2nd, 3rd are special (first, second, third).'
                        },
                        {
                          title: '挑战：回答关于生日的问题',
                          problem: 'A: "When is your birthday?"  B: (Your birthday is March 15th.) "______"',
                          solution: '"It is on March the fifteenth." or "It is on March 15th."',
                          tip: 'A full date uses "on + the + ordinal + of + month".'
                        }
                      ],
                      interaction: `📅 **"日历问答" Calendar Quiz**（约 8 分钟）

1. 家长指着英语日历上的一个月份，孩子快速说出英文，并拼读（如 "S-e-p-t-e-m-b-e-r"）。
2. 进阶：家长说一个节日（如"国庆节"），孩子说出它所在的月份："October."
3. 生日问答：家长问 "When is your birthday?" 孩子回答 "It is on …" 并说出具体日期。
4. 挑战：孩子当"小导游"，用英语介绍未来一周的家庭计划："On Monday we are going to the park."

💡 目的：把月份、星期、日期和真实日历活动绑定，让时间表达变得实用、可说。`,
                      exercises: [
                        { question: '"December" 是第几个月？', answer: '第 12 个月（十二月）。', explanation: 'December 是一年中的最后一个月。' },
                        { question: '写出星期一到星期日的英文。', answer: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', explanation: '一周七天，注意拼写和大小写。' },
                        { question: '5 月 1 日用英语怎么说？', answer: 'May the first / the first of May / May 1st', explanation: '日期用序数词 first（1st）。' },
                        { question: 'What day is it today? (根据实际情况回答)', answer: '开放性题，如 "It is Saturday."', explanation: '用 It is + 星期几 回答。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-033',
                    title: '时间表达',
                    description: '整点与半点，时间的读法与写法。',
                    funEmoji: '🔤',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，时间表达就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有时间表达的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「时间表达」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「时间表达」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **时间表达** 是英语学习的重要内容。整点与半点，时间的读法与写法。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出时间表达，激发学习热情。',
                      '**分步渐进**：将时间表达拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「时间表达」的基本含义是什么？', answer: '（基础题）整点与半点，时间的读法与写法。' },
                      { question: '举一个生活中与「时间表达」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「时间表达」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can read and say whole-hour times: "It is … o\'clock"',
                        'Can read and say half past … and quarter past / quarter to …',
                        'Can tell the time in two ways: digital ("seven thirty") and traditional ("half past seven")',
                        'Can ask and answer "What time is it?" and "What time do you …?"'
                      ],
                      explanation: `Being able to **tell the time in English** is a real-life superpower — you can read bus schedules, TV guides and school timetables all by yourself.

**Whole hours (整点)**: use **o\'clock**
- "It is **seven o\'clock**." (7:00)
- "It is **twelve o\'clock**." (12:00)

**The half hour**: **half past …**
- "It is **half past seven**." (7:30) = "seven thirty"

**Quarter hours**:
- **quarter past …** = 15 minutes past (7:15 = quarter past seven)
- **quarter to …** = 15 minutes before (7:45 = quarter to eight)

**General rule**: up to 30 minutes, use **past**; over 30 minutes, use **to** (the next hour).
- 7:20 → twenty **past** seven
- 7:50 → ten **to** eight

**Asking the time**:
- "**What time is it?**" / "**What is the time?**" → "**It is half past three.**"
- "**What time do you get up?**" → "**I get up at seven o\'clock.**"

Real-life tip: whenever you look at a clock, say the time in English before you say it in Chinese — it is a great daily drill!`,
                      examples: [
                        {
                          title: '基础：读出整点',
                          problem: 'What time is it? (The clock shows 9:00.)',
                          solution: '"It is nine o\'clock."',
                          tip: 'Whole hours always use "o\'clock". Remember to say "It is …" first.'
                        },
                        {
                          title: '进阶：用 past / to 表达非整点',
                          problem: 'Say in English: 4:15 and 4:45.',
                          solution: '4:15 = "quarter past four"; 4:45 = "quarter to five".',
                          tip: '15 minutes = quarter; under 30 use past, over 30 use to.'
                        },
                        {
                          title: '挑战：问答日常时间',
                          problem: 'A: "What time do you go to school?"  B: (You go at 7:30.) "______"',
                          solution: '"I go to school at half past seven." or "… at seven thirty."',
                          tip: 'Answer with "at + the time". Both "half past seven" and "seven thirty" are correct.'
                        }
                      ],
                      interaction: `🕐 **"时钟老狼" What\'s the Time, Mr Wolf?**（约 8 分钟）

1. 家长做一个钟表手势（或拿教学时钟），孩子用英语抢答："half past four!" 答对得 1 分。
2. 进阶：家长问 "What time do you have dinner?" 孩子回答 "At half past six."
3. 角色扮演"老狼老狼几点了"：孩子边走边问 "What\'s the time, Mr Wolf?" 家长答 "It is quarter to five!" 孩子迈相应步数。
4. 挑战：孩子看着真实的钟，每 15 分钟报时一次，用两种方式说（"seven fifteen / quarter past seven"）。

💡 目的：把时间表达和日常作息紧密联系，让"What time…?"和回答变成自然对话。`,
                      exercises: [
                        { question: '8:00 用英语怎么说？', answer: "It is eight o'clock.", explanation: '整点用 o\'clock。' },
                        { question: '用两种方式表达 2:30。', answer: 'half past two / two thirty', explanation: 'half past 和直接读数都可以。' },
                        { question: '10:45 用英语怎么说？', answer: 'quarter to eleven', explanation: '45 分 = 差 15 分 11 点，用 quarter to eleven。' },
                        { question: 'What time is it? (钟面显示 6:15)', answer: "It is quarter past six.", explanation: '15 分 = quarter past。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-034',
                    title: '喜好表达',
                    description: 'I like.../I don\'t like...等表达喜好的句型。',
                    funEmoji: '📚',
                    funFact: '英语是世界通用的桥梁。',
                    funStory: '在英语学习的奇妙旅程中，喜好表达就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有喜好表达的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「喜好表达」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「喜好表达」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **喜好表达** 是英语学习的重要内容。I like.../I don't like...等表达喜好的句型。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出喜好表达，激发学习热情。',
                      '**分步渐进**：将喜好表达拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「喜好表达」的基本含义是什么？', answer: '（基础题）I like.../I don\'t like...等表达喜好的句型。' },
                      { question: '举一个生活中与「喜好表达」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「喜好表达」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can say what I like with "I like + noun / I like + verb-ing"',
                        'Can say what I do not like with "I don\'t like …"',
                        'Can ask others about their likes with "Do you like …?" and "What do you like?"',
                        'Can express strong feelings with "I love … / I hate … / My favourite … is …"'
                      ],
                      explanation: `Talking about what you **like and dislike** is one of the most natural ways to start a conversation in English. It is personal, fun, and easy to practise every day.

**Saying what you like**:
- "**I like** apples." (noun)
- "**I like** reading / swimming / playing football." (verb-ing)
- "**I love** chocolate." (stronger than "like")

**Saying what you do NOT like**:
- "**I don\'t like** lemons." / "**I hate** lemons." (hate = very strong dislike)

**Asking others**:
- "**Do you like** winter?" → "**Yes, I do.** / **No, I don\'t.**"
- "**What do you like?**" → "**I like** music."
- "**What\'s your favourite** colour?" → "**My favourite colour is blue.**"

**favourite** is a very useful word — it means "the one you like the most".
- "My **favourite** animal is the panda."
- "Who is your **favourite** teacher?"

Real-life tip: at dinner, say one thing you like about the food in English — "I like the fish. It is delicious!"`,
                      examples: [
                        {
                          title: '基础：表达喜好',
                          problem: 'Say in English: "我喜欢游泳，但我不喜欢跑步。"',
                          solution: '"I like swimming, but I don\'t like running."',
                          tip: '动词 like 后面跟动词时，要用 -ing 形式（swimming, running）。'
                        },
                        {
                          title: '进阶：用 Do you like 问答',
                          problem: 'A: "Do you like winter?"  B: (You don\'t.) "______"',
                          solution: '"No, I don\'t."',
                          tip: '"Do you like …?" 的否定回答是 "No, I don\'t."'
                        },
                        {
                          title: '挑战：用 favourite 表达最爱',
                          problem: 'Say your favourite fruit and why, in English.',
                          solution: 'Sample: "My favourite fruit is mango because it is sweet."',
                          tip: 'Pattern: My favourite + 名词 + is … + because + 原因.'
                        }
                      ],
                      interaction: `❤️ **"喜好大调查" Favourite Things Survey**（约 8 分钟）

1. 孩子用 "Do you like …?" 采访家长 5 个问题（食物、颜色、运动、动物、季节），记录答案。
2. 进阶：孩子用 "What\'s your favourite …?" 再问一遍，比较两种问法的不同回答。
3. 孩子用英语汇报调查结果："My mum likes apples. Her favourite fruit is grapes."
4. 挑战：用 "I love … / I like … / I don\'t like … / I hate …" 做一个"喜好金字塔"。

💡 目的：把喜好表达和真实采访任务结合，让"Do you like…?"和favourite在交流中自然输出。`,
                      exercises: [
                        { question: '翻译：I like reading books.', answer: '我喜欢读书。', explanation: 'like + verb-ing 表示喜欢做某事。' },
                        { question: 'Do you like summer? (作否定回答)', answer: "No, I don't.", explanation: 'Do you like 的否定回答是 No, I don\'t。' },
                        { question: '用 favourite 造句：我最喜欢的颜色是红色。', answer: 'My favourite colour is red.', explanation: 'favourite 表示"最喜欢的"。' },
                        { question: '改错：I like play football.', answer: 'I like playing football.', explanation: 'like 后面的动词要用 -ing 形式。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-035',
                    title: '购物对话',
                    description: 'How much is it?等购物场景用语。',
                    funEmoji: '🗣️',
                    funFact: '每天一个小单词，一年就是365个新朋友。',
                    funStory: '在英语学习的奇妙旅程中，购物对话就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有购物对话的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「购物对话」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「购物对话」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **购物对话** 是英语学习的重要内容。How much is it?等购物场景用语。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出购物对话，激发学习热情。',
                      '**分步渐进**：将购物对话拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「购物对话」的基本含义是什么？', answer: '（基础题）How much is it?等购物场景用语。' },
                      { question: '举一个生活中与「购物对话」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「购物对话」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can ask about prices with "How much is / are …?"',
                        'Can use common shopping phrases: "I\'d like … / Can I help you? / Here you are"',
        'Can say numbers and prices in English (yuan / dollars)',
        'Can role-play a complete shopping dialogue between shop assistant and customer'
                      ],
                      explanation: `Shopping dialogues are one of the **most useful real-life English skills**. Whether you are at a shop, a market or a restaurant, the same patterns come up again and again.

**Key shopping phrases**:
- Shop assistant: "**Can I help you?**" / "**What can I do for you?**"
- Customer: "**I\'d like** a pencil, please." / "**I want** some apples."
- Asking the price: "**How much is** the book?" / "**How much are** the apples?"
- Saying the price: "**It is 5 yuan.**" / "**They are 10 yuan.**"
- Paying: "**Here you are.**" → "**Thank you.**"

**A complete shopping dialogue**:
> A (shop assistant): "Can I help you?"
> B (customer): "Yes, I\'d like some bananas, please."
> A: "Here you are."
> B: "How much are they?"
> A: "They are six yuan."
> B: "Here you are. Thank you!"

**Please and thank you** make every exchange polite — always add "please" when you ask for something!

Real-life tip: practise at home by "buying" snacks from your parents in English before you eat them!`,
                      examples: [
                        {
                          title: '基础：询问价格',
                          problem: 'You want to know the price of an ice cream. What do you say?',
                          solution: '"How much is the ice cream?"',
                          tip: '单数物品用 "How much is …?"；复数用 "How much are …?"'
                        },
                        {
                          title: '进阶：用 I\'d like 表达想要',
                          problem: 'Say in English: "我想要一瓶水。"',
                          solution: '"I\'d like a bottle of water, please."',
                          tip: '"I\'d like = I would like"，是礼貌表达"我想要"的句型。'
                        },
                        {
                          title: '挑战：完成一段购物对话',
                          problem: 'Complete: A: "Can I help you?"  B: "______" (You want a red schoolbag.)',
                          solution: '"I\'d like a red schoolbag, please."',
                          tip: '礼貌回答：I\'d like + 想要的东西 + please.'
                        }
                      ],
                      interaction: `🛍️ **"迷你小商店" Mini Shop Role-play**（约 10 分钟）

1. 把家里的文具、水果、零食摆成"小商店"，孩子当店员，家长当顾客（用英语）。
2. 完整演练："Can I help you?" → "I\'d like …" → "Here you are." → "How much is it?" → "It is … yuan."
3. 进阶：角色互换，孩子当顾客，家长当店员；加入"太贵了" "It is too expensive!" 的还价表达。
4. 挑战：用英语"买"3 件不同物品，计算总价并用英语报出。

💡 目的：在模拟购物情境中反复操练核心句型，让"Can I help you?"和"How much…?"变成自然反应。`,
                      exercises: [
                        { question: '"How much are the apples?" 问的是什么？', answer: '问苹果多少钱（价格）。', explanation: 'How much 用来询问价格。' },
                        { question: '用英语说：我想买一件 T 恤。', answer: "I'd like a T-shirt, please.", explanation: 'I\'d like + 名词 + please 是购物时的礼貌表达。' },
                        { question: '店员问你 "Can I help you?"，你想买一瓶牛奶，怎么回答？', answer: "Yes, I'd like a bottle of milk, please.", explanation: '先肯定回答 Yes，再用 I\'d like 说出想要的东西。' },
                        { question: '判断："How much is the shoes?" 对吗？', answer: '不对，shoes 是复数，应该说 "How much are the shoes?"', explanation: '复数名词用 are，单数用 is。' }
                      ]
                    }
                }
,
{
                    id: 'p-eng-036',
                    title: '阅读技巧',
                    description: '根据图片猜词义，关键词定位等阅读方法。',
                    funEmoji: '🎵',
                    funFact: 'The early bird catches the worm.',
                    funStory: '在英语学习的奇妙旅程中，阅读技巧就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有阅读技巧的影子，学好它会让你变得更加聪明能干！',
                    funQuestion: '关于「阅读技巧」，你能举出三个生活中的例子吗？',
                    funQuestionAnswer: '「阅读技巧」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！',
                    detailedExplanation: `
            **阅读技巧** 是英语学习的重要内容。根据图片猜词义，关键词定位等阅读方法。 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。
          `,
                    studyTips: [
                      '**从兴趣出发**：用生活中的实例引出阅读技巧，激发学习热情。',
                      '**分步渐进**：将阅读技巧拆解成小目标，每完成一步就及时鼓励。',
                      '**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。',
                    ],
                    practiceQuestions: [
                      { question: '「阅读技巧」的基本含义是什么？', answer: '（基础题）根据图片猜词义，关键词定位等阅读方法。' },
                      { question: '举一个生活中与「阅读技巧」相关的例子。', answer: '（提高题）结合实例，用自己的话描述概念。' },
                      { question: '如果你要向同学讲解「阅读技巧」，你会怎么说？', answer: '（挑战题）用简洁的语言说明它的核心要点。' },
                    ],
                    tutorialContent: {
                      objectives: [
                        'Can guess the meaning of new words from pictures, context clues and known words',
                        'Can find key information quickly by scanning for names, numbers and repeated words',
                        'Can read a short passage and answer "Who / What / Where" questions about it',
                        'Can follow a simple 4-step reading routine: predict → read → check → summarise'
                      ],
                      explanation: `Reading in English can feel scary when you meet new words — but you do not need to understand **every** word to get the main idea. Good readers use **strategies** (技巧) to work out meaning. Here are the most useful ones for primary school.

**Strategy 1: Use the pictures (看图猜词)**
Before you read, look at the pictures. They give you big clues about the topic. If the picture shows a park with a dog, the words "dog, park, run, ball" are probably coming.

**Strategy 2: Look for context clues (上下文线索)**
You do not need a dictionary for every word. Read the words around the new word — they often explain it. "The **giraffe** is a tall animal with a long neck." The sentence tells you what a giraffe is!

**Strategy 3: Find the keywords (关键词定位)**
When you need a specific fact, scan the text for keywords — names, numbers, dates, or words from the question. You do not have to read every line; just hunt for the keyword.

**Strategy 4: Predict → Read → Check → Summarise**
1. Predict: "What will this passage be about?" (look at the title and picture)
2. Read: read through once for the main idea.
3. Check: did your prediction match?
4. Summarise: say one sentence about what you read.

Real-life tip: read one short English story a week (a picture book or a graded reader) and try these four strategies.`,
                      examples: [
                        {
                          title: '基础：看图猜主题',
                          problem: 'A picture shows children eating cake and blowing candles. What is the passage probably about?',
                          solution: 'It is probably about a birthday party — the cake and candles are strong clues.',
                          tip: 'Pictures are your first clue — always look at them before reading.'
                        },
                        {
                          title: '进阶：用上下文猜词',
                          problem: 'Read: "The **koala** sleeps in a tree and eats leaves." What does "koala" probably mean?',
                          solution: 'A koala is an animal that lives in trees and eats leaves.',
                          tip: 'The words around "koala" (sleeps in a tree, eats leaves) tell you it is an animal.'
                        },
                        {
                          title: '挑战：用关键词定位答案',
                          problem: 'Question: "Where does Tom go on Sunday?" How do you find the answer fast?',
                          solution: 'Scan the text for "Tom" and "Sunday" — read only those sentences to find the place.',
                          tip: 'Keyword scanning saves time: look for names and time words from the question.'
                        }
                      ],
                      interaction: `📖 **"四步阅读冒险" 4-Step Reading Quest**（约 10 分钟）

1. 选一篇简短的英语绘本或分级读物（约 50–80 词）。
2. 第一步"预测"：看封面和插图，孩子用英语猜 "It is about …"
3. 第二步"阅读"：一起读一遍，遇到生词先看图和上下文猜，不急着查字典。
4. 第三步"核对"：读完核对预测对不对。
5. 第四步"总结"：孩子用 1–2 句英语说出故事大意。
6. 挑战：孩子用关键词定位法回答 3 个 Who / What / Where 问题。

💡 目的：把"阅读策略"变成可操作的固定步骤，让孩子面对英语短文时不再害怕生词。`,
                      exercises: [
                        { question: '遇到生词时，你应该先做什么？', answer: '先看图和上下文猜词义，不要立刻查字典。', explanation: '看图和上下文线索是首选的阅读策略。' },
                        { question: '问题问 "When does Lily go to school?"，你应该在文中找什么关键词？', answer: '找 "Lily" 和 "school"，以及时间相关的词。', explanation: '关键词定位法：找名字和问题中的核心词。' },
                        { question: '用一句话总结你最近读的一篇英语短文。', answer: '开放性题，如 "It is about a cat and a dog. They become friends."', explanation: '总结大意是阅读理解的重要能力。' },
                        { question: '判断：阅读时必须认识每一个单词才能理解大意。', answer: '不对，可以通过图片、上下文和关键词来猜大意。', explanation: '好的阅读者用策略猜词，而不是认识所有单词。' }
                      ]
                    }
                }
];
