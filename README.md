# Musica - Audio Assets Marketplace

Musica là một nền tảng thương mại điện tử hiện đại dành cho việc mua bán tài sản âm thanh (tracks, samples, effects), được xây dựng trên kiến trúc Full-stack mạnh mẽ với NestJS, Vue 3 và Supabase.

## 🚀 Tính năng chính
- **Xác thực người dùng (Auth)**: Tích hợp Supabase Auth (Đăng ký, Đăng nhập, Đăng xuất).
- **Thư viện âm nhạc (Library)**: Hiển thị danh sách track với bộ lọc nâng cao (Genre, Mood, Energy, BPM).
- **Giỏ hàng (Cart)**: Đồng bộ hóa giỏ hàng thời gian thực với Database.
- **Thanh toán đa bước (Multi-step Checkout)**: Quy trình thanh toán chuyên nghiệp với giả lập cổng thanh toán.
- **Lịch sử mua hàng (Order History)**: Theo dõi các đơn hàng đã mua và trạng thái bản quyền.
- **Quản trị viên (Admin Panel)**: Form thêm track chuyên nghiệp với 6 phân vùng dữ liệu kỹ thuật.
- **API Documentation**: Tích hợp Swagger để kiểm thử và tra cứu API.

## 🛠 Tech Stack
- **Backend**: NestJS (Node.js framework), Swagger, ConfigService.
- **Frontend**: Vue 3 (Composition API), Vite, Pinia, Vue Router, PrimeVue (UI Components), Tailwind CSS.
- **Database & Auth**: Supabase (PostgreSQL, Real-time).

## 🌐 Đường dẫn quan trọng
- **Backend API (Render)**: [https://musica-test-kwy3.onrender.com](https://musica-test-kwy3.onrender.com)
- **API Documentation (Swagger)**: [https://musica-test-kwy3.onrender.com/api/docs](https://musica-test-kwy3.onrender.com/api/docs)
- **Frontend (Netlify)**: *[Vui lòng cập nhật link Netlify của bạn tại đây]*

## 🛠 Hướng dẫn cài đặt

### 1. Cấu hình Database (Supabase)
Trước khi chạy dự án, bạn cần thực thi file schema trong SQL Editor của Supabase:
- Mở file `backend/database/schema.sql`.
- Copy và chạy lệnh trong Supabase dashboard để tạo các bảng `tracks`, `profiles`, `carts`, `orders`,...

### 2. Backend Setup
```bash
cd backend
npm install
# Tạo file .env và điền SUPABASE_URL, SUPABASE_KEY
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Tạo file .env và điền VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
npm run dev
```

## 📂 Cấu trúc thư mục nổi bật
- `backend/src/auth`: Bảo mật API bằng Supabase JWT Guard.
- `backend/src/cart`: Logic xử lý giỏ hàng lưu trữ database.
- `backend/src/orders`: Xử lý checkout và lịch sử giao dịch.
- `frontend/src/stores`: Quản lý trạng thái Auth và Cart toàn cục.
- `frontend/src/views`: Các giao diện người dùng cao cấp (Premium UI).

---
*Dự án được phát triển bởi Antigravity AI Assistant.*
