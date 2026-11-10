/**
 * ngữ cảnh xác thực người dùng (auth context)
 * quản lý trạng thái đăng nhập, thông tin người dùng và token trong toàn ứng dụng
 * tuân thủ chuẩn bảo mật tầng 1: lưu trữ access token trong memory (ram), không lưu trong localstorage
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAccessToken, setLogoutHandler } from '../services/axiosClient';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // hàm đăng xuất
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('lỗi khi gọi api logout:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  // cập nhật thông tin đăng nhập
  const login = (userData, token) => {
    setAccessToken(token);
    setUser(userData);
  };

  // hàm cập nhật một phần dữ liệu người dùng
  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  // khi ứng dụng khởi chạy lần đầu: tự động thử khôi phục phiên từ refresh token (nằm trong cookie httponly)
  useEffect(() => {
    // đăng ký hàm logout callback với axios interceptor
    setLogoutHandler(() => {
      setUser(null);
    });

    const initAuth = async () => {
      try {
        // thử lấy thông tin người dùng hiện tại nếu cookie refresh còn hạn
        const meRes = await authService.getMe();
        if (meRes.success && meRes.data) {
          setUser(meRes.data);
        }
      } catch (error) {
        // chưa đăng nhập hoặc cookie hết hạn, trạng thái vẫn là khách vãng lai
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * hook tùy biến để sử dụng thông tin xác thực dễ dàng trong các component
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};

