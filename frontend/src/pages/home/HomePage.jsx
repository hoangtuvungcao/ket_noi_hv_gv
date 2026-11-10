/**
 * trang chủ (home page)
 * giới thiệu nền tảng kết nối gia sư và học viên với ngôn từ tự nhiên, gần gũi, chuẩn mực
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Lock,
  Star,
  CheckCircle2,
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. Phần Giới Thiệu Chính (Hero) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nền tảng kết nối học tập trực tiếp – Không qua môi giới trung gian</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Tìm <span className="text-blue-600">Gia Sư & Giáo Viên</span> Dạy Kèm Uy Tín, Đúng Nhu Cầu
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Giúp học viên nhanh chóng tìm được người dạy phù hợp tại nhà hoặc online. Giúp giáo viên, gia sư tìm lớp dạy ổn định và các trung tâm tuyển dụng nhân sự giảng dạy chất lượng.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Đăng ký tham gia ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold shadow-sm transition-all"
            >
              <span>Đăng nhập hệ thống</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Ba Nhóm Người Dùng Chính (Học viên, Gia sư, Trung tâm) */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dành Cho Từng Nhu Cầu Cụ Thể
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Hệ thống phân chia rõ ràng quyền lợi và trải nghiệm cho từng đối tượng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Nhóm 1: Học viên & Phụ huynh */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Học Viên & Phụ Huynh</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Đăng yêu cầu tìm gia sư theo môn học, cấp lớp và mức học phí mong muốn. Dễ dàng xem hồ sơ đã kiểm duyệt, trao đổi và học thử trước khi bắt đầu.
              </p>
              <ul className="text-xs text-slate-500 space-y-2.5 pt-2">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Đăng tin tìm gia sư hoàn toàn miễn phí
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Xem đánh giá thật từ các học viên trước
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Hỗ trợ buổi học thử để đánh giá độ phù hợp
                </li>
              </ul>
            </div>
          </div>

          {/* Nhóm 2: Gia sư & Giáo viên */}
          <div className="bg-white p-7 rounded-2xl border-2 border-emerald-500/30 shadow-md shadow-emerald-500/5 relative flex flex-col justify-between">
            <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Được quan tâm
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Gia Sư & Giáo Viên</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tạo hồ sơ năng lực chuyên nghiệp với đầy đủ bằng cấp, thẻ sinh viên và kinh nghiệm. Ứng tuyển vào các lớp học phù hợp với lịch rảnh và chuyên môn của bạn.
              </p>
              <ul className="text-xs text-slate-500 space-y-2.5 pt-2">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Nhận lớp dạy kèm trực tiếp, không phí môi giới cao
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Chủ động đặt lịch rảnh và mức học phí mong muốn
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Huy hiệu hồ sơ đã xác thực tạo uy tín vững chắc
                </li>
              </ul>
            </div>
          </div>

          {/* Nhóm 3: Trung tâm giáo dục */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Trung Tâm Đào Tạo</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Đăng tin tuyển dụng giáo viên, gia sư giảng dạy cho các lớp học tại trung tâm. Quản lý hồ sơ ứng viên nhanh chóng và có hệ thống kiểm duyệt giấy phép rõ ràng.
              </p>
              <ul className="text-xs text-slate-500 space-y-2.5 pt-2">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Đăng tin tuyển dụng giáo viên theo môn học
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Tiếp cận mạng lưới gia sư chất lượng cao
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Xác minh doanh nghiệp minh bạch và an toàn
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tính Năng Bảo Mật Thông Tin & Kiểm Duyệt */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Chính sách bảo mật rõ ràng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bảo Mật Thông Tin Cá Nhân & Kiểm Duyệt Kỹ Càng
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Thông tin liên hệ như số điện thoại, email và địa chỉ nhà luôn được che mờ công khai. Chỉ khi học viên và gia sư thống nhất kết nối nhận lớp, thông tin liên hệ mới được hiển thị cho hai bên.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Che mờ thông tin liên hệ khi chưa ghép lớp</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Kiểm duyệt giấy tờ bằng cấp gia sư</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Tuân thủ quy định bảo vệ dữ liệu cá nhân</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
