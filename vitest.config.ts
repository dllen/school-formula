import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/',
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8787',
                changeOrigin: true,
            },
        },
    },
    test: {
        // Two workspaces because src/** tests need a DOM (localStorage/window),
        // while scripts/** tests are Node CLIs that read import.meta.url.
        projects: [
            {
                extends: true,
                test: {
                    name: 'app',
                    environment: 'happy-dom',
                    setupFiles: ['./src/test-setup.ts'],
                    include: ['src/**/*.{test,spec}.{ts,tsx}'],
                    exclude: ['node_modules', 'dist'],
                },
            },
            {
                extends: true,
                test: {
                    name: 'scripts',
                    environment: 'node',
                    include: ['scripts/**/*.{test,spec}.ts', 'worker/**/*.test.ts'],
                    exclude: ['node_modules', 'dist', 'scripts/*/node_modules/**'],
                },
            },
        ],
    },
});
