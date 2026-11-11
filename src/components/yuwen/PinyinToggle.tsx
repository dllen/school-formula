import { useEffect, useState } from 'react';
import { applyHidePinyin, readHidePinyin, writeHidePinyin } from './pinyin-hidden';

export function PinyinToggle() {
  const [hide, setHide] = useState<boolean>(() => readHidePinyin());

  useEffect(() => {
    applyHidePinyin(hide);
  }, [hide]);

  return (
    <button
      type="button"
      className="btn btn-secondary"
      aria-pressed={hide}
      onClick={() => {
        const next = !hide;
        setHide(next);
        writeHidePinyin(next);
        applyHidePinyin(next);
      }}
    >
      {hide ? '显示拼音' : '隐藏拼音'}
    </button>
  );
}
