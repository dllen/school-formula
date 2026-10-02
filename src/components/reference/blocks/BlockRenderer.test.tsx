import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Block } from '../../../data/reference/types';
import { BlockRenderer } from './BlockRenderer';

describe('BlockRenderer', () => {
  it('renders a table block with headers and rows', () => {
    const block: Block = { kind: 'table', headers: ['×', '1'], rows: [['7', '8']] };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.getByRole('columnheader', { name: '×' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '7' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '8' })).toBeTruthy();
  });

  it('renders a table block without headers', () => {
    const block: Block = { kind: 'table', rows: [['only-cell']] };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.queryByRole('columnheader')).toBeNull();
    expect(screen.getByRole('cell', { name: 'only-cell' })).toBeTruthy();
  });

  it('renders a table caption when present', () => {
    const block: Block = { kind: 'table', rows: [['1']], caption: 'Rounded to 3 decimals' };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.getByText('Rounded to 3 decimals')).toBeTruthy();
  });

  it('renders formula groups with and without a label', () => {
    const block: Block = {
      kind: 'formulas',
      groups: [{ label: 'Pythagorean', items: ['sin²θ + cos²θ = 1'] }, { items: ['bare-item'] }],
    };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.getByText('Pythagorean')).toBeTruthy();
    expect(screen.getByText('sin²θ + cos²θ = 1')).toBeTruthy();
    expect(screen.getByText('bare-item')).toBeTruthy();
  });

  it('renders a diagram block by injecting its svg', () => {
    const block: Block = {
      kind: 'diagram',
      svg: '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>',
      caption: 'Unit circle',
    };
    const { container } = render(<BlockRenderer blocks={[block]} />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.innerHTML).toContain('<circle');
    expect(screen.getByText('Unit circle')).toBeTruthy();
  });

  it('renders multiple blocks in order', () => {
    const blocks: Block[] = [
      { kind: 'table', rows: [['first-table']] },
      { kind: 'formulas', groups: [{ items: ['second-formulas'] }] },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    const text = container.textContent ?? '';
    expect(text.indexOf('first-table')).toBeLessThan(text.indexOf('second-formulas'));
  });

  it('renders nothing for an empty block list', () => {
    const { container } = render(<BlockRenderer blocks={[]} />);
    expect(container.textContent).toBe('');
  });
});
