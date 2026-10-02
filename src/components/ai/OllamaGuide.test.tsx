// src/components/ai/OllamaGuide.test.tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SITE } from '../../seo/site';
import { OllamaGuide } from './OllamaGuide';

describe('OllamaGuide', () => {
    it('walks through install, pull, cross-origin and serve in order', () => {
        render(<OllamaGuide model="qwen2.5" />);

        // 限定在有序列表内，否则 "ollama serve" 会同时命中常见报错里的说明文字。
        const steps = within(screen.getByRole('list')).getAllByRole('listitem');
        expect(steps).toHaveLength(4);

        const text = steps.map((step) => step.textContent ?? '');
        expect(text[0]).toContain('brew install ollama');
        expect(text[1]).toContain('ollama pull qwen2.5');
        expect(text[2]).toContain('OLLAMA_ORIGINS=');
        expect(text[3]).toContain('ollama serve');
    });

    it('spells out the OLLAMA_ORIGINS value, tied to the real site origin', () => {
        render(<OllamaGuide model="qwen2.5" />);

        const origins = screen.getByText(/OLLAMA_ORIGINS=/);
        expect(origins.textContent).toContain('http://localhost:5173');
        expect(origins.textContent).toContain(SITE.origin);
    });

    it('explains why cross-origin is needed rather than only what to type', () => {
        render(<OllamaGuide model="qwen2.5" />);

        // Ollama 默认只放行 127.0.0.1 与 0.0.0.0——不说这句，用户不知道为什么必须加这一行。
        expect(screen.getByText(/127\.0\.0\.1/)).toBeTruthy();
    });

    it('follows the model currently configured instead of hardcoding one', () => {
        render(<OllamaGuide model="llama3.2" />);

        expect(screen.getByText(/ollama pull llama3\.2/)).toBeTruthy();
        expect(screen.queryByText(/qwen2\.5/)).toBeNull();
    });

    it('maps the failure the browser reports to what the user should check', () => {
        render(<OllamaGuide model="qwen2.5" />);

        expect(screen.getByText(/Failed to fetch/)).toBeTruthy();
        expect(screen.getByText(/not found/)).toBeTruthy();
    });
});
