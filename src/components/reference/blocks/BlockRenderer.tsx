import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';
import { DiagramBlock } from './DiagramBlock';
import { FormulasBlock } from './FormulasBlock';
import { TableBlock } from './TableBlock';

function renderBlock(block: Block): ReactElement {
  switch (block.kind) {
    case 'table':
      return <TableBlock block={block} />;
    case 'formulas':
      return <FormulasBlock block={block} />;
    case 'diagram':
      return <DiagramBlock block={block} />;
  }
}

/**
 * 按顺序渲染页面的数据块。switch 对 `Block` 联合类型穷尽——加一种 block 类型时
 * TypeScript 会在 `renderBlock` 上报「函数缺少返回语句」，这就是发现遗漏的地方。
 * 每个块是一节发丝线分隔的内容，与正文分区同一套阅读节奏。
 */
export function BlockRenderer({ blocks }: { blocks: readonly Block[] }): ReactElement {
  return (
    <>
      {blocks.map((block, index) => (
        <div key={index} className="section">
          {renderBlock(block)}
        </div>
      ))}
    </>
  );
}
