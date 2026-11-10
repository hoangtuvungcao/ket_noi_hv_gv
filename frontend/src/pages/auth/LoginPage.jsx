/**
 * trang đăng nhập tài khoản (US02)
 * thương hiệu: gia sư việt - kết nối gia sư, nâng tầm tri thức
 * kích thước chữ to rõ, dễ nhìn, hỗ trợ phím tắt 1-click test tài khoản
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import logoIcon from '../../assets/logo-icon.png';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.success && res.data) {
        login(res.data.user, res.data.accessToken);
        const origin = location.state?.from?.pathname || '/dashboard';
        navigate(origin, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.error?.message || err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-7">
        {/* Logo và tiêu đề thương hiệu */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <img src={logoIcon} alt="Logo Gia Sư Việt" className="w-16 h-16 object-contain rounded-full shadow-md" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            GIA SƯ <span className="text-blue-600">VIỆT</span>
          </h2>
          <p className="text-xs uppercase font-bold text-amber-500 tracking-wider">
            Kết nối gia sư - Nâng tầm tri thức
          </p>
          <p className="text-sm sm:text-base text-slate-500 pt-1">
            Đăng nhập vào tài khoản của bạn
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-3 p-3.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nguyenvan@gmail.com"
                className="w-full pl-11 pr-4 py-3 text-base rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-slate-700">
                Mật khẩu
              </label>
              <Link to="/forgot-password" className="text-xs sm:text-sm text-blue-600 font-bold hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-11 pr-11 py-3 text-base rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <span>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}</span>
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 pt-1">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Đăng ký tài khoản ngay
          </Link>
        </p>

        {/* Khối chọn nhanh tài khoản mẫu */}
        <div className="pt-5 border-t border-slate-100 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            Chọn nhanh tài khoản để kiểm thử
          </p>
          <div className="grid grid-cols-2 gap-2.5 text-sm">
            <button
              type="button"
              onClick={() => setFormData({ email: 'hocvien@test.com', password: 'Password123!' })}
              className="p-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 text-left transition-all"
            >
              <div className="font-extrabold flex items-center gap-1.5">🎓 Học viên</div>
              <div className="text-xs text-blue-700/80 truncate">hocvien@test.com</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ email: 'giasu@test.com', password: 'Password123!' })}
              className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-left transition-all"
            >
              <div className="font-extrabold flex items-center gap-1.5">👨‍🏫 Gia sư</div>
              <div className="text-xs text-emerald-700/80 truncate">giasu@test.com</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ email: 'trungtam@test.com', password: 'Password123!' })}
              className="p-3 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-900 text-left transition-all"
            >
              <div className="font-extrabold flex items-center gap-1.5">🏫 Trung tâm</div>
              <div className="text-xs text-purple-700/80 truncate">trungtam@test.com</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ email: 'admin@test.com', password: 'Password123!' })}
              className="p-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-900 text-left transition-all"
            >
              <div className="font-extrabold flex items-center gap-1.5">🛡️ Quản trị viên</div>
              <div className="text-xs text-rose-700/80 truncate">admin@test.com</div>
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Mật khẩu mặc định: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">Password123!</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
