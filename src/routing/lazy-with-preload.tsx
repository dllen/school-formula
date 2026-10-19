import type { ComponentType, ReactElement } from 'react';

export type PreloadableComponent<P extends object> = ((props: P) => ReactElement) & {
  preload: () => Promise<void>;
};

export function lazyWithPreload<P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
): PreloadableComponent<P> {
  let loaded: ComponentType<P> | null = null;
  let pending: Promise<void> | null = null;

  const load = () => {
    if (!pending) {
      pending = factory().then((module) => {
        loaded = module.default;
      });
    }
    return pending;
  };

  function Lazy(props: P): ReactElement {
    if (!loaded) throw load();
    const Component = loaded;
    return <Component {...props} />;
  }

  Lazy.preload = load;
  return Lazy as PreloadableComponent<P>;
}
