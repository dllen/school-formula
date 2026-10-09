import { pinyin } from 'pinyin-pro';

/**
 * 古音特读字典。
 *
 * 两种 key 形式都支持：
 * - 整行替换：key 直接等于诗句行内容（如 '__test_key__'）。优先级最高。
 * - 按字特读：key 形如 "作者名|诗题|字"，value 为该字的目标拼音（带声调）。
 *   例：'杜牧|山行|斜': 'xiá'
 *
 * 录入流程：先用 pinyin-pro 默认生成 → 校对古音 → 在此字典加条目。
 */
export const POEM_PRONUNCIATION_OVERRIDES: Record<string, string> = {};

/**
 * 将古诗每行内容转拼音（带声调符号），与 content 行一一对应。
 *
 * - 默认按现代普通话 + pinyin-pro 多音字词表生成。
 * - 整行命中 POEM_PRONUNCIATION_OVERRIDES 时直接返回该值（用于整句替换）。
 * - 提供 meta 时，对每行首个 token 的首字查 author|title|字 key，命中则整 token 替换。
 *
 * @param content 每行诗句的字符串数组
 * @param meta 可选元信息（author/title），启用按字 override 时必填
 */
export function generatePinyin(
  content: string[],
  meta?: { author: string; title: string },
): string[] {
  return content.map((line) => {
    // 整行 override 优先
    if (POEM_PRONUNCIATION_OVERRIDES[line] !== undefined) {
      return POEM_PRONUNCIATION_OVERRIDES[line]!;
    }

    const tokens = pinyin(line, {
      toneType: 'symbol',
      type: 'array',
      nonZh: 'consecutive',
    });

    if (meta) {
      const replaced = tokens.map((tok) => {
        const ch = tok[0];
        if (!ch) return tok;
        const key = `${meta.author}|${meta.title}|${ch}`;
        if (POEM_PRONUNCIATION_OVERRIDES[key]) {
          return POEM_PRONUNCIATION_OVERRIDES[key];
        }
        return tok;
      });
      return replaced.join(' ');
    }

    return tokens.join(' ');
  });
}