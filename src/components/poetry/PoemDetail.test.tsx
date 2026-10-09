import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PoemDetail } from './PoemDetail';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/poetry/:id" element={<PoemDetail />} />
        <Route path="/poetry" element={<div>列表</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PoemDetail', () => {
  it('renders poem by URL param id', () => {
    renderAt('/poetry/primary-tang-jing-ye-si');
    expect(screen.getByRole('heading', { level: 1, name: '静夜思' })).toBeTruthy();
    expect(screen.getByText('床前明月光')).toBeTruthy();
  });

  it('shows not-found state for unknown id', () => {
    renderAt('/poetry/does-not-exist');
    expect(screen.getByText(/未找到/)).toBeTruthy();
    expect(screen.getByText('返回诗词列表')).toBeTruthy();
  });

  it('toggles pinyin visibility', () => {
    renderAt('/poetry/primary-tang-jing-ye-si');
    expect(screen.getByText('chuáng qián míng yuè guāng')).toBeTruthy();
    const toggle = screen.getByRole('button', { name: '隐藏拼音' });
    void toggle;
  });

  it('shows cipai for song poems', () => {
    renderAt('/poetry/middle-song-ru-meng-ling-chang-ji-xi-ting');
    expect(screen.getByText('如梦令')).toBeTruthy();
  });
});