/**
 * middleware xác thực jwt và phân quyền người dùng (rbac)
 * tuân thủ mục 1.5, 3.1 và bảo mật tầng 3 trong tài liệu đặc tả:
 * - access token (jwt, sống 15 phút) gửi qua header Authorization: Bearer <token>
 * - kiểm tra vai trò (student / tutor / center / admin)
 * - kiểm tra quyền sở hữu tài nguyên (ownership)
 */

const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/response.util');

const authMiddleware = {
  /**
   * xác thực token truy cập (access token)
   */
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ApiResponse.error(
          res,
          'vui lòng đăng nhập để thực hiện chức năng này',
          'UNAUTHORIZED',
          null,
          401
        );
      }

      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'jwt_access_secret_key_sprint_1_dev';

      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return ApiResponse.error(
            res,
            'phiên đăng nhập không hợp lệ hoặc đã hết hạn',
            'TOKEN_EXPIRED',
            null,
            401
          );
        }

        // gắn thông tin giải mã { id, role } vào request để các controller tiếp theo sử dụng
        req.user = decoded;
        next();
      });
    } catch (error) {
      return ApiResponse.error(res, 'lỗi xác thực hệ thống', 'AUTH_ERROR', null, 500);
    }
  },

  /**
   * kiểm tra vai trò người dùng (rbac - role based access control)
   * @param {...string} allowedRoles - danh sách các vai trò được phép truy cập (ví dụ: 'admin', 'tutor')
   */
  checkRole: (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return ApiResponse.error(
          res,
          'bạn không có quyền truy cập vào tài nguyên này',
          'FORBIDDEN',
          null,
          403
        );
      }
      next();
    };
  },

  /**
   * kiểm tra quyền sở hữu tài nguyên (ownership)
   * đảm bảo người dùng chỉ sửa đổi được dữ liệu do chính mình tạo ra (trừ admin)
   * @param {function} getResourceOwnerId - hàm lấy id chủ sở hữu từ req
   */
  checkOwnership: (getResourceOwnerId) => {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          return ApiResponse.error(res, 'chưa xác thực người dùng', 'UNAUTHORIZED', null, 401);
        }

        // admin luôn có toàn quyền quản trị
        if (req.user.role === 'admin') {
          return next();
        }

        const ownerId = await getResourceOwnerId(req);
        if (!ownerId || ownerId.toString() !== req.user.id.toString()) {
          return ApiResponse.error(
            res,
            'bạn không phải chủ sở hữu tài nguyên này',
            'FORBIDDEN',
            null,
            403
          );
        }

        next();
      } catch (error) {
        return ApiResponse.error(res, 'lỗi kiểm tra quyền sở hữu', 'INTERNAL_ERROR', null, 500);
      }
    };
  },
};

module.exports = authMiddleware;
