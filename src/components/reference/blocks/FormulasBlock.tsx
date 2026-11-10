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
            <h3 className="mb-2 text-sm font-semibold text-ink-3">
              {group.label}
            </h3>
          )}
          <ul className="space-y-1.5">
            {group.items.map((item) => (
              <li
                key={item}
                className="rounded-lg bg-white border border-[divider] px-4 py-2 font-mono text-sm text-[ink]"
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
