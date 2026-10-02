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
    };
