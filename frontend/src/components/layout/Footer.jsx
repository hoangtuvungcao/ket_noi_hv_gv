/**
 * chân trang (footer)
 * ngôn từ tự nhiên, chuẩn mực, thông tin hỗ trợ rõ ràng
 */

import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span>KếtNối<span className="text-blue-500">GiaSư</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng kết nối trực tiếp giữa gia sư, giáo viên và học viên trên toàn quốc. Đem lại môi trường học tập chất lượng, minh bạch và an tâm.
            </p>
          </div>

          {/* Cột 2: Dành cho học viên */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Dành cho Học viên</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tìm gia sư dạy kèm</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Đăng yêu cầu tìm người dạy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Chính sách học thử</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Hướng dẫn cho phụ huynh</a></li>
            </ul>
          </div>

          {/* Cột 3: Dành cho gia sư & trung tâm */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Gia sư & Trung tâm</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Đăng ký làm gia sư</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Quy trình xác minh bằng cấp</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tìm lớp dạy mới nhất</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Dành cho trung tâm đào tạo</a></li>
            </ul>
          </div>

          {/* Cột 4: An toàn thông tin */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Bảo mật & Tin cậy
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              Thông tin liên lạc được bảo vệ an toàn. Chỉ mở số điện thoại và địa chỉ khi hai bên đồng ý nhận lớp học.
            </p>
            <p className="text-[11px] text-slate-500">
              Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
            </p>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Kết Nối Gia Sư & Học Viên. Nền tảng học tập trực tiếp.</p>
          <p className="text-slate-500">
            Học tập hiệu quả • Kết nối tận tâm • Đồng hành phát triển
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
