import { render } from '@testing-library/react';
import { type ContextType, type ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

// happy-dom refuses to load the external AdSense script, so stub the loader here.
vi.mock('./adsense', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./adsense')>();
  return { ...actual, ensureAdSenseScript: vi.fn() };
});
import { Home } from '../components/Home';
import { KnowledgeDetail } from '../components/KnowledgeDetail';
import { ReferenceIndex } from '../components/reference/ReferenceIndex';
import { ReferencePage } from '../components/reference/ReferencePage';
import { AuthContext } from '../context/auth-context';
import { KNOWLEDGE_DATA } from '../data/knowledge';

type AuthValue = NonNullable<ContextType<typeof AuthContext>>;

const auth: AuthValue = {
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

function renderAt(path: string, routePath: string, element: ReactElement) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={routePath} element={element} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

const adCount = (container: HTMLElement) => container.querySelectorAll('ins.adsbygoogle').length;

describe('ad placements', () => {
  it('shows no ads on the home page', () => {
    const { container } = renderAt('/', '/', <Home />);
    expect(adCount(container)).toBe(0);
  });

  it('shows no ads on the English reference index', () => {
    const { container } = renderAt('/en', '/en', <ReferenceIndex />);
    expect(adCount(container)).toBe(0);
  });

  it('shows one ad on an English reference chart', () => {
    const { container } = renderAt('/en/reference/multiplication-chart', '/en/reference/:slug', <ReferencePage />);
    expect(adCount(container)).toBe(1);
  });

  it('shows two ads on a knowledge detail page', () => {
    const id = KNOWLEDGE_DATA[0].subjects[0].knowledgePoints[0].id;
    const { container } = renderAt(`/knowledge/${id}`, '/knowledge/:id', <KnowledgeDetail />);
    expect(adCount(container)).toBe(2);
  });
});
