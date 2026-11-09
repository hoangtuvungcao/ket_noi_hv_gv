const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Tạo Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Tạo Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const authController = {
  // US01: Đăng ký
  register: async (req, res) => {
    try {x
      const { email, password, role, phone } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

      const newUser = new User({ email, password_hash: password, role, phone });
      await newUser.save();

      // TODO: Tích hợp Nodemailer gửi OTP xác thực email ở đây

      res.status(201).json({ message: 'Đăng ký thành công, vui lòng xác thực email', userId: newUser._id });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // US02: Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

      if (user.status === 'locked') return res.status(403).json({ message: 'Tài khoản đã bị khóa' });

      user.last_login = new Date();
      await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Gửi Refresh Token qua HttpOnly Cookie để bảo mật
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
      });

      res.status(200).json({ message: 'Đăng nhập thành công', accessToken, role: user.role });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password_hash');
      if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = authController;