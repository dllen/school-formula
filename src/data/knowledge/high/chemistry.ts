import type { KnowledgePoint } from '../../types';

export const chemistry: KnowledgePoint[] = [
{
                    id: 'h-chem-001',
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
                    id: 'h-chem-002',
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
                    id: 'h-chem-003',
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
                    id: 'h-chem-004',
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
                    id: 'h-chem-005',
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
                    id: 'h-chem-006',
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
                    id: 'h-chem-007',
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
                    id: 'h-chem-008',
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
                }
];
