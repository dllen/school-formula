import type { Question, Tutorial } from './types';

const choice = (id: string, question: string, options: string[], answer: string, explanation: string, difficulty: Question['difficulty'] = 'easy'): Question => ({ id, type: 'choice', question, options, answer, explanation, difficulty });
const fill = (id: string, question: string, answer: string | string[], explanation: string, difficulty: Question['difficulty'] = 'easy'): Question => ({ id, type: 'fill', question, answer, explanation, difficulty });
const truefalse = (id: string, question: string, answer: '对' | '错', explanation: string, difficulty: Question['difficulty'] = 'easy'): Question => ({ id, type: 'truefalse', question, answer, explanation, difficulty });
const solve = (id: string, question: string, answer: string, explanation: string, difficulty: Question['difficulty'] = 'medium'): Question => ({ id, type: 'solve', question, answer, explanation, difficulty });

export const MIDDLE_ENGLISH_TUTORIALS: Tutorial[] = [
  {
    id: 'middle-eng-7',
    grade: '7',
    gradeName: '七年级',
    subject: '英语',
    subjectIcon: '🔤',
    title: '七年级英语',
    description: '时态语态、从句、非谓语动词、词法综合、情景交际、阅读理解、书面表达。',
    units: [
      {
        id: 'm-eng-7-u1',
        order: 1,
        title: '时态语态',
        duration: '约 45 分钟',
        objectives: ['能正确区分六种基本时态的结构和用法', '会根据时间标志词快速判断句子应使用的时态', '会正确运用被动语态（be + 过去分词）'],
        teach: { hook: `时态是英语语法的骨架——它告诉我们动作在什么时间发生、进行到什么程度。今天我们系统学习六大时态和被动语态。`, summary: '本课我们将学习六大基本时态和被动语态。' },
        learn: {
          sections: [
            { title: '六大基本时态', content: `**一般现在时** do/does：表示习惯、真理。He often plays football.（often 是标志词）\n**一般过去时** did：表示过去发生的动作。I visited Beijing last year.（last year 是标志词）\n**一般将来时** will do / be going to do：表示将来要发生的事。\n**现在进行时** am/is/are + doing：表示此刻正在发生。Look! They are playing.\n**过去进行时** was/were + doing：表示过去某一时刻正在发生。\n**现在完成时** have/has + done：表示过去发生的事对现在有影响。I have finished my homework.` },
            { title: '时间标志词', content: `often/usually → 一般现在时；yesterday/last week → 一般过去时；tomorrow/next year → 一般将来时；now/look/listen → 现在进行时；at that time → 过去进行时；already/yet/since/for → 现在完成时。` },
            { title: '被动语态', content: `结构：**be + 过去分词**（done），强调动作承受者。\nEnglish is spoken all over the world.（一般现在时被动）\nThe work will be done tomorrow.（一般将来时被动）\n各时态被动：was/were done（过去）；will be done（将来）；have/has been done（完成）。` }
          ],
          tips: ['学每个时态记三样东西：结构、时间标志词、一个典型例句', '现在完成时是难点：since + 时间点，for + 时间段', '被动语态先找"动作的承受者"做主语，注意时态体现在be动词上']
        },
        practice: [
          choice('m-eng-7-u1-q1', 'Look! The children ____ basketball on the playground.', ['A. play', 'B. played', 'C. are playing', 'D. were playing'], 'C', 'Look! 是现在进行时的标志，表示此刻正在发生。', 'easy'),
          fill('m-eng-7-u1-q2', 'I ____ in this city since 2015.', 'have lived', 'since + 时间点，用现在完成时 have/has + done。', 'easy'),
          fill('m-eng-7-u1-q3', '把主动句 "Many people speak English." 改为被动语态：____', 'English is spoken by many people.', '宾语 English 变主语，谓语变 is spoken，by many people 放最后。', 'easy'),
          truefalse('m-eng-7-u1-q4', '现在完成时可以和具体的过去时间状语（如 yesterday, last week）连用。', '错', '现在完成时不能和具体的过去时间状语连用。yesterday/last week 只能用一般过去时。', 'easy'),
          solve('m-eng-7-u1-q5', '用所给动词的正确形式填空：She ____ TV when I called her last night.', 'was watching', 'when I called 表示过去某一时刻，主句表示那个时刻正在发生的动作，用过去进行时 was/were + doing。', 'medium'),
          fill('m-eng-7-u1-q6', '改错：He has went to Shanghai three times. 正确形式：____', 'has gone', '现在完成时结构为 have/has + 过去分词，go 的过去分词是 gone，不是 went。', 'medium'),
          choice('m-eng-7-u1-q7', '— Have you ever been to Beijing? — Yes, I ____ there last summer.', ['A. go', 'B. went', 'C. have gone', 'D. will go'], 'B', 'last summer 是具体的过去时间，只能用一般过去时 went。', 'medium'),
          solve('m-eng-7-u1-q8', '把主动句改为被动语态：Farmers grow tea in the south of China.', 'Tea is grown (by farmers) in the south of China.', '步骤：①找宾语 tea → 变主语；②谓语 grow → 一般现在时被动 is grown；③原主语 farmers 变 by farmers。', 'hard'),
          solve('m-eng-7-u1-q9', '翻译：我已经在这所学校学习了三年。', 'I have studied at this school for three years.', 'for + 时间段（for three years）表示持续到现在，用现在完成时 have/has + done。', 'hard'),
          solve('m-eng-7-u1-q10', '请用现在完成时和一般过去时各造一个句子，并说明两者的区别。', '现在完成时：I have read this book.（强调对现在的影响——我了解这本书的内容）一般过去时：I read this book last week.（只说明过去某个时间发生的动作，与现在无关）', '现在完成时强调对现在的影响或持续到现在；一般过去时只说明过去发生的动作。', 'hard')
        ],
        aiContext: '初中英语 七年级 时态 一般现在时 一般过去时 现在完成时 被动语态'
      },
      {
        id: 'm-eng-7-u2',
        order: 2,
        title: '从句',
        duration: '约 45 分钟',
        objectives: ['能识别并正确使用三大从句的引导词', '掌握宾语从句的陈述语序，能识别并改正疑问语序的错误', '理解"主将从现"规则，能在时间/条件状语从句中正确运用'],
        teach: { hook: `从句是英语长难句的核心。一个句子"套"进另一个句子，就形成了从句。今天我们学习三大从句的关键规则。`, summary: '本课我们将学习宾语从句、定语从句和状语从句。' },
        learn: {
          sections: [
            { title: '宾语从句', content: `引导词：that（可省略）、if/whether（是否）、特殊疑问词（what, when, how...）。\n**核心陷阱：陈述语序**。从句内部必须是"主语 + 谓语"。\n✗ I don't know where is he. ✓ I don't know where he is.\n时态呼应：主句现在时，从句按实际需要；主句过去时，从句用相应的过去时（客观真理除外）。` },
            { title: '定语从句', content: `修饰名词的从句，被修饰的词叫先行词。\n关系代词：**who/that** 指人，**which/that** 指物，**whose** 表示"……的"。\n例：The boy **who is running** is my brother. This is the book **(that) I bought** yesterday.` },
            { title: '状语从句', content: `**"主将从现"**：if/when/as soon as 引导的条件、时间状语从句，主句用将来时，从句用一般现在时表将来。\nIf it rains tomorrow, we will stay at home.\n**"不连用"规则**：because × so；although × but（中文可以说"虽然……但是"，英文只能用一个）。` }
          ],
          tips: ['宾语从句抓三点：引导词、陈述语序、时态呼应', '记住两组"不连用"：because × so；although × but', '"主将从现"：if/when/as soon as 引导的从句用一般现在时表将来']
        },
        practice: [
          choice('m-eng-7-u2-q1', '改错：Could you tell me where is the library?', ['A. where the library is', 'B. where is the library', 'C. the library is where', 'D. is where the library'], 'A', '宾语从句必须用陈述语序（主语 + 谓语），where the library is。', 'easy'),
          fill('m-eng-7-u2-q2', '翻译：如果明天不下雨，我们就去爬山。', "If it doesn't rain tomorrow, we will go climbing.", '条件状语从句用一般现在时表将来（doesn\'t rain），主句用将来时（will go）。', 'easy'),
          fill('m-eng-7-u2-q3', '改错：Although he is young, but he knows a lot. 正确形式：____', 'Although he is young, he knows a lot.', 'although 和 but 不能连用，保留其中一个。', 'easy'),
          truefalse('m-eng-7-u2-q4', '定语从句中 who 指物，which 指人。', '错', 'who 指人，which 指物。', 'easy'),
          solve('m-eng-7-u2-q5', '选用 who/which/whose 填空：The girl ____ hair is long is my sister. The pen ____ I bought yesterday is lost.', 'whose; which/that', 'whose 修饰 hair（头发长长的那个女孩）；先行词 pen 是物，用 which 或 that。', 'medium'),
          fill('m-eng-7-u2-q6', 'I want to know what is he doing now. 正确形式：____', 'I want to know what he is doing now.', '宾语从句用陈述语序，what 后面跟"主语 he + 谓语 is doing"。', 'medium'),
          choice('m-eng-7-u2-q7', 'When she ____ back, I will tell her the news.', ['A. come', 'B. comes', 'C. will came', 'D. came'], 'B', 'when 引导的时间状语从句用一般现在时表将来，主语 she 是第三人称单数，填 comes。', 'medium'),
          solve('m-eng-7-u2-q8', '翻译：我喜欢那本你上周推荐给我的书。', 'I like the book (that/which) you recommended to me last week.', '先行词 book 是物，定语从句用 that/which 引导，作宾语时可省略。', 'hard'),
          solve('m-eng-7-u2-q9', '改错：Because he was ill, so he didn\'t go to school.', 'Because he was ill, he didn\'t go to school. 或 He was ill, so he didn\'t go to school.', 'because 和 so 不能连用，保留其中一个即可。', 'hard'),
          solve('m-eng-7-u2-q10', '请用 if 引导的条件状语从句造两个句子，分别表示"可能实现的条件"和"与事实相反的假设"。', '可能实现：If it rains tomorrow, we will stay at home.（主将从现）与事实相反：If I were a bird, I would fly in the sky.（虚拟语气，从句过去时，主句 would do）', '真实条件句用"主将从现"；虚拟条件句用过去时表示与事实相反。', 'hard')
        ],
        aiContext: '初中英语 七年级 从句 宾语从句 定语从句 状语从句 主将从现'
      },
      {
        id: 'm-eng-7-u3',
        order: 3,
        title: '非谓语动词',
        duration: '约 45 分钟',
        objectives: ['能区分动词不定式（to do）、动名词（doing）和分词（doing/done）的句法功能', '掌握常见动词后接 to do 与 doing 的固定搭配', '辨析易混搭配的意义差异：remember to do / remember doing'],
        teach: { hook: `英语中，一个动词在句子里只能有一个当"谓语"。当动词要充当名词、形容词或副词的角色时，就必须"变身"为非谓语动词。今天我们学习三大非谓语动词。`, summary: '本课我们将学习动词不定式、动名词和分词。' },
        learn: {
          sections: [
            { title: '动词不定式（to do）', content: `常表示"目的、将来要做的事"。\n作宾语：want / hope / decide / plan + **to do**。I want to buy a book.\n作宾补：ask / tell / want sb. **to do** sth. My mother tells me to study hard.\n使役/感官动词后**省 to**：let / make / have sb. **do**；see / hear sb. **do**。` },
            { title: '动名词（doing）', content: `当名词用，表示"一件事"。\n固定搭配：enjoy / finish / practice / mind / keep / suggest + **doing**。I enjoy reading.\n介词后一律用 doing：be good at doing, thank you for doing, look forward to **doing**（to 是介词！）。` },
            { title: '分词与易混辨析', content: `**现在分词 doing**：表主动、进行。The running boy is Tom.\n**过去分词 done**：表被动、完成。The book written by Lu Xun is famous.\n**易混辨析**：remember **to do**（记得要去做，未做）/ remember **doing**（记得做过，已做）；stop **to do**（停下来去做另一件事）/ stop **doing**（停止正在做的事）。` }
          ],
          tips: ['整理"接to do的动词"和"接doing的动词"两张清单', '注意介词后面一律用doing：be good at doing, thank you for doing', '用"动作是否已发生"区分 remember/forget/stop 接 to do 与 doing']
        },
        practice: [
          choice('m-eng-7-u3-q1', 'The teacher asked us ____ our homework on time.', ['A. finish', 'B. to finish', 'C. finishing', 'D. finished'], 'B', 'ask sb. to do sth. 是固定搭配，ask 后接带 to 的不定式作宾补。', 'easy'),
          fill('m-eng-7-u3-q2', 'I am looking forward to ____ from you soon.', 'hearing', 'look forward to 中的 to 是介词，介词后面必须用 doing。', 'easy'),
          fill('m-eng-7-u3-q3', 'Remember ____ off the lights when you leave.（提醒去做）', 'to turn', 'remember to do 表示"记得要去做"，事情还没做。', 'easy'),
          truefalse('m-eng-7-u3-q4', '"Swimming is fun"和"I am swimming"中的 swimming 用法相同。', '错', '前者是动名词（当名词用），后者是现在分词（表示正在游泳）。', 'easy'),
          solve('m-eng-7-u3-q5', 'My mother made me ____ my room yesterday.', 'clean', 'make sb. do sth. 是固定搭配，使役动词 make 后省略 to，接动词原形。', 'medium'),
          fill('m-eng-7-u3-q6', 'I enjoy ____ in summer. Would you like ____ us?', 'swimming; to join', 'enjoy 后接 doing；would like 后接 to do。', 'medium'),
          choice('m-eng-7-u3-q7', 'He stopped ____ because it\'s bad for his health.', ['A. to smoke', 'B. smoking', 'C. smoke', 'D. smoked'], 'B', 'stop doing 表示"停止做某事"（戒烟），stop to do 表示"停下来去做另一件事"。', 'medium'),
          solve('m-eng-7-u3-q8', '翻译：我忘了告诉她这个消息了。（"忘了告诉"，当时没告诉她）', "I forgot to tell her the news.", 'forget to do 表示"忘了要去做"（没做），符合"当时没告诉她"的语境。', 'hard'),
          solve('m-eng-7-u3-q9', 'She is looking forward to ____ your reply. 为什么填 receiving 而不是 to receive？', 'receiving。look forward to 中的 to 是介词（不是不定式符号），介词后面必须用 doing。', '判断 to 是介词还是不定式符号：介词 to 后接 doing，不定式 to 后接动词原形。', 'hard'),
          solve('m-eng-7-u3-q10', 'Remember ____ the door when you leave. vs I remember ____ the door, so it must be locked now.', '第一空 to lock（记得要去锁门，还没锁）；第二空 locking（记得锁过门了，已经锁了）。', '口诀：to do 是"还没做，记得要去做"；doing 是"已经做过，记得做过"。', 'hard')
        ],
        aiContext: '初中英语 七年级 非谓语动词 不定式 动名词 分词'
      },
      {
        id: 'm-eng-7-u4',
        order: 4,
        title: '词法综合',
        duration: '约 45 分钟',
        objectives: ['掌握名词复数的规则与不规则变化，能正确区分可数与不可数名词', '理解冠词 a/an/the 的用法，能根据语境选择正确的冠词', '掌握形容词、副词比较级和最高级的规则变化与不规则变化'],
        teach: { hook: `词法是英语表达的"砖瓦"。掌握名词、冠词、形容词副词、介词的用法，才能搭出准确、地道的句子。`, summary: '本课我们将学习名词、冠词、形容词副词和介词的综合用法。' },
        learn: {
          sections: [
            { title: '名词', content: `**可数名词复数规则**：一般 +s；以 s/x/sh/ch/o 结尾 +es；辅音字母 + y → ies；f/fe → ves。\n**不规则复数**：man→men, woman→women, child→children, foot→feet, tooth→teeth, mouse→mice, sheep→sheep。\n**不可数名词**：没有复数形式，用"量词 + of"表示数量：a cup of water, two pieces of advice。` },
            { title: '冠词', content: `**a / an**：第一次提到、泛指。a + 辅音音素开头（a book, a university）；an + 元音音素开头（an apple, an hour）。\n**the**：特指、上文提到过、独一无二的事物（the sun）、乐器前（play the piano）。\n**零冠词**：球类运动（play basketball）、三餐（have breakfast）、by + 交通工具（by bus）。` },
            { title: '形容词和副词', content: `**比较级和最高级规则**：单音节 +er/est；以 e 结尾 +r/st；辅音 + y → ier/iest；双音节/多音节前加 more/most。\n**不规则（必背）**：good/well→better→best; bad/badly→worse→worst; many/much→more→most; little→less→least。\n**常考句型**：as...as（和……一样，中间用原级）；比较级 + and + 比较级（越来越……）。` },
            { title: '介词', content: `**时间介词**：in（年/月/季节/泛指早中晚）；on（具体日期/星期/特定早中晚）；at（具体时刻）。\n**地点介词**：between（两者之间）；among（三者或以上之间）；in front of（外部的前面）；in the front of（内部的前面）。` }
          ],
          tips: ['名词复数口诀："男人女人a变e，鹅牙脚双o变双e；孩子加上ren，鱼鹿绵羊不用记"', '冠词判断三步法：①特指用the；②第一次提到用a/an；③球类三餐零冠词', '比较级最高级口诀："两者比较用比较级，三者以上最高级；as as 中间用原级，than前面比较级"']
        },
        practice: [
          choice('m-eng-7-u4-q1', '下列名词复数变化正确的是（    ）。', ['A. photo→photoes', 'B. knife→knives', 'C. child→childs', 'D. sheep→sheeps'], 'B', 'knife→knives（f→ves）；photo→photos（无生命+o只+s）；child→children（不规则）；sheep→sheep（单复同形）。', 'easy'),
          fill('m-eng-7-u4-q2', '"I play __ piano every day and play __ basketball on weekends."', ['the', '零冠词'], 'play the piano（乐器前用 the）；play basketball（球类运动零冠词）。', 'easy'),
          fill('m-eng-7-u4-q3', 'This book is __ than that one. She is the __ girl in our class.', ['more interesting', 'tallest', 'taller'], 'than 提示两者比较用比较级 more interesting；in our class（三者以上）用最高级 tallest。', 'easy'),
          truefalse('m-eng-7-u4-q4', 'a / an 看的是单词的首字母是元音字母还是辅音字母。', '错', 'a / an 看的是"音素"不是"字母"。a university（/ˈjuː-/ 辅音开头），an hour（/aʊər/ 元音开头，h 不发音）。', 'easy'),
          solve('m-eng-7-u4-q5', '写出复数并选择正确的冠词：There is "u" and "s" in the word "bus".', 'a "u" and an "s"。字母 u 读作 /juː/，以辅音音素 /j/ 开头，用 a；s 读作 /es/，以元音音素开头，用 an。', 'a / an 看的是"音素"不是"字母"。', 'medium'),
          fill('m-eng-7-u4-q6', 'The Yangtze River is the __ river in China. It\'s much __ than the Yellow River.', ['longest', 'longer'], 'in China（三者以上范围）用最高级 the longest；than 提示两者比较用比较级 longer。', 'medium'),
          choice('m-eng-7-u4-q7', 'We usually have lunch ____ noon. My birthday is ____ October 5th.', ['A. at; on', 'B. on; at', 'C. in; on', 'D. at; in'], 'A', 'at noon（固定搭配，具体时刻）；on October 5th（具体日期）。', 'medium'),
          solve('m-eng-7-u4-q8', '选用 in/on/at/between/among 填空：The meeting is ____ 9:00 a.m. ____ Monday ____ May. The house stands ____ two tall trees.', 'at; on; in; between。at 9:00（具体时刻）；on Monday（星期）；in May（月份）；between two tall trees（两者之间）。', '时间介词口诀：in 大 on 具体 at 时刻。', 'hard'),
          solve('m-eng-7-u4-q9', '用"比较级 + and + 比较级"和"the + 比较级, the + 比较级"各造一个句子。', '比较级+and+比较级：Our city is becoming more and more beautiful.（我们的城市越来越美丽）the+比较级, the+比较级：The more you practice, the better you will get.（你练得越多，就会越好）', '两个句型分别表示"越来越……"和"越……越……"。', 'hard'),
          solve('m-eng-7-u4-q10', '请用 between 和 among 各造一个句子，并说明两者的区别。', 'between：The school is between the bank and the supermarket.（学校在银行和超市之间——两者之间）among：The house stands among the trees.（房子坐落在树木之中——三者或以上之间）', 'between 用于两者之间；among 用于三者或以上之间。', 'hard')
        ],
        aiContext: '初中英语 七年级 词法 名词复数 冠词 比较级 介词'
      },
      {
        id: 'm-eng-7-u5',
        order: 5,
        title: '情景交际',
        duration: '约 45 分钟',
        objectives: ['能根据场景（问路、购物、打电话、就医等）选择得体的交际用语', '掌握中英文化差异下的交际习惯（回应感谢、接受赞美、拒绝邀请等）', '能在真实情境中进行简单的英语对话'],
        teach: { hook: `英语交际用语最大的特点是"约定俗成"——很多表达不能逐字翻译，而是要记住整个"语块"。今天我们学习高频场景用语。`, summary: '本课我们将学习问路、购物、打电话、就医等场景的交际用语。' },
        learn: {
          sections: [
            { title: '问路与指路', content: `问：Excuse me, where is the nearest hospital? / How can I get to the railway station? / Is there a bank near here?\n指：Go straight along this road. Turn left/right at the traffic lights. It's on your left/right. It's next to / across from the park.` },
            { title: '购物', content: `店员：Can I help you? / What can I do for you? What size / color would you like?\n顾客：I'm looking for a sweater. Can I try it on? How much is it / are they? Do you have a discount?` },
            { title: '打电话', content: `接通：Hello, this is Tom speaking. / May I speak to Lucy?\n接听：Speaking. / Hold on, please. / Sorry, she isn't in. Can I take a message?` },
            { title: '感谢与道歉', content: `感谢：Thank you (very much). / Thanks a lot. / It's very kind of you.\n回应：You're welcome. / My pleasure. / Not at all. / That's OK.\n道歉：Sorry. / I'm sorry. / Excuse me.（打扰别人前用）\n回应：It doesn't matter. / That's OK. / Never mind.` }
          ],
          tips: ['交际用语不需要逐字翻译，要记固定搭配', '中英文化差异：中国人被夸奖说"哪里哪里"，英语应说"Thank you"', '做题技巧：先看对话场景，再匹配该场景的常用句型']
        },
        practice: [
          choice('m-eng-7-u5-q1', '你想问去邮局的路，下面哪个问法最得体？', ['A. Where is the post office?', 'B. Excuse me, can you tell me the way to the post office?', 'C. How far is the post office?'], 'B', 'Excuse me 开头表示礼貌，"can you tell me the way to..." 是问路的标准句型。', 'easy'),
          fill('m-eng-7-u5-q2', '别人说"I\'m sorry I broke your cup."你应该怎么回答？', '"It doesn\'t matter." 或 "Never mind." 或 "That\'s OK."', '回应道歉用 It doesn\'t matter / That\'s OK / Never mind。', 'easy'),
          fill('m-eng-7-u5-q3', '在餐厅你想点一份汉堡和一杯橙汁，怎么说？', '"I\'d like a hamburger and a glass of orange juice, please."', '点餐用 I\'d like... 或 Can/May I have... 句型。', 'easy'),
          truefalse('m-eng-7-u5-q4', '"How are you?"是询问身体状况，需要详细回答。', '错', '"How are you?" 是打招呼，标准回答 "Fine, thanks. And you?" 不需要真的汇报身体状况。', 'easy'),
          solve('m-eng-7-u5-q5', '别人夸奖你 "Your English is very good!" 你应该怎么回答？', 'B. Thank you. 英语中接受赞美用 Thank you，不需要谦虚否定。', '英语回应赞美万能公式："Thank you + 一句谦虚的补充"。', 'medium'),
          fill('m-eng-7-u5-q6', '你想借同学的橡皮，应该怎么问？（写出两种表达）', '"Could I borrow your eraser?" 或 "Can I use your eraser, please?"', '借东西常用 Could I... / Can I... 句型，加上 please 更礼貌。', 'medium'),
          choice('m-eng-7-u5-q7', '在超市，店员对你说 "Can I help you?" 你想买一双运动鞋，怎么回答？', ['A. Yes, I\'m looking for a pair of sports shoes.', 'B. No, I don\'t want anything.', 'C. How much is it?', 'D. Can I try it on?'], 'A', '"Can I help you?" 是店员招呼顾客的标准用语，回答 Yes 并说明你要买什么。', 'medium'),
          solve('m-eng-7-u5-q8', '你想打电话给 Lucy，接电话的是她妈妈。请写出完整的 4 句对话。', '"Hello, this is Tom speaking. May I speak to Lucy?" — "Hold on, please." / "Sorry, she isn\'t in right now. Can I take a message?" — "Yes, please. Could you ask her to call me back?" — "Sure. What\'s your number?"', '打电话公式：接通 → 接听 → 留言 → 结束。', 'hard'),
          solve('m-eng-7-u5-q9', '你迟到了，进教室时应该对老师说什么？', '"Sorry I\'m late." 或 "I\'m sorry for being late, Mr./Ms. ..."', '迟到时先道歉（Sorry / I\'m sorry），可加上原因。Excuse me 用于打扰别人前，不适合道歉迟到。', 'hard'),
          solve('m-eng-7-u5-q10', '请用"Thank you"和"You\'re welcome"各造两个不同的回应句。', '感谢：Thank you very much. / Thanks a lot. / It\'s very kind of you. / I really appreciate it.回应：You\'re welcome. / My pleasure. / Not at all. / That\'s OK. / Don\'t mention it.', '感谢和回应有多种表达方式，根据场合选择。', 'hard')
        ],
        aiContext: '初中英语 七年级 情景交际 问路 购物 打电话 感谢 道歉'
      },
      {
        id: 'm-eng-7-u6',
        order: 6,
        title: '阅读理解',
        duration: '约 45 分钟',
        objectives: ['掌握阅读理解的三大策略：略读、寻读、精读', '能根据题型（细节/词义/推理/主旨）选择对应的解题方法', '理解"同义转换"是正确答案的常见呈现方式'],
        teach: { hook: `阅读理解不是"逐字翻译"，而是"有目的地获取信息"。掌握策略比认识每个单词更重要。今天我们学习阅读理解的四大题型解法。`, summary: '本课我们将学习阅读理解的三大策略和四大题型解法。' },
        learn: {
          sections: [
            { title: '三大阅读策略', content: `**略读（Skimming）**：快速浏览全文，抓住主旨大意。重点读标题、首段、末段、每段首句。\n**寻读（Scanning）**：带着特定问题快速查找具体信息（时间、地点、数字、人名）。\n**精读（Intensive Reading）**：仔细阅读关键段落，理解深层含义和作者态度。` },
            { title: '四大题型解法', content: `**1. 细节理解题**（最常考）：定位法。根据题目关键词回到原文找对应句子。**关键：正确答案往往是原文的同义转换**。\n**2. 词义猜测题**：①上下文逻辑；②构词法（前缀 un-/dis- 表否定，后缀 -less 表"没有"）；③定义或解释。\n**3. 推理判断题**：答案不会直接出现在原文中，要基于已知信息推断。推理要"贴着原文走"，不能过度推断。\n**4. 主旨大意题**：找主题句（首段首句/末句，各段首句）。选项要"大小合适"。` },
            { title: '排除法口诀', content: `与原文矛盾的一定错，原文未提及的一定错，太宽太窄的不选。` }
          ],
          tips: ['"同义转换"是阅读理解的核心技巧。正确答案往往不是照抄原文', '排除法：排除①与原文矛盾的选项 ②原文未提及的选项 ③过于绝对的选项', '限时训练：每篇阅读理解控制在6-8分钟']
        },
        practice: [
          choice('m-eng-7-u6-q1', '做细节理解题时，找到原文对应句子后还需要注意什么？', ['A. 同义转换', 'B. 直接照抄原文', 'C. 凭常识判断', 'D. 看哪个选项最长'], 'A', '正确选项往往不是照抄原文，而是用不同意思的词表达相同意思。', 'easy'),
          fill('m-eng-7-u6-q2', '遇到生词"uncomfortable"，如何通过构词法猜测词义？', 'un-（否定前缀）+ comfort（舒适）+ -able（形容词后缀）= 不舒服的。', '常见否定前缀：un-, dis-, im-, in-。', 'easy'),
          fill('m-eng-7-u6-q3', '主旨大意题的选项有什么特点？如何排除错误选项？', '正确选项：大小适中，能概括全文。错误选项：①太宽（超出文章范围）②太窄（只涉及某一段）③与原文无关。', '排除太宽太窄的选项。', 'easy'),
          truefalse('m-eng-7-u6-q4', '推理判断题的答案可以在原文中直接找到。', '错', '推理判断题需要根据原文已知信息进行合理推断，答案隐含在字里行间。', 'easy'),
          solve('m-eng-7-u6-q5', '原文："More and more people like riding bikes in the city." 题目：Which is TRUE? A. Few people ride bikes. B. Riding bikes is becoming popular in cities. C. People only ride bikes in the countryside.', 'B。原文 "More and more people like riding bikes in the city" 与 B 选项 "Riding bikes is becoming popular in cities" 是同义转换。', '细节题的"陷阱"：张冠李戴、偷换概念、无中生有。', 'medium'),
          fill('m-eng-7-u6-q6', '猜测词义 "disappear"：A. appear B. not appear C. become happy D. run away', 'B. not appear', 'dis- 是否定前缀，appear 是"出现"，disappear = 不出现 = 消失。', 'medium'),
          choice('m-eng-7-u6-q7', '一篇关于"如何保护眼睛"的文章，下面哪个是最合适的标题？', ['A. Eyes', 'B. How to Protect Our Eyes', 'C. Doing Eye Exercises'], 'B', 'A 太宽（只说"眼睛"），C 太窄（做眼操只是保护眼睛的一个方面），B 大小适中。', 'medium'),
          solve('m-eng-7-u6-q8', '做细节理解题时，找到原文对应句子后，为什么还要注意"同义转换"？', '因为正确答案往往不是照抄原文，而是用不同的词表达相同的意思。如果选项和原文"一模一样"，反而可能是干扰项（张冠李戴）。', '命题人常用同义转换来考查学生是否真正理解了原文。', 'hard'),
          choice('m-eng-7-u6-q9', '一篇关于"青少年如何与父母沟通"的文章，下面哪个标题最合适？', ['A. Parents', 'B. Teenagers', 'C. How Teenagers Can Communicate Better with Parents', 'D. Having a Family Meeting'], 'C', 'A 和 B 太宽，D 太窄（开家庭会只是沟通的一种方式），C 大小适中，涵盖主题和范围。', 'medium'),
          solve('m-eng-7-u6-q10', '请区分"细节题"和"推理题"，并各举一例。', '细节题：答案在原文中有直接对应（如 What color is the car? — The car is red.）推理题：需要根据原文信息"多想一步"（如 What can we infer from the passage? — The writer thinks reading is important.）', '区分关键：答案是否直接在原文中陈述。', 'hard')
        ],
        aiContext: '初中英语 七年级 阅读理解 细节题 推理题 主旨题 词义猜测'
      },
      {
        id: 'm-eng-7-u7',
        order: 7,
        title: '书面表达',
        duration: '约 45 分钟',
        objectives: ['掌握英语写作的四步法：审题→列提纲→写作→检查', '能根据文体（邮件、通知、日记、话题作文）选择正确的格式和时态', '学会使用连接词和过渡句使文章连贯'],
        teach: { hook: `英语作文不是"凑字数"，而是"有结构地表达思想"。掌握写作流程和万能句型，考场上就能从容应对。`, summary: '本课我们将学习四步写作法和各种文体的写作技巧。' },
        learn: {
          sections: [
            { title: '四步写作法', content: `1. **审题**：确定文体、时态、人称、要点（不要漏要点！要点齐全是评分第一关）。\n2. **列提纲**：开头（点题）→ 主体（分点展开）→ 结尾（总结/感想）。2 分钟即可。\n3. **写作**：使用熟悉的句型和词汇，注意连接词，句式要有变化（简单句 + 复合句交替）。\n4. **检查**：要点齐全？时态一致？主谓一致？拼写正确？字数达标（一般 80-100 词）？` },
            { title: '万能过渡词', content: `顺序：First(ly)... Second(ly)... Besides... What's more... Finally...\n转折：However... / But... / On the other hand...\n因果：Because... So... As a result... Therefore...\n总结：In a word... In my opinion... All in all... As for me...` },
            { title: '文体格式要点', content: `邮件/书信：Dear... → 正文（分段）→ Best wishes / Yours sincerely → 署名。\n通知：标题 NOTICE（居中）→ 正文（时间、地点、事件、要求）→ 落款（单位 + 日期）。\n日记：日期 + 天气（右上角）→ 正文（一般过去时，第一人称）。\n话题作文：三段式——引入话题 → 论述观点（2-3 个理由/例子）→ 总结升华。` },
            { title: '高分亮点', content: `句式多变：适当使用定语从句、状语从句增加亮点。\n高级词汇替换：important → significant; very → extremely / quite; good → excellent / wonderful; like → be fond of / enjoy。` }
          ],
          tips: ['"三步写作法"：①列要点（2分钟）②写草稿（8分钟）③检查修改（2分钟）', '"一句多译"练习：同一个意思用不同的句型表达', '背诵5-8个万能开头和结尾句型，考场上直接套用']
        },
        practice: [
          choice('m-eng-7-u7-q1', '英语作文评分先看什么？', ['A. 语言是否优美', 'B. 要点是否齐全', 'C. 字数是否达标', 'D. 书写是否工整'], 'B', '要点齐全是评分第一关，漏要点会直接降档。', 'easy'),
          fill('m-eng-7-u7-q2', '请用两种不同的句型表达"我们应该保护环境"。', '"We should protect the environment." / "It is our duty to protect the environment."', '"一句多译"是提升作文档次的秘诀。', 'easy'),
          fill('m-eng-7-u7-q3', '通知的格式：标题____（居中）→ 正文（____、____、____、要求）→ 落款（____+____）。', ['NOTICE', '时间', '地点', '事件', '单位', '日期'], '通知不用 Dear 开头，不用 Best wishes 结尾。', 'easy'),
          truefalse('m-eng-7-u7-q4', '英语作文开头越长越好，能展示语言水平。', '错', '开头要简洁，2-3句话后进入正题。开头过长会喧宾夺主。', 'easy'),
          solve('m-eng-7-u7-q5', '以"My Best Friend"为题写一篇短文。请写出开头句和结尾句。', '开头：I have a good friend. Her name is Li Hua. / My best friend is Li Hua, who has helped me a lot. 结尾：We are good friends and I like her very much. / I am lucky to have such a good friend.', '开头 1-2 句话点题，结尾回到主题表达感受。', 'medium'),
          fill('m-eng-7-u7-q6', '把下面三个句子用连接词串成一段连贯的文字：①I like reading. ②I read books every day. ③Reading opens up a new world for me.', 'I like reading very much, so I read books every day. What\'s more, reading opens up a new world for me.', '连接词让句子之间的关系更清晰。', 'medium'),
          choice('m-eng-7-u7-q7', '下面作文结尾有什么问题？"My school life is very happy. I like my school. The food is delicious."', ['A. 结尾跑题了', 'B. 结尾太短', 'C. 结尾没有总结', 'D. 结尾没有感想'], 'A', '"The food is delicious"与"学校生活快乐"的主题无关，属于偏离主题的废话。', 'medium'),
          solve('m-eng-7-u7-q8', '把"我喜欢英语，因为它很有趣"改写成三种不同的高级表达。', '①I like English because it is very interesting.（because 引导原因状语从句）②I am fond of English because of its interest.（be fond of + because of）③The reason why I like English is that it is very interesting.（The reason why... is that... 句型）', '"一句多译"是提升作文档次的秘诀。', 'hard'),
          solve('m-eng-7-u7-q9', '以"My Hobbies"为题写一篇 80 词左右的短文，要求：①介绍你的爱好（至少两个）②说明你为什么喜欢它们③你的感受。', '参考要点：①开头（My hobbies are reading and swimming.）②主体（I like reading because it opens up my mind. I also enjoy swimming because it keeps me healthy. ...）③结尾（These hobbies make my life colorful and meaningful.）', '写作框架：开头点题 → 分点展开 → 结尾升华。', 'hard'),
          solve('m-eng-7-u7-q10', '请以"英语演讲比赛"为题写一个通知的开头。', 'NOTICE  We are going to have an English speech competition. It will be in the school hall at 3 p.m. this Friday. ...', '通知格式：标题 NOTICE 居中 → 正文写清时间、地点、事件、要求 → 落款写单位名和日期。', 'hard')
        ],
        aiContext: '初中英语 七年级 书面表达 写作 邮件 通知 日记 话题作文'
      }
    ]
  }
];
