/**
 * thanh điều hướng chính (navbar) của gia sư việt
 * hiển thị logo chính thức, slogan "kết nối gia sư - nâng tầm tri thức"
 * cỡ chữ to rõ ràng, dễ nhìn cho mọi đối tượng
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoIcon from '../../assets/logo-icon.png';
import {
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
        return <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-md text-xs font-bold">Học viên</span>;
      case 'tutor':
        return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-md text-xs font-bold">Gia sư</span>;
      case 'center':
        return <span className="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-md text-xs font-bold">Trung tâm</span>;
      case 'admin':
        return <span className="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-md text-xs font-bold">Quản trị</span>;
      default:
        return null;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tên thương hiệu GIA SƯ VIỆT */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoIcon}
              alt="Logo Gia Sư Việt"
              className="w-12 h-12 object-contain rounded-full shadow-md transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                GIA SƯ <span className="text-blue-600">VIỆT</span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-slate-500">
                Kết nối gia sư - Nâng tầm tri thức
              </span>
            </div>
          </Link>

          {/* Menu máy tính với cỡ chữ to rõ */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className="text-base font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link to="/#features" className="text-base font-semibold text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <Search className="w-4 h-4 text-blue-500" /> Dành cho ai?
            </Link>
            <Link to="/#about" className="text-base font-semibold text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-500" /> Giới thiệu
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 pl-5 border-l-2 border-slate-200">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-base font-bold text-slate-800 hover:text-blue-600"
                >
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  Bảng điều khiển
                </Link>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-extrabold text-base shadow-sm">
                    {user?.fullName ? user.fullName[0].toUpperCase() : <User className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 line-clamp-1">
                      {user?.fullName || user?.email}
                    </span>
                    {getRoleBadge(user?.role)}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-5 border-l-2 border-slate-200">
                <Link
                  to="/login"
                  className="text-base font-bold text-slate-700 hover:text-blue-600 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="text-base font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-md transition-all shadow-blue-500/25 hover:scale-[1.02]"
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
              className="p-2.5 text-slate-700 hover:text-slate-900 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 pt-3 pb-5 space-y-4 shadow-lg">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 text-lg font-semibold text-slate-800 hover:text-blue-600"
          >
            Trang chủ
          </Link>
          <Link
            to="/#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 text-lg font-semibold text-slate-800 hover:text-blue-600"
          >
            Dành cho ai?
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 py-2">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-lg">
                  {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">{user?.fullName || user?.email}</p>
                  {getRoleBadge(user?.role)}
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 text-lg font-bold text-slate-800 hover:text-blue-600"
              >
                Bảng điều khiển
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2.5 text-lg font-bold text-rose-600"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center py-3 text-base font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center py-3 text-base font-bold text-white bg-blue-600 rounded-xl shadow-md"
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
