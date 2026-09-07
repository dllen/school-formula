import type { KnowledgePoint } from '../../types';

export const math: KnowledgePoint[] = [
{
                    id: 'h-math-001',
                    title: '集合与简易逻辑',
                    description: '集合的概念与运算，命题，充分必要条件。',
                    detailedExplanation: `
            **集合**：具有某种特定性质的事物的总体。
            **运算**：交集(∩)、并集(∪)、补集(CuA)。
            **充分必条件**：
            - p⇒q，p是q的充分条件。
            - q⇒p，p是q的必要条件。
          `,
                    studyTips: [
                        '用Venn图辅助理解集合运算。',
                        '分清"属于"(∈)与"包含"(⊆)的区别。'
                    ],
                    practiceQuestions: [
                        { question: 'A={1,2}, B={2,3}, A∩B=?', answer: '{2}' },
                        { question: 'x>1 是 x>0 的什么条件？', answer: '充分不必要条件' }
                    ]
                },
{
                    id: 'h-math-002',
                    title: '函数',
                    description: '函数的概念，性质（单调性、奇偶性、周期性、最值），指数函数，对数函数，幂函数。',
                    detailedExplanation: `
            **定义域与值域**：函数存在的"地盘"和"高度"。
            **单调性**：K>0增函数，K<0减函数（复合函数同增异减）。
            **奇偶性**：f(-x)=f(x)偶函数（关于y轴对称）；f(-x)=-f(x)奇函数（关于原点对称）。
          `,
                    studyTips: [
                        '函数是高中的核心，一定要掌握图像变换。',
                        '遇到抽象函数，尝试代入具体数值或画图分析。'
                    ],
                    practiceQuestions: [
                        { question: 'f(x)=x²-2x，求 f(3)=?', answer: 'f(3)=9-6=3' },
                        { question: '判断函数 f(x)=x³ 的奇偶性。', answer: '奇函数（f(-x)=(-x)³=-x³=-f(x)）' },
                        { question: '函数 y=log₂(x-1) 的定义域是?', answer: 'x-1>0，即 (1, +∞)' }
                    ]
                },
{
                    id: 'h-math-003',
                    title: '三角函数',
                    description: '任意角，弧度制，三角函数的图像与性质，三角恒等变换，解三角形。',
                    detailedExplanation: `
            **诱导公式**：奇变偶不变，符号看象限。
            **和差化积/积化和差**：虽然教材淡化，但对运算很有帮助。
            **正弦定理**：a/sinA = b/sinB = c/sinC = 2R
            **余弦定理**：a² = b² + c² - 2bc*cosA
          `,
                    studyTips: [
                        '公式非常多，要成体系地记忆（单位圆推导）。',
                        '图像即性质，熟记sin, cos, tan的图像。'
                    ],
                    practiceQuestions: [
                        { question: 'sin30°的值是?', answer: '1/2' },
                        { question: 'sin²α + cos²α = ?', answer: '1（同角三角函数基本关系）' },
                        { question: '在△ABC中，a=2，sinA=1/2，b=4，由正弦定理求 sinB。', answer: 'sinB = b·sinA/a = 4×(1/2)/2 = 1，故 B=90°' }
                    ]
                },
{
                    id: 'h-math-004',
                    title: '数列',
                    description: '等差数列，等比数列及其前n项和。',
                    detailedExplanation: `
            **等差数列**：相邻两项的差为常数d。通项公式：aₙ = a₁ + (n-1)d。前n项和：Sₙ = n(a₁+aₙ)/₂ = na₁ + n(n-1)d/₂。
            **等比数列**：相邻两项的比为常数q。通项公式：aₙ = a₁qⁿ⁻¹。前n项和：Sₙ = a₁(1-qⁿ)/(1-q)（q≠1）。
            **常用求和技巧**：错位相减（等差×等比）、裂项相消、分组求和。
          `,
                    studyTips: [
                        '等差等比的基本公式要熟练，中项公式经常用到。',
                        '数列求和的几种方法要掌握适用场景。'
                    ],
                    practiceQuestions: [
                        { question: '等差数列中a₁=2,d=3,求a₁₀=?', answer: 'a₁₀=2+9×3=29' },
                        { question: '等比数列中a₁=3,q=2,求S₄=?', answer: 'S₄=3(1-2⁴)/(1-2)=3×(-15)/(-1)=45' }
                    ]
                },
{
                    id: 'h-math-005',
                    title: '平面向量',
                    description: '向量的概念与运算，数量积，坐标运算。',
                    detailedExplanation: `
            **向量的概念**：既有大小又有方向的量。
            **线性运算**：加法（三角形/平行四边形法则）、减法、数乘。
            **数量积（点积）**：a·b = |a||b|cosθ = x₁x₂ + y₁y₂。
            **重要结论**：a⊥b ⟺ a·b = 0；|a|² = a·a。
          `,
                    studyTips: [
                        '向量是连接代数与几何的桥梁，很多几何问题用向量更简洁。',
                        '数量积的坐标运算要熟练，垂直判定是高频考点。'
                    ],
                    practiceQuestions: [
                        { question: 'a=(1,2), b=(3,-1), 求a·b=?', answer: 'a·b=1×3+2×(-1)=1' },
                        { question: 'a=(2,k), b=(3,1), 若a⊥b,求k=?', answer: 'a·b=6+k=0, k=-6' }
                    ]
                },
{
                    id: 'h-math-006',
                    title: '不等式',
                    description: '不等式的性质，解不等式，基本不等式。',
                    detailedExplanation: `
            **基本性质**：传递性、加法单调性、乘法单调性（注意正负）。
            **一元二次不等式**：先求根，根据开口方向和符号确定解集。
            **基本不等式**：a+b ≥ 2√ab（a,b>0），当且仅当a=b时取等号。
            **均值不等式链**：√((a²+b²)/₂) ≥ (a+b)/₂ ≥ √ab ≥ ₂/(1/a+1/b)。
          `,
                    studyTips: [
                        '用基本不等式求最值要注意"一正二定三相等"。',
                        '含参不等式要注意分类讨论。'
                    ],
                    practiceQuestions: [
                        { question: 'x>0, x+1/x的最小值是?', answer: '当x=1时，最小值为2' },
                        { question: '解不等式x²-5x+6>0', answer: 'x<2或x>3' }
                    ]
                },
{
                    id: 'h-math-007',
                    title: '立体几何',
                    description: '空间点、线、面的位置关系，空间几何体的结构、三视图、表面积与体积。',
                    detailedExplanation: `
            **线面关系**：线线平行→线面平行→面面平行（性质定理与判定定理互逆）。
            **线面垂直**：一条直线与平面内两条相交直线都垂直，则线面垂直。
            **柱锥球的表面积和体积**：
            - 柱体：V=Sh，S表=2S底+S侧
            - 锥体：V=Sh/₃
            - 球：V=4πR³/₃，S=4πR²
          `,
                    studyTips: [
                        '立体几何需要空间想象能力，多画图、用模型辅助。',
                        '向量法可以系统性地解决平行、垂直、夹角、距离问题。'
                    ],
                    practiceQuestions: [
                        { question: '正方体棱长为2,其体积是?', answer: 'V=2³=8' },
                        { question: '圆锥底面半径3,高4,其体积是?', answer: 'V=π×3²×4/₃=12π' }
                    ]
                },
{
                    id: 'h-math-008',
                    title: '解析几何',
                    description: '直线与圆的方程，圆锥曲线（椭圆、双曲线、抛物线）。',
                    detailedExplanation: `
            **直线方程**：点斜式、斜截式、一般式。两直线平行/垂直的斜率关系。
            **圆的方程**：(x-a)²+(y-b)²=r²。
            **椭圆**：x²/a²+y²/b²=1，c²=a²-b²，离心率e=c/a<1。
            **双曲线**：x²/a²-y²/b²=1，c²=a²+b²，离心率e=c/a>1。
            **抛物线**：y²=2px，焦点(p/₂,0)，准线x=-p/₂。
          `,
                    studyTips: [
                        '圆锥曲线的定义是根本，很多小题用定义更快。',
                        '直线与圆锥曲线联立，判别式Δ是判断位置关系的关键。'
                    ],
                    practiceQuestions: [
                        { question: '椭圆x²/16+y²/9=1的离心率是?', answer: 'a=4,b=3,c=√7,e=√7/4' },
                        { question: '抛物线y²=8x的焦点坐标是?', answer: '2p=8,p=4,焦点(2,0)' }
                    ]
                },
{
                    id: 'h-math-009',
                    title: '概率与统计',
                    description: '随机事件，古典概型，几何概型，抽样方法，回归分析。',
                    detailedExplanation: `
            **古典概型**：P(A)=A包含的基本事件数/基本事件总数（等可能、有限）。
            **几何概型**：P(A)=构成事件A的区域长度（面积、体积）/全部结果的区域。
            **抽样方法**：简单随机抽样、系统抽样、分层抽样。
            **回归分析**：线性回归方程y=bx+a，必过样本中心(x̄,ȳ)。
          `,
                    studyTips: [
                        '概率问题要分清"有序"还是"无序"，"放回"还是"不放回"。',
                        '统计图表要会读，频率分布直方图的纵坐标是频率/组距。'
                    ],
                    practiceQuestions: [
                        { question: '抛两枚硬币,至少一个正面的概率是?', answer: 'P=3/4（正正、正反、反正）' },
                        { question: '数据1,2,3,4,5的方差是?', answer: 'x̄=3,方差=₁₅[(4+1+0+1+4)]=2' }
                    ]
                },
{
                    id: 'h-math-010',
                    title: '导数及其应用',
                    description: '导数的概念，运算，应用（单调性、极值、最值）。',
                    detailedExplanation: `
            **导数的定义**：f'(x)=lim[Δx→₀][f(x+Δx)-f(x)]/Δx。
            **基本求导公式**：(xⁿ)'=nxⁿ⁻¹，(sinx)'=cosx，(cosx)'=-sinx，(eˣ)'=eˣ，(lnx)'=1/x。
            **求导法则**：和差积商、链式法则。
            **应用**：f'(x)>0则递增；f'(x)=0且变号为极值点；最值在极值点或端点处取得。
          `,
                    studyTips: [
                        '导数是研究函数性质的有力工具，要养成"求导看单调"的习惯。',
                        '含参函数的分类讨论是难点，注意导函数零点的讨论。'
                    ],
                    practiceQuestions: [
                        { question: 'f(x)=x³-3x,求单调递增区间', answer: "f'(x)=3x²-3>0, x<-1或x>1" },
                        { question: "f(x)=x²eˣ,求f'(0)=?", answer: "f'(x)=2xeˣ+x²eˣ, f'(0)=0" }
                    ]
                },
{
                    id: 'h-math-011',
                    title: '复数',
                    description: '复数的概念，四则运算，几何意义。',
                    detailedExplanation: `
            **复数的概念**：z=a+bi（a,b∈R），i²=-1。实部a，虚部b。
            **共轭复数**：z̄=a-bi。z·z̄=|z|²=a²+b²。
            **复数的几何意义**：复平面上的点(a,b)或向量。
            **模**：|z|=√(a²+b²)，表示复平面上点到原点的距离。
          `,
                    studyTips: [
                        '复数的几何意义很重要，很多问题用图形更直观。',
                        '复数不能比较大小（除非都是实数）。'
                    ],
                    practiceQuestions: [
                        { question: 'z=3+4i, |z|=?', answer: '|z|=√(9+16)=5' },
                        { question: '(1+i)²=?', answer: '(1+i)²=1+2i+i²=2i' }
                    ]
                }
];
