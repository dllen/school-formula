import { describe, it, expect } from 'vitest';
import { TECHNIQUES, getTechniquesByStage, getLearningPath, getTechniqueById } from './techniques';

describe('TECHNIQUES', () => {
  it('has 31 techniques', () => {
    expect(TECHNIQUES.length).toBe(31);
  });

  it('every technique has required fields', () => {
    TECHNIQUES.forEach(t => {
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('grade');
      expect(t).toHaveProperty('stage');
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('summary');
      expect(t).toHaveProperty('kou');
      expect(t).toHaveProperty('steps');
      expect(t).toHaveProperty('prereq');
    });
  });

  it('every id is unique', () => {
    const ids = TECHNIQUES.map(t => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every stage is valid', () => {
    const validStages = ['小学', '中学', '高中'];
    TECHNIQUES.forEach(t => {
      expect(validStages).toContain(t.stage);
    });
  });

  it('every technique has non-empty name', () => {
    TECHNIQUES.forEach(t => {
      expect(t.name.length).toBeGreaterThan(0);
    });
  });

  it('every technique has non-empty summary', () => {
    TECHNIQUES.forEach(t => {
      expect(t.summary.length).toBeGreaterThan(0);
    });
  });

  it('every technique has at least one step', () => {
    TECHNIQUES.forEach(t => {
      expect(t.steps.length).toBeGreaterThan(0);
    });
  });

  it('prereqs reference existing techniques or are null', () => {
    const ids = new Set(TECHNIQUES.map(t => t.id));
    TECHNIQUES.forEach(t => {
      if (t.prereq !== null) {
        expect(ids.has(t.prereq)).toBe(true);
      }
    });
  });

  it('has elementary school techniques', () => {
    const elementary = TECHNIQUES.filter(t => t.stage === '小学');
    expect(elementary.length).toBe(9);
  });

  it('has middle school techniques', () => {
    const middle = TECHNIQUES.filter(t => t.stage === '中学');
    expect(middle.length).toBe(15);
  });

  it('has high school techniques', () => {
    const high = TECHNIQUES.filter(t => t.stage === '高中');
    expect(high.length).toBe(7);
  });
});

describe('getTechniquesByStage', () => {
  it('returns only elementary techniques for 小学', () => {
    const results = getTechniquesByStage('小学');
    expect(results.length).toBe(9);
    results.forEach(t => expect(t.stage).toBe('小学'));
  });

  it('returns only middle school techniques for 中学', () => {
    const results = getTechniquesByStage('中学');
    expect(results.length).toBe(15);
    results.forEach(t => expect(t.stage).toBe('中学'));
  });

  it('returns only high school techniques for 高中', () => {
    const results = getTechniquesByStage('高中');
    expect(results.length).toBe(7);
    results.forEach(t => expect(t.stage).toBe('高中'));
  });
});

describe('getLearningPath', () => {
  it('returns all techniques', () => {
    const path = getLearningPath();
    expect(path.length).toBe(TECHNIQUES.length);
  });

  it('prereqs appear before dependent techniques', () => {
    const path = getLearningPath();
    const positions = new Map<string, number>();
    path.forEach((t, i) => positions.set(t.id, i));

    TECHNIQUES.forEach(t => {
      if (t.prereq) {
        const prereqPos = positions.get(t.prereq)!;
        const currentPos = positions.get(t.id)!;
        expect(prereqPos).toBeLessThan(currentPos);
      }
    });
  });

  it('no duplicate techniques in path', () => {
    const path = getLearningPath();
    const ids = path.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('count appears before addsub which appears before multi', () => {
    const path = getLearningPath();
    const countIdx = path.findIndex(t => t.id === 'count');
    const addsubIdx = path.findIndex(t => t.id === 'addsub');
    const multiIdx = path.findIndex(t => t.id === 'multi');
    expect(countIdx).toBeLessThan(addsubIdx);
    expect(addsubIdx).toBeLessThan(multiIdx);
  });
});

describe('getTechniqueById', () => {
  it('returns technique for valid id', () => {
    const t = getTechniqueById('multi');
    expect(t).toBeDefined();
    expect(t!.id).toBe('multi');
    expect(t!.name).toBe('乘法口诀');
  });

  it('returns undefined for invalid id', () => {
    const t = getTechniqueById('nonexistent');
    expect(t).toBeUndefined();
  });

  it('returns correct technique for each id', () => {
    TECHNIQUES.forEach(t => {
      const found = getTechniqueById(t.id);
      expect(found).toEqual(t);
    });
  });
});

describe('prereq chain integrity', () => {
  it('no circular dependencies', () => {
    const map = new Map(TECHNIQUES.map(t => [t.id, t]));

    TECHNIQUES.forEach(start => {
      const visited = new Set<string>();
      let current: string | null = start.id;
      while (current) {
        expect(visited.has(current)).toBe(false);
        visited.add(current);
        const tech = map.get(current);
        current = tech?.prereq ?? null;
      }
    });
  });

  it('prereq chain forms a valid DAG', () => {
    // Verify getLearningPath() terminates (no infinite loops)
    const path = getLearningPath();
    expect(path.length).toBe(TECHNIQUES.length);
  });
});
