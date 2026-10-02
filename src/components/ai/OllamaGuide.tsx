// src/components/ai/OllamaGuide.tsx
import type { ReactElement } from 'react';
import { SITE } from '../../seo/site';

/** 开发时 Vite 的默认端口。与生产域名一起构成需要放行的 origin 列表。 */
const DEV_ORIGIN = 'http://localhost:5173';

/**
 * 需要写进 OLLAMA_ORIGINS 的值。生产那段取自 `SITE.origin`，不另抄一份——
 * 站点域名换地方时这里跟着走。
 */
const ORIGINS_VALUE = `OLLAMA_ORIGINS=${DEV_ORIGIN},${SITE.origin}`;

const STEPS = [
    {
        title: '安装',
        detail: 'macOS 用 brew；其它平台到 ollama.com/download 下载安装包。',
        code: 'brew install ollama',
    },
    {
        title: '拉取模型',
        detail: '模型要先下载到本地，界面里填的名字必须与它一致。',
        code: '', // 由 model 拼接，见下面的渲染
    },
    {
        title: '放行跨域',
        detail:
            'Ollama 默认只放行 127.0.0.1 与 0.0.0.0，本站域名不在白名单里。' +
            '不设这一行，请求会在浏览器层被拦下，而报错看上去和「服务没启动」一模一样。',
        code: ORIGINS_VALUE,
    },
    {
        title: '启动',
        detail: 'macOS 的桌面版装完即在后台运行；命令行版需要手动起。',
        code: 'ollama serve',
    },
] as const;

const TROUBLESHOOTING = [
    {
        symptom: 'Failed to fetch',
        meaning: '连不上 11434。先确认 ollama serve 在跑，再确认 OLLAMA_ORIGINS 已包含本站域名。',
    },
    {
        symptom: 'model "…" not found',
        meaning: '模型还没拉取。按上面的 ollama pull 命令补上，或把界面里的模型名改成已下载的那个。',
    },
] as const;

/** 选中 Ollama 时在设置弹窗里展开的四步引导与常见报错对照。 */
export function OllamaGuide({ model }: { model: string }): ReactElement {
    return (
        <div className="rounded-lg bg-[#F5F6F7] border border-[#E5E6EB] p-4 space-y-4 text-sm">
            <div>
                <p className="font-medium text-[#1F2329]">在本地跑 Ollama，无需 API Key</p>
                <p className="mt-1 text-xs text-[#8F959E]">
                    模型在你的电脑上运行，对话内容不会发往任何第三方服务。
                </p>
            </div>

            <ol className="space-y-3">
                {STEPS.map((step, index) => (
                    <li key={step.title}>
                        <span className="font-medium text-[#1F2329]">
                            {index + 1}. {step.title}
                        </span>
                        <p className="mt-0.5 text-xs text-[#646A73]">{step.detail}</p>
                        <code className="mt-1 block rounded bg-white border border-[#E5E6EB] px-2 py-1 font-mono text-xs text-[#1F2329] break-all">
                            {step.code || `ollama pull ${model}`}
                        </code>
                    </li>
                ))}
            </ol>

            <div>
                <p className="font-medium text-[#1F2329]">常见报错</p>
                <dl className="mt-1 space-y-1.5">
                    {TROUBLESHOOTING.map((entry) => (
                        <div key={entry.symptom}>
                            <dt className="font-mono text-xs text-[#1F2329]">{entry.symptom}</dt>
                            <dd className="text-xs text-[#646A73]">{entry.meaning}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
