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
                }
];
