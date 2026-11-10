/**
 * tệp khởi tạo tài khoản mẫu (seed demo users) để tiện cho việc kiểm thử
 * tạo sẵn 4 tài khoản với 4 vai trò khác nhau:
 * 1. học viên:  hocvien@test.com  / Password123!
 * 2. gia sư:    giasu@test.com    / Password123!
 * 3. trung tâm: trungtam@test.com / Password123!
 * 4. quản trị:  admin@test.com    / Password123!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const {
  User,
  StudentProfile,
  TutorProfile,
  Center,
} = require('./src/models');
const { encrypt } = require('./src/utils/crypto.util');

const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/ket_noi_hv_gv';

async function seed() {
  console.log('🔄 đang kết nối tới cơ sở dữ liệu mongodb...');
  await mongoose.connect(DB_URI);

  const demoAccounts = [
    {
      email: 'hocvien@test.com',
      password_hash: 'Password123!',
      phone: '0901234567',
      role: 'student',
      status: 'active',
      email_verified: true,
      profileName: 'Nguyễn Văn Học',
    },
    {
      email: 'giasu@test.com',
      password_hash: 'Password123!',
      phone: '0902345678',
      role: 'tutor',
      status: 'active',
      email_verified: true,
      profileName: 'Trần Thị Sư Phạm',
    },
    {
      email: 'trungtam@test.com',
      password_hash: 'Password123!',
      phone: '0903456789',
      role: 'center',
      status: 'active',
      email_verified: true,
      profileName: 'Trung Tâm Luyện Thi Tri Thức Mới',
    },
    {
      email: 'admin@test.com',
      password_hash: 'Password123!',
      phone: '0909999999',
      role: 'admin',
      status: 'active',
      email_verified: true,
      profileName: 'Quản Trị Viên Hệ Thống',
    },
  ];

  for (const acc of demoAccounts) {
    let user = await User.findOne({ email: acc.email });
    if (!user) {
      user = new User({
        email: acc.email,
        password_hash: acc.password_hash,
        phone: acc.phone,
        role: acc.role,
        status: acc.status,
        email_verified: acc.email_verified,
      });
      await user.save();
      console.log(`✓ đã tạo tài khoản mẫu: ${acc.email} (${acc.role})`);
    } else {
      user.password_hash = acc.password_hash;
      user.status = acc.status;
      user.email_verified = acc.email_verified;
      await user.save();
      console.log(`✓ đã cập nhật lại mật khẩu cho tài khoản: ${acc.email}`);
    }

    // tạo hoặc cập nhật hồ sơ tương ứng
    if (acc.role === 'student') {
      await StudentProfile.findOneAndUpdate(
        { user_id: user._id },
        {
          full_name: acc.profileName,
          grade_level: 'Lớp 12',
          province: 'Hà Nội',
          district: 'Cầu Giấy',
          address_detail: encrypt('Số 123 Đường Cầu Giấy'),
          learning_goal: 'Ôn thi vào Đại học Bách Khoa',
        },
        { upsert: true, new: true }
      );
    } else if (acc.role === 'tutor') {
      await TutorProfile.findOneAndUpdate(
        { user_id: user._id },
        {
          full_name: acc.profileName,
          university: 'Đại học Sư phạm Hà Nội',
          major: 'Toán học',
          degree: 'Cử nhân Sư phạm',
          experience_years: 3,
          bio: 'Kinh nghiệm 3 năm luyện thi THPT Quốc Gia môn Toán, tận tâm, dễ hiểu.',
          teaching_mode: 'both',
          id_card_no: encrypt('001201012345'),
          rate_min: 200000,
          rate_max: 350000,
          verification_status: 'approved',
          rating_avg: 4.9,
          rating_count: 15,
        },
        { upsert: true, new: true }
      );
    } else if (acc.role === 'center') {
      await Center.findOneAndUpdate(
        { user_id: user._id },
        {
          name: acc.profileName,
          phone: acc.phone,
          address: '456 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
          business_license_no: '0101234567',
          description: 'Hệ thống gia sư và ôn luyện thi uy tín hàng đầu miền Bắc.',
          verification_status: 'approved',
        },
        { upsert: true, new: true }
      );
    }
  }

  console.log('\n🎉 ĐÃ KHỞI TẠO XONG 4 TÀI KHOẢN MẪU THÀNH CÔNG!');
  await mongoose.disconnect();
}

seed().catch(console.error);
