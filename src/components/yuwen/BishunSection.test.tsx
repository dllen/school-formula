// src/components/yuwen/BishunSection.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('hanzi-writer', () => ({
  default: {
    loadCharacterData: async () => ({ strokes: ['M0 0', 'M1 1'] }),
    create: () => ({}),
  },
}));

import { BishunSection } from './BishunSection';

describe('BishunSection', () => {
  it('数据到达后渲染画数与逐笔小格', async () => {
    render(<BishunSection ch="地" />);
    expect(await screen.findByText('共 2 画')).toBeTruthy();
    expect(screen.getAllByTitle(/第 \d 笔/)).toHaveLength(2);
  });
});
