import { useEffect, useState } from 'react';
import { storageGet, storageSet } from '../../utils/storage';

const STORAGE_KEY = 'yuwen_hide_pinyin';

// 两个纯函数与组件同文件导出，供首屏/设置页复用同一份持久化逻辑；
// 本文件只含一个组件，不构成 Fast Refresh 边界的多导出风险，故只对规则做定点关闭。
/** 读持久化的隐藏状态（SSR 时恒为 false）。 */
// eslint-disable-next-line react-refresh/only-export-components
export function readHidePinyin(): boolean {
  return storageGet(STORAGE_KEY) === '1';
}

/** 把 hide-py 类挂到 html 根元素，CSS 据此隐藏拼音。 */
// eslint-disable-next-line react-refresh/only-export-components
export function applyHidePinyin(hide: boolean): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('hide-py', hide);
}

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
        storageSet(STORAGE_KEY, next ? '1' : '0');
        applyHidePinyin(next);
      }}
    >
      {hide ? '显示拼音' : '隐藏拼音'}
    </button>
  );
}
