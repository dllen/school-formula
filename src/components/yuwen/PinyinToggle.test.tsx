import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PinyinToggle } from './PinyinToggle';

describe('PinyinToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('hide-py');
  });

  it('切换时写 localStorage 并给 html 加类', () => {
    render(<PinyinToggle />);

    fireEvent.click(screen.getByRole('button', { name: '隐藏拼音' }));
    expect(window.localStorage.getItem('yuwen_hide_pinyin')).toBe('1');
    expect(document.documentElement.classList.contains('hide-py')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: '显示拼音' }));
    expect(window.localStorage.getItem('yuwen_hide_pinyin')).toBe('0');
    expect(document.documentElement.classList.contains('hide-py')).toBe(false);
  });
});
