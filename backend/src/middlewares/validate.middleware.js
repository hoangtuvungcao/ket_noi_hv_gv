const Joi = require('joi');

const validateMiddleware = {
  register: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
      }),
      password: Joi.string().min(8).required().messages({
        'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
        'any.required': 'Mật khẩu là bắt buộc'
      }),
      role: Joi.string().valid('student', 'tutor', 'center').required().messages({
        'any.only': 'Vai trò không hợp lệ'
      }),
      phone: Joi.string().pattern(/^[0-9]{10,11}$/).optional().messages({
        'string.pattern.base': 'Số điện thoại không hợp lệ'
      })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
  },

  login: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
    next();
  }
};

module.exports = validateMiddleware;