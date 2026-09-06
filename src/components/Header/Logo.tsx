export function Logo() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="bg-[#3370FF] text-white w-[32px] h-[32px] rounded-[8px] flex items-center justify-center" aria-hidden="true">
        <span className="text-[18px] font-semibold leading-none">拾</span>
      </div>
      <h1 className="text-[18px] font-semibold text-[#1F2329] tracking-tight whitespace-nowrap">
        拾艺院
        <span className="text-[13px] font-normal text-[#8F959E] ml-2 hidden sm:inline">
          核心知识点库
        </span>
      </h1>
    </div>
  );
}
