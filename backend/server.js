/**
 * tệp khởi động máy chủ backend chính
 * nạp biến môi trường từ .env, kết nối cơ sở dữ liệu mongodb
 * và lắng nghe kết nối tại cổng port quy định
 */

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

// cổng chạy server (mặc định 5000)
const PORT = process.env.PORT || 5000;

// chuỗi kết nối mongodb (mặc định trỏ về mongodb local trên máy)
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/ket_noi_hv_gv';

console.log('🔄 đang kết nối tới cơ sở dữ liệu mongodb...');

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('✅ đã kết nối thành công tới database mongodb:', DB_URI);
    app.listen(PORT, () => {
      console.log(`🚀 máy chủ backend đang chạy tại: http://localhost:${PORT}`);
      console.log(`📖 kiểm tra sức khỏe hệ thống: http://localhost:${PORT}/api/v1/health`);
    });
  })
  .catch((error) => {
    console.error('❌ lỗi kết nối cơ sở dữ liệu mongodb:', error.message);
    console.error('👉 mẹo: hãy đảm bảo mongodb server đang chạy trên máy hoặc kiểm tra lại chuỗi DB_URI trong file .env');
    process.exit(1);
  });
