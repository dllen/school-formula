// src/components/yuwen/YuwenBookPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenBookPage } from './YuwenBookPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/yuwen/book/:bookId" element={<YuwenBookPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('YuwenBookPage', () => {
  it('渲染单元、课文与两个入口', () => {
    renderAt('/yuwen/book/1a');
    expect(screen.getByRole('heading', { name: '一年级上册' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '第 1 单元' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /识字1：天地人/ }).getAttribute('href')).toBe('/yuwen/lesson/G1A01');
    // 每单元都有这两个入口：取第一个（即第 1 单元），断言意图不变。
    expect(screen.getAllByRole('link', { name: '生字复习' })[0].getAttribute('href')).toBe('/yuwen/review/1a/1');
    expect(screen.getAllByRole('link', { name: '听写单' })[0].getAttribute('href')).toBe('/yuwen/tingxie/1a/1');
  });

  it('未知册显示空状态', () => {
    renderAt('/yuwen/book/9z');
    expect(screen.getByText('没有这册课本。')).toBeTruthy();
  });
});
