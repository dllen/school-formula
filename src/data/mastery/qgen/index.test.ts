import { describe, it, expect } from 'vitest';
import { generateQuestions, getSupportedTechniques } from './index';

describe('generateQuestions', () => {
  it('generates the requested number of questions', () => {
    const questions = generateQuestions('multi', 10);
    expect(questions.length).toBe(10);
  });

  it('defaults to 6 questions', () => {
    const questions = generateQuestions('addsub');
    expect(questions.length).toBe(6);
  });

  it('returns empty array for unsupported technique', () => {
    const questions = generateQuestions('nonexistent');
    expect(questions).toEqual([]);
  });

  it('each question has required fields', () => {
    const questions = generateQuestions('count', 3);
    questions.forEach(q => {
      expect(q).toHaveProperty('q');
      expect(q).toHaveProperty('opts');
      expect(q).toHaveProperty('ans');
      expect(q).toHaveProperty('level');
      expect(q).toHaveProperty('explain');
      expect(q).toHaveProperty('point');
    });
  });

  it('each question has valid answer index', () => {
    const questions = generateQuestions('pyth', 10);
    questions.forEach(q => {
      expect(q.ans).toBeGreaterThanOrEqual(0);
      expect(q.ans).toBeLessThan(q.opts.length);
    });
  });

  it('each question has at least 2 options', () => {
    const questions = generateQuestions('linear1', 5);
    questions.forEach(q => {
      expect(q.opts.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('generates different questions on repeated calls', () => {
    const batch1 = generateQuestions('multi', 6);
    const batch2 = generateQuestions('multi', 6);
    // At least one question should differ (random parameters)
    const allSame = batch1.every((q, i) => q.q === batch2[i].q);
    expect(allSame).toBe(false);
  });

  it('works for all supported techniques', () => {
    const supported = getSupportedTechniques();
    supported.forEach(id => {
      const questions = generateQuestions(id, 3);
      expect(questions.length).toBeGreaterThan(0);
      questions.forEach(q => {
        expect(q.q.length).toBeGreaterThan(0);
        expect(q.opts.length).toBeGreaterThanOrEqual(2);
        expect(q.ans).toBeGreaterThanOrEqual(0);
        expect(q.ans).toBeLessThan(q.opts.length);
      });
    });
  });
});

describe('getSupportedTechniques', () => {
  it('returns a non-empty array', () => {
    const supported = getSupportedTechniques();
    expect(supported.length).toBeGreaterThan(0);
  });

  it('includes elementary techniques', () => {
    const supported = getSupportedTechniques();
    expect(supported).toContain('count');
    expect(supported).toContain('addsub');
    expect(supported).toContain('multi');
  });

  it('includes middle school techniques', () => {
    const supported = getSupportedTechniques();
    expect(supported).toContain('linear1');
    expect(supported).toContain('pyth');
    expect(supported).toContain('quadfunc');
  });

  it('includes high school techniques', () => {
    const supported = getSupportedTechniques();
    expect(supported).toContain('set');
    expect(supported).toContain('deriv');
  });

  it('all entries are non-empty strings', () => {
    const supported = getSupportedTechniques();
    supported.forEach(id => {
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });
});
