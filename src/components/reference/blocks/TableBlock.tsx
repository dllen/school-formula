import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';

/** 表格 block：可选表头、小屏可横向滚动、可选脚注。 */
export function TableBlock({
  block,
}: {
  block: Extract<Block, { kind: 'table' }>;
}): ReactElement {
  const columnCount = block.headers?.length ?? block.rows[0]?.length ?? 0;

  return (
    <figure className="min-w-0">
      {columnCount >= 7 && (
        <p className="mb-2 text-caption text-ink-3 sm:hidden">
          Scroll sideways to see the whole chart.
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="table-basic">
          {block.headers && (
            <thead>
              <tr>
                {block.headers.map((header, index) => (
                  <th key={index} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.caption && <figcaption className="mt-2 text-caption text-ink-3">{block.caption}</figcaption>}
    </figure>
  );
}
