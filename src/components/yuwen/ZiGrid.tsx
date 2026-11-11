import { Link } from 'react-router-dom';
import { charPath } from '../../yuwen/paths';

export interface ZiItem {
  ch: string;
  py?: string;
}

interface ZiGridProps {
  items: ZiItem[];
  size?: 'sm' | 'md' | 'lg';
  current?: string;
}

/** 田字格生字网格：拼音在上、字在下，每格链到单字页。 */
export function ZiGrid({ items, size = 'md', current }: ZiGridProps) {
  return (
    <div className={'zi-grid' + (size === 'md' ? '' : ' zi-grid--' + size)}>
      {items.map((item) => (
        <Link
          key={item.ch + (item.py ?? '')}
          to={charPath(item.ch)}
          className={'zi-cell' + (item.ch === current ? ' zi-cell--current' : '')}
        >
          {item.py ? <span className="zi-cell__py">{item.py}</span> : null}
          <span className="zi-cell__ch">{item.ch}</span>
        </Link>
      ))}
    </div>
  );
}
