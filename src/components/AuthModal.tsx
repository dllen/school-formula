import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

type View = 'login' | 'register' | 'verify' | 'forgot' | 'reset';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 认证弹窗：登录 / 注册 / 验证邮箱 / 忘记密码 / 重置密码
 * - 注册成功 → 自动切到 view='verify'（后端已发验证码）
 * - 登录时收到 EMAIL_NOT_VERIFIED(403) → 切 view='verify'，回填 email
 * - 忘记密码发送成功 → 自动切 view='reset'，回填 email
 */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, verify, resendCode, forgotPassword, resetPassword } = useAuth();
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // 弹窗打开时重置所有输入与消息
  useEffect(() => {
    if (isOpen) {
      setView('login');
      setPassword('');
      setConfirmPassword('');
      setCode('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showError = (msg: string) => {
    setError(msg);
    setSuccess('');
  };
  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setError('');
  };
  const errMessage = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!EMAIL_REGEX.test(email.trim())) return showError('邮箱格式不正确');
    if (password.length < 8) return showError('密码至少 8 位');
    setLoading(true);
    try {
      await login(email.trim(), password);
      onClose();
    } catch (err) {
      // 后端 login 对未激活邮箱返回 403 EMAIL_NOT_VERIFIED
      const e2 = err as Error & { code?: string };
      if (e2.code === 'EMAIL_NOT_VERIFIED') {
        setView('verify');
        showError('请先验证邮箱');
      } else {
        showError(errMessage(err, '登录失败'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!EMAIL_REGEX.test(email.trim())) return showError('邮箱格式不正确');
    if (password.length < 8) return showError('密码至少 8 位');
    if (password !== confirmPassword) return showError('两次密码不一致');
    setLoading(true);
    try {
      await register(email.trim(), password);
      setView('verify');
      showSuccess('注册成功，验证码已发送，请查收邮件');
    } catch (err) {
      const e2 = err as Error & { code?: string };
      if (e2.code === 'EMAIL_TAKEN') {
        showError('该邮箱已被注册');
      } else {
        showError(errMessage(err, '注册失败'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!code || code.length !== 6) return showError('请输入 6 位验证码');
    setLoading(true);
    try {
      await verify(email.trim(), code.trim());
      onClose();
    } catch (err) {
      const e2 = err as Error & { code?: string };
      if (e2.code === 'CODE_EXPIRED') {
        showError('验证码已过期，请重新获取');
      } else if (e2.code === 'INVALID_CODE') {
        showError('验证码错误');
      } else {
        showError(errMessage(err, '验证失败'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    if (!EMAIL_REGEX.test(email.trim())) return showError('请先填写邮箱');
    setLoading(true);
    try {
      await resendCode(email.trim());
      showSuccess('验证码已重发');
    } catch (err) {
      const e2 = err as Error & { status?: number };
      // 后端 resend 只对未激活邮箱发码；404 = 用户不存在或已验证
      if (e2.status === 404) {
        setView('login');
        showError('该邮箱已注册，请直接登录');
      } else {
        showError(errMessage(err, '重发失败'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!EMAIL_REGEX.test(email.trim())) return showError('邮箱格式不正确');
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setView('reset');
      showSuccess('重置码已发送，请查收邮件');
    } catch (err) {
      showError(errMessage(err, '发送失败'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!code || code.length !== 6) return showError('请输入 6 位重置码');
    if (password.length < 8) return showError('新密码至少 8 位');
    if (password !== confirmPassword) return showError('两次密码不一致');
    setLoading(true);
    try {
      await resetPassword(email.trim(), code.trim(), password);
      setView('login');
      setPassword('');
      setConfirmPassword('');
      setCode('');
      showSuccess('密码重置成功，请登录');
    } catch (err) {
      showError(errMessage(err, '重置失败'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">
            {view === 'login' && '登录'}
            {view === 'register' && '注册'}
            {view === 'verify' && '验证邮箱'}
            {view === 'forgot' && '忘记密码'}
            {view === 'reset' && '重置密码'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none">
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* 登录/注册 Tab */}
          {(view === 'login' || view === 'register') && (
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                登录
              </button>
              <button
                type="button"
                onClick={() => {
                  setView('register');
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                注册
              </button>
            </div>
          )}

          {/* 错误 / 成功提示 */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-green-600 text-sm">{success}</div>
          )}

          {/* ============ 登录视图 ============ */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="至少 8 位"
                  autoComplete="current-password"
                />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  忘记密码？
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-200"
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </form>
          )}

          {/* ============ 注册视图 ============ */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="至少 8 位"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="再次输入密码"
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-200"
              >
                {loading ? '注册中...' : '注册'}
              </button>
            </form>
          )}

          {/* ============ 验证邮箱视图 ============ */}
          {view === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm text-gray-500">
                我们已向 <span className="font-medium text-gray-700">{email}</span> 发送了 6 位验证码，10 分钟内有效。
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-center text-xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-200"
              >
                {loading ? '验证中...' : '验证并登录'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                >
                  没收到？重新发送
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  返回登录
                </button>
              </div>
            </form>
          )}

          {/* ============ 忘记密码视图 ============ */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-sm text-gray-500">输入注册邮箱，我们将发送密码重置码。</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-200"
              >
                {loading ? '发送中...' : '发送重置码'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  返回登录
                </button>
              </div>
            </form>
          )}

          {/* ============ 重置密码视图 ============ */}
          {view === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-sm text-gray-500">
                重置码已发送至 <span className="font-medium text-gray-700">{email}</span>，10 分钟内有效。
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">重置码</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-center text-xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="至少 8 位"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="再次输入新密码"
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-200"
              >
                {loading ? '重置中...' : '重置密码'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
