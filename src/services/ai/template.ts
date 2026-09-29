// src/services/ai/template.ts
import type { PromptTemplate } from '../../data/prompts/types';
import { callGateway } from '../gateway';
import { createOpenAIClient } from './client';
import { getAIConfig } from './storage';

/**
 * 根据模板 + 用户填写变量，组装最终 prompt。
 * 模板占位符语法：{{variable}} 简单替换；{{#if variable}}...{{/if}} 条件块；残留 {{...}} 一律清空。
 */
const TEMPLATE_PROMPT = (template: PromptTemplate, variables: Record<string, string>): string => {
    let finalPrompt = template.template;
    for (const [key, value] of Object.entries(variables)) {
        finalPrompt = finalPrompt.replace(
            new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
            value
        );
    }

    finalPrompt = finalPrompt.replace(
        /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
        (_, key, content) => variables[key] ? content : ''
    );

    finalPrompt = finalPrompt.replace(/\{\{[^}]+\}\}/g, '');
    return finalPrompt;
};

export const generateFromTemplate = async (
    template: PromptTemplate,
    variables: Record<string, string>,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) {
        throw new Error('AI 配置未找到');
    }

    if (!config.apiKey && config.provider !== 'gateway') {
        throw new Error('API Key not configured');
    }

    const finalPrompt = TEMPLATE_PROMPT(template, variables);

    if (config.provider === 'gateway') {
        await callGateway({ prompt: finalPrompt }, onStream);
        return;
    }

    const client = createOpenAIClient(config);
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
