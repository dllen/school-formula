import { readFileSync, writeFileSync } from 'node:fs';

/** 正向括号配平：找与 from 位置 '{' 配对的 '}' 下标 + 1（字符串内括号不参与） */
export function matchBracketForward(text, from = 0) {
  const open = text[from];
  const close = open === '[' ? ']' : '}';
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let escaped = false;
  for (let i = from; i < text.length; i++) {
    const ch = text[i];
    if (escaped) { escaped = false; continue; }
    if (inString) {
      if (ch === '\\') { escaped = true; continue; }
      if (ch === stringChar) { inString = false; continue; }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = true; stringChar = ch; continue; }
    if (ch === open) { depth++; continue; }
    if (ch === close && --depth === 0) return i + 1;
  }
  throw new Error(`bracket not matched at ${from}`);
}

function main() {
  const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
  const mode = args.dryRun ? 'dryRun' : 'apply';
  const rows = JSON.parse(readFileSync(args.input, 'utf8'));

  let applied = 0, skipped = 0, missing = 0;

  for (const row of rows) {
    if (!row.tutorialContent) {
      skipped++;
      continue;
    }
    const filePath = `src/data/knowledge/${row.grade}/${row.subject}.ts`;
    let text;
    try {
      text = readFileSync(filePath, 'utf8');
    } catch {
      console.warn(`file not found: ${filePath}`);
      missing++;
      continue;
    }

    const idNeedle = `id: '${row.id}',`;
    const idIdx = text.indexOf(idNeedle);
    if (idIdx === -1) {
      console.warn(`id not found: ${row.id}`);
      missing++;
      continue;
    }

    const objStart = text.lastIndexOf('{', idIdx);
    const objEnd = matchBracketForward(text, objStart);
    const objText = text.slice(objStart, objEnd);
    if (objText.includes('tutorialContent')) {
      skipped++;
      continue;
    }

    const tcJson = JSON.stringify(row.tutorialContent, null, 12);
    const indented = tcJson.replace(/\n/g, '\n            ');
    const insertText = `,\n            tutorialContent: ${indented}`;
    const newText = text.slice(0, objEnd - 1) + insertText + '\n          ' + text.slice(objEnd - 1);

    if (mode === 'dryRun') {
      console.log(`[dry-run] ${row.id} → ${filePath}`);
      applied++;
    } else {
      writeFileSync(filePath, newText);
      applied++;
    }
  }

  console.log(`merge (${mode}): ${applied} applied, ${skipped} skipped, ${missing} missing`);
}

// 仅在本文件直接运行时执行
const invokedAsMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (invokedAsMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
