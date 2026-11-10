/**
 * trang quên và đặt lại mật khẩu (forgot password page - US02)
 * hỗ trợ 2 bước: gửi otp về email và nhập mật khẩu mới
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Mail, Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập otp và mật khẩu mới
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // bước 1: gửi yêu cầu otp đặt lại mật khẩu
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authService.forgotPassword({ email: email.trim() });
      if (res.success) {
        setSuccessMsg(res.message || 'mã otp đã được gửi đến email của bạn');
        setStep(2);
      }
    } catch (err) {
      setErrorMsg(err.error?.message || err.message || 'không thể gửi mã otp lúc này');
    } finally {
      setIsLoading(false);
    }
  };

  // bước 2: xác nhận mã otp và đặt lại mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('mật khẩu xác nhận không trùng khớp');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('mật khẩu mới phải có tối thiểu 8 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      if (res.success) {
        setSuccessMsg('đặt lại mật khẩu thành công! đang chuyển đến trang đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.error?.message || err.message || 'mã otp không đúng hoặc đã hết hạn');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {step === 1 ? 'Khôi phục mật khẩu' : 'Đặt mật khẩu mới'}
          </h2>
          <p className="text-xs text-slate-500">
            {step === 1
              ? 'Nhập email đã đăng ký để nhận mã OTP xác thực'
              : `Nhập mã OTP vừa gửi tới ${email} và mật khẩu mới`}
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2 p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Địa chỉ Email đã đăng ký
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vidu@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Đang gửi...' : 'Gửi mã OTP qua Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mã OTP (6 số)</label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full px-3 py-2.5 text-center font-mono tracking-widest text-lg rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu mới (≥ 8 ký tự)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nhập lại mật khẩu mới</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Đang cập nhật...' : 'Xác nhận đặt lại mật khẩu'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-500">
          Nhớ mật khẩu?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

