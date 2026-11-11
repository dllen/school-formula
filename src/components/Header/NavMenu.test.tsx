import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavMenu } from './NavMenu';

function renderMenu(path: string, activeView: 'knowledge' | null) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NavMenu activeView={activeView} />
    </MemoryRouter>,
  );
}

describe('NavMenu', () => {
  it('工具速查分组里有小学语文入口，指向 /yuwen', () => {
    renderMenu('/', 'knowledge');
    fireEvent.click(screen.getByRole('button', { name: /工具速查/ }));
    const link = screen.getByRole('menuitem', { name: '小学语文' });
    expect(link.getAttribute('href')).toBe('/yuwen');
  });

  it('在 /yuwen 上该分组高亮', () => {
    renderMenu('/yuwen/char/天', null);
    expect(screen.getByRole('button', { name: /工具速查/ }).getAttribute('data-active')).toBe('true');
  });

  it('在 /yuwen 上小学语文条目自身高亮', () => {
    renderMenu('/yuwen', null);
    fireEvent.click(screen.getByRole('button', { name: /工具速查/ }));
    expect(screen.getByRole('menuitem', { name: '小学语文' }).getAttribute('data-active')).toBe('true');
  });

  it('exposes a real <a href> for the 教程 menuitem so crawlers can follow it', () => {
    renderMenu('/', 'knowledge');
    fireEvent.click(screen.getByRole('button', { name: /学科学习/ }));
    const tutorialLink = screen.getByRole('menuitem', { name: /教程/ });
    expect(tutorialLink.getAttribute('href')).toBe('/tutorial');
  });
});
