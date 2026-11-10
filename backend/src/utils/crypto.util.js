/**
 * tiện ích mã hóa bảo mật aes-256 và che mờ thông tin nhạy cảm
 * phục vụ yêu cầu bảo mật tầng 5 và mục 8.2 trong tài liệu đặc tả:
 * - cccd (id_card_no) và địa chỉ chi tiết (address_detail) được mã hóa trong csdl
 * - che sđt, email, cccd khi trả về cho khách vãng lai hoặc khi chưa kết nối lớp học
 */

const crypto = require('crypto');

// thuật toán mã hóa đối xứng chuẩn quân đội aes-256-cbc
const ALGORITHM = 'aes-256-cbc';
// khóa bí mật phải đủ 32 bytes, nếu chưa cấu hình trong .env sẽ dùng khóa mặc định cho môi trường dev
const SECRET_KEY = Buffer.from(
  (process.env.ENCRYPTION_KEY || '12345678901234567890123456789012').padEnd(32, '0').slice(0, 32)
);
const IV_LENGTH = 16; // độ dài vector khởi tạo iv (16 bytes)

/**
 * mã hóa chuỗi văn bản bằng thuật toán aes-256-cbc
 * @param {string} text - chuỗi cần mã hóa (ví dụ: số cccd, địa chỉ nhà)
 * @returns {string} chuỗi đã mã hóa định dạng hex kèm iv
 */
const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(String(text), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // lưu trữ kết hợp iv và chuỗi mã hóa để khi giải mã dùng lại iv
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('lỗi khi mã hóa dữ liệu:', error.message);
    return text;
  }
};

/**
 * giải mã chuỗi văn bản đã được mã hóa bằng aes-256-cbc
 * @param {string} encryptedText - chuỗi đã mã hóa dạng iv:encrypted
 * @returns {string} chuỗi gốc ban đầu
 */
const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  try {
    const [ivHex, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('lỗi khi giải mã dữ liệu:', error.message);
    return encryptedText;
  }
};

/**
 * che mờ số điện thoại để bảo vệ quyền riêng tư (ví dụ: 0912345689 -> 09******89)
 * @param {string} phone - số điện thoại ban đầu
 * @returns {string} số điện thoại đã được che
 */
const maskPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  if (phone.length <= 4) return '***';
  const start = phone.slice(0, 2);
  const end = phone.slice(-2);
  return `${start}******${end}`;
};

/**
 * che mờ địa chỉ email để chống spam và lộ thông tin (ví dụ: nguyenvan@gmail.com -> ng***@gmail.com)
 * @param {string} email - email ban đầu
 * @returns {string} email đã được che
 */
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return `${username}***@${domain}`;
  }
  const prefix = username.slice(0, 2);
  return `${prefix}***@${domain}`;
};

/**
 * che mờ số cccd chỉ hiển thị 4 số cuối (ví dụ: 012345678901 -> ******8901)
 * @param {string} idCard - số cccd ban đầu
 * @returns {string} số cccd đã được che
 */
const maskIdCard = (idCard) => {
  if (!idCard || typeof idCard !== 'string') return '';
  const lastFour = idCard.slice(-4);
  return `******${lastFour}`;
};

module.exports = {
  encrypt,
  decrypt,
  maskPhone,
  maskEmail,
  maskIdCard,
};

