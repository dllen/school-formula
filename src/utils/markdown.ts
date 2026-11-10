/**
 * 数据里的章节标题常带一个装饰 emoji（`# 📜 文白对照`）。emoji 不能当图标用：
 * 每个平台长得不一样，也不受 token 控制。图标由组件统一渲染，标题只留文字。
 */
const HEADING_EMOJI = /^(#{1,6})\s*(?:[\p{Extended_Pictographic}\uFE0F\u200D]+\s*)+/gmu;

export function stripHeadingEmoji(markdown: string): string {
  return markdown.replace(HEADING_EMOJI, '$1 ');
}
