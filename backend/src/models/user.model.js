const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  phone: { type: String }, // Sẽ được mã hóa ở cấp Controller hoặc Pre-save
  role: { 
    type: String, 
    enum: ['student', 'tutor', 'center', 'admin'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'locked'], 
    default: 'pending' // Tài khoản mới mặc định cần xác thực hoặc chờ duyệt
  },
  email_verified: { type: Boolean, default: false },
  last_login: { type: Date }
}, { timestamps: true }); // Tự động tạo createdAt và updatedAt

// Middleware tự động hash password trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

// Hàm kiểm tra mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model('User', userSchema);