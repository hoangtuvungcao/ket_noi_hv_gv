/**
 * chân trang (footer)
 * thương hiệu gia sư việt: kết nối gia sư - nâng tầm tri thức
 * cỡ chữ to rõ, trình bày thoáng đãng
 */

import React from 'react';
import logoIcon from '../../assets/logo-icon.png';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-base mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3 text-white font-extrabold text-2xl">
              <img src={logoIcon} alt="Logo Gia Sư Việt" className="w-10 h-10 object-contain rounded-full shadow" />
              <span>GIA SƯ <span className="text-blue-500">VIỆT</span></span>
            </div>
            <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Kết nối gia sư - Nâng tầm tri thức
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng kết nối trực tiếp giữa gia sư, giáo viên và học viên trên toàn quốc. Đem lại môi trường học tập chất lượng, minh bạch và an tâm.
            </p>
          </div>

          {/* Cột 2: Dành cho học viên */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base">Dành cho Học viên</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tìm gia sư dạy kèm</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Đăng yêu cầu tìm người dạy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Chính sách học thử miễn phí</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Hướng dẫn cho phụ huynh</a></li>
            </ul>
          </div>

          {/* Cột 3: Dành cho gia sư & trung tâm */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base">Gia sư & Trung tâm</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Đăng ký làm gia sư</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Quy trình xác minh bằng cấp</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tìm lớp dạy mới nhất</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Dành cho trung tâm đào tạo</a></li>
            </ul>
          </div>

          {/* Cột 4: An toàn thông tin */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Bảo mật & Tin cậy
            </h4>
            <p className="text-sm leading-relaxed text-slate-400">
              Thông tin liên lạc được bảo vệ an toàn. Chỉ mở số điện thoại và địa chỉ khi hai bên đồng ý nhận lớp học.
            </p>
            <p className="text-xs text-slate-500 pt-1">
              Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
            </p>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GIA SƯ VIỆT. Tất cả quyền được bảo lưu.</p>
          <p className="text-slate-400 font-medium">
            Kết nối gia sư • Nâng tầm tri thức • Đồng hành phát triển
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
