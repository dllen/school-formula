import { useState, useEffect } from 'react';
import { authApi } from '../../services/auth';

interface Props {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

type Step = 'email' | 'verify';

export function ForgotPasswordModal({ onClose, onSwitchToLogin }: Props) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await authApi.forgot(email);
      if (!resp.ok) throw new Error('发送失败，请检查邮箱');
      setStep('verify');
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await authApi.reset(email, code, password);
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || '重置失败');
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置失败');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">密码重置成功</h2>
          <p className="text-gray-600 mb-6">请使用新密码登录</p>
          {onSwitchToLogin && (
            <button onClick={onSwitchToLogin}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700">去登录</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">重置密码</h2>
        {error && <div className="bg-red-50 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">注册邮箱</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? '发送中...' : '发送验证码'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-2xl tracking-widest"
                maxLength={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                minLength={8} required />
            </div>
            <button type="submit" disabled={loading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? '重置中...' : '重置密码'}
            </button>
            <button type="button" disabled={countdown > 0}
              onClick={async () => { await authApi.forgot(email); setCountdown(60); }}
              className="w-full text-sm text-gray-500 hover:text-blue-600 disabled:opacity-50">
              {countdown > 0 ? `${countdown}秒后可重发` : '重发验证码'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
