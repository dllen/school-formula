import React, { useState } from 'react';
import { getAIConfig, saveAIConfig, PROVIDER_DEFAULTS } from '../services/ai';
import { useAuth } from '../context/auth-context';
import type { AIConfig } from '../services/ai';
import { OllamaGuide } from './ai/OllamaGuide';

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

    const { user } = useAuth();
    const isVip = user?.tier === 'plus' || user?.tier === 'pro';

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

    // Ollama 跑在本机、不校验密钥，所以不显示 API Key 输入框；引导里的模型名跟随用户当前填写。
    const showApiKeyField = config.provider !== 'gateway' && config.provider !== 'ollama';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
            <div className="bg-white rounded-[12px] shadow-pop w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-[divider] flex justify-between items-center bg-[paper-2]">
                    <h2 className="text-[18px] font-semibold text-[ink]">AI 设置</h2>
                    <button onClick={onClose} className="text-[ink-3] hover:text-[ink] transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {isVip && config.provider !== 'gateway' && (
                        <div className="rounded-lg bg-warning-bg border border-warning-bg px-4 py-3 text-sm text-warning-ink">
                            您已是 VIP 会员，推荐切换到「Cloudflare 网关（VIP）」模式，无需配置 API Key。
                        </div>
                    )}
                    {/* Provider Selection */}
                    <div>
                        <label className="block text-[14px] font-medium text-[ink] mb-2">服务提供商</label>
                        <div className="grid grid-cols-2 gap-3">
                            {(['openai', 'deepseek', 'zhipu', 'ollama', 'custom', 'gateway'] as const).map(p => (
                                <button
                                    key={p}
                                    onClick={() => handleProviderChange(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${config.provider === p
                                        ? 'bg-[accent-soft] border-[accent] text-[accent]'
                                        : 'bg-white border-[rule] text-[ink-2] hover:border-[accent]'
                                        }`}
                                >
                                    {p === 'openai' && 'OpenAI'}
                                    {p === 'deepseek' && 'DeepSeek'}
                                    {p === 'zhipu' && '智谱 AI'}
                                    {p === 'ollama' && 'Ollama（本地）'}
                                    {p === 'custom' && '自定义'}
                                    {p === 'gateway' && 'Cloudflare 网关（VIP）'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {showApiKeyField && (
                        <div>
                            <label className="block text-[14px] font-medium text-[ink] mb-1">API Key</label>
                            <input
                                type="password"
                                value={config.apiKey}
                                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                                className="w-full px-3 py-2 rounded-[6px] border border-[rule] focus:border-[accent] focus:ring-2 focus:ring-[accent-soft] outline-none transition-colors text-[14px]"
                                placeholder="sk-..."
                            />
                            {config.provider === 'openai' && (
                                <p className="mt-1 text-xs text-ink-3">
                                    获取密钥：<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover">OpenAI Platform</a>
                                </p>
                            )}
                            {config.provider === 'deepseek' && (
                                <p className="mt-1 text-xs text-ink-3">
                                    获取密钥：<a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover">DeepSeek Platform</a>
                                </p>
                            )}
                            {config.provider === 'zhipu' && (
                                <p className="mt-1 text-xs text-ink-3">
                                    获取密钥：<a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover">智谱AI开放平台</a>
                                </p>
                            )}
                        </div>
                    )}

                    {config.provider === 'ollama' && (
                        <>
                            <OllamaGuide model={config.model || PROVIDER_DEFAULTS.ollama.model || ''} />
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[14px] font-medium text-[ink] mb-1">模型名称</label>
                                    <input
                                        type="text"
                                        value={config.model}
                                        onChange={e => setConfig({ ...config, model: e.target.value })}
                                        className="w-full px-3 py-2 rounded-[6px] border border-[rule] focus:border-[accent] focus:ring-2 focus:ring-[accent-soft] outline-none transition-colors text-[14px]"
                                        placeholder="qwen2.5"
                                    />
                                    <p className="mt-1 text-xs text-ink-3">
                                        要填已下载到本地的模型；在终端执行 ollama list 可以看到现有的。
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {config.provider !== 'gateway' && config.provider !== 'ollama' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[14px] font-medium text-[ink] mb-1">Base URL</label>
                            <input
                                type="text"
                                value={config.baseUrl}
                                onChange={e => setConfig({ ...config, baseUrl: e.target.value })}
                                className="w-full px-3 py-2 rounded-[6px] border border-[rule] focus:border-[accent] focus:ring-2 focus:ring-[accent-soft] outline-none transition-colors text-[14px]"
                                placeholder="https://api.openai.com/v1"
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium text-[ink] mb-1">模型名称</label>
                            <input
                                type="text"
                                value={config.model}
                                onChange={e => setConfig({ ...config, model: e.target.value })}
                                className="w-full px-3 py-2 rounded-[6px] border border-[rule] focus:border-[accent] focus:ring-2 focus:ring-[accent-soft] outline-none transition-colors text-[14px]"
                                placeholder="gpt-4o"
                            />
                        </div>
                    </div>
                    )}
                    {config.provider === 'gateway' && (
                        <div className="rounded-lg bg-accent-soft border border-accent-soft-hover px-4 py-3 text-sm text-accent-hover">
                            您的 AI 调用已通过 Cloudflare AI Gateway 统一提供，无需配置密钥。
                        </div>
                    )}

                    <div className="pt-4 text-xs text-ink-3">
                        <p>说明：您的 API Key 仅存储在本地浏览器中，不会发送到任何服务器。</p>
                    </div>
                </div>

                <div className="p-6 border-t border-paper-3 bg-paper-2 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-ink-2 font-medium hover:text-ink transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-accent text-accent-ink rounded-lg font-medium hover:bg-accent-hover transition-colors shadow-sm shadow-accent-soft-hover"
                    >
                        保存配置
                    </button>
                </div>
            </div>
        </div>
    );
};
