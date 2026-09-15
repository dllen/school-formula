import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { PromptTemplate, PromptScenario } from '../../data/prompts/types';
import type { GradeLevel } from '../../data/knowledge';
import { ALL_PROMPTS, filterPrompts } from '../../data/prompts';
import { generateFromTemplate } from '../../services/ai';
import { PromptFilterBar } from './PromptFilterBar';
import { PromptGrid } from './PromptGrid';
import { PromptDetail } from './PromptDetail';
import { PromptResult } from './PromptResult';

type ModalState = 'browse' | 'detail' | 'result';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  knowledgePointTitle?: string;
  knowledgePointGrade?: string;
}

export const PromptModal: React.FC<Props> = ({ isOpen, onClose, knowledgePointTitle, knowledgePointGrade }) => {
  const [state, setState] = useState<ModalState>('browse');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [grade, setGrade] = useState<GradeLevel | ''>('');
  const [subject, setSubject] = useState('');
  const [scenario, setScenario] = useState<PromptScenario | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredTemplates = useMemo(() => {
    let templates = grade || subject || scenario
      ? filterPrompts({ grade: grade || undefined, subject: subject || undefined, scenario: scenario || undefined })
      : ALL_PROMPTS;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      templates = templates.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return templates;
  }, [grade, subject, scenario, searchQuery]);

  const handleSelectTemplate = useCallback((template: PromptTemplate) => {
    setSelectedTemplate(template);
    setState('detail');
  }, []);

  const handleSend = useCallback(async (vars: Record<string, string>) => {
    if (!selectedTemplate) return;
    setVariables(vars);
    setState('result');
    setResult('');
    setIsStreaming(true);

    try {
      await generateFromTemplate(selectedTemplate, vars, (chunk) => {
        setResult(prev => prev + chunk);
      });
    } catch (error) {
      setResult(`⚠️ 生成失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsStreaming(false);
    }
  }, [selectedTemplate]);

  const handleCopyPrompt = useCallback(() => {
    if (!selectedTemplate) return;
    let prompt = selectedTemplate.template;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 4000);
    }).catch(() => {
      // clipboard API 不可用时 fallback
      const ta = document.createElement('textarea');
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 4000);
    });
  }, [selectedTemplate, variables]);

  // 清理 timer
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // 切换模板时重置 copied 状态
  useEffect(() => {
    setCopied(false);
  }, [selectedTemplate]);

  const handleBack = useCallback(() => {
    if (state === 'result') setState('detail');
    else if (state === 'detail') setState('browse');
    else onClose();
  }, [state, onClose]);

  const prefilledVars = useMemo(() => {
    if (!knowledgePointTitle) return undefined;
    return {
      knowledge_point: knowledgePointTitle,
      student_grade: knowledgePointGrade || '',
    };
  }, [knowledgePointTitle, knowledgePointGrade]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">📝 教学提示词</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {state === 'browse' && (
            <div className="space-y-4">
              <PromptFilterBar
                grade={grade} subject={subject} scenario={scenario}
                searchQuery={searchQuery} resultCount={filteredTemplates.length}
                onGradeChange={setGrade} onSubjectChange={setSubject}
                onScenarioChange={setScenario} onSearchChange={setSearchQuery}
              />
              <PromptGrid templates={filteredTemplates} onSelect={handleSelectTemplate} />
            </div>
          )}
          {state === 'detail' && selectedTemplate && (
            <>
              {copied && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-2">
                    <span className="text-lg leading-none">✅</span>
                    <div className="space-y-1">
                      <p className="font-medium">已复制到剪贴板！</p>
                      <p className="text-green-600 text-xs leading-relaxed">
                        粘贴到任意 AI 对话窗口（如 ChatGPT、Claude、文心一言等）即可使用。<br />
                        提示词中的变量已替换为你填写的内容，直接发送即可 🎉
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <PromptDetail
                template={selectedTemplate}
                prefilledVars={prefilledVars}
                onSend={handleSend}
                onCopy={handleCopyPrompt}
                onBack={handleBack}
                copied={copied}
              />
            </>
          )}
          {state === 'result' && (
            <PromptResult
              content={result}
              isStreaming={isStreaming}
              onRegenerate={() => handleSend(variables)}
              onCopy={() => navigator.clipboard.writeText(result)}
              onEditParams={handleBack}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};
