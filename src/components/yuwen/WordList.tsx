// src/components/yuwen/WordList.tsx
import { useSpeech } from './hooks/useSpeech';

interface WordListProps {
  words: string[];
  emptyLabel?: string;
}

/** 组词列表；有语音时点词即读。 */
export function WordList({ words, emptyLabel = '暂无组词' }: WordListProps) {
  const { supported, speak } = useSpeech();

  if (words.length === 0) {
    return <p className="text-ink-3 text-sm">{emptyLabel}</p>;
  }

  return (
    <ul className="words">
      {words.map((word) => (
        <li key={word}>
          {supported ? (
            <button type="button" className="word-chip" title={'朗读：' + word} onClick={() => speak(word)}>
              {word}
            </button>
          ) : (
            <span className="word-chip">{word}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
