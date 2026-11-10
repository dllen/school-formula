import ReactMarkdown from 'react-markdown';
import { Icon } from '../icons/Icon';

interface Props {
  content: string;
  isStreaming: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
  onEditParams: () => void;
  onBack: () => void;
}

export const PromptResult: React.FC<Props> = ({ content, isStreaming, onRegenerate, onCopy, onEditParams, onBack }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-ink-3 hover:text-ink-2 text-sm">← 返回</button>
        <div className="flex gap-2">
          <button onClick={onRegenerate} className="px-3 py-1.5 text-xs border border-rule-strong rounded-lg hover:bg-paper-2"><span className="flex items-center gap-1.5"><Icon name="route" className="w-4 h-4" />重新生成</span></button>
          <button onClick={onCopy} className="px-3 py-1.5 text-xs border border-rule-strong rounded-lg hover:bg-paper-2"><span className="flex items-center gap-1.5"><Icon name="copy" className="w-4 h-4" />复制结果</span></button>
        </div>
      </div>
      <div className="prose prose-sm max-w-none bg-paper-2 rounded-xl p-6 min-h-[200px]">
        <ReactMarkdown>{content}</ReactMarkdown>
        {isStreaming && <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-0.5" />}
      </div>
      {!isStreaming && content && (
        <div className="flex justify-center">
          <button onClick={onEditParams} className="px-4 py-2 text-sm text-accent hover:bg-accent-soft rounded-lg">
            <span className="flex items-center gap-1.5"><Icon name="pencil" className="w-4 h-4" />修改参数重新生成</span>
          </button>
        </div>
      )}
    </div>
  );
};
