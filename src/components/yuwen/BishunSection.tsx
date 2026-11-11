// src/components/yuwen/BishunSection.tsx
import { useEffect, useState } from 'react';

interface HanziWriterData {
  strokes: string[];
}

interface HanziWriterApi {
  loadCharacterData(ch: string): Promise<HanziWriterData | undefined>;
  create(id: string, ch: string, options: Record<string, unknown>): unknown;
}

interface BishunSectionProps {
  ch: string;
}

/**
 * 笔顺演示：Hanzi Writer 播放笔顺，并画出每一步的小田字格。
 * 笔画数据由 hanzi-writer 从 CDN 取；取不到（离线 / 无该字数据）时整段不渲染。
 */
export function BishunSection({ ch }: BishunSectionProps) {
  const writerId = 'bishun-writer';
  const [loaded, setLoaded] = useState<{ ch: string; strokes: string[] } | null>(null);
  // ch 变化后旧笔画立即隐藏，等新字数据到达再显示（避免在 effect 里同步 setState）
  const strokes = loaded && loaded.ch === ch ? loaded.strokes : null;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mod = (await import('hanzi-writer')) as unknown as { default?: HanziWriterApi } & HanziWriterApi;
      const writer = mod.default ?? mod;
      const data = await writer.loadCharacterData(ch);
      if (cancelled || !data || !data.strokes.length) return;

      setLoaded({ ch, strokes: data.strokes });
      const css = getComputedStyle(document.documentElement);
      const color = (name: string) => css.getPropertyValue(name).trim();

      writer.create(writerId, ch, {
        width: 200,
        height: 200,
        padding: 10,
        charDataLoader: (_c: string, onLoad: (d: unknown) => void) => onLoad(data),
        strokeColor: color('--color-ink'),
        outlineColor: color('--color-rule'),
        drawingColor: color('--color-accent'),
        highlightColor: color('--color-accent'),
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 300,
        showHintAfterMisses: 2,
      });
    })().catch(() => {
      // 离线或数据缺失：保持隐藏
    });

    return () => {
      cancelled = true;
    };
  }, [ch]);

  if (!strokes) return null;

  return (
    <section className="yuwen-section" aria-label="笔顺">
      <h2 className="section-head">
        笔顺 <span className="text-ink-3 text-sm">共 {strokes.length} 画</span>
      </h2>
      <div className="bishun">
        <div className="bishun__writer" id={writerId} />
        <div className="bishun__steps">
          {strokes.map((path, index) => (
            <span key={index} className="bishun__step" title={'第 ' + (index + 1) + ' 笔'}>
              <svg viewBox="0 0 1024 1024" aria-hidden="true">
                <g transform="scale(1, -1) translate(0, -900)">
                  <path d={path} />
                </g>
              </svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
