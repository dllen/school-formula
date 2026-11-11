// src/components/yuwen/YuwenLessonPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenLessonPage } from './YuwenLessonPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/yuwen/lesson/:lessonId" element={<YuwenLessonPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('YuwenLessonPage', () => {
  it('渲染本课生字、听写单入口与上一课/下一课', () => {
    renderAt('/yuwen/lesson/G1A01');

    expect(screen.getByRole('heading', { name: '识字1：天地人' })).toBeTruthy();
    expect(screen.getByText('tiān')).toBeTruthy();
    // 「天」在田字格与组词 chip 各渲染一次，getByText 会多匹配；只调整定位方式。
    expect(screen.getAllByText('天').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: '听写单' }).getAttribute('href')).toBe('/yuwen/tingxie/1a/1');
    expect(screen.getByRole('link', { name: /下一课/ }).getAttribute('href')).toBe('/yuwen/lesson/G1A02');
  });

  it('未知课显示空状态', () => {
    renderAt('/yuwen/lesson/NOPE');
    expect(screen.getByText('没有这一课。')).toBeTruthy();
  });
});
