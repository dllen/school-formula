import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    getStore: () => store,
    reset: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

// Import after mock is set up
const {
  loadProgress,
  saveProgress,
  recordAttempt,
  isTechniqueUnlocked,
  getWeakTechniques,
  getReviewTechniques,
} = await import('./progress');

const STORAGE_KEY = 'math_mastery_progress';

beforeEach(() => {
  localStorageMock.reset();
  vi.clearAllMocks();
});

describe('loadProgress', () => {
  it('returns default progress when localStorage is empty', () => {
    const progress = loadProgress();
    expect(progress).toEqual({ records: {}, completedTechniques: [] });
  });

  it('loads saved progress from localStorage', () => {
    const saved = {
      records: {
        multi: {
          techniqueId: 'multi',
          totalAttempts: 10,
          correctCount: 8,
          lastPracticedAt: 1000000,
          weakPoints: [],
        },
      },
      completedTechniques: ['count'],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    const progress = loadProgress();
    expect(progress).toEqual(saved);
  });

  it('returns default on corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json{{{');
    const progress = loadProgress();
    expect(progress).toEqual({ records: {}, completedTechniques: [] });
  });
});

describe('saveProgress', () => {
  it('saves progress to localStorage', () => {
    const progress = {
      records: {
        multi: {
          techniqueId: 'multi',
          totalAttempts: 5,
          correctCount: 4,
          lastPracticedAt: 1234567,
          weakPoints: [],
        },
      },
      completedTechniques: [],
    };

    saveProgress(progress);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(progress)
    );
  });
});

describe('recordAttempt', () => {
  it('creates a new record for first attempt', () => {
    const progress = recordAttempt('multi', true, '乘法口诀');
    expect(progress.records.multi).toBeDefined();
    expect(progress.records.multi.totalAttempts).toBe(1);
    expect(progress.records.multi.correctCount).toBe(1);
  });

  it('increments totalAttempts on each call', () => {
    recordAttempt('multi', true, '乘法口诀');
    recordAttempt('multi', true, '乘法口诀');
    const progress = recordAttempt('multi', false, '乘法口诀');
    expect(progress.records.multi.totalAttempts).toBe(3);
  });

  it('increments correctCount only on correct answers', () => {
    recordAttempt('multi', true, '乘法口诀');
    recordAttempt('multi', false, '乘法口诀');
    const progress = recordAttempt('multi', true, '乘法口诀');
    expect(progress.records.multi.correctCount).toBe(2);
  });

  it('adds weak point on incorrect answer', () => {
    const progress = recordAttempt('multi', false, '七八五十六');
    expect(progress.records.multi.weakPoints).toContain('七八五十六');
  });

  it('does not add weak point on correct answer', () => {
    const progress = recordAttempt('multi', true, '乘法口诀');
    expect(progress.records.multi.weakPoints).toEqual([]);
  });

  it('does not duplicate weak points', () => {
    recordAttempt('multi', false, '六七四十二');
    const progress = recordAttempt('multi', false, '六七四十二');
    expect(progress.records.multi.weakPoints).toEqual(['六七四十二']);
  });

  it('marks technique as completed when accuracy >= 80% with >= 5 attempts', () => {
    // 5 correct out of 5 = 100%
    for (let i = 0; i < 5; i++) {
      recordAttempt('multi', true, '乘法口诀');
    }
    const progress = loadProgress();
    expect(progress.completedTechniques).toContain('multi');
  });

  it('does not mark as completed with < 5 attempts', () => {
    // 4 correct out of 4 = 100% but only 4 attempts
    for (let i = 0; i < 4; i++) {
      recordAttempt('multi', true, '乘法口诀');
    }
    const progress = loadProgress();
    expect(progress.completedTechniques).not.toContain('multi');
  });

  it('does not mark as completed when accuracy < 80%', () => {
    // 3 correct out of 5 = 60%
    recordAttempt('multi', true, '乘法口诀');
    recordAttempt('multi', true, '乘法口诀');
    recordAttempt('multi', true, '乘法口诀');
    recordAttempt('multi', false, '乘法口诀');
    recordAttempt('multi', false, '乘法口诀');
    const progress = loadProgress();
    expect(progress.completedTechniques).not.toContain('multi');
  });

  it('updates lastPracticedAt timestamp', () => {
    const before = Date.now();
    const progress = recordAttempt('multi', true, '乘法口诀');
    expect(progress.records.multi.lastPracticedAt).toBeGreaterThanOrEqual(before);
  });
});

describe('isTechniqueUnlocked', () => {
  const techniques = [
    { id: 'count', prereq: null },
    { id: 'addsub', prereq: 'count' },
    { id: 'multi', prereq: 'addsub' },
  ];

  it('returns true for techniques with no prereq', () => {
    expect(isTechniqueUnlocked('count', techniques)).toBe(true);
  });

  it('returns true when prereq is completed', () => {
    // Complete 'count'
    for (let i = 0; i < 5; i++) {
      recordAttempt('count', true, '数数');
    }
    expect(isTechniqueUnlocked('addsub', techniques)).toBe(true);
  });

  it('returns false when prereq is not completed', () => {
    expect(isTechniqueUnlocked('addsub', techniques)).toBe(false);
  });

  it('returns false when prereq is partially completed', () => {
    // Only 3 correct out of 3 = 100% but < 5 attempts
    for (let i = 0; i < 3; i++) {
      recordAttempt('count', true, '数数');
    }
    expect(isTechniqueUnlocked('addsub', techniques)).toBe(false);
  });

  it('returns true for unknown technique', () => {
    expect(isTechniqueUnlocked('unknown', techniques)).toBe(true);
  });
});

describe('getWeakTechniques', () => {
  it('returns empty array when no records', () => {
    expect(getWeakTechniques()).toEqual([]);
  });

  it('returns techniques with accuracy < 60%', () => {
    // 2 correct out of 5 = 40%
    recordAttempt('multi', true, '乘法口诀');
    recordAttempt('multi', true, '乘法口诀');
    recordAttempt('multi', false, '乘法口诀');
    recordAttempt('multi', false, '乘法口诀');
    recordAttempt('multi', false, '乘法口诀');

    expect(getWeakTechniques()).toContain('multi');
  });

  it('does not return techniques with accuracy >= 60%', () => {
    // 3 correct out of 5 = 60%
    recordAttempt('addsub', true, '加减法');
    recordAttempt('addsub', true, '加减法');
    recordAttempt('addsub', true, '加减法');
    recordAttempt('addsub', false, '加减法');
    recordAttempt('addsub', false, '加减法');

    expect(getWeakTechniques()).not.toContain('addsub');
  });
});

describe('getReviewTechniques', () => {
  it('returns empty array when no records', () => {
    expect(getReviewTechniques()).toEqual([]);
  });

  it('returns techniques not practiced in 3+ days', () => {
    // Simulate an old record by manipulating localStorage directly
    const oldTime = Date.now() - (4 * 24 * 60 * 60 * 1000); // 4 days ago
    const progress = {
      records: {
        multi: {
          techniqueId: 'multi',
          totalAttempts: 5,
          correctCount: 4,
          lastPracticedAt: oldTime,
          weakPoints: [],
        },
      },
      completedTechniques: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

    expect(getReviewTechniques()).toContain('multi');
  });

  it('does not return recently practiced techniques', () => {
    recordAttempt('multi', true, '乘法口诀');
    expect(getReviewTechniques()).not.toContain('multi');
  });
});
