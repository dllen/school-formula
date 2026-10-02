/** 学科分类。决定 `/en/<category>/` hub 路由与 slug 的取值域。 */
export type ReferenceCategory = 'math' | 'science' | 'english';

/**
 * 一个内容块。rows / items 里放数字与符号；headers、caption、group.label 可能是英文
 * （例如物理常数的表头），由语言文件负责——生成器只保证算术正确。
 */
export type Block =
  | { kind: 'table'; headers?: string[]; rows: string[][]; caption?: string }
  | { kind: 'formulas'; groups: { label?: string; items: string[] }[] }
  | { kind: 'diagram'; svg: string; caption?: string };

/**
 * 一张完整的打印图表页。文案与 block 放在同一个对象里，而不是拆成并列的 copy 文件——
 * 因为真正语言中立的是生成器函数，不是这些字段；加一门语言等于加一份页表，
 * 而不是去 copy 文件里对 blockId。
 */
export interface ReferencePage {
  /** 本地化的 URL 末段，全站唯一。 */
  slug: string;
  category: ReferenceCategory;
  /** H1 文本。`<title>` 在 seo/content-en.ts 里基于它拼装。 */
  title: string;
  /** 索引卡一行话，约 60–90 字符。 */
  summary: string;
  /** meta description，约 150–160 字符。 */
  description: string;
  /** 正文导语，80–120 词。 */
  intro: string;
  /** 页面主体。 */
  blocks: Block[];
  /** "How to use it" 列表，2–4 条。 */
  howToUse: string[];
  /** 3–5 条，同时产出 FAQPage 结构化数据。 */
  faq: { q: string; a: string }[];
  /** 3–5 个 slug 的显式内链；没有合适兄弟页时允许为空数组。 */
  related: string[];
}
