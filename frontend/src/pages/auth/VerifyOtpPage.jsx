/**
 * trang xác thực mã otp (verify otp page - US01)
 * hỗ trợ nhập mã 6 số, đếm ngược thời gian hết hạn (5 phút) và nút gửi lại mã
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { KeyRound, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // lấy email từ query param ?email=...
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // đếm ngược thời gian hiệu lực của mã otp
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('vui lòng nhập địa chỉ email cần xác thực');
      return;
    }

    if (otp.length !== 6) {
      setErrorMsg('mã otp phải gồm đúng 6 chữ số');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.verifyOtp({ email: email.trim(), otp: otp.trim() });
      if (res.success) {
        setSuccessMsg('xác thực tài khoản thành công! đang chuyển đến trang đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.error?.message || err.message || 'mã otp không chính xác hoặc đã hết hạn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMsg('vui lòng nhập email để nhận lại mã otp');
      return;
    }

    setIsResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authService.resendOtp({ email: email.trim() });
      if (res.success) {
        setSuccessMsg('mã otp mới đã được gửi lại vào email của bạn');
        setTimeLeft(300); // đặt lại đồng hồ 5 phút
      }
    } catch (err) {
      setErrorMsg(err.error?.message || err.message || 'không thể gửi lại mã otp lúc này');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Xác thực mã OTP</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mã xác nhận 6 chữ số đã được gửi tới địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến (hoặc thư rác).
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

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Địa chỉ Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vidu@gmail.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">Mã OTP (6 số)</label>
              <span className={`text-[11px] font-semibold ${timeLeft <= 60 ? 'text-rose-500' : 'text-slate-500'}`}>
                Hết hạn sau: {formatTime(timeLeft)}
              </span>
            </div>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="123456"
              className="w-full px-3 py-3 text-center text-xl font-mono tracking-[0.5em] rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-bold text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || timeLeft <= 0}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Đang xác thực...' : 'Xác nhận mã OTP'}
          </button>
        </form>

        {/* Nút gửi lại mã */}
        <div className="pt-2 text-center border-t border-slate-100">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>Chưa nhận được mã? Gửi lại mã mới</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Quay lại{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

