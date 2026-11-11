// src/components/yuwen/YuwenPinyin.page.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenPinyinIndexPage } from './YuwenPinyinIndexPage';
import { YuwenPinyinStemPage } from './YuwenPinyinStemPage';

describe('拼音表', () => {
  it('索引页列出全部韵母入口', () => {
    render(
      <MemoryRouter>
        <YuwenPinyinIndexPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: '拼音表' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'a' }).getAttribute('href')).toBe('/yuwen/pinyin/a');
    expect(screen.getAllByRole('link').length).toBeGreaterThan(300);
  });

  it('韵母页按声调分行并链到单字', () => {
    render(
      <MemoryRouter initialEntries={['/yuwen/pinyin/a']}>
        <Routes>
          <Route path="/yuwen/pinyin/:stem" element={<YuwenPinyinStemPage />} />
        </Routes>
      </MemoryRouter>,
    );
    // 声调行里也有一个 h2 名为 'a'，这里用 level 1 精确定位页面标题。
    expect(screen.getByRole('heading', { name: 'a', level: 1 })).toBeTruthy();
    expect(screen.getByText('ā')).toBeTruthy();
    expect(screen.getByRole('link', { name: '阿' }).getAttribute('href')).toBe('/yuwen/char/%E9%98%BF');
  });
});
