// tsedit.ts

/** 把 JSON 值渲染成 2 空格缩进的 TS 对象字面量（JSON 是 TS 对象字面量子集）。 */
export function renderArrayItem(value: unknown): string {
  const json = JSON.stringify(value, null, 2);
  return json.split('\n').map((l) => '  ' + l).join('\n') + ',';
}

/** 在 `const <name> = [...]`（含 `export const <name>`）的数组末尾插入若干条目，返回新内容。 */
export function appendToConstArray(content: string, name: string, items: unknown[]): string {
  const decl = `const ${name}`;
  const declIdx = content.indexOf(decl);
  if (declIdx === -1) throw new Error(`未找到声明: ${name}`);
  const eq = content.indexOf('=', declIdx);
  if (eq === -1) throw new Error(`未找到赋值符号: ${name}`);
  const open = content.indexOf('[', eq);
  if (open === -1) throw new Error(`未找到数组起始: ${name}`);
  let depth = 0;
  let close = open;
  let quote: '"' | "'" | '`' | null = null;
  for (let i = open; i < content.length; i++) {
    const c = content[i];
    if (quote) {
      if (c === '\\') { i++; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { close = i; break; } }
  }
  if (depth !== 0) throw new Error(`数组括号不匹配: ${name}`);
  const rendered = items.map(renderArrayItem).join('\n');
  return content.slice(0, close) + '\n' + rendered + '\n' + content.slice(close);
}

/** 在首次出现的 `afterText` 所在行之后插入一行。 */
export function insertLineAfter(content: string, afterText: string, line: string): string {
  const idx = content.indexOf(afterText);
  if (idx === -1) throw new Error(`未找到锚点: ${afterText}`);
  const end = content.indexOf('\n', idx);
  const insertAt = end === -1 ? content.length : end + 1;
  return content.slice(0, insertAt) + line + '\n' + content.slice(insertAt);
}

/** 提取源文件内所有 `id: '…'` 与 `"id": "…"`。 */
export function extractIds(content: string): Set<string> {
  const ids = new Set<string>();
  const re = /(?:\bid|"id")\s*:\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) ids.add(m[1]);
  return ids;
}

/** 从源文件提取每个 item 块的字段映射。
 *  item 块按最外层 {...} 切分（不适用于嵌套对象，但本项目所有 array item 都是 flat 的）。
 *  返回并行数组：[{ field1: 'v1', field2: 'v2' }, ...]。 */
export function extractItemFields(
  content: string,
  ...fieldNames: string[]
): Array<Record<string, string>> {
  const items: Array<Record<string, string>> = [];
  const itemRegex = /\{[^{}]*\}/g;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(content))) {
    const block = m[0];
    const entry: Record<string, string> = {};
    for (const f of fieldNames) {
      const re = new RegExp(`\\b${f}:\\s*['"]([^'"]+)['"]`);
      const fm = re.exec(block);
      if (fm) entry[f] = fm[1];
    }
    if (Object.keys(entry).length > 0) items.push(entry);
  }
  return items;
}
