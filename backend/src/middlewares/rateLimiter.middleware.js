/**
 * middleware giới hạn tần suất gửi yêu cầu (rate limiting)
 * ngăn chặn các cuộc tấn công brute force, dò mật khẩu, spam otp theo mục 5.1 và bảo mật tầng 3
 */

const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/response.util');

/**
 * giới hạn tần suất cho các chức năng nhạy cảm như đăng nhập, đăng ký, gửi mã otp
 * cho phép tối đa 30 yêu cầu trong vòng 15 phút từ cùng một địa chỉ ip
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 30, // tối đa 30 lần gọi
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'bạn đã gửi quá nhiều yêu cầu xác thực trong thời gian ngắn, vui lòng thử lại sau 15 phút',
      'TOO_MANY_REQUESTS',
      null,
      429
    );
  },
});

/**
 * giới hạn chung cho toàn bộ api để chống ddos mức độ cơ bản
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'hệ thống đang quá tải hoặc bạn thao tác quá nhanh, vui lòng thử lại sau',
      'TOO_MANY_REQUESTS',
      null,
      429
    );
  },
});

module.exports = {
  authRateLimiter,
  apiRateLimiter,
};

