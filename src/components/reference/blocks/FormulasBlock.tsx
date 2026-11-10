import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';

/** 公式 block：按用途分组，每组可选一个标题；公式本身是内容，用等宽字体。 */
export function FormulasBlock({
  block,
}: {
  block: Extract<Block, { kind: 'formulas' }>;
}): ReactElement {
  return (
    <div className="space-y-6">
      {block.groups.map((group, index) => (
        <section key={index}>
          {group.label && <h2 className="text-subhead font-semibold text-ink">{group.label}</h2>}
          <ul className={group.label ? 'mt-3 space-y-2' : 'space-y-2'}>
            {group.items.map((item) => (
              <li
                key={item}
                className="well break-words px-4 py-2 font-mono text-body-s text-ink"
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
