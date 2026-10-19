import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { lazyWithPreload } from './lazy-with-preload';

describe('lazyWithPreload', () => {
  it('renders only after preload resolves', async () => {
    const Lazy = lazyWithPreload(() =>
      Promise.resolve({ default: () => <div>loaded-content</div> }),
    );
    await Lazy.preload();
    expect(renderToString(<Lazy />)).toContain('loaded-content');
  });
});
