import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KNOWLEDGE_DATA } from '../data/knowledge';

export const KnowledgeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Find the knowledge point in the data
    const findKnowledgePoint = (pointId: string | undefined) => {
        if (!pointId) return null;
        for (const grade of KNOWLEDGE_DATA) {
            for (const subject of grade.subjects) {
                const point = subject.knowledgePoints.find(p => p.id === pointId);
                if (point) return { point, subject, grade };
            }
        }
        return null;
    };

    const data = findKnowledgePoint(id);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到该知识点</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        返回首页
                    </button>
                </div>
            </div>
        );
    }

    const { point, subject } = data;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <span className="mr-2">←</span> 返回列表
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-4xl">{subject.icon}</span>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold text-gray-900">{point.title}</h1>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                        {subject.name}
                                    </span>
                                </div>
                                <p className="text-gray-500 mt-2 text-lg">{point.description}</p>
                            </div>
                        </div>

                        {point.tags && (
                            <div className="flex gap-2 mt-4">
                                {point.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white border border-blue-100 text-blue-600 text-sm rounded-full shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">

                        {/* Detailed Explanation */}
                        {point.detailedExplanation ? (
                            <div className="prose prose-lg prose-blue max-w-none">
                                <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                                    <span className="mr-2">💡</span> 详细解析
                                </h3>
                                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-50 text-gray-700 whitespace-pre-line leading-relaxed">
                                    {point.detailedExplanation}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p>暂无详细解析内容</p>
                            </div>
                        )}

                        {/* Study Tips */}
                        {point.studyTips && point.studyTips.length > 0 && (
                            <div>
                                <h3 className="flex items-center text-xl font-bold text-amber-900 mb-4">
                                    <span className="mr-2">🎓</span> 学习技巧
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {point.studyTips.map((tip, idx) => (
                                        <div key={idx} className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start">
                                            <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            <p className="text-amber-900">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Practice Questions */}
                        {point.practiceQuestions && point.practiceQuestions.length > 0 && (
                            <div>
                                <h3 className="flex items-center text-xl font-bold text-green-900 mb-4">
                                    <span className="mr-2">✏️</span> 实战练习
                                </h3>
                                <div className="space-y-4">
                                    {point.practiceQuestions.map((q, idx) => (
                                        <div key={idx} className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
                                            <div className="bg-green-50 p-4 border-b border-green-100">
                                                <p className="font-bold text-green-900">Q{idx + 1}: {q.question}</p>
                                            </div>
                                            <div className="p-4 bg-white">
                                                <p className="text-gray-600">
                                                    <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded mr-2">参考答案</span>
                                                    {q.answer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};
