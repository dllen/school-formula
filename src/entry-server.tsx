import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { preloadRoute } from './routing/preload';

export async function render(url: string): Promise<string> {
  await preloadRoute(url);
  return renderToString(
    <StaticRouter location={url}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StaticRouter>,
  );
}
