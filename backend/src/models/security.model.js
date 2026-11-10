/**
 * mô hình dữ liệu bảo mật hệ thống: mã otp, refresh token, nhật ký kiểm toán (audit log)
 * tuân thủ mục 7 và bảo mật mức 8.1, 8.2 trong tài liệu đặc tả
 */

const mongoose = require('mongoose');

// ==========================================
// 1. MÃ XÁC THỰC OTP (otp_codes)
// ==========================================
const otpCodeSchema = new mongoose.Schema(
  {
    // liên kết với tài khoản người dùng (nếu đã có)
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // email nhận mã
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // mã otp được băm hoặc lưu bảo mật
    otp_hash: {
      type: String,
      required: true,
    },
    // loại mục đích: xác thực email hoặc đặt lại mật khẩu
    type: {
      type: String,
      enum: ['verify_email', 'reset_password'],
      default: 'verify_email',
    },
    // thời điểm hết hạn (mặc định 5 phút kể từ khi tạo)
    expires_at: {
      type: Date,
      required: true,
      index: { expires: 0 }, // mongodb ttl index tự động xóa bản ghi khi hết hạn
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 2. QUẢN LÝ REFRESH TOKEN (refresh_tokens)
// ==========================================
const refreshTokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // mã băm của refresh token để kiểm tra tính hợp lệ
    token_hash: {
      type: String,
      required: true,
      index: true,
    },
    // thời điểm hết hạn (7 ngày theo quy định mục 3.1)
    expires_at: {
      type: Date,
      required: true,
      index: { expires: 0 }, // ttl index tự động dọn dẹp token hết hạn
    },
    // cờ đánh dấu token đã bị thu hồi (revoke) khi đăng xuất
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 3. NHẬT KÝ KIỂM TOÁN HỆ THỐNG (audit_logs)
// ==========================================
const auditLogSchema = new mongoose.Schema(
  {
    // người thực hiện hành động
    actor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // hành động thực hiện (ví dụ: APPROVE_TUTOR, VIEW_DOCUMENTS, LOCK_USER...)
    action: {
      type: String,
      required: true,
      index: true,
    },
    // loại đối tượng bị tác động
    target_type: {
      type: String,
      required: true,
    },
    // id của đối tượng bị tác động
    target_id: {
      type: String,
      required: true,
    },
    // địa chỉ ip của client
    ip: {
      type: String,
      default: '',
    },
    // chuỗi thông tin trình duyệt / thiết bị
    user_agent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

module.exports = {
  OtpCode: mongoose.model('OtpCode', otpCodeSchema),
  RefreshToken: mongoose.model('RefreshToken', refreshTokenSchema),
  AuditLog: mongoose.model('AuditLog', auditLogSchema),
};

