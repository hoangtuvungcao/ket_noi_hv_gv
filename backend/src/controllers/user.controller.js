/**
 * bộ điều khiển người dùng (user controller)
 * quản lý thông tin tài khoản hiện tại (GET /users/me) và hồ sơ cá nhân
 * tuân thủ mục 3.3.a và bảo vệ dữ liệu nhạy cảm theo mục 8.2 trong tài liệu
 */

const {
  User,
  StudentProfile,
  TutorProfile,
  Center,
} = require('../models');
const ApiResponse = require('../utils/response.util');
const { decrypt, maskIdCard } = require('../utils/crypto.util');

const userController = {
  /**
   * lấy thông tin tài khoản hiện tại của người dùng đang đăng nhập (GET /users/me)
   */
  getMe: async (req, res, next) => {
    try {
      const userId = req.user.id;

      // tìm người dùng (loại trừ password_hash)
      const user = await User.findById(userId);
      if (!user) {
        return ApiResponse.error(res, 'không tìm thấy tài khoản người dùng', 'USER_NOT_FOUND', null, 404);
      }

      let profileData = null;

      // lấy thông tin hồ sơ tương ứng theo vai trò
      if (user.role === 'student') {
        const student = await StudentProfile.findOne({ user_id: user._id });
        if (student) {
          const studentObj = student.toObject();
          // giải mã địa chỉ chi tiết cho chính chủ học viên xem
          if (studentObj.address_detail) {
            studentObj.address_detail = decrypt(studentObj.address_detail);
          }
          profileData = studentObj;
        }
      } else if (user.role === 'tutor') {
        const tutor = await TutorProfile.findOne({ user_id: user._id });
        if (tutor) {
          const tutorObj = tutor.toObject();
          // che mờ số cccd chỉ hiển thị 4 số cuối theo quy định mục 8.2 (******1234)
          if (tutorObj.id_card_no) {
            const rawIdCard = decrypt(tutorObj.id_card_no);
            tutorObj.id_card_no = maskIdCard(rawIdCard);
          }
          profileData = tutorObj;
        }
      } else if (user.role === 'center') {
        profileData = await Center.findOne({ user_id: user._id });
      }

      return ApiResponse.success(res, 'lấy thông tin người dùng thành công', {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        email_verified: user.email_verified,
        last_login: user.last_login,
        profile: profileData,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;

