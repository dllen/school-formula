import { Icon } from '../icons/Icon';
import { useSpeech } from './hooks/useSpeech';

interface SpeakButtonProps {
  text: string;
  label?: string;
}

/** 朗读按钮；浏览器不支持语音合成时整块不渲染。 */
export function SpeakButton({ text, label }: SpeakButtonProps) {
  const { supported, speak } = useSpeech();
  if (!supported || !text) return null;

  return (
    <button
      type="button"
      className="icon-btn"
      title={'朗读：' + text}
      aria-label={label ?? '朗读 ' + text}
      onClick={() => speak(text)}
    >
      <Icon name="mic" className="w-4 h-4" />
    </button>
  );
}
