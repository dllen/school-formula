import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

type Step = 'register' | 'verify';

export function RegisterModal({ onClose, onSwitchToLogin }: Props) {
  const { register, verify, resendCode } = useAuth();
  const [step, setStep] = useState<Step>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      setStep('verify');
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verify(email, code);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try { await resendCode(email); setCountdown(60); }
    catch (err) { setError(err instanceof Error ? err.message : '重发失败'); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {step === 'register' ? '注册拾艺院' : '验证邮箱'}
        </h2>
        {error && <div className="bg-red-50 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

        {step === 'register' ? (
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
              {loading ? '发送中...' : '注册并发送验证码'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-gray-600">验证码已发送至 <strong>{email}</strong></p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">6 位验证码</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-2xl tracking-widest"
                placeholder="000000" maxLength={6} required />
            </div>
            <button type="submit" disabled={loading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {loading ? '验证中...' : '验证并登录'}
            </button>
            <button type="button" onClick={handleResend} disabled={countdown > 0}
              className="w-full text-sm text-gray-500 hover:text-blue-600 disabled:opacity-50">
              {countdown > 0 ? `${countdown}秒后可重发` : '重发验证码'}
            </button>
          </form>
        )}

        {onSwitchToLogin && step === 'register' && (
          <p className="mt-6 text-center text-sm text-gray-500">
            已有账号？{' '}
            <button onClick={onSwitchToLogin} className="text-blue-600 font-medium hover:underline">直接登录</button>
          </p>
        )}
      </div>
    </div>
  );
}
