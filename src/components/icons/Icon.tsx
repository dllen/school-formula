import type { IconName } from './iconNames';

export type { IconName };

/**
 * One icon set for the whole app.
 *
 * Every icon is a 24x24 stroked outline drawn on the same grid, with the same
 * 1.8 stroke weight and the same round caps. There is no second library and no
 * emoji: an emoji renders differently on every platform and carries its own
 * colour, which is why they are gone.
 */

interface IconProps {
  name: IconName;
  className?: string;
  /** Announce the icon when it carries meaning the label does not. */
  label?: string;
}

const PATHS: Record<IconName, string> = {
  ai: 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z',
  book: 'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm3 0v16M10 8h5m-5 3.5h5',
  'book-open': 'M12 6.5C10.5 5 8.5 4.5 6 4.5H3v13h3c2.5 0 4.5.5 6 2m0-13c1.5-1.5 3.5-2 6-2h3v13h-3c-2.5 0-4.5.5-6 2m0-13v13',
  brush: 'M9.5 14.5 4 20m0 0 2.8-.6L4 20Zm0 0 .6-2.8M14 4l6 6-7.5 7.5H8L6.5 14 14 4Zm-2 2 2 2',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  'check-circle': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-9 2.5 2.5 4.5-5',
  clipboard: 'M9 4h6v3H9V4Zm-2 1.5H5.5A1.5 1.5 0 0 0 4 7v12.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H17M8 11h8m-8 3.5h8m-8 3.5h5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3.5 2',
  copy: 'M9 9V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v8a1.5 1.5 0 0 1-1.5 1.5H15M5.5 9h8A1.5 1.5 0 0 1 15 10.5v8A1.5 1.5 0 0 1 13.5 20h-8A1.5 1.5 0 0 1 4 18.5v-8A1.5 1.5 0 0 1 5.5 9Z',
  cross: 'M6 6l12 12M18 6 6 18',
  game: 'M7 8h10v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8Zm5 0V6a2 2 0 1 0-4 0M3 11v2m18-2v2',
  flame: 'M12 21c3.3 0 6-2.5 6-5.6 0-4.3-4.5-6.1-4.5-9.9 0-1-.3-2-1-2.9-.6 3-2.7 4.4-4.2 6C6.8 10 6 11.6 6 13.3 6 17.6 8.7 21 12 21Zm0 0c-1.4 0-2.5-1.1-2.5-2.5 0-1.6 1.6-2.3 1.6-3.7 0-.7-.3-1.3-.7-1.8-.3 1.2-1.3 1.8-2 2.7-.8 1-1.2 2-1.2 2.9 0 1.4 1.1 2.4 2.8 2.4Z',
  function: 'M5 20c3.5 0 3.5-4 4.5-8s1.5-8 5-8M6 9h6m-3 6h6',
  grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  idea: 'M9 18h6m-5 3h4m4.5-9.5a5.5 5.5 0 1 0-11 0c0 1.6.7 3 1.8 4 .4.4.7 1 .7 1.5v1h6v-1c0-.5.3-1.1.7-1.5 1.1-1 1.8-2.4 1.8-4Z',
  lab: 'M9 3v6.2L4.6 17A2 2 0 0 0 6.3 20h11.4a2 2 0 0 0 1.7-3L15 9.2V3M8 3h8m-6 9h4',
  math: 'M4 7h4M6 5v4M14 5h6M17 5v6M13 15h8M13 19h8',
  pencil: 'M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Zm11-13 3 3',
  puzzle: 'M9 4h2.5a1.5 1.5 0 0 1 3 0H17a1 1 0 0 1 1 1v2.5a1.5 1.5 0 0 0 0 3H16V17a1 1 0 0 1-1 1h-3.5a1.5 1.5 0 0 0-3 0H4a1 1 0 0 1-1-1v-3.5a1.5 1.5 0 0 0 0-3H4V5a1 1 0 0 1 1-1h4Z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5 -2 4.5 4.5',
  sparkle: 'M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.6 10.4 12.2 5 10.6 10.4 9 12 3.5Zm6.5 10 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z',
  star: 'm12 4 2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4-3.9 5.5-.8L12 4Z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  text: 'M5 6.5V5h14v1.5M12 5v14m-3 0h6',

  atom: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0-11c3.5 0 6.5 5.5 6.5 11S15.5 25 12 25s-6.5-5.5-6.5-11S8.5 3 12 3Zm0 0c-2 2.5-3 6.5-3 11s1 8.5 3 11m0-22c2 2.5 3 6.5 3 11s-1 8.5-3 11',
  balance: 'M12 4v16M7 20h10M6 8h12M6 8 3 14h6L6 8Zm12 0-3 6h6l-3-6Z',
  beaker: 'M9 3v6.5L4.8 17a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L15 9.5V3M8 3h8M7.5 14h9',
  bio: 'M5 12a7 7 0 0 1 14 0 7 7 0 0 1-14 0Zm0 0h14M12 5v14',
  bridge: 'M3 17V9m18 8V9M3 12h18M7 17v-3m5 3v-5m5 5v-3M8 9V6m8 3V6M6 6h12',
  calendar: 'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm-1 4h16M8 3v4m8-4v4',
  chart: 'M4 20V4m0 16h16M8 16v-4m4 4V8m4 8v-6',
  chess: 'M8 21h8M9 18h6M12 3a3 3 0 0 1 2.4 4.8l1.1 1.2H8.5l1.1-1.2A3 3 0 0 1 12 3ZM6 15h12l-1-4H7l-1 4Z',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  dialogue: 'M20 15a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10ZM8 9h8m-8 3.5h5',
  earth: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.4 3.8 5.4 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3Z',
  flag: 'M5 21V4m0 1h11l-1.5 3.5L16 12H5',
  flask: 'M9 3v6.5L4.8 17a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L15 9.5V3M8 3h8m-8.5 11h9',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.4 3.8 5.4 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3Z',
  glasses: 'M7 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-3-3h-4M4 11.5 2.5 10m17.5 1.5L21.5 10',
  growth: 'M4 19 9 13l3.5 3.5L20 8m0 0h-5m5 0v5',
  hammer: 'M14 5.5 18 2l4 4-3.5 3.5m-4.5-4-8 8a2 2 0 0 0 0 2.8l1.2 1.2a2 2 0 0 0 2.8 0l8-8',
  home: 'M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9Z',
  hourglass: 'M7 3h10M7 21h10M8 3v3.5L12 12l-4 5.5V21m8-18v3.5L12 12l4 5.5V21',
  instrument: 'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
  key: 'M15 10a4.5 4.5 0 1 0-1.5 3.4L21 21l1.5-1.5-1.5-1.5 1.5-1.5-2-2-2 2-1.5-1.5.5-.5ZM10 8.5h.01',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7L11.5 7M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7L12.5 17',
  mask: 'M4 6h16v6a8 8 0 0 1-16 0V6Zm4 3h1.5m5 0H16M9.5 14c1.5 1 3.5 1 5 0',
  map: 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15',
  mic: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm-6-3a6 6 0 0 0 12 0M12 18v3m-3 0h6',
  music: 'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
  paint: 'M12 3a9 9 0 0 0 0 18c1 0 1.5-.7 1.5-1.5 0-.5-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4-4-7.8-9-7.8ZM7.5 12.5h.01M10 8.5h.01M14.5 8h.01',
  planet: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM3.5 15.5C7 13 16 12.5 20.5 15c1 .5 1 1.5 0 2-4.5 2.5-13.5 2-17-1-.5-.5-.5-1 .0-1.5Z',
  pot: 'M9 3h6v2H9V3Zm-3 4h12l-1 11a2 2 0 0 1-2 1.8h-6A2 2 0 0 1 5 18L4 7Zm4 4v6m4-6v6',
  'puzzle-piece': 'M9 4h2.5a1.5 1.5 0 0 1 3 0H17a1 1 0 0 1 1 1v2.5a1.5 1.5 0 0 0 0 3H16V17a1 1 0 0 1-1 1h-3.5a1.5 1.5 0 0 0-3 0H4a1 1 0 0 1-1-1v-3.5a1.5 1.5 0 0 0 0-3H4V5a1 1 0 0 1 1-1h4Z',
  ruler: 'M3.5 15.5 15.5 3.5l5 5-12 12-5-5ZM7 12l2 2m1-5 2 2m1-5 2 2',
  scales: 'M12 4v16M7 20h10M6 8h12M6 8 3 14h6L6 8Zm12 0-3 6h6l-3-6Z',
  shield: 'M12 3 5 6v5.5c0 4.3 2.9 8 7 9.5 4.1-1.5 7-5.2 7-9.5V6l-7-3Z',
  spark: 'M13 2 5 13h6l-1 9 8-11h-6l1-9Z',
  steps: 'M3 20h5v-4h5v-4h5V8h3',
  'target-flag': 'M5 21V4m0 1h11l-1.5 3.5L16 12H5',
  theatre: 'M4 6h16v12H4V6Zm4 12v3m12-3v3M8 10h8m-8 4h5',
  tools: 'M14.5 6.5a4 4 0 0 0 5 5L15 16l-3.5-3.5 4.5-4.5-4-2.5-2 2M12 12 4 20m0 0h3.5v-3.5',
  train: 'M7 3h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm-2 5h14M8 16h.01M16 16h.01M7 19l-2 3m12-3 2 3M4 22h16',
  tree: 'M12 21v-5m0 0-4-2 1.5-2H6l2-3H5l3-4h8l3 4h-3l2 3h-3.5L16 14l-4 2Z',
  users: 'M15.5 20v-1.5a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4V20M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm10 9v-1.5a4 4 0 0 0-3-3.9M16 4.2a3.5 3.5 0 0 1 0 6.6',
  vault: 'M4 5h16v14H4V5Zm4 0v14m4-9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 0v-2',
  watch: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 8V6.5m0 11V16M9.5 3h5l-.6 3.5h-3.8L9.5 3Zm0 18h5l-.6-3.5h-3.8L9.5 21Z',
  wave: 'M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-1.5 5-1M2 17c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-1.5 5-1',
  wind: 'M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h9a3 3 0 1 1-3 3',
  wrench: 'M14.5 6.5a4 4 0 0 0 5 5L15 16l-3.5-3.5 4.5-4.5-4-2.5-2 2M12 12 4 20',
  anchor: 'M12 8v13m0-13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 13c-3.5 0-6 2.5-6 5.5M12 13c3.5 0 6 2.5 6 5.5M8 11h8',
  route: 'M6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM8 6h6a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 2h-4l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z',
  'compass-rose': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  scroll: 'M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 0v3h10M9 11h6m-6 3h4',
  trophy: 'M7 4h10v5a5 5 0 0 1-10 0V4Zm0 1.5H4.5V7A3.5 3.5 0 0 0 8 10.5m9-5h2.5V7a3.5 3.5 0 0 1-3.5 3.5M12 14v3m-3.5 3h7',
};

/**
 * Icons that are a single filled shape rather than an outline. They share the
 * same grid and the same 24-unit box as the stroked set.
 */
const FILLED: Partial<Record<IconName, string>> = {};

export function Icon({ name, className = 'w-5 h-5', label }: IconProps) {
  const filled = FILLED[name];
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      <path d={filled ?? PATHS[name]} />
    </svg>
  );
}

