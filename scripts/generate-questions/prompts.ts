import type { QuestionType, Difficulty } from '../../src/data/questions/types';

export function buildPrompt(
  knowledgePointTitle: string,
  description: string,
  tags: string[],
  subject: string,
  grade: string,
  type: QuestionType,
  difficulty: Difficulty,
): string {
  const typeInstructions: Record<QuestionType, string> = {
    choice: `一道**选择题**，4 个选项（A/B/C/D），只有一个正确答案。`,
    'fill-blank': `一道**填空题**，在题干中用______标出空白处，答案唯一、明确。`,
    'true-false': `一道**判断题**，陈述一个数学事实，答案为 true 或 false。`,
  };

  const difficultyInstructions: Record<Difficulty, string> = {
    basic: '基础难度：直接考查概念记忆和简单计算，一步完成。',
    intermediate: '提高难度：需要 2-3 步推理，或结合多个知识点。',
    advanced: '挑战难度：需要综合分析、逆向思维或多种解法。',
  };

  const gradeMap: Record<string, string> = {
    primary: '小学',
    middle: '初中',
    high: '高中',
  };

  return `你是一位资深${gradeMap[grade] || grade}${subject}教师。请为以下知识点生成一道高质量的${typeInstructions[type]}

知识点：${knowledgePointTitle}
知识点描述：${description}
关联标签：${tags.join('、')}

难度要求：${difficultyInstructions[difficulty]}

要求：
- 题目表述清晰、严谨，符合${gradeMap[grade] || grade}学生认知水平
- 不要出现超纲内容
- 解析要讲清思路，适合学生自学和家长辅导

请严格按以下 JSON 格式输出（不要输出其他无关内容）：

\`\`\`json
{
  "stem": "题干",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "answer": "A",
  "explanation": "详细解析"
}
\`\`\`

注意：
- 选择题的 options 必须有 4 个选项
- 填空题不需要 options 字段，answer 直接是答案文本
- 判断题不需要 options 字段，answer 为 "true" 或 "false"`;
}
