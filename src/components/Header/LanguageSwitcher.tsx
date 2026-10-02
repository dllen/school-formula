/** Entry point to the English surface. The English pages link back to `/` with 中文. */
export function LanguageSwitcher({ className }: { className?: string }) {
  return (
    <a
      href="/en"
      lang="en"
      aria-label="Switch to the English version"
      className={
        className ??
        'px-2.5 py-1.5 text-[13px] font-medium text-[#646A73] hover:text-[#1F2329] hover:bg-[#F5F6F7] rounded-[6px] transition-colors'
      }
    >
      English
    </a>
  );
}
