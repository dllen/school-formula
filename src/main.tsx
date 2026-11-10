import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { preloadRoute } from './routing/preload'

const container = document.getElementById('root')!

const app = (
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)

const start = () => {
  if (container.hasChildNodes()) hydrateRoot(container, app)
  else createRoot(container).render(app)
}

/**
 * Hydrate straight away on a prerendered page; preload first on a fresh one.
 *
 * The prerendered HTML carries a Suspense boundary — the streaming renderer
 * emits `<!--$-->` … `<!--/$-->` around the lazily-loaded route. React only
 * matches that boundary if the client tree still has an *unresolved* one when
 * hydration starts.
 *
 * Calling `preloadRoute` before hydrating resolved the boundary on the
 * client, so React found a boundary in the server HTML with no counterpart in
 * the client tree and reported a hydration mismatch (#418), throwing the
 * server HTML away. Leaving the route chunk to load on its own keeps the
 * boundary pending for the first render, which is the shape the server sent.
 */
if (container.hasChildNodes()) {
  start()
} else {
  preloadRoute(window.location.pathname).then(start, start)
}
