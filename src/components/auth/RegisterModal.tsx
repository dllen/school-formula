import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

// 方案 2：注册免邮箱验证 —— 单步注册，后端直接签发 token，注册即登录
export function RegisterModal({ onClose, onSwitchToLogin }: Props) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      // 注册即登录：后端直接签发 token，关闭弹窗
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">注册拾艺院</h2>
        {error && <div className="bg-red-50 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="your@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="至少 8 位" minLength={8} required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? '注册中...' : '立即注册'}
          </button>
        </form>

        {onSwitchToLogin && (
          <p className="mt-6 text-center text-sm text-gray-500">
            已有账号？{' '}
            <button onClick={onSwitchToLogin} className="text-blue-600 font-medium hover:underline">直接登录</button>
          </p>
        )}
      </div>
    </div>
  );
}
