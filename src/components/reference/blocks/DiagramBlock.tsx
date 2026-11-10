import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';

/**
 * 图形 block。SVG 直接以 `dangerouslySetInnerHTML` 注入——这是本仓库内撰写的静态
 * 数据（`src/data/reference/**`），不是用户输入，没有注入面；写成组件会迫使数据文件
 * 变成 .tsx 并失去「数据即常量」的简单性。新增 SVG 时必须在 review 时看过内容。
 *
 * 图形是真实内容的图形（数轴、示意图），所以给外层一个 role="img" 与标签，
 * 屏幕阅读器读一句说明而不是逐条读路径。
 */
export function DiagramBlock({
  block,
}: {
  block: Extract<Block, { kind: 'diagram' }>;
}): ReactElement {
  return (
    <figure className="min-w-0">
      <div
        className="[&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
        role="img"
        aria-label={block.caption ?? 'Reference diagram'}
        dangerouslySetInnerHTML={{ __html: block.svg }}
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-caption text-ink-3">{block.caption}</figcaption>
      )}
    </figure>
  );
}
