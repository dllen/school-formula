import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LegalPage } from './LegalPage';

describe('LegalPage', () => {
  it('renders the privacy policy', () => {
    render(
      <MemoryRouter initialEntries={['/privacy']}>
        <LegalPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1, name: '隐私政策' })).toBeTruthy();
    expect(screen.getAllByText(/support@syy\.global/).length).toBeGreaterThan(0);
  });
});
