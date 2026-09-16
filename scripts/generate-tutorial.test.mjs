import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateUnit, serializeUnit, renderTutorialFile, buildPrompt,
  SCIENCE_GRADE_MAP, MORAL_GRADE_MAP, parseAIResponse,
} from './generate-tutorial.mjs';

test('validateUnit accepts a well-formed unit', () => {
  const unit = makeSampleUnit();
  assert.deepEqual(validateUnit(unit), { valid: true, errors: [] });
});

test('validateUnit rejects wrong practice count', () => {
  const unit = makeSampleUnit();
  unit.practice = unit.practice.slice(0, 7);
  const { valid, errors } = validateUnit(unit);
  assert.equal(valid, false);
  assert.ok(errors.some(e => e.includes('10')));
});

test('validateUnit rejects missing question type', () => {
  const unit = makeSampleUnit();
  unit.practice = unit.practice.map(q => ({ ...q, type: 'choice' }));
  const { valid, errors } = validateUnit(unit);
  assert.equal(valid, false);
  assert.ok(errors.some(e => e.includes('fill') && e.includes('missing')));
});

test('validateUnit rejects short hook', () => {
  const unit = makeSampleUnit();
  unit.teach.hook = '太短';
  const { valid, errors } = validateUnit(unit);
  assert.equal(valid, false);
  assert.ok(errors.some(e => e.includes('hook')));
});

test('SCIENCE_GRADE_MAP covers all 33 knowledge points exactly once', () => {
  const all = Object.values(SCIENCE_GRADE_MAP).flat();
  assert.equal(all.length, 33);
  assert.equal(new Set(all).size, 33, 'no duplicate ids');
});

test('MORAL_GRADE_MAP covers all 32 knowledge points exactly once', () => {
  const all = Object.values(MORAL_GRADE_MAP).flat();
  assert.equal(all.length, 32);
  assert.equal(new Set(all).size, 32, 'no duplicate ids');
});

test('serializeUnit produces TypeScript that round-trips', () => {
  const unit = makeSampleUnit();
  const src = serializeUnit(unit);
  assert.ok(src.includes('id:'));
  assert.ok(src.includes('practice:'));
  assert.ok(!src.includes('undefined'));
});

test('serializeUnit emits practice as helper calls (not inline objects)', () => {
  const unit = makeSampleUnit();
  const src = serializeUnit(unit);
  // Controller fix: practice must use the choice/fill/truefalse/solve helpers
  // so they aren't unused under noUnusedLocals. Guard against regression.
  assert.ok(src.includes('choice('), 'expected choice() helper call');
  assert.ok(src.includes('fill('), 'expected fill() helper call');
  assert.ok(src.includes('truefalse('), 'expected truefalse() helper call');
  assert.ok(src.includes('solve('), 'expected solve() helper call');
});

test('buildPrompt embeds title, grade, objectives', () => {
  const kp = { title: '植物', tutorialContent: { objectives: ['认识根'] } };
  const prompt = buildPrompt(kp, '1', '科学', '🔬');
  assert.ok(prompt.includes('植物'));
  assert.ok(prompt.includes('一年级'));
  assert.ok(prompt.includes('认识根'));
});

test('parseAIResponse parses bare JSON', () => {
  const unit = makeSampleUnit();
  const parsed = parseAIResponse(JSON.stringify(unit));
  assert.equal(parsed.id, unit.id);
});

test('parseAIResponse strips markdown fences', () => {
  const unit = makeSampleUnit();
  const text = '```json\n' + JSON.stringify(unit) + '\n```';
  const parsed = parseAIResponse(text);
  assert.equal(parsed.id, unit.id);
});

test('parseAIResponse throws on invalid JSON', () => {
  assert.throws(() => parseAIResponse('not json'), SyntaxError);
});

function makeSampleUnit() {
  const mk = (id, type, diff) => ({ id, type, question: `${id}?`, answer: 'x', explanation: 'e', difficulty: diff, options: type === 'choice' ? ['a', 'b', 'c', 'd'] : undefined });
  return {
    id: 'ps1-u1', order: 1, title: '植物', duration: '约 40 分钟',
    objectives: ['认识植物器官'],
    teach: { hook: '这是一段足够长的故事导入文字，用来测试 hook 长度校验逻辑，需要超过一百字才能通过验证。所以我们继续补充一些生动的内容让这段文字足够长：想象一下，阳光洒在窗台上，一盆绿萝的叶子在微风中轻轻摇晃。小朋友们，你们有没有仔细观察过植物的根、茎、叶呢？今天让我们一起走进植物的世界，探索它们神奇的生命奥秘，看看它们是如何从小种子长成参天大树的吧！', summary: '本课认识植物。' },
    learn: { sections: [{ title: '根', content: '根在土壤里。', examples: [{ title: '例', problem: '题', solution: '解', tip: '提示' }] }], tips: ['观察实物'] },
    practice: [
      mk('q1', 'choice', 'easy'), mk('q2', 'fill', 'easy'), mk('q3', 'truefalse', 'easy'), mk('q4', 'solve', 'easy'),
      mk('q5', 'choice', 'medium'), mk('q6', 'fill', 'medium'), mk('q7', 'truefalse', 'medium'), mk('q8', 'solve', 'medium'),
      mk('q9', 'choice', 'hard'), mk('q10', 'fill', 'hard'),
    ],
    aiContext: '一年级 科学 植物',
  };
}
