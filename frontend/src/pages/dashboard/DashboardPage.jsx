/**
 * trang bảng điều khiển cá nhân (dashboard)
 * hiển thị thông tin tài khoản, vai trò và dữ liệu cá nhân theo ngôn từ tự nhiên, chuẩn mực
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
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
  MapPin,
  BookOpen,
} from 'lucide-react';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [apiResponseStatus, setApiResponseStatus] = useState('');

  // gọi thử api /users/me để kiểm tra token và dữ liệu live từ backend
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
          icon: <UserCheck className="w-5 h-5 text-blue-600" />,
          color: 'blue',
        };
      case 'tutor':
        return {
          title: 'Gia sư / Giáo viên',
          desc: 'Nhận lớp dạy kèm & xác minh hồ sơ chuyên môn',
          icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
          color: 'emerald',
        };
      case 'center':
        return {
          title: 'Trung tâm đào tạo',
          desc: 'Đăng tin tuyển dụng & quản lý giáo viên',
          icon: <Building2 className="w-5 h-5 text-purple-600" />,
          color: 'purple',
        };
      case 'admin':
        return {
          title: 'Quản trị viên hệ thống',
          desc: 'Kiểm duyệt hồ sơ, tin đăng & người dùng',
          icon: <Shield className="w-5 h-5 text-rose-600" />,
          color: 'rose',
        };
      default:
        return { title: role, desc: '', icon: <User className="w-5 h-5" />, color: 'slate' };
    }
  };

  const roleInfo = getRoleInfo(user?.role);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Thẻ Chào Mừng & Thông Tin Người Dùng */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-500/20 flex-shrink-0">
            {user?.fullName ? user.fullName[0].toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Xin chào, {user?.fullName || user?.email.split('@')[0]}!
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {roleInfo.icon}
                <span>{roleInfo.title}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Email: <span className="font-medium text-slate-700">{user?.email}</span> • Trạng thái:{' '}
              <span className={`font-semibold ${user?.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {user?.status === 'active' ? 'Đã kích hoạt' : 'Đang chờ duyệt'}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchLiveProfile}
          disabled={isLoadingProfile}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProfile ? 'animate-spin' : ''}`} />
          <span>Kiểm tra kết nối API Backend</span>
        </button>
      </div>

      {apiResponseStatus && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{apiResponseStatus}</span>
        </div>
      )}

      {/* 2. Tổng Quan Nền Tảng & Lộ Trình Triển Khai */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột Trái: Trạng thái Sprint 1 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Sprint 1: Nền Tảng & Xác Thực (US01, US02)</h3>
                <p className="text-xs text-slate-500">Đã xây dựng và kiểm thử hoàn chỉnh cả Frontend & Backend</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md">
              Sẵn Sàng
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-600" /> Hệ thống Backend
              </p>
              <ul className="space-y-1.5 text-slate-600">
                <li>✓ 16 Mô hình CSDL Mongoose hoàn chỉnh</li>
                <li>✓ API RESTful chuẩn /api/v1/auth & /api/v1/users</li>
                <li>✓ Chuẩn hóa định dạng phản hồi ({`{ success, message, data }`})</li>
                <li>✓ Đăng ký, OTP email, Đăng nhập JWT, Cookie HttpOnly</li>
                <li>✓ Phân quyền RBAC, Giới hạn tần suất gọi, Mã hóa AES-256</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" /> Giao diện Frontend
              </p>
              <ul className="space-y-1.5 text-slate-600">
                <li>✓ Giao diện React + Vite + TailwindCSS tự nhiên, mượt mà</li>
                <li>✓ Form đăng ký tinh gọn: Học viên, Gia sư, Trung tâm</li>
                <li>✓ axiosClient tự động Refresh Token khi token hết hạn</li>
                <li>✓ Bảo vệ phiên làm việc an toàn trong bộ nhớ (in-memory)</li>
                <li>✓ Chú thích tiếng Việt có dấu đầy đủ, dễ phát triển tiếp</li>
              </ul>
            </div>
          </div>

          {/* Dữ liệu live từ API backend */}
          {profileData && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto space-y-1">
              <p className="text-emerald-400 font-bold mb-2">// Dữ liệu trả về từ GET /api/v1/users/me:</p>
              <pre>{JSON.stringify(profileData, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Cột Phải: Các Sprint Tiếp Theo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Các Bước Tiếp Theo</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">Sprint 3: Hồ sơ & Xác minh</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">Tuần 3</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Cập nhật thông tin gia sư, tải lên CCCD/bằng cấp, trang quản trị phê duyệt hồ sơ.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">Sprint 4: Đăng tin & Tìm kiếm</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">Tuần 4</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Đăng yêu cầu tìm gia sư, bộ lọc theo môn học, khu vực, học phí, kiểm duyệt tin.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">Sprint 5: Kết nối lớp học</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">Tuần 5</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Gia sư ứng tuyển, học viên chấp nhận lớp, mở số điện thoại & địa chỉ cho hai bên.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">Sprint 6: Trò chuyện & Đánh giá</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">Tuần 6</span>
              </div>
              <p className="text-[11px] text-slate-500">
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
