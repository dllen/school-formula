import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PoetryView } from './PoetryView';

function renderView(initialEntries: string[] = ['/poetry']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <PoetryView />
    </MemoryRouter>,
  );
}

describe('PoetryView', () => {
  it('renders header and a card per poem by default', () => {
    renderView();
    expect(screen.getByText('古诗词')).toBeTruthy();
    expect(screen.getByText('静夜思')).toBeTruthy();
    expect(screen.getByText('春晓')).toBeTruthy();
    expect(screen.getByText('念奴娇·赤壁怀古')).toBeTruthy();
  });

  it('clicking 唐 dynasty chip narrows the list', () => {
    renderView();
    const tangChip = screen.getByRole('button', { name: '唐', pressed: false });
    fireEvent.click(tangChip);
    expect(tangChip.getAttribute('aria-pressed')).toBe('true');
    // 宋词不在结果里
    expect(screen.queryByText('念奴娇·赤壁怀古')).toBeNull();
  });

  it('clicking a poem card opens detail view with 返回列表', () => {
    renderView();
    fireEvent.click(screen.getByText('静夜思'));
    expect(screen.getByText('返回列表')).toBeTruthy();
    expect(screen.getByText('床前明月光')).toBeTruthy();
  });

  it('clicking 返回列表 closes detail and shows list again', () => {
    renderView();
    fireEvent.click(screen.getByText('静夜思'));
    fireEvent.click(screen.getByText('返回列表'));
    expect(screen.queryByText('床前明月光')).toBeNull();
    expect(screen.getByText('春晓')).toBeTruthy();
  });

  it('shows empty state when no poem matches', () => {
    renderView(['/poetry?dynasty=tang&grade=high']);
    // 高中唐诗：无示例
    expect(screen.getByText(/暂无符合条件/)).toBeTruthy();
  });
});