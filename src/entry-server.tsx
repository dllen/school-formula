import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { preloadRoute } from './routing/preload';

/**
 * Render one route to HTML.
 *
 * `renderToString`, not `renderToStaticMarkup`: the streaming renderer wraps
 * its output in Suspense boundary comments (`<!--$-->` … `<!--/$-->`). The
 * client's tree still has an unresolved Suspense boundary at hydration time
 * (see src/main.tsx), so those markers are what it expects to find.
 */
export async function render(url: string): Promise<string> {
  await preloadRoute(url);
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StaticRouter>
    </StrictMode>,
  );
}
