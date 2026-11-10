/**
 * trang đăng nhập tài khoản (US02)
 * giao diện trực quan, hỗ trợ ẩn hiện mật khẩu và phím tắt thử nghiệm 4 vai trò
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
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
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng nhập</h2>
          <p className="text-xs text-slate-500">
            Chào mừng bạn quay trở lại với nền tảng kết nối gia sư
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nguyenvan@gmail.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Mật khẩu
              </label>
              <Link to="/forgot-password" className="text-[11px] text-blue-600 font-medium hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 pt-1">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Đăng ký tài khoản
          </Link>
        </p>

        {/* Khối tài khoản mẫu thử nghiệm */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
            Chọn nhanh tài khoản để thử nghiệm
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFormData({ email: 'hocvien@test.com', password: 'Password123!' })}
              className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/60 hover:bg-blue-100/80 text-blue-800 text-left transition-all"
            >
              <div className="font-bold flex items-center gap-1">🎓 Học viên</div>
              <div className="text-[10px] text-slate-500 truncate">hocvien@test.com</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ email: 'giasu@test.com', password: 'Password123!' })}
              className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-800 text-left transition-all"
            >
              <div className="font-bold flex items-center gap-1">👨‍🏫 Gia sư</div>
              <div className="text-[10px] text-slate-500 truncate">giasu@test.com</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ email: 'trungtam@test.com', password: 'Password123!' })}
              className="p-2.5 rounded-xl border border-purple-100 bg-purple-50/60 hover:bg-purple-100/80 text-purple-800 text-left transition-all"
            >
              <div className="font-bold flex items-center gap-1">🏫 Trung tâm</div>
              <div className="text-[10px] text-slate-500 truncate">trungtam@test.com</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ email: 'admin@test.com', password: 'Password123!' })}
              className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/60 hover:bg-rose-100/80 text-rose-800 text-left transition-all"
            >
              <div className="font-bold flex items-center gap-1">🛡️ Quản trị viên</div>
              <div className="text-[10px] text-slate-500 truncate">admin@test.com</div>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            Mật khẩu mặc định: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">Password123!</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
