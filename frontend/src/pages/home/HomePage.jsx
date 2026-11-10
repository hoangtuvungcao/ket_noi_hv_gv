/**
 * trang chủ (home page)
 * thương hiệu: gia sư việt - kết nối gia sư, nâng tầm tri thức
 * thiết kế sang trọng, hiện đại, khối bảo mật được nâng cấp giao diện trực quan, cao cấp
 */

import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '../../assets/logo-icon.png';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  EyeOff,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* 1. Phần Giới Thiệu Chính (Hero Section) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo huy hiệu tròn chính thức */}
          <div className="flex justify-center mb-6">
            <div className="p-1 rounded-full bg-gradient-to-tr from-amber-400 via-blue-600 to-indigo-600 shadow-xl shadow-blue-900/15">
              <img
                src={logoIcon}
                alt="Logo Gia Sư Việt"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-full bg-slate-900"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/90 text-blue-800 text-sm font-bold mb-6 shadow-sm border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>KẾT NỐI GIA SƯ - NÂNG TẦM TRI THỨC</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Nền Tảng <span className="text-blue-600">Gia Sư Việt</span> Dạy Kèm Uy Tín Hàng Đầu
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Giúp học viên & phụ huynh dễ dàng tìm được gia sư tận tâm tại nhà hoặc học trực tuyến. Giáo viên, sinh viên giỏi tìm lớp dạy ổn định, minh bạch và an toàn tuyệt đối.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
            >
              <span>Đăng ký tham gia ngay</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-lg shadow-sm transition-all"
            >
              <span>Đăng nhập hệ thống</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Ba Nhóm Người Dùng (Học viên, Gia sư, Trung tâm) */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dành Cho Từng Nhu Cầu Cụ Thể
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Hệ thống phân chia rõ ràng quyền lợi và trải nghiệm cho từng đối tượng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Nhóm 1: Học viên & Phụ huynh */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Học Viên & Phụ Huynh</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Đăng yêu cầu tìm gia sư theo môn học, cấp lớp và mức học phí mong muốn. Dễ dàng xem hồ sơ đã kiểm duyệt, trao đổi và học thử trước khi bắt đầu.
              </p>
              <ul className="text-sm text-slate-700 space-y-3 pt-3">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Đăng tin tìm gia sư hoàn toàn miễn phí
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Xem đánh giá thật từ các học viên trước
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Hỗ trợ buổi học thử để đánh giá độ phù hợp
                </li>
              </ul>
            </div>
          </div>

          {/* Nhóm 2: Gia sư & Giáo viên */}
          <div className="bg-white p-8 rounded-3xl border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10 relative flex flex-col justify-between space-y-6">
            <div className="absolute top-5 right-5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              Được quan tâm
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Gia Sư & Giáo Viên</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Tạo hồ sơ năng lực chuyên nghiệp với đầy đủ bằng cấp, thẻ sinh viên và kinh nghiệm. Ứng tuyển vào các lớp học phù hợp với lịch rảnh và chuyên môn của bạn.
              </p>
              <ul className="text-sm text-slate-700 space-y-3 pt-3">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Nhận lớp dạy kèm trực tiếp, không phí môi giới cao
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Chủ động đặt lịch rảnh và mức học phí mong muốn
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Huy hiệu hồ sơ đã xác thực tạo uy tín vững chắc
                </li>
              </ul>
            </div>
          </div>

          {/* Nhóm 3: Trung tâm giáo dục */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Trung Tâm Đào Tạo</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Đăng tin tuyển dụng giáo viên, gia sư giảng dạy cho các lớp học tại trung tâm. Quản lý hồ sơ ứng viên nhanh chóng và có hệ thống kiểm duyệt giấy phép rõ ràng.
              </p>
              <ul className="text-sm text-slate-700 space-y-3 pt-3">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Đăng tin tuyển dụng giáo viên theo môn học
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Tiếp cận mạng lưới gia sư chất lượng cao
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Xác minh doanh nghiệp minh bạch và an toàn
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KHỐI BẢO MẬT & KIỂM DUYỆT ĐƯỢC THIẾT KẾ LẠI ĐẸP MẮT & SANG TRỌNG */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Hiệu ứng ánh sáng nền mờ cao cấp */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Cột trái: Tiêu đề và giới thiệu chính sách */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Chính sách bảo mật rõ ràng</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Bảo Mật Thông Tin Cá Nhân &amp; Kiểm Duyệt Kỹ Càng
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Thông tin liên hệ như số điện thoại, email và địa chỉ nhà luôn được che mờ công khai. Chỉ khi học viên và gia sư thống nhất kết nối nhận lớp, thông tin liên hệ mới được hiển thị an toàn cho hai bên.
              </p>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                >
                  <span>An tâm trải nghiệm ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Cột phải: 3 Thẻ tính năng bảo mật thiết kế Glassmorphism trực quan */}
            <div className="lg:col-span-7 space-y-4">
              {/* Thẻ 1: Che mờ thông tin liên hệ */}
              <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 hover:border-blue-500/50 transition-all shadow-md space-y-3 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0">
                    <EyeOff className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Che mờ thông tin liên hệ khi chưa ghép lớp
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Số điện thoại và địa chỉ nhà được che mờ (ví dụ: <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs">09******89</code>, <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs">Số *** Đường Cầu Giấy</code>). Chỉ khi có sự đồng ý của cả hai bên thì thông tin mới mở.
                    </p>
                  </div>
                </div>
              </div>

              {/* Thẻ 2: Kiểm duyệt hồ sơ & bằng cấp */}
              <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 hover:border-emerald-500/50 transition-all shadow-md space-y-3 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Kiểm duyệt giấy tờ bằng cấp gia sư
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Đội ngũ quản trị viên rà soát căn cước công dân, thẻ sinh viên, bằng tốt nghiệp cử nhân / thạc sĩ trước khi cấp huy hiệu xác thực và cho phép hiển thị hồ sơ.
                    </p>
                  </div>
                </div>
              </div>

              {/* Thẻ 3: Tuân thủ quy định bảo vệ dữ liệu */}
              <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 hover:border-purple-500/50 transition-all shadow-md space-y-3 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Tuân thủ quy định bảo vệ dữ liệu cá nhân
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Tuân thủ chặt chẽ Nghị định 13/2023/NĐ-CP. Mã hóa AES-256 các trường nhạy cảm trong cơ sở dữ liệu và bảo mật phiên đăng nhập qua cookie HttpOnly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
