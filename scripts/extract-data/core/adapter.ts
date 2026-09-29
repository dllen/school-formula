// scripts/extract-data/core/adapter.ts
import type { BaseEnvelope } from './envelope.js';

/** 抽取端适配器：把外部站点数据变成 ingest-data 可消费的信封。 */
export interface Adapter {
  /** 必须与 scripts/ingest-data/adapters/<kind>.ts 的 kind 完全一致。 */
  readonly kind: string;
  /** 人类可读标签，--list 时显示。 */
  readonly name: string;
  /** 一句话描述，--list 时显示。 */
  readonly description: string;

  /** 列举要抓取的页面 URL。绝对或相对均可，相对由 fetchPage 自己处理 base。 */
  listUrls(): Promise<string[]>;

  /** 抓取并解析单个 URL，返回该页原始解析结果（adapter 自己定义形状）。 */
  fetchPage(url: string): Promise<unknown>;

  /** 把所有 fetchPage 结果归一化为 ingest-data 期望的信封。 */
  normalize(pages: unknown[]): BaseEnvelope;
}
