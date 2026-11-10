/**
 * bộ điều khiển xác thực người dùng (auth controller)
 * hiện thực toàn bộ các nghiệp vụ US01, US02 theo danh mục api 3.3.a:
 * - đăng ký và gửi mã otp xác thực email
 * - xác thực mã otp, gửi lại otp
 * - đăng nhập, cấp access token (15m) và refresh token (7d) qua httponly cookie
 * - tự động làm mới access token
 * - đăng xuất, thu hồi cookie và phiên đăng nhập
 * - quên mật khẩu, đặt lại mật khẩu bằng mã otp, đổi mật khẩu
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  User,
  StudentProfile,
  TutorProfile,
  Center,
  OtpCode,
  RefreshToken,
} = require('../models');
const ApiResponse = require('../utils/response.util');
const { sendOtpEmail } = require('../utils/email.util');

// thời gian sống của token theo đặc tả kiến trúc mục 3.1
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 phút
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // 7 ngày

/**
 * tạo chuỗi access token jwt chứa id và role của người dùng
 */
const generateAccessToken = (user) => {
  const secret = process.env.JWT_SECRET || 'jwt_access_secret_key_sprint_1_dev';
  return jwt.sign(
    {
      id: user._id || user.id,
      role: user.role,
    },
    secret,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * tạo chuỗi refresh token jwt chứa id người dùng
 */
const generateRefreshToken = (user) => {
  const secret = process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret_key_sprint_1_dev';
  return jwt.sign(
    {
      id: user._id || user.id,
    },
    secret,
    { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` }
  );
};

/**
 * sinh ngẫu nhiên mã số otp gồm 6 chữ số
 */
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * thiết lập cookie httponly cho refresh token để ngăn chặn xss
 */
const setRefreshTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true, // chặn javascript truy cập trực tiếp từ document.cookie
    secure: isProduction, // chỉ gửi qua https khi ở môi trường production
    sameSite: isProduction ? 'strict' : 'lax', // chống csrf
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000, // 7 ngày tính theo milliseconds
    path: '/',
  });
};

const authController = {
  /**
   * 1. ĐĂNG KÝ TÀI KHOẢN (POST /auth/register)
   * tạo tài khoản trạng thái pending, sinh mã otp gửi qua email để kích hoạt
   */
  register: async (req, res, next) => {
    try {
      const { email, phone, password, role } = req.body;

      // kiểm tra email đã được đăng ký trước đó chưa
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return ApiResponse.error(res, 'địa chỉ email này đã được sử dụng', 'EMAIL_ALREADY_EXISTS', null, 409);
      }

      // kiểm tra số điện thoại đã được đăng ký chưa
      if (phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
          return ApiResponse.error(res, 'số điện thoại này đã được sử dụng', 'PHONE_ALREADY_EXISTS', null, 409);
        }
      }

      // tạo bản ghi người dùng mới (mật khẩu sẽ được middleware pre-save tự động băm bcrypt)
      const newUser = new User({
        email: email.toLowerCase(),
        password_hash: password,
        phone,
        role,
        status: 'pending',
        email_verified: false,
      });

      await newUser.save();

      // tự động khởi tạo bản ghi hồ sơ tương ứng theo vai trò để sẵn sàng sử dụng
      if (role === 'student') {
        await StudentProfile.create({ user_id: newUser._id });
      } else if (role === 'tutor') {
        await TutorProfile.create({ user_id: newUser._id });
      } else if (role === 'center') {
        await Center.create({
          user_id: newUser._id,
          name: `Trung tâm ${email.split('@')[0]}`,
          phone,
        });
      }

      // sinh mã otp 6 chữ số và lưu vào cơ sở dữ liệu (thời hạn 5 phút)
      const otp = generateOtpCode();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // xóa các mã otp cũ của email này nếu có
      await OtpCode.deleteMany({ email: email.toLowerCase(), type: 'verify_email' });

      await OtpCode.create({
        user_id: newUser._id,
        email: email.toLowerCase(),
        otp_hash: otp, // có thể băm nếu muốn bảo mật cao hơn
        type: 'verify_email',
        expires_at: expiresAt,
      });

      // gửi email chứa mã xác nhận otp
      await sendOtpEmail(email.toLowerCase(), otp, 'verify_email');

      return ApiResponse.success(
        res,
        'đăng ký tài khoản thành công! vui lòng kiểm tra email để lấy mã xác thực',
        {
          userId: newUser._id,
          status: newUser.status,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * 2. XÁC THỰC MÃ OTP (POST /auth/verify-otp)
   * kích hoạt tài khoản khi người dùng nhập đúng mã otp
   */
  verifyOtp: async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      // tìm mã otp hợp lệ trong cơ sở dữ liệu
      const record = await OtpCode.findOne({
        email: email.toLowerCase(),
        type: 'verify_email',
        expires_at: { $gt: new Date() },
      });

      if (!record || record.otp_hash !== otp) {
        return ApiResponse.error(res, 'mã otp không chính xác hoặc đã hết hạn', 'INVALID_OTP', null, 400);
      }

      // tìm và cập nhật trạng thái người dùng
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return ApiResponse.error(res, 'không tìm thấy tài khoản người dùng', 'USER_NOT_FOUND', null, 404);
      }

      user.email_verified = true;
      // đối với học viên, sau khi xác thực email sẽ được kích hoạt luôn (active)
      // đối với gia sư và trung tâm, cần admin duyệt hồ sơ theo quy định mục 9.1
      if (user.role === 'student') {
        user.status = 'active';
      }
      await user.save();

      // xóa mã otp đã dùng xong
      await OtpCode.deleteMany({ email: email.toLowerCase(), type: 'verify_email' });

      return ApiResponse.success(res, 'xác thực tài khoản thành công', { verified: true });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 3. GỬI LẠI MÃ OTP (POST /auth/resend-otp)
   */
  resendOtp: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return ApiResponse.error(res, 'địa chỉ email chưa được đăng ký trong hệ thống', 'USER_NOT_FOUND', null, 404);
      }

      if (user.email_verified) {
        return ApiResponse.error(res, 'tài khoản này đã được xác thực email trước đó', 'ALREADY_VERIFIED', null, 400);
      }

      // sinh mã otp mới
      const otp = generateOtpCode();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // xóa mã otp cũ
      await OtpCode.deleteMany({ email: email.toLowerCase(), type: 'verify_email' });

      await OtpCode.create({
        user_id: user._id,
        email: email.toLowerCase(),
        otp_hash: otp,
        type: 'verify_email',
        expires_at: expiresAt,
      });

      await sendOtpEmail(email.toLowerCase(), otp, 'verify_email');

      return ApiResponse.success(res, 'đã gửi lại mã otp mới vào email của bạn', { message: 'gửi lại thành công' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 4. ĐĂNG NHẬP (POST /auth/login)
   * kiểm tra thông tin, cấp access token và refresh token
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // tìm người dùng và lấy thêm trường password_hash (do schema đặt select: false)
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password_hash');
      if (!user) {
        return ApiResponse.error(res, 'email hoặc mật khẩu không chính xác', 'INVALID_CREDENTIALS', null, 401);
      }

      // kiểm tra tài khoản có bị khóa không
      if (user.status === 'locked') {
        return ApiResponse.error(res, 'tài khoản của bạn đã bị khóa, vui lòng liên hệ ban quản trị', 'ACCOUNT_LOCKED', null, 403);
      }

      // so sánh mật khẩu
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        user.failed_login_count = (user.failed_login_count || 0) + 1;
        // nếu đăng nhập sai từ 5 lần trở lên, khóa tạm thời tài khoản theo quy định mục 5.1
        if (user.failed_login_count >= 5) {
          user.status = 'locked';
          await user.save();
          return ApiResponse.error(
            res,
            'bạn đã nhập sai mật khẩu quá 5 lần, tài khoản đã bị tạm khóa để bảo đảm an toàn',
            'ACCOUNT_LOCKED',
            null,
            403
          );
        }
        await user.save();
        return ApiResponse.error(res, 'email hoặc mật khẩu không chính xác', 'INVALID_CREDENTIALS', null, 401);
      }

      // đăng nhập thành công: đặt lại số lần sai và cập nhật thời gian đăng nhập
      user.failed_login_count = 0;
      user.last_login = new Date();
      await user.save();

      // lấy thông tin hồ sơ tương ứng để trả về họ tên và avatar
      let fullName = '';
      let avatar = '';

      if (user.role === 'student') {
        const profile = await StudentProfile.findOne({ user_id: user._id });
        if (profile) {
          fullName = profile.full_name || '';
          avatar = profile.avatar || '';
        }
      } else if (user.role === 'tutor') {
        const profile = await TutorProfile.findOne({ user_id: user._id });
        if (profile) {
          fullName = profile.full_name || '';
          avatar = profile.avatar || '';
        }
      } else if (user.role === 'center') {
        const profile = await Center.findOne({ user_id: user._id });
        if (profile) {
          fullName = profile.name || '';
          avatar = profile.logo || '';
        }
      } else if (user.role === 'admin') {
        fullName = 'Quản trị viên';
      }

      // sinh access token và refresh token
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // lưu refresh token vào csdl để quản lý phiên đăng nhập
      const refreshTokenExpires = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      await RefreshToken.create({
        user_id: user._id,
        token_hash: refreshToken,
        expires_at: refreshTokenExpires,
      });

      // gửi refresh token qua httponly cookie
      setRefreshTokenCookie(res, refreshToken);

      // trả về kết quả đăng nhập theo đúng cấu trúc mục 3.3.a
      return ApiResponse.success(res, 'đăng nhập thành công', {
        accessToken,
        user: {
          id: user._id,
          role: user.role,
          email: user.email,
          fullName: fullName || user.email.split('@')[0],
          avatar,
          status: user.status,
          email_verified: user.email_verified,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 5. LÀM MỚI ACCESS TOKEN (POST /auth/refresh)
   * đọc refresh token từ httponly cookie và cấp access token mới
   */
  refreshToken: async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        return ApiResponse.error(res, 'không tìm thấy phiên đăng nhập, vui lòng đăng nhập lại', 'NO_REFRESH_TOKEN', null, 401);
      }

      // kiểm tra token trong cơ sở dữ liệu
      const storedToken = await RefreshToken.findOne({
        token_hash: token,
        revoked: false,
        expires_at: { $gt: new Date() },
      });

      if (!storedToken) {
        return ApiResponse.error(res, 'phiên đăng nhập không hợp lệ hoặc đã bị thu hồi', 'INVALID_REFRESH_TOKEN', null, 403);
      }

      const secret = process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret_key_sprint_1_dev';

      jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
          return ApiResponse.error(res, 'refresh token đã hết hạn hoặc không đúng', 'TOKEN_EXPIRED', null, 403);
        }

        const user = await User.findById(decoded.id);
        if (!user || user.status === 'locked' || user.deleted_at !== null) {
          return ApiResponse.error(res, 'tài khoản không tồn tại hoặc đã bị khóa', 'ACCOUNT_UNAVAILABLE', null, 403);
        }

        // cấp lại access token mới (15 phút)
        const newAccessToken = generateAccessToken(user);

        return ApiResponse.success(res, 'làm mới token thành công', {
          accessToken: newAccessToken,
        });
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 6. ĐĂNG XUẤT (POST /auth/logout)
   * thu hồi refresh token trong csdl và xóa cookie trình duyệt
   */
  logout: async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken;
      if (token) {
        // đánh dấu thu hồi refresh token trong database
        await RefreshToken.updateOne({ token_hash: token }, { revoked: true });
      }

      // xóa cookie trên trình duyệt
      const isProduction = process.env.NODE_ENV === 'production';
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
      });

      return ApiResponse.success(res, 'đăng xuất thành công', { message: 'đã kết thúc phiên làm việc an toàn' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 7. YÊU CẦU QUÊN MẬT KHẨU (POST /auth/forgot-password)
   * sinh mã otp và gửi vào email của người dùng
   */
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // để bảo mật không tiết lộ email có tồn tại hay không, vẫn báo thông báo chung
        return ApiResponse.success(res, 'nếu email tồn tại trong hệ thống, bạn sẽ nhận được mã otp đặt lại mật khẩu');
      }

      const otp = generateOtpCode();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await OtpCode.deleteMany({ email: email.toLowerCase(), type: 'reset_password' });

      await OtpCode.create({
        user_id: user._id,
        email: email.toLowerCase(),
        otp_hash: otp,
        type: 'reset_password',
        expires_at: expiresAt,
      });

      await sendOtpEmail(email.toLowerCase(), otp, 'reset_password');

      return ApiResponse.success(res, 'mã xác nhận đặt lại mật khẩu đã được gửi đến email của bạn');
    } catch (error) {
      next(error);
    }
  },

  /**
   * 8. ĐẶT LẠI MẬT KHẨU BẰNG MÃ OTP (POST /auth/reset-password)
   */
  resetPassword: async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body;

      const record = await OtpCode.findOne({
        email: email.toLowerCase(),
        type: 'reset_password',
        expires_at: { $gt: new Date() },
      });

      if (!record || record.otp_hash !== otp) {
        return ApiResponse.error(res, 'mã otp không hợp lệ hoặc đã hết hạn', 'INVALID_OTP', null, 400);
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return ApiResponse.error(res, 'người dùng không tồn tại', 'USER_NOT_FOUND', null, 404);
      }

      // cập nhật mật khẩu mới (sẽ được pre-save băm lại)
      user.password_hash = newPassword;
      user.failed_login_count = 0; // xóa số lần nhập sai nếu có
      await user.save();

      // thu hồi toàn bộ phiên đăng nhập cũ để đảm bảo an toàn theo mục 5.1
      await RefreshToken.updateMany({ user_id: user._id }, { revoked: true });

      // xóa mã otp đã dùng
      await OtpCode.deleteMany({ email: email.toLowerCase(), type: 'reset_password' });

      return ApiResponse.success(res, 'đặt lại mật khẩu thành công! bạn có thể đăng nhập bằng mật khẩu mới');
    } catch (error) {
      next(error);
    }
  },

  /**
   * 9. ĐỔI MẬT KHẨU KHI ĐÃ ĐĂNG NHẬP (PUT /auth/change-password)
   */
  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId).select('+password_hash');
      if (!user) {
        return ApiResponse.error(res, 'không tìm thấy tài khoản người dùng', 'USER_NOT_FOUND', null, 404);
      }

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return ApiResponse.error(res, 'mật khẩu hiện tại không đúng', 'INCORRECT_PASSWORD', null, 400);
      }

      user.password_hash = newPassword;
      await user.save();

      return ApiResponse.success(res, 'đổi mật khẩu thành công');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
