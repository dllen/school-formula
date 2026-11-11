// src/components/yuwen/WordList.test.tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WordList } from './WordList';
import { CharChips } from './CharChips';

describe('WordList', () => {
  it('渲染词语；空数组显示占位文案', () => {
    const { rerender } = render(<WordList words={['天天', '天地']} />);
    expect(screen.getByText('天天')).toBeTruthy();
    expect(screen.getByText('天地')).toBeTruthy();

    rerender(<WordList words={[]} />);
    expect(screen.getByText('暂无组词')).toBeTruthy();
  });
});

describe('CharChips', () => {
  it('渲染同音字链接并高亮当前字', () => {
    render(
      <MemoryRouter>
        <CharChips chars={['弟', '第']} current="第" />
      </MemoryRouter>,
    );
    const current = screen.getByText('第').closest('a');
    expect(current?.className).toContain('chip--current');
    expect(decodeURIComponent(screen.getByText('弟').closest('a')?.getAttribute('href') ?? '')).toBe(
      '/yuwen/char/弟',
    );
  });
});
