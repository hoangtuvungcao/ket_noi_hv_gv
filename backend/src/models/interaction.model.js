/**
 * mô hình dữ liệu tương tác người dùng: đánh giá, tin nhắn, thông báo, tố cáo, yêu thích
 * tuân thủ mục 7 và nhóm chức năng 5 trong tài liệu đặc tả
 */

const mongoose = require('mongoose');

// ==========================================
// 1. ĐÁNH GIÁ VÀ NHẬN XÉT (reviews)
// ==========================================
const reviewSchema = new mongoose.Schema(
  {
    // lớp học được đánh giá
    match_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
      index: true,
    },
    // người để lại đánh giá (học viên hoặc trung tâm)
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // người nhận đánh giá (thường là gia sư)
    reviewee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // số sao đánh giá (từ 1 đến 5 sao)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // nhận xét chi tiết
    comment: {
      type: String,
      default: '',
      trim: true,
    },
    // trạng thái hiển thị
    status: {
      type: String,
      enum: ['visible', 'hidden'],
      default: 'visible',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// mỗi người chỉ đánh giá 1 lần cho mỗi lớp học
reviewSchema.index({ match_id: 1, reviewer_id: 1 }, { unique: true });

// ==========================================
// 2. CUỘC TRÒ CHUYỆN (conversations)
// ==========================================
const conversationSchema = new mongoose.Schema(
  {
    // lớp học phát sinh cuộc trò chuyện
    match_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
    // danh sách người tham gia (thường là 2 người: học viên và gia sư)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    // tin nhắn cuối cùng để hiển thị ở danh sách hội thoại
    last_message: {
      type: String,
      default: '',
    },
    // thời gian gửi tin nhắn cuối cùng
    last_message_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 3. TIN NHẮN (messages)
// ==========================================
const messageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // nội dung tin nhắn dạng văn bản (đã lọc xss)
    content: {
      type: String,
      required: true,
    },
    // danh sách file hoặc hình ảnh đính kèm
    attachments: [
      {
        type: String,
      },
    ],
    // cờ đánh dấu đã đọc
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 4. THÔNG BÁO HỆ THỐNG (notifications)
// ==========================================
const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // loại thông báo: duyêt hồ sơ, có đơn ứng tuyển mới, lớp học được chấp nhận...
    type: {
      type: String,
      required: true,
    },
    // nội dung thông báo hiển thị cho người dùng
    content: {
      type: String,
      required: true,
    },
    // đường dẫn liên kết đến trang tương ứng trên frontend
    link: {
      type: String,
      default: '',
    },
    // trạng thái đã đọc hay chưa
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 5. BÁO CÁO VI PHẠM / TỐ CÁO (reports)
// ==========================================
const reportSchema = new mongoose.Schema(
  {
    reporter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    target_type: {
      type: String,
      enum: ['user', 'class_request', 'center_job', 'review'],
      required: true,
    },
    target_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // lý do tố cáo
    reason: {
      type: String,
      required: true,
    },
    // bằng chứng hình ảnh hoặc văn bản
    evidence: {
      type: String,
      default: '',
    },
    // trạng thái xử lý của ban quản trị
    status: {
      type: String,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending',
    },
    // admin thụ lý tố cáo
    handled_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ==========================================
// 6. DANH SÁCH YÊU THÍCH / LƯU TRỮ (favorites)
// ==========================================
const favoriteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    target_type: {
      type: String,
      enum: ['tutor', 'class_request', 'center_job'],
      required: true,
    },
    target_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// chống trùng lặp khi người dùng bấm yêu thích nhiều lần
favoriteSchema.index({ user_id: 1, target_type: 1, target_id: 1 }, { unique: true });

module.exports = {
  Review: mongoose.model('Review', reviewSchema),
  Conversation: mongoose.model('Conversation', conversationSchema),
  Message: mongoose.model('Message', messageSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Report: mongoose.model('Report', reportSchema),
  Favorite: mongoose.model('Favorite', favoriteSchema),
};

