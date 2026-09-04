import { useState } from 'react';
import { MasteryPathView } from './MasteryPathView';
import { MasteryPracticeView } from './MasteryPracticeView';
import { MasteryLibraryView } from './MasteryLibraryView';
import { MasteryProgressView } from './MasteryProgressView';
import type { Technique } from '../data/mastery/types';

type SubView = 'path' | 'practice' | 'library' | 'progress';

export const MasteryView: React.FC = () => {
  const [subView, setSubView] = useState<SubView>('path');
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);

  const handleSelectTechnique = (t: Technique) => {
    setSelectedTechnique(t);
    setSubView('practice');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">融会贯通</h1>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {([['path', '学习路径'], ['practice', '练习'], ['library', '方法库'], ['progress', '进度']] as [SubView, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setSubView(key)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${subView === key ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {subView === 'path' && <MasteryPathView onSelect={handleSelectTechnique} />}
        {subView === 'practice' && <MasteryPracticeView technique={selectedTechnique} onBack={() => setSubView('path')} />}
        {subView === 'library' && <MasteryLibraryView onSelect={handleSelectTechnique} />}
        {subView === 'progress' && <MasteryProgressView />}
      </div>
    </div>
  );
};
