import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { preloadRoute } from './routing/preload';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

async function renderApp(initialEntry: string) {
  await preloadRoute(initialEntry);
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <App />
        <LocationProbe />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('App routes', () => {
  it('serves the knowledge view at /', async () => {
    await renderApp('/');
    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/'));
  });

  it('serves views at their own paths', async () => {
    await renderApp('/mental-math');
    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toBe('/mental-math'),
    );
  });

  it('redirects legacy ?view=practice&kp=p-math-1 to /practice?kp=p-math-1', async () => {
    await renderApp('/?view=practice&kp=p-math-1');
    expect((await screen.findByTestId('location')).textContent).toBe('/practice?kp=p-math-1');
  });

  it('ignores unknown legacy view params', async () => {
    await renderApp('/?view=bogus');
    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/?view=bogus'));
  });

  it('serves the English reference index at /en', async () => {
    await renderApp('/en');
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading.textContent ?? '').toContain('Printable Study Reference');
  });

  it('serves an English category hub at /en/:category', async () => {
    await renderApp('/en/math');
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Math');
  });

  it('serves an English reference chart at /en/:category/:slug', async () => {
    await renderApp('/en/math/multiplication-chart');
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Multiplication Chart (1–12)');
  });
});
