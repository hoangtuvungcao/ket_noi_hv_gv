/**
 * thanh điều hướng (navbar)
 * ngôn từ tự nhiên, chuyển đổi vai trò mạch lạc và thân thiện
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  GraduationCap,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  BookOpen,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold">Học viên</span>;
      case 'tutor':
        return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold">Gia sư</span>;
      case 'center':
        return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[11px] font-semibold">Trung tâm</span>;
      case 'admin':
        return <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[11px] font-semibold">Quản trị</span>;
      default:
        return null;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo thương hiệu */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">
              KếtNối<span className="text-blue-600">GiaSư</span>
            </span>
          </Link>

          {/* Menu máy tính */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link to="/#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Dành cho ai?
            </Link>
            <Link to="/#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Giới thiệu & Bảo mật
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-600"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Bảng điều khiển
                </Link>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {user?.fullName ? user.fullName[0].toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {user?.fullName || user?.email}
                    </span>
                    {getRoleBadge(user?.role)}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm transition-colors shadow-blue-500/20"
                >
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </div>

          {/* Nút bấm mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu hiển thị trên di động */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            Trang chủ
          </Link>
          <Link
            to="/#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            Dành cho ai?
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 py-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{user?.fullName || user?.email}</p>
                  {getRoleBadge(user?.role)}
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600"
              >
                Bảng điều khiển
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-base font-medium text-rose-600"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm"
              >
                Đăng ký ngay
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
