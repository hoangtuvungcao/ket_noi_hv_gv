/**
 * trang thông báo không có quyền truy cập (403 forbidden / unauthorized)
 * hiển thị khi người dùng truy cập vào trang không thuộc vai trò của mình
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Không Có Quyền Truy Cập</h1>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        Tài khoản của bạn không có vai trò phù hợp để truy cập vào tài nguyên hoặc trang quản trị này.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Quay về Bảng điều khiển</span>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;

