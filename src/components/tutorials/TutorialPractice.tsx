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
    case 'easy': return { text: '基础', className: 'bg-green-100 text-green-700' };
    case 'medium': return { text: '提高', className: 'bg-blue-100 text-blue-700' };
    case 'hard': return { text: '挑战', className: 'bg-purple-100 text-purple-700' };
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
            let optionClass = 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30';
            if (submitted) {
              if (selected && isCorrect) optionClass = 'border-green-500 bg-green-50';
              else if (selected && !isCorrect) optionClass = 'border-red-500 bg-red-50';
              else if (normalizeAnswer(option) === normalizeAnswer(String(question.answer))) optionClass = 'border-green-500 bg-green-50';
            } else if (selected) {
              optionClass = 'border-indigo-500 bg-indigo-50';
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswerChange(question.id, option)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${optionClass}`}
              >
                <span className="font-medium text-gray-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
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
            let btnClass = 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30';
            if (submitted) {
              if (selected && isCorrect) btnClass = 'border-green-500 bg-green-50';
              else if (selected && !isCorrect) btnClass = 'border-red-500 bg-red-50';
              else if (normalizeAnswer(option) === normalizeAnswer(String(question.answer))) btnClass = 'border-green-500 bg-green-50';
            } else if (selected) {
              btnClass = 'border-indigo-500 bg-indigo-50';
            }
            return (
              <button
                key={option}
                onClick={() => handleAnswerChange(question.id, option)}
                disabled={submitted}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${btnClass}`}
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
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
              submitted
                ? isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
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
          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none ${
            submitted
              ? isCorrect
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
          }`}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">课堂练习</h3>
            <p className="text-sm text-gray-500 mt-1">共 {unit.practice.length} 道题，完成后点击提交查看得分</p>
          </div>
          {submitted && (
            <div className="text-center sm:text-right">
              <div className="text-3xl font-bold text-indigo-600">{score} / {unit.practice.length}</div>
              <div className="text-sm text-gray-500">正确率 {Math.round((score / unit.practice.length) * 100)}%</div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {unit.practice.map((question, idx) => {
            const userAnswer = answers[question.id] || '';
            const isCorrect = submitted ? checkAnswer(question, userAnswer) : null;
            const difficulty = getDifficultyLabel(question.difficulty);
            return (
              <div key={question.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start gap-3 mb-2">
                  <span className="bg-indigo-100 text-indigo-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficulty.className}`}>
                        {difficulty.text}
                      </span>
                      {submitted && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isCorrect ? '✓ 正确' : '✗ 错误'}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-800 font-medium">{question.question}</div>
                    {renderQuestionInput(question)}
                    {submitted && (
                      <div className="mt-3 bg-gray-50 rounded-xl p-4 text-sm">
                        <div className="text-gray-900 mb-1">
                          <span className="font-medium">参考答案：</span>
                          {Array.isArray(question.answer) ? question.answer.join(' 或 ') : question.answer}
                        </div>
                        <div className="text-gray-600">
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
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              提交答案
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              重新练习
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold text-purple-900">还想再练？</h3>
            <p className="text-sm text-gray-500 mt-1">让 AI 根据本课目标再生成 5 道变式题</p>
          </div>
          {!aiExtraQuestions && !isGeneratingExtra && (
            <button
              onClick={handleGenerateExtra}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all"
            >
              AI 补充练习题
            </button>
          )}
        </div>

        {isGeneratingExtra && !aiExtraQuestions && (
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 text-center animate-pulse">
            <p className="text-purple-800 font-medium">正在生成补充练习题...</p>
          </div>
        )}

        {aiExtraQuestions && (
          <div className="bg-white border border-purple-100 rounded-xl p-6 shadow-sm ring-4 ring-purple-50/50">
            <div className="prose prose-purple max-w-none">
              <ReactMarkdown>{aiExtraQuestions}</ReactMarkdown>
            </div>
            {isGeneratingExtra && <p className="mt-4 text-purple-500 animate-pulse text-sm">正在撰写...</p>}
          </div>
        )}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
