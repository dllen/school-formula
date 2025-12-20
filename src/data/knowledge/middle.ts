import type { GradeData } from '../types';

export const MIDDLE_DATA: GradeData = {
    id: 'middle',
    name: '初中',
    subjects: [
        {
            id: 'math-middle',
            name: '数学',
            icon: '📐',
            knowledgePoints: [
                {
                    id: 'm-math-1',
                    title: '数与式',
                    description: '有理数、实数、代数式、整式、分式、二次根式。',
                    detailedExplanation: `
            **有理数**：整数和分数统称有理数。
            **实数**：有理数和无理数统称实数。
            **整式**：单项式和多项式统称整式。
            **分式**：形如A/B，其中A、B都是整式，且B中含有字母。
            **二次根式**：形如√a (a≥0)。
          `,
                    studyTips: [
                        '概念要辨析清楚，如"0既不是正数也不是负数"。',
                        '注意分式有意义的条件是分母不为0。',
                        '二次根式的化简是重点，掌握积与商的算术平方根性质。'
                    ],
                    practiceQuestions: [
                        { question: '√16 的算术平方根是？', answer: '2 (注意是√16=4, 4的算术平方根是2)' },
                        { question: '当x取何值时，分式 1/(x-1) 无意义？', answer: 'x=1' }
                    ]
                },
                {
                    id: 'm-math-2',
                    title: '方程与不等式',
                    description: '一元一次方程、二元一次方程组、一元二次方程、分式方程、一元一次不等式（组）。',
                    detailedExplanation: `
            **解方程步骤**：去分母、去括号、移项、合并同类项、系数化为1。
            **一元二次方程解法**：配方法、公式法、因式分解法。
            **不等式性质**：不等式两边同时乘以/除以同一个负数，不等号方向要改变。
          `,
                    studyTips: [
                        '解不等式组时，口诀"同大取大，同小取小，大小小大中间找，大大小小无处找"。',
                        '方程应用题的关键是找等量关系。'
                    ],
                    practiceQuestions: [
                        { question: '解方程 x² - 2x - 3 = 0', answer: 'x1=3, x2=-1' },
                        { question: '不等式 -2x > 6 的解集是？', answer: 'x < -3' }
                    ]
                },
                {
                    id: 'm-math-3',
                    title: '函数',
                    description: '平面直角坐标系、一次函数、反比例函数、二次函数。',
                    detailedExplanation: `
            **一次函数**：y=kx+b (k≠0)，图像是一条直线。
            **反比例函数**：y=k/x (k≠0)，图像是双曲线。
            **二次函数**：y=ax²+bx+c (a≠0)，图像是抛物线。
          `,
                    studyTips: [
                        '数形结合是学习函数最重要的思想。',
                        '通过图像理解函数的性质（单调性、对称性）。',
                        '二次函数的顶点式 y=a(x-h)²+k 非常重要。'
                    ],
                    practiceQuestions: [
                        { question: '一次函数 y=2x+1 经过第几象限？', answer: '一、二、三' },
                        { question: '二次函数 y=(x-1)²+2 的顶点坐标是？', answer: '(1, 2)' }
                    ]
                },
                { id: 'm-math-4', title: '图形的性质', description: '相交线与平行线、三角形（全等、相似）、四边形、圆。' },
                { id: 'm-math-5', title: '图形的变化', description: '平移、旋转、轴对称、中心对称、投影与视图。' },
                { id: 'm-math-6', title: '统计与概率', description: '数据的收集与整理、概率初步。' },
            ]
        },
        {
            id: 'physics-middle',
            name: '物理',
            icon: '⚡',
            knowledgePoints: [
                { id: 'm-phy-1', title: '声现象', description: '声音的产生与传播，声音的特性，噪声的危害与控制。' },
                { id: 'm-phy-2', title: '光现象', description: '光的直线传播，反射，平面镜成像，折射，色散。' },
                { id: 'm-phy-3', title: '透镜及其应用', description: '凸透镜成像规律及眼睛、显微镜、望远镜。' },
                { id: 'm-phy-4', title: '物态变化', description: '温度，熔化与凝固，汽化与液化，升华与凝华。' },
                { id: 'm-phy-5', title: '力学与运动', description: '参照物，速度，质量与密度，力，二力平衡，摩擦力，压强，浮力，杠杆，滑轮，功与功率，机械效率。' },
                { id: 'm-phy-6', title: '电学', description: '电流，电压，电阻，欧姆定律，电功，电功率，焦耳定律，家庭电路，电生磁，磁生电。' },
            ]
        },
        {
            id: 'chemistry-middle',
            name: '化学',
            icon: '🧪',
            knowledgePoints: [
                { id: 'm-chem-1', title: '走进化学世界', description: '物质的变化和性质，化学实验基本操作。' },
                { id: 'm-chem-2', title: '空气与氧气', description: '空气成分，氧气的性质与制取。' },
                { id: 'm-chem-3', title: '物质构成的奥秘', description: '分子、原子、离子，元素，化合价，化学式。' },
                { id: 'm-chem-4', title: '化学方程式', description: '质量守恒定律，化学方程式书写与计算。' },
                { id: 'm-chem-5', title: '碳和碳的氧化物', description: '金刚石、石墨，二氧化碳，一氧化碳。' },
                { id: 'm-chem-6', title: '燃料及其利用', description: '燃烧与灭火，化石燃料，新能源。' },
                { id: 'm-chem-7', title: '金属', description: '金属材料，金属的化学性质，金属资源的利用和保护。' },
                { id: 'm-chem-8', title: '溶液', description: '溶解度，溶质质量分数。' },
                { id: 'm-chem-9', title: '酸碱盐', description: '常见酸碱盐的性质与用途，复分解反应，化肥。' },
            ]
        },
        {
            id: 'biology-middle',
            name: '生物',
            icon: '🧬',
            knowledgePoints: [
                { id: 'm-bio-1', title: '细胞', description: '细胞结构，分裂与分化，显微镜使用。' },
                { id: 'm-bio-2', title: '生物圈中的绿色植物', description: '孢子植物，种子植物，光合作用，呼吸作用，蒸腾作用。' },
                { id: 'm-bio-3', title: '生物圈中的人', description: '消化，呼吸，循环，泌尿，神经，内分泌系统。' },
                { id: 'm-bio-4', title: '生物的遗传与变异', description: '基因，DNA，染色体，遗传病。' },
            ]
        },
        {
            id: 'chinese-middle',
            name: '语文',
            icon: '✒️',
            knowledgePoints: [
                { id: 'm-chi-1', title: '文言文实词虚词', description: '通假字，古今异义，一词多义，词类活用，常见虚词（之、其、而、以、于、乃等）。' },
                { id: 'm-chi-2', title: '古诗文默写', description: '初中必背古诗文61篇。' },
                { id: 'm-chi-3', title: '现代文阅读', description: '记叙文、说明文、议论文阅读技巧。' },
                { id: 'm-chi-4', title: '名著导读', description: '《朝花夕拾》《西游记》《水浒传》《骆驼祥子》《繁星·春水》《鲁滨逊漂流记》《格列佛游记》《钢铁是怎样炼成的》等。' },
            ]
        },
        {
            id: 'english-middle',
            name: '英语',
            icon: '🗽',
            knowledgePoints: [
                { id: 'm-eng-1', title: '时态语态', description: '一般现在/过去/将来时，现在/过去进行时，现在完成时，被动语态。' },
                { id: 'm-eng-2', title: '从句', description: '宾语从句，定语从句，状语从句。' },
                { id: 'm-eng-3', title: '非谓语动词', description: '动词不定式，动名词，分词。' },
            ]
        },
        {
            id: 'history-middle',
            name: '历史',
            icon: '📜',
            knowledgePoints: [
                { id: 'm-his-1', title: '中国古代史', description: '夏商周至明清各朝代政治、经济、文化。' },
                { id: 'm-his-2', title: '中国近代史', description: '鸦片战争，洋务运动，辛亥革命，五四运动，抗日战争，解放战争。' },
                { id: 'm-his-3', title: '中国现代史', description: '新中国成立，改革开放。' },
                { id: 'm-his-4', title: '世界史', description: '古代文明，欧美资产阶级革命，工业革命，世界大战。' },
            ]
        },
        {
            id: 'geography-middle',
            name: '地理',
            icon: '🌍',
            knowledgePoints: [
                { id: 'm-geo-1', title: '地球与地图', description: '经纬网，地球运动，等高线地形图。' },
                { id: 'm-geo-2', title: '世界地理', description: '七大洲四大洋，气候类型，主要国家。' },
                { id: 'm-geo-3', title: '中国地理', description: '自然环境，人口民族，自然资源，行政区划，四大地理区域。' },
            ]
        },
        {
            id: 'moral-middle',
            name: '道德与法治',
            icon: '⚖️',
            knowledgePoints: [
                { id: 'm-mor-1', title: '心理健康', description: '认识自我，情绪管理，挫折应对，人际交往。' },
                { id: 'm-mor-2', title: '法律常识', description: '宪法，未成年人保护法，预防未成年人犯罪法，民法典基础。' },
                { id: 'm-mor-3', title: '国情国策', description: '基本经济制度，政治制度，科教兴国，可持续发展。' },
            ]
        }
    ]
};
