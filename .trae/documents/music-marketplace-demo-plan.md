# Plan Demo Music Marketplace

## Summary
- Mục tiêu: chuyển demo hiện tại từ `music library` thành demo giống sàn thương mại điện tử cho bài hát, với catalog rõ ràng, giá bán, trang chi tiết đầy đủ, cart + mock checkout, và admin mock để tạo track mới.
- Success criteria:
  - Trang chính hiển thị card sản phẩm âm nhạc theo kiểu catalog, chỉ show thông tin tóm tắt.
  - Click card vào trang chi tiết mới thấy đầy đủ metadata + preview 30s.
  - Có tối thiểu 20 mock tracks nằm trong 1 file riêng, đủ dữ liệu để bộ lọc hoạt động chính xác.
  - Có admin mock tạo track mới với đầy đủ trường quan trọng từ PRD + giá bán.
  - Có cart + mock checkout để cảm giác giống e-commerce.

## Current State Analysis
- Frontend hiện có `login`, `library`, `track detail`, `cart` qua [index.ts](file:///c:/Users/LHP02/Desktop/supabase-vue-nest-project/frontend/src/router/index.ts).
- `LibraryView.vue` đang hiển thị preview ngay ở trang list, dữ liệu card còn ít, filter options đang hard-code tĩnh và không bám data thật: [LibraryView.vue](file:///c:/Users/LHP02/Desktop/supabase-vue-nest-project/frontend/src/views/LibraryView.vue).
- `TrackDetailView.vue` đã có khung chi tiết nhưng field chưa đủ theo PRD và chưa có price/licensing e-commerce rõ ràng: [TrackDetailView.vue](file:///c:/Users/LHP02/Desktop/supabase-vue-nest-project/frontend/src/views/TrackDetailView.vue).
- `CartView.vue` mới chỉ là list saved items, chưa có subtotal / checkout flow: [CartView.vue](file:///c:/Users/LHP02/Desktop/supabase-vue-nest-project/frontend/src/views/CartView.vue).
- Backend hiện chỉ có `GET /tracks`, `GET /tracks/:id`, `GET /tracks/me`; mock data đang nằm inline trong [tracks.service.ts](file:///c:/Users/LHP02/Desktop/supabase-vue-nest-project/backend/src/tracks/tracks.service.ts).
- Backend chưa có admin CRUD/create track, chưa có file mock data riêng, chưa có route cho filter metadata/summary.
- Route backend có rủi ro: `GET /tracks/me` đang đặt sau `GET /tracks/:id` trong [tracks.controller.ts](file:///c:/Users/LHP02/Desktop/supabase-vue-nest-project/backend/src/tracks/tracks.controller.ts), dễ bị match sai.
- AppModule hiện chỉ mount `TracksController`: [app.module.ts](file:///c:/Users/LHP02/Desktop/supabase-vue-nest-project/backend/src/app.module.ts).

## Proposed Changes

### 1. Tách mock data và mở rộng schema demo
- Tạo file mới `backend/src/tracks/mock-tracks.ts`.
- Chứa khoảng 20 tracks với schema thống nhất, đủ cho:
  - catalog card: `id`, `title`, `artist_name`, `cover_image_url`, `price`, `currency`, `genre`, `mood`, `duration`, `bpm`, `use_case`, `preview_url`
  - detail page: `description`, `release_date`, `key`, `language`, `energy_level`, `vocal_type`, `theme`, rights flags, allowed platforms, file info, verification/certification summary, `preview_duration`
  - admin create: toàn bộ các field cần edit được gom về 1 typed model
- Preview chỉ dùng link 30s (`preview_duration = 30`), trang list không autoplay/không render audio player.

### 2. Chuẩn hóa backend thành catalog API + admin mock API
- Cập nhật `backend/src/tracks/tracks.service.ts`:
  - bỏ seed inline
  - import mock data từ `mock-tracks.ts`
  - tách 3 lớp dữ liệu:
    - list/card DTO
    - detail DTO
    - filter metadata DTO
  - hỗ trợ filter chính xác theo dữ liệu thật: `genre`, `mood`, `use_case`, `vocal_type`, `language`, `energy_level`, `price range`, `duration range`, `bpm range`
- Cập nhật `backend/src/tracks/tracks.controller.ts`:
  - sửa thứ tự route để `/tracks/me` đứng trước `/:id`
  - thêm `GET /tracks/filters` để frontend lấy dynamic filter options từ dataset
  - thêm `POST /tracks/admin` cho admin mock create track
  - thêm `POST /checkout/mock` hoặc route riêng để tạo mock order summary
- Nếu cần rõ separation, thêm:
  - `backend/src/tracks/tracks.types.ts` cho interfaces
  - `backend/src/checkout/checkout.controller.ts` + `checkout.service.ts` nếu muốn flow checkout sạch hơn
- Cập nhật `backend/src/app.module.ts` để mount controller/service mới nếu tách module checkout.

### 3. Nâng trang catalog thành marketplace homepage
- Refactor `frontend/src/views/LibraryView.vue`:
  - layout theo kiểu product marketplace
  - card chỉ hiển thị summary: cover, title, artist, price, genre, mood/use-case chính, duration, CTA `View Details` / `Add to Cart`
  - bỏ audio preview khỏi list page
  - filter sidebar lấy options từ `GET /tracks/filters`, không hard-code local arrays nữa
  - sort giữ `new`, `trending`, `most_downloaded`, thêm `price_low_to_high` nếu dataset dùng giá
  - thêm badge như `Verified`, `Commercial OK`, `YouTube Safe` nếu có

### 4. Mở rộng trang chi tiết track
- Refactor `frontend/src/views/TrackDetailView.vue`:
  - detail đầy đủ hơn theo PRD
  - show audio preview 30s ở đây, không ở trang list
  - show giá, loại license, platform permissions, certification/verification summary
  - CTA: `Add to Cart`, `Buy Now`
  - phần metadata chia section: basic info, creative metadata, rights, technical info

### 5. Nâng cart thành flow mua hàng mock
- Refactor `frontend/src/stores/cart.ts`:
  - item phải chứa thêm `price`, `currency`, `cover_image_url`, `license_type`
  - có `subtotal`, `itemCount`
- Refactor `frontend/src/views/CartView.vue`:
  - hiển thị price, subtotal
  - CTA `Proceed to Checkout`
- Tạo mới:
  - `frontend/src/views/CheckoutView.vue`
  - `frontend/src/views/CheckoutSuccessView.vue`
- Checkout là mock:
  - user điền thông tin cơ bản
  - submit tới mock endpoint/backend local
  - nhận order success, không tích hợp payment thật

### 6. Thêm admin mock cho create track
- Tạo route frontend mới:
  - `frontend/src/views/AdminTracksView.vue`
  - optional `frontend/src/views/AdminCreateTrackView.vue` nếu tách form riêng
- Admin mock dùng auth local role cứng, không làm auth thật với Supabase ở bước này.
- Cập nhật `frontend/src/stores/auth.ts`:
  - thêm `role: 'user' | 'admin'`
  - login demo cho phép vào user thường hoặc admin mock
- Cập nhật `frontend/src/router/index.ts`:
  - thêm protected admin routes
  - route guards cho `admin-only`
- Form admin tạo track cần bao phủ các nhóm field chính từ PRD:
  - basic info
  - technical info
  - creative metadata
  - ownership/rights
  - pricing/sale info
  - preview/file URLs
- POST admin sẽ append vào state mock runtime của backend; nếu không muốn persistence thật, chỉ cần giữ in-memory cho demo session hiện tại.

### 7. Cập nhật login demo tối thiểu để hỗ trợ role
- Refactor `frontend/src/views/LoginView.vue`:
  - thêm lựa chọn `Login as User` / `Login as Admin` hoặc tự suy ra từ email demo
- Không triển khai auth thật ở vòng này vì user chưa muốn Supabase auth thật; design chỉ cần không khóa đường nâng cấp sau này.

## Assumptions & Decisions
- Dùng `Admin mock`, không làm Supabase Auth/RLS thật ở vòng này.
- Dùng `Mock checkout`, không tích hợp cổng thanh toán.
- Mock data là nguồn dữ liệu chính cho demo, nằm 1 file riêng trong backend.
- Trang chính là catalog marketplace dạng grid, không mở preview player tại list page.
- Preview audio chỉ xuất hiện ở detail page và giới hạn 30s ở mức dữ liệu demo.
- Chưa làm persistence database thật cho admin create; mặc định là in-memory mock suitable cho demo.
- Ưu tiên cảm giác sản phẩm/dữ liệu đúng business hơn là full CRUD production-ready.

## Verification Steps
- Backend:
  - `GET /tracks` trả về >= 20 items, filter/sort/page đúng.
  - `GET /tracks/filters` trả về options khớp dataset.
  - `GET /tracks/:id` trả về full detail.
  - `POST /tracks/admin` tạo được track mới hợp lệ trong session hiện tại.
  - `POST /checkout/mock` trả về order summary thành công.
- Frontend:
  - homepage giống catalog e-commerce, không phát audio ở list.
  - detail page hiển thị đủ metadata + preview 30s + price + add to cart.
  - cart hiển thị subtotal và đi được tới checkout success.
  - admin login vào được trang admin và tạo được 1 track mới để nó xuất hiện trong catalog.
- Build:
  - `frontend`: `npm.cmd run build`
  - `backend`: `npm.cmd run build`
