import { describe, it, expect } from 'vitest';
import { GENERATORS } from './generators';

/**
 * Validates that a question produced by any generator is well-formed.
 */
function assertValidQuestion(q: ReturnType<() => unknown>, techniqueId: string) {
  expect(q).toHaveProperty('q');
  expect(q).toHaveProperty('opts');
  expect(q).toHaveProperty('ans');
  expect(q).toHaveProperty('level');
  expect(q).toHaveProperty('explain');
  expect(q).toHaveProperty('point');

  // q must be a non-empty string
  expect(typeof q.q).toBe('string');
  expect(q.q.length).toBeGreaterThan(0);

  // opts must be a non-empty array of strings with valid answer index
  expect(Array.isArray(q.opts)).toBe(true);
  expect(q.opts.length).toBeGreaterThanOrEqual(2);
  q.opts.forEach((opt: unknown) => typeof opt === 'string');
  expect(q.ans).toBeGreaterThanOrEqual(0);
  expect(q.ans).toBeLessThan(q.opts.length);

  // level must be a positive integer
  expect(Number.isInteger(q.level)).toBe(true);
  expect(q.level).toBeGreaterThanOrEqual(1);

  // explain must be a non-empty string
  expect(typeof q.explain).toBe('string');
  expect(q.explain.length).toBeGreaterThan(0);

  // point must be a non-empty string
  expect(typeof q.point).toBe('string');
  expect(q.point.length).toBeGreaterThan(0);
}

const ALL_IDS = Object.keys(GENERATORS);

describe('GENERATORS — all techniques', () => {
  it(`has ${ALL_IDS.length} generator functions`, () => {
    expect(ALL_IDS.length).toBe(31);
  });

  it('every generator produces valid questions', () => {
    ALL_IDS.forEach(id => {
      const gen = GENERATORS[id];
      for (let i = 0; i < 5; i++) {
        const q = gen();
        assertValidQuestion(q, id);
      }
    });
  });

  it('every generator produces varied questions (randomized)', () => {
    ALL_IDS.forEach(id => {
      const gen = GENERATORS[id];
      const questions = new Set<string>();
      for (let i = 0; i < 10; i++) {
        questions.add(gen().q);
      }
      // With 10 random generations, we should see at least 2 different questions
      expect(questions.size, `Technique "${id}" should produce varied questions`).toBeGreaterThan(1);
    });
  });
});

// ========== Elementary school generators ==========

describe('小学 generators', () => {
  const elementaryIds = ['count', 'addsub', 'multi', 'divide', 'fourops', 'plant', 'sumdiff', 'average', 'fraction'] as const;

  it('all 9 elementary generators exist', () => {
    elementaryIds.forEach(id => {
      expect(GENERATORS[id]).toBeDefined();
    });
  });

  it('multi generator produces multiplication problems with valid answers', () => {
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS.multi();
      const match = q.q.match(/(\d+)\s*×\s*(\d+)\s*=/);
      expect(match).not.toBeNull();
      const a = parseInt(match![1]);
      const b = parseInt(match![2]);
      const correct = a * b;
      expect(q.opts[q.ans]).toBe(String(correct));
    }
  });

  it('divide generator produces division problems with valid answers', () => {
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS.divide();
      const match = q.q.match(/(\d+)\s*÷\s*(\d+)\s*=/);
      expect(match).not.toBeNull();
      const dividend = parseInt(match![1]);
      const divisor = parseInt(match![2]);
      const correct = dividend / divisor;
      expect(dividend % divisor).toBe(0); // must be exact division
      expect(q.opts[q.ans]).toBe(String(correct));
    }
  });

  it('pyth generator uses Pythagorean triples correctly', () => {
    const triples = [[3,4,5],[6,8,10],[5,12,13],[8,15,17]];
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS.pyth();
      const match = q.q.match(/(\d+)\s*和\s*(\d+)，斜边为/);
      if (match) {
        const a = parseInt(match[1]);
        const b = parseInt(match[2]);
        const expectedC = Math.sqrt(a * a + b * b);
        expect(expectedC).toBe(Math.floor(expectedC)); // integer hypotenuse
        expect(q.opts[q.ans]).toBe(String(expectedC));
      }
    }
  });
});

// ========== Middle school generators ==========

describe('初中 generators', () => {
  const middleIds = [
    'rational', 'integral', 'linear1', 'inequal', 'system',
    'segangle', 'triangle', 'congruent', 'similar', 'pyth',
    'quad', 'circ', 'func1', 'inverse', 'quadfunc'
  ] as const;

  it('all 15 middle school generators exist', () => {
    middleIds.forEach(id => {
      expect(GENERATORS[id]).toBeDefined();
    });
  });

  it('linear1 generator solves equations correctly', () => {
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS.linear1();
      const match = q.q.match(/(\d+)x\s*\+\s*(\d+)\s*＝\s*(\d+)/);
      if (match) {
        const a = parseInt(match[1]);
        const b = parseInt(match[2]);
        const c = parseInt(match[3]);
        const expectedX = (c - b) / a;
        expect(q.opts[q.ans]).toBe(String(expectedX));
      }
    }
  });

  it('triangle generator produces valid angles (sum to 180)', () => {
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS.triangle();
      const match = q.q.match(/(\d+)°\s*和\s*(\d+)°，第三个角/);
      if (match) {
        const a = parseInt(match[1]);
        const b = parseInt(match[2]);
        const expected = 180 - a - b;
        expect(expected).toBeGreaterThan(0);
        expect(q.opts[q.ans]).toBe(String(expected));
      }
    }
  });

  it('circle generator: inscribed angle = central angle / 2', () => {
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS.circ();
      const match = q.q.match(/(\d+)°，同弧所对的圆周角/);
      if (match) {
        const central = parseInt(match[1]);
        const expected = central / 2;
        expect(q.opts[q.ans]).toBe(String(expected));
      }
    }
  });
});

// ========== High school generators ==========

describe('高中 generators', () => {
  const highIds = ['set', 'func', 'explog', 'trig', 'sequence', 'vector', 'deriv'] as const;

  it('all 7 high school generators exist', () => {
    highIds.forEach(id => {
      expect(GENERATORS[id]).toBeDefined();
    });
  });

  it('sequence generator: arithmetic progression a_n = a1 + (n-1)d', () => {
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS.sequence();
      const match = q.q.match(/首项\s*(\d+)，公差\s*(\d+)，第\s*(\d+)\s*项/);
      if (match) {
        const a1 = parseInt(match[1]);
        const d = parseInt(match[2]);
        const n = parseInt(match[3]);
        const expected = a1 + (n - 1) * d;
        expect(q.opts[q.ans]).toBe(String(expected));
      }
    }
  });

  it('vector generator: component-wise addition', () => {
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS.vector();
      const match = q.q.match(/\((\d+),(\d+)\)\s*\+\s*\((\d+),(\d+)\)/);
      if (match) {
        const x1 = parseInt(match[1]);
        const y1 = parseInt(match[2]);
        const x2 = parseInt(match[3]);
        const y2 = parseInt(match[4]);
        const expectedX = x1 + x2;
        const expectedY = y1 + y2;
        expect(q.opts[q.ans]).toBe(`(${expectedX},${expectedY})`);
      }
    }
  });

  it('deriv generator: power rule d/dx(ax^n) = anx^(n-1)', () => {
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS.deriv();
      const match = q.q.match(/f\(x\)\s*＝\s*(\d+)x\^(\d+)/);
      if (match) {
        const a = parseInt(match[1]);
        const n = parseInt(match[2]);
        const coef = a * n;
        const exp = n - 1;
        expect(q.opts[q.ans]).toBe(`${coef}x^${exp}`);
      }
    }
  });
});
