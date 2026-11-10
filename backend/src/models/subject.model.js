/**
 * mô hình dữ liệu môn học, môn dạy của gia sư và lịch rảnh
 * tuân thủ mục 7 của tài liệu dự án
 */

const mongoose = require('mongoose');

// ==========================================
// 1. DANH MỤC MÔN HỌC CHUNG (subjects)
// ==========================================
const subjectSchema = new mongoose.Schema(
  {
    // tên môn học (toán, vật lý, hóa học, tiếng anh, tin học, đàn piano...)
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // cấp độ đào tạo (tiểu học, thcs, thpt, đại học, luyện thi, khác)
    level: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 2. MÔN HỌC GIA SƯ ĐĂNG KÝ DẠY (tutor_subjects)
// ==========================================
const tutorSubjectSchema = new mongoose.Schema(
  {
    tutor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    level: {
      type: String,
      required: true,
    },
    // mức học phí cho mỗi buổi dạy (vnd/buổi)
    price_per_session: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 3. LỊCH RẢNH CỦA GIA SƯ (tutor_availability)
// ==========================================
const tutorAvailabilitySchema = new mongoose.Schema(
  {
    tutor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // thứ trong tuần (từ 2 đến 8 với 8 là chủ nhật)
    day_of_week: {
      type: Number,
      required: true,
      min: 2,
      max: 8,
    },
    // giờ bắt đầu (định dạng HH:mm, ví dụ: "18:00")
    start_time: {
      type: String,
      required: true,
    },
    // giờ kết thúc (định dạng HH:mm, ví dụ: "20:00")
    end_time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = {
  Subject: mongoose.model('Subject', subjectSchema),
  TutorSubject: mongoose.model('TutorSubject', tutorSubjectSchema),
  TutorAvailability: mongoose.model('TutorAvailability', tutorAvailabilitySchema),
};

