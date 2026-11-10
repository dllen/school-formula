import type { IconName } from './iconNames';

/**
 * The data layer stores an icon per subject and per prompt template. Those
 * values were emoji, which render differently on every platform and carry
 * their own colours, so the UI now looks them up in this table and draws one
 * coherent set of outlines.
 *
 * The data files keep a readable marker; the lookup gives the drawing.
 */
const LEGACY_ICON: Record<string, IconName> = {
  // 学科
  '🔢': 'math',
  '📝': 'clipboard',
  '🔤': 'text',
  '🔬': 'lab',
  '⚖️': 'balance',
  '📐': 'function',
  '∫': 'function',
  '⚡': 'spark',
  '🧪': 'beaker',
  '⚗️': 'flask',
  '🧬': 'bio',
  '🦠': 'bio',
  '✒️': 'pencil',
  '✍️': 'pencil',
  '🗽': 'text',
  '📜': 'scroll',
  '🚩': 'flag',
  '🏺': 'pot',
  '🗺️': 'map',
  '🌍': 'earth',
  '📚': 'book',

  // 提示词模板
  '⚔️': 'scales',
  '⚠️': 'shield',
  '🌉': 'bridge',
  '🌱': 'tree',
  '🎤': 'mic',
  '🎨': 'paint',
  '🎪': 'theatre',
  '🎭': 'mask',
  '🎮': 'game',
  '🎯': 'target',
  '🎲': 'chess',
  '🏁': 'flag',
  '🏆': 'trophy',
  '🏖️': 'compass-rose',
  '🏗️': 'tools',
  '🏠': 'home',
  '👣': 'route',
  '💡': 'idea',
  '💪': 'flame',
  '💬': 'dialogue',
  '💼': 'vault',
  '📅': 'calendar',
  '📈': 'chart',
  '📊': 'chart',
  '📋': 'clipboard',
  '📏': 'ruler',
  '📖': 'book-open',
  '🔄': 'route',
  '🔍': 'search',
  '🔗': 'link',
  '🔒': 'key',
  '🕳️': 'mask',
  '🚀': 'spark',
  '🛠️': 'tools',
  '🤔': 'idea',
  '🤝': 'users',
  '🧘': 'users',
  '🧠': 'idea',
  '🪞': 'glasses',

  // 通用
  '⏱': 'clock',
  '⌛': 'hourglass',
  '🕐': 'clock',
  '✅': 'check-circle',
  '❌': 'cross',
  '⭐': 'star',
  '✨': 'sparkle',
  '🔥': 'flame',
  '👍': 'check-circle',
  '👑': 'trophy',
  '👈': 'grid',
  '🎓': 'trophy',
  '🧩': 'puzzle',
};

/**
 * Resolve whatever the data holds to an icon name. A value the table does not
 * know falls back to a neutral marker rather than rendering as text.
 */
export function iconFor(value: string | undefined | null): IconName {
  if (!value) return 'grid';
  const direct = LEGACY_ICON[value];
  if (direct) return direct;
  // Drop the emoji variation selector and zero-width joiner before retrying.
  const bare = value.replace(/[\uFE0F\u200D]/g, '');
  return LEGACY_ICON[bare] ?? 'grid';
}
