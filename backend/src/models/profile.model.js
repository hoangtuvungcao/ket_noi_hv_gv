/**
 * mô hình dữ liệu hồ sơ cá nhân theo từng vai trò (học viên, gia sư, trung tâm)
 * tuân thủ mục 7 và bảo mật thông tin theo mục 8 trong tài liệu đặc tả
 */

const mongoose = require('mongoose');

// ==========================================
// 1. HỒ SƠ HỌC VIÊN / PHỤ HUYNH (student_profiles)
// ==========================================
const studentProfileSchema = new mongoose.Schema(
  {
    // liên kết với tài khoản người dùng
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    // họ và tên đầy đủ
    full_name: {
      type: String,
      default: '',
      trim: true,
    },
    // đường dẫn ảnh đại diện
    avatar: {
      type: String,
      default: '',
    },
    // ngày tháng năm sinh
    dob: {
      type: Date,
    },
    // giới tính
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    // lớp hoặc cấp học hiện tại của học viên (ví dụ: lớp 10, đại học...)
    grade_level: {
      type: String,
      default: '',
    },
    // tỉnh / thành phố
    province: {
      type: String,
      default: '',
      index: true,
    },
    // quận / huyện
    district: {
      type: String,
      default: '',
    },
    // địa chỉ chi tiết (được mã hóa aes-256 để bảo vệ quyền riêng tư)
    address_detail: {
      type: String,
      default: '',
    },
    // mục tiêu học tập (ví dụ: ôn thi đại học, cải thiện điểm số...)
    learning_goal: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 2. HỒ SƠ GIA SƯ (tutor_profiles)
// ==========================================
const tutorProfileSchema = new mongoose.Schema(
  {
    // liên kết với tài khoản người dùng
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    // họ và tên gia sư
    full_name: {
      type: String,
      default: '',
      trim: true,
    },
    // ảnh đại diện
    avatar: {
      type: String,
      default: '',
    },
    // ngày tháng năm sinh
    dob: {
      type: Date,
    },
    // giới tính
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    // số cccd đã mã hóa aes-256 (bảo mật nghiêm ngặt)
    id_card_no: {
      type: String,
      default: '',
    },
    // trường đại học đã/đang theo học
    university: {
      type: String,
      default: '',
    },
    // chuyên ngành đào tạo
    major: {
      type: String,
      default: '',
    },
    // bằng cấp cao nhất (cử nhân, thạc sĩ, tiến sĩ...)
    degree: {
      type: String,
      default: '',
    },
    // nghề nghiệp hiện tại (sinh viên, giáo viên, chuyên gia...)
    occupation: {
      type: String,
      default: '',
    },
    // số năm kinh nghiệm giảng dạy
    experience_years: {
      type: Number,
      default: 0,
    },
    // đoạn giới thiệu bản thân, phương pháp dạy
    bio: {
      type: String,
      default: '',
    },
    // hình thức giảng dạy: trực tuyến, trực tiếp tại nhà, hoặc cả hai
    teaching_mode: {
      type: String,
      enum: ['online', 'offline', 'both'],
      default: 'both',
    },
    // khu vực nhận dạy (danh sách quận/huyện hoặc tỉnh thành)
    teaching_areas: {
      type: [String],
      default: [],
    },
    // mức học phí tối thiểu (vnd/buổi)
    rate_min: {
      type: Number,
      default: 0,
      index: true,
    },
    // mức học phí tối đa (vnd/buổi)
    rate_max: {
      type: Number,
      default: 0,
      index: true,
    },
    // trạng thái kiểm duyệt hồ sơ gia sư từ admin:
    // - pending: chờ duyệt giấy tờ
    // - approved: đã duyệt, được phép hiển thị trên thanh tìm kiếm và ứng tuyển lớp
    // - rejected: bị từ chối hồ sơ
    verification_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    // điểm đánh giá trung bình (1 đến 5 sao)
    rating_avg: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    // tổng số lượt đánh giá nhận được
    rating_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 3. GIẤY TỜ XÁC MINH GIA SƯ (tutor_documents)
// ==========================================
const tutorDocumentSchema = new mongoose.Schema(
  {
    tutor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // loại giấy tờ xác thực: cccd, bằng cấp, thẻ sinh viên, chứng chỉ
    type: {
      type: String,
      enum: ['cccd', 'degree', 'student_card', 'certificate'],
      required: true,
    },
    // mã định danh file lưu trữ trong kho riêng tư
    file_key: {
      type: String,
      required: true,
    },
    // trạng thái duyệt của giấy tờ
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // admin thực hiện kiểm duyệt
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // thời gian duyệt
    reviewed_at: {
      type: Date,
    },
    // lý do từ chối nếu không hợp lệ
    reject_reason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 4. HỒ SƠ TRUNG TÂM GIA SƯ (centers)
// ==========================================
const centerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    // tên trung tâm
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // mã số giấy phép kinh doanh
    business_license_no: {
      type: String,
      default: '',
    },
    // file giấy phép kinh doanh lưu trữ kho riêng tư
    license_file_key: {
      type: String,
      default: '',
    },
    // địa chỉ trụ sở trung tâm
    address: {
      type: String,
      default: '',
    },
    // số điện thoại liên hệ của trung tâm
    phone: {
      type: String,
      default: '',
    },
    // giới thiệu về trung tâm
    description: {
      type: String,
      default: '',
    },
    // logo trung tâm
    logo: {
      type: String,
      default: '',
    },
    // trạng thái xác minh doanh nghiệp
    verification_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = {
  StudentProfile: mongoose.model('StudentProfile', studentProfileSchema),
  TutorProfile: mongoose.model('TutorProfile', tutorProfileSchema),
  TutorDocument: mongoose.model('TutorDocument', tutorDocumentSchema),
  Center: mongoose.model('Center', centerSchema),
};

