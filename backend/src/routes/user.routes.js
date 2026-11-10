/**
 * định tuyến các api liên quan đến thông tin người dùng (user routes)
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// lấy thông tin cá nhân của người dùng hiện tại (US02 - GET /users/me)
router.get('/me', verifyToken, userController.getMe);

module.exports = router;

