/**
 * trang xác thực mã otp (verify otp page - US01)
 * thương hiệu: gia sư việt
 * chữ to rõ, dễ nhìn, đếm ngược 5 phút
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import logoIcon from '../../assets/logo-icon.png';
import { AlertCircle, CheckCircle2, RotateCw, ArrowRight } from 'lucide-react';

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
      setErrorMsg('Vui lòng nhập địa chỉ email cần xác thực');
      return;
    }

    if (otp.length !== 6) {
      setErrorMsg('Mã OTP phải gồm đúng 6 chữ số');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.verifyOtp({ email: email.trim(), otp: otp.trim() });
      if (res.success) {
        setSuccessMsg('Xác thực tài khoản thành công! Đang chuyển đến trang đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.error?.message || err.message || 'Mã OTP không chính xác hoặc đã hết hạn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMsg('Vui lòng nhập email để nhận lại mã OTP');
      return;
    }

    setIsResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authService.resendOtp({ email: email.trim() });
      if (res.success) {
        setSuccessMsg('Mã OTP mới đã được gửi lại vào email của bạn');
        setTimeLeft(300);
      }
    } catch (err) {
      setErrorMsg(err.error?.message || err.message || 'Không thể gửi lại mã OTP lúc này');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-7">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <img src={logoIcon} alt="Logo Gia Sư Việt" className="w-16 h-16 object-contain rounded-full shadow-md" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Xác thực mã OTP
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Mã OTP 6 chữ số đã được gửi tới email của bạn (hoặc hiển thị tại console máy chủ).
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-3 p-3.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-3 p-3.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Địa chỉ Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vidu@gmail.com"
              className="w-full px-4 py-3 text-base rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-slate-700">Mã OTP (6 chữ số)</label>
              <span className={`text-xs font-bold ${timeLeft <= 60 ? 'text-rose-500' : 'text-slate-500'}`}>
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
              className="w-full px-4 py-3.5 text-center text-2xl font-mono tracking-[0.5em] rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-extrabold text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || timeLeft <= 0}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Đang xác thực...' : 'Xác nhận mã OTP'}</span>
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-100">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-bold disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
            <span>Chưa nhận được mã? Gửi lại mã mới</span>
          </button>
        </div>

        <p className="text-center text-sm text-slate-500">
          Quay lại{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
