import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TopicPicker } from './practice/TopicPicker';
import { PracticeModal } from './practice/PracticeModal';
import { ProgressDashboard } from './practice/ProgressDashboard';
import { getQuestionsByKnowledgePoint } from '../data/questions';
import { useLearningProgress } from '../hooks/useLearningProgress';
import { useTopicMastery } from '../hooks/useTopicMastery';
import type { GradeLevel } from '../data/knowledge';

export const PracticeView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('primary');
  const [modalTopicId, setModalTopicId] = useState<string | null>(null);

  const learningProgress = useLearningProgress();
  const topicMastery = useTopicMastery();

  // URL ?kp=xxx → 自动打开对应专题的 modal
  useEffect(() => {
    const kp = searchParams.get('kp');
    if (kp && getQuestionsByKnowledgePoint(kp).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalTopicId(kp);
    }
  }, [searchParams]);

  const openTopic = useCallback(
    (kpId: string) => {
      setModalTopicId(kpId);
      // 同步 URL（便于分享 / 刷新后恢复），但不触发 router navigate
      const next = new URLSearchParams(searchParams);
      next.set('kp', kpId);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const closeModal = useCallback(() => {
    setModalTopicId(null);
    const next = new URLSearchParams(searchParams);
    next.delete('kp');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <TopicPicker
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        masteryById={topicMastery.masteryById}
        masteryPercent={topicMastery.masteryPercent}
        onPickTopic={openTopic}
      />
      <ProgressDashboard
        progress={learningProgress.progress}
        todayStats={learningProgress.getTodayStats()}
      />
      {modalTopicId && (
        <PracticeModal
          topicId={modalTopicId}
          isOpen={!!modalTopicId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
