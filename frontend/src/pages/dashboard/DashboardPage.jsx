/**
 * trang bảng điều khiển cá nhân (dashboard)
 * thương hiệu: gia sư việt - kết nối gia sư, nâng tầm tri thức
 * chữ to rõ ràng, trình bày mạch lạc, dễ thao tác
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import logoIcon from '../../assets/logo-icon.png';
import {
  User,
  Shield,
  CheckCircle,
  Clock,
  RefreshCw,
  Layers,
  GraduationCap,
  Building2,
  UserCheck,
} from 'lucide-react';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [apiResponseStatus, setApiResponseStatus] = useState('');

  const handleFetchLiveProfile = async () => {
    setIsLoadingProfile(true);
    setApiResponseStatus('');
    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setProfileData(res.data);
        updateUser(res.data);
        setApiResponseStatus('Đã kết nối và xác thực API /users/me thành công!');
      }
    } catch (err) {
      setApiResponseStatus('Lỗi khi gọi API: ' + (err.error?.message || err.message));
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case 'student':
        return {
          title: 'Học viên / Phụ huynh',
          desc: 'Tìm kiếm người dạy kèm & quản lý lớp học',
          icon: <UserCheck className="w-6 h-6 text-blue-600" />,
        };
      case 'tutor':
        return {
          title: 'Gia sư / Giáo viên',
          desc: 'Nhận lớp dạy kèm & xác minh hồ sơ chuyên môn',
          icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
        };
      case 'center':
        return {
          title: 'Trung tâm đào tạo',
          desc: 'Đăng tin tuyển dụng & quản lý giáo viên',
          icon: <Building2 className="w-6 h-6 text-purple-600" />,
        };
      case 'admin':
        return {
          title: 'Quản trị viên hệ thống',
          desc: 'Kiểm duyệt hồ sơ, tin đăng & người dùng',
          icon: <Shield className="w-6 h-6 text-rose-600" />,
        };
      default:
        return { title: role, desc: '', icon: <User className="w-6 h-6" /> };
    }
  };

  const roleInfo = getRoleInfo(user?.role);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-9">
      {/* 1. Thẻ Chào Mừng & Thông Tin Người Dùng */}
      <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-blue-500/25 flex-shrink-0">
            {user?.fullName ? user.fullName[0].toUpperCase() : <User className="w-10 h-10" />}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Xin chào, {user?.fullName || user?.email.split('@')[0]}!
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                {roleInfo.icon}
                <span>{roleInfo.title}</span>
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Email: <span className="font-semibold text-slate-700">{user?.email}</span> • Trạng thái:{' '}
              <span className={`font-bold ${user?.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {user?.status === 'active' ? 'Đã kích hoạt' : 'Đang chờ duyệt'}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchLiveProfile}
          disabled={isLoadingProfile}
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingProfile ? 'animate-spin text-blue-600' : ''}`} />
          <span>Kiểm tra kết nối API Backend</span>
        </button>
      </div>

      {apiResponseStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2.5 font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{apiResponseStatus}</span>
        </div>
      )}

      {/* 2. Tổng Quan Nền Tảng & Lộ Trình Triển Khai */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột Trái: Trạng thái Sprint 1 */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                  Sprint 1: Nền Tảng & Xác Thực (US01, US02)
                </h3>
                <p className="text-sm text-slate-500">
                  GIA SƯ VIỆT – Đã hoàn thiện và kiểm thử đạt chuẩn
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              Sẵn Sàng
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <p className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <Shield className="w-5 h-5 text-blue-600" /> Hệ thống Backend
              </p>
              <ul className="space-y-2 text-slate-600">
                <li>✓ 16 Mô hình CSDL Mongoose hoàn chỉnh</li>
                <li>✓ API RESTful chuẩn /api/v1/auth & /api/v1/users</li>
                <li>✓ Chuẩn hóa định dạng phản hồi ({`{ success, message, data }`})</li>
                <li>✓ Đăng ký, OTP email, Đăng nhập JWT, Cookie HttpOnly</li>
                <li>✓ Phân quyền RBAC, Giới hạn tần suất gọi, Mã hóa AES-256</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <p className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <Layers className="w-5 h-5 text-indigo-600" /> Giao diện Frontend
              </p>
              <ul className="space-y-2 text-slate-600">
                <li>✓ Giao diện Gia Sư Việt hiện đại, chữ to rõ ràng</li>
                <li>✓ Logo chính thức & Favicon đồng bộ</li>
                <li>✓ Form đăng ký tinh gọn: Học viên, Gia sư, Trung tâm</li>
                <li>✓ axiosClient tự động Refresh Token khi token hết hạn</li>
                <li>✓ Bảo vệ phiên làm việc an toàn trong bộ nhớ (in-memory)</li>
              </ul>
            </div>
          </div>

          {profileData && (
            <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto space-y-2">
              <p className="text-emerald-400 font-bold mb-2">// Dữ liệu trả về từ GET /api/v1/users/me:</p>
              <pre>{JSON.stringify(profileData, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Cột Phải: Các Sprint Tiếp Theo */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Các Bước Tiếp Theo</h3>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Sprint 3: Hồ sơ & Xác minh</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-bold">Tuần 3</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cập nhật thông tin gia sư, tải lên CCCD/bằng cấp, trang quản trị phê duyệt hồ sơ.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Sprint 4: Đăng tin & Tìm kiếm</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-bold">Tuần 4</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đăng yêu cầu tìm gia sư, bộ lọc theo môn học, khu vực, học phí, kiểm duyệt tin.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Sprint 5: Kết nối lớp học</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-bold">Tuần 5</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gia sư ứng tuyển, học viên chấp nhận lớp, mở số điện thoại & địa chỉ cho hai bên.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Sprint 6: Trò chuyện & Đánh giá</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-bold">Tuần 6</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nhắn tin trực tiếp qua Socket.IO, thông báo đẩy, chấm điểm đánh giá sau khi học.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
