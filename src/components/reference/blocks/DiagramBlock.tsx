import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';

/**
 * 图形 block。SVG 直接以 `dangerouslySetInnerHTML` 注入——这是本仓库内撰写的静态
 * 数据（`src/data/reference/**`），不是用户输入，没有注入面；写成组件会迫使数据文件
 * 变成 .tsx 并失去「数据即常量」的简单性。新增 SVG 时必须在 review 时看过内容。
 */
export function DiagramBlock({
  block,
}: {
  block: Extract<Block, { kind: 'diagram' }>;
}): ReactElement {
  return (
    <figure className="mt-6">
      <div
        className="mx-auto max-w-md [&>svg]:h-auto [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: block.svg }}
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-xs text-[#8F959E]">{block.caption}</figcaption>
      )}
    </figure>
  );
}
