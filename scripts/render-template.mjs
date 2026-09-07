/**
 * 通用模板渲染：支持 {{var}} 替换和 {{#if var}}...{{/if}} 条件块
 * 用于提示词模板渲染（PromptTemplate 的 {{variable}} 语法）
 */
export function renderTemplate(template, variables = {}) {
  let out = template;
  for (const [key, value] of Object.entries(variables)) {
    out = out.replaceAll(`{{${key}}}`, value ?? '');
  }
  out = out.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, content) => (variables[key] ? content : ''),
  );
  return out;
}
