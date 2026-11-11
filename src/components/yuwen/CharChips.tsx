// src/components/yuwen/CharChips.tsx
import { Link } from 'react-router-dom';
import { charPath } from '../../yuwen/paths';

interface CharChipsProps {
  chars: string[];
  current?: string;
}

/** 同音字 / 含某部件的字。 */
export function CharChips({ chars, current }: CharChipsProps) {
  if (chars.length === 0) return null;

  return (
    <div className="chips">
      {chars.map((ch) => (
        <Link key={ch} to={charPath(ch)} className={'chip' + (ch === current ? ' chip--current' : '')}>
          {ch}
        </Link>
      ))}
    </div>
  );
}
