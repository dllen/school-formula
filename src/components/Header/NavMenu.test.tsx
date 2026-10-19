import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { NavMenu } from './NavMenu';

describe('NavMenu', () => {
    it('exposes a real <a href> for the 教程 menuitem so crawlers can follow it', () => {
        render(
            <MemoryRouter>
                <NavMenu activeView="knowledge" />
            </MemoryRouter>,
        );
        // Hovering the group would also open it via mouse intent, but
        // fireEvent.click matches the keyboard / touch use case the task
        // explicitly asks us to assert.
        fireEvent.click(screen.getByRole('button', { name: /学科学习/ }));
        const tutorialLink = screen.getByRole('menuitem', { name: /教程/ });
        expect(tutorialLink.getAttribute('href')).toBe('/tutorial');
    });
});
