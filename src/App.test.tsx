import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

function renderApp(initialEntry: string) {
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
  it('serves the knowledge view at /', () => {
    renderApp('/');
    expect(screen.getByTestId('location').textContent).toBe('/');
  });

  it('serves views at their own paths', () => {
    renderApp('/mental-math');
    expect(screen.getByTestId('location').textContent).toBe('/mental-math');
  });

  it('redirects legacy ?view=practice&kp=p-math-1 to /practice?kp=p-math-1', async () => {
    renderApp('/?view=practice&kp=p-math-1');
    expect((await screen.findByTestId('location')).textContent).toBe('/practice?kp=p-math-1');
  });

  it('ignores unknown legacy view params', () => {
    renderApp('/?view=bogus');
    expect(screen.getByTestId('location').textContent).toBe('/?view=bogus');
  });

  it('serves the English reference index at /en', () => {
    renderApp('/en');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Printable Study Reference');
  });

  it('serves an English reference chart at /en/reference/:slug', () => {
    renderApp('/en/reference/multiplication-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Multiplication Chart');
  });
});
