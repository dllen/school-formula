import { Icon } from '../icons/Icon';

interface SettingsButtonProps {
  onClick: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="AI 设置"
      className="icon-btn"
    >
      <Icon name="gear" className="w-5 h-5" />
    </button>
  );
}
