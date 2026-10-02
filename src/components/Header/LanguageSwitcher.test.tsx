import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('links to the English surface', () => {
    render(<LanguageSwitcher />);
    const link = screen.getByRole('link', { name: /english/i });
    expect(link.getAttribute('href')).toBe('/en');
  });
});
