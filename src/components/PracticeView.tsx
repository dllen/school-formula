import React, { useMemo, useState } from 'react';
import { getQuestionsByGrade, type PracticeQuestion } from '../data/practice';
import type { GradeLevel } from '../data/knowledge';
import { GradeSelector } from './GradeSelector';

export const PracticeView: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('primary');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [results, setResults] = useState<Record<string, { correct: boolean; userAnswer: string }>>({});

  const gradeQuestions = getQuestionsByGrade(selectedGrade);

  const subjects = useMemo(() => {
    const set = new Set(gradeQuestions.map((q) => q.subject));
    return Array.from(set);
  }, [gradeQuestions]);

  const filteredQuestions = useMemo(() => {
    if (selectedSubject === 'all') return gradeQuestions;
    return gradeQuestions.filter((q) => q.subject === selectedSubject);
  }, [gradeQuestions, selectedSubject]);

  const stats = useMemo(() => {
    const ids = new Set(gradeQuestions.map((q) => q.id));
    let answered = 0;
    let correct = 0;
    for (const [id, result] of Object.entries(results)) {
      if (ids.has(id)) {
        answered += 1;
        if (result.correct) correct += 1;
      }
    }
    return { answered, correct, total: gradeQuestions.length };
  }, [results, gradeQuestions]);

  const handleAnswer = (question: PracticeQuestion, userAnswer: string) => {
    if (results[question.id]) return;
    const correct = userAnswer.trim() === question.answer.trim();
    setResults((prev) => ({ ...prev, [question.id]: { correct, userAnswer: userAnswer.trim() } }));
  };

  const handleGradeChange = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setSelectedSubject('all');
  };

  const handleReset = () => {
    setResults({});
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">专题练习</h2>
          <p className="text-sm text-gray-500">按学段与学科刷题，即时反馈对错</p>
        </div>
        <GradeSelector selectedGrade={selectedGrade} onSelectGrade={handleGradeChange} />
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              selectedSubject === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部学科
          </button>
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                selectedSubject === subject
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">
            已答 <span className="font-bold text-gray-900">{stats.answered}</span> / {stats.total}
          </span>
          <span className="text-gray-500">
            正确 <span className="font-bold text-green-600">{stats.correct}</span>
          </span>
          <button
            onClick={handleReset}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            重新作答
          </button>
        </div>
      </div>

      {filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              result={results[question.id]}
              onAnswer={handleAnswer}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="text-6xl mb-4 grayscale opacity-30">📝</div>
          <p className="text-lg text-gray-400">当前筛选条件下暂无练习题</p>
          <p className="text-sm text-gray-400 mt-1">换个学段或学科试试</p>
        </div>
      )}
    </div>
  );
};

interface QuestionCardProps {
  question: PracticeQuestion;
  index: number;
  result?: { correct: boolean; userAnswer: string };
  onAnswer: (question: PracticeQuestion, userAnswer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, result, onAnswer }) => {
  const [fillInput, setFillInput] = useState('');
  const answered = result !== undefined;

  const cardBorder = !answered
    ? 'border-gray-100'
    : result.correct
      ? 'border-green-200'
      : 'border-red-200';

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${cardBorder} overflow-hidden flex flex-col`}>
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-base font-bold text-gray-900 leading-relaxed">
            {index + 1}. {question.question}
          </h3>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
              {question.subject}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {question.type === 'choice' ? '选择题' : '填空题'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1">
        {question.type === 'choice' && question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((option) => {
              let optionClass = 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border border-transparent';
              if (answered && result) {
                if (option === question.answer) {
                  optionClass = 'bg-green-50 text-green-700 border border-green-300 font-medium';
                } else if (option === result.userAnswer) {
                  optionClass = 'bg-red-50 text-red-700 border border-red-300';
                } else {
                  optionClass = 'bg-gray-50 text-gray-400 border border-transparent';
                }
              }
              return (
                <button
                  key={option}
                  disabled={answered}
                  onClick={() => onAnswer(question, option)}
                  className={`px-4 py-2.5 rounded-xl text-sm text-left transition-all ${optionClass} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'fill' && (
          <div className="flex gap-3">
            <input
              type="text"
              value={fillInput}
              disabled={answered}
              onChange={(e) => setFillInput(e.target.value)}
              placeholder="输入你的答案"
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-gray-700 placeholder:text-gray-400 focus:border-indigo-300 disabled:opacity-60"
            />
            {!answered && (
              <button
                onClick={() => fillInput.trim() && onAnswer(question, fillInput)}
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all"
              >
                提交
              </button>
            )}
          </div>
        )}

        {answered && result && (
          <div className={`rounded-xl px-4 py-3 text-sm space-y-2 ${result.correct ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`font-bold ${result.correct ? 'text-green-700' : 'text-red-700'}`}>
              {result.correct ? '✓ 回答正确' : `✗ 回答错误，正确答案：${question.answer}`}
            </p>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">解析</p>
              <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
