const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', validate.register, authController.register);
router.post('/login', validate.login, authController.login);

// API bảo vệ: Chỉ gọi được khi có Access Token
router.get('/me', verifyToken, authController.getMe);

module.exports = router;