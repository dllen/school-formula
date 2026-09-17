// scripts/ingest-data/types.ts

/** 描述一个 payload 对应的真实 TS 类型，用于 `satisfies` 校验。 */
export interface TypeRef {
  /** 导出该类型的模块绝对路径（如 `<root>/src/data/tutorials/types.ts`）。 */
  path: string;
  /** 要 import 的类型名（如 `Tutorial`）。 */
  name: string;
  /** `satisfies` 用的类型表达式（如 `'Tutorial'`、`'Question[]'`）。 */
  expr: string;
}

export interface IngestContext {
  /** 仓库根绝对路径。 */
  root: string;
  /** 仅校验不写盘。 */
  dryRun: boolean;
  /** 已加载的知识点 id 全集（index.ts 预加载，供 question-bank 校验 knowledgePointIds）。 */
  knowledgePointIds: Set<string>;
}

export interface MergeResult {
  /** 创建/修改的绝对路径列表。 */
  files: string[];
  /** 插入的顶层条目数。 */
  inserted: number;
}

export interface WireResult {
  /** 被编辑的 index 文件绝对路径列表（无需接线则为空数组）。 */
  files: string[];
}

/** 数据类型适配器：extract → validate → merge → wire。 */
export interface Adapter {
  kind: string;
  typeRef: TypeRef;
  /** 从 JSON 信封中提取类型化值（可注入默认字段）。 */
  extract(raw: unknown): unknown;
  /** 业务规则校验（不含类型层），返回错误列表，空数组=通过。 */
  validate(value: unknown, ctx: IngestContext): string[];
  /** 合并进目标文件。`raw` 为完整 JSON 信封（当 `value` 不含 grade/subject 等定位字段时使用）。 */
  merge(value: unknown, raw: unknown, ctx: IngestContext): MergeResult;
  /** 接线 index/ALL_*。`raw` 同上。 */
  wire(value: unknown, raw: unknown, ctx: IngestContext): WireResult;
}
