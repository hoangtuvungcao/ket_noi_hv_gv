/**
 * middleware xử lý lỗi tập trung và xử lý route không tồn tại (404)
 * - không lộ vết lỗi hệ thống (stack trace) ra ngoài môi trường production
 * - chuẩn hóa định dạng trả về đồng nhất
 */

const ApiResponse = require('../utils/response.util');

/**
 * xử lý khi client gọi đến route không tồn tại (404)
 */
const notFoundHandler = (req, res, next) => {
  return ApiResponse.error(
    res,
    `đường dẫn [${req.method}] ${req.originalUrl} không tồn tại trên máy chủ`,
    'ROUTE_NOT_FOUND',
    null,
    404
  );
};

/**
 * bộ bắt lỗi tập trung (global error handler) cho toàn bộ ứng dụng express
 */
const errorHandler = (err, req, res, next) => {
  console.error('lỗi máy chủ chưa được xử lý (unhandled error):', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'đã xảy ra lỗi máy chủ nội bộ, vui lòng thử lại sau';

  return res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: statusCode === 500 && process.env.NODE_ENV === 'production'
        ? 'lỗi máy chủ nội bộ, chúng tôi đang khắc phục'
        : message,
      // chỉ hiển thị chi tiết stack trace khi chạy môi trường phát triển (development)
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

