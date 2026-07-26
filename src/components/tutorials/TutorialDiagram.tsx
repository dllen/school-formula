import { useEffect, useRef } from 'react';
import type { Diagram } from '../../data/tutorials';

interface TutorialDiagramProps {
  diagram: Diagram;
}

export const TutorialDiagram = ({ diagram }: TutorialDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (diagram.type === 'svg') {
      container.innerHTML = diagram.content;
      return;
    }

    let cancelled = false;

    const renderMermaid = async () => {
      try {
        const mermaid = await import('mermaid');
        mermaid.default.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'strict',
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        const { svg } = await mermaid.default.render(id, diagram.content);
        if (!cancelled && container) {
          container.innerHTML = svg;
        }
      } catch {
        if (!cancelled && container) {
          container.innerHTML = '<div class="text-center text-sm text-red-500 bg-red-50 p-2 rounded-lg">图表渲染失败，请检查 Mermaid 语法</div>';
        }
      }
    };

    renderMermaid();

    return () => {
      cancelled = true;
    };
  }, [diagram]);

  return (
    <div className="my-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div
        ref={containerRef}
        className="flex justify-center overflow-x-auto"
      />
      {diagram.caption && (
        <div className="mt-3 text-center text-sm text-gray-500">
          {diagram.caption}
        </div>
      )}
    </div>
  );
};
