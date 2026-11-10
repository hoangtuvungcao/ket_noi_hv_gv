/**
 * tiện ích gửi email và mã xác thực otp
 * sử dụng thư viện nodemailer hỗ trợ gửi email qua smtp (gmail, sendgrid, aws ses)
 * nếu đang ở môi trường phát triển (development) hoặc chưa cấu hình smtp trong .env,
 * hệ thống sẽ tự động in mã otp ra terminal để lập trình viên kiểm thử thuận tiện
 */

const nodemailer = require('nodemailer');

// tạo transporter gửi mail từ biến môi trường
let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true cho port 465, false cho 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * gửi email chứa mã otp cho người dùng
 * @param {string} toEmail - địa chỉ email người nhận
 * @param {string} otp - mã otp gồm 6 chữ số
 * @param {string} type - mục đích gửi mã ('verify_email' hoặc 'reset_password')
 * @returns {Promise<boolean>}
 */
const sendOtpEmail = async (toEmail, otp, type = 'verify_email') => {
  const isVerify = type === 'verify_email';
  const subject = isVerify
    ? '[KẾT NỐI GIA SƯ & HỌC VIÊN] Mã xác thực tài khoản của bạn'
    : '[KẾT NỐI GIA SƯ & HỌC VIÊN] Mã xác nhận đặt lại mật khẩu';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; text-align: center;">KẾT NỐI GIA SƯ & HỌC VIÊN</h2>
      <p>Xin chào bạn,</p>
      <p>${isVerify ? 'Cảm ơn bạn đã đăng ký tài khoản. Dưới đây là mã OTP để xác thực email của bạn:' : 'Bạn vừa gửi yêu cầu đặt lại mật khẩu. Dưới đây là mã OTP của bạn:'}</p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e40af; background: #eff6ff; padding: 12px 24px; border-radius: 6px; border: 1px dashed #3b82f6;">
          ${otp}
        </span>
      </div>
      <p style="color: #64748b; font-size: 14px;">Mã này có hiệu lực trong vòng <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này cho bất kỳ ai khác để đảm bảo an toàn tài khoản.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
    </div>
  `;

  // in log ra màn hình console để tiện theo dõi khi phát triển
  console.log(`\n================== [MÃ OTP TỰ ĐỘNG SINH] ==================`);
  console.log(`Gửi tới: ${toEmail}`);
  console.log(`Mục đích: ${type}`);
  console.log(`MÃ OTP: >>> ${otp} <<< (hiệu lực 5 phút)`);
  console.log(`============================================================\n`);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${process.env.APP_NAME || 'Kết Nối Gia Sư & Học Viên'}" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      return true;
    } catch (error) {
      console.error('lỗi khi gửi email qua smtp:', error.message);
      // vẫn trả về true trong môi trường thử nghiệm để không làm gián đoạn luồng kiểm thử
      return false;
    }
  }

  return true;
};

module.exports = {
  sendOtpEmail,
};

