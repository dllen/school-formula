interface Props {
  requiredTier: 'plus' | 'pro';
  onClose: () => void;
}

const TIER_INFO = {
  plus: {
    name: 'Plus',
    emoji: '⭐',
    price: '¥19/月',
    features: ['全部练习题库', '错题本', '学习进度追踪', '学习笔记', '教程系统'],
  },
  pro: {
    name: 'Pro',
    emoji: '👑',
    price: '¥49/月',
    features: ['Plus 全部功能', 'AI 智能助教（免配置）', '会员专属内容', '优先客服支持'],
  },
};

export function PaywallModal({ requiredTier, onClose }: Props) {
  const info = TIER_INFO[requiredTier];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-4">{info.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">升级至 {info.name}</h2>
        <p className="text-gray-600 mb-6">解锁更多学习功能，助力孩子成长</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="text-2xl font-bold text-blue-600 mb-3">{info.price}</div>
          <ul className="text-left space-y-2">
            {info.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <button disabled
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium opacity-75 cursor-not-allowed">
          即将开放
        </button>
        <p className="mt-3 text-xs text-gray-400">支付功能即将上线，敬请期待</p>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:text-gray-700">稍后再说</button>
      </div>
    </div>
  );
}
