# GIA SƯ VIỆT – KẾT NỐI GIA SƯ, NÂNG TẦM TRI THỨC
> Nền tảng kết nối trực tiếp giữa gia sư, giáo viên, học viên & trung tâm đào tạo trên toàn quốc.

---

## 📖 1. Giới thiệu tổng quan

**Gia Sư Việt** là giải pháp công nghệ giáo dục hiện đại, kết nối trực tiếp học viên/phụ huynh với đội ngũ gia sư và giáo viên có chuyên môn cao:
* **Học viên & Phụ huynh:** Tìm kiếm gia sư theo môn học, cấp lớp, địa điểm hoặc học online; xem hồ sơ minh bạch; học thử miễn phí.
* **Gia sư & Giáo viên:** Sinh viên giỏi, cử nhân, giáo viên nhận lớp dạy kèm đúng năng lực, chủ động thời gian và mức học phí mong muốn.
* **Trung tâm đào tạo:** Đăng tin tuyển dụng giáo viên, quản lý hồ sơ ứng viên nhanh chóng và minh bạch.
* **Bảo mật & Kiểm duyệt:** Toàn bộ thông tin cá nhân (SĐT, email, địa chỉ) được che mờ công khai cho đến khi đôi bên đồng ý nhận lớp; số CCCD và địa chỉ chi tiết được mã hóa bằng thuật toán AES-256.

---

## 🛠️ 2. Công nghệ sử dụng

| Tầng | Công nghệ / Thư viện chính |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router v6, TailwindCSS 3, Axios, Lucide React |
| **Backend** | Node.js (v20+), Express 4.21, Mongoose 8 (MongoDB), JWT, Bcrypt, Joi, Helmet, CORS, Cookie-parser, Rate Limit, Nodemailer |
| **Bảo mật** | Mã hóa AES-256-CBC, HttpOnly Cookie (SameSite=Strict), Interceptor tự động Refresh Token, Rate Limiting chống brute-force |
| **Cơ sở dữ liệu** | MongoDB (hỗ trợ Local và MongoDB Atlas) |

---

## 🚀 3. Hướng dẫn cài đặt và khởi chạy

### 3.1. Yêu cầu môi trường
* **Node.js:** phiên bản 18 trở lên (khuyên dùng Node 20 LTS).
* **MongoDB:** phiên bản 6 trở lên đang chạy cục bộ hoặc chuỗi kết nối MongoDB Atlas.

### 3.2. Cài đặt thư viện
Từ thư mục gốc dự án:
```bash
# Cài đặt cho Backend
cd backend && npm install

# Cài đặt cho Frontend
cd ../frontend && npm install
```

### 3.3. Cấu hình biến môi trường (`.env`)
1. **Backend (`backend/.env`):** Sao chép từ `backend/.env.example`:
   ```env
   PORT=5000
   NODE_ENV=development
   APP_NAME="Gia Sư Việt"
   CLIENT_URL=http://localhost:5173
   DB_URI=mongodb://127.0.0.1:27017/ket_noi_hv_gv
   JWT_SECRET=jwt_access_secret_key_sprint_1_dev_2026_very_secret_key
   JWT_REFRESH_SECRET=jwt_refresh_secret_key_sprint_1_dev_2026_very_secret_key
   ENCRYPTION_KEY=12345678901234567890123456789012
   ```
2. **Frontend (`frontend/.env`):** Sao chép từ `frontend/.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

### 3.4. Khởi chạy ứng dụng
Từ thư mục gốc dự án:
```bash
# 1. Khởi động Backend (cổng 5000)
npm run dev:backend

# 2. Khởi động Frontend (cổng 5173)
npm run dev:frontend

# 3. Chạy kiểm thử tự động toàn bộ API
npm run test:backend
```

* **Trang web người dùng:** [http://localhost:5173](http://localhost:5173)
* **API Backend:** [http://localhost:5000](http://localhost:5000)
* **Kiểm tra trạng thái máy chủ:** [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 📂 4. Cấu trúc thư mục

```
ket_noi_hv_gv/
├── backend/                    # Máy chủ API Node.js & Express
│   ├── src/
│   │   ├── controllers/        # Bộ điều khiển xử lý logic nghiệp vụ
│   │   ├── middlewares/        # Middlewares xác thực, RBAC, validate, rate-limit, error
│   │   ├── models/             # 16 Mô hình dữ liệu Mongoose (users, profiles, matches...)
│   │   ├── routes/             # Tuyến đường định tuyến API /api/v1/...
│   │   └── utils/              # Tiện ích mã hóa AES-256, chuẩn hóa API response, gửi OTP
│   ├── server.js               # Điểm khởi động máy chủ
│   └── test-sprint1.js         # Kịch bản kiểm thử tự động
├── frontend/                   # Ứng dụng giao diện React + Vite
│   ├── public/                 # Favicon và tài nguyên tĩnh
│   └── src/
│       ├── assets/             # Logo huy hiệu chính thức Gia Sư Việt
│       ├── components/         # Bố cục MainLayout, Navbar, Footer
│       ├── contexts/           # AuthContext quản lý phiên làm việc an toàn
│       ├── pages/              # Trang chủ, Đăng nhập, Đăng ký, OTP, Bảng điều khiển
│       ├── routes/             # AppRoutes, ProtectedRoute, RoleRoute
│       └── services/           # axiosClient (tự refresh token), auth.service
├── SPRINT_1.md                 # Báo cáo tổng hợp nghiệm thu chi tiết Sprint 1
└── README.md                   # Tài liệu hướng dẫn này
```

---

## 📅 5. Lộ trình phát triển dự án (Agile Scrum)

* [x] **Sprint 1 (Tuần 1-2):** Chuẩn bị, Thiết kế ERD (16 Models), API Contract RESTful `/api/v1`, Khởi tạo Express, Kết nối DB, React + Vite + Tailwind, axiosClient có cơ chế Refresh Token, Nhận diện thương hiệu Gia Sư Việt. *(Đã hoàn thành 100%)*
* [x] **Sprint 2 (Tuần 1-2):** Hoàn thiện Core Auth (US01, US02): Đăng ký 3 vai trò, Xác thực OTP email, Đăng nhập JWT + Cookie HttpOnly, Quên mật khẩu, Bảng điều khiển người dùng. *(Đã hoàn thành)*
* [ ] **Sprint 3 (Tuần 3):** Hồ sơ & Kiểm duyệt (US03, US04): Form hồ sơ HV/GS/TT, tải giấy tờ CCCD/bằng cấp qua Multer vào kho riêng tư, trang Admin duyệt hồ sơ và cấp huy hiệu xác thực.
* [ ] **Sprint 4 (Tuần 4):** Đăng tin & Tìm kiếm (US05, US06, US09, US10): Đăng yêu cầu tìm gia sư, bộ lọc tìm kiếm theo môn/giá/khu vực, duyệt tin đăng.
* [ ] **Sprint 5 (Tuần 5):** Kết nối lớp học (US07, US08, US12): Ứng tuyển, chấp nhận ứng viên, mở thông tin liên hệ, thuật toán gợi ý gia sư phù hợp.
* [ ] **Sprint 6 (Tuần 6):** Tương tác Realtime (US11, US13, US14, US15): Nhắn tin trực tiếp qua Socket.IO, chuông thông báo, chấm điểm đánh giá sau buổi học.
* [ ] **Sprint 7 (Tuần 7):** Quản trị & Hoàn thiện (US16, US17, US18): Thống kê doanh thu, quản lý danh mục môn, kiểm thử an toàn thông tin OWASP, đóng gói triển khai (Deploy).

---

## 📄 6. Tài liệu nghiệm thu chi tiết
Xem chi tiết đầy đủ về sơ đồ quan hệ thực thể (Mermaid ERD), bảng mã danh mục API và kiến trúc bảo mật tại file [`SPRINT_1.md`](SPRINT_1.md).
