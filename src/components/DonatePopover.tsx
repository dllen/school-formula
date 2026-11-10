import { useEffect, useId, useRef, useState } from 'react';

interface DonatePopoverProps {
  /** 触发按钮的文字，如「赞赏支持」「赞赏」 */
  triggerLabel: string;
}

const CHANNELS = [
  { src: '/donate/alipay.jpg', alt: '支付宝收款码', label: '支付宝' },
  { src: '/donate/wechat.jpg', alt: '微信收款码', label: '微信支付' },
] as const;

/**
 * 打赏入口：一个轻量 Popover，向上展开支付宝与微信两张收款码。
 *
 * 根节点是定位锚点；面板内容只在打开时挂载，所以二维码图片不会进首屏，
 * 预渲染输出的 HTML 里也只有一个触发按钮。
 */
export function DonatePopover({ triggerLabel }: DonatePopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // 关闭：点击组件外部
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  // 关闭：Esc
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? panelId : undefined}
        className="text-sm text-ink-2 transition-colors hover:text-accent"
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="赞赏支持"
          tabIndex={-1}
          className="absolute bottom-full left-0 z-30 mb-2 w-max max-w-[calc(100vw-2rem)] rounded-xl border border-rule bg-card p-4 shadow-pop outline-none"
        >
          <p className="mb-2.5 text-xs text-ink-3">如果内容对您有帮助，欢迎扫码支持</p>
          <div className="flex items-start gap-4">
            {CHANNELS.map((channel) => (
              <figure key={channel.src} className="m-0">
                <img
                  src={channel.src}
                  alt={channel.alt}
                  className="h-auto max-h-[260px] w-[148px] rounded-md border border-rule bg-card object-contain sm:w-[168px]"
                />
                <figcaption className="mt-1.5 text-center text-xs text-ink-2">
                  {channel.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
