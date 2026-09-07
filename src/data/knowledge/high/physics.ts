import type { KnowledgePoint } from '../../types';

export const physics: KnowledgePoint[] = [
{
                    id: 'h-phy-001',
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
                    id: 'h-phy-002',
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
                    id: 'h-phy-003',
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
                    id: 'h-phy-004',
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
                    id: 'h-phy-005',
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
                    id: 'h-phy-006',
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
                    id: 'h-phy-007',
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
                    id: 'h-phy-008',
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
                    id: 'h-phy-009',
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
                    id: 'h-phy-010',
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
                    id: 'h-phy-011',
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
                }
];
