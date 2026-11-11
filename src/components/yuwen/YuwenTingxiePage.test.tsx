// src/components/yuwen/YuwenTingxiePage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenTingxiePage } from './YuwenTingxiePage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/yuwen/tingxie/:bookId/:unitNo" element={<YuwenTingxiePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('YuwenTingxiePage', () => {
  it('默认渲染听写单、答案页与三个选项', () => {
    renderAt('/yuwen/tingxie/1a/1');

    expect(screen.getByRole('heading', { name: '听写单' })).toBeTruthy();
    expect(screen.getByText(/姓名/)).toBeTruthy();
    expect(screen.getByRole('heading', { name: '答案' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '打印' })).toBeTruthy();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(10);
  });

  it('answers=0 时不渲染答案页', () => {
    renderAt('/yuwen/tingxie/1a/1?answers=0');
    expect(screen.queryByRole('heading', { name: '答案' })).toBeNull();
  });

  it('hint=1 时每题带词语提示', () => {
    renderAt('/yuwen/tingxie/1a/1?hint=1');
    expect(screen.getAllByTitle(/^提示：/).length).toBeGreaterThan(0);
  });
});
