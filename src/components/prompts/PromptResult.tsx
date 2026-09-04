import ReactMarkdown from 'react-markdown';

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
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm">← 返回</button>
        <div className="flex gap-2">
          <button onClick={onRegenerate} className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50">🔄 重新生成</button>
          <button onClick={onCopy} className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50">📋 复制结果</button>
        </div>
      </div>
      <div className="prose prose-sm max-w-none bg-gray-50 rounded-xl p-6 min-h-[200px]">
        <ReactMarkdown>{content}</ReactMarkdown>
        {isStreaming && <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-0.5" />}
      </div>
      {!isStreaming && content && (
        <div className="flex justify-center">
          <button onClick={onEditParams} className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
            ✏️ 修改参数重新生成
          </button>
        </div>
      )}
    </div>
  );
};
