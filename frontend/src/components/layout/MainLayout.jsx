/**
 * khung bố cục chính (main layout)
 * bao bọc navbar ở trên cùng, phần nội dung động (outlet) ở giữa và footer ở chân trang
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

