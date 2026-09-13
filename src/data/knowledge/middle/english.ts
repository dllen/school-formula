/* eslint-disable no-useless-escape */
import type { KnowledgePoint } from '../../types';

export const english: KnowledgePoint[] = [
{
                    id: 'm-eng-001',
                    title: '时态语态',
                    description: '一般现在/过去/将来时，现在/过去进行时，现在完成时，被动语态。',
                    funEmoji: '⏰',
                    funFact: '英语有12种时态，但日常交流最常用的只有4种：一般现在时、一般过去时、一般将来时、现在完成时。',
                    funStory: '时态就是给动作贴上"时间标签"。"I eat"是现在吃，"I ate"是过去吃，"I will eat"是将来吃，"I have eaten"是已经吃了。英语用动词变形来表示时间，中文则加"了""着""过"。',
                    funQuestion: '为什么"I have seen this movie"不能加yesterday？',
                    funQuestionAnswer: '现在完成时表示过去发生的事对现在有影响，不能和具体过去时间连用。要说"I saw this movie yesterday"。',
                    detailedExplanation: `
            **六大时态结构**：
            - 一般现在时：do/does（表习惯、真理）。He often plays football.
            - 一般过去时：did（过去发生的动作）。I visited Beijing last year.
            - 一般将来时：will do / be going to do。I will study hard.
            - 现在进行时：am/is/are + doing（正在发生）。Look! They are playing.
            - 过去进行时：was/were + doing（过去某时正在发生）。I was reading at 8 last night.
            - 现在完成时：have/has + done（过去发生，对现在有影响）。I have finished my homework.

            **标志词**：often/usually→一般现在时；yesterday/last week→一般过去时；tomorrow/next year→一般将来时；now/look/listen→现在进行时；at that time→过去进行时；already/yet/since/for→现在完成时。

            **被动语态**：be + 过去分词（done），强调动作承受者。English is spoken all over the world. 各时态被动：was/were done（过去）；will be done（将来）；have/has been done（完成）。
          `,
                    studyTips: [
                        '学每个时态记三样东西：结构、时间标志词、一个典型例句。',
                        '现在完成时是难点：since + 时间点，for + 时间段；瞬间动词要换延续性动词（buy→have, die→be dead）。',
                        '被动语态先找"动作的承受者"做主语，注意时态体现在be动词上。'
                    ],
                    practiceQuestions: [
                        { question: 'Look! The children ____ (play) basketball on the playground.', answer: 'are playing（Look! 是现在进行时的标志）' },
                        { question: 'I ____ (live) in this city since 2015.', answer: 'have lived（since+时间点，用现在完成时）' },
                        { question: '把主动句 "Many people speak English." 改为被动语态。', answer: 'English is spoken by many people.' }
                    ],
                    tutorialContent: {
                      objectives: [
                        '能正确区分六种基本时态的结构和用法：一般现在时、一般过去时、一般将来时、现在进行时、过去进行时、现在完成时',
                        '会根据时间标志词（already, yesterday, now, since, tomorrow 等）快速判断句子应使用的时态',
                        '掌握宾语从句的陈述语序规则，能识别并改正疑问语序的错误',
                        '会正确运用被动语态（be + 过去分词），并体现在不同时态中'
                      ],
                      explanation: `时态是英语语法的骨架——它告诉我们动作在什么时间发生、进行到什么程度。

**六大基本时态的核心结构**：
- **一般现在时** do/does：表示习惯、经常做的事或客观真理。He often plays football.（often 是标志词）
- **一般过去时** did：表示过去某一时间发生的动作。I visited Beijing last year.（last year 是标志词）
- **一般将来时** will do / be going to do：表示将来要发生的事。I will study hard.（will 是标志词）
- **现在进行时** am/is/are + doing：表示此刻正在发生的事。Look! They are playing.（Look!/Listen! 是标志词）
- **过去进行时** was/were + doing：表示过去某一时刻正在发生的事。I was reading at 8 last night.（at that time 是标志词）
- **现在完成时** have/has + done：表示过去发生的事对现在有影响或从过去持续到现在的动作。I have finished my homework.（already/yet/since/for 是标志词）

**被动语态**：当我们需要强调动作的承受者而不是执行者时使用。结构为 **be + 过去分词**。be 动词体现时态：English is spoken all over the world.（一般现在时被动）；The work will be done tomorrow.（一般将来时被动）。`,
                      examples: [
                        {
                          title: '基础：根据标志词判断时态',
                          problem: 'Listen! The teacher ______ (explain) the grammar point on the blackboard.',
                          solution: 'is explaining。Listen! 说明此刻正在发生，用现在进行时 am/is/are + doing，主语 The teacher 是第三人称单数，填 is explaining。',
                          tip: 'Listen! / Look! 是现在进行时的强烈信号——"正在发生"。'
                        },
                        {
                          title: '进阶：现在完成时与一般过去时的辨析',
                          problem: 'We ______ (know) each other since we were children.（用所给动词的适当形式填空）',
                          solution: 'have known。since + 时间状语从句（since we were children）表示从过去持续到现在，用现在完成时 have/has + done，填 have known。',
                          tip: 'since + 时间点/从句，for + 时间段——两者都是现在完成时的"铁杆标志"。注意瞬间动词（如 buy, die）要换成延续性动词（have, be dead）。'
                        },
                        {
                          title: '挑战：主动句与被动语态的转换',
                          problem: '把主动句改为被动语态：Farmers grow tea in the south of China.',
                          solution: 'Tea is grown (by farmers) in the south of China. 步骤：①找宾语 tea → 变主语；②谓语 grow → 一般现在时被动 is grown；③原主语 farmers 变 by farmers（可省略）。',
                          tip: '变被动三步法："宾语提前当主语，be + done 改谓语，by + 执行者放最后"。'
                        }
                      ],
                      interaction: `🔍 **"时态侦探"剧本杀**（约 10 分钟）

1. 老师（或家长）准备一篇 5-6 句的"神秘日记"，故意在每句话里埋下不同的时态标志词，例如："I have lived in this town for five years. Yesterday I met my best friend. We were talking about our plans when it started to rain. Now I am writing about this happy day."
2. 学生默读日记，用笔圈出每个句子的谓语动词，判断它属于哪种时态，并在旁边标注结构（如 "have lived → 现在完成时 have/has done"）。
3. 学生尝试把日记中的 2-3 个主动句改成被动语态，体会被动语态在叙事中是否自然，讨论何时用被动更合适。
4. 讨论：为什么日记作者不全部用一种时态？不同时态让故事有了什么变化？

💡 目的：在真实语境中"看见"时态的存在意义，而不是孤立地背结构。`,
                      exercises: [
                        { question: '用所给动词的正确形式填空：She ______ (watch) TV when I called her last night.', answer: 'was watching', explanation: 'when I called 表示过去某一时刻，主句表示那个时刻正在发生的动作，用过去进行时 was/were + doing。' },
                        { question: '改错：He has went to Shanghai three times.', answer: 'has gone', explanation: '现在完成时结构为 have/has + 过去分词，go 的过去分词是 gone，不是 went（went 是过去式）。' },
                        { question: '翻译：我已经在这所学校学习了三年。', answer: 'I have studied at this school for three years.', explanation: 'for + 时间段（for three years）表示持续到现在，用现在完成时 have/has + done。' },
                        { question: '选择正确答案：— Have you ever been to Beijing? — Yes, I ______ there last summer. A. go B. went C. have gone D. will go', answer: 'B', explanation: 'last summer 是具体的过去时间，只能用一般过去时 went。现在完成时不能和具体的过去时间状语连用。' }
                      ]
                    }
                },
{
                    id: 'm-eng-002',
                    title: '从句',
                    description: '宾语从句，定语从句，状语从句。',
                    funEmoji: '🔗',
                    funFact: '从句就是"句子套句子"，像俄罗斯套娃。一个句子中可以嵌套多个从句，形成复杂的长难句。',
                    funStory: '英语从句就像拼乐高：主句是底板，从句是各种配件。定语从句是"形容词配件"，状语从句是"副词配件"，名词从句是"名词配件"。学会拼从句，就能造出任何句子！',
                    funQuestion: '"The book that I bought yesterday is interesting."中哪个是从句？',
                    funQuestionAnswer: '"that I bought yesterday"是定语从句，修饰book，说明是"我昨天买的那本书"。',
                    detailedExplanation: `
            **宾语从句**：在句中作宾语的从句。
            - 引导词：that（可省略）、if/whether（是否）、特殊疑问词（what, when, how...）。
            - **语序**：一律用陈述语序（主语+谓语）。✗ I don't know where is he. ✓ I don't know where he is.
            - **时态**：主句现在时，从句按实际；主句过去时，从句用相应的过去时态（客观真理除外）。

            **定语从句**：修饰名词的从句，被修饰的词叫先行词。
            - 关系代词：who/that（人）、which/that（物）、whose（……的）。
            - 例：The boy who is running is my brother. This is the book that I bought yesterday.

            **状语从句**：
            - 时间：when, while, before, after, until, as soon as（主将从现：If it rains tomorrow, we will stay at home. 时间/条件状语从句用一般现在时表将来）。
            - 条件：if, unless（除非= if not）。
            - 原因：because, since, as（because 不与 so 连用）。
            - 让步：although/though（不与 but 连用）。
            - 结果：so...that...（如此……以至于）。
          `,
                    studyTips: [
                        '宾语从句抓三点：引导词、陈述语序、时态呼应，其中"语序"是考试重灾区。',
                        '记住两组"不连用"：because × so；although × but。',
                        '"主将从现"：if/when/as soon as引导的条件、时间状语从句，主句将来时、从句现在时。'
                    ],
                    practiceQuestions: [
                        { question: '改错：Could you tell me where is the library?', answer: 'Could you tell me where the library is?（宾语从句用陈述语序）' },
                        { question: '翻译：如果明天不下雨，我们就去爬山。', answer: "If it doesn't rain tomorrow, we will go climbing.（主将从现）" },
                        { question: '改错：Although he is young, but he knows a lot.', answer: 'Although he is young, he knows a lot.（although不与but连用）' }
                    ],
                    tutorialContent: {
                      objectives: [
                        '能识别并正确使用三大从句的引导词（that/who/which/when/if/because 等）',
                        '掌握宾语从句的陈述语序，能识别并改正疑问语序的错误',
                        '理解"主将从现"规则，能在时间/条件状语从句中正确运用',
                        '能区分关系代词 who/which/whose 的用法，正确构建定语从句'
                      ],
                      explanation: `从句是英语长难句的核心。一个句子"套"进另一个句子，就形成了从句。从句不能独立存在，它依附于主句。

**三大从句的关键规则**：

**1. 宾语从句**——作宾语的从句。
- 引导词：that（陈述，可省略）、if/whether（是否）、特殊疑问词（what, when, how...）。
- **核心陷阱：陈述语序**。从句内部必须是"主语 + 谓语"，不能倒装。✗ I don't know where is he. ✓ I don't know where he is.
- 时态呼应：主句现在时，从句按实际需要；主句过去时，从句用相应的过去时（客观真理除外）。

**2. 定语从句**——修饰名词的从句。被修饰的词叫先行词。
- 关系代词：**who/that** 指人，**which/that** 指物，**whose** 表示"……的"。
- 例：The boy **who is running** is my brother. This is the book **(that) I bought** yesterday.

**3. 状语从句**——表示时间、条件、原因等。
- **"主将从现"**：if/when/as soon as 引导的条件、时间状语从句，主句用将来时，从句用一般现在时表将来。If it rains tomorrow, we will stay at home.
- **"不连用"规则**：because × so；although × but（中文可以说"虽然……但是"，英文只能用一个）。`,
                      examples: [
                        {
                          title: '基础：宾语从句的语序纠错',
                          problem: '改错：Could you tell me where is the hospital?',
                          solution: 'Could you tell me where the hospital is? 宾语从句必须用陈述语序（主语 + 谓语）。疑问句原语序是 where is the hospital，改为从句后变成 where the hospital is。',
                          tip: '判断方法：把 "Could you tell me" 遮住，剩下的部分如果是正常陈述句的语序就对了。'
                        },
                        {
                          title: '进阶：定语从句关系词的选择',
                          problem: '选用 who/which/whose 填空：The girl ______ hair is long is my sister. The pen ______ I bought yesterday is lost.',
                          solution: 'whose（The girl whose hair is long——whose 修饰 hair，表示“头发长长的那个女孩”）；which/which（The pen which/that I bought yesterday——先行词 pen 是物，用 which 或 that）。',
                          tip: '关系词的选择看先行词：人→who/that，物→which/that，需要"……的"→whose。'
                        },
                        {
                          title: '挑战：复合句中的时态与连词综合',
                          problem: '翻译：如果明天不下雨，我们就去公园放风筝。',
                          solution: "If it doesn't rain tomorrow, we will go to the park to fly a kite. 条件状语从句用一般现在时表将来（doesn't rain），主句用将来时（will go）。",
                          tip: '"主将从现"口诀：在 if / when / as soon as / until 引导的从句中，即使说的是将来，也用现在时。'
                        }
                      ],
                      interaction: `🔗 **"从句拆拆乐"小组挑战**（约 10 分钟）

1. 每组拿到 5 张卡片，每张写一个复合句（如："The boy who is singing is my friend." "I will call you when I arrive." "The book that you lent me is great."）。
2. 小组合作：用不同颜色的笔标出主句和从句，圈出引导词，判断从句类型（宾语/定语/状语）。
3. "拆句"挑战：把复合句拆成两个简单句（如 "The boy is singing. The boy is my friend."），再尝试用不同的引导词重新组合成新的复合句。
4. 每组展示一个最有创意的"新复合句"，全班投票选出最佳创意。

💡 目的：通过"拆解—重组"直观理解从句的嵌套结构，把抽象语法变成可操作的"积木游戏"。`,
                      exercises: [
                        { question: '改错：I want to know what is he doing now.', answer: 'I want to know what he is doing now.', explanation: '宾语从句用陈述语序，what 后面跟"主语 he + 谓语 is doing"。' },
                        { question: '用所给词的适当形式填空：When she ______ (come) back, I will tell her the news. A. come B. comes C. will came D. came', answer: 'B. comes', explanation: 'when 引导的时间状语从句用一般现在时表将来，主语 she 是第三人称单数，填 comes。' },
                        { question: '翻译：我喜欢那本你上周推荐给我的书。', answer: 'I like the book (that/which) you recommended to me last week.', explanation: '先行词 book 是物，定语从句用 that/which 引导，作宾语时可省略。' },
                        { question: '改错：Because he was ill, so he didn\'t go to school.', answer: 'Because he was ill, he didn\'t go to school. 或 He was ill, so he didn\'t go to school.', explanation: 'because 和 so 不能连用，保留其中一个即可。' }
                      ]
                    }
                },
{
                    id: 'm-eng-003',
                    title: '非谓语动词',
                    description: '动词不定式，动名词，分词。',
                    funEmoji: '🎯',
                    funFact: '非谓语动词是英语最特别的设计：一个动词"不做谓语"，而是当名词、形容词或副词用。全世界只有少数语言有这种设计！',
                    funStory: '想象动词是一个"演员"，谓语是"主角"，非谓语是"配角"。"I like to swim"中，like是主角（谓语），to swim是配角（宾语）。配角不能抢主角的戏，所以to swim不能做谓语。',
                    funQuestion: '"Swimming is fun"和"I am swimming"中的swimming一样吗？',
                    funQuestionAnswer: '不一样！前者是动名词（当名词用，表示"游泳这件事"），后者是现在分词（表示"正在游泳"）。',
                    detailedExplanation: `
            **动词不定式（to do）**：
            - 作宾语：want/hope/decide/plan + to do。I want to buy a book.
            - 作宾语补足语：ask/tell/want sb. to do sth. My mother tells me to study hard.
            - 使役动词和感官动词后省to：let/make/have sb. do；see/hear/watch sb. do。
            - 作目的状语：He gets up early to catch the bus.

            **动名词（doing）**：
            - 接动名词作宾语的动词：enjoy, finish, practice, mind, keep, suggest。I enjoy reading.
            - 固定搭配：be busy doing, look forward to doing, be used to doing, spend time doing。
            - 作主语：Reading is fun.

            **分词**：
            - 现在分词（doing）表主动、进行：The running boy is Tom.
            - 过去分词（done）表被动、完成：The book written by Lu Xun is famous.

            **易混辨析**：remember to do（记得要去做，未做）/ remember doing（记得做过，已做）；stop to do（停下来去做另一件事）/ stop doing（停止正在做的事）。
          `,
                    studyTips: [
                        '整理"接to do的动词"和"接doing的动词"两张清单，这是记忆的核心。',
                        '注意介词后面一律用doing：be good at doing, thank you for doing。',
                        '用"动作是否已发生"区分 remember/forget/stop 接 to do 与 doing。'
                    ],
                    practiceQuestions: [
                        { question: 'The teacher asked us ____ (finish) our homework on time.', answer: 'to finish（ask sb. to do sth.）' },
                        { question: 'I am looking forward to ____ (hear) from you soon.', answer: 'hearing（look forward to doing，to是介词）' },
                        { question: '辨析：Remember ____ (turn) off the lights when you leave.（提醒去做）', answer: 'to turn（remember to do 记得要去做，事情还没做）' }
                    ],
                    tutorialContent: {
                      objectives: [
                        '能区分动词不定式（to do）、动名词（doing）和分词（doing/done）的句法功能',
                        '掌握常见动词后接 to do 与 doing 的固定搭配（enjoy, finish, want, hope 等）',
                        '理解感官动词和使役动词后省略 to 的规则（see/hear/let/make sb. do）',
                        '辨析易混搭配的意义差异：remember to do / remember doing，stop to do / stop doing'
                      ],
                      explanation: `英语中，一个动词在句子里只能有一个当"谓语"。当动词要充当名词、形容词或副词的角色时，就必须"变身"为非谓语动词——它失去了谓语的时态人称变化能力，但获得了新的句法功能。

**三大非谓语的"身份"与"位置"**：

**1. 动词不定式（to do）**——常表示"目的、将来要做的事"。
- 作宾语：want / hope / decide / plan / afford + **to do**。I want to buy a book.
- 作宾补：ask / tell / want sb. **to do** sth. My mother tells me to study hard.
- 使役/感官动词后**省 to**：let / make / have sb. **do**；see / hear sb. **do**。I saw him cross the street.

**2. 动名词（doing）**——当名词用，表示"一件事"。
- 固定搭配：enjoy / finish / practice / mind / keep / suggest + **doing**。I enjoy reading.
- 介词后一律用 doing：be good at doing, thank you for doing, look forward to **doing**（to 是介词！）。

**3. 分词**——当形容词用。
- **现在分词 doing**：表主动、进行。The running boy is Tom.（跑着的那个男孩）
- **过去分词 done**：表被动、完成。The book written by Lu Xun is famous.（被鲁迅写的书）

**易混辨析**：
- remember **to do**（记得要去做，未做）/ remember **doing**（记得做过，已做）
- stop **to do**（停下来去做另一件事）/ stop **doing**（停止正在做的事）`,
                      examples: [
                        {
                          title: '基础：判断非谓语的形式',
                          problem: 'The teacher asked us ______ (finish) our homework before 8 p.m.',
                          solution: 'to finish。ask sb. to do sth. 是固定搭配，ask 后接带 to 的不定式作宾补。',
                          tip: 'ask / tell / want / would like 这四个词后面都是 sb. to do，看到它们就想到 to do。'
                        },
                        {
                          title: '进阶：动名词与介词后的 doing',
                          problem: 'She is looking forward to ______ (receive) your reply. 为什么填 receiving 而不是 to receive？',
                          solution: 'receiving。look forward to 中的 to 是介词（不是不定式符号），介词后面必须用 doing，所以是 receiving。',
                          tip: '判断 to 是介词还是不定式符号：介词 to 后接 doing（名词性），不定式 to 后接动词原形。常见介词 to：look forward to, be used to, pay attention to, make a contribution to。'
                        },
                        {
                          title: '挑战：易混辨析 remember to do / remember doing',
                          problem: 'Remember ______ (lock) the door when you leave. vs I remember ______ (lock) the door, so it must be locked now.',
                          solution: '第一空 to lock（记得要去锁门，还没锁）；第二空 locking（记得锁过门了，已经锁了）。',
                          tip: '口诀：to do 是"还没做，记得要去做"；doing 是"已经做过，记得做过"。同样的区别适用于 forget / stop / regret。'
                        }
                      ],
                      interaction: `🎭 **"动词变形记"角色扮演**（约 8 分钟）

1. 每人抽取一张"动词卡"（enjoy, finish, want, let, stop, remember）和一张"情境卡"（如"离开房间""收到礼物""看到朋友"）。
2. 两人一组，用抽到的动词和情境造两个句子：一个用 to do，一个用 doing（如果该动词两种都能接，如 stop/remember）。
3. 交换句子，搭档判断：这个句子的动作"做没做过"？如果判断错了，说明对意义的理解有偏差，互相纠正。
4. 全班投票：哪个组的句子最有创意且语法完全正确？

💡 目的：在趣味造句中体会 to do 与 doing 的"时态意义差"——一个指向未来，一个指向过去/习惯。`,
                      exercises: [
                        { question: '选择：My mother made me ______ (clean) my room yesterday. A. to clean B. cleaning C. clean D. cleaned', answer: 'C. clean', explanation: 'make sb. do sth. 是固定搭配，使役动词 make 后省略 to，接动词原形。' },
                        { question: '用所给动词的适当形式填空：I enjoy ______ (swim) in summer. Would you like ______ (join) us?', answer: 'swimming; to join', explanation: 'enjoy 后接 doing；would like 后接 to do。' },
                        { question: '翻译：我忘了告诉她这个消息了。（"忘了告诉"，当时没告诉她）', answer: "I forgot to tell her the news.", explanation: 'forget to do 表示"忘了要去做"（没做），符合"当时没告诉她"的语境。' },
                        { question: '改错：He stopped to smoke because it\'s bad for his health.', answer: 'He stopped smoking because it\'s bad for his health.', explanation: 'stop doing 表示"停止做某事"，stop to do 表示"停下来去做另一件事"。这里意思是"戒烟"，应该用 stopped smoking。' }
                      ]
                    }
                },
{
                    id: 'm-eng-004',
                    title: '词法综合',
                    description: '名词、冠词、代词、形容词副词、介词。',
                    funEmoji: '📖',
                    funFact: '英语中最长的单词是pneumonoultramicroscopicsilicovolcanoconiosis（硅肺病），共45个字母！不过日常交流中用得最多的词是"the"。',
                    funStory: '"I"永远大写——这是英语中唯一永远大写的单个字母。有人说这是因为古时候"i"写得小被忽略了，所以就大写了。小小的"i"变成了大大的"I"，提醒着我们：每个人都很重要！',
                    funQuestion: '"interesting"和"interested"有什么区别？',
                    funQuestionAnswer: '"interesting"（令人感兴趣的）修饰事物，"interested"（感兴趣的）修饰人。an interesting book（一本有趣的书），I am interested in the book（我对这本书感兴趣）。"-ing"修饰物，"-ed"修饰人。',
                    detailedExplanation: `
            **名词**：
            - 可数名词：有复数形式。规则变化：+s/+es（以s/x/sh/ch/o结尾+es）；辅音+y→ies；f/fe→ves。
            - 不规则复数：man→men, woman→women, child→children, foot→feet, tooth→teeth, mouse→mice, sheep→sheep, deer→deer。
            - 不可数名词：没有复数，用"量词+of"表示数量（a cup of water, two pieces of advice）。
            - 所有格：有生命的加"'s"（Tom's book）；无生命的用"of"（the door of the room）；共同所有在最后加"'s"（Tom and Jerry's room）；各自所有分别加"'s"（Tom's and Jerry's rooms）。

            **冠词**：
            - 不定冠词 a/an：a + 辅音音素开头（a book, a university）；an + 元音音素开头（an apple, an hour）。
            - 定冠词 the：特指、上文提到过、独一无二的事物（the sun）、乐器前（play the piano）。
            - 零冠词：球类运动前（play basketball）、三餐前（have breakfast）、by+交通工具（by bus）。

            **代词**：
            - 人称代词：主格（I/you/he/she/it/we/they）和宾格（me/you/him/her/it/us/them）。
            - 物主代词：形容词性（my/your/his...）+名词；名词性（mine/yours/his...）独立使用。
            - 反身代词：myself/yourself/himself... 常用于enjoy oneself, teach oneself, by oneself。
            - 不定代词：some/any（some用于肯定句，any用于否定和疑问）；both/all, either/any, neither/none的区别。

            **形容词和副词**：
            - 比较级和最高级：
              - 规则：单音节+er/est；以e结尾+r/st；辅音+y→ier/iest；双音节和多音节前加more/most。
              - 不规则：good/well→better→best; bad/badly→worse→worst; many/much→more→most; little→less→least; far→farther/further→farthest/furthest。
            - 常考句型：as...as（和...一样）；not as/so...as（不如）；比较级+and+比较级（越来越）；the+比较级, the+比较级（越...越...）；one of the+最高级+名词复数（最...之一）。

            **介词**：
            - 时间介词：in（年/月/季节/上午下午晚上）；on（具体日期/星期/早中晚前有修饰词）；at（具体时刻/正午/午夜）。
            - 地点介词：in（在...里面）；on（在...上面）；at（在...处，小地点）；between（两者之间）；among（三者或以上之间）；in front of（在...前面，外部）；in the front of（在...前面，内部）。
          `,
                    studyTips: [
                        '名词复数口诀："男人女人a变e，鹅牙脚双o变双e；孩子加上ren，鱼鹿绵羊不用记"。',
                        '冠词判断三步法：①特指用the；②第一次提到用a/an；③球类三餐零冠词。',
                        '比较级最高级口诀："两者比较用比较级，三者以上最高级；as as 中间用原级，than前面比较级"。'
                    ],
                    practiceQuestions: [
                        { question: '写出下列名词的复数：child, photo, knife, tomato, sheep。', answer: 'children, photos, knives, tomatoes, sheep' },
                        { question: '选择正确的冠词："I play __ piano every day and play __ basketball on weekends."', answer: 'the; 零冠词（play the piano; play basketball）' },
                        { question: '用所给词的适当形式填空：This book is __ (interesting) than that one. She is the __ (tall) girl in our class.', answer: 'more interesting; tallest' }
                    ],
                    tutorialContent: {
                      objectives: [
                        '掌握名词复数的规则与不规则变化，能正确区分可数与不可数名词',
                        '理解冠词 a/an/the 的用法，能根据语境选择正确的冠词或零冠词',
                        '掌握形容词、副词比较级和最高级的规则变化与不规则变化',
                        '能辨析易混介词（in/on/at, between/among）的用法差异'
                      ],
                      explanation: `词法是英语表达的"砖瓦"。掌握名词、冠词、形容词副词、介词的用法，才能搭出准确、地道的句子。

**名词**：
- **可数名词复数规则**：一般 +s；以 s/x/sh/ch/o 结尾 +es；辅音字母 + y → ies；f/fe → ves。
- **不规则复数要牢记**：man→men, woman→women, child→children, foot→feet, tooth→teeth, mouse→mice, sheep→sheep, deer→deer。
- **不可数名词**：没有复数形式，用"量词 + of"表示数量：a cup of water, two pieces of advice, a bottle of milk。

**冠词**：
- **a / an**：第一次提到、泛指。a + 辅音音素开头（a book, a university）；an + 元音音素开头（an apple, an hour, an honest boy）。
- **the**：特指、上文提到过、独一无二的事物（the sun, the weather）、乐器前（play the piano）。
- **零冠词**：球类运动（play basketball）、三餐（have breakfast）、by + 交通工具（by bus）。

**形容词和副词的比较级、最高级**：
- **规则**：单音节 +er/est（tall→taller→tallest）；以 e 结尾 +r/st；辅音 + y → ier/iest；双音节/多音节前加 more/most。
- **不规则（必背）**：good/well→better→best; bad/badly→worse→worst; many/much→more→most; little→less→least。
- **常考句型**：as...as（和……一样，中间用原级）；比较级 + and + 比较级（越来越……）；the + 比较级, the + 比较级（越……越……）。

**介词**：
- **时间**：in（年/月/季节/泛指早中晚）；on（具体日期/星期/特定早中晚）；at（具体时刻）。
- **地点**：between（两者之间）；among（三者或以上之间）；in front of（外部的前面）；in the front of（内部的前面）。`,
                      examples: [
                        {
                          title: '基础：名词复数与冠词',
                          problem: '写出复数并选择正确的冠词：There is ______ "u" and ______ "s" in the word "bus".',
                          solution: '冠词填 an 和 an。字母 u 读作 /juː/，以辅音音素开头，填 an？不对！注意：u 的发音是 /juː/，以辅音音素 /j/ 开头，所以用 a。s 读作 /es/，以元音音素开头，用 an。答案：a "u" and an "s"。',
                          tip: 'a / an 看的是"音素"不是"字母"。a university（/ˈjuː-/ 辅音开头），an hour（/aʊər/ 元音开头，h 不发音）。'
                        },
                        {
                          title: '进阶：比较级与最高级的运用',
                          problem: '用所给词的适当形式填空：Tom is ______ (tall) than Mike. Jim is the ______ (tall) of the three.',
                          solution: 'taller；taller（两者比较用比较级 taller）；tallest（三者或以上的最高级 tallest）。',
                          tip: '判断用比较级还是最高级：两者比较 → 比较级（常有 than）；三者及以上 → 最高级（常有 the ... of/in）。'
                        },
                        {
                          title: '挑战：介词的综合辨析',
                          problem: '选用 in/on/at/between/among 填空：The meeting is ______ 9:00 a.m. ______ Monday ______ May. The house stands ______ two tall trees.',
                          solution: 'at; on; in; between。at 9:00（具体时刻）；on Monday（星期）；in May（月份）；between two tall trees（两者之间）。',
                          tip: '时间介词口诀：in 大 on 具体 at 时刻。地点：两者 between，三者 among。'
                        }
                      ],
                      interaction: `🔍 **"词法寻宝"纠错大赛**（约 10 分钟）

1. 老师准备一篇"问题短文"（10 句左右），每句话故意埋了一个词法错误（名词复数、冠词、比较级、介词各 2-3 处）。例如："She is the taller girl in our class. I have two breads for breakfast. He plays the basketball every day."
2. 小组合作：在 5 分钟内找出尽可能多的错误，写出正确答案，并说明理由（如"taller → tallest，三者以上用最高级"）。
3. 各组交换答案，互相批改。每找对一处得 1 分，理由正确再加 1 分。
4. 讨论：哪类错误最常见？大家最容易混淆的是什么？（通常是 a/an、比较级/最高级、in/on/at）

💡 目的：在"找茬"中强化词法规则的敏感度，比单纯做选择题更能加深印象。`,
                      exercises: [
                        { question: '写出下列名词的复数：mouse, potato, leaf, deer, woman。', answer: 'mice, potatoes, leaves, deer, women', explanation: 'mouse→mice（不规则）；potato→potatoes（以 o 结尾的有生命物 +es）；leaf→leaves（f→ves）；deer→deer（单复同形）；woman→woman（不规则 a→e）。' },
                        { question: '选择正确的冠词："I have ______ dog and ______ cat. ______ dog is black and ______ cat is white."', answer: 'a; a; The; the', explanation: '第一次提到用 a（泛指），第二次提到用 the（特指）。' },
                        { question: '用所给词的适当形式填空：The Yangtze River is ______ (long) river in China. It\'s much ______ (long) than the Yellow River.', answer: 'the longest; longer', explanation: 'in China（三者以上范围）用最高级 the longest；than 提示两者比较用比较级 longer。' },
                        { question: '选用正确的介词：We usually have lunch ______ noon. My birthday is ______ October 5th.', answer: 'at; on', explanation: 'at noon（固定搭配，具体时刻）；on October 5th（具体日期）。' }
                      ]
                    }
                },
{
                    id: 'm-eng-005',
                    title: '情景交际',
                    description: '问候、问路、购物、就医等日常交际用语。',
                    funEmoji: '🗣️',
                    funFact: '英语中"How are you?"其实不期待你真的回答身体状况。它更像中文的"你好"，标准回答是"Fine, thanks. And you?"——这是约定俗成的社交礼仪。',
                    funStory: '一个中国学生初到美国，别人问他"How are you?"他停下来认真地说："I have a headache and..."对方一脸困惑。其实美国人只是打个招呼，不需要你真的汇报健康状况！',
                    funQuestion: '别人说"Thank you"，下面哪个回答是错误的？You\'re welcome / That\'s right / Not at all / My pleasure',
                    funQuestionAnswer: '"That\'s right"是错误的。"That\'s right"意思是"你说得对"，不是对感谢的回应。正确回答：You\'re welcome / Not at all / My pleasure / That\'s OK。',
                    detailedExplanation: `
            **常用交际用语分类**：

            **问候与介绍**：
            - 问候：Hello/Hi! Good morning/afternoon/evening. How are you? How's it going? What's up?
            - 回答：Fine, thanks. And you? / Very well, thank you. / Not bad.
            - 介绍：This is... / Nice to meet you. / How do you do?

            **问路与指路**：
            - 问路：Excuse me, where is...? / How can I get to...? / Can you tell me the way to...? / Is there a... near here?
            - 指路：Go straight (along)... / Turn left/right at... / It's on your left/right. / It's next to/across from/opposite... / You can't miss it.

            **购物**：
            - 店员：Can I help you? / What can I do for you? What size/color would you like?
            - 顾客：I'm looking for... / Can I try it on? How much is it? That's too expensive. Do you have a discount?

            **打电话**：
            - 接通：Hello, this is... speaking. / May I speak to...?
            - 接听：Speaking. / Hold on, please. / Sorry, he/she isn't in right now. Can I take a message?

            **就餐**：
            - 点餐：May I have the menu? / I'd like... / What would you recommend?
            - 付款：Can I have the bill, please? / Go Dutch (AA制)。

            **就医**：
            - 医生：What's the matter/wrong with you? How long have you been like this? Have you taken your temperature?
            - 患者：I have a headache/fever/cough. I feel terrible. It hurts here.

            **建议与劝告**：
            - 提建议：Why not...? Why don't you...? What/How about...? You'd better... Let's...
            - 应答：Good idea! That sounds great. I'd love to, but... Sorry, I can't.

            **感谢与道歉**：
            - 感谢：Thank you (very much). Thanks a lot. It's very kind of you.
            - 回答：You're welcome. That's all right. My pleasure. Not at all.
            - 道歉：Sorry. I'm sorry. Excuse me.
            - 回答：It doesn't matter. That's OK. Never mind.
          `,
                    studyTips: [
                        '交际用语不需要逐字翻译，要记固定搭配。比如"怎么了？"不是"What are you doing?"而是"What\'s the matter?"。',
                        '中英文化差异：中国人被夸奖说"哪里哪里"，英语应说"Thank you"；中国人说"不用谢"是"Don\'t mention it"，英语常用"You\'re welcome"。',
                        '做题技巧：先看对话场景（问路/购物/打电话），再匹配该场景的常用句型。'
                    ],
                    practiceQuestions: [
                        { question: '你想问去火车站的路，应该怎么问？（写出两种表达）', answer: '"Excuse me, can you tell me the way to the railway station?" 或 "How can I get to the railway station?"' },
                        { question: '别人说"I\'m sorry I broke your cup."你应该怎么回答？', answer: '"It doesn\'t matter." 或 "Never mind." 或 "That\'s OK."' },
                        { question: '在餐厅你想点一份汉堡和一杯橙汁，怎么说？', answer: '"I\'d like a hamburger and a glass of orange juice, please." 或 "Can/May I have a hamburger and some orange juice?"' }
                    ],
                    tutorialContent: {
                      objectives: [
                        '能根据场景（问路、购物、打电话、就医等）选择得体的交际用语',
                        '掌握中英文化差异下的交际习惯（回应感谢、接受赞美、拒绝邀请等）',
                        '理解交际用语的"约定俗成"，避免逐字翻译',
                        '能在真实情境中进行简单的英语对话（问路、点餐、打电话）'
                      ],
                      explanation: `英语交际用语最大的特点是"约定俗成"——很多表达不能逐字翻译，而是要记住整个"语块"（chunk）。

**高频场景用语速查**：

**问路与指路**：
- 问：Excuse me, where is the nearest hospital? / How can I get to the railway station? / Is there a bank near here?
- 指：Go straight along this road. Turn left/right at the traffic lights. It\'s on your left/right. It\'s next to / across from the park.

**购物**：
- 店员：Can I help you? / What can I do for you? What size / color would you like?
- 顾客：I\'m looking for a sweater. Can I try it on? How much is it / are they? Do you have a discount?

**打电话**：
- 接通：Hello, this is Tom speaking. / May I speak to Lucy?
- 接听：Speaking. / Hold on, please. / Sorry, she isn\'t in. Can I take a message?

**就医**：
- 医生：What\'s the matter / wrong with you? How long have you been like this?
- 患者：I have a headache / fever / cough. I feel terrible. It hurts here.

**感谢与道歉**：
- 感谢：Thank you (very much). / Thanks a lot. / It\'s very kind of you.
- 回应：You\'re welcome. / My pleasure. / Not at all. / That\'s OK.
- 道歉：Sorry. / I\'m sorry. / Excuse me.（打扰别人前用）
- 回应：It doesn\'t matter. / That\'s OK. / Never mind.

**文化差异提醒**：
- 中国人被夸奖常说"哪里哪里"，英语应说 "Thank you"。
- "How are you?" 是打招呼，标准回答 "Fine, thanks. And you?" 不需要真的汇报身体状况。`,
                      examples: [
                        {
                          title: '基础：选择得体的交际用语',
                          problem: '你想问去邮局的路，下面哪个问法最得体？A. Where is the post office? B. Excuse me, can you tell me the way to the post office? C. How far is the post office?',
                          solution: 'B 最得体。Excuse me 开头表示礼貌，"can you tell me the way to..." 是问路的标准句型。A 缺少礼貌用语，C 问的是距离不是路线。',
                          tip: '问路三步曲：Excuse me（引起注意）→ 问路句型 → Thank you（感谢）。'
                        },
                        {
                          title: '进阶：回应感谢与赞美',
                          problem: '别人夸奖你 "Your English is very good!" 你应该怎么回答？A. No, no, my English is poor. B. Thank you. C. Where, where.',
                          solution: 'B. Thank you. 英语中接受赞美用 Thank you，不需要谦虚否定。A 和 C 是中文式回答。',
                          tip: '英语回应赞美万能公式："Thank you + 一句谦虚的补充"，如 "Thank you. I\'m still learning."'
                        },
                        {
                          title: '挑战：打电话情境综合',
                          problem: '你想打电话给 Lucy，接电话的是她妈妈。请写出完整的 4 句对话。',
                          solution: '"Hello, this is Tom speaking. May I speak to Lucy?" — "Hold on, please." / "Sorry, she isn\'t in right now. Can I take a message?" — "Yes, please. Could you ask her to call me back?" — "Sure. What\'s your number?"',
                          tip: '打电话公式：接通（This is ... speaking. May I speak to ...?）→ 接听（Speaking / Hold on / isn\'t in）→ 留言（Can I take a message?）→ 结束（Thank you. Goodbye.）。'
                        }
                      ],
                      interaction: `🎬 **"情景剧场"角色扮演**（约 10 分钟）

1. 每组抽取一个场景卡（问路、购物、打电话、就医、餐厅点餐）。
2. 小组用 3 分钟准备一个 1-2 分钟的短剧，必须包含至少 4 个该场景的核心句型。
3. 表演时，其他组当"评委"：①听发音和语调 ②看用语是否得体（有没有"中文式英语"）③看对话是否流畅。
4. 表演结束后，老师/家长随机提问："如果对方没有听清楚，你怎么重复？"（如 "Could you repeat that, please?" / "Pardon?"）

💡 目的：把"背句型"变成"用句型"，在表演中内化交际用语，同时暴露并纠正中式英语。`,
                      exercises: [
                        { question: '你想借同学的橡皮，应该怎么问？（写出两种表达）', answer: '"Could I borrow your eraser?" 或 "Can I use your eraser, please?" 或 "Would you mind lending me your eraser?"', explanation: '借东西常用 Could I... / Can I... / Would you mind doing... 句型，加上 please 更礼貌。' },
                        { question: '别人说 "Happy birthday to you!" 你应该怎么回答？', answer: '"Thank you (very much)."', explanation: '英语中回应生日祝福用 Thank you，不需要谦虚。' },
                        { question: '在超市，店员对你说 "Can I help you?" 你想买一双运动鞋，怎么回答？', answer: '"Yes, I\'m looking for a pair of sports shoes." 或 "Yes, I\'d like to buy a pair of sports shoes, please."', explanation: '"Can I help you?" 是店员招呼顾客的标准用语，回答 Yes 并说明你要买什么。' },
                        { question: '你迟到了，进教室时应该对老师说什么？', answer: '"Sorry I\'m late." 或 "I\'m sorry for being late, Mr./Ms. ..."', explanation: '迟到时先道歉（Sorry / I\'m sorry），可加上原因（如 the bus was late）。Excuse me 用于打扰别人前，不适合道歉迟到。' }
                      ]
                    }
                },
{
                    id: 'm-eng-006',
                    title: '阅读理解',
                    description: '阅读策略、题型解法与解题步骤。',
                    funEmoji: '📚',
                    funFact: '研究表明，英语阅读时眼睛不是逐字移动的，而是"跳跃"式前进（叫"眼跳"saccades），每次跳跃约7-9个字母。这就是为什么阅读速度可以通过训练提升！',
                    funStory: '阅读理解最怕遇到生词。但你知道吗？即使一篇文章有10%的生词，你仍然能理解大意。遇到生词不要慌——跳过它，根据上下文猜测，或者看前后缀推断词义。阅读高手不是没有生词，而是不被生词卡住！',
                    funQuestion: '做阅读理解时，应该先读文章还是先看题目？',
                    funQuestionAnswer: '两种方法各有优劣：①先看题目再读文章——带着问题找答案，效率高；②先快速浏览全文再看题目——把握主旨，适合主旨题。建议：快速浏览（30秒了解大意）→ 看题目 → 带着问题细读相关段落。',
                    detailedExplanation: `
            **阅读策略**：
            - **略读（Skimming）**：快速浏览全文，抓住主旨大意。重点读首段、末段、每段首句。
            - **寻读（Scanning）**：带着特定问题快速查找具体信息（时间、地点、数字、人名）。
            - **精读（Intensive Reading）**：仔细阅读关键段落，理解深层含义。

            **四大题型及解法**：

            **1. 细节理解题**（最常见）：
            - 提问方式：What/When/Where/Who/How...? According to the passage...?
            - 解法：定位法。根据题目关键词回到原文找到对应句子，答案往往是对原文的同义转换。
            - 注意：不要凭常识答题，一切以原文为准。

            **2. 词义猜测题**：
            - 提问方式：The word "..." probably means... / The underlined word refers to...
            - 解法：①根据上下文逻辑（因果/并列/转折）；②根据构词法（前缀/后缀/词根）；③根据定义或解释（破折号/同位语/that is等）。

            **3. 推理判断题**：
            - 提问方式：What can we learn/infer from...? What does the writer think...?
            - 解法：答案不会直接出现在原文中，需要根据已知信息推断。注意：推理要基于原文，不能过度推断。

            **4. 主旨大意题**：
            - 提问方式：What's the main idea of...? The passage is mainly about...? The best title for...?
            - 解法：找主题句（首段首句/末句，各段首句）。主旨题的选项要"大小合适"——不能太宽也不能太窄。

            **解题步骤**：
            1. 快速浏览全文（30秒），了解大意和结构。
            2. 读题目，划关键词。
            3. 带着问题回到原文定位。
            4. 对比选项，排除干扰项。
            5. 检查答案是否符合原文。
          `,
                    studyTips: [
                        '"同义转换"是阅读理解的核心技巧。正确答案往往不是照抄原文，而是用不同的词表达相同的意思。',
                        '排除法：排除①与原文矛盾的选项 ②原文未提及的选项 ③过于绝对的选项（always/never/all）。',
                        '限时训练：每篇阅读理解控制在6-8分钟。平时练习计时，培养时间意识。'
                    ],
                    practiceQuestions: [
                        { question: '做细节理解题时，找到原文对应句子后还需要注意什么？', answer: '注意"同义转换"。正确选项往往不是照抄原文，而是用不同意思的词表达相同意思。同时注意干扰项：张冠李戴、偷换概念、无中生有。' },
                        { question: '遇到生词"uncomfortable"，如何通过构词法猜测词义？', answer: 'un-（否定前缀）+ comfort（舒适）+ -able（形容词后缀）= 不舒服的。' },
                        { question: '主旨大意题的选项有什么特点？如何排除错误选项？', answer: '正确选项：大小适中，能概括全文。错误选项：①太宽（超出文章范围）②太窄（只涉及某一段）③与原文无关。排除太宽太窄的选项。' }
                    ],
                    tutorialContent: {
                      objectives: [
                        '掌握阅读理解的三大策略：略读（skimming）、寻读（scanning）、精读（intensive reading）',
    '能根据题型（细节/词义/推理/主旨）选择对应的解题方法',
                        '理解"同义转换"是正确答案的常见呈现方式',
                        '能运用排除法排除干扰项（太宽、太窄、与原文矛盾、未提及）'
                      ],
                      explanation: `阅读理解不是"逐字翻译"，而是"有目的地获取信息"。掌握策略比认识每个单词更重要。

**三大阅读策略**：
- **略读（Skimming）**：快速浏览全文，抓住主旨大意。重点读标题、首段、末段、每段首句。用时 30 秒 - 1 分钟。
- **寻读（Scanning）**：带着特定问题快速查找具体信息（时间、地点、数字、人名）。不需要读完全文，像"扫描"一样找关键词。
- **精读（Intensive Reading）**：仔细阅读关键段落，理解深层含义和作者态度。用于推理题和词义猜测题。

**四大题型解法**：

**1. 细节理解题**（最常考）：
- 解法：定位法。根据题目关键词回到原文找对应句子。**关键：正确答案往往是原文的同义转换**，不是照抄原文。

**2. 词义猜测题**：
- 解法：①上下文逻辑（因果/并列/转折）；②构词法（前缀 un-/dis- 表否定，后缀 -less 表"没有"）；③定义或解释（破折号、同位语、that is）。

**3. 推理判断题**：
- 解法：答案不会直接出现在原文中，要基于已知信息推断。**注意：推理要"贴着原文走"，不能过度推断。**

**4. 主旨大意题**：
- 解法：找主题句（首段首句/末句，各段首句）。选项要"大小合适"——不能太宽也不能太窄。

**排除法口诀**：与原文矛盾的一定错，原文未提及的一定错，太宽太窄的不选。`,
                      examples: [
                        {
                          title: '基础：细节题的定位与同义转换',
                          problem: '原文："More and more people like riding bikes in the city." 题目：Which is TRUE? A. Few people ride bikes. B. Riding bikes is becoming popular in cities. C. People only ride bikes in the countryside.',
                          solution: 'B。原文 "More and more people like riding bikes in the city" 与 B 选项 "Riding bikes is becoming popular in cities" 是同义转换（More and more = becoming popular, like = popular）。A 与原文矛盾，C 原文未提及。',
                          tip: '细节题的"陷阱"：张冠李戴（把 A 的特征安到 B 头上）、偷换概念（把"有些"换成"所有"）、无中生有。'
                        },
                        {
                          title: '进阶：构词法猜测词义',
                          problem: '猜测 "uncomfortable" 的意思。',
                          solution: 'un-（否定前缀）+ comfort（舒适）+ -able（形容词后缀，表示"可以……的"）= 不舒服的。',
                          tip: '常见否定前缀：un-, dis-, im-, in-, ir-, non-。常见后缀：-less（没有），-ful（充满），-able/-ible（可以……的）。'
                        },
                        {
                          title: '挑战：主旨题的排除法',
                          problem: '一篇关于"如何保护眼睛"的文章，下面哪个是最合适的标题？A. Eyes  B. How to Protect Our Eyes  C. Doing Eye Exercises',
                          solution: 'B。A 太宽（只说"眼睛"，没有提到保护）；C 太窄（做眼操只是保护眼睛的一个方面）；B 大小适中，能概括全文。',
                          tip: '主旨题"大小合适"原则：正确选项 = 主题 + 范围/目的。太宽 = 只有主题没有范围，太窄 = 只有细节没有主题。'
                        }
                      ],
                      interaction: `📰 **"阅读侦探社"限时挑战**（约 10 分钟）

1. 每组拿到一篇短文（150-200 词）和 4 道题（细节、词义、推理、主旨各一道）。
2. 限时 6 分钟完成，要求：①在原文中划出每道题的依据（细节题划原句，推理题划推理依据）②在选项旁标注排除理由（如"太宽""未提及"）。
3. 时间到后交换批改，讨论争议题：为什么选 A 不选 B？依据在原文哪里？
4. 老师总结：这次练习中，哪种题型错误率最高？原因是什么？

💡 目的：限时训练培养时间意识，"划依据"的习惯让解题过程可视化，避免凭感觉做题。`,
                      exercises: [
                        { question: '做细节理解题时，找到原文对应句子后，为什么还要注意"同义转换"？', answer: '因为正确答案往往不是照抄原文，而是用不同的词表达相同的意思。如果选项和原文"一模一样"，反而可能是干扰项（张冠李戴）。', explanation: '命题人常用同义转换来考查学生是否真正理解了原文，而不是机械地"找相同词"。' },
                        { question: '猜测词义 "disappear"：A. appear B. not appear C. become happy D. run away', answer: 'B. not appear', explanation: 'dis- 是否定前缀，appear 是"出现"，disappear = 不出现 = 消失。' },
                        { question: '一篇关于"青少年如何与父母沟通"的文章，下面哪个标题最合适？A. Parents B. Teenagers C. How Teenagers Can Communicate Better with Parents D. Having a Family Meeting', answer: 'C', explanation: 'A 和 B 太宽，D 太窄（开家庭会只是沟通的一种方式），C 大小适中，涵盖主题和范围。' },
                        { question: '推理判断题的答案能不能在原文中直接找到？为什么？', answer: '不能。推理判断题需要根据原文已知信息进行合理推断，答案隐含在字里行间，不会直接陈述。但推断必须基于原文，不能过度推断。', explanation: '区分"细节题"和"推理题"：细节题答案在原文中有直接对应，推理题需要"多想一步"。' }
                      ]
                    }
                },
{
                    id: 'm-eng-007',
                    title: '书面表达',
                    description: '邮件、通知、日记、话题作文的写作方法。',
                    funEmoji: '✉️',
                    funFact: '英语作文评分中"卷面分"很重要！研究表明，书写工整的作文平均比内容相同但字迹潦草的作文高3-5分。',
                    funStory: '中考英语作文评分先看"要点是否齐全"，再看"语言是否准确"，最后看"行文是否连贯"。很多同学一上来就写，结果漏了要点——先列提纲、检查要点，比急着动笔更重要！',
                    funQuestion: '英语作文开头有哪些好的方式？',
                    funQuestionAnswer: '①开门见山直接点题 ②引用名言/谚语 ③提问开头引起兴趣 ④描述场景/背景 ⑤用数据/事实开头。注意：开头要简洁，2-3句话后进入正题。',
                    detailedExplanation: `
            **写作步骤**：
            1. 审题：确定文体、时态、人称、要点。
            2. 列提纲：开头（点题）→ 主体（分点展开）→ 结尾（总结/感想）。
            3. 写作：使用熟悉的句型和词汇，注意连接词。
            4. 检查：要点齐全？时态一致？主谓一致？拼写正确？字数达标？

            **万能句型与过渡词**：
            - 开头：Nowadays... / As we all know... / It is important to... / I'd like to tell you about...
            - 顺序：First(ly)... Second(ly)... Third(ly)... Besides... What's more... Finally...
            - 转折：However... / But... / On the other hand...
            - 因果：Because... So... As a result... Therefore...
            - 总结：In a word... In my opinion... All in all... As for me...

            **文体格式**：
            - **邮件/书信**：Dear... → 正文（分段）→ Best wishes/Yours sincerely → 署名。
            - **通知**：标题（Notice/NOTICE）→ 正文（时间、地点、事件、要求）→ 落款（单位+日期）。
            - **日记**：日期+天气（右上角）→ 正文（一般过去时，第一人称）。
            - **话题作文**：三段式——引入话题→论述观点（2-3个理由/例子）→总结升华。

            **高分技巧**：
            - 句式多变：简单句+复合句交替使用。
            - 适当使用高级词汇：important→significant; very→extremely/quite; good→excellent/wonderful。
            - 使用定语从句、状语从句增加亮点。
            - 字数要求：一般80-100词。

            **常见错误**：
            - 时态混乱：记叙文用过去时，说明文用一般现在时，计划用将来时。
            - 主谓不一致：He like...（错误）→ He likes...（正确）。
            - 中文式英语：very like → like...very much。
            - 拼写错误：because, February, Wednesday, environment 等易错词。
          `,
                    studyTips: [
                        '"三步写作法"：①列要点（2分钟）②写草稿（8分钟）③检查修改（2分钟）。检查清单：要点？时态？拼写？字数？',
                        '"一句多译"练习：同一个意思用不同的句型表达，考场上灵活替换。如"我喜欢英语"：I like English. / I am fond of English. / English is my favorite subject.',
                        '背诵5-8个万能开头和结尾句型，考场上直接套用，节省时间又保证质量。'
                    ],
                    practiceQuestions: [
                        { question: '写一篇80词左右的英语短文，介绍你的好朋友（包括：姓名、年龄、外貌、爱好、你们常一起做的事）。', answer: '写作要点：①开头点题（I have a good friend. His/Her name is...）②中间分点（外貌+爱好+活动）③结尾感想（We are good friends. I like him/her very much.）。注意用一般现在时，第三人称单数动词加s。' },
                        { question: '下面作文开头有什么问题？"How are you? I\'m writing to tell you about my school life."（题目要求：介绍学校生活）', answer: '问题：开头多余了"How are you?"。这是书信格式，但题目没有要求书信。应直接点题："Let me tell you about my school life." 或 "I\'d like to share my school life with you."' },
                        { question: '请用两种不同的句型表达"我们应该保护环境"。', answer: '"We should protect the environment." / "It is our duty to protect the environment." / "We are supposed to protect the environment."（写出任意两种即可）' }
                    ],
                    tutorialContent: {
                      objectives: [
                        '掌握英语写作的四步法：审题→列提纲→写作→检查',
                        '能根据文体（邮件、通知、日记、话题作文）选择正确的格式和时态',
                        '学会使用连接词和过渡句使文章连贯',
                        '能运用"一句多译"技巧，使句式多样化'
                      ],
                      explanation: `英语作文不是"凑字数"，而是"有结构地表达思想"。掌握写作流程和万能句型，考场上就能从容应对。

**四步写作法**：
1. **审题**：确定文体、时态、人称、要点（不要漏要点！要点齐全是评分第一关）。
2. **列提纲**：开头（点题）→ 主体（分点展开）→ 结尾（总结/感想）。2 分钟即可。
3. **写作**：使用熟悉的句型和词汇，注意连接词，句式要有变化（简单句 + 复合句交替）。
4. **检查**：要点齐全？时态一致？主谓一致？拼写正确？字数达标（一般 80-100 词）？

**万能过渡词**：
- 顺序：First(ly)... Second(ly)... Besides... What\'s more... Finally...
- 转折：However... / But... / On the other hand...
- 因果：Because... So... As a result... Therefore...
- 总结：In a word... In my opinion... All in all... As for me...

**文体格式要点**：
- **邮件/书信**：Dear... → 正文（分段）→ Best wishes / Yours sincerely → 署名。
- **通知**：标题 NOTICE（居中）→ 正文（时间、地点、事件、要求）→ 落款（单位 + 日期）。
- **日记**：日期 + 天气（右上角）→ 正文（一般过去时，第一人称）。
- **话题作文**：三段式——引入话题 → 论述观点（2-3 个理由/例子）→ 总结升华。

**高分亮点**：
- 句式多变：适当使用定语从句、状语从句增加亮点。
- 高级词汇替换：important → significant; very → extremely / quite; good → excellent / wonderful; like → be fond of / enjoy。`,
                      examples: [
                        {
                          title: '基础：选择合适的开头和结尾',
                          problem: '题目：以"My Best Friend"为题写一篇短文。请写出开头句和结尾句。',
                          solution: '开头（开门见山）：I have a good friend. Her name is Li Hua. / My best friend is Li Hua, who has helped me a lot. 结尾（总结感想）：We are good friends and I like her very much. / I am lucky to have such a good friend.',
                          tip: '开头 1-2 句话点题即可，不要铺垫太长。结尾回到主题，表达感受或希望。'
                        },
                        {
                          title: '进阶：使用连接词使文章连贯',
                          problem: '把下面三个句子用连接词串成一段连贯的文字：①I like reading. ②I read books every day. ③Reading opens up a new world for me.',
                          solution: 'I like reading very much, so I read books every day. What\'s more, reading opens up a new world for me. / I like reading. I read books every day because reading opens up a new world for me.',
                          tip: '连接词让句子之间的关系更清晰：and（并列）、but（转折）、because（因果）、so（结果）、What\'s more（递进）。'
                        },
                        {
                          title: '挑战：一句多译，句式升级',
                          problem: '把"我喜欢英语，因为它很有趣"改写成三种不同的高级表达。',
                          solution: '①I like English because it is very interesting.（基础：because 引导原因状语从句）②I am fond of English because of its interest.（进阶：be fond of + because of）③The reason why I like English is that it is very interesting.（高级：The reason why... is that... 句型）',
                          tip: '"一句多译"是提升作文档次的秘诀。同一个意思，用简单句、复合句、高级句型各说一遍，考场上选最有把握的。'
                        }
                      ],
                      interaction: `✍️ **"作文诊所"互评互改**（约 10 分钟）

1. 每人写一段 50 词左右的短文（题目："My Favorite Season"），限时 5 分钟。
2. 同桌交换，当"小医生"用红笔批改：①圈出拼写和语法错误 ②划出好词好句（用波浪线）③在旁边写一句建议（如"这里可以用一个定语从句"）。
3. 返回本人，根据批改意见修改，再誊写一遍"定稿"。
4. 展示环节：每组选一篇"最佳定稿"投到大屏幕，全班一起欣赏好词好句。

💡 目的："互评"让学生从阅卷老师的角度看作文，既学会检查自己的错误，也学会欣赏和学习同学的好表达。`,
                      exercises: [
                        { question: '以"My Hobbies"为题写一篇 80 词左右的短文，要求：①介绍你的爱好（至少两个）②说明你为什么喜欢它们③你的感受。', answer: '参考要点：①开头（My hobbies are reading and swimming.）②主体（I like reading because it opens up my mind. I also enjoy swimming because it keeps me healthy. ...）③结尾（These hobbies make my life colorful and meaningful.）。注意用一般现在时。', explanation: '写作框架：开头点题 → 分点展开（每个爱好一句话原因）→ 结尾升华。注意连接词（and, also, because）和句式变化。' },
                        { question: '下面作文结尾有什么问题？"My school life is very happy. I like my school. The food is delicious."', answer: '问题：结尾跑题了。"The food is delicious"与"学校生活快乐"的主题无关，属于偏离主题的废话。应改为与主题相关的总结句，如"I am thankful for my wonderful school life."', explanation: '结尾要"扣题"——每句话都要围绕主题，不要突然跳到无关的话题上。' },
                        { question: '用"the reason why... is that..."句型翻译：我喜欢夏天的原因是我可以去游泳。', answer: 'The reason why I like summer is that I can go swimming.', explanation: '"The reason why + 从句 + is that + 从句"是表达原因的高级句型，比 because 更正式。' },
                        { question: '通知的格式需要注意什么？请以"英语演讲比赛"为题写一个通知的开头。', answer: '通知格式：①标题 NOTICE 居中（全部大写）②正文写清时间、地点、事件、要求③落款写单位名和日期（右下角）。示例：NOTICE  We are going to have an English speech competition. It will be in the school hall at 3 p.m. this Friday. ...', explanation: '通知不用 Dear 开头，不用 Best wishes 结尾，用简洁明了的语言传达信息。' }
                      ]
                    }
                }
];
