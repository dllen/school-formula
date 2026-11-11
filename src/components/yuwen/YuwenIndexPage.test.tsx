// src/components/yuwen/YuwenIndexPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenIndexPage } from './YuwenIndexPage';

describe('YuwenIndexPage', () => {
  it('渲染 10 册卡片与工具入口', () => {
    render(
      <MemoryRouter>
        <YuwenIndexPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: '一年级上册' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '五年级下册' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '拼音表' }).getAttribute('href')).toBe('/yuwen/pinyin');
    expect(screen.getByRole('link', { name: '多音字' }).getAttribute('href')).toBe('/yuwen/duoyin');
    expect(screen.getByRole('link', { name: '一年级上册' }).getAttribute('href')).toBe('/yuwen/book/1a');
  });
});
