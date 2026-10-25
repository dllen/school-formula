import fs from 'node:fs/promises';
import path from 'node:path';

const base = 'src/data/knowledge/primary';
const files = (await fs.readdir(base)).filter((f) => f.endsWith('.generated.ts'));

function isWeak(content) {
  if (!content || typeof content !== 'object') return true;
  if (!content.explanation || content.explanation.length < 30) return true;
  if (!Array.isArray(content.examples) || content.examples.length === 0) return true;
  if (content.examples.some((ex) => !ex.problem || !ex.solution)) return true;
  if (!Array.isArray(content.exercises) || content.exercises.length === 0) return true;
  if (content.exercises.some((ex) => !ex.question || !ex.answer)) return true;
  if (JSON.stringify(content.objectives) === JSON.stringify(['理解本课核心概念', '能完成基础练习'])) return true;
  return false;
}

function extractJsonArray(fileContent) {
  const exportMatch = fileContent.match(/export\s+const\s+\w+\s*:\s*KnowledgePoint\[\]\s*=\s*/);
  if (!exportMatch) throw new Error('Could not find export statement');
  const start = exportMatch.index + exportMatch[0].length;
  let i = start;
  while (i < fileContent.length && /\s/.test(fileContent[i])) i += 1;
  if (fileContent[i] !== '[') throw new Error('Expected array after export statement');

  let depth = 0;
  let inString = false;
  let escaped = false;
  let arrayStart = i;
  for (; i < fileContent.length; i += 1) {
    const ch = fileContent[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
    } else {
      if (ch === '"') {
        inString = true;
      } else if (ch === '[') {
        depth += 1;
      } else if (ch === ']') {
        depth -= 1;
        if (depth === 0) {
          return fileContent.slice(arrayStart, i + 1);
        }
      }
    }
  }
  throw new Error('Could not find matching closing bracket');
}

for (const file of files.sort()) {
  const content = await fs.readFile(path.join(base, file), 'utf8');
  const kps = JSON.parse(extractJsonArray(content));
  const weak = kps.filter((kp) => isWeak(kp.tutorialContent));
  if (weak.length > 0) {
    console.log(`${file}: ${weak.length}/${kps.length} weak`);
  }
}
