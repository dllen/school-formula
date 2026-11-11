// src/components/yuwen/YuwenCharPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));
vi.mock('./BishunSection', () => ({ BishunSection: () => <div data-testid="bishun" /> }));

import { YuwenCharPage } from './YuwenCharPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/yuwen/char/:ch" element={<YuwenCharPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('YuwenCharPage', () => {
  it('渲染读音、同音字、字形与组词', () => {
    renderAt('/yuwen/char/' + encodeURIComponent('地'));

    expect(screen.getByTestId('bishun')).toBeTruthy();
    expect(screen.getByRole('heading', { name: '读音' })).toBeTruthy();
    expect(screen.getByText('dì')).toBeTruthy();
    expect(screen.getByRole('heading', { name: '字形' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '第' }).getAttribute('href')).toBe('/yuwen/char/%E7%AC%AC');
    expect(screen.getByRole('heading', { name: '组词' })).toBeTruthy();
  });

  it('未知字显示空状态', () => {
    renderAt('/yuwen/char/' + encodeURIComponent('齉'));
    expect(screen.getByText('没有这个字。')).toBeTruthy();
  });
});
