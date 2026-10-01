import { afterEach, describe, expect, it, vi } from 'vitest';
import { storageGet, storageRemove, storageSet } from './storage';

describe('storage helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('round-trips values when localStorage is available', () => {
    storageSet('k', 'v');
    expect(storageGet('k')).toBe('v');
    storageRemove('k');
    expect(storageGet('k')).toBeNull();
  });

  it('returns null and never throws when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(storageGet('k')).toBeNull();
    expect(() => storageSet('k', 'v')).not.toThrow();
    expect(() => storageRemove('k')).not.toThrow();
  });

  it('returns null when localStorage throws (privacy mode)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    expect(storageGet('k')).toBeNull();
  });
});
