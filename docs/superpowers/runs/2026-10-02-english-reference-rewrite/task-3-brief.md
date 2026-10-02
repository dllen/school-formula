## Task 3: Block 渲染组件

**Files:**
- Create: `src/components/reference/blocks/TableBlock.tsx`
- Create: `src/components/reference/blocks/FormulasBlock.tsx`
- Create: `src/components/reference/blocks/DiagramBlock.tsx`
- Create: `src/components/reference/blocks/BlockRenderer.tsx`
- Test: `src/components/reference/blocks/BlockRenderer.test.tsx`

**Interfaces:**
- Consumes: `Block`（Task 1，通过显式路径 `'../../../data/reference/types'` 导入——该路径不与旧文件冲突）
- Produces:
  - `TableBlock({ block }: { block: Extract<Block, { kind: 'table' }> }): ReactElement`
  - `FormulasBlock({ block }: { block: Extract<Block, { kind: 'formulas' }> }): ReactElement`
  - `DiagramBlock({ block }: { block: Extract<Block, { kind: 'diagram' }> }): ReactElement`
  - `BlockRenderer({ blocks }: { blocks: readonly Block[] }): ReactElement`

**本任务刻意排在数据替换之前**，因为 `BlockRenderer` 只依赖 `Block` 类型（显式路径导入），而 Task 4 重写图表页时需要它。放在这里让 Task 4 不必再临时拼一个表格渲染。

- [ ] **Step 1: 写失败测试 `BlockRenderer.test.tsx`**

注意表格用例的单元格值刻意与表头值不同名——testing-library 的 `getByRole` 在多个同名元素上会抛错。

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Block } from '../../../data/reference/types';
import { BlockRenderer } from './BlockRenderer';

describe('BlockRenderer', () => {
  it('renders a table block with headers and rows', () => {
    const block: Block = { kind: 'table', headers: ['×', '1'], rows: [['7', '8']] };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.getByRole('columnheader', { name: '×' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '7' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '8' })).toBeTruthy();
  });

  it('renders a table block without headers', () => {
    const block: Block = { kind: 'table', rows: [['only-cell']] };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.queryByRole('columnheader')).toBeNull();
    expect(screen.getByRole('cell', { name: 'only-cell' })).toBeTruthy();
  });

  it('renders a table caption when present', () => {
    const block: Block = { kind: 'table', rows: [['1']], caption: 'Rounded to 3 decimals' };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.getByText('Rounded to 3 decimals')).toBeTruthy();
  });

  it('renders formula groups with and without a label', () => {
    const block: Block = {
      kind: 'formulas',
      groups: [{ label: 'Pythagorean', items: ['sin²θ + cos²θ = 1'] }, { items: ['bare-item'] }],
    };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.getByText('Pythagorean')).toBeTruthy();
    expect(screen.getByText('sin²θ + cos²θ = 1')).toBeTruthy();
    expect(screen.getByText('bare-item')).toBeTruthy();
  });

  it('renders a diagram block by injecting its svg', () => {
    const block: Block = {
      kind: 'diagram',
      svg: '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>',
      caption: 'Unit circle',
    };
    const { container } = render(<BlockRenderer blocks={[block]} />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.innerHTML).toContain('<circle');
    expect(screen.getByText('Unit circle')).toBeTruthy();
  });

  it('renders multiple blocks in order', () => {
    const blocks: Block[] = [
      { kind: 'table', rows: [['first-table']] },
      { kind: 'formulas', groups: [{ items: ['second-formulas'] }] },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    const text = container.textContent ?? '';
    expect(text.indexOf('first-table')).toBeLessThan(text.indexOf('second-formulas'));
  });

  it('renders nothing for an empty block list', () => {
    const { container } = render(<BlockRenderer blocks={[]} />);
    expect(container.textContent).toBe('');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/components/reference/blocks/BlockRenderer.test.tsx`
Expected: FAIL — `Failed to resolve import "./BlockRenderer"`

- [ ] **Step 3: 写 `TableBlock.tsx`**

表格类名沿用重写前 `ReferencePage.tsx` 里的值，不改视觉。

```tsx
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
              <tr className="bg-[#F5F6F7]">
                {block.headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-[#E5E6EB] px-3 py-2 text-left font-semibold text-[#1F2329]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#E1EAFF]/30 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-[#E5E6EB] px-3 py-2 text-[#1F2329]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-xs text-[#8F959E]">{block.caption}</figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 4: 写 `FormulasBlock.tsx`**

```tsx
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
```

- [ ] **Step 5: 写 `DiagramBlock.tsx`**

```tsx
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
```

- [ ] **Step 6: 写 `BlockRenderer.tsx`**

```tsx
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
```

- [ ] **Step 7: 跑测试确认通过**

Run: `npx vitest run src/components/reference/blocks/BlockRenderer.test.tsx`
Expected: PASS（7 个用例）

- [ ] **Step 8: 类型检查与 lint**

Run: `npx tsc -b`
Expected: 无输出（成功）

Run: `npx eslint src/components/reference/blocks/`
Expected: 无错误。本仓库的 ESLint 配置是 `@eslint/js` + typescript-eslint + react-hooks + react-refresh，**没有装 `eslint-plugin-react`**，所以 `dangerouslySetInnerHTML` 不会触发规则。若确实报错，补一行 `// eslint-disable-next-line <rule>` 并注明原因。

- [ ] **Step 9: 提交**

```bash
git add src/components/reference/blocks/
git commit -m "$(cat <<'EOF'
feat(reference): 三种 block 的渲染组件与穷尽分发

加第四种 block 类型时 TS 会在 renderBlock 上报缺少返回语句，
漏改不会静默通过。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

