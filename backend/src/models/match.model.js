/**
 * mô hình dữ liệu ứng tuyển (applications) và kết nối lớp học (matches)
 * tuân thủ mục 7 và quy trình nghiệp vụ kết nối mục 5.4 trong tài liệu
 */

const mongoose = require('mongoose');

// ==========================================
// 1. ĐƠN ỨNG TUYỂN CỦA GIA SƯ (applications)
// ==========================================
const applicationSchema = new mongoose.Schema(
  {
    // gia sư nộp hồ sơ ứng tuyển
    tutor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // đối tượng ứng tuyển: lớp của học viên (class_request) hoặc tin trung tâm (center_job)
    target_type: {
      type: String,
      enum: ['class_request', 'center_job'],
      required: true,
    },
    // id của bài đăng lớp học hoặc việc làm
    target_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    // lời nhắn giới thiệu của gia sư khi ứng tuyển
    message: {
      type: String,
      default: '',
    },
    // trạng thái xử lý đơn ứng tuyển:
    // - pending: đang chờ học viên/trung tâm xem xét
    // - accepted: đã được chấp nhận (tiến hành kết nối tạo lớp học)
    // - rejected: bị từ chối
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// đảm bảo mỗi gia sư chỉ ứng tuyển vào 1 bài đăng tối đa 1 lần
applicationSchema.index({ tutor_id: 1, target_type: 1, target_id: 1 }, { unique: true });

// ==========================================
// 2. KẾT NỐI LỚP HỌC ĐƯỢC THÀNH LẬP (matches)
// ==========================================
const matchSchema = new mongoose.Schema(
  {
    // bên tuyển: có thể là học viên hoặc trung tâm
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // gia sư phụ trách dạy
    tutor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // nguồn gốc phát sinh lớp (id của class_request hoặc center_job)
    source_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // ngày học thử (trial)
    trial_date: {
      type: Date,
    },
    // ngày bắt đầu học chính thức
    start_date: {
      type: Date,
    },
    // mức học phí đã thỏa thuận giữa hai bên (vnd/buổi)
    fee: {
      type: Number,
      default: 0,
    },
    // trạng thái lớp học:
    // - trial: đang trong giai đoạn học thử
    // - active: đang học chính thức
    // - finished: đã hoàn thành khóa học
    // - cancelled: đã hủy lớp
    status: {
      type: String,
      enum: ['trial', 'active', 'finished', 'cancelled'],
      default: 'trial',
      index: true,
    },
    // lý do nếu hủy lớp
    cancel_reason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = {
  Application: mongoose.model('Application', applicationSchema),
  Match: mongoose.model('Match', matchSchema),
};

