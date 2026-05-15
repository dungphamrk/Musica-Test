# Supabase + NestJS + Vue 3 Project

Dự án này đã được cấu hình sẵn các thư viện yêu cầu và cấu trúc code chuẩn.

## Cấu trúc
- `/backend`: NestJS API.
    - `SupabaseService`: Kết nối DB.
    - `SupabaseGuard`: Bảo vệ API bằng JWT.
    - `ItemsService`: Ví dụ CRUD.
- `/frontend`: Vue 3 (Vite).
    - `LoginView`: Trang đăng nhập thẩm mỹ.
    - `HomeView`: Dashboard demo.
    - `authStore`: Quản lý trạng thái bằng Pinia.
    - `api`: Axios instance có sẵn interceptor cho Token.

## Cách chạy
### 1. Cài đặt Node.js
Đảm bảo bạn đã cài đặt Node.js trên máy.

### 2. Cài đặt Backend
```bash
cd backend
npm install
cp .env.example .env
# Cập nhật thông tin Supabase trong .env
npm run start:dev
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
npm run dev
```

## Thư viện đã tích hợp
- **Backend**: `@supabase/supabase-js`, `@nestjs/config`, `class-validator`, `class-transformer`.
- **Frontend**: `pinia`, `vue-router`, `vueuse`, `axios`, `tailwindcss`, `primevue`.
