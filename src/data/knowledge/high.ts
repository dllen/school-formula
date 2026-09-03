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
                {
                    id: 'h-math-1',
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
                    id: 'h-math-2',
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
                    ]
                },
                {
                    id: 'h-math-3',
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
                    ]
                },
                {
                    id: 'h-math-4',
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
                        { question: '等比数列中a₁=3,q=2,求S₄=?', answer: 'S₄=3(1-16)/(1-3)=3×(-15)/(-2)=22.5' }
                    ]
                },
                {
                    id: 'h-math-5',
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
                    id: 'h-math-6',
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
                    id: 'h-math-7',
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
                    id: 'h-math-8',
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
                    id: 'h-math-9',
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
                    id: 'h-math-10',
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
                    id: 'h-math-11',
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
                },
            ]
        },
        {
            id: 'physics-high',
            name: '物理',
            icon: '⚛️',
            knowledgePoints: [
                {
                    id: 'h-phy-1',
                    title: '运动学',
                    description: '匀变速直线运动，平抛运动，圆周运动。',
                    detailedExplanation: `
            **匀变速直线运动**：v=v₀+at，x=v₀t+at²/₂，v²-v₀²=2ax。
            **平抛运动**：水平匀速（x=v₀t），竖直自由落体（y=gt²/₂）。
            **圆周运动**：v=ωr，a=v²/r=ω²r，T=2π/ω。
          `,
                    studyTips: [
                        '运动学公式较多，要理解每个公式的适用条件。',
                        '平抛运动的分解思想很重要：化曲为直。'
                    ],
                    practiceQuestions: [
                        { question: '初速10m/s,加速度2m/s²,3秒后速度是?', answer: 'v=10+2×3=16m/s' },
                        { question: '平抛初速10m/s,1秒后水平位移是?', answer: 'x=10×1=10m' }
                    ]
                },
                {
                    id: 'h-phy-2',
                    title: '静力学',
                    description: '力，重力，弹力，摩擦力，力的合成与分解，共点力平衡。',
                    detailedExplanation: `
            **重力**：G=mg，方向竖直向下。
            **弹力**：胡克定律F=kx（弹簧），支持力垂直于接触面。
            **摩擦力**：静摩擦（0<f≤fmax），滑动摩擦f=μN。
            **力的合成**：平行四边形法则，|F₁-F₂|≤F≤F₁+F₂。
            **共点力平衡**：合力为零，任意一个力与其他力的合力等大反向。
          `,
                    studyTips: [
                        '受力分析是力学的基础，要按"重力→弹力→摩擦力→其他力"的顺序。',
                        '正交分解法是解决平衡问题的通用方法。'
                    ],
                    practiceQuestions: [
                        { question: '5kg物体静止在水平面上,重力是?', answer: 'G=5×9.8=49N' },
                        { question: 'μ=0.2,物重10N,滑动摩擦力是?', answer: 'f=0.2×10=2N' }
                    ]
                },
                {
                    id: 'h-phy-3',
                    title: '牛顿运动定律',
                    description: '牛顿第一、二、三定律，超重失重。',
                    detailedExplanation: `
            **牛顿第一定律**（惯性定律）：物体不受力或合外力为零时保持静止或匀速直线运动。
            **牛顿第二定律**：F=ma，加速度与合外力成正比，与质量成反比。
            **牛顿第三定律**：作用力与反作用力等大、反向、共线、同时、同性质。
            **超重**：加速度向上，FN>mg。**失重**：加速度向下，FN<mg。
          `,
                    studyTips: [
                        'F=ma是力与运动的桥梁，分析问题时先求加速度。',
                        '超重失重看加速度方向，不是速度方向。'
                    ],
                    practiceQuestions: [
                        { question: '2kg物体受6N合力,加速度是?', answer: 'a=F/m=6/2=3m/s²' },
                        { question: '电梯加速上升时,人处于什么状态?', answer: '超重状态' }
                    ]
                },
                {
                    id: 'h-phy-4',
                    title: '功与能',
                    description: '功，功率，动能定理，机械能守恒定律，功能关系。',
                    detailedExplanation: `
            **功**：W=Fscosθ（恒力做功）。
            **功率**：P=W/t=Fv（瞬时功率）。
            **动能定理**：W总=ΔEk=mv²/₂-mv₀²/₂。
            **机械能守恒**：只有重力/弹力做功时，Ek+Ep=恒量。
            **功能关系**：重力做功对应重力势能变化，合外力做功对应动能变化。
          `,
                    studyTips: [
                        '动能定理是求变力做功的利器。',
                        '机械能守恒的条件是"只有重力或弹力做功"。'
                    ],
                    practiceQuestions: [
                        { question: '10N力推物体前进5m,做功多少?', answer: 'W=10×5=50J' },
                        { question: '2kg物体速度从2m/s增至4m/s,动能增加?', answer: 'ΔEk=½×2×(16-4)=12J' }
                    ]
                },
                {
                    id: 'h-phy-5',
                    title: '动量',
                    description: '动量，冲量，动量定理，动量守恒定律，碰撞。',
                    detailedExplanation: `
            **动量**：p=mv（矢量）。
            **冲量**：I=Ft（力与时间的累积）。
            **动量定理**：I=Δp=mv-mv₀。
            **动量守恒**：系统不受外力或合外力为零时，总动量守恒。
            **碰撞**：弹性碰撞（动能守恒）、非弹性碰撞、完全非弹性碰撞（共速）。
          `,
                    studyTips: [
                        '动量定理和动量守恒是解决碰撞问题的核心。',
                        '注意动量是矢量，方向很重要。'
                    ],
                    practiceQuestions: [
                        { question: '2kg物体以3m/s运动,动量是?', answer: 'p=2×3=6kg·m/s' },
                        { question: '两球弹性碰撞,碰后一定守恒的是?', answer: '动量和动能都守恒' }
                    ]
                },
                {
                    id: 'h-phy-6',
                    title: '电场',
                    description: '电场强度，电势，电势能，电容器，带电粒子在电场中的运动。',
                    detailedExplanation: `
            **电场强度**：E=F/q（定义式），E=kQ/r²（点电荷）。
            **电势**：φ=Ep/q，沿电场线方向电势降低。
            **电势能**：Ep=qφ，电场力做功W=qU。
            **电容器**：C=Q/U，C=εS/(4πkd)（平行板）。
            **带电粒子在电场中**：加速（qU=mv²/₂）、偏转（类平抛）。
          `,
                    studyTips: [
                        '电场中比较场强和电势要借助电场线和等势面。',
                        '带电粒子在电场中的运动用"类平抛"模型分析。'
                    ],
                    practiceQuestions: [
                        { question: 'E=100N/C,q=2C,电场力是?', answer: 'F=qE=200N' },
                        { question: 'U=100V,q=1C,电势能是?', answer: 'Ep=qU=100J' }
                    ]
                },
                {
                    id: 'h-phy-7',
                    title: '电路',
                    description: '欧姆定律，焦耳定律，串并联电路，闭合电路欧姆定律。',
                    detailedExplanation: `
            **欧姆定律**：I=U/R（部分电路），I=E/(R+r)（闭合电路）。
            **串并联特点**：
            - 串联：电流相等，电压分配与电阻成正比。
            - 并联：电压相等，电流分配与电阻成反比。
            **电功与电热**：W=UIt（普遍），Q=I²Rt（普遍）。
            - 纯电阻电路：W=Q；非纯电阻：W>Q。
          `,
                    studyTips: [
                        '分析电路先看串并联，化简等效电路。',
                        '闭合电路欧姆定律中，路端电压U=E-Ir。'
                    ],
                    practiceQuestions: [
                        { question: '6V电压加在3Ω电阻上,电流是?', answer: 'I=U/R=2A' },
                        { question: '两电阻3Ω和6Ω并联,总电阻是?', answer: 'R=₁/(₁/₃+₁/₆)=2Ω' }
                    ]
                },
                {
                    id: 'h-phy-8',
                    title: '磁场',
                    description: '磁感应强度，安培力，洛伦兹力，带电粒子在磁场中的运动。',
                    detailedExplanation: `
            **安培力**：F=BILsinθ（电流在磁场中受力）。
            **洛伦兹力**：f=qvBsinθ（运动电荷在磁场中受力），不做功。
            **带电粒子在匀强磁场中**：qvB=mv²/r，r=mv/(qB)，T=2πm/(qB)。
            **左手定则**：判断安培力/洛伦兹力方向。
          `,
                    studyTips: [
                        '洛伦兹力永远不做功，只改变速度方向。',
                        '带电粒子圆周运动的圆心、半径、圆心角是解题关键。'
                    ],
                    practiceQuestions: [
                        { question: 'I=2A,L=0.5m,B=0.4T,安培力最大值为?', answer: 'F=BIL=0.4N' },
                        { question: '电子垂直进入匀强磁场,做?', answer: '匀速圆周运动' }
                    ]
                },
                {
                    id: 'h-phy-9',
                    title: '电磁感应',
                    description: '法拉第电磁感应定律，楞次定律，自感。',
                    detailedExplanation: `
            **法拉第电磁感应定律**：E=nΔΦ/Δt（感应电动势大小）。
            **楞次定律**：感应电流的磁场阻碍原磁通量的变化（增反减同）。
            **导体棒切割**：E=BLv（B、L、v两两垂直）。
            **自感**：E=LΔI/Δt，L是自感系数。
          `,
                    studyTips: [
                        '楞次定律可以理解为"来拒去留""增反减同"。',
                        '电磁感应综合题常结合电路、力学、能量分析。'
                    ],
                    practiceQuestions: [
                        { question: 'n=100,ΔΦ=0.01Wb,Δt=0.1s,感应电动势?', answer: 'E=100×0.01/0.1=10V' },
                        { question: '导体棒长0.5m,速度4m/s,B=0.2T,电动势?', answer: 'E=BLv=0.4V' }
                    ]
                },
                {
                    id: 'h-phy-10',
                    title: '交变电流',
                    description: '正弦式交变电流的产生与描述，变压器，远距离输电。',
                    detailedExplanation: `
            **正弦交流电**：e=Emsinωt=nBSωsinωt，有效值E=Em/√2。
            **变压器**：U₁/U₂=n₁/n₂（电压比），P₁=P₂（理想变压器）。
            **远距离输电**：P损=I²R线，用高压输电减小损耗。
            **电容电感对交流的影响**：电容"通交隔直"，电感"通直阻交"。
          `,
                    studyTips: [
                        '有效值是根据电流热效应定义的，交流电表显示有效值。',
                        '变压器问题要注意原副线圈的功率关系和频率相同。'
                    ],
                    practiceQuestions: [
                        { question: 'e=10sin(100πt),有效值是?', answer: 'E=10/√2≈7.07V' },
                        { question: '变压器原线圈1100匝,副线圈180匝,原边220V,副边?', answer: 'U₂=220×180/1100=36V' }
                    ]
                },
                {
                    id: 'h-phy-11',
                    title: '近代物理',
                    description: '光电效应，波粒二象性，原子结构，原子核。',
                    detailedExplanation: `
            **光电效应**：hν=W+Ek（光子能量=逸出功+最大初动能）。
            **波粒二象性**：光既有波动性又有粒子性，物质波λ=h/p。
            **原子结构**：卢瑟福核式结构、玻尔能级、氢原子光谱。
            **原子核**：α衰变、β衰变、质能方程E=mc²、质能亏损ΔE=Δmc²。
          `,
                    studyTips: [
                        '光电效应方程Ek=hν-W是核心公式。',
                        '核反应方程要满足质量数守恒和电荷数守恒。'
                    ],
                    practiceQuestions: [
                        { question: '光电效应中,增大光强会增大?', answer: '光电子数目（饱和光电流）' },
                        { question: 'E=mc²中,c代表?', answer: '光速（3×10⁸m/s）' }
                    ]
                },
            ]
        },
        {
            id: 'chemistry-high',
            name: '化学',
            icon: '⚗️',
            knowledgePoints: [
                {
                    id: 'h-chem-1',
                    title: '化学计量',
                    description: '物质的量，摩尔质量，气体摩尔体积，物质的量浓度。',
                    detailedExplanation: `
            **物质的量（n）**：摩尔（mol）是基本单位，1mol含6.02×10²³个粒子。
            **摩尔质量（M）**：1mol物质的质量，数值等于相对分子质量（g/mol）。
            **气体摩尔体积**：标准状况（0℃,101kPa）下，1mol任何气体体积约为22.4L。
            **物质的量浓度（c）**：c=n/V（mol/L）。
            **换算关系**：n=m/M=V/Vm=cV。
          `,
                    studyTips: [
                        '以"物质的量"为中心建立各物理量之间的换算关系。',
                        '气体摩尔体积要注意"标准状况"和"气体"两个前提。'
                    ],
                    practiceQuestions: [
                        { question: '2mol H₂O的质量是?', answer: 'm=nM=2×18=36g' },
                        { question: '标准状况下,44.8L O₂的物质的量是?', answer: 'n=V/Vm=44.8/22.4=2mol' }
                    ]
                },
                {
                    id: 'h-chem-2',
                    title: '氧化还原反应',
                    description: '氧化剂，还原剂，电子转移，配平。',
                    detailedExplanation: `
            **本质**：电子转移（得失或偏移）。
            **特征**：化合价升降。
            **基本概念**：
            - 氧化剂：得电子，化合价降低，被还原。
            - 还原剂：失电子，化合价升高，被氧化。
            **配平方法**：化合价升降法（电子守恒）。
          `,
                    studyTips: [
                        '记住口诀："升失氧，降得还"。',
                        '氧化还原反应配平的核心是电子守恒。'
                    ],
                    practiceQuestions: [
                        { question: '2Na+Cl₂=2NaCl中,氧化剂是?', answer: 'Cl₂（得电子）' },
                        { question: 'Fe+CuSO₄=FeSO₄+Cu中,还原剂是?', answer: 'Fe（失电子）' }
                    ]
                },
                {
                    id: 'h-chem-3',
                    title: '离子反应',
                    description: '电解质，离子方程式，离子共存，离子检验。',
                    detailedExplanation: `
            **电解质**：在水溶液或熔融状态下能导电的化合物（酸、碱、盐）。
            **离子方程式**：用实际参加反应的离子表示化学反应。
            **离子能否共存**：生成沉淀、气体、弱电解质或发生氧化还原则不共存。
            **常见离子检验**：
            - Cl⁻：AgNO₃+稀HNO₃→白色沉淀
            - SO₄²⁻：BaCl₂+稀HCl→白色沉淀
            - CO₃²⁻：加酸产生使澄清石灰水变浑浊的气体
          `,
                    studyTips: [
                        '书写离子方程式时，强酸、强碱、可溶性盐拆成离子。',
                        '离子共存题注意题干中的"酸性""无色"等条件。'
                    ],
                    practiceQuestions: [
                        { question: 'NaOH+HCl=NaCl+H₂O的离子方程式是?', answer: 'H⁺+OH⁻=H₂O' },
                        { question: '下列能大量共存的是? H⁺、CO₃²⁻、Na⁺、Cl⁻', answer: '不能共存，H⁺与CO₃²⁻反应生成CO₂' }
                    ]
                },
                {
                    id: 'h-chem-4',
                    title: '金属及其化合物',
                    description: '钠，镁，铝，铁，铜及其化合物。',
                    detailedExplanation: `
            **钠**：银白色，质软，密度比水小。2Na+2H₂O=2NaOH+H₂↑。
            **铝**：两性金属，既能与酸也能与碱反应。2Al+2NaOH+2H₂O=2NaAlO₂+3H₂↑。
            **铁**：变价金属（+2、+3）。Fe³⁺遇KSCN变血红色。
            **重要化合物**：Na₂CO₃与NaHCO₃、Al₂O₃（两性氧化物）、Fe₂O₃、CuO。
          `,
                    studyTips: [
                        '金属及其化合物的性质要与氧化还原反应结合理解。',
                        'Na₂CO₃和NaHCO₃的鉴别是高频考点。'
                    ],
                    practiceQuestions: [
                        { question: '钠投入水中,溶液变红说明生成?', answer: 'NaOH（碱性物质）' },
                        { question: 'Al与NaOH溶液反应,氧化剂是?', answer: 'H₂O' }
                    ]
                },
                {
                    id: 'h-chem-5',
                    title: '非金属及其化合物',
                    description: '氯，硫，氮，硅及其化合物。',
                    detailedExplanation: `
            **氯**：黄绿色有毒气体。Cl₂+H₂O=HCl+HClO（次氯酸有漂白性）。
            **硫**：S、SO₂（漂白性、还原性）、SO₃、H₂SO₄（吸水性、脱水性、强氧化性）。
            **氮**：N₂、NH₃（碱性、极易溶于水）、NO、NO₂、HNO₃（强氧化性）。
            **硅**：半导体材料，SiO₂（光导纤维），硅酸盐（玻璃、水泥、陶瓷）。
          `,
                    studyTips: [
                        '浓硫酸的"三性"：吸水性、脱水性、强氧化性。',
                        '氨气是中学唯一常见的碱性气体。'
                    ],
                    practiceQuestions: [
                        { question: 'Cl₂通入石蕊溶液,现象是?', answer: '先变红后褪色' },
                        { question: '浓硫酸能使蔗糖炭化,体现?', answer: '脱水性' }
                    ]
                },
                {
                    id: 'h-chem-6',
                    title: '元素周期律',
                    description: '原子结构，元素周期表，元素周期律，化学键。',
                    detailedExplanation: `
            **原子结构**：质子数=核电荷数=原子序数，质量数=质子数+中子数。
            **元素周期律**：同周期从左到右，原子半径减小，金属性减弱，非金属性增强。
            **同主族**：从上到下，原子半径增大，金属性增强，非金属性减弱。
            **化学键**：离子键（阴阳离子间）、共价键（原子间共用电子对）、金属键。
          `,
                    studyTips: [
                        '元素周期律的核心是"位—构—性"的关系。',
                        '比较金属性/非金属性有多种方法，要灵活运用。'
                    ],
                    practiceQuestions: [
                        { question: '第三周期原子半径最大的元素是?', answer: 'Na（同周期从左到右半径减小）' },
                        { question: 'NaCl中的化学键是?', answer: '离子键' }
                    ]
                },
                {
                    id: 'h-chem-7',
                    title: '化学反应原理',
                    description: '化学反应热，化学反应速率，化学平衡，水溶液中的离子平衡（弱电解质电离，盐类水解，沉淀溶解平衡），电化学（原电池，电解池）。',
                    detailedExplanation: `
            **反应热**：ΔH=H(产物)-H(反应物)，放热ΔH<0，吸热ΔH>0。
            **化学反应速率**：v=Δc/Δt，影响因素：浓度、温度、压强、催化剂。
            **化学平衡**：v正=v逆≠0，勒夏特列原理（减弱改变）。
            **弱电解质电离**：CH₃COOH⇌CH₃COO⁻+H⁺。
            **盐类水解**：谁弱谁水解，谁强显谁性。
            **原电池**：负极氧化、正极还原，电子从负极流向正极。
          `,
                    studyTips: [
                        '化学平衡移动用勒夏特列原理分析。',
                        '原电池中负极活泼、失电子、被氧化。'
                    ],
                    practiceQuestions: [
                        { question: '合成氨采用高压,原因是?', answer: '增大压强，平衡向气体体积减小的方向移动' },
                        { question: 'NaClO溶液的pH?（>7,<7,=7）', answer: '>7（强碱弱酸盐，水解显碱性）' }
                    ]
                },
                {
                    id: 'h-chem-8',
                    title: '有机化学基础',
                    description: '烃（甲烷，乙烯，苯），烃的衍生物（卤代烃，醇，酚，醛，羧酸，酯），糖类，油脂，蛋白质。',
                    detailedExplanation: `
            **甲烷**：正四面体结构，取代反应（与Cl₂光照）。
            **乙烯**：平面结构，加成反应（使溴水褪色）、加聚反应。
            **苯**：平面正六边形，介于单键和双键之间的独特键。取代（硝化、磺化）、加成（与H₂）。
            **乙醇**：-OH，与Na反应、氧化成乙醛、酯化反应。
            **乙酸**：-COOH，酸性、酯化反应（酸脱羟基醇脱氢）。
            **糖类**：葡萄糖（还原性）、蔗糖（非还原性）、淀粉（遇碘变蓝）。
          `,
                    studyTips: [
                        '有机化学要抓住"结构决定性质"的主线。',
                        '酯化反应中"酸脱羟基醇脱氢"是书写方程式的关键。'
                    ],
                    practiceQuestions: [
                        { question: '乙烯使溴水褪色,反应类型是?', answer: '加成反应' },
                        { question: '乙酸乙酯水解的条件是?', answer: '酸或碱催化、加热' }
                    ]
                },
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
