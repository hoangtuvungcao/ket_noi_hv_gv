/**
 * thành phần bảo vệ tuyến đường (protected route)
 * chặn truy cập nếu người dùng chưa đăng nhập và tự động chuyển hướng về trang /login
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // lưu lại vị trí trang hiện tại để sau khi đăng nhập xong chuyển hướng người dùng quay lại đúng trang này
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

