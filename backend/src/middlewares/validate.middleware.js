/**
 * middleware kiểm tra tính hợp lệ của dữ liệu đầu vào (joi validation)
 * các thông báo lỗi được viết bằng tiếng việt tự nhiên, thân thiện và rõ ràng
 */

const Joi = require('joi');
const ApiResponse = require('../utils/response.util');

const validateSchema = (schema, data, res, next) => {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (!error) {
    req_body_cleaned = value;
    return next();
  }

  const details = error.details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message.replace(/['"]/g, ''),
  }));

  return ApiResponse.error(res, 'Thông tin chưa hợp lệ, vui lòng kiểm tra lại.', 'VALIDATION_ERROR', details, 400);
};

const validateMiddleware = {
  /**
   * kiểm tra thông tin đăng ký (gọn gàng, thân thiện)
   */
  register: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Vui lòng nhập địa chỉ email',
        'string.email': 'Địa chỉ email không đúng định dạng',
        'any.required': 'Email là bắt buộc',
      }),
      phone: Joi.string()
        .pattern(/^(0[3|5|7|8|9])[0-9]{8}$/)
        .required()
        .messages({
          'string.empty': 'Vui lòng nhập số điện thoại',
          'string.pattern.base': 'Số điện thoại không hợp lệ (gồm 10 số, ví dụ 0912345678)',
          'any.required': 'Số điện thoại là bắt buộc',
        }),
      password: Joi.string().min(8).required().messages({
        'string.empty': 'Vui lòng nhập mật khẩu',
        'string.min': 'Mật khẩu cần có ít nhất 8 ký tự',
        'any.required': 'Mật khẩu là bắt buộc',
      }),
      role: Joi.string().valid('student', 'tutor', 'center').default('student').messages({
        'any.only': 'Vai trò không hợp lệ (chỉ chấp nhận: học viên, gia sư, trung tâm)',
      }),
      agreeTerms: Joi.boolean().default(true),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));
      return ApiResponse.error(res, 'Thông tin đăng ký chưa hợp lệ', 'VALIDATION_ERROR', details, 400);
    }

    req.body = value;
    next();
  },

  /**
   * kiểm tra mã otp
   */
  verifyOtp: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Vui lòng cung cấp email',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc',
      }),
      otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'string.empty': 'Vui lòng nhập mã OTP',
        'string.length': 'Mã OTP gồm đúng 6 chữ số',
        'string.pattern.base': 'Mã OTP chỉ gồm các chữ số',
        'any.required': 'Mã OTP là bắt buộc',
      }),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return ApiResponse.error(res, error.details[0].message.replace(/['"]/g, ''), 'VALIDATION_ERROR', null, 400);
    }
    req.body = value;
    next();
  },

  /**
   * gửi lại mã otp
   */
  resendOtp: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Vui lòng cung cấp email',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc',
      }),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return ApiResponse.error(res, error.details[0].message.replace(/['"]/g, ''), 'VALIDATION_ERROR', null, 400);
    }
    req.body = value;
    next();
  },

  /**
   * kiểm tra đăng nhập
   */
  login: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Vui lòng nhập email',
        'string.email': 'Email không đúng định dạng',
        'any.required': 'Email là bắt buộc',
      }),
      password: Joi.string().required().messages({
        'string.empty': 'Vui lòng nhập mật khẩu',
        'any.required': 'Mật khẩu là bắt buộc',
      }),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return ApiResponse.error(res, error.details[0].message.replace(/['"]/g, ''), 'VALIDATION_ERROR', null, 400);
    }
    req.body = value;
    next();
  },

  /**
   * yêu cầu quên mật khẩu
   */
  forgotPassword: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Vui lòng nhập email',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc',
      }),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return ApiResponse.error(res, error.details[0].message.replace(/['"]/g, ''), 'VALIDATION_ERROR', null, 400);
    }
    req.body = value;
    next();
  },

  /**
   * đặt lại mật khẩu bằng mã otp
   */
  resetPassword: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Vui lòng nhập email',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc',
      }),
      otp: Joi.string().length(6).required().messages({
        'string.empty': 'Vui lòng nhập mã OTP',
        'string.length': 'Mã OTP gồm 6 chữ số',
        'any.required': 'Mã OTP là bắt buộc',
      }),
      newPassword: Joi.string().min(8).required().messages({
        'string.empty': 'Vui lòng nhập mật khẩu mới',
        'string.min': 'Mật khẩu mới phải từ 8 ký tự trở lên',
        'any.required': 'Mật khẩu mới là bắt buộc',
      }),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return ApiResponse.error(res, error.details[0].message.replace(/['"]/g, ''), 'VALIDATION_ERROR', null, 400);
    }
    req.body = value;
    next();
  },

  /**
   * đổi mật khẩu
   */
  changePassword: (req, res, next) => {
    const schema = Joi.object({
      oldPassword: Joi.string().required().messages({
        'string.empty': 'Vui lòng nhập mật khẩu hiện tại',
        'any.required': 'Mật khẩu hiện tại là bắt buộc',
      }),
      newPassword: Joi.string().min(8).required().messages({
        'string.empty': 'Vui lòng nhập mật khẩu mới',
        'string.min': 'Mật khẩu mới phải từ 8 ký tự trở lên',
        'any.required': 'Mật khẩu mới là bắt buộc',
      }),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return ApiResponse.error(res, error.details[0].message.replace(/['"]/g, ''), 'VALIDATION_ERROR', null, 400);
    }
    req.body = value;
    next();
  },
};

module.exports = validateMiddleware;
