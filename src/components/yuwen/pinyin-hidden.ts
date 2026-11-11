// src/components/yuwen/pinyin-hidden.ts
import { storageGet, storageSet } from '../../utils/storage';

const STORAGE_KEY = 'yuwen_hide_pinyin';

/** 读持久化的隐藏状态（SSR 时恒为 false）。 */
export function readHidePinyin(): boolean {
  return storageGet(STORAGE_KEY) === '1';
}

/** 把 hide-py 类挂到 html 根元素，CSS 据此隐藏拼音。 */
export function applyHidePinyin(hide: boolean): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('hide-py', hide);
}

/** 写入持久化状态。 */
export function writeHidePinyin(hide: boolean): void {
  storageSet(STORAGE_KEY, hide ? '1' : '0');
}
