/**
 * thành phần phân quyền theo vai trò (role route)
 * chỉ cho phép người dùng có vai trò phù hợp (student / tutor / center / admin) truy cập
 * nếu không đủ quyền sẽ chuyển hướng tới trang /unauthorized (403)
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;

