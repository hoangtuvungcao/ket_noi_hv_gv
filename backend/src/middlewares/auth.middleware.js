const jwt = require('jsonwebtoken');

const authMiddleware = {
  // Kiểm tra user đã đăng nhập chưa (Validate Access Token)
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Vui lòng đăng nhập' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Gắn thông tin { id, role } vào request
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  },

  // RBAC: Kiểm tra quyền (Role)
  checkRole: (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
      }
      next();
    };
  }
};

module.exports = authMiddleware;