// scripts/extract-data/core/adapter.ts
import type { BaseEnvelope } from './envelope.js';

export type { BaseEnvelope } from './envelope.js';

/** 抽取端适配器：把外部站点数据变成 ingest-data 可消费的信封。 */
export interface Adapter {
  readonly kind: string;
  readonly name: string;
  readonly description: string;

  /** 列举要抓取的页面 URL。 */
  listUrls(): Promise<string[]>;

  /** 抓取 HTML（框架会处理重试/限速/缓存，adapter 不感知）。 */
  fetchHtml(url: string): Promise<string>;

  /** 从 HTML 抽取该页原始数据。 */
  parseHtml(url: string, html: string): Promise<unknown>;

  /** 把所有 parseHtml 结果归一化为信封。 */
  normalize(pages: unknown[]): BaseEnvelope;
}
