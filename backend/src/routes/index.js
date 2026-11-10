/**
 * điểm tập trung toàn bộ các tuyến đường (routes) của api phiên bản 1 (v1)
 * địa chỉ cơ sở: /api/v1/... theo chuẩn thiết kế mục 2.3 và 3.1
 */

const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const ApiResponse = require('../utils/response.util');

// kiểm tra trạng thái hoạt động của máy chủ (health check)
router.get('/health', (req, res) => {
  return ApiResponse.success(res, 'máy chủ backend đang hoạt động ổn định', {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'tutor-student-platform-backend',
    version: '1.0.0',
  });
});

// phân hệ xác thực tài khoản
router.use('/auth', authRoutes);

// phân hệ người dùng
router.use('/users', userRoutes);

// các phân hệ tiếp theo cho sprint 3 - 7 sẽ được mount tại đây:
// router.use('/students', studentRoutes); // sprint 3
// router.use('/tutors', tutorRoutes); // sprint 3 & 4
// router.use('/centers', centerRoutes); // sprint 3 & 4
// router.use('/subjects', subjectRoutes); // sprint 4
// router.use('/class-requests', classRequestRoutes); // sprint 4
// router.use('/center-jobs', centerJobRoutes); // sprint 4
// router.use('/applications', applicationRoutes); // sprint 5
// router.use('/matches', matchRoutes); // sprint 5
// router.use('/reviews', reviewRoutes); // sprint 6
// router.use('/conversations', conversationRoutes); // sprint 6
// router.use('/notifications', notificationRoutes); // sprint 6
// router.use('/reports', reportRoutes); // sprint 6
// router.use('/admin', adminRoutes); // sprint 7

module.exports = router;

