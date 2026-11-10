import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';

/** 表格 block：可选表头、可横向滚动、可选脚注。 */
export function TableBlock({
  block,
}: {
  block: Extract<Block, { kind: 'table' }>;
}): ReactElement {
  return (
    <figure className="mt-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {block.headers && (
            <thead>
              <tr className="bg-[paper-2]">
                {block.headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-[rule] px-3 py-2 text-left font-semibold text-[ink]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[accent-soft]/30 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-[rule] px-3 py-2 text-[ink]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-xs text-[ink-3]">{block.caption}</figcaption>
      )}
    </figure>
  );
}
