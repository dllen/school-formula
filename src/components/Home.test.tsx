import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { Home } from './Home';

describe('Home', () => {
    it('renders knowledge-point links in the initial server-rendered HTML so crawlers can discover them', () => {
        const html = renderToString(
            <MemoryRouter>
                <AuthProvider>
                    <Home />
                </AuthProvider>
            </MemoryRouter>,
        );
        expect(html).toMatch(/href="\/knowledge\//);
    });
});
