# Hướng dẫn Debug Firebase Multiplayer

## Kiểm tra Firebase có hoạt động không

### 1. Kiểm tra Console Logs

Mở Browser Console (F12) và kiểm tra:

**Nếu thấy:**
```
⚠️ Firebase chưa cấu hình, sử dụng localStorage (chỉ hoạt động trên cùng máy)
```
→ Firebase chưa được cấu hình, đang dùng localStorage

**Nếu KHÔNG thấy message trên:**
→ Firebase đã được cấu hình và đang hoạt động

### 2. Kiểm tra file .env

Đảm bảo file `.env` tồn tại ở thư mục gốc và có đầy đủ các biến:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Restart Dev Server

Sau khi thêm/sửa `.env`, **BẮT BUỘC** phải restart:

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại
npm run dev
```

### 4. Test với 2 Tab (Localhost)

**Với localStorage (chưa có Firebase):**
- ✅ Hoạt động trên cùng máy, cùng trình duyệt
- ✅ Mở 2 tab cùng `localhost:5173`
- ✅ Tab 1 tạo phòng, Tab 2 join
- ✅ Cả 2 tab sẽ sync qua localStorage polling (mỗi giây)

**Với Firebase:**
- ✅ Hoạt động qua internet
- ✅ Có thể test trên cùng máy với 2 tab
- ✅ Realtime sync ngay lập tức

### 5. Debug Steps

1. **Mở Console ở cả 2 tab**
2. **Tab 1:** Tạo phòng → Xem logs
3. **Tab 2:** Join phòng → Xem logs
4. **Kiểm tra:**
   - Tab 1 có thấy Tab 2 join không?
   - Tab 2 có thấy Tab 1 không?
   - Số lượng players có đúng không?

### 6. Common Issues

**Vấn đề: "2 người đã join nhưng không bắt đầu được"**

**Nguyên nhân có thể:**
1. **localStorage:** Tab 2 join nhưng Tab 1 không thấy (polling chưa chạy)
   - **Giải pháp:** Đợi 1-2 giây để polling sync, hoặc refresh Tab 1

2. **Firebase chưa cấu hình:** Đang dùng localStorage nhưng không sync được
   - **Giải pháp:** Cấu hình Firebase hoặc test trên cùng tab

3. **Button disabled:** `players.length < 2` 
   - **Kiểm tra:** Xem số lượng players hiển thị có đúng không
   - **Debug:** Mở console, gõ `localStorage.getItem('room_XXXXXX')` để xem data

4. **Firebase Rules:** Permission denied
   - **Giải pháp:** Kiểm tra Firebase Console → Realtime Database → Rules

### 7. Quick Test Commands

Trong Browser Console:

```javascript
// Kiểm tra Firebase có được import không
import { database } from './src/config/firebase'
console.log('Database:', database)

// Kiểm tra localStorage
Object.keys(localStorage).filter(k => k.startsWith('room_'))

// Xem room data
JSON.parse(localStorage.getItem('room_XXXXXX'))
```

### 8. Firebase Console Check

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **Realtime Database** → **Data**
4. Kiểm tra có node `rooms` không
5. Xem có room code nào đang active không

## Giải pháp nhanh

**Nếu đang test trên localhost và muốn multiplayer ngay:**

1. **Option 1:** Dùng localStorage (đã có sẵn)
   - Mở 2 tab cùng trình duyệt
   - Đợi polling sync (1-2 giây)
   - Nếu không sync, refresh tab

2. **Option 2:** Cấu hình Firebase (khuyến nghị)
   - Làm theo `FIREBASE_SETUP.md`
   - Realtime sync ngay lập tức
   - Hoạt động qua internet
