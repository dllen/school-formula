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
        'px-2.5 py-1.5 text-[13px] font-medium text-[ink-2] hover:text-[ink] hover:bg-[paper-2] rounded-[6px] transition-colors'
      }
    >
      English
    </a>
  );
}
