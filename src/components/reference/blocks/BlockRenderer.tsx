import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';
import { DiagramBlock } from './DiagramBlock';
import { FormulasBlock } from './FormulasBlock';
import { TableBlock } from './TableBlock';

function renderBlock(block: Block, key: number): ReactElement {
  switch (block.kind) {
    case 'table':
      return <TableBlock key={key} block={block} />;
    case 'formulas':
      return <FormulasBlock key={key} block={block} />;
    case 'diagram':
      return <DiagramBlock key={key} block={block} />;
  }
}

/**
 * 按顺序渲染页面的数据块。switch 对 `Block` 联合类型穷尽——加一种 block 类型时
 * TypeScript 会在 `renderBlock` 上报「函数缺少返回语句」，这就是发现遗漏的地方。
 */
export function BlockRenderer({ blocks }: { blocks: readonly Block[] }): ReactElement {
  return <>{blocks.map((block, index) => renderBlock(block, index))}</>;
}
