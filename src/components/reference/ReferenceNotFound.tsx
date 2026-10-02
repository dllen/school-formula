import type { ReactElement } from 'react';
import { ENGLISH_HOME } from '../../reference-routes';

/** 未知 slug / 未知学科的兜底页。 */
export function ReferenceNotFound(): ReactElement {
  return (
    <>
      <h1 className="text-2xl font-bold text-[#1F2329]">Page not found</h1>
      <p className="mt-2 text-[#646A73]">
        This chart does not exist, or it has moved to a different category.
      </p>
      <a href={ENGLISH_HOME} className="mt-4 inline-block text-[#3370FF] hover:underline">
        ← All reference charts
      </a>
    </>
  );
}
