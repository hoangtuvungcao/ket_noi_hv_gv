/**
 * định tuyến các api liên quan đến xác thực (auth routes)
 * danh mục api tuân thủ mục 3.3.a trong tài liệu đặc tả
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authRateLimiter } = require('../middlewares/rateLimiter.middleware');

// 1. đăng ký tài khoản (US01)
router.post('/register', authRateLimiter, validate.register, authController.register);

// 2. xác thực mã otp
router.post('/verify-otp', authRateLimiter, validate.verifyOtp, authController.verifyOtp);

// 3. gửi lại mã otp
router.post('/resend-otp', authRateLimiter, validate.resendOtp, authController.resendOtp);

// 4. đăng nhập hệ thống (US02)
router.post('/login', authRateLimiter, validate.login, authController.login);

// 5. làm mới access token từ httponly cookie
router.post('/refresh', authController.refreshToken);

// 6. đăng xuất hệ thống
router.post('/logout', authController.logout);

// 7. yêu cầu gửi otp quên mật khẩu
router.post('/forgot-password', authRateLimiter, validate.forgotPassword, authController.forgotPassword);

// 8. đặt lại mật khẩu với otp
router.post('/reset-password', authRateLimiter, validate.resetPassword, authController.resetPassword);

// 9. đổi mật khẩu (yêu cầu đăng nhập)
router.put('/change-password', verifyToken, validate.changePassword, authController.changePassword);

module.exports = router;
