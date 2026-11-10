import { useState } from 'react';
import { MasteryPathView } from './MasteryPathView';
import { MasteryPracticeView } from './MasteryPracticeView';
import { MasteryLibraryView } from './MasteryLibraryView';
import { MasteryProgressView } from './MasteryProgressView';
import type { Technique } from '../data/mastery/types';

type SubView = 'path' | 'practice' | 'library' | 'progress';

const SUB_VIEWS: [SubView, string][] = [
  ['path', '学习路径'],
  ['practice', '练习'],
  ['library', '方法库'],
  ['progress', '进度'],
];

export const MasteryView: React.FC = () => {
  const [subView, setSubView] = useState<SubView>('path');
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);

  const handleSelectTechnique = (t: Technique) => {
    setSelectedTechnique(t);
    setSubView('practice');
  };

  return (
    <div>
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="page-title">融会贯通</h1>
        </div>

        <div className="seg" role="group" aria-label="切换融会贯通视图">
          {SUB_VIEWS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={subView === key}
              onClick={() => setSubView(key)}
              className="seg-btn"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {subView === 'path' && <MasteryPathView onSelect={handleSelectTechnique} />}
      {subView === 'practice' && <MasteryPracticeView technique={selectedTechnique} onBack={() => setSubView('path')} />}
      {subView === 'library' && <MasteryLibraryView onSelect={handleSelectTechnique} />}
      {subView === 'progress' && <MasteryProgressView onGoPath={() => setSubView('path')} />}
    </div>
  );
};
