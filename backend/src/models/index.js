/**
 * điểm tập trung xuất các mô hình dữ liệu (models) cho toàn bộ ứng dụng
 * giúp việc import ở các controller và middleware trở nên ngắn gọn, dễ bảo trì
 */

const User = require('./user.model');
const { StudentProfile, TutorProfile, TutorDocument, Center } = require('./profile.model');
const { Subject, TutorSubject, TutorAvailability } = require('./subject.model');
const { ClassRequest, CenterJob } = require('./request.model');
const { Application, Match } = require('./match.model');
const { Review, Conversation, Message, Notification, Report, Favorite } = require('./interaction.model');
const { OtpCode, RefreshToken, AuditLog } = require('./security.model');

module.exports = {
  User,
  StudentProfile,
  TutorProfile,
  TutorDocument,
  Center,
  Subject,
  TutorSubject,
  TutorAvailability,
  ClassRequest,
  CenterJob,
  Application,
  Match,
  Review,
  Conversation,
  Message,
  Notification,
  Report,
  Favorite,
  OtpCode,
  RefreshToken,
  AuditLog,
};

