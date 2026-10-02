import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ReferenceCategory } from './ReferenceCategory';

function renderHub(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/en/:category" element={<ReferenceCategory />} />
      </Routes>
    </MemoryRouter>,
  );
}

const links = () => screen.getAllByRole('link').map((link) => link.getAttribute('href'));

describe('ReferenceCategory hub', () => {
  it('lists every chart in the category', () => {
    renderHub('/en/math');
    expect(links()).toContain('/en/math/multiplication-chart/');
    expect(links()).toContain('/en/math/metric-conversions/');
    expect(links()).not.toContain('/en/science/physics-constants/');
  });

  it('shows the category name as the page heading and its intro', () => {
    renderHub('/en/math');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Math');
    expect(screen.getByText(/Printable maths reference charts/)).toBeTruthy();
  });

  it('lists the single chart in a sparse category', () => {
    renderHub('/en/english');
    expect(links()).toContain('/en/english/irregular-verbs/');
  });

  it('404s on an unknown category', () => {
    renderHub('/en/legacy');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });
});
