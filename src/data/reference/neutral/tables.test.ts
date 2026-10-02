import { describe, expect, it } from 'vitest';
import { multiplicationRows, squaresCubesRootsRows } from './tables';

describe('multiplicationRows', () => {
  it('returns a labelled grid of products with no header row', () => {
    const rows = multiplicationRows(12);
    expect(rows).toHaveLength(12);
    expect(rows[0]).toHaveLength(13);
    expect(rows[0][0]).toBe('1');
    expect(rows[11][12]).toBe('144');
  });

  it('satisfies the product invariant at every cell', () => {
    const rows = multiplicationRows(12);
    for (let row = 0; row < 12; row++) {
      expect(rows[row][0]).toBe(String(row + 1));
      for (let col = 0; col < 12; col++) {
        expect(Number(rows[row][col + 1])).toBe((row + 1) * (col + 1));
      }
    }
  });

  it('honours a custom maximum', () => {
    expect(multiplicationRows(3)).toEqual([
      ['1', '1', '2', '3'],
      ['2', '2', '4', '6'],
      ['3', '3', '6', '9'],
    ]);
  });
});

describe('squaresCubesRootsRows', () => {
  it('returns n, n², n³, √n for n from 1 to 20', () => {
    const rows = squaresCubesRootsRows(20);
    expect(rows).toHaveLength(20);
    expect(rows[0]).toEqual(['1', '1', '1', '1']);
    expect(rows[19][0]).toBe('20');
  });

  it('satisfies the square and cube invariants', () => {
    for (const [index, row] of squaresCubesRootsRows(20).entries()) {
      const n = index + 1;
      expect(Number(row[1])).toBe(n * n);
      expect(Number(row[2])).toBe(n ** 3);
    }
  });

  it('rounds roots to three decimals and leaves perfect squares exact', () => {
    const rows = squaresCubesRootsRows(20);
    expect(rows[1][3]).toBe('1.414');
    expect(rows[3][3]).toBe('2');
  });

  it('squares back to n for every perfect square in range', () => {
    for (const row of squaresCubesRootsRows(20)) {
      const root = Number(row[3]);
      if (Number.isInteger(root)) expect(root * root).toBe(Number(row[0]));
    }
  });
});
