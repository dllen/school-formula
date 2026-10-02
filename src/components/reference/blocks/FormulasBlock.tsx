import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';

/** 公式 block：按用途分组，每组可选一个标题。 */
export function FormulasBlock({
  block,
}: {
  block: Extract<Block, { kind: 'formulas' }>;
}): ReactElement {
  return (
    <div className="mt-6 space-y-6">
      {block.groups.map((group, index) => (
        <section key={index}>
          {group.label && (
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#8F959E]">
              {group.label}
            </h3>
          )}
          <ul className="space-y-1.5">
            {group.items.map((item) => (
              <li
                key={item}
                className="rounded-lg bg-white border border-[#F0F1F2] px-4 py-2 font-mono text-sm text-[#1F2329]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
