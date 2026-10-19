import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
    it('renders at least 5 crawlable footer links', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>,
        );
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThanOrEqual(5);
    });

    it('links to the HTML sitemap so crawlers can discover every page', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>,
        );
        const sitemapLink = screen.getByRole('link', { name: /站点地图/ });
        expect(sitemapLink.getAttribute('href')).toBe('/sitemap');
    });

    it('links to the privacy policy page', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>,
        );
        const privacyLink = screen.getByRole('link', { name: /隐私政策/ });
        expect(privacyLink.getAttribute('href')).toBe('/privacy');
    });
});
