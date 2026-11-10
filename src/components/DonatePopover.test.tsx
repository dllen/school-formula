import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { DonatePopover } from './DonatePopover';

function renderPopover() {
  return render(<DonatePopover triggerLabel="赞赏支持" />);
}

describe('DonatePopover', () => {
  it('打开前不渲染二维码图片', () => {
    renderPopover();
    expect(screen.queryByAltText('支付宝收款码')).toBeNull();
    expect(screen.queryByAltText('微信收款码')).toBeNull();
  });

  it('点击触发器后渲染两张二维码与图注', () => {
    renderPopover();
    fireEvent.click(screen.getByRole('button', { name: '赞赏支持' }));

    expect(screen.getByAltText('支付宝收款码')).toBeTruthy();
    expect(screen.getByAltText('微信收款码')).toBeTruthy();
    expect(screen.getByText('支付宝')).toBeTruthy();
    expect(screen.getByText('微信支付')).toBeTruthy();
  });

  it('再次点击触发器关闭', () => {
    renderPopover();
    const trigger = screen.getByRole('button', { name: '赞赏支持' });

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(screen.queryByAltText('支付宝收款码')).toBeNull();
  });

  it('按 Esc 关闭', () => {
    renderPopover();
    fireEvent.click(screen.getByRole('button', { name: '赞赏支持' }));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByAltText('支付宝收款码')).toBeNull();
  });

  it('点击 Popover 外部关闭', () => {
    renderPopover();
    fireEvent.click(screen.getByRole('button', { name: '赞赏支持' }));

    fireEvent.mouseDown(document.body);

    expect(screen.queryByAltText('支付宝收款码')).toBeNull();
  });
});
