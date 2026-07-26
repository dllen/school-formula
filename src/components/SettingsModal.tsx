import React, { useState } from 'react';
import { getAIConfig, saveAIConfig, PROVIDER_DEFAULTS } from '../services/ai';
import type { AIConfig } from '../services/ai';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [config, setConfig] = useState<AIConfig>(() => {
        const saved = getAIConfig();
        return saved ?? {
            provider: 'openai',
            apiKey: '',
            baseUrl: PROVIDER_DEFAULTS.openai.baseUrl || '',
            model: PROVIDER_DEFAULTS.openai.model || ''
        };
    });

    const handleProviderChange = (provider: AIConfig['provider']) => {
        const defaults = PROVIDER_DEFAULTS[provider];
        setConfig(prev => ({
            ...prev,
            provider,
            baseUrl: defaults.baseUrl || '',
            model: defaults.model || ''
        }));
    };

    const handleSave = () => {
        saveAIConfig(config);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">AI 设置</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Provider Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">服务提供商</label>
                        <div className="grid grid-cols-2 gap-3">
                            {(['openai', 'deepseek', 'zhipu', 'custom'] as const).map(p => (
                                <button
                                    key={p}
                                    onClick={() => handleProviderChange(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${config.provider === p
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {p === 'openai' && 'OpenAI'}
                                    {p === 'deepseek' && 'DeepSeek'}
                                    {p === 'zhipu' && '智谱 AI'}
                                    {p === 'custom' && '自定义'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                            <input
                                type="password"
                                value={config.apiKey}
                                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="sk-..."
                            />
                            {config.provider === 'openai' && (
                                <p className="mt-1 text-xs text-gray-400">
                                    获取密钥：<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">OpenAI Platform</a>
                                </p>
                            )}
                            {config.provider === 'deepseek' && (
                                <p className="mt-1 text-xs text-gray-400">
                                    获取密钥：<a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">DeepSeek Platform</a>
                                </p>
                            )}
                            {config.provider === 'zhipu' && (
                                <p className="mt-1 text-xs text-gray-400">
                                    获取密钥：<a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">智谱AI开放平台</a>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
                            <input
                                type="text"
                                value={config.baseUrl}
                                onChange={e => setConfig({ ...config, baseUrl: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="https://api.openai.com/v1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">模型名称</label>
                            <input
                                type="text"
                                value={config.model}
                                onChange={e => setConfig({ ...config, model: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="gpt-4o"
                            />
                        </div>
                    </div>

                    <div className="pt-4 text-xs text-gray-400">
                        <p>说明：您的 API Key 仅存储在本地浏览器中，不会发送到任何服务器。</p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                    >
                        保存配置
                    </button>
                </div>
            </div>
        </div>
    );
};
