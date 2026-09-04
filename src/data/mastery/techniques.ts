import type { Technique } from './types';

export const TECHNIQUES: Technique[] = [
  // ========== 小学 ==========
  { id: 'count', grade: '一年级', stage: '小学', name: '数数与数位', summary: '搞清数位顺序与计数单位，是全部运算的地基。', kou: '个十位，从右起；数位对齐再比较；满十进一要牢记。', steps: ['从 1 开始一个一个数', '满十进一', '看清数位顺序'], prereq: null },
  { id: 'addsub', grade: '一年级', stage: '小学', name: '100以内加减法', summary: '进位加法、退位减法，数位对齐、从个位算起。', kou: '加法个位满十进一，减法个位不够退一当十。', steps: ['对齐数位', '从个位算起', '进位/退位处理'], prereq: 'count' },
  { id: 'multi', grade: '二年级', stage: '小学', name: '乘法口诀', summary: '熟背九九表，乘除法与后续所有运算的钥匙。', kou: '一一得一，二二得四；乘得积，口诀倒背也成商。', steps: ['两个因数相乘的结果叫积', '熟练运用九九乘法口诀', '因数交换位置，积不变'], prereq: 'addsub' },
  { id: 'divide', grade: '二年级', stage: '小学', name: '除法与余数', summary: '平均分与有余数除法，余数一定比除数小。', kou: '除数乘商加余数，等于被除数；余数要比除数小。', steps: ['把总数平均分成几份', '不能整除时剩余部分叫余数', '验算：除数×商+余数=被除数'], prereq: 'multi' },
  { id: 'fourops', grade: '三年级', stage: '小学', name: '四则混合运算与括号', summary: '先乘除后加减，有括号先算括号里。', kou: '先乘除后加减，括号优先不能忘；同级从左往右算。', steps: ['同级运算从左往右', '两级运算：先乘除后加减', '有括号：先算小括号'], prereq: null },
  { id: 'plant', grade: '三年级', stage: '小学', name: '植树问题', summary: '理清"间隔数"与"棵数"的四种关系。', kou: '植树先数间隔，两端都栽加一棵；一端不栽刚相等，两端不栽再减一。', steps: ['算出间隔数=总长÷间距', '两端都栽：棵数=间隔数+1', '只栽一端：棵数=间隔数', '两端都不栽：棵数=间隔数−1'], prereq: 'fourops' },
  { id: 'sumdiff', grade: '四年级', stage: '小学', name: '和差倍问题', summary: '已知两数和、差、倍数，用公式反推。', kou: '和差：大=(和+差)/2，小=(和−差)/2；和倍：小=和/(倍+1)。', steps: ['和差：大数=(和+差)÷2', '和倍：小数=和÷(倍数+1)', '差倍：小数=差÷(倍数−1)'], prereq: 'fourops' },
  { id: 'average', grade: '三年级', stage: '小学', name: '平均数问题', summary: '平均数=总数÷份数；可"移多补少"理解。', kou: '总数除以份数，得到平均数；平均速度要用总路程除以总时间。', steps: ['平均数=总数÷总份数', '总数=平均数×份数', '平均速度=总路程÷总时间'], prereq: 'fourops' },
  { id: 'fraction', grade: '五年级', stage: '小学', name: '分数的意义与通分', summary: '分数是"平均分"的数，加减先通分再算。', kou: '分母相同直接加减，不同先通分；分子是取的份数。', steps: ['分数=分子/分母', '同分母加减：分母不变，分子相加减', '异分母加减：先通分再算'], prereq: null },

  // ========== 初中 ==========
  { id: 'rational', grade: '七年级', stage: '中学', name: '有理数与数轴', summary: '有理数含整数分数，数轴三要素：原点、正方向、单位长度。', kou: '正数右、负数左，原点中间零；绝对值是距离，非负才正确。', steps: ['有理数=整数+分数', '数轴三要素：原点、正方向、单位长度', '绝对值=该数到原点的距离'], prereq: null },
  { id: 'integral', grade: '七年级', stage: '中学', name: '整式加减', summary: '同类项才能合并，去括号注意符号。', kou: '字母相同指数同，才是同类可合并；括号前负要变号。', steps: ['同类项：所含字母相同且相同字母指数也相同', '合并同类项：系数相加，字母部分不变', '去括号：括号前是"−"，里面各项变号'], prereq: 'rational' },
  { id: 'linear1', grade: '七年级', stage: '中学', name: '一元一次方程', summary: '移项变号、合并同类项，化为 ax=b 求解。', kou: '移项要变号，两边同除 a；未知数系数化为一。', steps: ['去分母、去括号、移项（移项变号）', '合并同类项，化为 ax=b', '系数化为1：x=b/a'], prereq: 'integral' },
  { id: 'inequal', grade: '七年级', stage: '中学', name: '一元一次不等式', summary: '解法同方程，唯乘/除以负数要反转不等号。', kou: '不等式，像方程；负数乘除转向反。', steps: ['移项、合并同类项同方程', '化为 ax>b（或<、≥、≤）', '两边同乘/除以负数，不等号方向反转'], prereq: 'linear1' },
  { id: 'system', grade: '七年级', stage: '中学', name: '二元一次方程组', summary: '代入法或加减法消元，化为一元一次。', kou: '两元消成一元，代入加减皆可；消元是核心。', steps: ['代入法：由一式表示一未知，代入另一式', '加减法：两式相加减消去一未知', '求出一个未知后回代求另一个'], prereq: 'linear1' },
  { id: 'segangle', grade: '七年级', stage: '中学', name: '线段与角', summary: '两点之间线段最短；角有度量，会平分与互余互补。', kou: '两点之间线段短，角分线分相等两半；互余九十互补百八。', steps: ['两点之间线段最短', '角平分线把角分成相等的两部分', '互余两角和90°，互补两角和180°'], prereq: null },
  { id: 'triangle', grade: '七年级', stage: '中学', name: '三角形性质', summary: '内角和180°，两边之和大于第三边。', kou: '内角和百八，外角等于不相邻两内和；两边和大于第三边。', steps: ['内角和=180°', '两边之和>第三边', '外角=不相邻两内角之和'], prereq: 'segangle' },
  { id: 'congruent', grade: '八年级', stage: '中学', name: '全等三角形', summary: 'SSS/SAS/ASA/AAS/HL 五种判定，对应边角全等。', kou: '边边边、边角边、角边角；直角再加斜边直角边。', steps: ['全等：形状大小完全相同', '判定：SSS/SAS/ASA/AAS（直角：HL）', '注意 SAS 的角是两边夹角'], prereq: 'triangle' },
  { id: 'similar', grade: '八年级', stage: '中学', name: '相似三角形', summary: '对应角相等、边成比例；面积比=相似比的平方。', kou: '两角等则相似；边成比例亦相似；面积比是相似比平方。', steps: ['相似：对应角相等、对应边成比例', '判定：两角对应相等 或 三边成比例', '面积比=相似比²，周长比=相似比'], prereq: 'congruent' },
  { id: 'pyth', grade: '八年级', stage: '中学', name: '勾股定理', summary: '直角三角形：a²+b²=c²（c为斜边）。', kou: '勾三股四弦五，平方和等斜边方；直角在，方能用。', steps: ['仅适用于直角三角形', '两直角边长a、b，斜边c：a²+b²=c²', '已知两边可求第三边'], prereq: 'triangle' },
  { id: 'quad', grade: '八年级', stage: '中学', name: '四边形与平行四边形', summary: '平行四边形对边平行且相等；矩形、菱形、正方形是特例。', kou: '平行四边形对边平行又相等；矩形加直角，菱形四边等。', steps: ['平行四边形：对边平行且相等，对角相等', '矩形：平行四边形+四个直角', '菱形：平行四边形+四边相等'], prereq: null },
  { id: 'circ', grade: '九年级', stage: '中学', name: '圆的性质', summary: '圆周角等于圆心角的一半；周长2πr，面积πr²。', kou: '圆周角是圆心角一半；周长二派r，面积派r方。', steps: ['圆周角=圆心角÷2', '周长C=2πr=πd', '面积S=πr²'], prereq: null },
  { id: 'func1', grade: '八年级', stage: '中学', name: '一次函数', summary: 'y=kx+b，k为斜率，b为截距。', kou: 'k正升k负降，b是y轴交点；斜率是倾斜程度。', steps: ['一次函数：y=kx+b（k≠0）', 'k>0 上升，k<0 下降', 'b是y轴截距'], prereq: null },
  { id: 'inverse', grade: '八年级', stage: '中学', name: '反比例函数', summary: 'y=k/x，k>0在一三象限，k<0在二四象限。', kou: '反比例双曲线，k正一三k负二四；面积是|k|。', steps: ['反比例函数：y=k/x（k≠0）', 'k>0，图像在一、三象限', 'k<0，图像在二、四象限'], prereq: null },
  { id: 'quadfunc', grade: '九年级', stage: '中学', name: '二次函数', summary: 'y=ax²+bx+c，顶点(-b/2a, (4ac-b²)/4a)。', kou: '顶点式方便看，交点式好求根；a正开口上a负下。', steps: ['一般式：y=ax²+bx+c', '顶点式：y=a(x-h)²+k，顶点(h,k)', '交点式：y=a(x-x₁)(x-x₂)'], prereq: null },

  // ========== 高中（代表性子集） ==========
  { id: 'set', grade: '高一', stage: '高中', name: '集合与逻辑', summary: '集合的交并补运算，充分必要条件。', kou: '交集取公共，并集全都要，补集是剩余。', steps: ['交集：A∩B，取公共元素', '并集：A∪B，取所有元素', '补集：∁UA，全集中去掉A的元素'], prereq: null },
  { id: 'func', grade: '高一', stage: '高中', name: '函数概念与性质', summary: '函数三要素：定义域、对应关系、值域。', kou: '定义域优先，值域随后；单调奇偶周期性。', steps: ['函数三要素：定义域、对应关系、值域', '定义域优先原则', '单调性、奇偶性、周期性'], prereq: 'set' },
  { id: 'explog', grade: '高一', stage: '高中', name: '指数与对数', summary: 'a^m × a^n = a^(m+n)，log_a(MN)=log_aM+log_aN。', kou: '指数相加底不变，对数运算乘变加。', steps: ['指数运算法则', '对数运算法则', '换底公式'], prereq: 'func' },
  { id: 'trig', grade: '高一', stage: '高中', name: '三角函数', summary: 'sin/cos/tot，单位圆上定义，诱导公式。', kou: '奇变偶不变，符号看象限；单位圆上转。', steps: ['单位圆定义三角函数', '诱导公式', '三角恒等变换'], prereq: 'func' },
  { id: 'sequence', grade: '高二', stage: '高中', name: '数列', summary: '等差、等比数列通项与求和。', kou: '等差加公差，等比乘公比；求和公式要记牢。', steps: ['等差：aₙ=a₁+(n−1)d', '等比：aₙ=a₁q^(n−1)', '求和公式'], prereq: 'func' },
  { id: 'vector', grade: '高二', stage: '高中', name: '平面向量', summary: '向量的加减、数乘、数量积。', kou: '向量加减三角形，数乘伸缩方向变；数量积是模乘余弦。', steps: ['向量的加减法', '数乘：λa', '数量积：a·b=|a||b|cosθ'], prereq: 'func' },
  { id: 'deriv', grade: '高二', stage: '高中', name: '导数', summary: 'f\'(x)=lim(Δx→0) Δf/Δx，求导法则。', kou: '幂函数降次乘指数，复合函数链式求导。', steps: ['导数的定义', '基本求导公式', '求导法则（和差积商、链式）'], prereq: 'func' },
];

export function getTechniquesByStage(stage: '小学' | '中学' | '高中'): Technique[] {
  return TECHNIQUES.filter(t => t.stage === stage);
}

export function getLearningPath(): Technique[] {
  const ordered: Technique[] = [];
  const map = new Map(TECHNIQUES.map(t => [t.id, t]));
  const visited = new Set<string>();

  function visit(t: Technique) {
    if (visited.has(t.id)) return;
    if (t.prereq && map.has(t.prereq)) {
      visit(map.get(t.prereq)!);
    }
    ordered.push(t);
    visited.add(t.id);
  }

  TECHNIQUES.forEach(visit);
  return ordered;
}

export function getTechniqueById(id: string): Technique | undefined {
  return TECHNIQUES.find(t => t.id === id);
}
