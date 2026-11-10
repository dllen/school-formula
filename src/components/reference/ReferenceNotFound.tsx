import type { ReactElement } from 'react';
import { ENGLISH_HOME } from '../../reference-routes';

/** 未知 slug / 未知学科的兜底页。 */
export function ReferenceNotFound(): ReactElement {
  return (
    <div className="py-10">
      <h1 className="page-title">Page not found</h1>
      <p className="mt-2 max-w-prose text-body-s text-ink-2">
        This chart does not exist, or it has moved to a different category.
      </p>
      <a href={ENGLISH_HOME} className="link mt-6 inline-flex text-body-s">
        All reference charts
      </a>
    </div>
  );
}
