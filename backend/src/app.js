const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware bảo mật và parse JSON
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Cho phép Frontend gọi API
app.use(express.json()); // Đọc dữ liệu JSON từ body

// Khai báo các route chính
app.use('/api/auth', authRoutes);

// Xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: 'Route không tồn tại' });
});

module.exports = app;