/**
 * cấu hình ứng dụng express chính
 * thiết lập các middleware bảo mật, cors, phân tích json, cookie, rate limit
 * và gắn kết các tuyến đường api phiên bản 1 (/api/v1)
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routesV1 = require('./routes');
const { apiRateLimiter } = require('./middlewares/rateLimiter.middleware');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// 1. thiết lập bảo mật http headers với helmet
app.use(helmet());

// 2. cấu hình cors cho phép frontend gọi api và truyền nhận cookie an toàn
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // cho phép request không có origin (ví dụ như gọi từ postman, mobile app hoặc cùng server)
      if (!origin) return callback(null, true);
      if (origin === clientUrl || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true); // trong môi trường dev mở rộng để tránh chặn nhầm port
    },
    credentials: true, // bắt buộc bật để trình duyệt gửi kèm httponly cookie
  })
);

// 3. phân tích dữ liệu json và urlencoded trong body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. phân tích cookie từ request headers (để đọc refresh token)
app.use(cookieParser());

// 5. giới hạn tần suất gọi api chung để tránh nghẽn mạng
app.use('/api', apiRateLimiter);

// 6. khai báo đường dẫn api phiên bản 1 chính thức theo chuẩn mục 2.3 & 3.1
app.use('/api/v1', routesV1);

// hỗ trợ thêm alias đường dẫn ngắn /api để tương thích ngược
app.use('/api', routesV1);

// 7. xử lý các route không tồn tại (404)
app.use(notFoundHandler);

// 8. bộ xử lý lỗi tập trung toàn hệ thống (500)
app.use(errorHandler);

module.exports = app;
