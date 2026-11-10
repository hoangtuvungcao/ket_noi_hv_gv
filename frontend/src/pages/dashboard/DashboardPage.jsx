/**
 * trang bảng điều khiển cá nhân (dashboard)
 * thương hiệu: gia sư việt - kết nối gia sư, nâng tầm tri thức
 * thiết kế chuyên nghiệp, giao diện thực tế cho người dùng
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import {
  User,
  Shield,
  BookOpen,
  Calendar,
  MessageSquare,
  Bell,
  GraduationCap,
  Building2,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Settings,
} from 'lucide-react';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);

  // tự động nạp thông tin hồ sơ người dùng khi vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getMe();
        if (res.success && res.data) {
          setProfile(res.data.profile);
          updateUser(res.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin hồ sơ:', err);
      }
    };
    fetchProfile();
  }, []);

  const getRoleDetails = (role) => {
    switch (role) {
      case 'student':
        return {
          title: 'Học viên / Phụ huynh',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <UserCheck className="w-5 h-5 text-blue-600" />,
        };
      case 'tutor':
        return {
          title: 'Gia sư / Giáo viên',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
        };
      case 'center':
        return {
          title: 'Trung tâm đào tạo',
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <Building2 className="w-5 h-5 text-purple-600" />,
        };
      case 'admin':
        return {
          title: 'Quản trị viên hệ thống',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: <Shield className="w-5 h-5 text-rose-600" />,
        };
      default:
        return {
          title: 'Người dùng',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: <User className="w-5 h-5 text-slate-600" />,
        };
    }
  };

  const roleDetails = getRoleDetails(user?.role);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Thẻ Chào Mừng & Thông Tin Người Dùng */}
      <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-blue-500/20 flex-shrink-0">
            {user?.fullName ? user.fullName[0].toUpperCase() : <User className="w-10 h-10" />}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Xin chào, {user?.fullName || user?.email?.split('@')[0]}!
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border shadow-sm ${roleDetails.badgeClass}`}>
                {roleDetails.icon}
                <span>{roleDetails.title}</span>
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Email: <span className="font-semibold text-slate-700">{user?.email}</span>
              {user?.phone && <span> • SĐT: <span className="font-semibold text-slate-700">{user.phone}</span></span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Tài khoản đã kích hoạt</span>
        </div>
      </div>

      {/* 2. Thống kê nhanh hoạt động (Quick Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Lớp học hiện tại</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">0</div>
          <p className="text-xs text-slate-400">Đang hoạt động</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Yêu cầu & Đơn ứng tuyển</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">0</div>
          <p className="text-xs text-slate-400">Đơn chờ phản hồi</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Tin nhắn mới</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">0</div>
          <p className="text-xs text-slate-400">Chưa đọc</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Thông báo hệ thống</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">0</div>
          <p className="text-xs text-slate-400">Thông báo mới</p>
        </div>
      </div>

      {/* 3. Lối tắt thao tác nhanh & Khuyến nghị */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Tính năng quản lý nhanh</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user?.role === 'student' && (
              <>
                <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2 group">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                    <span>Đăng yêu cầu tìm gia sư</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tạo bài đăng tìm người dạy kèm theo môn học, địa điểm và học phí mong muốn.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2 group">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                    <span>Tìm kiếm hồ sơ gia sư</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Xem danh sách gia sư giỏi đã được xác minh bằng cấp và đánh giá năng lực.
                  </p>
                </div>
              </>
            )}

            {user?.role === 'tutor' && (
              <>
                <div className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-2 group">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 flex items-center justify-between">
                    <span>Hồ sơ & Xác minh bằng cấp</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật lý lịch, bằng cấp cử nhân, thẻ sinh viên để nhận huy hiệu xác thực uy tín.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-2 group">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 flex items-center justify-between">
                    <span>Tìm lớp dạy mới</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tìm kiếm các lớp học cần gia sư theo môn học và khu vực bạn rảnh rỗi.
                  </p>
                </div>
              </>
            )}

            {user?.role === 'center' && (
              <>
                <div className="p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all space-y-2 group">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-600 flex items-center justify-between">
                    <span>Đăng tin tuyển giáo viên</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Đăng tuyển dụng giáo viên, gia sư giảng dạy cho các lớp học tại trung tâm.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all space-y-2 group">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-600 flex items-center justify-between">
                    <span>Quản lý hồ sơ ứng viên</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Xem danh sách các gia sư ứng tuyển vào các vị trí tuyển dụng của trung tâm.
                  </p>
                </div>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <div className="p-5 rounded-2xl border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all space-y-2 group">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-600 flex items-center justify-between">
                    <span>Duyệt hồ sơ gia sư</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kiểm tra giấy tờ CCCD, bằng cấp, thẻ sinh viên của gia sư và cấp quyền.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all space-y-2 group">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-600 flex items-center justify-between">
                    <span>Duyệt bài đăng lớp học</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kiểm duyệt nội dung tin tìm gia sư của học viên và việc làm của trung tâm.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Khuyến nghị an toàn cho người dùng */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 space-y-5 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">An tâm kết nối học tập</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Thông tin liên hệ như số điện thoại và địa chỉ nhà của bạn luôn được bảo vệ an toàn. Chỉ mở cho đối tác khi hai bên xác nhận nhận lớp.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Hỗ trợ kỹ thuật: support@giasuviet.vn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
