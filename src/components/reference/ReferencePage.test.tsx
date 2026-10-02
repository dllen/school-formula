import { render, screen } from '@testing-library/react';
import type { ContextType } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../context/auth-context';
import { ReferencePage } from './ReferencePage';

// happy-dom 拒绝加载外部 AdSense 脚本，这里把加载器打桩。
vi.mock('../../ads/adsense', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../ads/adsense')>();
  return { ...actual, ensureAdSenseScript: vi.fn() };
});

const auth: NonNullable<ContextType<typeof AuthContext>> = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  logout: () => {},
  refreshUser: async () => {},
};

function renderChart(url: string) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/en/reference/:slug" element={<ReferencePage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('ReferencePage', () => {
  it('renders the chart title, intro and table', () => {
    renderChart('/en/reference/multiplication-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Multiplication Chart (1–12)',
    );
    expect(screen.getByText(/puts every times table on a single grid/)).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: '×' })).toBeTruthy();
  });

  it('renders the how-to-use steps and the FAQ', () => {
    renderChart('/en/reference/multiplication-chart');
    expect(screen.getByText(/Put one finger on the row/)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Frequently asked questions' })).toBeTruthy();
    expect(screen.getByText('What is a multiplication chart?')).toBeTruthy();
  });

  it('links to the related charts', () => {
    renderChart('/en/reference/multiplication-chart');
    const heading = screen.getByRole('heading', { name: 'Related charts' });
    const section = heading.closest('section');
    expect(section?.querySelector('a[href="/en/reference/squares-cubes-roots/"]')).toBeTruthy();
  });

  it('renders formula groups for the identities chart', () => {
    renderChart('/en/reference/trigonometric-identities');
    expect(screen.getByText('Pythagorean')).toBeTruthy();
    expect(screen.getByText('sin²θ + cos²θ = 1')).toBeTruthy();
  });

  it('omits the related section when a chart has no siblings', () => {
    renderChart('/en/reference/irregular-verbs');
    expect(screen.queryByRole('heading', { name: 'Related charts' })).toBeNull();
  });

  it('404s on an unknown slug', () => {
    renderChart('/en/reference/no-such-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });
});
