/**
 * trang đăng ký tài khoản (US01)
 * thiết kế tinh gọn, tự nhiên, giúp người dùng đăng ký nhanh chóng trong 3 bước ngắn:
 * 1. chọn vai trò (học viên, gia sư/giáo viên, trung tâm)
 * 2. nhập email, số điện thoại và mật khẩu
 * 3. bấm đăng ký và nhận mã xác thực otp
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import {
  GraduationCap,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();

  // vai trò mặc định ban đầu
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    if (formData.password.length < 8) {
      setFieldErrors({ password: 'Mật khẩu cần tối thiểu 8 ký tự' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.register({
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role,
        agreeTerms: true,
      });

      if (res.success) {
        // chuyển ngay sang trang xác thực mã otp
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email.trim())}`);
      }
    } catch (err) {
      if (err.error?.details) {
        const errorsObj = {};
        err.error.details.forEach((item) => {
          errorsObj[item.field] = item.message;
        });
        setFieldErrors(errorsObj);
      } else {
        setErrorMsg(err.error?.message || err.message || 'Đăng ký không thành công, vui lòng thử lại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Tiêu đề ngắn gọn, thân thiện */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng ký tài khoản</h2>
          <p className="text-xs text-slate-500">
            Bạn tham gia với tư cách nào? Hãy chọn bên dưới nhé
          </p>
        </div>

        {/* Lựa chọn vai trò (Học viên, Gia sư, Trung tâm) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-bold shadow-sm'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <UserCheck className="w-5 h-5 text-blue-600" />
            <div className="text-xs font-semibold leading-tight">Học viên</div>
            <div className="text-[10px] text-slate-400 font-normal">Tìm người dạy</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('tutor')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
              role === 'tutor'
                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-700 font-bold shadow-sm'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <div className="text-xs font-semibold leading-tight">Gia sư</div>
            <div className="text-[10px] text-slate-400 font-normal">Nhận lớp dạy</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('center')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
              role === 'center'
                ? 'border-purple-600 bg-purple-50/80 text-purple-700 font-bold shadow-sm'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Building2 className="w-5 h-5 text-purple-600" />
            <div className="text-xs font-semibold leading-tight">Trung tâm</div>
            <div className="text-[10px] text-slate-400 font-normal">Tuyển giáo viên</div>
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMsg && (
          <div className="flex items-start gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form nhập thông tin cốt lõi (chỉ 3 ô: Email, SĐT, Mật khẩu) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
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
                className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border ${
                  fieldErrors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
            </div>
            {fieldErrors.email && <p className="text-rose-500 text-[11px] mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="0912 345 678"
                className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border ${
                  fieldErrors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
            </div>
            {fieldErrors.phone && <p className="text-rose-500 text-[11px] mt-1">{fieldErrors.phone}</p>}
          </div>

          {/* Mật khẩu có nút bật/tắt hiển thị */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mật khẩu (từ 8 ký tự)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu an toàn..."
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border ${
                  fieldErrors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-rose-500 text-[11px] mt-1">{fieldErrors.password}</p>}
          </div>

          {/* Nút bấm Đăng ký */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>

          {/* Ghi chú điều khoản tinh gọn, tự nhiên */}
          <p className="text-[11px] text-center text-slate-400 leading-normal pt-1">
            Bằng việc nhấn Đăng ký, bạn đồng ý với{' '}
            <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a> và{' '}
            <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a> của nền tảng.
          </p>
        </form>

        {/* Chuyển sang đăng nhập */}
        <p className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
