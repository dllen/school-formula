// src/components/yuwen/YuwenDuoyinPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenDuoyinPage } from './YuwenDuoyinPage';

describe('YuwenDuoyinPage', () => {
  it('列出多音字与各读音的词', () => {
    render(
      <MemoryRouter>
        <YuwenDuoyinPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: '多音字' })).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(100);
    expect(screen.getAllByText('地方').length).toBeGreaterThan(0);
  });
});
