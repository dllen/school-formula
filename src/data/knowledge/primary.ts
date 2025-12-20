import type { GradeData } from '../types';

export const PRIMARY_DATA: GradeData = {
    id: 'primary',
    name: '小学',
    subjects: [
        {
            id: 'math-primary',
            name: '数学',
            icon: '🔢',
            knowledgePoints: [
                {
                    id: 'p-math-1',
                    title: '数的认识',
                    description: '整数、小数、分数的认识与比较。',
                    detailedExplanation: `
            1. **整数**：像0, 1, 2, 3...这样的数叫整数。
            2. **小数**：把整数"1"平均分成10份、100份……这样的一份或几份是十分之几、百分之几……可以用小数表示。
            3. **分数**：把单位"1"平均分成若干份，表示这样的一份或几份的数叫做分数。
          `,
                    studyTips: [
                        '结合生活实际理解数的大小，如比身高、比价格。',
                        '多画图，用数轴来辅助理解正负数。'
                    ],
                    practiceQuestions: [
                        { question: '最小的自然数是几？', answer: '0' },
                        { question: '0.5等于几分之几？', answer: '1/2' }
                    ]
                },
                {
                    id: 'p-math-2',
                    title: '四则运算',
                    description: '加减乘除运算规则，速算与巧算。',
                    detailedExplanation: `
            1. **加法**：把两个数合并成一个数的运算。
            2. **减法**：已知两个加数的和与其中一个加数，求另一个加数的运算。
            3. **乘法**：求几个相同加数的和的简便运算。
            4. **除法**：已知两个因数的积与其中一个因数，求另一个因数的运算。
            **运算顺序**：先乘除，后加减，有括号先算括号。
          `,
                    studyTips: [
                        '熟背九九乘法表是基础。',
                        '掌握"凑十法"、"破十法"提高计算速度。',
                        '注意验算，养成检查的好习惯。'
                    ],
                    practiceQuestions: [
                        { question: '25 × 4 = ?', answer: '100' },
                        { question: '100 - 36 = ?', answer: '64' }
                    ]
                },
                {
                    id: 'p-math-3',
                    title: '常见量',
                    description: '长度、面积、体积、质量、时间、人民币单位及换算。',
                    detailedExplanation: `
            **长度单位**：千米(km)、米(m)、分米(dm)、厘米(cm)、毫米(mm)。
            **质量单位**：吨(t)、千克(kg)、克(g)。
            **时间单位**：年、月、日、时、分、秒。
            **进率**：
            1米=10分米=100厘米
            1千克=1000克
            1时=60分
          `,
                    studyTips: [
                        '建立量感：知道1米大概多长（张开双臂），1千克大概多重（两瓶水）。',
                        '记住特殊的进率，如1平方千米=100公顷。'
                    ],
                    practiceQuestions: [
                        { question: '3000米 = ? 千米', answer: '3' },
                        { question: '2小时15分 = ? 分', answer: '135' }
                    ]
                },
                { id: 'p-math-4', title: '图形与几何', description: '平面图形（长方形、正方形、三角形、梯形、圆）与立体图形（长方体、正方体、圆柱、圆锥）的认识与计算。' },
                { id: 'p-math-5', title: '统计与概率', description: '平均数、条形统计图、折线统计图、扇形统计图。' },
                { id: 'p-math-6', title: '应用题', description: '行程问题、工程问题、鸡兔同笼等典型应用题。' },
            ]
        },
        {
            id: 'chinese-primary',
            name: '语文',
            icon: '📝',
            knowledgePoints: [
                {
                    id: 'p-chi-1',
                    title: '拼音与字词',
                    description: '声母韵母、整体认读音节、查字典、组词造句。',
                    detailedExplanation: `
            **声母**：b, p, m, f, d, t, n, l... 共23个。
            **韵母**：a, o, e, i, u, ü... 共24个。
            **整体认读音节**：zhi, chi, shi, ri, zi, ci, si, yi, wu, yu, ye, yue, yuan, yin, yun, ying (16个)。
            **标调规则**：
            有a不放过，没a找o, e；
            i, u并列标在后，单个韵母不用说。
          `,
                    studyTips: [
                        '多读多练，注意平翘舌、前后鼻音的区别。',
                        '遇到不认识的字勤查字典，养成积累生字本的习惯。'
                    ],
                    practiceQuestions: [
                        { question: '写出"西安"的拼音（注意隔音符号）', answer: 'xī\'ān' },
                        { question: '整体认读音节有哪些？请列举三个。', answer: 'yi, wu, yu (答案不唯一)' }
                    ]
                },
                {
                    id: 'p-chi-2',
                    title: '歇后语与谚语',
                    description: '常见歇后语、谚语积累。',
                    detailedExplanation: `
            **歇后语**：由前后两部分组成，前一部分起"引子"作用，像谜面；后一部分起"后衬"作用，像谜底。
            **谚语**：广泛流传于民间的简练通俗而富于意义的短句。
            
            *常见例子*：
            - 竹篮打水 —— 一场空
            - 芝麻开花 —— 节节高
            - 八仙过海 —— 各显神通
          `,
                    studyTips: [
                        '结合故事背景记忆歇后语更有趣。',
                        '尝试在作文中运用一两句歇后语，增加文采。'
                    ]
                },
                { id: 'p-chi-3', title: '标点符号', description: '逗号、句号、问号、感叹号、引号等的用法。' },
                { id: 'p-chi-4', title: '修辞手法', description: '比喻、拟人、排比、夸张、反问、设问。' },
                {
                    id: 'p-chi-5',
                    title: '古诗文诵读',
                    description: '小学生必背古诗75首及注释。',
                    detailedExplanation: `
            **《静夜思》** 李白
            床前明月光，疑是地上霜。
            举头望明月，低头思故乡。

            **《春晓》** 孟浩然
            春眠不觉晓，处处闻啼鸟。
            夜来风雨声，花落知多少。
            
            **赏析重点**：理解诗人的情感，想象诗中的画面，体会对仗工整之美。
           `,
                    studyTips: [
                        '熟读成诵，"书读百遍，其义自见"。',
                        '了解作者生平和创作背景有助于理解诗意。'
                    ]
                },
                { id: 'p-chi-6', title: '作文基础', description: '看图写话、记叙文（写人、记事、写景、状物）、应用文（日记、书信）。' },
            ]
        },
        {
            id: 'english-primary',
            name: '英语',
            icon: '🔤',
            knowledgePoints: [
                {
                    id: 'p-eng-1',
                    title: '字母与语音',
                    description: '26个字母读写，元音与辅音发音规则。',
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
                    id: 'p-eng-2',
                    title: '基础词汇',
                    description: '颜色、数字、家庭成员、身体部位、食物、动物、学校用品。',
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
                    ]
                },
                {
                    id: 'p-eng-3',
                    title: '日常交际用语',
                    description: '问候、介绍、道别、感谢、道歉、请求。',
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
                    ]
                },
                {
                    id: 'p-eng-4',
                    title: '基本语法',
                    description: '名词单复数、人称代词、be动词、一般现在时、现在进行时。',
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
            ]
        },
        {
            id: 'science-primary',
            name: '科学',
            icon: '🔬',
            knowledgePoints: [
                { id: 'p-sci-1', title: '植物', description: '植物的根、茎、叶、花、果实、种子。' },
                { id: 'p-sci-2', title: '动物', description: '昆虫、鱼类、两栖类、爬行类、鸟类、哺乳类特征。' },
                { id: 'p-sci-3', title: '水与空气', description: '水的形态变化，空气的性质。' },
                { id: 'p-sci-4', title: '声光热', description: '声音的产生与传播，光的反射，热胀冷缩。' },
                { id: 'p-sci-5', title: '地球与宇宙', description: '地球的形状、自转与公转，月相变化，太阳系。' },
            ]
        },
        {
            id: 'moral-primary',
            name: '道德与法治',
            icon: '⚖️',
            knowledgePoints: [
                { id: 'p-mor-1', title: '个人生活', description: '生活自理，卫生习惯，诚实守信。' },
                { id: 'p-mor-2', title: '学校生活', description: '尊敬师长，团结同学，遵守校规。' },
                { id: 'p-mor-3', title: '家庭生活', description: '孝敬父母，做力所能及的家务。' },
                { id: 'p-mor-4', title: '公共生活', description: '遵守交通规则，爱护公物，保护环境。' },
            ]
        }
    ]
};
