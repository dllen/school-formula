import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ZiGrid } from './ZiGrid';

describe('ZiGrid', () => {
  it('渲染拼音与字，并链到字详情', () => {
    render(
      <MemoryRouter>
        <ZiGrid items={[{ ch: '天', py: 'tiān' }, { ch: '地', py: 'dì' }]} />
      </MemoryRouter>,
    );
    expect(screen.getByText('tiān')).toBeTruthy();
    const link = screen.getByText('天').closest('a');
    expect(decodeURIComponent(link?.getAttribute('href') ?? '')).toBe('/yuwen/char/天');
  });

  it('current 高亮当前字', () => {
    render(
      <MemoryRouter>
        <ZiGrid items={[{ ch: '地' }]} current="地" />
      </MemoryRouter>,
    );
    expect(screen.getByText('地').closest('a')?.className).toContain('zi-cell--current');
  });
});
