import OpenAI from 'openai';
import type { PromptTemplate } from '../data/prompts/types';

// Define the configuration structure
export interface AIConfig {
    provider: 'custom' | 'openai' | 'deepseek' | 'zhipu';
    apiKey: string;
    baseUrl: string;
    model: string;
}

// Default constants for different providers
export const PROVIDER_DEFAULTS: Record<string, Partial<AIConfig>> = {
    openai: {
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o',
    },
    deepseek: {
        baseUrl: 'https://api.deepseek.com',
        model: 'deepseek-chat',
    },
    zhipu: {
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        model: 'glm-4', // CHECKME: Valid model name for Zhipu
    },
    custom: {
        baseUrl: '',
        model: '',
    }
};

const STORAGE_KEY = 'school_formula_ai_config';

export const getAIConfig = (): AIConfig | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const saveAIConfig = (config: AIConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const generateKnowledgeContent = async (
    topic: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true // Enabling for client-side usage
    });

    const prompt = `
你是一位专业的家庭教育顾问和学科专家。请为家长撰写一份关于"${topic}"的深度辅导指南。
背景信息：${context}

请严格按以下markdown格式输出（不要输出其他无关内容）：

# 💡 深度解析
（用通俗易懂的语言，配合生活案例，深入浅出地讲解该知识点的核心逻辑，适合家长讲给孩子听）

# 🌍 生活应用场景
（列举3-5个日常生活中的具体应用场景，让知识变得有用、有趣）

# 👨‍👩‍👧 亲子互动案例
（设计一个具体的对话或互动游戏脚本，帮助家长指导孩子）

# ✏️ 实战小测验
（3道精选练习题，附带答案和解析）
1. [题目]
   * 答案：
   * 解析：
`;

    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Generation Error:', error);
        throw error;
    }
};

export const generateTutorialContent = async (
    unitTitle: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
    });

    const prompt = `
你是一位经验丰富的小学数学教研老师，擅长把抽象的数学概念讲得通俗易懂、生动有趣。
请根据以下学习目标，为家长和孩子生成一节关于"${unitTitle}"的完整家庭辅导教程。
背景信息：${context}

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 🎯 本课目标
（根据学习目标，用 3-5 条清晰列出孩子学完这课后应达到的目标）

# 📖 知识讲解
（围绕学习目标，用孩子能听懂的语言讲解核心概念，配合生活案例、比喻或小故事，深入浅出。必要时使用 Mermaid 语法或 SVG 代码插入图解。）

# ✏️ 例题精讲
（2-3 道由易到难的典型例题，每道题写出完整解题步骤和思路点拨）

# 🧩 亲子互动
（设计一个 5-10 分钟的小游戏或互动活动，让家长和孩子一起完成，巩固本课内容）

# 📝 课后练习
（3-5 道练习题，附参考答案和简要解析）
`;

    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Tutorial Generation Error:', error);
        throw error;
    }
};

export const generatePracticeQuestions = async (
    unitTitle: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
    });

    const prompt = `
你是一位经验丰富的小学数学老师。请根据以下信息，再生成 5 道与本单元学习目标匹配的补充练习题。
单元：${unitTitle}
背景信息：${context}

要求：
- 题目类型可以是选择、填空、判断或解答；
- 难度要有梯度，覆盖基础、提高和挑战；
- 每道题附参考答案和简要解析。

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 📝 补充练习题

1. [题目]
   - 答案：
   - 解析：

2. [题目]
   - 答案：
   - 解析：

（以此类推，共 5 道题）
`;

    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Practice Generation Error:', error);
        throw error;
    }
};

export const generateClassicalInterpretation = async (
    title: string,
    source: 'shiji' | 'zizhi',
    content: string[],
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
    });

    const sourceName = source === 'shiji' ? '《史记》' : '《资治通鉴》';
    const prompt = `
你是一位精通中国古代史与文言文的名师。请针对${sourceName}中的「${title}」篇，对以下原文进行深度解读。

原文内容：
${content.join('\n\n')}

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 📜 文白对照
将原文按段落翻译成通俗易懂的现代汉语，每段先列原文，再列译文。

# 🏛️ 历史背景
介绍该篇所处的时代背景、相关历史事件与写作意图。

# 👤 人物与事件分析
分析文中关键人物的性格、动机与命运，或事件的前因后果。

# 💡 现实意义与教育启示
结合现代生活，谈谈这段历史对学生和家长的启示，如何从中汲取智慧。

请保持语言亲切、适合中小学生家长辅导孩子阅读。
`;

    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Classical Interpretation Error:', error);
        throw error;
    }
};

export const generateExamQuestions = async (
    subject: string,
    grade: string,
    topic: string,
    questionTypes: string[],
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
    });

    const prompt = `
你是一位命题经验丰富的${grade}${subject}学科名师。请围绕「${topic}」这一主题，为${grade}学生出一套小型测试卷。
题型要求包含：${questionTypes.join('、')}。

命题要求：
- 题目紧扣「${topic}」主题，符合${grade}课程标准与认知水平；
- 难度分为基础、提高、挑战三个梯度，每道题标注难度等级；
- 每道题附参考答案和详细解析，解析要讲清思路，方便家长辅导孩子；
- 语言规范、表述清晰，避免超纲内容。

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 📋 ${topic} 专项测试卷

## 一、选择题
1. [题目]（难度：基础/提高/挑战）
   A. ... B. ... C. ... D. ...
   - 答案：
   - 解析：

## 二、填空题
1. [题目]（难度：基础/提高/挑战）
   - 答案：
   - 解析：

## 三、解答题
1. [题目]（难度：基础/提高/挑战）
   - 答案：
   - 解析：

# 📊 试卷说明
（简要说明本卷考查重点、难度分布，以及建议的完成时间）
`;

    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Exam Generation Error:', error);
        throw error;
    }
};

export const generateErrorAnalysis = async (
    question: string,
    wrongAnswer: string,
    correctAnswer: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
    });

    const prompt = `
你是一位擅长学情诊断的中小学名师。请针对下面这道错题进行深度分析，帮助家长和孩子找到问题根源。

题目：${question}
孩子的错误答案：${wrongAnswer}
正确答案：${correctAnswer}

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 🔍 错因诊断
（分析孩子的错误类型：概念混淆 / 计算错误 / 理解偏差 / 审题不清 / 方法缺失等，并结合错误答案推测孩子的思考过程）

# 📖 正确解法详解
（完整讲解正确解法，指出孩子卡在哪一步）

# 💪 针对性改进建议
（给出 2-3 条具体可操作的改进建议，帮助孩子在同类问题上不再犯错）

# 📚 相关知识点推荐
（推荐与本题相关的知识点，建议孩子复习巩固）

# ✏️ 举一反三
（出 1-2 道类似的变式题，附答案，检验孩子是否真正掌握）

请保持语言亲切、鼓励为主，适合家长辅导孩子时使用。
`;

    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Error Analysis Error:', error);
        throw error;
    }
};

export const generateStudyPlan = async (
    grade: string,
    subject: string,
    goals: string,
    weeks: number,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
    });

    const prompt = `
你是一位专业的学习规划师，熟悉中小学课程体系。请为一位${grade}学生制定一份${subject}学科的个性化学习计划。
学习目标：${goals}
计划周期：${weeks} 周

计划要求：
- 目标拆解合理，符合${grade}学生的认知水平和学习节奏；
- 按周分配学习内容，循序渐进、张弛有度；
- 包含每日学习建议（建议每天 30-60 分钟，可执行、可检验）；
- 每周设置阶段性目标和复盘检查点；
- 兼顾复习巩固与新知识学习。

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 🎯 总体目标
（简要概括本计划要达成的目标和预期成果）

# 📅 分周计划

## 第 1 周：[本周主题]
- 本周目标：
- 每日安排：
  - 周一：
  - 周二：
  - 周三：
  - 周四：
  - 周五：
  - 周末：复习与复盘
- 检查点：（本周结束时应能完成的小任务或小测验）

## 第 2 周：[本周主题]
（格式同上，以此类推，共 ${weeks} 周）

# 💡 给家长的建议
（2-3 条陪伴与监督建议，帮助家长有效支持孩子执行计划）
`;

    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Study Plan Error:', error);
        throw error;
    }
};

export const generateFormulaDerivation = async (
    formula: string,
    grade: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
    });

    const prompt = `
你是一位擅长把抽象公式讲得通俗易懂的中小学名师。请为${grade}学生讲解以下公式的来龙去脉。
公式：${formula}

讲解要求：
- 用通俗易懂的语言，配合生活中的例子，让${grade}学生也能听懂；
- 推导过程分步骤展开，每一步说明"为什么这样做"；
- 逐一解释公式中每个符号的含义和单位；
- 给出实际应用场景和典型例题。

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 🔤 符号说明
（逐一列出公式中每个符号的含义、单位和取值范围，可用表格呈现）

# 🧮 推导过程
（分步骤讲解公式是如何推导出来的，每步说明理由，必要时配合直观比喻或图解）

# 🌍 应用场景
（列举 2-3 个该公式在生活或学科中的实际应用场景）

# ✏️ 典型例题
（1-2 道运用该公式的典型例题，附完整解题步骤和答案解析）

# ⚠️ 常见误区
（提醒学生在使用该公式时容易犯的错误）

请保持语言亲切生动，适合家长辅导孩子时使用。
`;

    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Formula Derivation Error:', error);
        throw error;
    }
};

/**
 * 根据模板 + 用户填写变量，组装最终 prompt 并调用 AI
 */
export const generateFromTemplate = async (
    template: PromptTemplate,
    variables: Record<string, string>,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    // 组装最终 prompt：替换 {{variable}} 占位符
    let finalPrompt = template.template;
    for (const [key, value] of Object.entries(variables)) {
        finalPrompt = finalPrompt.replace(
            new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
            value
        );
    }

    // 处理条件块 {{#if variable}}...{{/if}}
    finalPrompt = finalPrompt.replace(
        /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
        (_, key, content) => variables[key] ? content : ''
    );

    // 清理残留占位符
    finalPrompt = finalPrompt.replace(/\{\{[^}]+\}\}/g, '');

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true,
    });

    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: finalPrompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Template Generation Error:', error);
        throw error;
    }
};
