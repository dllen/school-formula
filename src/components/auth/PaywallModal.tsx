import { Icon } from '../icons/Icon';
interface Props {
  requiredTier: 'plus' | 'pro';
  onClose: () => void;
}

const TIER_INFO = {
  plus: {
    name: 'Plus',
    icon: 'star' as const,
    price: '¥19/月',
    features: ['全部练习题库', '错题本', '学习进度追踪', '学习笔记', '教程系统'],
  },
  pro: {
    name: 'Pro',
    icon: 'trophy' as const,
    price: '¥49/月',
    features: ['Plus 全部功能', 'AI 智能助教（免配置）', '会员专属内容', '优先客服支持'],
  },
};

export function PaywallModal({ requiredTier, onClose }: Props) {
  const info = TIER_INFO[requiredTier];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
        <Icon name={info.icon} className="w-12 h-12 mb-4 text-accent" />
        <h2 className="text-2xl font-bold text-ink mb-2">升级至 {info.name}</h2>
        <p className="text-ink-2 mb-6">解锁更多学习功能，助力孩子成长</p>
        <div className="bg-paper-2 rounded-xl p-4 mb-6">
          <div className="text-2xl font-bold text-accent mb-3">{info.price}</div>
          <ul className="text-left space-y-2">
            {info.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-ink-2">
                <Icon name="check" className="w-4 h-4 text-success shrink-0" />{f}
              </li>
            ))}
          </ul>
        </div>
        <button disabled
          className="w-full bg-accent text-accent-ink py-3 rounded-lg font-medium opacity-75 cursor-not-allowed">
          即将开放
        </button>
        <p className="mt-3 text-xs text-ink-3">支付功能即将上线，敬请期待</p>
        <button onClick={onClose} className="mt-4 text-sm text-ink-3 hover:text-ink-2">稍后再说</button>
      </div>
    </div>
  );
}
