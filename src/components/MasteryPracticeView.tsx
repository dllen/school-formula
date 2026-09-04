import { useState, useEffect, useCallback } from 'react';
import type { Technique, Question } from '../data/mastery/types';
import { generateQuestions } from '../data/mastery/qgen';
import { recordAttempt } from '../data/mastery/progress';

interface Props {
  technique: Technique | null;
  onBack: () => void;
}

export const MasteryPracticeView: React.FC<Props> = ({ technique, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (technique) {
      setQuestions(generateQuestions(technique.id, 6));
      setCurrentIdx(0);
      setSelected(null);
      setCorrectCount(0);
      setShowExplanation(false);
      setFinished(false);
    }
  }, [technique]);

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null || !questions[currentIdx]) return;
    setSelected(idx);
    setShowExplanation(true);
    const correct = idx === questions[currentIdx].ans;
    if (correct) setCorrectCount(prev => prev + 1);
    if (technique) {
      recordAttempt(technique.id, correct, questions[currentIdx].point);
    }
  }, [selected, questions, currentIdx, technique]);

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  if (!technique) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="mb-4">请从学习路径或方法库中选择一个方法开始练习</p>
        <button onClick={onBack} className="text-blue-600 hover:text-blue-800">← 返回学习路径</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center py-12 text-gray-400">该方法的出题引擎尚未就绪，敬请期待</div>;
  }

  if (finished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">{accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}</div>
        <h3 className="text-xl font-bold mb-2">练习完成！</h3>
        <p className="text-gray-600 mb-4">正确率：{correctCount}/{questions.length}（{accuracy}%）</p>
        <p className="text-sm text-gray-400 mb-6">
          {accuracy >= 80 ? '恭喜通关！可以继续下一个方法了。' : '继续加油，多练习几次就能通关！'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">返回路径</button>
          <button onClick={() => { setQuestions(generateQuestions(technique.id, 6)); setCurrentIdx(0); setSelected(null); setCorrectCount(0); setFinished(false); setShowExplanation(false); }}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">再练一组</button>
        </div>
      </div>
    );
  }

  const current = questions[currentIdx];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm">← 返回</button>
          <span className="font-medium text-gray-800">{technique.name}</span>
        </div>
        <span className="text-sm text-gray-400">{currentIdx + 1} / {questions.length}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">第 {currentIdx + 1} 题</span>
          <span className="text-xs text-gray-400">难度：{'⭐'.repeat(current.level)}</span>
        </div>
        <p className="text-gray-800 font-medium mb-4 whitespace-pre-line">{current.q}</p>
        <div className="space-y-2">
          {current.opts.map((opt, idx) => {
            let cls = 'w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ';
            if (selected === null) {
              cls += 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer';
            } else if (idx === current.ans) {
              cls += 'border-green-500 bg-green-50 text-green-700 font-medium';
            } else if (idx === selected) {
              cls += 'border-red-500 bg-red-50 text-red-700';
            } else {
              cls += 'border-gray-200 opacity-50';
            }
            return (
              <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={selected !== null}>
                <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className={`mt-4 rounded-xl p-4 border ${selected === current.ans ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span>{selected === current.ans ? '✅' : '❌'}</span>
            <span className="font-medium text-sm">{selected === current.ans ? '回答正确！' : '回答错误'}</span>
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">📝 解析：</p>
            <p className="whitespace-pre-line">{current.explain}</p>
          </div>
          <div className="mt-2 text-xs text-gray-500"><span className="font-medium">得分点：</span>{current.point}</div>
        </div>
      )}

      {showExplanation && (
        <button onClick={handleNext}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">
          {currentIdx + 1 >= questions.length ? '查看结果' : '下一题'}
        </button>
      )}
    </div>
  );
};
