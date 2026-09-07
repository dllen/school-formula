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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
                }
];
