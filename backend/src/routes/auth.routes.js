const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', validate.register, authController.register);
router.post('/login', validate.login, authController.login);
router.get('/me', verifyToken, authController.getMe);

// 2 route mới thêm:
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;