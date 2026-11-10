/**
 * mô hình dữ liệu người dùng (users) trong hệ thống
 * quản lý thông tin đăng nhập, vai trò (role), trạng thái và xóa mềm (soft delete)
 * các thuộc tính được thiết kế bám sát mục 7 của tài liệu dự án
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    // địa chỉ email là duy nhất, tự động chuyển về chữ thường để tránh trùng lặp
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // chuỗi mật khẩu đã được băm an toàn bằng bcrypt
    password_hash: {
      type: String,
      required: true,
      select: false, // không tự động trả trường này ra ngoài api để đảm bảo an toàn tuyệt đối
    },
    // số điện thoại liên hệ
    phone: {
      type: String,
      trim: true,
    },
    // vai trò người dùng trong hệ thống (phân quyền rbac)
    role: {
      type: String,
      enum: ['student', 'tutor', 'center', 'admin'],
      required: true,
      index: true,
    },
    // trạng thái tài khoản:
    // - pending: tài khoản mới tạo chờ xác thực email hoặc chờ duyệt
    // - active: tài khoản đang hoạt động bình thường
    // - locked: tài khoản bị khóa do vi phạm hoặc đăng nhập sai quá nhiều lần
    status: {
      type: String,
      enum: ['pending', 'active', 'locked'],
      default: 'pending',
      index: true,
    },
    // cờ đánh dấu đã xác thực email qua otp hay chưa
    email_verified: {
      type: Boolean,
      default: false,
    },
    // số lần đăng nhập sai liên tiếp để kích hoạt rate limit / khóa tạm thời
    failed_login_count: {
      type: Number,
      default: 0,
    },
    // thời điểm đăng nhập gần nhất
    last_login: {
      type: Date,
    },
    // thời điểm xóa mềm (soft delete), nếu khác null nghĩa là tài khoản đã bị xóa
    deleted_at: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

/**
 * middleware tiền xử lý (pre-save): tự động băm mật khẩu khi tạo mới hoặc cập nhật
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * hàm so khớp mật khẩu người dùng nhập vào với chuỗi băm trong cơ sở dữ liệu
 * @param {string} candidatePassword - mật khẩu dạng thô do người dùng nhập
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model('User', userSchema);
