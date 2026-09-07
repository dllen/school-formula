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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
                }
];
