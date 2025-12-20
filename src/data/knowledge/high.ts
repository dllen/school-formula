import type { GradeData } from '../types';

export const HIGH_DATA: GradeData = {
    id: 'high',
    name: '高中',
    subjects: [
        {
            id: 'math-high',
            name: '数学',
            icon: '∫',
            knowledgePoints: [
                { id: 'h-math-1', title: '集合与简易逻辑', description: '集合的概念与运算，命题，充分必要条件。' },
                { id: 'h-math-2', title: '函数', description: '函数的概念，性质（单调性、奇偶性、周期性、最值），指数函数，对数函数，幂函数。' },
                { id: 'h-math-3', title: '三角函数', description: '任意角，弧度制，三角函数的图像与性质，三角恒等变换，解三角形。' },
                { id: 'h-math-4', title: '数列', description: '等差数列，等比数列及其前n项和。' },
                { id: 'h-math-5', title: '平面向量', description: '向量的概念与运算，数量积，坐标运算。' },
                { id: 'h-math-6', title: '不等式', description: '不等式的性质，解不等式，基本不等式。' },
                { id: 'h-math-7', title: '立体几何', description: '空间点、线、面的位置关系，空间几何体的结构、三视图、表面积与体积。' },
                { id: 'h-math-8', title: '解析几何', description: '直线与圆的方程，圆锥曲线（椭圆、双曲线、抛物线）。' },
                { id: 'h-math-9', title: '概率与统计', description: '随机事件，古典概型，几何概型，抽样方法，回归分析。' },
                { id: 'h-math-10', title: '导数及其应用', description: '导数的概念，运算，应用（单调性、极值、最值）。' },
                { id: 'h-math-11', title: '复数', description: '复数的概念，四则运算，几何意义。' },
            ]
        },
        {
            id: 'physics-high',
            name: '物理',
            icon: '⚛️',
            knowledgePoints: [
                { id: 'h-phy-1', title: '运动学', description: '匀变速直线运动，平抛运动，圆周运动。' },
                { id: 'h-phy-2', title: '静力学', description: '力，重力，弹力，摩擦力，力的合成与分解，共点力平衡。' },
                { id: 'h-phy-3', title: '牛顿运动定律', description: '牛顿第一、二、三定律，超重失重。' },
                { id: 'h-phy-4', title: '功与能', description: '功，功率，动能定理，机械能守恒定律，功能关系。' },
                { id: 'h-phy-5', title: '动量', description: '动量，冲量，动量定理，动量守恒定律，碰撞。' },
                { id: 'h-phy-6', title: '电场', description: '电场强度，电势，电势能，电容器，带电粒子在电场中的运动。' },
                { id: 'h-phy-7', title: '电路', description: '欧姆定律，焦耳定律，串并联电路，闭合电路欧姆定律。' },
                { id: 'h-phy-8', title: '磁场', description: '磁感应强度，安培力，洛伦兹力，带电粒子在磁场中的运动。' },
                { id: 'h-phy-9', title: '电磁感应', description: '法拉第电磁感应定律，楞次定律，自感。' },
                { id: 'h-phy-10', title: '交变电流', description: '正弦式交变电流的产生与描述，变压器，远距离输电。' },
                { id: 'h-phy-11', title: '近代物理', description: '光电效应，波粒二象性，原子结构，原子核。' },
            ]
        },
        {
            id: 'chemistry-high',
            name: '化学',
            icon: '⚗️',
            knowledgePoints: [
                { id: 'h-chem-1', title: '化学计量', description: '物质的量，摩尔质量，气体摩尔体积，物质的量浓度。' },
                { id: 'h-chem-2', title: '氧化还原反应', description: '氧化剂，还原剂，电子转移，配平。' },
                { id: 'h-chem-3', title: '离子反应', description: '电解质，离子方程式，离子共存，离子检验。' },
                { id: 'h-chem-4', title: '金属及其化合物', description: '钠，镁，铝，铁，铜及其化合物。' },
                { id: 'h-chem-5', title: '非金属及其化合物', description: '氯，硫，氮，硅及其化合物。' },
                { id: 'h-chem-6', title: '元素周期律', description: '原子结构，元素周期表，元素周期律，化学键。' },
                { id: 'h-chem-7', title: '化学反应原理', description: '化学反应热，化学反应速率，化学平衡，水溶液中的离子平衡（弱电解质电离，盐类水解，沉淀溶解平衡），电化学（原电池，电解池）。' },
                { id: 'h-chem-8', title: '有机化学基础', description: '烃（甲烷，乙烯，苯），烃的衍生物（卤代烃，醇，酚，醛，羧酸，酯），糖类，油脂，蛋白质。' },
            ]
        },
        {
            id: 'biology-high',
            name: '生物',
            icon: '🦠',
            knowledgePoints: [
                { id: 'h-bio-1', title: '分子与细胞', description: '细胞化学组成，细胞结构，细胞代谢（酶，ATP，呼吸，光合），细胞增殖，分化，衰老，凋亡，癌变。' },
                { id: 'h-bio-2', title: '遗传与进化', description: '孟德尔遗传定律，减数分裂，伴性遗传，DNA结构与复制，基因表达，基因突变，染色体变异，生物进化。' },
                { id: 'h-bio-3', title: '稳态与环境', description: '内环境稳态，神经调节，体液调节，免疫调节，植物激素调节，种群与群落，生态系统。' },
            ]
        },
        {
            id: 'politics-high',
            name: '思想政治',
            icon: '🚩',
            knowledgePoints: [
                { id: 'h-pol-1', title: '经济生活', description: '货币，价格，消费，生产，分配，市场经济，宏观调控，经济全球化。' },
                { id: 'h-pol-2', title: '政治生活', description: '公民，政府，人大，中共，政协，民族区域自治，宗教政策，国际关系。' },
                { id: 'h-pol-3', title: '文化生活', description: '文化的作用，文化传承与创新，中华文化，文化自信。' },
                { id: 'h-pol-4', title: '生活与哲学', description: '唯物论，认识论，辩证法，历史唯物主义。' },
            ]
        },
        {
            id: 'history-high',
            name: '历史',
            icon: '🏺',
            knowledgePoints: [
                { id: 'h-his-1', title: '古代中国', description: '政治制度，农耕经济，传统文化。' },
                { id: 'h-his-2', title: '近代中国', description: '反侵略求民主，经济结构变动，思想解放。' },
                { id: 'h-his-3', title: '现代中国', description: '政治建设，经济建设，外交，科教文卫。' },
                { id: 'h-his-4', title: '古代世界', description: '雅典民主，罗马法。' },
                { id: 'h-his-5', title: '近代世界', description: '代议制，新航路，殖民扩张，工业革命，科学理论文。' },
                { id: 'h-his-6', title: '现代世界', description: '苏联建设，罗斯福新政，战后资本主义，二战后世界格局。' },
            ]
        },
        {
            id: 'geography-high',
            name: '地理',
            icon: '🗺️',
            knowledgePoints: [
                { id: 'h-geo-1', title: '自然地理', description: '地球运动，大气，水，地表形态，地理环境整体性与差异性。' },
                { id: 'h-geo-2', title: '人文地理', description: '人口，城市，农业，工业，交通，可持续发展。' },
                { id: 'h-geo-3', title: '区域地理', description: '区域地理环境与人类活动，地理信息技术。' },
            ]
        }
    ]
};
