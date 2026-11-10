/**
 * mô hình dữ liệu tin đăng tìm gia sư của học viên và tin tuyển dụng của trung tâm
 * tuân thủ mục 7 và luồng kiểm duyệt mục 9.1
 */

const mongoose = require('mongoose');

// ==========================================
// 1. TIN ĐĂNG TÌM GIA SƯ CỦA HỌC VIÊN (class_requests)
// ==========================================
const classRequestSchema = new mongoose.Schema(
  {
    // học viên / phụ huynh đăng tin
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // môn học cần tìm
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    // lớp hoặc trình độ học (lớp 9, lớp 12, giao tiếp...)
    level: {
      type: String,
      required: true,
    },
    // mô tả học lực hiện tại của học viên
    current_level_desc: {
      type: String,
      default: '',
    },
    // hình thức học (online, offline tại nhà, hoặc cả hai)
    mode: {
      type: String,
      enum: ['online', 'offline', 'both'],
      default: 'offline',
    },
    // tỉnh / thành phố cần học
    province: {
      type: String,
      required: true,
      index: true,
    },
    // quận / huyện cần học
    district: {
      type: String,
      required: true,
    },
    // ngân sách chi trả cho mỗi buổi học (vnd)
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    // số buổi học mỗi tuần
    sessions_per_week: {
      type: Number,
      default: 2,
    },
    // lịch học mong muốn (ví dụ: tối thứ 2, 4, 6)
    preferred_schedule: {
      type: String,
      default: '',
    },
    // yêu cầu giới tính gia sư (nam, nữ, hoặc không yêu cầu)
    tutor_gender_pref: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any',
    },
    // mô tả chi tiết thêm về yêu cầu lớp học
    description: {
      type: String,
      default: '',
    },
    // trạng thái tin đăng:
    // - pending_review: chờ admin duyệt nội dung
    // - open: đã duyệt và đang mở cho gia sư ứng tuyển
    // - closed: đã tìm được gia sư hoặc đủ ứng viên
    // - cancelled: học viên tự hủy tin
    status: {
      type: String,
      enum: ['pending_review', 'open', 'closed', 'cancelled'],
      default: 'pending_review',
      index: true,
    },
    // admin kiểm duyệt bài đăng
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 2. TIN TUYỂN DỤNG GIA SƯ CỦA TRUNG TÂM (center_jobs)
// ==========================================
const centerJobSchema = new mongoose.Schema(
  {
    // trung tâm đăng tin
    center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // môn học cần tuyển
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    // cấp độ dạy
    level: {
      type: String,
      required: true,
    },
    // mức lương trung tâm chi trả
    salary: {
      type: String,
      required: true,
    },
    // yêu cầu đối với ứng viên gia sư
    requirements: {
      type: String,
      default: '',
    },
    // địa điểm làm việc / dạy
    location: {
      type: String,
      required: true,
    },
    // lịch giảng dạy tại trung tâm
    schedule: {
      type: String,
      default: '',
    },
    // số lượng gia sư cần tuyển
    quantity: {
      type: Number,
      default: 1,
    },
    // hạn chót nộp hồ sơ ứng tuyển
    deadline: {
      type: Date,
    },
    // trạng thái tin tuyển dụng
    status: {
      type: String,
      enum: ['pending_review', 'open', 'closed'],
      default: 'pending_review',
      index: true,
    },
    // admin kiểm duyệt
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = {
  ClassRequest: mongoose.model('ClassRequest', classRequestSchema),
  CenterJob: mongoose.model('CenterJob', centerJobSchema),
};

