require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

// Kết nối MongoDB
mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ Đã kết nối thành công tới Database');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Lỗi kết nối Database:', error.message);
    process.exit(1);
  });