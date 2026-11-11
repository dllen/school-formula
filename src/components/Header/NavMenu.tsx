import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ViewType } from './types';
import { pathForView } from '../../view-routes';
import { NAV_GROUPS, type NavItem } from './nav-items';
import { Icon } from '../icons/Icon';

interface NavMenuProps {
  activeView: ViewType | null;
}

export function NavMenu({ activeView }: NavMenuProps) {
  const { pathname } = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  // hover intent：移出后延迟关闭，给用户斜向移动留出时间；移入则取消关闭
  const open = (label: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenGroup(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 200);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const isItemActive = (item: NavItem): boolean => {
    if (item.view) return activeView === item.view;
    if (!item.to) return false;
    return pathname === item.to || pathname.startsWith(item.to + '/');
  };

  const hrefFor = (item: NavItem): string => {
    if (item.to) return item.to;
    if (item.view) return pathForView(item.view);
    return '/';
  };

  return (
    <nav aria-label="主导航" className="nav">
      {NAV_GROUPS.map((group) => {
        const isOpen = openGroup === group.label;
        const isActive = group.items.some(isItemActive);

        return (
          <div
            key={group.label}
            className="nav-wrap"
            onMouseEnter={() => open(group.label)}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              data-active={isActive ? 'true' : undefined}
              onClick={() => (isOpen ? setOpenGroup(null) : open(group.label))}
              className="nav-link"
            >
              {group.label}
              <Icon name="chevron-down" className="w-3 h-3" />
            </button>

            {isOpen && (
              <div role="menu" aria-label={group.label} className="nav-panel">
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    to={hrefFor(item)}
                    role="menuitem"
                    data-active={isItemActive(item) ? 'true' : undefined}
                    onClick={() => setOpenGroup(null)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
