import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Question, Tutorial, TutorialUnit } from '../../data/tutorials';
import { generatePracticeQuestions, getAIConfig } from '../../services/ai';
import { SettingsModal } from '../SettingsModal';
import { Icon } from '../icons/Icon';

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

const getDifficultyLabel = (difficulty: Question['difficulty']): string => {
  switch (difficulty) {
    case 'easy': return '基础';
    case 'medium': return '提高';
    case 'hard': return '挑战';
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
        <div className="mt-3 divide-y divide-rule">
          {question.options.map((option, idx) => {
            const selected = userAnswer === option;
            const isCorrectOption = normalizeAnswer(option) === normalizeAnswer(String(question.answer));
            let optionClass = 'border-l-transparent text-ink hover:bg-paper-3';
            if (submitted) {
              if (isCorrectOption) optionClass = 'border-l-success bg-success-bg text-ink';
              else if (selected) optionClass = 'border-l-error bg-error-bg text-ink';
              else optionClass = 'border-l-transparent text-ink-2';
            } else if (selected) {
              optionClass = 'border-l-accent bg-accent-soft text-ink';
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnswerChange(question.id, option)}
                disabled={submitted}
                className={`tap-44 flex w-full items-start gap-2 border-l-2 px-2 py-2.5 text-left text-body-s transition-colors disabled:cursor-default ${optionClass}`}
              >
                <span className="tabular font-medium text-ink-3">{String.fromCharCode(65 + idx)}.</span>
                <span className="min-w-0 flex-1">{option}</span>
                {submitted && isCorrectOption && (
                  <Icon name="check-circle" className="h-4 w-4 shrink-0 text-success" />
                )}
                {submitted && selected && !isCorrectOption && (
                  <Icon name="cross" className="h-4 w-4 shrink-0 text-error" />
                )}
              </button>
            );
          })}
        </div>
      );
    }

    if (question.type === 'truefalse') {
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {['对', '错'].map(option => {
            const selected = userAnswer === option;
            const isCorrectOption = normalizeAnswer(option) === normalizeAnswer(String(question.answer));
            let btnClass = 'border-rule-strong text-ink-2 hover:bg-card';
            if (submitted) {
              if (isCorrectOption) btnClass = 'border-success bg-success-bg text-ink';
              else if (selected) btnClass = 'border-error bg-error-bg text-ink';
              else btnClass = 'border-rule text-ink-3';
            } else if (selected) {
              btnClass = 'border-accent bg-accent-soft text-ink';
            }
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswerChange(question.id, option)}
                disabled={submitted}
                className={`tap-44 inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-body-s font-medium transition-colors disabled:cursor-default ${btnClass}`}
              >
                {submitted && isCorrectOption && <Icon name="check-circle" className="h-4 w-4" />}
                {submitted && selected && !isCorrectOption && <Icon name="cross" className="h-4 w-4" />}
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
            aria-label="填写答案"
            aria-invalid={submitted && !isCorrect ? true : undefined}
            className={`input text-body ${submitted && isCorrect ? 'border-success' : ''}`}
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
          aria-label="填写解题过程"
          aria-invalid={submitted && !isCorrect ? true : undefined}
          rows={3}
          className={`input min-h-24 resize-none text-body ${submitted && isCorrect ? 'border-success' : ''}`}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule pb-4">
        <div>
          <h2 className="text-subhead font-semibold text-ink">课堂练习</h2>
          <p className="mt-1 text-body-s text-ink-3">
            共 {unit.practice.length} 道题，完成后点击提交查看得分
          </p>
        </div>
        {submitted && (
          <p className="tabular text-title font-semibold text-ink">
            {score} / {unit.practice.length}
            <span className="ml-2 text-body-s font-normal text-ink-2">
              正确率 {Math.round((score / unit.practice.length) * 100)}%
            </span>
          </p>
        )}
      </div>

      <ol className="mt-6 space-y-4">
        {unit.practice.map((question, idx) => {
          const userAnswer = answers[question.id] || '';
          const isCorrect = submitted ? checkAnswer(question, userAnswer) : null;

          return (
            <li key={question.id} className="well">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tabular text-caption text-ink-3">第 {idx + 1} 题</span>
                <span className="tag bg-paper-3">{getDifficultyLabel(question.difficulty)}</span>
                {submitted && (
                  <span
                    className={`inline-flex items-center gap-1 text-caption font-medium ${
                      isCorrect ? 'text-success-ink' : 'text-error-ink'
                    }`}
                  >
                    <Icon name={isCorrect ? 'check-circle' : 'cross'} className="h-4 w-4" />
                    {isCorrect ? '正确' : '错误'}
                  </span>
                )}
              </div>

              <p className="mt-2 text-body font-medium text-ink">{question.question}</p>

              {renderQuestionInput(question)}

              {submitted && (
                <div className="mt-3 border-t border-divider pt-3 text-body-s">
                  <p className="text-ink">
                    <span className="font-medium">参考答案：</span>
                    {Array.isArray(question.answer) ? question.answer.join(' 或 ') : question.answer}
                  </p>
                  <p className="mt-1 text-ink-2">
                    <span className="font-medium text-ink-2">解析：</span>
                    {question.explanation}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        {!submitted ? (
          <button type="button" onClick={handleSubmit} className="btn btn-primary btn-lg">
            提交答案
          </button>
        ) : (
          <button type="button" onClick={handleReset} className="btn btn-secondary btn-lg">
            重新练习
          </button>
        )}
      </div>

      <section className="section" aria-labelledby="practice-ai">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="practice-ai" className="section-head">还想再练？</h2>
            <p className="mt-1 text-body-s text-ink-3">让 AI 根据本课目标再生成 5 道变式题</p>
          </div>
          {!aiExtraQuestions && !isGeneratingExtra && (
            <button type="button" onClick={handleGenerateExtra} className="btn btn-secondary">
              AI 补充练习题
            </button>
          )}
        </div>

        {isGeneratingExtra && !aiExtraQuestions && (
          <div className="well mt-4" role="status">
            <p className="text-body-s text-ink-2">正在生成补充练习题…</p>
          </div>
        )}

        {aiExtraQuestions && (
          <div className="mt-4">
            <div className="prose-body">
              <ReactMarkdown>{aiExtraQuestions}</ReactMarkdown>
            </div>
            {isGeneratingExtra && (
              <p className="mt-3 text-body-s text-ink-3" role="status">正在撰写…</p>
            )}
          </div>
        )}
      </section>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
