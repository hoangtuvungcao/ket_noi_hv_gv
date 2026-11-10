/**
 * cấu hình cây định tuyến (routing tree) của ứng dụng frontend
 * tích hợp bố cục chung (MainLayout), các trang công khai và các trang được bảo vệ
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyOtpPage from '../pages/auth/VerifyOtpPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import NotFoundPage from '../pages/errors/NotFoundPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Các trang công khai (public routes) */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        {/* Các trang yêu cầu đăng nhập (protected routes) */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Trang thông báo lỗi và không có quyền */}
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

