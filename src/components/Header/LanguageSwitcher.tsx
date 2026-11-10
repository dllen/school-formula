import { ENGLISH_HOME } from '../../reference-routes';

/** Entry point to the English surface. The English pages link back to `/` with 中文. */
export function LanguageSwitcher({ className }: { className?: string }) {
  return (
    <a
      href={ENGLISH_HOME}
      lang="en"
      aria-label="Switch to the English version"
      className={
        className ??
        'inline-flex items-center min-h-9 px-3 rounded-md text-label font-medium text-ink-2 hover:text-ink hover:bg-paper-2 whitespace-nowrap no-underline transition-colors'
      }
    >
      English
    </a>
  );
}
