/**
 * trang đăng ký tài khoản (US01)
 * thương hiệu: gia sư việt - kết nối gia sư, nâng tầm tri thức
 * thiết kế tinh gọn 3 ô nhập, chữ to rõ ràng, dễ nhìn
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import logoIcon from '../../assets/logo-icon.png';
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-7">
        {/* Logo và tiêu đề */}
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
            Đăng ký tài khoản mới chỉ trong 1 phút
          </p>
        </div>

        {/* Lựa chọn vai trò to rõ ràng */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
              role === 'student'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-extrabold shadow-sm'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <UserCheck className="w-6 h-6 text-blue-600" />
            <div className="text-sm sm:text-base font-bold leading-tight">Học viên</div>
            <div className="text-xs text-slate-500 font-normal">Tìm người dạy</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('tutor')}
            className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
              role === 'tutor'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-extrabold shadow-sm'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <div className="text-sm sm:text-base font-bold leading-tight">Gia sư</div>
            <div className="text-xs text-slate-500 font-normal">Nhận lớp dạy</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('center')}
            className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
              role === 'center'
                ? 'border-purple-600 bg-purple-50 text-purple-700 font-extrabold shadow-sm'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Building2 className="w-6 h-6 text-purple-600" />
            <div className="text-sm sm:text-base font-bold leading-tight">Trung tâm</div>
            <div className="text-xs text-slate-500 font-normal">Tuyển giáo viên</div>
          </button>
        </div>

        {/* Thông báo lỗi */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-3.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form nhập thông tin */}
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
                className={`w-full pl-11 pr-4 py-3 text-base rounded-xl border ${
                  fieldErrors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
            </div>
            {fieldErrors.email && <p className="text-rose-500 text-xs mt-1.5">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="0912 345 678"
                className={`w-full pl-11 pr-4 py-3 text-base rounded-xl border ${
                  fieldErrors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
            </div>
            {fieldErrors.phone && <p className="text-rose-500 text-xs mt-1.5">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Mật khẩu (từ 8 ký tự trở lên)
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu an toàn..."
                className={`w-full pl-11 pr-11 py-3 text-base rounded-xl border ${
                  fieldErrors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-rose-500 text-xs mt-1.5">{fieldErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <span>{isLoading ? 'Đang khởi tạo tài khoản...' : 'Đăng ký tài khoản ngay'}</span>
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>

          <p className="text-xs text-center text-slate-500 leading-normal pt-1">
            Bằng việc nhấn Đăng ký, bạn đồng ý với{' '}
            <a href="#" className="text-blue-600 font-semibold hover:underline">Điều khoản dịch vụ</a> và{' '}
            <a href="#" className="text-blue-600 font-semibold hover:underline">Chính sách bảo mật</a> của Gia Sư Việt.
          </p>
        </form>

        <p className="text-center text-sm text-slate-600 pt-3 border-t border-slate-100">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
