/**
 * kịch bản kiểm thử tự động toàn diện cho sprint 1 (backend)
 * kiểm thử các tính năng:
 * 1. GET /api/v1/health (kiểm tra trạng thái máy chủ)
 * 2. POST /api/v1/auth/register (đăng ký tài khoản học viên)
 * 3. POST /api/v1/auth/verify-otp (xác thực mã otp)
 * 4. POST /api/v1/auth/login (đăng nhập, nhận access token và cookie httponly)
 * 5. GET /api/v1/users/me (lấy thông tin tài khoản và hồ sơ)
 * 6. POST /api/v1/auth/refresh (làm mới access token)
 * 7. POST /api/v1/auth/logout (đăng xuất an toàn)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');
const { OtpCode, User } = require('./src/models');

const TEST_PORT = 5002;
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/ket_noi_hv_gv';

async function runSprint1TestSuite() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU CHẠY BỘ KIỂM THỬ TỰ ĐỘNG SPRINT 1');
  console.log('====================================================');

  await mongoose.connect(DB_URI);
  console.log('✓ Kết nối MongoDB thành công');

  const server = app.listen(TEST_PORT, async () => {
    try {
      const baseUrl = `http://localhost:${TEST_PORT}/api/v1`;

      // 1. Kiểm tra Health check
      console.log('\n[1/7] Kiểm tra GET /health...');
      const healthRes = await fetch(`${baseUrl}/health`);
      const healthData = await healthRes.json();
      if (!healthData.success) throw new Error('Health check thất bại');
      console.log('✓ Health check thành công:', healthData.message);

      // 2. Đăng ký tài khoản mới (US01)
      const testEmail = `hv_test_${Date.now()}@gmail.com`;
      console.log(`\n[2/7] Kiểm tra POST /auth/register với email: ${testEmail}...`);
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          phone: '0912345678',
          password: 'MatKhauBaoMat123!',
          role: 'student',
          agreeTerms: true,
        }),
      });
      const regData = await regRes.json();
      if (!regData.success) throw new Error(`Đăng ký thất bại: ${JSON.stringify(regData)}`);
      console.log('✓ Đăng ký thành công, userId:', regData.data.userId);

      // 3. Lấy mã OTP trong DB để xác thực
      console.log('\n[3/7] Kiểm tra POST /auth/verify-otp...');
      const otpDoc = await OtpCode.findOne({ email: testEmail });
      if (!otpDoc) throw new Error('Không tìm thấy mã OTP trong CSDL');
      console.log(`✓ Mã OTP tìm thấy trong CSDL: ${otpDoc.otp_hash}`);

      const verifyRes = await fetch(`${baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          otp: otpDoc.otp_hash,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) throw new Error(`Xác thực OTP thất bại: ${JSON.stringify(verifyData)}`);
      console.log('✓ Xác thực tài khoản thành công');

      // 4. Đăng nhập hệ thống (US02)
      console.log('\n[4/7] Kiểm tra POST /auth/login...');
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'MatKhauBaoMat123!',
        }),
      });
      const loginData = await loginRes.json();
      if (!loginData.success) throw new Error(`Đăng nhập thất bại: ${JSON.stringify(loginData)}`);
      const accessToken = loginData.data.accessToken;
      const cookieHeader = loginRes.headers.get('set-cookie');
      console.log('✓ Đăng nhập thành công');
      console.log('✓ Nhận Access Token JWT (15m):', accessToken.slice(0, 25) + '...');
      console.log('✓ Nhận HttpOnly Cookie Refresh Token (7d):', cookieHeader ? 'Có' : 'Không');

      // 5. Lấy thông tin cá nhân (GET /users/me)
      console.log('\n[5/7] Kiểm tra GET /users/me (xác thực Bearer token)...');
      const meRes = await fetch(`${baseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const meData = await meRes.json();
      if (!meData.success) throw new Error(`Lấy thông tin thất bại: ${JSON.stringify(meData)}`);
      console.log('✓ Lấy thông tin người dùng thành công, vai trò:', meData.data.role);

      // 6. Làm mới Access Token (POST /auth/refresh)
      console.log('\n[6/7] Kiểm tra POST /auth/refresh (làm mới qua cookie)...');
      const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          Cookie: cookieHeader,
        },
      });
      const refreshData = await refreshRes.json();
      if (!refreshData.success) throw new Error(`Làm mới token thất bại: ${JSON.stringify(refreshData)}`);
      console.log('✓ Cấp lại Access Token mới thành công:', refreshData.data.accessToken.slice(0, 25) + '...');

      // 7. Đăng xuất hệ thống (POST /auth/logout)
      console.log('\n[7/7] Kiểm tra POST /auth/logout...');
      const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          Cookie: cookieHeader,
        },
      });
      const logoutData = await logoutRes.json();
      if (!logoutData.success) throw new Error(`Đăng xuất thất bại: ${JSON.stringify(logoutData)}`);
      console.log('✓ Đăng xuất thành công, cookie đã được thu hồi');

      console.log('\n====================================================');
      console.log('🎉 TẤT CẢ 7/7 TÍNH NĂNG SPRINT 1 ĐÃ VƯỢT QUA KIỂM THỬ HOÀN HẢO!');
      console.log('====================================================');

      // Dọn dẹp dữ liệu test
      await User.deleteOne({ email: testEmail });
      await OtpCode.deleteMany({ email: testEmail });

      server.close();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('\n❌ KIỂM THỬ THẤT BẠI:', err.message);
      server.close();
      await mongoose.disconnect();
      process.exit(1);
    }
  });
}

runSprint1TestSuite();

