// src/App.yuwen.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('./components/Header', () => ({ Header: () => <div /> }));
vi.mock('./components/Footer', () => ({ Footer: () => <div /> }));
vi.mock('hanzi-writer', () => ({
  default: { loadCharacterData: async () => ({ strokes: [] }), create: () => ({}) },
}));

import App from './App';

const YUWEN_ROUTES = [
  '/yuwen',
  '/yuwen/book/1a',
  '/yuwen/lesson/G1A01',
  '/yuwen/review/1a/1',
  '/yuwen/tingxie/1a/1',
  '/yuwen/char/' + encodeURIComponent('地'),
  '/yuwen/pinyin',
  '/yuwen/pinyin/a',
  '/yuwen/duoyin',
];

describe('App yuwen 路由', () => {
  it('9 类路径都能渲染出 main 区域', async () => {
    for (const path of YUWEN_ROUTES) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
      );
      expect(await screen.findByRole('main')).toBeTruthy();
      unmount();
    }
  });
});
