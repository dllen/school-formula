// src/components/SettingsModal.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/ai', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../services/ai')>();
    return { ...actual, getAIConfig: vi.fn(() => null), saveAIConfig: vi.fn() };
});
vi.mock('../context/auth-context', () => ({ useAuth: () => ({ user: null }) }));

import { saveAIConfig } from '../services/ai';
import { SettingsModal } from './SettingsModal';

const renderModal = () => render(<SettingsModal isOpen onClose={() => {}} />);

describe('SettingsModal provider list', () => {
    beforeEach(() => {
        vi.mocked(saveAIConfig).mockClear();
    });

    it('offers Ollama alongside the hosted providers', () => {
        renderModal();
        expect(screen.getByRole('button', { name: /Ollama/ })).toBeTruthy();
    });

    it('shows the API Key field for a hosted provider', () => {
        renderModal();
        expect(screen.getByPlaceholderText('sk-...')).toBeTruthy();
    });
});

describe('SettingsModal with Ollama selected', () => {
    const selectOllama = () => {
        renderModal();
        fireEvent.click(screen.getByRole('button', { name: /Ollama/ }));
    };

    it('replaces the API Key field with the install guide', () => {
        selectOllama();

        expect(screen.queryByPlaceholderText('sk-...')).toBeNull();
        expect(screen.getByText(/brew install ollama/)).toBeTruthy();
    });

    it('prefills the local endpoint and model, and persists them on save', () => {
        selectOllama();

        expect(screen.getByDisplayValue('qwen2.5')).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: '保存配置' }));

        expect(saveAIConfig).toHaveBeenCalledWith(
            expect.objectContaining({
                provider: 'ollama',
                baseUrl: 'http://localhost:11434/v1',
                model: 'qwen2.5',
                apiKey: '',
            }),
        );
    });
});
