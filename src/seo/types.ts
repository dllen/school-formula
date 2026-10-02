/** A breadcrumb entry. `path` is omitted for non-linkable levels (e.g. a grade). */
export interface Breadcrumb {
  name: string;
  path?: string;
}

/** Normalized page metadata a route resolves to, before URL/schema composition. */
export type PageContent =
  | { kind: 'home'; title: string; description: string; breadcrumbs: Breadcrumb[] }
  | { kind: 'view'; title: string; description: string; breadcrumbs: Breadcrumb[] }
  | {
      kind: 'knowledge';
      title: string;
      description: string;
      breadcrumbs: Breadcrumb[];
      resource: { name: string; description: string; subject: string; grade: string };
    }
  | {
      /** 英文面的图表页。带 faq 是为了产出 FAQPage 标记，不是文案来源。 */
      kind: 'reference';
      title: string;
      description: string;
      breadcrumbs: Breadcrumb[];
      resource: { name: string; description: string; category: string };
      faq: { q: string; a: string }[];
    }
  | {
      /** 英文面的学科 hub。charts 构成 ItemList。 */
      kind: 'hub';
      title: string;
      description: string;
      breadcrumbs: Breadcrumb[];
      category: string;
      charts: { name: string; path: string }[];
    };
