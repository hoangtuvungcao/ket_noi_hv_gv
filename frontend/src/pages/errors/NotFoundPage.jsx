/**
 * trang thông báo không tìm thấy đường dẫn (404 not found)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Trang không tồn tại</h2>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ khác.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Về trang chủ</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;

