import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ReferenceIndex } from './ReferenceIndex';

function renderIndex() {
  return render(
    <MemoryRouter>
      <ReferenceIndex />
    </MemoryRouter>,
  );
}

const links = () => screen.getAllByRole('link').map((link) => link.getAttribute('href'));

describe('ReferenceIndex', () => {
  it('links to each of the three category hubs', () => {
    renderIndex();
    expect(links()).toContain('/en/math/');
    expect(links()).toContain('/en/science/');
    expect(links()).toContain('/en/english/');
  });

  it('does not list individual charts', () => {
    renderIndex();
    expect(links()).not.toContain('/en/math/multiplication-chart/');
  });

  it('keeps a landing heading and intro', () => {
    renderIndex();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Printable Study Reference');
    expect(screen.getByText(/Free, printable reference charts for students/)).toBeTruthy();
  });
});
