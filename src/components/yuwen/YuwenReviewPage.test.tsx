// src/components/yuwen/YuwenReviewPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenReviewPage } from './YuwenReviewPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/yuwen/review/:bookId/:unitNo" element={<YuwenReviewPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('YuwenReviewPage', () => {
  it('按课分组渲染生字，并给出听写单入口', () => {
    renderAt('/yuwen/review/1a/1');

    expect(screen.getByRole('heading', { name: '生字复习' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '打印听写单' }).getAttribute('href')).toBe('/yuwen/tingxie/1a/1');
    expect(screen.getAllByRole('link', { name: '识字1：天地人' }).length).toBeGreaterThan(0);
  });

  it('未知单元显示空状态', () => {
    renderAt('/yuwen/review/1a/99');
    expect(screen.getByText('没有这个单元。')).toBeTruthy();
  });
});
