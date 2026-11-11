import { useCallback } from 'react';

export interface SpeechApi {
  supported: boolean;
  speak: (text: string) => void;
}

/** 浏览器中文朗读。SSR 与非支持环境返回 supported=false，调用无副作用。 */
export function useSpeech(): SpeechApi {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  return { supported, speak };
}
