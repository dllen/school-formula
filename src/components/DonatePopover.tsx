import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './icons/Icon';

interface DonatePopoverProps {
  /** 触发按钮的文字，如「赞赏支持」「赞赏」 */
  triggerLabel: string;
  /** 触发按钮的视觉变体，默认 text */
  triggerVariant?: 'text' | 'tag';
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
export function DonatePopover({ triggerLabel, triggerVariant = 'text' }: DonatePopoverProps) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
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

  // 焦点：打开时移入面板，关闭时还给触发器。
  // wasOpenRef 让首次挂载（open 为 false）不要去抢页面焦点。
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
    }
  }, [open]);

  // 页脚用 text（低调的文字链），详情页用 tag（带图标的标签）。
  const triggerClass =
    triggerVariant === 'tag'
      ? 'inline-flex items-center gap-1.5 rounded-lg border border-rule bg-card px-3 py-1.5 text-sm text-ink-2 transition-colors hover:border-accent hover:text-accent'
      : 'text-sm text-ink-2 transition-colors hover:text-accent';

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? panelId : undefined}
        className={triggerClass}
      >
        {triggerVariant === 'tag' && <Icon name="sparkle" className="h-4 w-4" />}
        {triggerLabel}
      </button>

      {open && (
        <div
          id={panelId}
          ref={panelRef}
          role="dialog"
          aria-label="赞赏支持"
          tabIndex={-1}
          className="absolute bottom-full left-0 z-30 mb-2 w-max max-w-[calc(100vw-2rem)] rounded-xl border border-rule bg-card p-4 shadow-pop outline-none"
        >
          <p className="mb-2.5 text-xs text-ink-3">如果内容对您有帮助，欢迎扫码支持</p>
          <div className="flex items-start gap-4">
            {CHANNELS.map((channel) => (
              <figure key={channel.src} className="m-0">
                {failed[channel.src] ? (
                  <div className="flex h-[148px] w-[148px] items-center justify-center rounded-md border border-rule bg-card px-2 text-center text-xs text-ink-3 sm:h-[168px] sm:w-[168px]">
                    二维码加载失败
                  </div>
                ) : (
                  <img
                    src={channel.src}
                    alt={channel.alt}
                    onError={() => setFailed((prev) => ({ ...prev, [channel.src]: true }))}
                    className="h-auto max-h-[260px] w-[148px] rounded-md border border-rule bg-card object-contain sm:w-[168px]"
                  />
                )}
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
