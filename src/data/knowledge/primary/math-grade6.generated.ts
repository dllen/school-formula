import type { KnowledgePoint } from '../../types';

// Auto-generated from cn-math-taxonomy (数学 grade 6)
// Do not edit by hand; regenerate with:
//   node scripts/align-cn-taxonomy/enrich-primary-cn-taxonomy.mjs math 6
export const mathGrade6: KnowledgePoint[] = [
  {
    "id": "p-math-g6-001",
    "title": "用数对确定位置",
    "description": "会用有序数对表示方格纸上点的位置，先写列、再写行。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p136",
      "cms-2022:3.GG.09"
    ],
    "detailedExplanation": "会用有序数对表示方格纸上点的位置，先写列、再写行。",
    "studyTips": [
      "能说出先写列再写行",
      "能根据数对找到点"
    ],
    "practiceQuestions": [
      {
        "question": "有序数对先写什么？",
        "answer": "先写列，再写行"
      }
    ],
    "funEmoji": "✅",
    "funFact": "用数对确定位置是小学数学的基础内容。",
    "funStory": "用数对确定位置就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "有序数对先写什么？",
    "funQuestionAnswer": "先写列，再写行",
    "tutorialContent": {
      "objectives": [
        "理解有序数对的概念",
        "掌握确定位置的顺序：先写列，再写行",
        "能够根据给定的数对在方格纸上找到对应点",
        "能够写出方格纸上指定点的数对表示"
      ],
      "explanation": "在方格纸上，我们可以用**有序数对**来确定点的位置。有序数对的形式是 `(列, 行)`。\n\n**核心规则：**\n1. **先看列**：从左往右数，第几列就写在前面。\n2. **再看行**：从下往上数，第几行就写在后面。\n\n例如：点 $(2, 3)$ 表示这个点在第 2 列，第 3 行。",
      "examples": [
        {
          "title": "基础定位",
          "problem": "在方格纸上，点 A 位于第 3 列，第 2 行，请写出它的数对表示。",
          "solution": "(3, 2)",
          "tip": "记住口诀：先列后行。"
        },
        {
          "title": "综合找点",
          "problem": "如果一个点的位置表示为 $(5, 4)$，这个点在第几列第几行？",
          "solution": "第 5 列，第 4 行。",
          "tip": "第一个数字代表列，第二个数字代表行。"
        }
      ],
      "interaction": "请想象一张方格纸，如果你从起点出发，向右走 4 格，向上走 2 格到达点 B，点 B 的数对应该是多少？",
      "exercises": [
        {
          "question": "点 P 在第 1 列，第 5 行，其数对表示是 ( )。",
          "answer": "(1, 5)",
          "explanation": "先写列数 1，再写行数 5。"
        },
        {
          "question": "数对 (4, 3) 表示的点在第 ( ) 列，第 ( ) 行。",
          "answer": "4, 3",
          "explanation": "第一个数是列，第二个数是行。"
        },
        {
          "question": "判断正误：在数对 (2, 6) 中，6 表示这个点在第 6 列。( )",
          "answer": "错误",
          "explanation": "6 在第二位，表示的是行数，而非列数。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-002",
    "title": "分数乘整数",
    "description": "会计算分数乘整数，用分子乘整数做新的分子，分母不变。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p177",
      "cms-2022:3.NA.04"
    ],
    "detailedExplanation": "会计算分数乘整数，用分子乘整数做新的分子，分母不变。",
    "studyTips": [
      "能算出分数乘整数",
      "能把结果约成最简分数"
    ],
    "practiceQuestions": [
      {
        "question": "计算：2/7×3＝？",
        "answer": "6/7"
      }
    ],
    "funEmoji": "✅",
    "funFact": "分数乘整数是小学数学的基础内容。",
    "funStory": "分数乘整数就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：2/7×3＝？",
    "funQuestionAnswer": "6/7",
    "tutorialContent": {
      "objectives": [
        "掌握分数乘整数的计算方法",
        "理解分数乘整数的实际意义",
        "学会将计算结果约分为最简分数"
      ],
      "explanation": "计算**分数乘整数**，我们可以把整数看作分母为 1 的分数。\n\n**计算法则：**\n- 用**分子**乘**整数**，结果作为新分子；\n- **分母**保持不变。\n\n公式：$\frac{a}{b} \times c = \frac{a \times c}{b}$\n\n*注意：计算结果如果不是最简分数，记得要约分。*",
      "examples": [
        {
          "title": "直接计算",
          "problem": "计算：$\frac{2}{9} \times 3$",
          "solution": "$\frac{2 \times 3}{9} = \frac{6}{9} = \frac{2}{3}$",
          "tip": "计算出 $\frac{6}{9}$ 后，发现分子分母都能被 3 整除，所以要约分。"
        },
        {
          "title": "进阶计算",
          "problem": "计算：$\frac{3}{8} \times 5$",
          "solution": "$\frac{3 \times 5}{8} = \frac{15}{8}$ 或 $1\frac{7}{8}$",
          "tip": "结果可以是假分数，也可以转化为带分数。"
        }
      ],
      "interaction": "尝试计算 $\frac{1}{5} \times 4$，想一想分母为什么不需要乘以 4？",
      "exercises": [
        {
          "question": "计算 $\frac{1}{7} \times 3$。",
          "answer": "3/7",
          "explanation": "分子 1 乘 3 等于 3，分母 7 不变。"
        },
        {
          "question": "计算 $\frac{2}{15} \times 5$ (结果请约分)。",
          "answer": "2/3",
          "explanation": "$\frac{2 \times 5}{15} = \frac{10}{15} = \frac{2}{3}$。"
        },
        {
          "question": "计算 $\frac{5}{6} \times 4$ (结果请约分)。",
          "answer": "10/3 或 3 1/3",
          "explanation": "$\frac{5 \times 4}{6} = \frac{20}{6} = \frac{10}{3}$。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-003",
    "title": "分数乘分数",
    "description": "会计算分数乘分数，用分子相乘的积做分子，分母相乘的积做分母。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p178",
      "cms-2022:3.NA.04"
    ],
    "detailedExplanation": "会计算分数乘分数，用分子相乘的积做分子，分母相乘的积做分母。",
    "studyTips": [
      "能算出分数乘分数",
      "能约分后再写得数"
    ],
    "practiceQuestions": [
      {
        "question": "计算：1/2×1/3＝？",
        "answer": "1/6"
      }
    ],
    "funEmoji": "✅",
    "funFact": "分数乘分数是小学数学的基础内容。",
    "funStory": "分数乘分数就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：1/2×1/3＝？",
    "funQuestionAnswer": "1/6",
    "tutorialContent": {
      "objectives": [
        "掌握分数乘分数的计算方法",
        "学会利用约分简化计算过程",
        "能正确处理分子分母的乘法运算"
      ],
      "explanation": "计算**分数乘分数**，遵循简单的乘法法则：\n\n**计算法则：**\n- **分子相乘**的积做分子；\n- **分母相乘**的积做分母。\n\n公式：$\frac{a}{b} \times \frac{c}{d} = \frac{a \times c}{b \times d}$\n\n**技巧：** 在乘法运算过程中，如果分子和分母有公因数，可以**先约分再计算**，这样能避免计算大数，降低出错率。",
      "examples": [
        {
          "title": "基础乘法",
          "problem": "计算：$\frac{1}{2} \times \frac{1}{3}$",
          "solution": "$\frac{1 \times 1}{2 \times 3} = \frac{1}{6}$",
          "tip": "分子乘分子，分母乘分母。"
        },
        {
          "title": "约分计算",
          "problem": "计算：$\frac{3}{4} \times \frac{2}{5}$",
          "solution": "$\frac{3 \times 2}{4 \times 5} = \frac{6}{20} = \frac{3}{10}$ (或者先约分：$\frac{3}{2} \times \frac{1}{5} = \frac{3}{10}$)",
          "tip": "观察 2 和 4 有公因数 2，先约分计算会更快捷。"
        }
      ],
      "interaction": "如果计算 $\frac{2}{3} \times \frac{3}{4}$，你觉得直接乘和先约分哪个更快？",
      "exercises": [
        {
          "question": "计算 $\frac{2}{5} \times \frac{3}{7}$。",
          "answer": "6/35",
          "explanation": "分子 $2 \times 3=6$，分母 $5 \times 7=35$。"
        },
        {
          "question": "计算 $\frac{4}{9} \times \frac{3}{8}$ (结果请约分)。",
          "answer": "1/6",
          "explanation": "$\frac{4 \times 3}{9 \times 8} = \frac{12}{72} = \frac{1}{6}$。"
        },
        {
          "question": "计算 $\frac{5}{6} \times \frac{2}{5}$ (结果请约分)。",
          "answer": "1/3",
          "explanation": "分子 5 和分母 5 约掉，剩下 $\frac{2}{6} = \frac{1}{3}$。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-004",
    "title": "分数乘法的应用",
    "description": "能用分数乘法求一个数的几分之几是多少。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p179",
      "cms-2022:3.NA.04",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "能用分数乘法求一个数的几分之几是多少。",
    "studyTips": [
      "能把「一个数的几分之几」写成乘法",
      "能算出结果并约分"
    ],
    "practiceQuestions": [
      {
        "question": "计算：20×1/4＝？",
        "answer": "5"
      }
    ],
    "funEmoji": "✅",
    "funFact": "分数乘法的应用是小学数学的基础内容。",
    "funStory": "分数乘法的应用就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：20×1/4＝？",
    "funQuestionAnswer": "5",
    "tutorialContent": {
      "objectives": [
        "理解“一个数的几分之几”在数学上的含义",
        "能将文字描述转化为分数乘法算式",
        "能解决与分数乘法相关的实际应用问题"
      ],
      "explanation": "在数学中，**“一个数的几分之几”** 实际上就是指这个数与这个分数相乘。\n\n**关键转换：**\n- “的” $\rightarrow$ 乘号 $\times$\n- 例如：$20$ 的 $\frac{1}{4}$ $\rightarrow$ $20 \times \frac{1}{4}$\n\n**解题步骤：**\n1. 分析问题，找准“数”和“几分之几”。\n2. 列出乘法算式。\n3. 计算结果并约分为最简分数或整数。",
      "examples": [
        {
          "title": "基础应用",
          "problem": "一个蛋糕重 400 克，小明吃了 $\frac{1}{4}$，小明吃了多少克？",
          "solution": "$400 \times \frac{1}{4} = 100$（克）",
          "tip": "将 400 看作分母为 1 的分数 $\frac{400}{1}$，计算 $\frac{400 \times 1}{1 \times 4}$。"
        },
        {
          "title": "综合应用",
          "problem": "小红有 12 支铅笔，送给同学 $\frac{1}{3}$，还剩下多少支？",
          "solution": "先算送出：$12 \times \frac{1}{3} = 4$（支）；再算剩余：$12 - 4 = 8$（支）。",
          "tip": "注意题目问的是“剩下”还是“送出”，不要漏掉最后一步减法。"
        }
      ],
      "interaction": "如果你有 10 元钱，花掉了 $\frac{2}{5}$，你能直接写出算式吗？",
      "exercises": [
        {
          "question": "计算 30 的 $\frac{3}{5}$ 是多少？",
          "answer": "18",
          "explanation": "$30 \times \frac{3}{5} = \frac{30 \times 3}{5} = \frac{90}{5} = 18$。"
        },
        {
          "question": "一根绳子长 15 米，截去 $\frac{2}{3}$，截去了多少米？",
          "answer": "10米",
          "explanation": "$15 \times \frac{2}{3} = \frac{15 \times 2}{3} = \frac{30}{3} = 10$。"
        },
        {
          "question": "某班有 45 人，女生占 $\frac{3}{5}$，男生有多少人？",
          "answer": "18人",
          "explanation": "男生占 $1 - \frac{3}{5} = \frac{2}{5}$，所以男生人数为 $45 \times \frac{2}{5} = 18$ 人。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-005",
    "title": "根据方向和距离确定位置",
    "description": "能根据方向和距离确定物体的位置，并描述简单的路线。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p180",
      "cms-2022:3.GG.08"
    ],
    "detailedExplanation": "能根据方向和距离确定物体的位置，并描述简单的路线。",
    "studyTips": [
      "能说出方向和距离两个条件",
      "能按方向和距离算出行走的路程"
    ],
    "practiceQuestions": [
      {
        "question": "计算：300＋200＝？",
        "answer": "500"
      }
    ],
    "funEmoji": "✅",
    "funFact": "根据方向和距离确定位置是小学数学的基础内容。",
    "funStory": "根据方向和距离确定位置就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：300＋200＝？",
    "funQuestionAnswer": "500",
    "tutorialContent": {
      "objectives": [
        "掌握确定位置的两个必要条件：方向和距离",
        "能够根据给定的方向和距离在地图或平面图上找点",
        "能够描述从一点到另一点的简单路线"
      ],
      "explanation": "要准确地确定一个物体的位置，通常需要两个条件：**方向**和**距离**。\n\n**1. 方向**：指明物体在哪个方位（如：东、南、西、北，或左、右、前、后）。\n**2. 距离**：指明物体离参照点有多远（如：300米、5厘米）。\n\n**描述路线的方法：**\n- “先向 [方向] 走 [距离]，再向 [方向] 走 [距离]”。\n- 这种方式就像给别人导航一样，必须清晰且完整。",
      "examples": [
        {
          "title": "基础定位",
          "problem": "从学校出发，向东走 300 米到达书店，书店在学校的什么方向？距离多少？",
          "solution": "方向：东；距离：300 米。",
          "tip": "直接从题目中的描述中提取关键词。"
        },
        {
          "title": "路线描述",
          "problem": "已知 A 点在 B 点北边 200 米，B 点在 C 点东边 100 米。请描述从 C 到 A 的路线。",
          "solution": "先向东走 100 米到达 B 点，再向北走 200 米到达 A 点。",
          "tip": "描述路线要像接龙一样，一步一步引导。"
        }
      ],
      "interaction": "如果你现在面向北方，向右转 90 度走 5 步，你现在在原点的什么方向？",
      "exercises": [
        {
          "question": "确定一个物体的位置，通常需要哪两个条件？",
          "answer": "方向和距离",
          "explanation": "只有方向没有距离找不到具体点，只有距离没有方向不知道往哪走。"
        },
        {
          "question": "从 A 点向北走 200 米，再向东走 300 米到达 B 点。B 点在 A 点的什么方向？",
          "answer": "东北方向",
          "explanation": "北和东的结合就是东北方向。"
        },
        {
          "question": "甲点在乙点西边 500 米，乙点在丙点西边 200 米，甲点在丙点西边多少米？",
          "answer": "700米",
          "explanation": "因为都在西边，所以距离相加：$500 + 200 = 700$ 米。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-006",
    "title": "描述简单路线图",
    "description": "能按方向和距离说出从一处到另一处的路线，也能根据路线图算出总路程。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p181",
      "cms-2022:3.GG.08"
    ],
    "detailedExplanation": "能按方向和距离说出从一处到另一处的路线，也能根据路线图算出总路程。",
    "studyTips": [
      "能按顺序说出每一段的方向",
      "能把各段距离加起来"
    ],
    "practiceQuestions": [
      {
        "question": "计算：200＋150＋50＝？",
        "answer": "400"
      }
    ],
    "funEmoji": "✅",
    "funFact": "描述简单路线图是小学数学的基础内容。",
    "funStory": "描述简单路线图就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：200＋150＋50＝？",
    "funQuestionAnswer": "400",
    "tutorialContent": {
      "objectives": [
        "能准确识别路线图中的方向（东、南、西、北）",
        "能按顺序描述从起点到终点的具体路线",
        "能根据路线图计算总路程",
        "养成描述路线条理清晰的习惯"
      ],
      "explanation": "描述路线图就像是在给别人指路。我们需要两个关键信息：**方向**和**距离**。\n\n1. **确定方向**：通常地图上方是北，下方是南，左边是西，右边是东。\n2. **描述步骤**：按照行走顺序，一段一段地说。例如：“先向东走200米，再向南走150米”。\n3. **计算总路程**：将路线中每一段的距离全部相加即可得出总长度。",
      "examples": [
        {
          "title": "简单路线描述",
          "problem": "从 A 点向东走 300 米到达 B 点，再向南走 200 米到达 C 点。请描述路线并计算总路程。",
          "solution": "路线描述：先向东走 300 米，再向南走 200 米。总路程：300 + 200 = 500（米）。",
          "tip": "描述时要先说方向，再说距离。"
        },
        {
          "title": "多段路线计算",
          "problem": "小明从家出发，向北走 400 米到超市，再向东走 300 米到图书馆，最后向南走 100 米到学校。请问总路程是多少？",
          "solution": "总路程 = 400 + 300 + 100 = 800（米）。",
          "tip": "无论方向如何变化，求总路程就是把所有路段的长度加起来。"
        }
      ],
      "interaction": "想象你现在在教室门口，想去黑板前，请试着用“向xx走xx步”的方式描述路线。",
      "exercises": [
        {
          "question": "从起点向西走 500 米，再向北走 300 米，最后向东走 200 米。总路程是多少米？",
          "answer": "1000米",
          "explanation": "500 + 300 + 200 = 1000（米）"
        },
        {
          "question": "如果一段路向东 1.2 公里，另一段路向南 0.8 公里，总路程是多少公里？",
          "answer": "2公里",
          "explanation": "1.2 + 0.8 = 2（公里）"
        },
        {
          "question": "描述：从 A 到 B 向北走 100 米，从 B 到 C 向东走 100 米。若要从 A 经 B 到 C，总路程是多少？",
          "answer": "200米",
          "explanation": "100 + 100 = 200（米）"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-007",
    "title": "分数除以整数",
    "description": "会计算分数除以整数，等于乘这个整数的倒数。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p182",
      "cms-2022:3.NA.04",
      "cms-2022:3.NA.03"
    ],
    "detailedExplanation": "会计算分数除以整数，等于乘这个整数的倒数。",
    "studyTips": [
      "能说出除以一个整数等于乘它的倒数",
      "能算出分数除以整数"
    ],
    "practiceQuestions": [
      {
        "question": "计算：4/5÷2＝？",
        "answer": "2/5"
      }
    ],
    "funEmoji": "✅",
    "funFact": "分数除以整数是小学数学的基础内容。",
    "funStory": "分数除以整数就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：4/5÷2＝？",
    "funQuestionAnswer": "2/5",
    "tutorialContent": {
      "objectives": [
        "理解分数除以整数的计算原理",
        "掌握“除以一个数等于乘以这个数的倒数”的法则",
        "能独立计算分数除以整数的结果并约分"
      ],
      "explanation": "当我们计算 $\\frac{a}{b} \\div c$ 时，可以将其转化为乘法计算。\n\n**核心法则**：除以一个整数，等于乘以这个整数的**倒数**。\n\n例如：$\\frac{4}{5} \\div 2$ 实际上就是 $\\frac{4}{5} \\times \\frac{1}{2}$。\n\n计算步骤：\n1. 将除号 $\\div$ 改为乘号 $\\times$。\n2. 将除数（整数）改为它的倒数（例如 2 变成 $\\frac{1}{2}$）。\n3. 分子乘分子，分母乘分母，最后记得约分。",
      "examples": [
        {
          "title": "基础计算",
          "problem": "计算 $\\frac{2}{3} \\div 4$",
          "solution": "$\\frac{2}{3} \\div 4 = \\frac{2}{3} \\times \\frac{1}{4} = \\frac{2 \\times 1}{3 \\times 4} = \\frac{2}{12} = \\frac{1}{6}$",
          "tip": "不要忘记最后的结果要化成最简分数。"
        },
        {
          "title": "稍难计算",
          "problem": "计算 $\\frac{9}{10} \\div 3$",
          "solution": "$\\frac{9}{10} \\div 3 = \\frac{9}{10} \\times \\frac{1}{3} = \\frac{9}{30} = \\frac{3}{10}$",
          "tip": "在相乘之前，如果分子和倒数的分母能约分，可以先约分。"
        }
      ],
      "interaction": "思考一下：如果除数是 5，那么它的倒数是多少？",
      "exercises": [
        {
          "question": "计算 $\\frac{3}{4} \\div 2$",
          "answer": "3/8",
          "explanation": "$\\frac{3}{4} \\times \\frac{1}{2} = \\frac{3}{8}$"
        },
        {
          "question": "计算 $\\frac{5}{6} \\div 5$",
          "answer": "1/6",
          "explanation": "$\\frac{5}{6} \\times \\frac{1}{5} = \\frac{1}{6}$"
        },
        {
          "question": "计算 $\\frac{7}{8} \\div 3$",
          "answer": "7/24",
          "explanation": "$\\frac{7}{8} \\times \\frac{1}{3} = \\frac{7}{24}$"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-008",
    "title": "分数除法",
    "description": "会计算分数除以分数，等于乘除数的倒数。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p183",
      "cms-2022:3.NA.04"
    ],
    "detailedExplanation": "会计算分数除以分数，等于乘除数的倒数。",
    "studyTips": [
      "能说出除以一个分数等于乘它的倒数",
      "能算出分数除法并约分"
    ],
    "practiceQuestions": [
      {
        "question": "计算：（3/4）÷（1/2）＝？",
        "answer": "3/2"
      }
    ],
    "funEmoji": "✅",
    "funFact": "分数除法是小学数学的基础内容。",
    "funStory": "分数除法就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：（3/4）÷（1/2）＝？",
    "funQuestionAnswer": "3/2",
    "tutorialContent": {
      "objectives": [
        "掌握分数除以分数的计算法则",
        "能熟练求出分数的倒数",
        "能正确进行分数除法运算并化简结果"
      ],
      "explanation": "分数除以分数，其原理与分数除以整数相同。\n\n**核心法则**：除以一个分数，等于乘以这个分数的**倒数**。\n\n**什么是倒数？**\n两个数相乘的积是 1，这两个数互为倒数。例如 $\\frac{3}{4}$ 的倒数是 $\\frac{4}{3}$。\n\n**计算步骤**：\n1. 保持被除数不变。\n2. 将除号 $\\div$ 改为 $\\times$。\n3. 将除数改为它的倒数。\n4. 进行乘法运算并约分。",
      "examples": [
        {
          "title": "基础分数除法",
          "problem": "计算 $\\frac{1}{2} \\div \\frac{1}{4}$",
          "solution": "$\\frac{1}{2} \\div \\frac{1}{4} = \\frac{1}{2} \\times 4 = 2$",
          "tip": "记得 $\\frac{1}{4}$ 的倒数是 $4$（或 $\\frac{4}{1}$）。"
        },
        {
          "title": "复杂分数除法",
          "problem": "计算 $\\frac{3}{4} \\div \\frac{2}{3}$",
          "solution": "$\\frac{3}{4} \\div \\frac{2}{3} = \\frac{3}{4} \\times \\frac{3}{2} = \\frac{9}{8} = 1\\frac{1}{8}$",
          "tip": "结果如果是假分数，通常需要化成带分数。"
        }
      ],
      "interaction": "请告诉我 $\\frac{5}{7}$ 的倒数是多少？",
      "exercises": [
        {
          "question": "计算 $\\frac{2}{5} \\div \\frac{1}{3}$",
          "answer": "6/5 或 1-1/5",
          "explanation": "$\\frac{2}{5} \\times 3 = \\frac{6}{5}$"
        },
        {
          "question": "计算 $\\frac{3}{8} \\div \\frac{3}{4}$",
          "answer": "1/2",
          "explanation": "$\\frac{3}{8} \\times \\frac{4}{3} = \\frac{12}{24} = \\frac{1}{2}$"
        },
        {
          "question": "计算 $\\frac{5}{9} \\div \\frac{2}{3}$",
          "answer": "5/6",
          "explanation": "$\\frac{5}{9} \\times \\frac{3}{2} = \\frac{15}{18} = \\frac{5}{6}$"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-009",
    "title": "分数除法的应用",
    "description": "能用分数除法求单位量，或求一个数里面有几个几分之几。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p184",
      "cms-2022:3.NA.04",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "能用分数除法求单位量，或求一个数里面有几个几分之几。",
    "studyTips": [
      "能判断已知几分之几对应的量、求单位 1",
      "能列式并算出结果"
    ],
    "practiceQuestions": [
      {
        "question": "计算：12÷（3/4）＝？",
        "answer": "16"
      }
    ],
    "funEmoji": "✅",
    "funFact": "分数除法的应用是小学数学的基础内容。",
    "funStory": "分数除法的应用就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：12÷（3/4）＝？",
    "funQuestionAnswer": "16",
    "tutorialContent": {
      "objectives": [
        "能识别应用题中是求“单位 1”还是求“几个几分之几”",
        "能将实际问题转化为分数除法算式",
        "能准确计算结果并写明单位"
      ],
      "explanation": "分数除法在实际生活中非常有用。主要有两种应用场景：\n\n1. **求单位 1**：已知 $\\frac{a}{b}$ 对应量 $C$，求 1 对应多少？\n   - 方法：$C \\div \\frac{a}{b}$\n   - 例子：$\\frac{2}{3}$ 的路程是 4 公里，全程（单位 1）是多少？ $4 \\div \\frac{2}{3} = 6$ 公里。\n\n2. **求包含几个几分之几**：已知总数 $C$ 和每一份的量 $\\frac{a}{b}$，求有多少份？\n   - 方法：$C \\div \\frac{a}{b}$\n   - 例子：有 12 升油，每瓶装 $\\frac{3}{4}$ 升，能装多少瓶？ $12 \\div \\frac{3}{4} = 16$ 瓶。",
      "examples": [
        {
          "title": "求单位 1",
          "problem": "一根绳子 $\\frac{3}{5}$ 长度是 12 米，这根绳子全长多少米？",
          "solution": "解：$12 \\div \\frac{3}{5} = 12 \\times \\frac{5}{3} = 20$（米）。答：绳子全长 20 米。",
          "tip": "看到“$\\frac{3}{5}$ 是 12 米，求全长”，这就是求单位 1。"
        },
        {
          "title": "求几个几分之几",
          "problem": "一个大蛋糕 4 公斤，每块切 $\\frac{1}{4}$ 公斤，可以切多少块？",
          "solution": "解：$4 \\div \\frac{1}{4} = 4 \\times 4 = 16$（块）。答：可以切 16 块。",
          "tip": "这是在求 4 里面包含多少个 $\\frac{1}{4}$。"
        }
      ],
      "interaction": "如果已知 $\\frac{1}{2}$ 个西瓜重 3 斤，求整个西瓜重多少？你应该用乘法还是除法？",
      "exercises": [
        {
          "question": "一辆车行驶 $\\frac{2}{7}$ 段路程用了 4 小时，全程需要多少小时？",
          "answer": "14小时",
          "explanation": "求单位 1：$4 \\div \\frac{2}{7} = 4 \\times \\frac{7}{2} = 14$（小时）"
        },
        {
          "question": "有 10 米布，每件衣服用 $\\frac{5}{6}$ 米，可以做多少件？",
          "answer": "12件",
          "explanation": "求包含几个：$10 \\div \\frac{5}{6} = 10 \\times \\frac{6}{5} = 12$（件）"
        },
        {
          "question": "小明读了 $\\frac{3}{8}$ 本书用了 6 天，读完这本书共需要多少天？",
          "answer": "16天",
          "explanation": "求单位 1：$6 \\div \\frac{3}{8} = 6 \\times \\frac{8}{3} = 16$（天）"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-010",
    "title": "比的意义",
    "description": "理解比表示两个数相除的关系，比的前项除以后项叫做比值。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p185",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "理解比表示两个数相除的关系，比的前项除以后项叫做比值。",
    "studyTips": [
      "能说出比的前项除以后项是比值",
      "能求一个简单的比的比值"
    ],
    "practiceQuestions": [
      {
        "question": "比的前项除以后项，得到的叫什么？",
        "answer": "比值"
      }
    ],
    "funEmoji": "✅",
    "funFact": "比的意义是小学数学的基础内容。",
    "funStory": "比的意义就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "比的前项除以后项，得到的叫什么？",
    "funQuestionAnswer": "比值",
    "tutorialContent": {
      "objectives": [
        "理解比的含义及其表示方法",
        "掌握比值及其计算方法",
        "能区分比的前项和后项"
      ],
      "explanation": "当我们想要比较两个数量的关系时，可以使用**“比”**。\n\n1. **比的定义**：比表示两个数相除的关系。例如：3 吨比 5 吨，写成 $3 : 5$。\n2. **前项与后项**：在 $a : b$ 中，$a$ 叫做**前项**，$b$ 叫做**后项**。\n3. **比值**：比的前项除以后项的商，叫做**比值**。\n   - 计算公式：$\text{比值} = \text{前项} \\div \text{后项}$\n   - 例如 $3 : 5$ 的比值就是 $3 \\div 5 = 0.6$ 或 $\\frac{3}{5}$。",
      "examples": [
        {
          "title": "写出比",
          "problem": "男生有 15 人，女生有 20 人，男生人数与女生人数的比是多少？",
          "solution": "比是 $15 : 20$。化简后为 $3 : 4$。",
          "tip": "比可以像分数一样约分化简。"
        },
        {
          "title": "求比值",
          "problem": "求 $4 : 7$ 的比值。",
          "solution": "比值 $= 4 \\div 7 = \\frac{4}{7}$。",
          "tip": "比值通常用分数或小数表示。"
        }
      ],
      "interaction": "如果一个比是 $1 : 2$，它的比值是多少？",
      "exercises": [
        {
          "question": "在比 $5 : 8$ 中，前项是（ ），后项是（ ），比值是（ ）。",
          "answer": "5, 8, 5/8 (或 0.625)",
          "explanation": "前项在冒号前，后项在冒号后，比值等于前项除以后项。"
        },
        {
          "question": "求 $3 : 4$ 的比值。",
          "answer": "3/4 或 0.75",
          "explanation": "比值 $= 3 \\div 4 = 0.75$"
        },
        {
          "question": "一个长方形的长是 6 厘米，宽是 2 厘米，长与宽的比是多少？这个比的比值是多少？",
          "answer": "比是 3:1, 比值是 3",
          "explanation": "比是 $6:2=3:1$，比值 $= 6 \\div 2 = 3$"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-011",
    "title": "化简比",
    "description": "会把比化成最简整数比，前项和后项同时除以最大公因数。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p186",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "会把比化成最简整数比，前项和后项同时除以最大公因数。",
    "studyTips": [
      "能求出前项和后项的最大公因数",
      "能写出最简整数比的前项"
    ],
    "practiceQuestions": [
      {
        "question": "比 12：8 化成最简整数比后，前项是多少？",
        "answer": "3"
      }
    ],
    "funEmoji": "✅",
    "funFact": "化简比是小学数学的基础内容。",
    "funStory": "化简比就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "比 12：8 化成最简整数比后，前项是多少？",
    "funQuestionAnswer": "3",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-012",
    "title": "按比分配",
    "description": "会把一个总量按给定的比分成若干份。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p187",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "会把一个总量按给定的比分成若干份。",
    "studyTips": [
      "能求出每一份是多少",
      "能按比算出各部分"
    ],
    "practiceQuestions": [
      {
        "question": "计算：30÷（2＋3）×2＝？",
        "answer": "12"
      }
    ],
    "funEmoji": "✅",
    "funFact": "按比分配是小学数学的基础内容。",
    "funStory": "按比分配就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：30÷（2＋3）×2＝？",
    "funQuestionAnswer": "12",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-013",
    "title": "圆的认识",
    "description": "认识圆心、半径和直径，会用圆规画圆，知道同一圆里半径都相等。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p188",
      "cms-2022:3.GG.02"
    ],
    "detailedExplanation": "认识圆心、半径和直径，会用圆规画圆，知道同一圆里半径都相等。",
    "studyTips": [
      "能说出圆上的点到圆心的距离都等于半径",
      "知道直径等于半径的 2 倍"
    ],
    "practiceQuestions": [
      {
        "question": "圆上的点到圆心的距离怎样？",
        "answer": "距离都等于半径"
      }
    ],
    "funEmoji": "✅",
    "funFact": "圆的认识是小学数学的基础内容。",
    "funStory": "圆的认识就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "圆上的点到圆心的距离怎样？",
    "funQuestionAnswer": "距离都等于半径",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-014",
    "title": "圆周率",
    "description": "知道圆周率是圆的周长与直径的比，计算时可以取 3.14。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p189",
      "cms-2022:3.GG.02"
    ],
    "detailedExplanation": "知道圆周率是圆的周长与直径的比，计算时可以取 3.14。",
    "studyTips": [
      "能说出圆周率大约是 3.14",
      "能用直径乘 3.14 估计周长"
    ],
    "practiceQuestions": [
      {
        "question": "圆周率大约是多少？",
        "answer": "3.14"
      }
    ],
    "funEmoji": "✅",
    "funFact": "圆周率是小学数学的基础内容。",
    "funStory": "圆周率就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "圆周率大约是多少？",
    "funQuestionAnswer": "3.14",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-015",
    "title": "圆的周长",
    "description": "会用直径乘圆周率，或半径的 2 倍乘圆周率，求圆的周长。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p190",
      "cms-2022:3.GG.02"
    ],
    "detailedExplanation": "会用直径乘圆周率，或半径的 2 倍乘圆周率，求圆的周长。",
    "studyTips": [
      "能根据半径求周长",
      "能根据直径求周长"
    ],
    "practiceQuestions": [
      {
        "question": "半径 2 厘米的圆，周长是多少厘米？圆周率按 314/100。",
        "answer": "12.56"
      }
    ],
    "funEmoji": "✅",
    "funFact": "圆的周长是小学数学的基础内容。",
    "funStory": "圆的周长就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "半径 2 厘米的圆，周长是多少厘米？圆周率按 314/100。",
    "funQuestionAnswer": "12.56",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-016",
    "title": "圆的周长的应用",
    "description": "能用圆的周长解决车轮滚动、圆形花坛一周的长度等问题。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p191",
      "cms-2022:3.GG.02"
    ],
    "detailedExplanation": "能用圆的周长解决车轮滚动、圆形花坛一周的长度等问题。",
    "studyTips": [
      "能判断绕一周用周长",
      "能代入半径或直径计算"
    ],
    "practiceQuestions": [
      {
        "question": "半径 1 厘米的圆，周长是多少厘米？圆周率按 314/100。",
        "answer": "6.28"
      }
    ],
    "funEmoji": "✅",
    "funFact": "圆的周长的应用是小学数学的基础内容。",
    "funStory": "圆的周长的应用就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "半径 1 厘米的圆，周长是多少厘米？圆周率按 314/100。",
    "funQuestionAnswer": "6.28",
    "tutorialContent": {
      "objectives": [
        "理解圆的周长在实际生活中的应用场景",
        "能够识别需要使用周长公式解决的问题（如绕行、滚动）",
        "熟练运用 C=πd 或 C=2πr 计算实际问题的结果",
        "掌握车轮滚动距离与周长的数量关系"
      ],
      "explanation": "### 圆的周长应用\n圆的周长是指圆一周的长度。在实际应用中，我们经常遇到以下两种典型场景：\n1. **绕行问题**：如沿圆形花坛走一圈，走过的距离就是圆的周长。\n2. **滚动问题**：车轮滚动**一周**所经过的距离，正好等于这个车轮的**周长**。如果滚动 $n$ 圈，总路程就是 $n \\times \\text{周长}$。\n\n**核心公式：**\n- $C = \\pi d$ （直径 $\\times$ 圆周率）\n- $C = 2\\pi r$ （$2 \\times$ 圆周率 $\\times$ 半径）",
      "examples": [
        {
          "title": "基础应用：计算花坛周长",
          "problem": "一个圆形花坛的直径是 5 米，小明绕着花坛走了一圈，他走了多少米？（$\\pi$ 取 3.14）",
          "solution": "根据公式 $C = \\pi d$，计算：$3.14 \\times 5 = 15.7$（米）。答：小明走了 15.7 米。",
          "tip": "看到“绕一圈”就要想到求周长。"
        },
        {
          "title": "进阶应用：车轮滚动距离",
          "problem": "一个车轮的半径是 0.3 米，这个车轮滚动 100 圈，行驶的距离是多少米？（$\\pi$ 取 3.14）",
          "solution": "先算一个车轮的周长：$C = 2 \\times 3.14 \\times 0.3 = 1.884$（米）。\n再算 100 圈的距离：$1.884 \\times 100 = 188.4$（米）。\n答：行驶的距离是 188.4 米。",
          "tip": "滚动距离 = 周长 $\\times$ 圈数。"
        }
      ],
      "interaction": "想象一下，如果你在操场上走一个圆圈，你走过的路线其实就是这个圆的周长。如果一个轮子转了一圈，它在地面上留下的痕迹长度就是它的周长。",
      "exercises": [
        {
          "question": "一个圆形的桌面半径是 0.6 米，它的周长是多少米？（$\\pi$ 取 3.14）",
          "answer": "3.768",
          "explanation": "$2 \\times 3.14 \\times 0.6 = 3.768$ 米。"
        },
        {
          "question": "一个车轮的直径是 60 厘米，滚动 10 圈经过的距离是多少米？（$\\pi$ 取 3.14）",
          "answer": "18.84",
          "explanation": "周长 $3.14 \\times 60 = 188.4$ 厘米，10 圈为 $188.4 \\times 10 = 1884$ 厘米 $= 18.84$ 米。"
        },
        {
          "question": "一个圆形的跑道周长是 314 米，它的直径是多少米？",
          "answer": "100",
          "explanation": "直径 $d = C \\div \\pi = 314 \\div 3.14 = 100$ 米。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-017",
    "title": "圆的面积",
    "description": "会用半径乘半径再乘圆周率求圆的面积。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p192",
      "cms-2022:3.GG.02"
    ],
    "detailedExplanation": "会用半径乘半径再乘圆周率求圆的面积。",
    "studyTips": [
      "能说出圆的面积用半径计算",
      "能算出简单的圆面积"
    ],
    "practiceQuestions": [
      {
        "question": "半径 2 厘米的圆，面积是多少平方厘米？圆周率按 314/100。",
        "answer": "12.56"
      }
    ],
    "funEmoji": "✅",
    "funFact": "圆的面积是小学数学的基础内容。",
    "funStory": "圆的面积就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "半径 2 厘米的圆，面积是多少平方厘米？圆周率按 314/100。",
    "funQuestionAnswer": "12.56",
    "tutorialContent": {
      "objectives": [
        "理解圆面积的概念",
        "掌握圆面积的计算公式 $S = \\pi r^2$",
        "能够正确进行半径的平方运算",
        "能将圆面积公式应用于简单的实际计算"
      ],
      "explanation": "### 圆的面积\n圆的面积是指圆盘内部所占平面的大小。通过将圆分割成无数个小扇形并重新拼接，我们可以发现圆的面积可以用一个长方形来模拟。\n\n**核心公式：**\n$$S = \\pi r^2$$ \n（即：面积 = 圆周率 $\\times$ 半径 $\\times$ 半径）\n\n**注意点：**\n- $r^2$ 表示 $r \\times r$，而不是 $r \\times 2$。\n- 面积单位是平方单位（如 $\\text{cm}^2, \\text{m}^2$）。",
      "examples": [
        {
          "title": "基础计算：已知半径求面积",
          "problem": "计算半径为 2 厘米的圆的面积。（$\\pi$ 取 3.14）",
          "solution": "$S = 3.14 \\times 2^2 = 3.14 \\times 4 = 12.56$（平方厘米）。",
          "tip": "记得先算半径的平方，再乘以 3.14。"
        },
        {
          "title": "进阶计算：已知直径求面积",
          "problem": "一个圆的直径是 10 厘米，它的面积是多少平方厘米？（$\\pi$ 取 3.14）",
          "solution": "首先求半径：$r = 10 \\div 2 = 5$（厘米）。\n计算面积：$S = 3.14 \\times 5^2 = 3.14 \\times 25 = 78.5$（平方厘米）。",
          "tip": "公式里用的是半径，如果题目给的是直径，记得先除以 2。"
        }
      ],
      "interaction": "试着画一个圆，如果把圆切成很多很多极小的扇形，然后像拼图一样拼起来，它会变得越来越像一个长方形，这个长方形的宽就是半径 $r$，长就是周长的一半 $\\pi r$。",
      "exercises": [
        {
          "question": "半径为 3 厘米的圆，面积是多少平方厘米？（$\\pi$ 取 3.14）",
          "answer": "28.26",
          "explanation": "$3.14 \\times 3 \\times 3 = 28.26$ 平方厘米。"
        },
        {
          "question": "一个圆形地毯的直径是 4 米，它的面积是多少平方米？（$\\pi$ 取 3.14）",
          "answer": "12.56",
          "explanation": "半径 $r = 2$ 米，$S = 3.14 \\times 2^2 = 12.56$ 平方米。"
        },
        {
          "question": "如果圆的半径扩大 2 倍，面积扩大多少倍？",
          "answer": "4",
          "explanation": "因为 $S = \\pi r^2$，半径变为 $2r$ 后，面积变为 $\\pi(2r)^2 = 4\\pi r^2$，所以扩大 4 倍。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-018",
    "title": "扇形的认识",
    "description": "认识扇形是由圆心角的两条半径和一段弧围成的图形。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p193",
      "cms-2022:3.GG.02"
    ],
    "detailedExplanation": "认识扇形是由圆心角的两条半径和一段弧围成的图形。",
    "studyTips": [
      "能指出扇形的两条半径",
      "能比较圆心角较大时扇形也较大"
    ],
    "practiceQuestions": [
      {
        "question": "计算：2＋1＝？",
        "answer": "3"
      }
    ],
    "funEmoji": "✅",
    "funFact": "扇形的认识是小学数学的基础内容。",
    "funStory": "扇形的认识就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：2＋1＝？",
    "funQuestionAnswer": "3",
    "tutorialContent": {
      "objectives": [
        "能够定义并识别扇形",
        "指出扇形的组成部分：两条半径和一段弧",
        "理解圆心角与扇形大小的关系",
        "能区分扇形与圆及圆心角"
      ],
      "explanation": "### 扇形的认识\n**什么是扇形？**\n扇形是由圆心角 $\\text{O}$ 的两条半径 $\\text{OA}$ 和 $\\text{OB}$ 以及弧 $\\text{AB}$ 围成的图形。\n\n**关键特征：**\n1. **组成**：2 条半径 + 1 段弧。\n2. **圆心角**：扇形两条半径所夹的角叫做这个扇形的圆心角。\n3. **大小关系**：在同一个圆（或半径相等的圆）中，**圆心角越大，扇形就越大**。",
      "examples": [
        {
          "title": "识别扇形",
          "problem": "在圆中，由半径 $\\text{OA}$、$\\text{OB}$ 和弧 $\\text{AB}$ 围成的图形叫什么？",
          "solution": "叫做扇形。",
          "tip": "只要看到由两条半径和一段弧围成，就是扇形。"
        },
        {
          "title": "扇形大小比较",
          "problem": "在同一个圆中，扇形 A 的圆心角是 $60^\\circ$，扇形 B 的圆心角是 $90^\\circ$，哪个扇形更大？",
          "solution": "因为 $90^\\circ > 60^\\circ$，所以扇形 B 更大。",
          "tip": "圆心角就像扇形的“开口”，开口越大，面积越大。"
        }
      ],
      "interaction": "想象一下你手里拿着一把折扇，当你把扇子展开得越大，圆心角就越大，扇面的面积也就越大。",
      "exercises": [
        {
          "question": "扇形是由什么围成的图形？",
          "answer": "两条半径和一段弧",
          "explanation": "这是扇形的定义。"
        },
        {
          "question": "在同一个圆中，两个扇形，圆心角分别是 $45^\\circ$ 和 $120^\\circ$，哪个扇形小？",
          "answer": "圆心角 $45^\\circ$ 的扇形",
          "explanation": "圆心角越小，扇形越小。"
        },
        {
          "question": "圆心角是 $180^\\circ$ 的扇形是什么形状？",
          "answer": "半圆",
          "explanation": "当圆心角为 $180^\\circ$ 时，弧是半圆弧，图形刚好是一个半圆。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-019",
    "title": "百分数的意义",
    "description": "理解百分数表示一个数是另一个数的百分之几。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p194",
      "cms-2022:3.NA.04"
    ],
    "detailedExplanation": "理解百分数表示一个数是另一个数的百分之几。",
    "studyTips": [
      "能说出百分数表示的是两个数的倍比关系",
      "能读出一个百分数"
    ],
    "practiceQuestions": [
      {
        "question": "百分数表示什么？",
        "answer": "一个数是另一个数的百分之几"
      }
    ],
    "funEmoji": "✅",
    "funFact": "百分数的意义是小学数学的基础内容。",
    "funStory": "百分数的意义就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "百分数表示什么？",
    "funQuestionAnswer": "一个数是另一个数的百分之几",
    "tutorialContent": {
      "objectives": [
        "理解百分数的含义：表示两个数之间的倍比关系",
        "能够正确读写百分数",
        "理解百分数的分母是 100 的特例",
        "能够将实际问题转化为百分数描述"
      ],
      "explanation": "### 百分数的意义\n**什么是百分数？**\n百分数是一种特殊的分数，它的分母固定是 **100**，分子可以是整数或小数，也可以是分数。我们用百分号 \"$\\%$\" 来表示。\n\n**本质含义：**\n百分数表示一个数是另一个数的**百分之几**。它实际上是在描述两个数之间的**倍比关系**。\n\n**例子：**\n- $25\\%$ 表示 $\\frac{25}{100}$，即一个数是另一个数的 $\\frac{1}{4}$。\n- 读作：百分之二十五。",
      "examples": [
        {
          "title": "百分数的读写",
          "problem": "将 $\\frac{7}{100}$ 写成百分数，并读出来。",
          "solution": "写成：$7\\%$。读作：百分之七。",
          "tip": "记得百分数读法是从右向左，先读“百分之”，再读分子。"
        },
        {
          "title": "理解百分数的意义",
          "problem": "某班有 50 人，女生 20 人。女生人数占全班人数的百分之几？",
          "solution": "计算：$20 \\div 50 = 0.4 = 40\\%$。答：女生人数占全班人数的 $40\\%$。",
          "tip": "百分数 = $\\text{部分} \\div \\text{整体} \\times 100\\%$。"
        }
      ],
      "interaction": "你可以把百分数想象成把任何东西都平均分成 100 份。比如 $50\\%$ 就是刚好一半，$100\\%$ 就是全部。",
      "exercises": [
        {
          "question": "百分数 $82\\%$ 读作什么？",
          "answer": "百分之八十二",
          "explanation": "百分数的标准读法。"
        },
        {
          "question": "百分数表示的是两个数之间的什么关系？",
          "answer": "倍比关系",
          "explanation": "百分数描述的是一个数是另一个数的百分之几。"
        },
        {
          "question": "将 $\\frac{13}{100}$ 化成百分数是多少？",
          "answer": "13%",
          "explanation": "分母为 100 的分数直接将分子写在 $\\text{%}$ 前即可。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-020",
    "title": "百分数与分数、小数互化",
    "description": "会把百分数化成分数或小数，也会把小数化成百分数。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p195",
      "cms-2022:3.NA.02"
    ],
    "detailedExplanation": "会把百分数化成分数或小数，也会把小数化成百分数。",
    "studyTips": [
      "能把百分数化成小数",
      "能把小数化成百分数"
    ],
    "practiceQuestions": [
      {
        "question": "把百分数 35% 化成小数，是多少？",
        "answer": "0.35"
      }
    ],
    "funEmoji": "✅",
    "funFact": "百分数与分数、小数互化是小学数学的基础内容。",
    "funStory": "百分数与分数、小数互化就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "把百分数 35% 化成小数，是多少？",
    "funQuestionAnswer": "0.35",
    "tutorialContent": {
      "objectives": [
        "掌握百分数化成分数的方法",
        "掌握百分数化成小数的方法",
        "掌握小数化成百分数的方法",
        "能够灵活在三种数形式之间进行转换"
      ],
      "explanation": "### 百分数与分数、小数互化\n百分数、小数、分数是同一数值的不同表达方式，它们可以互相转化：\n\n1. **百分数 $\\rightarrow$ 分数**：\n   - 将百分数写成 $\\frac{\\text{分子}}{100}$ 的形式，然后约分化成最简分数。\n   - 例如：$20\\% = \\frac{20}{100} = \\frac{1}{5}$\n\n2. **百分数 $\\rightarrow$ 小数**：\n   - 将百分数去掉 $\\text{%}$，小数点向左移动两位。\n   - 例如：$35\\% = 0.35$\n\n3. **小数 $\\rightarrow$ 百分数**：\n   - 将小数点向右移动两位，在末尾加上 $\\text{%}$。\n   - 例如：$0.125 = 12.5\\%$",
      "examples": [
        {
          "title": "百分数化小数",
          "problem": "把 $48\\%$ 化成小数。",
          "solution": "$48\\% = 0.48$。",
          "tip": "小数点向左移两位，$\\text{%}$ 变消失。"
        },
        {
          "title": "小数化百分数",
          "problem": "把 $0.07$ 化成百分数。",
          "solution": "$0.07 = 7\\%$。",
          "tip": "小数点向右移两位，记得补上 $\\text{%}$。"
        },
        {
          "title": "百分数化分数",
          "problem": "把 $75\\%$ 化成最简分数。",
          "solution": "$75\\% = \\frac{75}{100} = \\frac{3}{4}$。",
          "tip": "先写成分母 100 的分数，再用最大公约数约分。"
        }
      ],
      "interaction": "记住一个小口诀：化小数，点左移二；化百分，点右移二；化分数，分母一百。",
      "exercises": [
        {
          "question": "把 $0.65$ 化成百分数。",
          "answer": "65%",
          "explanation": "小数点右移两位 $\\rightarrow 65\\%$。"
        },
        {
          "question": "把 $12\\%$ 化成小数。",
          "answer": "0.12",
          "explanation": "小数点左移两位 $\\rightarrow 0.12$。"
        },
        {
          "question": "把 $40\\%$ 化成最简分数。",
          "answer": "2/5",
          "explanation": "$40\\% = \\frac{40}{100} = \\frac{4}{10} = \\frac{2}{5}$。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-021",
    "title": "求一个数的百分之几",
    "description": "会求一个数的百分之几是多少。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p196",
      "cms-2022:3.NA.04"
    ],
    "detailedExplanation": "会求一个数的百分之几是多少。",
    "studyTips": [
      "能把百分之几化成小数或分数再乘",
      "能算出结果"
    ],
    "practiceQuestions": [
      {
        "question": "80 的 25% 是多少？",
        "answer": "20"
      }
    ],
    "funEmoji": "✅",
    "funFact": "求一个数的百分之几是小学数学的基础内容。",
    "funStory": "求一个数的百分之几就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "80 的 25% 是多少？",
    "funQuestionAnswer": "20",
    "tutorialContent": {
      "objectives": [
        "理解“求一个数的百分之几”的含义",
        "掌握将百分数转化为小数或分数的计算方法",
        "能独立计算出一个数的百分之几是多少",
        "能将该知识点应用于简单的实际问题"
      ],
      "explanation": "### 求一个数的百分之几\n\n**核心概念**：求一个数的百分之几，就是用这个数乘以这个百分数。\n\n**计算步骤**：\n1. **转化**：将百分数化成**小数**或**分数**。\n2. **相乘**：用原数 $\\times$ 转化后的数 $\\text{= 结果}$。\n\n**公式**：$\text{结果} = \text{原数} \\times \\text{百分数}$\n\n**例子**：求 50 的 20%。\n- 方法一（化小数）：$50 \\times 0.2 = 10$\n- 方法二（化分数）：$50 \\times \\frac{20}{100} = 10$",
      "examples": [
        {
          "title": "基础计算",
          "problem": "求 100 的 15% 是多少？",
          "solution": "100 × 15% = 100 × 0.15 = 15",
          "tip": "100 乘以百分数，结果就是百分数去掉百分号后的数值。"
        },
        {
          "title": "小数计算",
          "problem": "计算 80 的 25% 是多少？",
          "solution": "80 × 25% = 80 × 0.25 = 20",
          "tip": "25% 等于 1/4，所以也可以用 80 ÷ 4 = 20。"
        },
        {
          "title": "实际应用",
          "problem": "一件衣服原价 200 元，现在打八折（即现价是原价的 80%），现价是多少元？",
          "solution": "200 × 80% = 200 × 0.8 = 160（元）",
          "tip": "先找原数（200），再找百分比（80%），最后相乘。"
        }
      ],
      "interaction": "试着想一想：如果我们要计算 60 的 10%，你是习惯把它看作 60 × 0.1 还是 60 × 1/10 呢？",
      "exercises": [
        {
          "question": "求 40 的 30% 是多少？",
          "answer": "12",
          "explanation": "40 × 0.3 = 12"
        },
        {
          "question": "计算 120 的 45% 是多少？",
          "answer": "54",
          "explanation": "120 × 0.45 = 54"
        },
        {
          "question": "一个篮子里有 50 个水果，其中 20% 是苹果，苹果有多少个？",
          "answer": "10",
          "explanation": "50 × 20% = 10"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-022",
    "title": "求百分率",
    "description": "会求一个数是另一个数的百分之几。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p197",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "会求一个数是另一个数的百分之几。",
    "studyTips": [
      "能用部分除以总数",
      "能把得数写成百分数"
    ],
    "practiceQuestions": [
      {
        "question": "计算：20÷80×100＝？",
        "answer": "25"
      }
    ],
    "funEmoji": "✅",
    "funFact": "求百分率是小学数学的基础内容。",
    "funStory": "求百分率就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：20÷80×100＝？",
    "funQuestionAnswer": "25",
    "tutorialContent": {
      "objectives": [
        "理解百分率的含义，即部分与整体的比率",
        "掌握求百分率的计算公式：部分 ÷ 整体",
        "学会将商转化为百分数形式",
        "能解决生活中求百分率的实际问题"
      ],
      "explanation": "### 求百分率\n\n**核心概念**：求一个数是另一个数的百分之几，就是求这两个数的**比率**，并用百分数表示。\n\n**计算步骤**：\n1. **除法**：用$\text{部分} \\div \text{整体}$。\n2. **转化**：将得数（小数）乘以 100，并在末尾加上百分号 `%`。\n\n**公式**：$\text{百分率} = \frac{\text{部分}}{\text{整体}} \\times 100\\%$\n\n**注意**：在求百分率时，除数必须是“整体”或“基准数”。",
      "examples": [
        {
          "title": "基础计算",
          "problem": "20 是 80 的百分之几？",
          "solution": "20 ÷ 80 = 0.25 = 25%",
          "tip": "先做除法得到小数，再把小数转化为百分数。"
        },
        {
          "title": "分数转化",
          "problem": "3 是 12 的百分之几？",
          "solution": "3 ÷ 12 = 1/4 = 0.25 = 25%",
          "tip": "如果除法结果是分数，可以先化成小数再转百分数。"
        },
        {
          "title": "实际应用",
          "problem": "某班有 40 名学生，其中女生 18 人，女生占全班人数的百分之几？",
          "solution": "18 ÷ 40 = 0.45 = 45%",
          "tip": "整体是全班人数 40，部分是女生人数 18。"
        }
      ],
      "interaction": "如果部分比整体大，比如 120 是 100 的百分之几？你认为结果会超过 100% 吗？",
      "exercises": [
        {
          "question": "15 是 60 的百分之几？",
          "answer": "25%",
          "explanation": "15 ÷ 60 = 0.25 = 25%"
        },
        {
          "question": "9 是 45 的百分之几？",
          "answer": "20%",
          "explanation": "9 ÷ 45 = 0.2 = 20%"
        },
        {
          "question": "一个篮子里有 25 个球，其中红色球有 5 个，红色球占总数的百分之几？",
          "answer": "20%",
          "explanation": "5 ÷ 25 = 0.2 = 20%"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-023",
    "title": "已知一个数的百分之几求这个数",
    "description": "已知一个数的百分之几是多少，会求出这个数。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p198",
      "cms-2022:3.NA.04"
    ],
    "detailedExplanation": "已知一个数的百分之几是多少，会求出这个数。",
    "studyTips": [
      "能判断用除法求单位 1",
      "能算出原来的数"
    ],
    "practiceQuestions": [
      {
        "question": "计算：20÷0.4＝？（用小数作答）",
        "answer": "50"
      }
    ],
    "funEmoji": "✅",
    "funFact": "已知一个数的百分之几求这个数是小学数学的基础内容。",
    "funStory": "已知一个数的百分之几求这个数就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：20÷0.4＝？（用小数作答）",
    "funQuestionAnswer": "50",
    "tutorialContent": {
      "objectives": [
        "理解“已知部分求整体”的反向运算逻辑",
        "掌握已知百分之几求原数的计算方法",
        "能区分该类问题与“求一个数的百分之几”的区别",
        "能解决复杂的实际应用题"
      ],
      "explanation": "### 已知一个数的百分之几求这个数\n\n**核心概念**：当我们知道一个数的 $\\text{x}\\% \\text{= 某个值}$ 时，我们需要求出 $\\text{100}\\%$（即原数）。\n\n**计算步骤**：\n1. **转化**：将百分数化成小数或分数。\n2. **除法**：用$\text{已知的部分} \\div \text{百分数} \\text{= 原数}$。\n\n**公式**：$\text{原数} = \text{部分} \\div \text{百分率}$\n\n**对比记忆**：\n- 求部分：$\text{整体} \\times \\text{百分率}$\n- 求整体：$\text{部分} \\div \\text{百分率}$",
      "examples": [
        {
          "title": "基础计算",
          "problem": "一个数的 40% 是 20，这个数是多少？",
          "solution": "20 ÷ 40% = 20 ÷ 0.4 = 50",
          "tip": "除以一个小于 1 的小数，结果会比被除数大。"
        },
        {
          "title": "分数计算",
          "problem": "一个数的 25% 是 12，这个数是多少？",
          "solution": "12 ÷ 25% = 12 ÷ (1/4) = 12 × 4 = 48",
          "tip": "除以 25% 相当于乘以 4。"
        },
        {
          "title": "实际应用",
          "problem": "小明读了一本书的 60%，还剩 40 页没读，这本书一共多少页？",
          "solution": "先找剩余部分的百分比：1 - 60% = 40%\\n总页数：40 ÷ 40% = 40 ÷ 0.4 = 100（页）",
          "tip": "注意题目给的是“已读”还是“未读”，要确保百分比与数值对应。"
        }
      ],
      "interaction": "如果一个数的 10% 是 5，那么这个数应该是 50 还是 0.5？为什么？",
      "exercises": [
        {
          "question": "一个数的 20% 是 10，这个数是多少？",
          "answer": "50",
          "explanation": "10 ÷ 0.2 = 50"
        },
        {
          "question": "一个数的 75% 是 30，这个数是多少？",
          "answer": "40",
          "explanation": "30 ÷ 0.75 = 40"
        },
        {
          "question": "商店打折后一件衣服卖 120 元，已知这 120 元是原价的 80%，原价是多少元？",
          "answer": "150",
          "explanation": "120 ÷ 0.8 = 150"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-024",
    "title": "扇形统计图",
    "description": "认识扇形统计图，能看出各部分占总数的多少。",
    "tags": [
      "统计与概率",
      "grade-6",
      "cnm:cnm_p199",
      "cms-2022:3.SP.02"
    ],
    "detailedExplanation": "认识扇形统计图，能看出各部分占总数的多少。",
    "studyTips": [
      "能说出扇形统计图表示部分占总数的多少",
      "能根据百分数算出某一部分的数量"
    ],
    "practiceQuestions": [
      {
        "question": "扇形统计图适合看什么？",
        "answer": "各部分占总数的多少"
      }
    ],
    "funEmoji": "✅",
    "funFact": "扇形统计图是小学数学的基础内容。",
    "funStory": "扇形统计图就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "扇形统计图适合看什么？",
    "funQuestionAnswer": "各部分占总数的多少",
    "tutorialContent": {
      "objectives": [
        "识别扇形统计图的结构及其特点",
        "理解扇形统计图表示的是“部分占总数的多少”",
        "能根据扇形图上的百分数读取数据",
        "能将扇形图的百分数转化为具体数值"
      ],
      "explanation": "### 扇形统计图\n\n**核心概念**：扇形统计图是用扇形的大小来表示各部分占总数的百分之几。它最适合用来观察**各部分占总数的比例**。\n\n**关键点**：\n1. **总和**：扇形统计图中所有部分的百分数之和必须等于 $100\\%$。\n2. **含义**：扇形面积越大，所占的百分比越高，数量也就越多。\n\n**计算方法**：\n若想知道某部分具体是多少，可结合 $\text{总数} \\times \\text{该部分百分数}$ 来计算。",
      "examples": [
        {
          "title": "读取信息",
          "problem": "某校学生课外活动统计图中，“体育”扇形标注为 35%，这意味着什么？",
          "solution": "这意味着参加体育活动的学生占全校总人数的 35%。",
          "tip": "扇形图直接告诉我们的是“占比”而非“具体人数”。"
        },
        {
          "title": "数量计算",
          "problem": "全校有 1000 人，扇形统计图显示“音乐”占 20%，那么参加音乐活动的人数是多少？",
          "solution": "1000 × 20% = 200（人）",
          "tip": "利用 $\text{总数} \\times \\text{百分数}$ 计算具体数量。"
        },
        {
          "title": "综合分析",
          "problem": "在一个水果店的销售统计图中，苹果占 40%，香蕉占 30%，其他水果占多少？",
          "solution": "100% - 40% - 30% = 30%",
          "tip": "所有扇形部分相加必须等于 100%。"
        }
      ],
      "interaction": "如果你想比较两个班级在体育项目上的表现，是应该看条形统计图还是扇形统计图？",
      "exercises": [
        {
          "question": "扇形统计图最适合用来表示什么？",
          "answer": "各部分占总数的多少（百分比）",
          "explanation": "扇形统计图强调的是比例关系。"
        },
        {
          "question": "某图书室图书总量 500 本，科学类图书占 12%，科学类图书有多少本？",
          "answer": "60",
          "explanation": "500 × 12% = 60"
        },
        {
          "question": "一个扇形统计图中， A 部分占 25%，B 部分占 50%，那么 C 部分占百分之几？",
          "answer": "25%",
          "explanation": "100% - 25% - 50% = 25%"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-025",
    "title": "数与形",
    "description": "能借助图形发现简单数列的规律，并算出接下来的一个数。",
    "tags": [
      "综合与实践",
      "grade-6",
      "cnm:cnm_p200",
      "cms-2022:3.NA.07"
    ],
    "detailedExplanation": "能借助图形发现简单数列的规律，并算出接下来的一个数。",
    "studyTips": [
      "能说出点阵或图形每次增加多少",
      "能按规律算出下一项"
    ],
    "practiceQuestions": [
      {
        "question": "用小圆点摆正方形点阵：第 1 个图有 1 个点，第 2 个图有 4 个点，第 3 个图有 9 个点。第 2 个图比第 1 个图多几个点？",
        "answer": "3"
      }
    ],
    "funEmoji": "✅",
    "funFact": "数与形是小学数学的基础内容。",
    "funStory": "数与形就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "用小圆点摆正方形点阵：第 1 个图有 1 个点，第 2 个图有 4 个点，第 3 个图有 9 个点。第 2 个图比第 1 个图多几个点？",
    "funQuestionAnswer": "3",
    "tutorialContent": {
      "objectives": [
        "能观察点阵或图形的变化规律",
        "能将图形变化转化为数学数列",
        "能推导出数列的计算通项（简单规律）",
        "能预测并计算出序列中的下一个数"
      ],
      "explanation": "### 数与形\n\n**核心概念**：通过观察图形的排列、增加方式，寻找隐藏的数字规律。\n\n**分析方法**：\n1. **列举**：记录第 1 个、第 2 个、第 3 个图中的数量。\n2. **找差值**：计算相邻两项之间增加了多少（例如：$4-1=3, 9-4=5$）。\n3. **找规律**：观察差值是否固定，或者差值本身是否有规律（如奇数序列）。\n4. **推演**：根据规律算出下一项 $\text{数量} = \text{当前数量} + \text{增加量}$。\n\n**常见模型**：\n- **等差增加**：每次增加相同数量。\n- **平方数**：如 $1\\times 1, 2\\times 2, 3\\times 3...$（正方形点阵）。",
      "examples": [
        {
          "title": "正方形点阵",
          "problem": "第 1 个图 1 个点，第 2 个图 4 个点，第 3 个图 9 个点。第 4 个图有多少个点？",
          "solution": "规律是 $n \\times n$。第 4 个图为 $4 \\times 4 = 16$ 个点。",
          "tip": "观察到 $1^2=1, 2^2=4, 3^2=9$，这是一个平方数数列。"
        },
        {
          "title": "等差增加",
          "problem": "一个图形第 1 项有 3 个圆圈，第 2 项有 5 个，第 3 项有 7 个。第 4 项有几个？",
          "solution": "每次增加 $5-3=2$ 个。第 4 项为 $7 + 2 = 9$ 个。",
          "tip": "计算相邻两项的差，如果差相等，就是等差数列。"
        },
        {
          "title": "递增差值",
          "problem": "第 1 项 1 个点，第 2 项 3 个点，第 3 项 6 个点，第 4 项 10 个点。第 5 项有几个？",
          "solution": "增加量分别为：+2, +3, +4。下一个增加量应为 +5。结果：$10 + 5 = 15$。",
          "tip": "当差值不固定时，看看差值本身是否在按顺序增加。"
        }
      ],
      "interaction": "如果你发现一个点阵每次增加的数量在 3, 5, 7, 9... 这样变化，你觉得它可能跟什么图形有关？",
      "exercises": [
        {
          "question": "数列：2, 5, 8, 11... 下一个数是多少？",
          "answer": "14",
          "explanation": "每个数比前一个多 3，11 + 3 = 14"
        },
        {
          "question": "图形点数规律：1, 4, 9, 16... 第 5 个图有多少个点？",
          "answer": "25",
          "explanation": "规律是 $n \\times n$，所以 $5 \\times 5 = 25$"
        },
        {
          "question": "数列：1, 3, 7, 13... 下一个数是多少？",
          "answer": "21",
          "explanation": "增加量分别是 2, 4, 6，下一个增加量应为 8，13 + 8 = 21"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-026",
    "title": "认识负数",
    "description": "在温度、海拔、收支等情境里认识负数，知道负数表示与正数意义相反的量。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p201",
      "cms-2022:3.IP.01"
    ],
    "detailedExplanation": "在温度、海拔、收支等情境里认识负数，知道负数表示与正数意义相反的量。",
    "studyTips": [
      "能说出负数表示与正数意义相反的量",
      "能用负数表示零下温度"
    ],
    "practiceQuestions": [
      {
        "question": "负数表示的是什么？",
        "answer": "与正数意义相反的量"
      }
    ],
    "funEmoji": "✅",
    "funFact": "认识负数是小学数学的基础内容。",
    "funStory": "认识负数就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "负数表示的是什么？",
    "funQuestionAnswer": "与正数意义相反的量",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-027",
    "title": "用负数表示相反意义的量",
    "description": "会用正数和负数表示收入与支出、上升与下降等相反意义的量。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p202",
      "cms-2022:3.IP.01"
    ],
    "detailedExplanation": "会用正数和负数表示收入与支出、上升与下降等相反意义的量。",
    "studyTips": [
      "能选定正方向",
      "能算出上升和下降合起来的结果"
    ],
    "practiceQuestions": [
      {
        "question": "小明收入 8 元记作＋8 元，支出 5 元记作－5 元。他先收入 8 元，又支出 5 元，结余多少元？",
        "answer": "3"
      }
    ],
    "funEmoji": "✅",
    "funFact": "用负数表示相反意义的量是小学数学的基础内容。",
    "funStory": "用负数表示相反意义的量就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "小明收入 8 元记作＋8 元，支出 5 元记作－5 元。他先收入 8 元，又支出 5 元，结余多少元？",
    "funQuestionAnswer": "3",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-028",
    "title": "折扣",
    "description": "理解折扣的含义，会求打折后的价钱。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p203",
      "cms-2022:3.NA.04"
    ],
    "detailedExplanation": "理解折扣的含义，会求打折后的价钱。",
    "studyTips": [
      "能说出八折是原价的 80%",
      "能计算打折后的价格"
    ],
    "practiceQuestions": [
      {
        "question": "折扣里的八折是什么意思？",
        "answer": "原价的 80%"
      }
    ],
    "funEmoji": "✅",
    "funFact": "折扣是小学数学的基础内容。",
    "funStory": "折扣就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "折扣里的八折是什么意思？",
    "funQuestionAnswer": "原价的 80%",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-029",
    "title": "利率",
    "description": "会根据本金和利率求简单的一年利息。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p204",
      "cms-2022:3.NA.04"
    ],
    "detailedExplanation": "会根据本金和利率求简单的一年利息。",
    "studyTips": [
      "能说出利息＝本金×利率",
      "能算出一年的利息"
    ],
    "practiceQuestions": [
      {
        "question": "200 的 3% 是多少？",
        "answer": "6"
      }
    ],
    "funEmoji": "✅",
    "funFact": "利率是小学数学的基础内容。",
    "funStory": "利率就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "200 的 3% 是多少？",
    "funQuestionAnswer": "6",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-030",
    "title": "百分数的应用",
    "description": "会解决求一个数比另一个数多百分之几、增长率这类简单问题。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p205",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "会解决求一个数比另一个数多百分之几、增长率这类简单问题。",
    "studyTips": [
      "能先求出增加或减少的量",
      "能把增加量除以原来的数写成百分数"
    ],
    "practiceQuestions": [
      {
        "question": "50 的 20% 是多少？",
        "answer": "10"
      }
    ],
    "funEmoji": "✅",
    "funFact": "百分数的应用是小学数学的基础内容。",
    "funStory": "百分数的应用就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "50 的 20% 是多少？",
    "funQuestionAnswer": "10",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-031",
    "title": "圆柱的认识",
    "description": "认识圆柱的两个底面和侧面，知道两个底面是完全相同的圆。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p206",
      "cms-2022:3.GG.05"
    ],
    "detailedExplanation": "认识圆柱的两个底面和侧面，知道两个底面是完全相同的圆。",
    "studyTips": [
      "能说出圆柱的两个底面是完全相同的圆",
      "能指出圆柱的高"
    ],
    "practiceQuestions": [
      {
        "question": "圆柱的两个底面是什么形状？",
        "answer": "是完全相同的圆"
      }
    ],
    "funEmoji": "✅",
    "funFact": "圆柱的认识是小学数学的基础内容。",
    "funStory": "圆柱的认识就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "圆柱的两个底面是什么形状？",
    "funQuestionAnswer": "是完全相同的圆",
    "tutorialContent": {
      "objectives": [
        "识别圆柱的组成部分：两个底面和一个侧面",
        "理解圆柱两个底面是完全相同的圆",
        "能够准确定义并指出圆柱的高"
      ],
      "explanation": "### 认识圆柱\n\n**圆柱**是一个三维几何体。我们可以从以下三个方面来认识它：\n\n1. **两个底面**：圆柱有两个底面，它们都是**圆**，并且这两个圆是**完全相同**的（即全等）。\n2. **侧面**：圆柱的侧面是一个曲面。如果我们把这个侧面沿一条直线剪开并展平，它会变成一个**长方形**。\n3. **圆柱的高**：连接上下两个底面中心点的距离，或者两个底面之间的垂直距离，叫做圆柱的**高**。",
      "examples": [
        {
          "title": "识别底面",
          "problem": "观察一个易拉罐，它的上下底面是什么形状？",
          "solution": "易拉罐是圆柱体，它的上下底面都是圆。",
          "tip": "记住，圆柱的两个底面不仅是圆，而且大小必须完全一样。"
        },
        {
          "title": "理解高",
          "problem": "一个圆柱形水杯，底面半径 3 厘米，杯子的高度是 10 厘米。请问圆柱的高是多少？",
          "solution": "圆柱的高就是杯子的高度，即 10 厘米。",
          "tip": "不要把半径或直径误认为是圆柱的高。"
        }
      ],
      "interaction": "请尝试找一个家里的圆柱形物品（如水杯或卷纸筒），用手指触摸它的底面和侧面，并试着用尺子量出它的高。",
      "exercises": [
        {
          "question": "圆柱有两个底面，这两个底面是什么形状？",
          "answer": "圆",
          "explanation": "根据圆柱的定义，其两个底面是完全相同的圆。"
        },
        {
          "question": "圆柱的侧面展开后是一个什么形状的图形？",
          "answer": "长方形",
          "explanation": "圆柱侧面沿直线剪开后可展平为长方形。"
        },
        {
          "question": "如果一个圆柱的底面直径是 5 厘米，高是 8 厘米，那么它的底面半径是多少？",
          "answer": "2.5 厘米",
          "explanation": "半径 = 直径 ÷ 2 = 5 ÷ 2 = 2.5 厘米。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-032",
    "title": "圆柱的体积",
    "description": "会用底面积乘高计算圆柱的体积。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p207",
      "cms-2022:3.GG.05"
    ],
    "detailedExplanation": "会用底面积乘高计算圆柱的体积。",
    "studyTips": [
      "能先求底面圆的面积",
      "能用底面积×高求体积"
    ],
    "practiceQuestions": [
      {
        "question": "底面半径 2 厘米、高 5 厘米的圆柱，体积是多少立方厘米？圆周率按 314/100。",
        "answer": "62.8"
      }
    ],
    "funEmoji": "✅",
    "funFact": "圆柱的体积是小学数学的基础内容。",
    "funStory": "圆柱的体积就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "底面半径 2 厘米、高 5 厘米的圆柱，体积是多少立方厘米？圆周率按 314/100。",
    "funQuestionAnswer": "62.8",
    "tutorialContent": {
      "objectives": [
        "掌握圆柱体积的计算公式：V = Sh",
        "能够先计算底面圆的面积",
        "能将底面积与高相乘得出最终体积"
      ],
      "explanation": "### 圆柱的体积\n\n计算圆柱体积的方法与计算长方体体积类似，都是**底面积 $\\times$ 高**。\n\n**计算公式：**\n$$V = S \\times h = \\pi r^2 h$$\n\n其中：\n- $V$ 表示体积\n- $S$ 表示底面积 ($\\pi r^2$)\n- $r$ 表示底面圆的半径\n- $h$ 表示圆柱的高\n- $\\pi$ 通常取 3.14",
      "examples": [
        {
          "title": "基础计算",
          "problem": "底面积为 $20\\text{ cm}^2$，高为 $5\\text{ cm}$ 的圆柱，体积是多少立方厘米？",
          "solution": "$V = 20 \\times 5 = 100\\text{ cm}^3$",
          "tip": "当已知底面积时，直接用底面积乘以高即可。"
        },
        {
          "title": "综合计算",
          "problem": "底面半径为 $2\\text{ cm}$，高为 $5\\text{ cm}$ 的圆柱，体积是多少立方厘米？（$\\pi$ 取 3.14）",
          "solution": "第一步：求底面积 $S = 3.14 \\times 2^2 = 12.56\\text{ cm}^2$；\n第二步：求体积 $V = 12.56 \\times 5 = 62.8\\text{ cm}^3$",
          "tip": "记得先算半径的平方，再乘以 $\\pi$ 得到面积。"
        }
      ],
      "interaction": "试着推导一下：如果圆柱的高增加一倍，而底面半径不变，它的体积会发生什么变化？",
      "exercises": [
        {
          "question": "底面积为 $15\\text{ cm}^2$，高为 $10\\text{ cm}$ 的圆柱体积是多少？",
          "answer": "$150\\text{ cm}^3$",
          "explanation": "$15 \\times 10 = 150$。"
        },
        {
          "question": "底面半径 $1\\text{ cm}$，高 $3\\text{ cm}$ 的圆柱体积是多少？（$\\pi$ 取 3.14）",
          "answer": "$9.42\\text{ cm}^3$",
          "explanation": "$3.14 \\times 1^2 \\times 3 = 9.42$。"
        },
        {
          "question": "一个圆柱形容器，底面直径 $10\\text{ cm}$，高 $8\\text{ cm}$，它的体积是多少？（$\\pi$ 取 3.14）",
          "answer": "$628\\text{ cm}^3$",
          "explanation": "半径为 $10 \\div 2 = 5\\text{ cm}$，体积 $V = 3.14 \\times 5^2 \\times 8 = 3.14 \\times 25 \\times 8 = 628$。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-033",
    "title": "圆柱的表面积",
    "description": "会计算圆柱的表面积：两个底面的面积加上侧面展开的长方形面积。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p208",
      "cms-2022:3.GG.05"
    ],
    "detailedExplanation": "会计算圆柱的表面积：两个底面的面积加上侧面展开的长方形面积。",
    "studyTips": [
      "能算出两个底面的面积",
      "能把侧面积和底面积相加"
    ],
    "practiceQuestions": [
      {
        "question": "计算：12.56＋12.56＝？（用小数作答）",
        "answer": "25.12"
      }
    ],
    "funEmoji": "✅",
    "funFact": "圆柱的表面积是小学数学的基础内容。",
    "funStory": "圆柱的表面积就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "计算：12.56＋12.56＝？（用小数作答）",
    "funQuestionAnswer": "25.12",
    "tutorialContent": {
      "objectives": [
        "理解圆柱表面积的组成：两个底面积 + 一个侧面积",
        "掌握侧面积的计算方法：底面周长 $\times$ 高",
        "能综合计算圆柱的总表面积"
      ],
      "explanation": "### 圆柱的表面积\n\n圆柱的表面积由**两个底面**和**一个侧面**组成。\n\n1. **底面积**：两个底面都是圆，面积分别为 $\\pi r^2$。总底面积 = $2 \\times \\pi r^2$。\n2. **侧面积**：侧面展开是一个长方形，长是底面圆的**周长** ($2\\pi r$)，宽是圆柱的**高** ($h$)。\n   侧面积 = $2\\pi r h$\n3. **表面积总公式**：\n   $$\\text{表面积} = 2 \\times \\pi r^2 + 2\\pi rh$$\n\n简单记忆：**表面积 = 2 $\\times$ 底面积 + 侧面积**",
      "examples": [
        {
          "title": "计算侧面积",
          "problem": "底面半径 $3\\text{ cm}$，高 $5\\text{ cm}$ 的圆柱，侧面积是多少？（$\\pi$ 取 3.14）",
          "solution": "侧面积 = $2 \\times 3.14 \\times 3 \\times 5 = 94.2\\text{ cm}^2$",
          "tip": "侧面积就是底面周长 $\\times$ 高。"
        },
        {
          "title": "计算总表面积",
          "problem": "底面半径 $1\\text{ cm}$，高 $4\\text{ cm}$ 的圆柱，表面积是多少？（$\\pi$ 取 3.14）",
          "solution": "底面积 $\\times 2 = 2 \\times 3.14 \\times 1^2 = 6.28\\text{ cm}^2$；\n侧面积 = $2 \\times 3.14 \\times 1 \\times 4 = 25.12\\text{ cm}^2$；\n表面积 = $6.28 + 25.12 = 31.4\\text{ cm}^2$",
          "tip": "千万不要忘记加上两个底面的面积。"
        }
      ],
      "interaction": "如果你要给一个圆柱形水桶贴纸，但水桶没有盖子，那么你需要计算它的表面积时，应该减去一个底面积还是两个？",
      "exercises": [
        {
          "question": "已知圆柱底面积 $12.56\\text{ cm}^2$，侧面积 $31.4\\text{ cm}^2$，其表面积是多少？",
          "answer": "$56.64\\text{ cm}^2$",
          "explanation": "$12.56 \\times 2 + 31.4 = 25.12 + 31.4 = 56.52$ (修正计算: $25.12 + 31.4 = 56.52$)"
        },
        {
          "question": "底面半径 $2\\text{ cm}$，高 $5\\text{ cm}$ 的圆柱，侧面积是多少？（$\\pi$ 取 3.14）",
          "answer": "$62.8\\text{ cm}^2$",
          "explanation": "$2 \\times 3.14 \\times 2 \\times 5 = 62.8$。"
        },
        {
          "question": "计算一个底面半径 $1\\text{ cm}$，高 $2\\text{ cm}$ 的圆柱的总表面积。（$\\pi$ 取 3.14）",
          "answer": "$18.84\\text{ cm}^2$",
          "explanation": "$2 \\times 3.14 \\times 1^2 + 2 \\times 3.14 \\times 1 \\times 2 = 6.28 + 12.56 = 18.84$。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-034",
    "title": "圆锥的体积",
    "description": "知道圆锥的体积是等底等高圆柱体积的三分之一。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p209",
      "cms-2022:3.GG.05"
    ],
    "detailedExplanation": "知道圆锥的体积是等底等高圆柱体积的三分之一。",
    "studyTips": [
      "能说出圆锥体积等于等底等高圆柱的三分之一",
      "能计算简单的圆锥体积"
    ],
    "practiceQuestions": [
      {
        "question": "圆锥的底面是什么形状？",
        "answer": "是一个圆"
      }
    ],
    "funEmoji": "✅",
    "funFact": "圆锥的体积是小学数学的基础内容。",
    "funStory": "圆锥的体积就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "圆锥的底面是什么形状？",
    "funQuestionAnswer": "是一个圆",
    "tutorialContent": {
      "objectives": [
        "理解圆锥与圆柱的关系：等底等高时，体积比为 1:3",
        "掌握圆锥体积的计算公式",
        "能灵活运用圆柱体积计算圆锥体积"
      ],
      "explanation": "### 圆锥的体积\n\n**核心结论**：\n如果一个圆锥和一个圆柱的**底面积相等**且**高相等**（称为等底等高），那么圆锥的体积恰好是圆柱体积的 $\\frac{1}{3}$。\n\n**计算公式：**\n$$V_{\\text{圆锥}} = \\frac{1}{3} \\pi r^2 h$$\n\n也就是说，求圆锥体积的方法是：先算出等底等高圆柱的体积，然后除以 3。",
      "examples": [
        {
          "title": "直接关系计算",
          "problem": "一个等底等高圆柱的体积是 $90\\text{ cm}^3$，那么这个圆锥的体积是多少？",
          "solution": "$V = 90 \\div 3 = 30\\text{ cm}^3$",
          "tip": "只要看到“等底等高”，直接除以 3 即可。"
        },
        {
          "title": "综合计算",
          "problem": "一个圆锥的底面半径 $3\\text{ cm}$，高 $4\\text{ cm}$，体积是多少立方厘米？（$\\pi$ 取 3.14）",
          "solution": "第一步：求等底等高圆柱体积 $V_{\\text{圆柱}} = 3.14 \\times 3^2 \\times 4 = 113.04\\text{ cm}^3$；\n第二步：求圆锥体积 $V_{\\text{圆锥}} = 113.04 \\div 3 = 37.68\\text{ cm}^3$",
          "tip": "记得最后一步一定要除以 3。"
        }
      ],
      "interaction": "想象一下，如果你用一个圆锥形杯子往一个等底等高的圆柱形杯子里倒水，需要倒几次水才能装满圆柱杯？",
      "exercises": [
        {
          "question": "圆锥的体积与等底等高圆柱的体积比是多少？",
          "answer": "1:3",
          "explanation": "根据数学定义，圆锥体积是等底等高圆柱体积的三分之一。"
        },
        {
          "question": "一个圆锥的体积是 $15\\text{ cm}^3$，那么等底等高圆柱的体积是多少？",
          "answer": "$45\\text{ cm}^3$",
          "explanation": "圆柱体积 = 圆锥体积 $\\times 3 = 15 \\times 3 = 45$。"
        },
        {
          "question": "底面半径 $2\\text{ cm}$，高 $6\\text{ cm}$ 的圆锥体积是多少？（$\\pi$ 取 3.14）",
          "answer": "$25.12\\text{ cm}^3$",
          "explanation": "$V = \\frac{1}{3} \\times 3.14 \\times 2^2 \\times 6 = 3.14 \\times 4 \\times 2 = 25.12$。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-035",
    "title": "比例的意义和基本性质",
    "description": "知道表示两个比相等的式子叫做比例，比例的两项外项之积等于两项内项之积。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p210",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "知道表示两个比相等的式子叫做比例，比例的两项外项之积等于两项内项之积。",
    "studyTips": [
      "能说出比例的两项外项之积等于两项内项之积",
      "能判断两个比能不能组成比例"
    ],
    "practiceQuestions": [
      {
        "question": "比例的两项外项之积与两项内项之积怎样？",
        "answer": "等于两项内项之积"
      }
    ],
    "funEmoji": "✅",
    "funFact": "比例的意义和基本性质是小学数学的基础内容。",
    "funStory": "比例的意义和基本性质就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "比例的两项外项之积与两项内项之积怎样？",
    "funQuestionAnswer": "等于两项内项之积",
    "tutorialContent": {
      "objectives": [
        "理解比例的定义：表示两个比相等的式子",
        "掌握比例的基本性质：外项之积等于内项之积",
        "能判断两个比是否能组成比例"
      ],
      "explanation": "### 比例的意义和基本性质\n\n1. **什么是比例？**\n   如果两个比 $\\frac{a}{b}$ 和 $\\frac{c}{d}$ 相等，那么 $\\frac{a}{b} = \\frac{c}{d}$ 就叫做**比例**。\n\n2. **比例的各项名称**：\n   在比例 $\\frac{a}{b} = \\frac{c}{d}$ 中，$a$ 和 $d$ 叫做**外项**，$b$ 和 $c$ 叫做**内项**。\n\n3. **基本性质**：\n   **比例的外项之积等于内项之积。**\n   即：$a \\times d = b \\times c$\n\n这个性质可以用来判断两个比是否相等，或者求比例中缺失的项。",
      "examples": [
        {
          "title": "判断比例",
          "problem": "比 $2:3$ 和 $4:6$ 能组成比例吗？",
          "solution": "方法一：$2\\div 3 \\approx 0.667$，$4\\div 6 \\approx 0.667$，相等 $\\rightarrow$ 能组成比例。\n方法二：$2 \\times 6 = 12$，$3 \\times 4 = 12$，外项积=内项积 $\\rightarrow$ 能组成比例。",
          "tip": "使用外项积等于内项积的方法通常计算更准确。"
        },
        {
          "title": "利用性质求值",
          "problem": "在比例 $3:4 = 9:x$ 中，求 $x$ 的值。",
          "solution": "根据性质：$3 \\times x = 4 \\times 9$\n$3x = 36$\n$x = 12$",
          "tip": "列出等式：外项 $\\times$ 外项 = 内项 $\\times$ 内项。"
        }
      ],
      "interaction": "试着写出两个你认为能组成比例的比，并用外项积等于内项积的方法验证你的答案。",
      "exercises": [
        {
          "question": "比例 $a:b = c:d$ 中，外项之积是哪个乘法式？",
          "answer": "$a \\times d$",
          "explanation": "在比例式中，最左边和最右边的项称为外项。"
        },
        {
          "question": "判断 $5:8$ 和 $10:16$ 是否组成比例？",
          "answer": "是",
          "explanation": "$5 \\times 16 = 80$，$8 \\times 10 = 80$，两者相等。"
        },
        {
          "question": "在比例 $2:5 = 6:x$ 中，$x$ 等于多少？",
          "answer": "15",
          "explanation": "$2 \\times x = 5 \\times 6 \\rightarrow 2x = 30 \\rightarrow x = 15$。"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-036",
    "title": "解比例",
    "description": "会根据比例的基本性质求比例里的未知项。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p211",
      "cms-2022:3.NA.08",
      "cms-2022:3.NA.05"
    ],
    "detailedExplanation": "会根据比例的基本性质求比例里的未知项。",
    "studyTips": [
      "能把外项之积等于内项之积写成等式",
      "能求出未知项"
    ],
    "practiceQuestions": [
      {
        "question": "2：3＝8：x。x 是多少？计算：8×3÷2＝？",
        "answer": "12"
      }
    ],
    "funEmoji": "✅",
    "funFact": "解比例是小学数学的基础内容。",
    "funStory": "解比例就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "2：3＝8：x。x 是多少？计算：8×3÷2＝？",
    "funQuestionAnswer": "12",
    "tutorialContent": {
      "objectives": [
        "理解比例的基本性质：外项之积等于内项之积",
        "能够根据比例性质列出等式",
        "能独立求出比例中的未知项"
      ],
      "explanation": "### 解比例\n\n**比例的基本性质**：在比例中，**外项的积等于内项的积**。\n\n例如在比例 $a : b = c : d$ 中，$a$ 和 $d$ 是外项，$b$ 和 $c$ 是内项。根据性质可以得出：$a \\times d = b \\times c$。\n\n**解题步骤**：\n1. 识别外项和内项。\n2. 根据性质列出乘法等式。\n3. 通过除法求出未知数。",
      "examples": [
        {
          "title": "基础计算",
          "problem": "解比例：$2 : 3 = 8 : x$",
          "solution": "根据比例的基本性质：$2 \\times x = 3 \\times 8$\n$2x = 24$\n$x = 24 \\div 2$\n$x = 12$",
          "tip": "记得先算乘法，再用除法求出 $x$。"
        },
        {
          "title": "分率比例",
          "problem": "解比例：$\frac{1}{2} : \frac{1}{3} = x : 6$",
          "solution": "根据比例的基本性质：$x \\times \frac{1}{2} = \frac{1}{3} \\times 6$\n$\frac{1}{2}x = 2$\n$x = 2 \\div \frac{1}{2}$\n$x = 4$",
          "tip": "遇到分数时，解法依然相同，注意分数除法要记得颠倒分子分母。"
        }
      ],
      "interaction": "试着观察 $4 : 5 = x : 20$，你认为外项是谁？内项是谁？它们相乘应该等于多少？",
      "exercises": [
        {
          "question": "解比例：$3 : 4 = 9 : x$",
          "answer": "12",
          "explanation": "$3 \\times x = 4 \\times 9 \\Rightarrow 3x = 36 \\Rightarrow x = 12$"
        },
        {
          "question": "解比例：$x : 7 = 4 : 2$",
          "answer": "14",
          "explanation": "$2 \\times x = 7 \\times 4 \\Rightarrow 2x = 28 \\Rightarrow x = 14$"
        },
        {
          "question": "解比例：$\frac{2}{5} : x = 4 : 10$",
          "answer": "0.5 或 1/2",
          "explanation": "$4 \\times x = \frac{2}{5} \\times 10 \\Rightarrow 4x = 4 \\Rightarrow x = 1$"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-037",
    "title": "比例尺",
    "description": "知道比例尺是图上距离与实际距离的比，能进行简单的换算。",
    "tags": [
      "图形与几何",
      "grade-6",
      "cnm:cnm_p212",
      "cms-2022:3.GG.10",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "知道比例尺是图上距离与实际距离的比，能进行简单的换算。",
    "studyTips": [
      "能说出比例尺是图上距离与实际距离的比",
      "能由图上距离求实际距离"
    ],
    "practiceQuestions": [
      {
        "question": "比例尺是什么？",
        "answer": "图上距离与实际距离的比"
      }
    ],
    "funEmoji": "✅",
    "funFact": "比例尺是小学数学的基础内容。",
    "funStory": "比例尺就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "比例尺是什么？",
    "funQuestionAnswer": "图上距离与实际距离的比",
    "tutorialContent": {
      "objectives": [
        "理解比例尺的定义",
        "掌握图上距离、实际距离与比例尺的关系",
        "能将图上距离换算为实际距离"
      ],
      "explanation": "### 比例尺\n\n**定义**：比例尺是图上距离与实际距离的比。\n\n**公式**：\n$$\\text{比例尺} = \\frac{\\text{图上距离}}{\\text{实际距离}}$$\n\n**核心注意点**：\n- 在计算之前，必须将图上距离和实际距离统一成**相同的单位**。\n- 实际距离 = 图上距离 $\\div$ 比例尺。",
      "examples": [
        {
          "title": "求比例尺",
          "problem": "一张地图上，两地距离是 5 厘米，实际距离是 50 公里，比例尺是多少？",
          "solution": "统一单位：50 公里 = 5,000,000 厘米\n比例尺 = $5 : 5,000,000 = 1 : 1,000,000$",
          "tip": "一定要先统一单位，再写比例尺。"
        },
        {
          "title": "求实际距离",
          "problem": "比例尺为 $1 : 100,000$ 的地图上，两地距离 3 厘米，实际距离是多少公里？",
          "solution": "实际距离 = $3 \\times 100,000 = 300,000$ 厘米\n换算单位：300,000 厘米 = 3 公里",
          "tip": "图上距离乘以比例尺的分母就是实际距离。"
        }
      ],
      "interaction": "如果一张地图的比例尺是 $1 : 500$，这意味着图上的 1 厘米代表实际的多少厘米？",
      "exercises": [
        {
          "question": "比例尺为 $1 : 200$ 的图纸上，一段线段长 4 厘米，实际长度是多少米？",
          "answer": "8米",
          "explanation": "$4 \\times 200 = 800$ 厘米 = 8 米"
        },
        {
          "question": "图上距离 2 厘米，实际距离 10 公里，比例尺是多少？",
          "answer": "1 : 500,000",
          "explanation": "$10 \\text{km} = 1,000,000 \\text{cm}$, $2 : 1,000,000 = 1 : 500,000$"
        },
        {
          "question": "比例尺为 $1 : 50,000$ 的地图上，两点距离 2 厘米，实际距离是多少公里？",
          "answer": "1公里",
          "explanation": "$2 \\times 50,000 = 100,000$ 厘米 = 1 公里"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-038",
    "title": "正比例",
    "description": "认识成正比例的量：一种量扩大几倍，另一种量也扩大几倍，比值一定。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p213",
      "cms-2022:3.NA.09"
    ],
    "detailedExplanation": "认识成正比例的量：一种量扩大几倍，另一种量也扩大几倍，比值一定。",
    "studyTips": [
      "能说出成正比例的两种量比值一定",
      "能用比值求另一个量"
    ],
    "practiceQuestions": [
      {
        "question": "成正比例的两种量有什么特征？",
        "answer": "比值一定"
      }
    ],
    "funEmoji": "✅",
    "funFact": "正比例是小学数学的基础内容。",
    "funStory": "正比例就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "成正比例的两种量有什么特征？",
    "funQuestionAnswer": "比值一定",
    "tutorialContent": {
      "objectives": [
        "认识成正比例的量",
        "理解正比例量中“比值一定”的特征",
        "能利用正比例关系求未知量"
      ],
      "explanation": "### 正比例\n\n**定义**：两种量 $\\text{A}$ 和 $\\text{B}$，如果 $\\text{A}$ 扩大几倍，$\\text{B}$ 也扩大几倍，那么 $\\text{A}$ 和 $\\text{B}$ 成**正比例**。\n\n**核心特征**：\n- **比值一定**：$\\frac{\\text{A}}{\\text{B}} = k$（常数）。\n- 这种关系常用于：单价不变时的数量与总价、速度不变时的距离与时间。",
      "examples": [
        {
          "title": "识别正比例",
          "problem": "每 2 升牛奶 15 元，那么 4 升、6 升牛奶分别多少元？",
          "solution": "牛奶量扩大 2 倍，价格也扩大 2 倍：$15 \\times 2 = 30$ 元\n牛奶量扩大 3 倍，价格也扩大 3 倍：$15 \\times 3 = 45$ 元",
          "tip": "观察一种量增加，另一种量是否同步等倍增加。"
        },
        {
          "title": "利用比值求解",
          "problem": "已知 3 本笔记本 12 元，同样的笔记本 5 本多少元？",
          "solution": "先求单价：$12 \\div 3 = 4$ 元/本\n再求 5 本价格：$4 \\times 5 = 20$ 元",
          "tip": "可以通过“求单价 $\\rightarrow$ 求总价”的步骤来解。"
        }
      ],
      "interaction": "思考一下：你的身高随着年龄增长，是成正比例关系吗？（提示：你 2 岁时的高度 $\\times 3$ 等于 6 岁的高度吗？）",
      "exercises": [
        {
          "question": "如果 4 块橡皮 6 元，那么 12 块橡皮多少元？",
          "answer": "18元",
          "explanation": "数量扩大 $12 \\div 4 = 3$ 倍，价格也扩大 3 倍：$6 \\times 3 = 18$ 元"
        },
        {
          "question": "一辆汽车每小时行驶 60 公里，3 小时行驶多少公里？",
          "answer": "180公里",
          "explanation": "时间与路程成正比例：$60 \\times 3 = 180$ 公里"
        },
        {
          "question": "已知 $x$ 与 $y$ 成正比例，当 $x=2$ 时 $y=6$，当 $x=5$ 时 $y$ 是多少？",
          "answer": "15",
          "explanation": "比值 $y/x = 6/2 = 3$，所以 $y = 5 \\times 3 = 15$"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-039",
    "title": "反比例",
    "description": "认识成反比例的量：一种量扩大几倍，另一种量反而缩小到几分之一，乘积一定。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p214",
      "cms-2022:3.NA.09"
    ],
    "detailedExplanation": "认识成反比例的量：一种量扩大几倍，另一种量反而缩小到几分之一，乘积一定。",
    "studyTips": [
      "能说出成反比例的两种量乘积一定",
      "能用乘积求另一个量"
    ],
    "practiceQuestions": [
      {
        "question": "成反比例的两种量有什么特征？",
        "answer": "乘积一定"
      }
    ],
    "funEmoji": "✅",
    "funFact": "反比例是小学数学的基础内容。",
    "funStory": "反比例就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "成反比例的两种量有什么特征？",
    "funQuestionAnswer": "乘积一定",
    "tutorialContent": {
      "objectives": [
        "认识成反比例的量",
        "理解反比例量中“乘积一定”的特征",
        "能利用反比例关系求未知量"
      ],
      "explanation": "### 反比例\n\n**定义**：两种量 $\\text{A}$ 和 $\\text{B}$，如果 $\\text{A}$ 扩大几倍，$\\text{B}$ 反而缩小到原来的 $\\frac{1}{几}$，那么 $\\text{A}$ 和 $\\text{B}$ 成**反比例**。\n\n**核心特征**：\n- **乘积一定**：$\\text{A} \\times \\text{B} = k$（常数）。\n- 这种关系常用于：工作总量不变时的人数与时间、距离不变时的速度与时间。",
      "examples": [
        {
          "title": "识别反比例",
          "problem": "一件工作 2 个人做需要 6 天完成，如果 4 个人做需要几天？",
          "solution": "人数扩大 2 倍，时间缩小到 $\\frac{1}{2}$：$6 \\times \\frac{1}{2} = 3$ 天",
          "tip": "人越多，干活时间越短，这就是反比例。"
        },
        {
          "title": "利用乘积求解",
          "problem": "一段路程，速度 40 km/h 需要 3 小时，速度 60 km/h 需要几小时？",
          "solution": "总路程（乘积）一定：$40 \\times 3 = 120$ 公里\n所需时间：$120 \\div 60 = 2$ 小时",
          "tip": "先算出“总量”（乘积），再用总量除以已知量。"
        }
      ],
      "interaction": "想象一下：如果你把同样的蛋糕分给更多的人，每人分得的块数会变多还是变少？这是什么比例？",
      "exercises": [
        {
          "question": "一项工程 3 个人做需要 12 天，如果 9 个人做需要几天？",
          "answer": "4天",
          "explanation": "人数扩大 3 倍，时间缩小到 $\\frac{1}{3}$：$12 \\div 3 = 4$ 天"
        },
        {
          "question": "速度 2 米/秒需要 10 秒走完一段路，速度 5 米/秒需要几秒？",
          "answer": "4秒",
          "explanation": "乘积一定：$2 \\times 10 = 20$ 米；$20 \\div 5 = 4$ 秒"
        },
        {
          "question": "已知 $x$ 与 $y$ 成反比例，当 $x=2$ 时 $y=10$，当 $x=5$ 时 $y$ 是多少？",
          "answer": "4",
          "explanation": "乘积 $x \\times y = 2 \\times 10 = 20$，所以 $y = 20 \\div 5 = 4$"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-040",
    "title": "用比例解决实际问题",
    "description": "能用正比例或反比例的关系列出比例，解决简单的实际问题。",
    "tags": [
      "数与代数",
      "grade-6",
      "cnm:cnm_p215",
      "cms-2022:3.NA.08"
    ],
    "detailedExplanation": "能用正比例或反比例的关系列出比例，解决简单的实际问题。",
    "studyTips": [
      "能判断两种量成正比例还是反比例",
      "能列出比例并求出未知数"
    ],
    "practiceQuestions": [
      {
        "question": "3 本笔记本 12 元，同样的笔记本 5 本多少元？计算：12÷3×5＝？",
        "answer": "20"
      }
    ],
    "funEmoji": "✅",
    "funFact": "用比例解决实际问题是小学数学的基础内容。",
    "funStory": "用比例解决实际问题就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "3 本笔记本 12 元，同样的笔记本 5 本多少元？计算：12÷3×5＝？",
    "funQuestionAnswer": "20",
    "tutorialContent": {
      "objectives": [
        "能准确判断实际问题中的量是正比例还是反比例",
        "能将实际问题转化为比例式",
        "能综合运用比例知识解决复杂的应用题"
      ],
      "explanation": "### 用比例解决实际问题\n\n**解题核心步骤**：\n1. **分析关系**：判断两种量是成正比例（同增同减）还是反比例（一增一减）。\n2. **列出比例**：\n   - 正比例：$\frac{\\text{量1}_1}{\\text{量2}_1} = \frac{\\text{量1}_2}{\\text{量2}_2}$\n   - 反比例：$\\text{量1}_1 \\times \\text{量2}_1 = \\text{量1}_2 \\times \\text{量2}_2$\n3. **计算求解**：利用解比例的方法求未知数。\n4. **检查单位**：确保答案单位正确。",
      "examples": [
        {
          "title": "正比例应用",
          "problem": "3 本笔记本 12 元，同样的笔记本 5 本多少元？",
          "solution": "分析：笔记本数量与价格成正比例。\n列式：$3 : 12 = 5 : x$\n解：$3x = 60 \\Rightarrow x = 20$ 元",
          "tip": "可以快速思考：1本多少钱，5本就是多少钱。"
        },
        {
          "title": "反比例应用",
          "problem": "一个工程 4 人做需要 15 天完成，如果要求 10 天完成，需要多少人？",
          "solution": "分析：人数与时间成反比例。\n列式：$4 \\times 15 = x \\times 10$\n解：$60 = 10x \\Rightarrow x = 6$ 人",
          "tip": "注意反比例列式是两个量相乘等于另一个两个量相乘。"
        }
      ],
      "interaction": "给出一个场景：如果你跑步的速度提高，到达终点的时间会怎么变？这应该用正比例还是反比例来计算？",
      "exercises": [
        {
          "question": "一辆车行驶 120 公里消耗汽油 10 升，行驶 180 公里需要多少升汽油？",
          "answer": "15升",
          "explanation": "正比例关系：$120 : 10 = 180 : x \\Rightarrow 120x = 1800 \\Rightarrow x = 15$"
        },
        {
          "question": "5 个人完成一项工作需要 8 小时，如果增加到 10 个人，需要多少小时？",
          "answer": "4小时",
          "explanation": "反比例关系：$5 \\times 8 = 10 \\times x \\Rightarrow 40 = 10x \\Rightarrow x = 4$"
        },
        {
          "question": "某种产品每 2 小时能生产 15 个，如果要生产 45 个，需要多少小时？",
          "answer": "6小时",
          "explanation": "正比例关系：$2 : 15 = x : 45 \\Rightarrow 15x = 90 \\Rightarrow x = 6$"
        }
      ]
    }
  },
  {
    "id": "p-math-g6-041",
    "title": "鸽巢问题",
    "description": "知道物体数比抽屉数多时，必有一个抽屉至少放两个物体。",
    "tags": [
      "综合与实践",
      "grade-6",
      "cnm:cnm_p216",
      "cms-2022:3.NA.06"
    ],
    "detailedExplanation": "知道物体数比抽屉数多时，必有一个抽屉至少放两个物体。",
    "studyTips": [
      "能说出至少数是多少",
      "能把物体数和抽屉数做比较"
    ],
    "practiceQuestions": [
      {
        "question": "鸽巢问题是说什么？",
        "answer": "物体数比抽屉数多，必有一个抽屉至少放两个"
      }
    ],
    "funEmoji": "✅",
    "funFact": "鸽巢问题是小学数学的基础内容。",
    "funStory": "鸽巢问题就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "鸽巢问题是说什么？",
    "funQuestionAnswer": "物体数比抽屉数多，必有一个抽屉至少放两个",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-042",
    "title": "体育中的数学",
    "description": "在跑步、跳远、比赛安排等体育情境中综合运用计算、比较和简单的统计解决问题。",
    "tags": [
      "综合与实践",
      "grade-6",
      "cnm:cnm_p241",
      "cms-2022:3.NA.10"
    ],
    "detailedExplanation": "在跑步、跳远、比赛安排等体育情境中综合运用计算、比较和简单的统计解决问题。",
    "studyTips": [
      "能用学过的运算解决体育中的问题",
      "能比较成绩并说明理由"
    ],
    "practiceQuestions": [
      {
        "question": "跑道一圈 400 米，跑 5 圈一共多少米？计算：400×5＝？",
        "answer": "2000"
      }
    ],
    "funEmoji": "✅",
    "funFact": "体育中的数学是小学数学的基础内容。",
    "funStory": "体育中的数学就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "跑道一圈 400 米，跑 5 圈一共多少米？计算：400×5＝？",
    "funQuestionAnswer": "2000",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  },
  {
    "id": "p-math-g6-043",
    "title": "水是生命之源",
    "description": "围绕用水、节水的真实情境，综合运用分数、百分数和统计解决问题。",
    "tags": [
      "综合与实践",
      "grade-6",
      "cnm:cnm_p242",
      "cms-2022:3.SP.05"
    ],
    "detailedExplanation": "围绕用水、节水的真实情境，综合运用分数、百分数和统计解决问题。",
    "studyTips": [
      "能用分数、百分数计算用水量",
      "能根据结果提出节水建议"
    ],
    "practiceQuestions": [
      {
        "question": "一个水龙头每天漏水 2 升，30 天一共漏水多少升？计算：2×30＝？",
        "answer": "60"
      }
    ],
    "funEmoji": "✅",
    "funFact": "水是生命之源是小学数学的基础内容。",
    "funStory": "水是生命之源就在我们身边，比如课堂学习、日常生活，都能见到它的身影。",
    "funQuestion": "一个水龙头每天漏水 2 升，30 天一共漏水多少升？计算：2×30＝？",
    "funQuestionAnswer": "60",
    "tutorialContent": {
      "objectives": [],
      "explanation": "",
      "examples": [],
      "interaction": "请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。",
      "exercises": []
    }
  }
];
