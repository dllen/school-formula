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
                { id: 'p-math-1', title: '数的认识', description: '整数、小数、分数的认识与比较。' },
                { id: 'p-math-2', title: '四则运算', description: '加减乘除运算规则，速算与巧算。' },
                { id: 'p-math-3', title: '常见量', description: '长度、面积、体积、质量、时间、人民币单位及换算。' },
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
                { id: 'p-chi-1', title: '拼音与字词', description: '声母韵母、整体认读音节、查字典、组词造句。' },
                { id: 'p-chi-2', title: '歇后语与谚语', description: '常见歇后语、谚语积累。' },
                { id: 'p-chi-3', title: '标点符号', description: '逗号、句号、问号、感叹号、引号等的用法。' },
                { id: 'p-chi-4', title: '修辞手法', description: '比喻、拟人、排比、夸张、反问、设问。' },
                { id: 'p-chi-5', title: '古诗文诵读', description: '小学生必背古诗75首及注释。' },
                { id: 'p-chi-6', title: '作文基础', description: '看图写话、记叙文（写人、记事、写景、状物）、应用文（日记、书信）。' },
            ]
        },
        {
            id: 'english-primary',
            name: '英语',
            icon: '🔤',
            knowledgePoints: [
                { id: 'p-eng-1', title: '字母与语音', description: '26个字母读写，元音与辅音发音规则。' },
                { id: 'p-eng-2', title: '基础词汇', description: '颜色、数字、家庭成员、身体部位、食物、动物、学校用品。' },
                { id: 'p-eng-3', title: '日常交际用语', description: '问候、介绍、道别、感谢、道歉、请求。' },
                { id: 'p-eng-4', title: '基本语法', description: '名词单复数、人称代词、be动词、一般现在时、现在进行时。' },
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
