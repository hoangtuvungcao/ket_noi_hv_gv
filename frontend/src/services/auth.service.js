/**
 * dịch vụ gọi api xác thực (auth service)
 * cung cấp các hàm giao tiếp với backend theo danh mục api 3.3.a
 */

import axiosClient from './axiosClient';

export const authService = {
  /**
   * gửi yêu cầu đăng ký tài khoản mới (US01)
   */
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },

  /**
   * gửi mã otp xác thực email
   */
  verifyOtp: (data) => {
    return axiosClient.post('/auth/verify-otp', data);
  },

  /**
   * yêu cầu gửi lại mã otp mới
   */
  resendOtp: (data) => {
    return axiosClient.post('/auth/resend-otp', data);
  },

  /**
   * đăng nhập tài khoản (US02)
   */
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },

  /**
   * đăng xuất tài khoản
   */
  logout: () => {
    return axiosClient.post('/auth/logout');
  },

  /**
   * lấy thông tin tài khoản người dùng hiện tại
   */
  getMe: () => {
    return axiosClient.get('/users/me');
  },

  /**
   * yêu cầu gửi mã otp quên mật khẩu
   */
  forgotPassword: (data) => {
    return axiosClient.post('/auth/forgot-password', data);
  },

  /**
   * đặt lại mật khẩu bằng mã otp
   */
  resetPassword: (data) => {
    return axiosClient.post('/auth/reset-password', data);
  },

  /**
   * đổi mật khẩu
   */
  changePassword: (data) => {
    return axiosClient.put('/auth/change-password', data);
  },
};

