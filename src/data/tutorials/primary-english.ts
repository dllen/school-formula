import type { Question, Tutorial } from './types';

const choice = (
  id: string, question: string, options: string[], answer: string, explanation: string,
  difficulty: Question['difficulty'] = 'easy'
): Question => ({ id, type: 'choice', question, options, answer, explanation, difficulty });

const fill = (
  id: string, question: string, answer: string | string[], explanation: string,
  difficulty: Question['difficulty'] = 'easy'
): Question => ({ id, type: 'fill', question, answer, explanation, difficulty });

const truefalse = (
  id: string, question: string, answer: '对' | '错', explanation: string,
  difficulty: Question['difficulty'] = 'easy'
): Question => ({ id, type: 'truefalse', question, answer, explanation, difficulty });

const solve = (
  id: string, question: string, answer: string, explanation: string,
  difficulty: Question['difficulty'] = 'medium'
): Question => ({ id, type: 'solve', question, answer, explanation, difficulty });



export const PRIMARY_ENGLISH_TUTORIALS: Tutorial[] = [
  // ========== 一年级 ==========
  {
    id: 'primary-english-1',
    grade: '1',
    gradeName: '一年级',
    subject: '英语',
    subjectIcon: '🔤',
    title: '一年级英语',
    description: '从 26 个字母开始，建立语音基础，学会简单的课堂用语和自我介绍。',
    units: [
      {
        id: 'pe1-u1',
        order: 1,
        title: '字母认读',
        duration: '约 35 分钟',
        objectives: ["认读 26 个英文字母", "区分大小写", "正确发音"],
        teach: {
          hook: '小朋友们，你们知道吗？英语只有 26 个小字母，却能组合出超过 100 万个单词！',
          summary: '本课我们要认识 26 个英文字母。'
        },
        learn: {
          sections: [
            {
              title: '字母认读',
              content: `**26个字母**：
Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz

**元音字母（5个）**：A E I O U
**辅音字母（21个）**：其余字母`
            }
          ],
          tips: ["跟着字母歌多唱几遍", "用字母卡片玩游戏"]
        },
        practice: [
      choice('pe1-u1-q1', '英语共有多少个字母？', ["24个", "26个", "28个", "30个"], '26个', '英语共有 26 个字母。'),
      choice('pe1-u1-q2', '下列哪个是元音字母？', ["B", "C", "A", "D"], 'A', 'A E I O U 是元音字母。'),
      fill('pe1-u1-q3', '请写出字母 G 的小写形式：', 'g', 'G 的小写是 g。'),
      truefalse('pe1-u1-q4', '字母 M 和 N 是一对大小写字母。', '错', 'M 和 N 是两个不同的字母。'),
      choice('pe1-u1-q5', 'apple 的第一个字母是？', ["A", "B", "C", "D"], 'A', 'apple 以字母 a 开头。'),
      fill('pe1-u1-q6', '按字母顺序，字母 F 后面是：', 'G', '字母顺序：A B C D E F G...'),
      choice('pe1-u1-q7', '下列哪个字母发音时嘴巴张得最大？', ["M", "O", "P", "T"], 'O', 'O 是元音字母。'),
      fill('pe1-u1-q8', '请按字母顺序写出 H 前面的3个字母：', 'E F G', '顺序：...E F G H...'),
      truefalse('pe1-u1-q9', '大写字母 A 和小写字母 a 是同一个字母。', '对', '大写 A 和小写 a 是同一字母的两种形式。'),
      choice('pe1-u1-q10', '下列哪组字母都是元音？', ["A E I", "B C D", "F G H", "J K L"], 'A E I', 'A E I O U 是5个元音字母。'),
        ],
        aiContext: '一年级英语：字母认读，26个英文字母的大小写、元音辅母区分。'
      },
      {
        id: 'pe1-u2',
        order: 2,
        title: '辅音发音',
        duration: '约 35 分钟',
        objectives: ["掌握 B P M F 的发音", "能用手指操辅助发音", "识别首字母发音"],
        teach: {
          hook: '每个字母都有自己的发音名字。比如字母 B 读起来像波，字母 M 读起来像呣。',
          summary: '本课学习 4 个辅音字母的发音：B P M F。'
        },
        learn: {
          sections: [
            {
              title: '辅音发音',
              content: `**B /b/**：双唇紧闭，突然打开（不送气）
例词：book、ball、blue

**P /p/**：双唇紧闭，突然打开（送气）
例词：pen、pig、pink

**M /m/**：双唇紧闭，鼻子出声
例词：mom、mouth、milk

**F /f/**：上牙咬下唇，吹气
例词：fish、five、face`
            }
          ],
          tips: ["边做手势边发音", "用单词卡片练习首字母发音"]
        },
        practice: [
      choice('pe1-u2-q1', '字母 B 的发音与下列哪个最接近？', ["/b/", "/p/", "/m/", "/f/"], '/b/', '字母 B 发 /b/ 音。'),
      fill('pe1-u2-q2', 'fish 的首字母是？', 'F', 'fish 以字母 f 开头。'),
      truefalse('pe1-u2-q3', '发 P 时能感觉到气流。', '对', '发 P 时送气，能感觉到气流。'),
      choice('pe1-u2-q4', '下列哪个单词以 M 开头？', ["nose", "mouth", "leg", "dog"], 'mouth', 'mouth 以 M 开头。'),
      fill('pe1-u2-q5', '请写出字母 D 的小写：', 'd', 'D 的小写是 d。'),
      choice('pe1-u2-q6', 'nine 的首字母发音是？', ["/m/", "/n/", "/l/", "/d/"], '/n/', 'nine 的 N 发 /n/ 音。'),
      truefalse('pe1-u2-q7', '字母 M 和 N 发音时都要用鼻子。', '对', 'M 和 N 都是鼻音。'),
      fill('pe1-u2-q8', '请写出3个以 B 开头的单词：', 'book,ball,bus', '答案不唯一。'),
      choice('pe1-u2-q9', '哪个字母发音时要咬嘴唇？', ["B", "P", "F", "T"], 'F', 'F 发音时上牙咬下唇。'),
      fill('pe1-u2-q10', '请写出 pen 的首字母大写形式：', 'P', 'pen 的首字母大写是 P。'),
        ],
        aiContext: '一年级英语：辅音发音启蒙，B P M F 的发音方法和例词。'
      },
      {
        id: 'pe1-u3',
        order: 3,
        title: '元音发音',
        duration: '约 35 分钟',
        objectives: ["掌握 A E I O U 的短音发音", "理解元音是音节的核心", "能拼读简单 CVC 单词"],
        teach: {
          hook: '元音是单词的心脏，没有元音就发不出音节。A E I O U，每个元音都有自己的嘴巴形状！',
          summary: '本课学习 5 个元音字母的短音发音。'
        },
        learn: {
          sections: [
            {
              title: '元音发音',
              content: `**A /a/**：嘴巴张大
例词：cat、bag、apple

**E /e/**：嘴巴半开
例词：egg、bed、red

**I /i/**：嘴巴微微张开
例词：igloo、six、big

**O /o/**：嘴巴圆圆的
例词：orange、dog、box

**U /u/**：嘴巴张开
例词：umbrella、bus、cup`
            }
          ],
          tips: ["对镜子练习嘴巴形状", "用慢动作拼读"]
        },
        practice: [
      choice('pe1-u3-q1', '英语中有多少个元音字母？', ["3个", "4个", "5个", "6个"], '5个', 'A E I O U 共 5 个元音字母。'),
      fill('pe1-u3-q2', 'cat 中间的元音是：', 'a', 'cat 中间的元音是 a。'),
      truefalse('pe1-u3-q3', '单词 dog 中有元音字母。', '对', 'dog 中的 o 是元音字母。'),
      choice('pe1-u3-q4', '下列哪个单词以元音开头？', ["cat", "egg", "dog", "pen"], 'egg', 'egg 以元音 e 开头。'),
      fill('pe1-u3-q5', '请按顺序写出5个元音字母：', 'A E I O U', '5个元音字母是 A E I O U。'),
      choice('pe1-u3-q6', 'bed 中 e 的发音是？', ["/i:/", "/e/", "/a/", "/o/"], '/e/', 'bed 中 e 发短音 /e/。'),
      truefalse('pe1-u3-q7', '单词 sun 的结构是 CVC。', '对', 'sun = s(辅音) + u(元音) + n(辅音)。'),
      fill('pe1-u3-q8', '请写出3个以元音开头的单词：', 'egg,apple,orange', '答案不唯一。'),
      choice('pe1-u3-q9', '发 /a/ 音时嘴巴的状态是？', ["微微张开", "张大", "圆圆的", "闭合"], '张大', 'A /a/ 发音时嘴巴要张大。'),
      fill('pe1-u3-q10', '拼读练习：/d/ + /o/ + /g/ = ?', 'dog', 'dog 的拼读是 /d/ + /o/ + /g/。'),
        ],
        aiContext: '一年级英语：元音发音启蒙，5个元音字母的短音发音方法。'
      },
      {
        id: 'pe1-u4',
        order: 4,
        title: '课堂用语',
        duration: '约 35 分钟',
        objectives: ["听懂 10 句课堂用语", "能做出相应反应", "学会说 Hello 和 Goodbye"],
        teach: {
          hook: '老师说 Stand up，我们就站起来；老师说 Sit down，我们就坐下。今天我们就来学习这些英语指令！',
          summary: '本课学习 10 句最常用的英语课堂用语。'
        },
        learn: {
          sections: [
            {
              title: '课堂用语',
              content: `**基本问候**：
Hello! — 你好！
Goodbye! — 再见！
Good morning! — 早上好！

**课堂指令**：
Stand up, please. — 请站起来。
Sit down, please. — 请坐下。
Open your book. — 打开书。
Listen to me. — 听我说。
Look at the blackboard. — 看黑板。
Raise your hand. — 举手。
Be quiet, please. — 请安静。`
            }
          ],
          tips: ["和同学一起玩老师说游戏", "回家对爸爸妈妈说 Hello 和 Goodbye"]
        },
        practice: [
      choice('pe1-u4-q1', 'Goodbye 是什么意思？', ["你好", "再见", "谢谢", "对不起"], '再见', 'Goodbye 是再见的意思。'),
      fill('pe1-u4-q2', 'Stand up 的中文意思是：', '站起来', 'Stand up = 站起来。'),
      truefalse('pe1-u4-q3', 'Open your book 的意思是合上书。', '错', 'Open your book 是打开书。'),
      choice('pe1-u4-q4', '上学见到老师应该说什么？', ["Goodbye", "Hello", "Sorry", "Thank you"], 'Hello', '见面说 Hello。'),
      fill('pe1-u4-q5', '请写出再见的英文：', 'Goodbye', '再见 = Goodbye / Bye。'),
      choice('pe1-u4-q6', 'Raise your hand 是什么意思？', ["坐下", "举手", "打开书", "站起来"], '举手', 'Raise your hand = 举手。'),
      truefalse('pe1-u4-q7', 'Good morning 是下午问候语。', '错', 'Good morning 是早上问候语。'),
      fill('pe1-u4-q8', '请安静 用英语怎么说：', 'Be quiet, please', 'Be quiet, please = 请安静。'),
      choice('pe1-u4-q9', '下列哪个是正确的课堂用语？', ["Stand up", "Stand down", "Stand over", "Stand under"], 'Stand up', '站起来是 Stand up。'),
      fill('pe1-u4-q10', '请写出早上好的英文：', 'Good morning', '早上好 = Good morning。'),
        ],
        aiContext: '一年级英语：课堂用语，基本问候和课堂指令。'
      },
      {
        id: 'pe1-u5',
        order: 5,
        title: '自我介绍',
        duration: '约 35 分钟',
        objectives: ["学会用英语介绍自己的名字", "学会问候和回答年龄", "掌握简单的对话结构"],
        teach: {
          hook: '有一天，你在公园遇到一个外国小朋友，他想和你做朋友。My name is... 就是 我的名字是...',
          summary: '本课学习用英语进行简单的自我介绍。'
        },
        learn: {
          sections: [
            {
              title: '自我介绍',
              content: `**What's your name?** — 你叫什么名字？
**My name is...** — 我的名字是...

**How old are you?** — 你几岁了？
**I'm ... years old.** — 我...岁了。

**对话练习**：
A: Hello! What's your name?
B: My name is Xiaoming. How old are you?
A: I'm 7 years old. Goodbye!
B: Bye!`
            }
          ],
          tips: ["和同学练习英语对话", "回家用英语向爸爸妈妈介绍自己"]
        },
        practice: [
      choice('pe1-u5-q1', 'What\'s your name? 是什么意思？', ["你几岁", "你叫什么名字", "你好吗", "再见"], '你叫什么名字', 'What\'s your name? = 你叫什么名字？'),
      fill('pe1-u5-q2', '我的名字是晓明 用英语说：', 'My name is Xiaoming', 'My name is + 名字。'),
      truefalse('pe1-u5-q3', 'I\'m 是 I am 的缩写。', '对', 'I\'m = I am。'),
      choice('pe1-u5-q4', 'How old are you? 问的是什么？', ["名字", "年龄", "颜色", "心情"], '年龄', 'How old are you? = 你几岁了？'),
      fill('pe1-u5-q5', '我8岁了 用英语说：', 'I\'m 8 years old', 'I\'m + 数字 + years old。'),
      choice('pe1-u5-q6', '第一次见到新朋友，你应该先说？', ["Goodbye", "Hello", "Sorry", "Thank you"], 'Hello', '见面先说 Hello。'),
      truefalse('pe1-u5-q7', 'My name 后面可以直接跟名字。', '错', '应该是 My name is + 名字。'),
      fill('pe1-u5-q8', 'Lily 问 What\'s your name?，你叫小明，请回答：', 'My name is Xiaoming', 'My name is + 你的名字。'),
      choice('pe1-u5-q9', '下列哪个是正确的自我介绍？', ["My name are Xiaoming", "My is Xiaoming", "My name is Xiaoming", "I name is Xiaoming"], 'My name is Xiaoming', '正确句型是 My name is...'),
      fill('pe1-u5-q10', '请用英语做一个自我介绍（包含名字和年龄）：', 'My name is...I\'m...years old', '答案不唯一。'),
        ],
        aiContext: '一年级英语：自我介绍，用英语介绍名字和年龄的基本对话。'
      },
    ]
  },
  // ========== 二年级 ==========
  {
    id: 'primary-english-2',
    grade: '2',
    gradeName: '二年级',
    subject: '英语',
    subjectIcon: '🔤',
    title: '二年级英语',
    description: '巩固字母书写，学习字母组合发音，掌握颜色数字和日常问候表达。',
    units: [
      {
        id: 'pe2-u1',
        order: 1,
        title: '字母书写',
        duration: '约 35 分钟',
        objectives: ["在四线三格中正确书写字母", "掌握字母的占格规律", "书写规范整洁"],
        teach: {
          hook: '字母宝宝住在四线三格的房子里。有的住两层，有的住三层，还有的带个小尾巴。',
          summary: '本课学习 26 个字母在四线三格中的正确书写位置。'
        },
        learn: {
          sections: [
            {
              title: '字母书写',
              content: `**占中格的字母**：a, c, e, m, n, o, r, s, u, v, w, x, z
**占上中两格的字母**：b, d, f, h, k, l, t
**占中下两格的字母**：g, p, q, y
**占上中下三格的字母**：j`
            }
          ],
          tips: ["每天练写 3 个字母", "注意笔顺，先观察再下笔"]
        },
        practice: [
      choice('pe2-u1-q1', '字母 a 占几格？', ["上格", "中格", "下格", "三格"], '中格', '字母 a 占中格。'),
      fill('pe2-u1-q2', '请写出字母 B 的小写形式：', 'b', 'B 的小写是 b。'),
      truefalse('pe2-u1-q3', '字母 g 的尾巴在中格里。', '错', '字母 g 的尾巴在下格。'),
      choice('pe2-u1-q4', '下列哪个字母占上中两格？', ["a", "b", "g", "z"], 'b', 'b 占上中两格。'),
      fill('pe2-u1-q5', '请按字母顺序写出 j 后面的4个字母：', 'k l m n', '顺序：...j k l m n...'),
      choice('pe2-u1-q6', '字母 f 占几格？', ["中格", "上中两格", "上中下三格", "中下两格"], '上中下三格', '字母 f 占上中下三格。'),
      truefalse('pe2-u1-q7', '大写字母 T 先写横。', '错', '大写 T 先写竖，再写横。'),
      fill('pe2-u1-q8', '请写出占中格的小写字母5个：', 'a c e m n', '答案不唯一。'),
      choice('pe2-u1-q9', '下列哪个字母占三格？', ["b", "f", "g", "p"], 'f', '字母 f 占上中下三格。'),
      fill('pe2-u1-q10', '请正确书写字母 Q 的小写：', 'q', 'Q 的小写是 q。'),
        ],
        aiContext: '二年级英语：字母书写，四线三格中的占格规律。'
      },
      {
        id: 'pe2-u2',
        order: 2,
        title: '元音组合',
        duration: '约 35 分钟',
        objectives: ["掌握 ee ea oo 的发音规则", "能拼读含元音组合的单词", "区分长短元音"],
        teach: {
          hook: '两个元音字母手拉手站在一起，就会发出新的声音！比如 ee 一起发 /iː/，oo 一起发 /uː/。',
          summary: '本课学习三个最常见的元音组合：ee, ea, oo。'
        },
        learn: {
          sections: [
            {
              title: '元音组合',
              content: `**ee → /iː/**（长音）
例词：bee（蜜蜂）、see（看见）、tree（树）

**ea → /iː/**（通常发长音）
例词：tea（茶）、sea（海）、read（读）

**oo → /uː/** 或 /u/**
长音：moon、food、school
短音：book、look、good`
            }
          ],
          tips: ["用单词卡片归类记忆", "注意 oo 的长短音区别"]
        },
        practice: [
      choice('pe2-u2-q1', '字母组合 ee 的发音是？', ["/e/", "/i:/", "/u:/", "/ae/"], '/i:/', 'ee 组合发 /i:/ 音。'),
      fill('pe2-u2-q2', '树的英文是：', 'tree', 'tree = 树。'),
      truefalse('pe2-u2-q3', 'book 和 moon 中的 oo 发音相同。', '错', 'book 中 oo 发短音，moon 中 oo 发长音。'),
      choice('pe2-u2-q4', '下列哪个单词含有 ee 组合？', ["book", "bee", "tea", "room"], 'bee', 'bee 含有 ee 组合。'),
      fill('pe2-u2-q5', '茶的英文是：', 'tea', 'tea = 茶。'),
      choice('pe2-u2-q6', 'read 中 ea 的发音是？', ["/i:/", "/e/", "/ae/", "/o/"], '/i:/', 'read 中 ea 发 /i:/。'),
      truefalse('pe2-u2-q7', 'ee 和 ea 有时发相同的音。', '对', 'ee 和 ea 都常发 /i:/ 音。'),
      fill('pe2-u2-q8', '请写出3个含有 oo 的单词：', 'book,moon,room', '答案不唯一。'),
      choice('pe2-u2-q9', 'feet 的中文意思是？', ["脚", "手", "头", "眼睛"], '脚', 'feet = 脚。'),
      fill('pe2-u2-q10', '请写出看的英文（含 oo）：', 'look', 'look = 看，含有 oo 组合。'),
        ],
        aiContext: '二年级英语：元音组合发音，ee ea oo 的发音规则和例词。'
      },
      {
        id: 'pe2-u3',
        order: 3,
        title: '辅音组合',
        duration: '约 35 分钟',
        objectives: ["掌握 sh ch th wh 的发音", "区分清辅音和浊辅音", "能拼读含辅音组合的单词"],
        teach: {
          hook: '两个辅音字母组合在一起，会发出一个全新的声音！比如 sh 一起发 /ʃ/，ch 一起发 /tʃ/。',
          summary: '本课学习四个最常见的辅音组合：sh, ch, th, wh。'
        },
        learn: {
          sections: [
            {
              title: '辅音组合',
              content: `**sh → /ʃ/**
例词：ship（船）、fish（鱼）、wash（洗）

**ch → /tʃ/**
例词：chair（椅子）、chicken（鸡）、teacher（老师）

**th → /θ/** 或 /ð/**
清音：think、thank、math
浊音：this、that、mother

**wh → /w/**
例词：what、white、where、why`
            }
          ],
          tips: ["对镜子观察舌头位置", "sh 气流长，ch 气流短"]
        },
        practice: [
      choice('pe2-u3-q1', 'ship 中 sh 的发音是？', ["/tʃ/", "/ʃ/", "/s/", "/θ/"], '/ʃ/', 'sh 组合发 /ʃ/ 音。'),
      fill('pe2-u3-q2', '椅子的英文是：', 'chair', 'chair = 椅子，含有 ch 组合。'),
      truefalse('pe2-u3-q3', 'think 和 this 中 th 发音相同。', '错', 'think 中 th 发清音，this 中 th 发浊音。'),
      choice('pe2-u3-q4', '下列哪个单词含有 ch 组合？', ["ship", "chair", "fish", "wash"], 'chair', 'chair 含有 ch 组合。'),
      fill('pe2-u3-q5', '什么的英文是：', 'what', 'what = 什么，含有 wh 组合。'),
      choice('pe2-u3-q6', 'wash 中 sh 的发音是？', ["/tʃ/", "/ʃ/", "/s/", "/θ/"], '/ʃ/', 'wash 含有 sh 组合。'),
      truefalse('pe2-u3-q7', '发 wh 音时嘴巴要圆圆的。', '对', 'wh 发 /w/ 音，嘴巴要圆圆的。'),
      fill('pe2-u3-q8', '请写出3个含有 sh 的单词：', 'ship,fish,wash', '答案不唯一。'),
      choice('pe2-u3-q9', 'China 中 ch 的发音是？', ["/tʃ/", "/ʃ/", "/k/", "/s/"], '/tʃ/', 'China 中 ch 发 /tʃ/。'),
      fill('pe2-u3-q10', '请写出为什么的英文：', 'why', 'why = 为什么，含有 wh 组合。'),
        ],
        aiContext: '二年级英语：辅音组合发音，sh ch th wh 的发音规则和例词。'
      },
      {
        id: 'pe2-u4',
        order: 4,
        title: '颜色数字',
        duration: '约 35 分钟',
        objectives: ["掌握 12 种颜色的英文表达", "学会用英语表达数字 1-20", "能用英语描述物品颜色"],
        teach: {
          hook: '你周围的世界有各种各样的颜色。red 苹果、blue 天空、green 草地、yellow 太阳',
          summary: '本课学习 12 种颜色的英文表达和数字 1-20。'
        },
        learn: {
          sections: [
            {
              title: '颜色数字',
              content: `**基本颜色**：red（红）、blue（蓝）、green（绿）、yellow（黄）、black（黑）、white（白）

**数字 1-12**：one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve

**句型**：
What color is it? — 它是什么颜色？
It's red. — 它是红色的。`
            }
          ],
          tips: ["用彩色卡片学习颜色", "用手指表示数字"]
        },
        practice: [
      choice('pe2-u4-q1', '蓝色的英文是？', ["red", "blue", "green", "yellow"], 'blue', 'blue = 蓝色。'),
      fill('pe2-u4-q2', '苹果是红色的 用英语说：', 'The apple is red', 'The apple is + 颜色。'),
      truefalse('pe2-u4-q3', 'purple 是粉色的意思。', '错', 'purple 是紫色，pink 是粉色。'),
      choice('pe2-u4-q4', 'three 对应的数字是？', ["2", "3", "4", "5"], '3', 'three = 3。'),
      fill('pe2-u4-q5', '15 的英文是：', 'fifteen', '15 = fifteen。'),
      choice('pe2-u4-q6', 'How many 是什么意思？', ["多少", "什么", "哪里", "什么时候"], '多少', 'How many = 多少？'),
      truefalse('pe2-u4-q7', 'eighteen 有两个 t。', '错', 'eighteen 只有一个 t。'),
      fill('pe2-u4-q8', '20 的英文是：', 'twenty', '20 = twenty。'),
      choice('pe2-u4-q9', 'What color is it? 问的是什么？', ["大小", "颜色", "形状", "多少"], '颜色', 'What color is it? = 它是什么颜色？'),
      fill('pe2-u4-q10', '请写出5种颜色的英文：', 'red,blue,yellow,green,black', '答案不唯一。'),
        ],
        aiContext: '二年级英语：颜色和数字，12种颜色词汇和1-20的数字表达。'
      },
      {
        id: 'pe2-u5',
        order: 5,
        title: '日常问候',
        duration: '约 35 分钟',
        objectives: ["掌握日常问候对话", "学会回答 How are you", "能用英语进行简单交流"],
        teach: {
          hook: '英国人见面时最喜欢聊天气！但最基础的还是 How are you? ——你好吗？',
          summary: '本课学习日常问候语及其回答方式。'
        },
        learn: {
          sections: [
            {
              title: '日常问候',
              content: `**问候语**：Hello! / Hi! / Good morning! / Good afternoon!

**How are you?** — 你好吗？
**回答**：I'm fine, thank you. / I'm good. / Not bad.

**对话**：
A: Hello! How are you?
B: I'm fine, thank you. And you?
A: I'm great!`
            }
          ],
          tips: ["和同学练习英语对话", "回家对家人用英语问好"]
        },
        practice: [
      choice('pe2-u5-q1', 'How are you? 的正确回答是？', ["I'm 7 years old", "I'm fine, thank you", "My name is Lily", "Goodbye"], 'I\'m fine, thank you', 'How are you 问候健康，回答用 I\'m fine。'),
      fill('pe2-u5-q2', 'Good morning 的中文意思是：', '早上好', 'Good morning = 早上好。'),
      truefalse('pe2-u5-q3', 'Hi 比 Hello 更正式。', '错', 'Hi 更随意，Hello 更正式。'),
      choice('pe2-u5-q4', 'Good evening 什么时候用？', ["早上", "下午", "晚上", "中午"], '晚上', 'Good evening 是晚上好。'),
      fill('pe2-u5-q5', '你好，Lily 用英语说：', 'Hello, Lily', 'Hello/Hi + 名字。'),
      choice('pe2-u5-q6', 'And you 是什么意思？', ["你好", "再见", "你呢", "谢谢"], '你呢', 'And you? = 你呢？'),
      truefalse('pe2-u5-q7', 'See you 是告别语。', '对', 'See you = 再见/回头见。'),
      fill('pe2-u5-q8', '我很好 用英语说：', 'I\'m fine/good/great', 'I\'m fine = 我很好。'),
      choice('pe2-u5-q9', 'Goodbye 的同义词是？', ["Hello", "Hi", "Bye", "How are you"], 'Bye', 'Bye = Goodbye = 再见。'),
      fill('pe2-u5-q10', '请写一段问候对话（至少3轮）：', 'A: Hello!B: Hi!A: How are you?B: I\'m fine.And you?', '答案不唯一。'),
        ],
        aiContext: '二年级英语：日常问候，How are you 及其回答方式。'
      },
    ]
  },
  // ========== 三年级 ==========
  {
    id: 'primary-english-3',
    grade: '3',
    gradeName: '三年级',
    subject: '英语',
    subjectIcon: '🔤',
    title: '三年级英语',
    description: '学习单词拼读规则，掌握家庭成员、教室用品、动物描述和简单句型。',
    units: [
      {
        id: 'pe3-u1',
        order: 1,
        title: '单词拼读',
        duration: '约 35 分钟',
        objectives: ["掌握音节划分规则", "能拼读双音节单词", "理解开音节和闭音节"],
        teach: {
          hook: '英语中80%的单词都符合自然拼读规则！掌握Phonics，即使遇到不认识的单词，你也能正确读出它的发音。',
          summary: '本课学习自然拼读的基本规则：音节划分、开音节和闭音节。'
        },
        learn: {
          sections: [
            {
              title: '单词拼读',
              content: `**音节**：单词中的每一个节拍。一个音节必须有一个元音。

**划分规则**：
一归后：两个元音之间有一个辅音，辅音归后面（ba-con）
二分开：两个元音之间有两个辅音，分别归属（but-ter）

**开音节**：以元音字母结尾，元音发字母本身的音
例词：he, no, hi, me

**闭音节**：以辅音字母结尾，元音发短音
例词：cat, bed, sit, hot, bus`
            }
          ],
          tips: ["拍手打节拍，一个音节拍一下", "先划分音节，再逐个拼读"]
        },
        practice: [
      choice('pe3-u1-q1', 'rabbit 有几个音节？', ["1个", "2个", "3个", "4个"], '2个', 'rabbit = rab-bit，2个音节。'),
      fill('pe3-u1-q2', 'computer 的音节划分是：', 'com-pu-ter', 'computer = com-pu-ter。'),
      truefalse('pe3-u1-q3', 'he 是闭音节。', '错', 'he 以元音结尾，是开音节。'),
      choice('pe3-u1-q4', '下列哪个是开音节单词？', ["cat", "no", "bed", "sit"], 'no', 'no 以元音结尾，是开音节。'),
      fill('pe3-u1-q5', 'elephant 的音节划分是：', 'el-e-phant', 'elephant = el-e-phant。'),
      choice('pe3-u1-q6', '闭音节的元音发什么音？', ["长音", "短音", "不发音", "双元音"], '短音', '闭音节的元音发短音。'),
      truefalse('pe3-u1-q7', '一个音节可以没有元音。', '错', '一个音节必须有一个元音。'),
      fill('pe3-u1-q8', '请划分 banana 的音节：', 'ba-na-na', 'banana = ba-na-na。'),
      choice('pe3-u1-q9', 'bed 中 e 的发音是？', ["/i:/", "/e/", "/ae/", "/o/"], '/e/', 'bed 是闭音节，e 发短音 /e/。'),
      fill('pe3-u1-q10', '请写出3个开音节单词：', 'he,no,hi', '答案不唯一。'),
        ],
        aiContext: '三年级英语：自然拼读入门，音节划分规则和开闭音节。'
      },
      {
        id: 'pe3-u2',
        order: 2,
        title: '家庭成员',
        duration: '约 35 分钟',
        objectives: ["掌握家庭成员的英文表达", "学会用英语介绍家人", "理解 family tree 的概念"],
        teach: {
          hook: '每个人都有自己的家庭。爸爸、妈妈、哥哥、姐姐、弟弟、妹妹用英语怎么称呼他们呢？',
          summary: '本课学习家庭成员的英文词汇和介绍家人的句型。'
        },
        learn: {
          sections: [
            {
              title: '家庭成员',
              content: `**核心词汇**：
father / dad — 爸爸
mother / mom — 妈妈
grandfather / grandpa — 爷爷/外公
grandmother / grandma — 奶奶/外祖母
brother — 哥哥/弟弟
sister — 姐姐/妹妹

**句型**：
This is my father. — 这是我爸爸。
He's a teacher. — 他是一名老师。`
            }
          ],
          tips: ["画一张家谱图，用英语标注", "用家人的照片练习介绍"]
        },
        practice: [
      choice('pe3-u2-q1', 'mother 的中文意思是？', ["爸爸", "妈妈", "哥哥", "姐姐"], '妈妈', 'mother = 妈妈。'),
      fill('pe3-u2-q2', '爷爷的英文是：', 'grandfather/grandpa', '爷爷 = grandfather / grandpa。'),
      truefalse('pe3-u2-q3', '英语中 brother 可以表示哥哥和弟弟。', '对', 'brother 不分哥哥和弟弟。'),
      choice('pe3-u2-q4', 'This is my father 是什么意思？', ["这是我妈妈", "这是我爸爸", "这是我哥哥", "这是我姐姐"], '这是我爸爸', 'This is my father = 这是我爸爸。'),
      fill('pe3-u2-q5', '阿姨的英文是：', 'aunt', 'aunt = 阿姨/姑姑/婶婶。'),
      choice('pe3-u2-q6', 'She\'s 是什么的缩写？', ["She is", "She has", "She was", "She does"], 'She is', 'She\'s = She is。'),
      truefalse('pe3-u2-q7', 'cousin 是指亲兄弟姐妹。', '错', 'cousin 是堂/表兄弟姐妹。'),
      fill('pe3-u2-q8', '这是我妈妈，她是老师 用英语说：', 'This is my mother.She\'s a teacher', 'This is my mother. She\'s a teacher。'),
      choice('pe3-u2-q9', 'grandma 是指？', ["奶奶/外婆", "妈妈", "阿姨", "姐姐"], '奶奶/外婆', 'grandma = 奶奶/外婆。'),
      fill('pe3-u2-q10', '请用英语介绍你的一个家人：', 'This is my...He/She is a...', '答案不唯一。'),
        ],
        aiContext: '三年级英语：家庭成员词汇和介绍家人的句型。'
      },
      {
        id: 'pe3-u3',
        order: 3,
        title: '教室用品',
        duration: '约 35 分钟',
        objectives: ["掌握教室用品的英文表达", "学会用英语询问物品", "掌握 this/that 的用法"],
        teach: {
          hook: '走进教室，你会看到书桌、椅子、黑板、书包这些学习用品用英语怎么说呢？',
          summary: '本课学习教室用品词汇和询问物品的句型。'
        },
        learn: {
          sections: [
            {
              title: '教室用品',
              content: `**常用词汇**：
desk — 书桌
chair — 椅子
blackboard — 黑板
book — 书
pen — 钢笔
pencil — 铅笔
ruler — 尺子
eraser — 橡皮

**句型**：
What's this? — 这是什么？（近处）
What's that? — 那是什么？（远处）
It's a... — 它是...`
            }
          ],
          tips: ["在教室里指物练习", "用 What's this? 互相提问"]
        },
        practice: [
      choice('pe3-u3-q1', '铅笔的英文是？', ["pen", "pencil", "ruler", "eraser"], 'pencil', 'pencil = 铅笔。'),
      fill('pe3-u3-q2', '黑板的英文是：', 'blackboard', 'blackboard = 黑板。'),
      truefalse('pe3-u3-q3', 'What\'s this? 用来问远处的东西。', '错', 'What\'s this? 问近处，What\'s that? 问远处。'),
      choice('pe3-u3-q4', 'It\'s a book 是什么意思？', ["这是书", "那是什么", "这是什么", "那是什么"], '这是书', 'It\'s a book = 它是一本书。'),
      fill('pe3-u3-q5', '橡皮的英文是：', 'eraser', 'eraser = 橡皮。'),
      choice('pe3-u3-q6', 'ruler 的中文意思是？', ["笔", "尺子", "橡皮", "书"], '尺子', 'ruler = 尺子。'),
      truefalse('pe3-u3-q7', 'this 用来指远处的东西。', '错', 'this 指近处，that 指远处。'),
      fill('pe3-u3-q8', '那是什么？ 用英语说：', 'What\'s that?', 'What\'s that? = 那是什么？'),
      choice('pe3-u3-q9', 'chair 的中文意思是？', ["桌子", "椅子", "书", "黑板"], '椅子', 'chair = 椅子。'),
      fill('pe3-u3-q10', '请用英语问这是什么？并回答（铅笔）：', 'What\'s this?It\'s a pencil', 'What\'s this? It\'s a pencil。'),
        ],
        aiContext: '三年级英语：教室用品词汇和询问物品的句型。'
      },
      {
        id: 'pe3-u4',
        order: 4,
        title: '动物描述',
        duration: '约 35 分钟',
        objectives: ["掌握常见动物的英文表达", "学会用形容词描述动物", "掌握 I like... 句型"],
        teach: {
          hook: '你最喜欢什么动物？小猫、小狗、大象、熊猫用英语怎么描述它们呢？',
          summary: '本课学习动物词汇和描述动物的句型。'
        },
        learn: {
          sections: [
            {
              title: '动物描述',
              content: `**常见动物**：
cat（猫）、dog（狗）、elephant（大象）、monkey（猴子）、panda（熊猫）

**形容词**：
big（大的）、small（小的）、cute（可爱的）、fast（快的）

**句型**：
The elephant is big. — 大象很大。
I like pandas. — 我喜欢熊猫。`
            }
          ],
          tips: ["看动物图片练习描述", "用 I like... 说出你喜欢的动物"]
        },
        practice: [
      choice('pe3-u4-q1', '大象的英文是？', ["tiger", "elephant", "monkey", "panda"], 'elephant', 'elephant = 大象。'),
      fill('pe3-u4-q2', '熊猫的英文是：', 'panda', 'panda = 熊猫。'),
      truefalse('pe3-u4-q3', 'The rabbit is big 的意思是兔子很大。', '对', 'The rabbit is big = 兔子很大。'),
      choice('pe3-u4-q4', 'I like cats 中为什么要用复数？', ["语法习惯", "猫不止一只", "都可以", "没有原因"], '语法习惯', 'like 后面通常用复数表示一类事物。'),
      fill('pe3-u4-q5', '可爱的的英文是：', 'cute', 'cute = 可爱的。'),
      choice('pe3-u4-q6', 'The elephant is big 描述了大象的什么？', ["颜色", "大小", "速度", "喜好"], '大小', 'big 描述大小。'),
      truefalse('pe3-u4-q7', 'I like 后面可以接单数名词。', '错', 'I like 后面通常接复数名词。'),
      fill('pe3-u4-q8', '我喜欢狗 用英语说：', 'I like dogs', 'I like dogs = 我喜欢狗。'),
      choice('pe3-u4-q9', 'tiger 的中文意思是？', ["老虎", "狮子", "熊", "狼"], '老虎', 'tiger = 老虎。'),
      fill('pe3-u4-q10', '请用英语描述一种动物（名字+特征）：', 'The...is...', '答案不唯一。'),
        ],
        aiContext: '三年级英语：动物词汇和描述动物的句型。'
      },
      {
        id: 'pe3-u5',
        order: 5,
        title: '简单句型',
        duration: '约 35 分钟',
        objectives: ["理解主谓宾结构", "掌握肯定句和否定句", "学会用英语表达日常活动"],
        teach: {
          hook: '英语句子的基本结构就像一条主语 + 谓语 + 宾语的链条。比如 I eat apples —— 我（主语）吃（谓语）苹果（宾语）。',
          summary: '本课学习主谓宾结构和肯定句/否定句的转换。'
        },
        learn: {
          sections: [
            {
              title: '简单句型',
              content: `**主谓宾结构**：
主语（谁）+ 谓语（做什么）+ 宾语（对谁/什么）

**例句**：
I eat apples. — 我吃苹果。
She reads books. — 她读书。

**肯定句变否定句**：
在动词前加 don't（do not）

**例句**：
I like apples. → I don't like apples.
She plays football. → She doesn't play football.`
            }
          ],
          tips: ["用谁做什么造句", "注意第三人称单数用 doesn't"]
        },
        practice: [
      choice('pe3-u5-q1', 'I eat apples 的宾语是？', ["I", "eat", "apples", "没有"], 'apples', 'apples 是宾语。'),
      fill('pe3-u5-q2', 'She reads books 的主语是：', 'She', 'She 是主语。'),
      truefalse('pe3-u5-q3', 'I don\'t like apples 是肯定句。', '错', 'don\'t 表示否定，是否定句。'),
      choice('pe3-u5-q4', '第三人称单数用什么构成否定？', ["don't", "doesn't", "not", "no"], 'doesn\'t', '第三人称单数用 doesn\'t。'),
      fill('pe3-u5-q5', 'We play football 的否定句是：', 'We don\'t play football', 'We don\'t play football。'),
      choice('pe3-u5-q6', 'They watch TV 的谓语是？', ["They", "watch", "TV", "They watch"], 'watch', 'watch 是谓语动词。'),
      truefalse('pe3-u5-q7', 'She doesn\'t swim 是正确的否定句。', '对', '第三人称用 doesn\'t。'),
      fill('pe3-u5-q8', '我读书 用英语说：', 'I read books', 'I read books = 我读书。'),
      choice('pe3-u5-q9', 'He likes apples 的否定句是？', ["He don't like apples", "He doesn't like apples", "He not like apples", "He no like apples"], 'He doesn\'t like apples', '第三人称用 doesn\'t。'),
      fill('pe3-u5-q10', '请造一个主谓宾句子并写出其否定句：', 'I...I don\'t...', '答案不唯一。'),
        ],
        aiContext: '三年级英语：主谓宾结构和肯定句/否定句转换。'
      },
    ]
  },
  // ========== 四年级 ==========
  {
    id: 'primary-english-4',
    grade: '4',
    gradeName: '四年级',
    subject: '英语',
    subjectIcon: '🔤',
    title: '四年级英语',
    description: '学习元音字母组合发音，掌握食物、时间、周末活动和电子邮件表达。',
    units: [
      {
        id: 'pe4-u1',
        order: 1,
        title: '元音字母组合',
        duration: '约 35 分钟',
        objectives: ["掌握 ai ee oa oo 的发音规则", "能拼读含这些组合的单词", "区分相似组合的发音"],
        teach: {
          hook: '两个元音字母在一起，会发出新的声音！ai 发 /eɪ/，ee 发 /iː/，oa 发 /əʊ/。',
          summary: '本课学习四个最常见的元音字母组合：ai, ee, oa, oo。'
        },
        learn: {
          sections: [
            {
              title: '元音字母组合',
              content: `**ai → /eɪ/**
例词：rain（雨）、train（火车）、tail（尾巴）

**ee → /iː/**
例词：tree（树）、see（看见）、feet（脚）

**oa → /əʊ/**
例词：boat（船）、coat（外套）、road（路）

**oo → /uː/** 或 /u/**
长音：moon、food、school
短音：book、look、good`
            }
          ],
          tips: ["用单词卡片归类记忆", "注意 oo 的长短音区别"]
        },
        practice: [
      choice('pe4-u1-q1', 'rain 中 ai 的发音是？', ["/e/", "/i:/", "/o/", "/ae/"], '/e/', 'ai 组合发 /e/ 音。'),
      fill('pe4-u1-q2', '树的英文是：', 'tree', 'tree = 树，含有 ee 组合。'),
      truefalse('pe4-u1-q3', 'book 和 moon 中 oo 发音相同。', '错', 'book 中 oo 发短音，moon 中 oo 发长音。'),
      choice('pe4-u1-q4', '下列哪个单词含有 oa 组合？', ["rain", "boat", "tree", "book"], 'boat', 'boat 含有 oa 组合。'),
      fill('pe4-u1-q5', '外套的英文是：', 'coat', 'coat = 外套，含有 oa 组合。'),
      choice('pe4-u1-q6', 'meet 中 ee 的发音是？', ["/e/", "/i:/", "/ae/", "/o/"], '/i:/', 'ee 组合发 /i:/ 音。'),
      truefalse('pe4-u1-q7', 'oa 和 ai 发音相同。', '错', 'oa 发 /o/，ai 发 /e/。'),
      fill('pe4-u1-q8', '请写出3个含有 ai 的单词：', 'rain,train,tail', '答案不唯一。'),
      choice('pe4-u1-q9', 'food 中 oo 的发音是？', ["/u/", "/u:/", "/o/", "/o:/"], '/u:/', 'food 中 oo 发长音 /u:/。'),
      fill('pe4-u1-q10', '请写出船的英文（含 oa）：', 'boat', 'boat = 船，含有 oa 组合。'),
        ],
        aiContext: '四年级英语：元音字母组合发音，ai ee oa oo 的发音规则。'
      },
      {
        id: 'pe4-u2',
        order: 2,
        title: '食物表达',
        duration: '约 35 分钟',
        objectives: ["掌握常见食物的英文表达", "学会用英语表达喜好", "掌握可数名词和不可数名词"],
        teach: {
          hook: '你最喜欢吃什么？苹果、面包、米饭、面条用英语怎么表达呢？',
          summary: '本课学习食物词汇和表达喜好的句型。'
        },
        learn: {
          sections: [
            {
              title: '食物表达',
              content: `**水果类**：apple（苹果）、banana（香蕉）、orange（橙子）
**主食类**：rice（米饭）、noodles（面条）、bread（面包）
**饮料类**：water（水）、milk（牛奶）、juice（果汁）

**句型**：
I like... — 我喜欢...
Do you like...? — 你喜欢...吗？
Yes, I do. / No, I don't. — 是的/不。`
            }
          ],
          tips: ["用食物图片学习词汇", "注意可数和不可数的区别"]
        },
        practice: [
      choice('pe4-u2-q1', '米饭的英文是？', ["noodles", "bread", "rice", "dumpling"], 'rice', 'rice = 米饭。'),
      fill('pe4-u2-q2', '香蕉的英文是：', 'banana', 'banana = 香蕉。'),
      truefalse('pe4-u2-q3', 'Do you like apples? 是一般疑问句。', '对', 'Do you like...? 是一般疑问句。'),
      choice('pe4-u2-q4', 'Do you like fish? 的肯定回答是？', ["Yes, I don't", "No, I do", "Yes, I do", "No, I don't"], 'Yes, I do', '肯定回答用 Yes, I do。'),
      fill('pe4-u2-q5', '牛奶的英文是：', 'milk', 'milk = 牛奶。'),
      choice('pe4-u2-q6', '下列哪个是不可数名词？', ["apple", "egg", "rice", "banana"], 'rice', 'rice 是不可数名词。'),
      truefalse('pe4-u2-q7', 'I like 后面只能接可数名词。', '错', 'I like 可以接可数和不可数名词。'),
      fill('pe4-u2-q8', '我喜欢苹果 用英语说：', 'I like apples', 'I like apples = 我喜欢苹果。'),
      choice('pe4-u2-q9', 'noodles 的中文意思是？', ["米饭", "面条", "面包", "饺子"], '面条', 'noodles = 面条。'),
      fill('pe4-u2-q10', '请用英语问你喜欢香蕉吗？并回答：', 'Do you like bananas?Yes, I do', 'Do you like bananas? Yes, I do。'),
        ],
        aiContext: '四年级英语：食物词汇和表达喜好的句型。'
      },
      {
        id: 'pe4-u3',
        order: 3,
        title: '时间表达',
        duration: '约 35 分钟',
        objectives: ["掌握钟点的英文表达", "学会用英语询问和回答时间", "掌握整点和半点的表达"],
        teach: {
          hook: '你知道用英语怎么问时间吗？What time is it? —— 现在几点了？',
          summary: '本课学习钟点表达和询问时间的句型。'
        },
        learn: {
          sections: [
            {
              title: '时间表达',
              content: `**整点**：...o'clock
例词：one o'clock, two o'clock

**半点**：half past...
例词：half past seven = 7:30

**句型**：
What time is it? — 现在几点了？
It's seven o'clock. — 七点钟了。`
            }
          ],
          tips: ["用实物钟表演练", "注意 o'clock 只能用于整点"]
        },
        practice: [
      choice('pe4-u3-q1', 'What time is it? 是什么意思？', ["今天星期几", "现在几点了", "你几岁了", "你在哪里"], '现在几点了', 'What time is it? = 现在几点了？'),
      fill('pe4-u3-q2', '3点钟 用英语说：', 'three o\'clock', '3:00 = three o\'clock。'),
      truefalse('pe4-u3-q3', 'half past seven 是7:30。', '对', 'half past seven = 7:30。'),
      choice('pe4-u3-q4', '7:15 的英语表达是？', ["half past seven", "a quarter past seven", "a quarter to seven", "seven forty-five"], 'a quarter past seven', '7:15 = a quarter past seven。'),
      fill('pe4-u3-q5', '现在几点了 用英语说：', 'What time is it?', 'What time is it? = 现在几点了？'),
      choice('pe4-u3-q6', 'AM 表示什么？', ["上午", "下午", "晚上", "中午"], '上午', 'AM = 上午。'),
      truefalse('pe4-u3-q7', 'o\'clock 可以用于任何时间。', '错', 'o\'clock 只能用于整点。'),
      fill('pe4-u3-q8', '8:30 用英语说：', 'half past eight', '8:30 = half past eight。'),
      choice('pe4-u3-q9', 'a quarter to eight 是几点？', ["8:15", "8:45", "7:45", "7:15"], '7:45', 'a quarter to eight = 7:45。'),
      fill('pe4-u3-q10', '请用英语问现在几点了？并回答（9点）：', 'What time is it?It\'s nine o\'clock', 'What time is it? It\'s nine o\'clock。'),
        ],
        aiContext: '四年级英语：时间表达，整点和非整点的英语表达方式。'
      },
      {
        id: 'pe4-u4',
        order: 4,
        title: '周末活动',
        duration: '约 35 分钟',
        objectives: ["掌握周末活动的英文表达", "学会用英语询问和回答周末活动", "掌握一般现在时的用法"],
        teach: {
          hook: '周末你通常做什么？看电视、踢足球、看书、做作业用英语怎么表达呢？',
          summary: '本课学习周末活动词汇和询问周末活动的句型。'
        },
        learn: {
          sections: [
            {
              title: '周末活动',
              content: `**常见活动**：
watch TV — 看电视
play football — 踢足球
read books — 看书
do homework — 做作业
go shopping — 去购物

**句型**：
What do you do on the weekend? — 你周末做什么？
I play football on the weekend. — 我周末踢足球。`
            }
          ],
          tips: ["用图片学习活动词汇", "注意第三人称单数动词加 s"]
        },
        practice: [
      choice('pe4-u4-q1', '看电视的英文是？', ["read books", "watch TV", "play football", "do homework"], 'watch TV', 'watch TV = 看电视。'),
      fill('pe4-u4-q2', '做作业的英文是：', 'do homework', 'do homework = 做作业。'),
      truefalse('pe4-u4-q3', 'What do you do on the weekend? 问的是周末活动。', '对', 'What do you do on the weekend? = 你周末做什么？'),
      choice('pe4-u4-q4', '第三人称单数动词要？', ["加 s", "加 ed", "加 ing", "不变"], '加 s', '第三人称单数动词要加 s。'),
      fill('pe4-u4-q5', '我周末踢足球 用英语说：', 'I play football on the weekend', 'I play football on the weekend。'),
      choice('pe4-u4-q6', 'go shopping 的中文意思是？', ["去购物", "去公园", "去看书", "去学校"], '去购物', 'go shopping = 去购物。'),
      truefalse('pe4-u4-q7', 'He play football 是正确的。', '错', '应该是 He plays football。'),
      fill('pe4-u4-q8', '你周末做什么 用英语说：', 'What do you do on the weekend?', 'What do you do on the weekend?'),
      choice('pe4-u4-q9', 'visit grandparents 的中文意思是？', ["看望祖父母", "看望朋友", "看望老师", "看望同学"], '看望祖父母', 'visit grandparents = 看望祖父母。'),
      fill('pe4-u4-q10', '请用英语描述你的周末活动（至少2个）：', 'I...and...on the weekend', '答案不唯一。'),
        ],
        aiContext: '四年级英语：周末活动词汇和询问周末活动的句型。'
      },
      {
        id: 'pe4-u5',
        order: 5,
        title: '电子邮件',
        duration: '约 35 分钟',
        objectives: ["了解电子邮件的基本格式", "学会写简单的英文邮件", "掌握邮件的开头和结尾"],
        teach: {
          hook: '你们写过信吗？现在人们常用电子邮件（email）来联系。英文邮件有固定的格式。',
          summary: '本课学习英文电子邮件的基本格式和写法。'
        },
        learn: {
          sections: [
            {
              title: '电子邮件',
              content: `**电子邮件的基本结构**：

To: friend@email.com（收件人）
Subject: Hello from Xiaoming（主题）

Dear Lily,（开头）

Hello! How are you? I'm fine.

Best wishes,（结尾）
Xiaoming（署名）`
            }
          ],
          tips: ["注意邮件的格式", "开头和结尾要礼貌"]
        },
        practice: [
      choice('pe4-u5-q1', '英文邮件的开头通常用什么？', ["Dear", "Hello", "Hi", "以上都可以"], '以上都可以', '英文邮件开头可以用 Dear / Hello / Hi。'),
      fill('pe4-u5-q2', '祝好的英文是：', 'Best wishes', 'Best wishes = 祝好。'),
      truefalse('pe4-u5-q3', '英文邮件不需要署名。', '错', '英文邮件需要署名。'),
      choice('pe4-u5-q4', 'How are you? 通常出现在邮件的哪个部分？', ["开头", "正文", "结尾", "主题"], '开头', 'How are you? 通常出现在邮件开头。'),
      fill('pe4-u5-q5', '亲爱的Tom 用英语说：', 'Dear Tom', 'Dear Tom = 亲爱的Tom。'),
      choice('pe4-u5-q6', '下列哪个是邮件的结尾祝福？', ["Best wishes", "How are you", "I'm fine", "Thank you"], 'Best wishes', 'Best wishes 是结尾祝福。'),
      truefalse('pe4-u5-q7', '邮件的主题（Subject）是可选的。', '错', '邮件应该有主题。'),
      fill('pe4-u5-q8', '请写一封简单的英文邮件开头（给Lily，问候）：', 'Dear Lily,How are you?', 'Dear Lily, How are you?'),
      choice('pe4-u5-q9', 'Yours 在邮件中是什么意思？', ["你的（祝福）", "你", "你们", "你们的"], '你的（祝福）', 'Yours 是邮件结尾祝福。'),
      fill('pe4-u5-q10', '请写一封完整的简单英文邮件（给朋友，包含开头、正文、结尾）：', 'Dear...,...Best wishes,...', '答案不唯一。'),
        ],
        aiContext: '四年级英语：电子邮件格式和写法。'
      },
    ]
  },
  // ========== 五年级 ==========
  {
    id: 'primary-english-5',
    grade: '5',
    gradeName: '五年级',
    subject: '英语',
    subjectIcon: '🔤',
    title: '五年级英语',
    description: '学习句型转换、季节描述、生日派对、问路指路和故事阅读。',
    units: [
      {
        id: 'pe5-u1',
        order: 1,
        title: '句型转换',
        duration: '约 35 分钟',
        objectives: ["掌握肯定句变疑问句的规则", "学会用 Do/Does 提问", "能进行句型转换练习"],
        teach: {
          hook: '把一个陈述句变成疑问句，就像玩魔术一样！I like apples 变成 Do you like apples?，只需要在开头加一个 Do 就行了！',
          summary: '本课学习肯定句和疑问句的转换规则。'
        },
        learn: {
          sections: [
            {
              title: '句型转换',
              content: `**用 Do 提问**：
在句首加 Do，句号变问号

例句：
I like apples. → Do you like apples?
They play football. → Do they play football?

**用 Does 提问**：
第三人称单数用 Does，动词恢复原形

例句：
He likes apples. → Does he like apples?`
            }
          ],
          tips: ["注意第三人称用 Does", "Does 后面的动词要恢复原形"]
        },
        practice: [
      choice('pe5-u1-q1', 'I like apples 变成疑问句是？', ["I like apples?", "Do you like apples?", "Does you like apples?", "Like you apples?"], 'Do you like apples?', '肯定句变疑问句，句首加 Do。'),
      fill('pe5-u1-q2', 'She plays football 变成疑问句：', 'Does she play football?', '第三人称用 Does，动词恢复原形。'),
      truefalse('pe5-u1-q3', 'Does he like apples? 中 like 应该加 s。', '错', 'Does 后面的动词用原形，不加 s。'),
      choice('pe5-u1-q4', 'Do you like fish? 的否定回答是？', ["Yes, I don't", "No, I do", "No, I don't", "Yes, no"], 'No, I don\'t', '否定回答用 No, I don\'t。'),
      fill('pe5-u1-q5', 'They read books 变成疑问句：', 'Do they read books?', '非第三人称用 Do。'),
      choice('pe5-u1-q6', '下列哪个是正确的疑问句？', ["Does she likes football?", "Do she like football?", "Does she play football?", "Do she plays football?"], 'Does she play football?', '第三人称用 Does，动词原形。'),
      truefalse('pe5-u1-q7', 'Does 用于第一人称。', '错', 'Does 用于第三人称单数。'),
      fill('pe5-u1-q8', 'He reads books 变成疑问句：', 'Does he read books?', '第三人称用 Does，reads → read。'),
      choice('pe5-u1-q9', 'Do they play football? 的肯定回答是？', ["Yes, they do", "Yes, they does", "Yes, do they", "Yes, they don't"], 'Yes, they do', '肯定回答用 Yes, they do。'),
      fill('pe5-u1-q10', '请将 We watch TV 变成疑问句并回答：', 'Do you watch TV?Yes, I do', 'Do you watch TV? Yes, I do。'),
        ],
        aiContext: '五年级英语：句型转换，肯定句变疑问句的规则。'
      },
      {
        id: 'pe5-u2',
        order: 2,
        title: '季节描述',
        duration: '约 35 分钟',
        objectives: ["掌握四季的英文表达", "学会描述每个季节的特点", "掌握 Which 引导的特殊疑问句"],
        teach: {
          hook: '一年有四个季节：春天温暖，夏天炎热，秋天凉爽，冬天寒冷。',
          summary: '本课学习四季词汇和描述季节的句型。'
        },
        learn: {
          sections: [
            {
              title: '季节描述',
              content: `**四季词汇**：
spring（春天）、summer（夏天）、autumn/fall（秋天）、winter（冬天）

**描述天气**：
warm（温暖）、hot（炎热）、cool（凉爽）、cold（寒冷）

**句型**：
Which season do you like best? — 你最喜欢哪个季节？
I like summer best. — 我最喜欢夏天。`
            }
          ],
          tips: ["用图片展示四季特点", "注意 favourite 的拼写"]
        },
        practice: [
      choice('pe5-u2-q1', '夏天的英文是？', ["spring", "summer", "autumn", "winter"], 'summer', 'summer = 夏天。'),
      fill('pe5-u2-q2', '冬天很冷 用英语说：', 'It\'s cold in winter', 'It\'s cold in winter。'),
      truefalse('pe5-u2-q3', 'Which season do you like best? 问的是最喜欢的季节。', '对', 'Which season do you like best? = 你最喜欢哪个季节？'),
      choice('pe5-u2-q4', '你最喜欢哪个季节 用英语说？', ["What season do you like", "Which season do you like best", "How season do you like", "Do you like which season"], 'Which season do you like best', 'Which season do you like best?'),
      fill('pe5-u2-q5', '秋天的英文是：', 'autumn/fall', 'autumn / fall = 秋天。'),
      choice('pe5-u2-q6', 'warm 的中文意思是？', ["炎热", "温暖", "凉爽", "寒冷"], '温暖', 'warm = 温暖的。'),
      truefalse('pe5-u2-q7', 'favourite 是喜欢的意思。', '对', 'favourite = 最喜欢的。'),
      fill('pe5-u2-q8', '我最喜欢春天 用英语说：', 'I like spring best', 'I like spring best = 我最喜欢春天。'),
      choice('pe5-u2-q9', 'cool 描述的是哪个季节？', ["春天", "夏天", "秋天", "冬天"], '秋天', 'cool = 凉爽的，描述秋天。'),
      fill('pe5-u2-q10', '请用英语描述你最喜欢的季节和原因：', 'My favourite season is...Because...', '答案不唯一。'),
        ],
        aiContext: '五年级英语：四季词汇和描述季节的句型。'
      },
      {
        id: 'pe5-u3',
        order: 3,
        title: '生日派对',
        duration: '约 35 分钟',
        objectives: ["掌握生日相关的英文表达", "学会用英语祝福生日", "掌握 How old 和 When 的提问"],
        teach: {
          hook: '你们喜欢生日吗？生日有蛋糕、蜡烛、礼物，还有生日歌！',
          summary: '本课学习生日相关的词汇和句型。'
        },
        learn: {
          sections: [
            {
              title: '生日派对',
              content: `**生日词汇**：
birthday（生日）、birthday cake（生日蛋糕）、candle（蜡烛）、present/gift（礼物）

**句型**：
When is your birthday? — 你的生日是什么时候？
My birthday is in May. — 我的生日在五月。
How old are you? — 你几岁了？`
            }
          ],
          tips: ["学唱英文生日歌", "用月份卡片记忆"]
        },
        practice: [
      choice('pe5-u3-q1', '生日快乐 的英文是？', ["Happy New Year", "Happy Birthday", "Happy Holiday", "Happy Weekend"], 'Happy Birthday', 'Happy Birthday = 生日快乐。'),
      fill('pe5-u3-q2', '我的生日在六月 用英语说：', 'My birthday is in June', 'My birthday is in June。'),
      truefalse('pe5-u3-q3', 'When is your birthday? 问的是生日日期。', '对', 'When is your birthday? = 你的生日是什么时候？'),
      choice('pe5-u3-q4', 'candle 的中文意思是？', ["蛋糕", "礼物", "蜡烛", "卡片"], '蜡烛', 'candle = 蜡烛。'),
      fill('pe5-u3-q5', '你几岁了 用英语说：', 'How old are you?', 'How old are you? = 你几岁了？'),
      choice('pe5-u3-q6', 'present 的中文意思是？', ["派对", "礼物", "蛋糕", "蜡烛"], '礼物', 'present = 礼物。'),
      truefalse('pe5-u3-q7', 'My birthday is on May 是正确的表达。', '错', '月份前用 in：My birthday is in May。'),
      fill('pe5-u3-q8', '我的生日是3月15日 用英语说：', 'My birthday is on March 15th', 'My birthday is on March 15th。'),
      choice('pe5-u3-q9', 'party 的中文意思是？', ["派对", "生日", "礼物", "蛋糕"], '派对', 'party = 派对。'),
      fill('pe5-u3-q10', '请写一段生日祝福对话：', 'A: Happy Birthday!B: Thank you!A: How old...B: I\'m...', '答案不唯一。'),
        ],
        aiContext: '五年级英语：生日相关的词汇和句型。'
      },
      {
        id: 'pe5-u4',
        order: 4,
        title: '问路指路',
        duration: '约 35 分钟',
        objectives: ["掌握地点的英文表达", "学会用英语问路和指路", "掌握方位介词的用法"],
        teach: {
          hook: '如果你在一个陌生的地方，想去公园或学校，该怎么用英语问路呢？',
          summary: '本课学习问路和指路的句型。'
        },
        learn: {
          sections: [
            {
              title: '问路指路',
              content: `**常见地点**：
park（公园）、school（学校）、hospital（医院）、library（图书馆）

**问路**：
Excuse me, where is the...? — 请问，...在哪里？

**指路**：
Go straight. — 直走。
Turn left / right. — 左转/右转。
It's next to the... — 它在...旁边。`
            }
          ],
          tips: ["用地图练习问路", "注意 left 和 right 的区别"]
        },
        practice: [
      choice('pe5-u4-q1', 'Excuse me, where is the park 是什么意思？', ["公园漂亮吗", "请问公园在哪里", "公园远吗", "公园大吗"], '请问公园在哪里', 'Excuse me, where is the park? = 请问公园在哪里？'),
      fill('pe5-u4-q2', '直走 用英语说：', 'Go straight', 'Go straight = 直走。'),
      truefalse('pe5-u4-q3', 'Turn left 是右转。', '错', 'Turn left = 左转，Turn right = 右转。'),
      choice('pe5-u4-q4', '它在学校旁边 用英语说？', ["It's behind the school", "It's next to the school", "It's in front of the school", "It's in the school"], 'It\'s next to the school', 'next to = 旁边。'),
      fill('pe5-u4-q5', '请问，图书馆在哪里 用英语说：', 'Excuse me, where is the library', 'Excuse me, where is the library?'),
      choice('pe5-u4-q6', 'hospital 的中文意思是？', ["学校", "医院", "公园", "超市"], '医院', 'hospital = 医院。'),
      truefalse('pe5-u4-q7', 'behind 是前面的意思。', '错', 'behind = 后面，in front of = 前面。'),
      fill('pe5-u4-q8', '右转 用英语说：', 'Turn right', 'Turn right = 右转。'),
      choice('pe5-u4-q9', 'How can I get to the park 是什么意思？', ["公园漂亮吗", "请问怎么去公园", "公园远吗", "公园在哪里"], '请问怎么去公园', 'How can I get to the park? = 请问怎么去公园？'),
      fill('pe5-u4-q10', '请写一段问路对话：', 'A: Excuse me, where is...?B: Go straight...A: Thank you!', '答案不唯一。'),
        ],
        aiContext: '五年级英语：问路和指路的句型。'
      },
      {
        id: 'pe5-u5',
        order: 5,
        title: '故事阅读',
        duration: '约 35 分钟',
        objectives: ["能读懂简单的英文故事", "掌握阅读技巧（预测、猜测词义）", "能复述故事大意"],
        teach: {
          hook: '你们听过《三只小猪》的故事吗？今天我们用英语来读这个故事！',
          summary: '本课通过《三只小猪》故事学习阅读技巧。'
        },
        learn: {
          sections: [
            {
              title: '故事阅读',
              content: `**The Three Little Pigs**

Once upon a time, there were three little pigs.
The first pig built a house of straw.
The second pig built a house of wood.
The third pig built a house of bricks.

A big bad wolf came.
He blew down the straw house!
He blew down the wood house!
But he could NOT blow down the brick house!

The three little pigs were safe.`
            }
          ],
          tips: ["先看插图预测故事", "遇到生词先猜意思"]
        },
        practice: [
      choice('pe5-u5-q1', '故事里有几只小猪？', ["2只", "3只", "4只", "5只"], '3只', '故事里有三只小猪。'),
      fill('pe5-u5-q2', 'wood 的中文意思是：', '木头', 'wood = 木头。'),
      truefalse('pe5-u5-q3', '大灰狼吹倒了砖房。', '错', '大灰狼吹不倒砖房。'),
      choice('pe5-u5-q4', 'blow down 是什么意思？', ["建造", "吹倒", "打扫", "修缮"], '吹倒', 'blow down = 吹倒。'),
      fill('pe5-u5-q5', '砖头的英文是：', 'brick', 'brick = 砖头。'),
      choice('pe5-u5-q6', '第三只小猪建了什么房子？', ["稻草房", "木头房", "砖房", "石头房"], '砖房', '第三只小猪建了砖房。'),
      truefalse('pe5-u5-q7', 'safe 是危险的意思。', '错', 'safe = 安全的。'),
      fill('pe5-u5-q8', '狼的英文是：', 'wolf', 'wolf = 狼。'),
      choice('pe5-u5-q9', '最后三只小猪在哪里？', ["稻草房里", "木头房里", "砖房里", "外面"], '砖房里', '最后三只小猪在砖房里。'),
      solve('pe5-u5-q10', '请用自己的话复述《三只小猪》的故事（用中文也可以）', '三只小猪建了不同的房子...', '能说出故事大意即可。'),
        ],
        aiContext: '五年级英语：故事阅读，《三只小猪》英文故事。'
      },
    ]
  },
  // ========== 六年级 ==========
  {
    id: 'primary-english-6',
    grade: '6',
    gradeName: '六年级',
    subject: '英语',
    subjectIcon: '🔤',
    title: '六年级英语',
    description: '学习时态入门、比较级最高级、阅读理解、写作基础和总复习。',
    units: [
      {
        id: 'pe6-u1',
        order: 1,
        title: '时态入门',
        duration: '约 35 分钟',
        objectives: ["理解三种基本时态的用法", "掌握各种时态的动词变化", "能正确使用时态表达"],
        teach: {
          hook: '英语用动词的变化来表示时间。I eat 是现在吃，I ate 是过去吃，I will eat 是将要吃。',
          summary: '本课学习一般现在时、一般过去时和一般将来时。'
        },
        learn: {
          sections: [
            {
              title: '时态入门',
              content: `**一般现在时**：表示经常做的事或事实
结构：主语 + 动词原形/第三人称单数
例句：I play football every day.

**一般过去时**：表示过去发生的事
结构：主语 + 动词过去式
例句：I played football yesterday.

**一般将来时**：表示将要发生的事
结构：主语 + will + 动词原形
例句：I will play football tomorrow.`
            }
          ],
          tips: ["记住时间标志词", "不规则动词过去式要背诵"]
        },
        practice: [
      choice('pe6-u1-q1', 'I play football every day 是什么时态？', ["一般现在时", "一般过去时", "一般将来时", "现在进行时"], '一般现在时', 'every day 表示经常做的事。'),
      fill('pe6-u1-q2', 'go 的过去式是：', 'went', 'go → went（不规则变化）。'),
      truefalse('pe6-u1-q3', 'I will play football 是一般将来时。', '对', 'will + 动词原形是一般将来时。'),
      choice('pe6-u1-q4', 'yesterday 是什么时态的标志词？', ["一般现在时", "一般过去时", "一般将来时", "现在进行时"], '一般过去时', 'yesterday 是一般过去时的标志词。'),
      fill('pe6-u1-q5', '我昨天去了公园 用英语说：', 'I went to the park yesterday', 'I went to the park yesterday。'),
      choice('pe6-u1-q6', 'She plays football 中为什么 play 加 s？', ["第三人称单数", "过去式", "将来时", "进行时"], '第三人称单数', '第三人称单数动词要加 s。'),
      truefalse('pe6-u1-q7', 'be going to 也可以表示将来。', '对', 'be going to + 动词原形表示将来。'),
      fill('pe6-u1-q8', '我明天要游泳 用英语说：', 'I will swim tomorrow', 'I will swim tomorrow。'),
      choice('pe6-u1-q9', 'last week 是什么时态的标志词？', ["一般现在时", "一般过去时", "一般将来时", "现在进行时"], '一般过去时', 'last week 是一般过去时的标志词。'),
      fill('pe6-u1-q10', '请用三种时态各造一个句子：', 'I...I...I will...', '答案不唯一。'),
        ],
        aiContext: '六年级英语：时态入门，一般现在时/过去时/将来时。'
      },
      {
        id: 'pe6-u2',
        order: 2,
        title: '比较级最高级',
        duration: '约 35 分钟',
        objectives: ["掌握比较级和最高级的构成规则", "学会用比较级和最高级描述事物", "掌握不规则变化"],
        teach: {
          hook: '比较两个东西用比较级，比较三个以上用最高级。big → bigger → biggest',
          summary: '本课学习比较级和最高级的构成和用法。'
        },
        learn: {
          sections: [
            {
              title: '比较级最高级',
              content: `**构成规则**：
单音节词：加 -er / -est
tall → taller → tallest
big → bigger → biggest

多音节词：前加 more / most
beautiful → more beautiful → most beautiful

**不规则变化**：
good → better → best
bad → worse → worst`
            }
          ],
          tips: ["记住不规则变化", "注意 than 和 the 的使用"]
        },
        practice: [
      choice('pe6-u2-q1', 'big 的比较级是？', ["biger", "bigger", "more big", "most big"], 'bigger', 'big 双写 g 加 er：bigger。'),
      fill('pe6-u2-q2', 'good 的最高级是：', 'best', 'good → better → best（不规则）。'),
      truefalse('pe6-u2-q3', 'beautiful 的比较级是 more beautiful。', '对', '多音节词前加 more。'),
      choice('pe6-u2-q4', 'Tom is taller than Lily 是什么意思？', ["Tom比Lily矮", "Tom比Lily高", "Tom和Lily一样高", "Lily比Tom高"], 'Tom比Lily高', 'taller than = 比...高。'),
      fill('pe6-u2-q5', 'bad 的比较级是：', 'worse', 'bad → worse → worst（不规则）。'),
      choice('pe6-u2-q6', 'the tallest 是什么级？', ["原级", "比较级", "最高级", "进行时"], '最高级', 'the + 最高级。'),
      truefalse('pe6-u2-q7', 'interesting 的比较级是 interestinger。', '错', '多音节词前加 more：more interesting。'),
      fill('pe6-u2-q8', '这是我们班最好的学生 用英语说：', 'He is the best student in our class', 'He is the best student in our class。'),
      choice('pe6-u2-q9', 'many 的比较级是？', ["more", "most", "manier", "much"], 'more', 'many → more → most（不规则）。'),
      fill('pe6-u2-q10', '请用比较级和最高级各造一个句子：', '...is...than.../...is the...', '答案不唯一。'),
        ],
        aiContext: '六年级英语：比较级和最高级的构成规则和用法。'
      },
      {
        id: 'pe6-u3',
        order: 3,
        title: '阅读理解',
        duration: '约 35 分钟',
        objectives: ["掌握阅读理解的基本技巧", "能读懂简单的英文短文", "能回答短文相关问题"],
        teach: {
          hook: '阅读理解就像当侦探一样！你需要从文章中找出答案。',
          summary: '本课学习阅读理解的基本技巧。'
        },
        learn: {
          sections: [
            {
              title: '阅读理解',
              content: `**阅读技巧**：
略读（Skim）：快速浏览，了解大意
扫读（Scan）：带着问题找答案
精读（Read carefully）：仔细阅读，理解细节

**短文**：
My name is Lily. I'm 12 years old. I study in No. 1 Primary School. I like reading and drawing. My favourite season is summer because I can swim.`
            }
          ],
          tips: ["先看问题再读文章", "画出关键词"]
        },
        practice: [
      choice('pe6-u3-q1', 'Lily 几岁了？', ["10", "11", "12", "13"], '12', 'I\'m 12 years old。'),
      fill('pe6-u3-q2', 'Lily 喜欢什么？（写出两个）：', 'reading and drawing', 'I like reading and drawing。'),
      truefalse('pe6-u3-q3', 'Lily 喜欢夏天是因为可以滑冰。', '错', 'Lily 喜欢夏天是因为可以游泳。'),
      choice('pe6-u3-q4', '猫叫什么名字？', ["Lily", "Mimi", "Lucy", "Tom"], 'Mimi', 'Its name is Mimi。'),
      fill('pe6-u3-q5', 'Lily 在哪所学校上学：', 'No.1 Primary School', 'I study in No. 1 Primary School。'),
      choice('pe6-u3-q6', '猫是什么颜色的？', ["黑色", "白色", "棕色", "黄色"], '白色', 'It\'s white。'),
      truefalse('pe6-u3-q7', 'Lily 不喜欢她的猫。', '错', 'I love my cat very much。'),
      fill('pe6-u3-q8', '略读 的英文是：', 'Skim', 'Skim = 略读。'),
      choice('pe6-u3-q9', '带着问题找答案 是什么阅读技巧？', ["略读", "扫读", "精读", "默读"], '扫读', 'Scan = 扫读。'),
      solve('pe6-u3-q10', '请用英语写一段自我介绍（至少4句话，包含名字、年龄、喜好）', 'My name is...I\'m...I like...', '答案不唯一。'),
        ],
        aiContext: '六年级英语：阅读理解技巧和短文阅读练习。'
      },
      {
        id: 'pe6-u4',
        order: 4,
        title: '写作基础',
        duration: '约 35 分钟',
        objectives: ["掌握英文段落的基本结构", "学会写简单的英文段落", "掌握写作的基本步骤"],
        teach: {
          hook: '写作文就像建房子：先搭框架（主题句），再填砖块（细节句），最后装修（结尾句）。',
          summary: '本课学习英文段落的基本结构和写作步骤。'
        },
        learn: {
          sections: [
            {
              title: '写作基础',
              content: `**段落结构**：
主题句（Topic Sentence）：告诉读者你要写什么
细节句（Detail Sentences）：用例子和原因支持主题句
结尾句（Closing Sentence）：总结段落

**写作步骤**：
1. 确定主题
2. 列提纲
3. 写草稿
4. 检查修改`
            }
          ],
          tips: ["先列提纲再写", "注意段落结构"]
        },
        practice: [
      choice('pe6-u4-q1', '段落的第一句通常是什么？', ["细节句", "主题句", "结尾句", "过渡句"], '主题句', '段落的第一句通常是主题句。'),
      fill('pe6-u4-q2', '细节句 的英文是：', 'Detail Sentences', 'Detail Sentences = 细节句。'),
      truefalse('pe6-u4-q3', '写作文不需要列提纲。', '错', '列提纲可以帮助组织思路。'),
      choice('pe6-u4-q4', '写作的第几步是检查修改？', ["第一步", "第二步", "第三步", "第四步"], '第四步', '第四步是检查修改。'),
      fill('pe6-u4-q5', '结尾句 的英文是：', 'Closing Sentence', 'Closing Sentence = 结尾句。'),
      choice('pe6-u4-q6', '下列哪个不是写作步骤？', ["确定主题", "列提纲", "检查修改", "背诵课文"], '背诵课文', '背诵课文不是写作步骤。'),
      truefalse('pe6-u4-q7', '主题句告诉读者你要写什么。', '对', '主题句的作用是告诉读者主题。'),
      fill('pe6-u4-q8', '请写一个段落的主题句（关于你最喜欢的食物）：', 'My favourite food is...', 'My favourite food is...'),
      choice('pe6-u4-q9', '写作文时，细节句的作用是什么？', ["总结段落", "支持主题句", "引出话题", "过渡"], '支持主题句', '细节句支持主题句。'),
      solve('pe6-u4-q10', '请用英语写一段话介绍你最喜欢的季节（至少4句话）', 'My favourite season is...', '答案不唯一。'),
        ],
        aiContext: '六年级英语：写作基础，段落结构和写作步骤。'
      },
      {
        id: 'pe6-u5',
        order: 5,
        title: '总复习',
        duration: '约 35 分钟',
        objectives: ["系统复习小学英语核心知识", "查漏补缺，巩固薄弱环节", "为初中英语学习打好基础"],
        teach: {
          hook: '马上就要毕业了！我们一起回顾一下小学六年学过的英语知识。',
          summary: '本课系统复习小学英语核心知识点。'
        },
        learn: {
          sections: [
            {
              title: '总复习',
              content: `**语音复习**：
26个字母、元音辅音、字母组合（ee, ea, sh, ch）

**语法复习**：
时态：一般现在时、一般过去时、一般将来时
句型：肯定句、否定句、疑问句
比较级和最高级

**写作复习**：
段落结构：主题句 + 细节句 + 结尾句`
            }
          ],
          tips: ["回顾笔记和错题", "重点复习薄弱环节"]
        },
        practice: [
      choice('pe6-u5-q1', '英语共有多少个字母？', ["24", "26", "28", "30"], '26', '英语有26个字母。'),
      fill('pe6-u5-q2', 'eat 的过去式是：', 'ate', 'eat → ate（不规则）。'),
      truefalse('pe6-u5-q3', 'Do you like apples? 是一般疑问句。', '对', 'Do you like...? 是一般疑问句。'),
      choice('pe6-u5-q4', 'big 的比较级是？', ["biger", "bigger", "more big", "most big"], 'bigger', 'big 双写 g 加 er。'),
      fill('pe6-u5-q5', '现在几点了 用英语说：', 'What time is it?', 'What time is it?'),
      choice('pe6-u5-q6', '下列哪个是元音组合？', ["sh", "ch", "ee", "th"], 'ee', 'ee 是元音组合。'),
      truefalse('pe6-u5-q7', '段落的第一句通常是结尾句。', '错', '段落的第一句通常是主题句。'),
      fill('pe6-u5-q8', '我喜欢苹果 用英语说：', 'I like apples', 'I like apples。'),
      choice('pe6-u5-q9', 'How many 问的是什么？', ["多少", "什么", "哪里", "什么时候"], '多少', 'How many = 多少？'),
      solve('pe6-u5-q10', '请用英语写一段话介绍自己（至少5句话）', 'My name is...I\'m...I like...', '答案不唯一。'),
        ],
        aiContext: '六年级英语：总复习，系统回顾小学英语核心知识。'
      },
    ]
  },
];