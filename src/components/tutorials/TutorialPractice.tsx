import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Question, Tutorial, TutorialUnit } from '../../data/tutorials';
import { generatePracticeQuestions, getAIConfig } from '../../services/ai';
import { SettingsModal } from '../SettingsModal';

interface TutorialPracticeProps {
  unit: TutorialUnit;
  tutorial: Tutorial;
}

const normalizeAnswer = (value: string): string => {
  return value.trim().toLowerCase().replace(/[\s,，]/g, '');
};

const checkAnswer = (question: Question, userAnswer: string): boolean => {
  if (!userAnswer.trim()) return false;
  if (question.type === 'choice' || question.type === 'truefalse') {
    return normalizeAnswer(userAnswer) === normalizeAnswer(String(question.answer));
  }
  if (Array.isArray(question.answer)) {
    return question.answer.some(ans => normalizeAnswer(userAnswer) === normalizeAnswer(ans));
  }
  return normalizeAnswer(userAnswer) === normalizeAnswer(String(question.answer));
};

const getDifficultyLabel = (difficulty: Question['difficulty']) => {
  switch (difficulty) {
    case 'easy': return { text: '基础', className: 'bg-success-bg text-success-ink' };
    case 'medium': return { text: '提高', className: 'bg-accent-soft text-accent-hover' };
    case 'hard': return { text: '挑战', className: 'bg-accent-soft text-accent-hover' };
  }
};

export const TutorialPractice: React.FC<TutorialPracticeProps> = ({ unit, tutorial }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [aiExtraQuestions, setAiExtraQuestions] = useState('');
  const [isGeneratingExtra, setIsGeneratingExtra] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const score = useMemo(() => {
    return unit.practice.reduce((acc, q) => {
      return acc + (checkAnswer(q, answers[q.id] || '') ? 1 : 0);
    }, 0);
  }, [answers, unit.practice]);

  const handleAnswerChange = (questionId: string, value: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const handleGenerateExtra = async () => {
    const config = getAIConfig();
    if (!config?.apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsGeneratingExtra(true);
    setAiExtraQuestions('');

    try {
      const context = `年级：${tutorial.gradeName}，单元：${unit.title}，学习目标：${unit.objectives.join('；')}，已有练习题：${unit.practice.map(q => q.question).join('；')}`;
      await generatePracticeQuestions(unit.title, context, (chunk) => {
        setAiExtraQuestions(prev => prev + chunk);
      });
    } catch (error) {
      console.error(error);
      alert('生成失败，请检查 API 配置');
    } finally {
      setIsGeneratingExtra(false);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const userAnswer = answers[question.id] || '';
    const isCorrect = submitted ? checkAnswer(question, userAnswer) : null;

    if (question.type === 'choice' && question.options) {
      return (
        <div className="space-y-2 mt-3">
          {question.options.map((option, idx) => {
            const selected = userAnswer === option;
            let optionClass = 'border-rule hover:border-accent-soft-hover hover:bg-accent-soft/30';
            if (submitted) {
              if (selected && isCorrect) optionClass = 'border-success bg-success-bg';
              else if (selected && !isCorrect) optionClass = 'border-error bg-error-bg';
              else if (normalizeAnswer(option) === normalizeAnswer(String(question.answer))) optionClass = 'border-success bg-success-bg';
            } else if (selected) {
              optionClass = 'border-accent bg-accent-soft';
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswerChange(question.id, option)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${optionClass}`}
              >
                <span className="font-medium text-ink-3 mr-2">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            );
          })}
        </div>
      );
    }

    if (question.type === 'truefalse') {
      return (
        <div className="flex gap-3 mt-3">
          {['对', '错'].map(option => {
            const selected = userAnswer === option;
            let btnClass = 'border-rule hover:border-accent-soft-hover hover:bg-accent-soft/30';
            if (submitted) {
              if (selected && isCorrect) btnClass = 'border-success bg-success-bg';
              else if (selected && !isCorrect) btnClass = 'border-error bg-error-bg';
              else if (normalizeAnswer(option) === normalizeAnswer(String(question.answer))) btnClass = 'border-success bg-success-bg';
            } else if (selected) {
              btnClass = 'border-accent bg-accent-soft';
            }
            return (
              <button
                key={option}
                onClick={() => handleAnswerChange(question.id, option)}
                disabled={submitted}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-colors ${btnClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
    }

    if (question.type === 'fill') {
      return (
        <div className="mt-3">
          <input
            type="text"
            value={userAnswer}
            onChange={e => handleAnswerChange(question.id, e.target.value)}
            disabled={submitted}
            placeholder="请输入答案"
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
              submitted
                ? isCorrect
                  ? 'border-success bg-success-bg'
                  : 'border-error bg-error-bg'
                : 'border-rule focus:border-accent focus:ring-2 focus:ring-accent-soft'
            }`}
          />
        </div>
      );
    }

    return (
      <div className="mt-3">
        <textarea
          value={userAnswer}
          onChange={e => handleAnswerChange(question.id, e.target.value)}
          disabled={submitted}
          placeholder="请写出你的解题过程"
          rows={3}
          className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors resize-none ${
            submitted
              ? isCorrect
                ? 'border-success bg-success-bg'
                : 'border-error bg-error-bg'
              : 'border-rule focus:border-accent focus:ring-2 focus:ring-accent-soft'
          }`}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-paper-3 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-ink">课堂练习</h3>
            <p className="text-sm text-ink-3 mt-1">共 {unit.practice.length} 道题，完成后点击提交查看得分</p>
          </div>
          {submitted && (
            <div className="text-center sm:text-right">
              <div className="text-3xl font-bold text-accent">{score} / {unit.practice.length}</div>
              <div className="text-sm text-ink-3">正确率 {Math.round((score / unit.practice.length) * 100)}%</div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {unit.practice.map((question, idx) => {
            const userAnswer = answers[question.id] || '';
            const isCorrect = submitted ? checkAnswer(question, userAnswer) : null;
            const difficulty = getDifficultyLabel(question.difficulty);
            return (
              <div key={question.id} className="border-b border-paper-3 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start gap-3 mb-2">
                  <span className="bg-accent-soft text-accent-hover w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficulty.className}`}>
                        {difficulty.text}
                      </span>
                      {submitted && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-success-bg text-success-ink' : 'bg-error-bg text-error-ink'}`}>
                          {isCorrect ? '✓ 正确' : '✗ 错误'}
                        </span>
                      )}
                    </div>
                    <div className="text-ink font-medium">{question.question}</div>
                    {renderQuestionInput(question)}
                    {submitted && (
                      <div className="mt-3 bg-paper-2 rounded-xl p-4 text-sm">
                        <div className="text-ink mb-1">
                          <span className="font-medium">参考答案：</span>
                          {Array.isArray(question.answer) ? question.answer.join(' 或 ') : question.answer}
                        </div>
                        <div className="text-ink-2">
                          <span className="font-medium">解析：</span>{question.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-accent text-accent-ink rounded-xl font-bold hover:bg-accent-hover transition-colors"
            >
              提交答案
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-paper-3 text-ink-2 rounded-xl font-bold hover:bg-rule transition-colors"
            >
              重新练习
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-accent-soft rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold text-accent-active">还想再练？</h3>
            <p className="text-sm text-ink-3 mt-1">让 AI 根据本课目标再生成 5 道变式题</p>
          </div>
          {!aiExtraQuestions && !isGeneratingExtra && (
            <button
              onClick={handleGenerateExtra}
              className="px-6 py-2 bg-accent text-accent-ink rounded-xl font-bold hover:shadow-lg hover:shadow-accent-soft-hover transition-colors transition-shadow"
            >
              AI 补充练习题
            </button>
          )}
        </div>

        {isGeneratingExtra && !aiExtraQuestions && (
          <div className="bg-accent-soft p-6 rounded-xl border border-accent-soft text-center animate-pulse">
            <p className="text-accent-active font-medium">正在生成补充练习题…</p>
          </div>
        )}

        {aiExtraQuestions && (
          <div className="bg-white border border-accent-soft rounded-xl p-6 shadow-sm ring-4 ring-accent-soft/50">
            <div className="prose prose-purple max-w-none">
              <ReactMarkdown>{aiExtraQuestions}</ReactMarkdown>
            </div>
            {isGeneratingExtra && <p className="mt-4 text-accent animate-pulse text-sm">正在撰写…</p>}
          </div>
        )}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
