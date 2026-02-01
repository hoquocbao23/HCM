# Hướng dẫn thiết lập Firebase cho Multiplayer Quiz

## Tại sao cần Firebase?

Hiện tại, Multiplayer Quiz đang sử dụng localStorage để lưu trữ dữ liệu phòng chơi. Điều này có nghĩa là:
- ✅ Hoạt động ngay không cần cấu hình
- ❌ Chỉ hoạt động trên cùng một trình duyệt/máy tính
- ❌ Không thể chơi với người khác qua mạng

Để có multiplayer thực sự (nhiều người chơi cùng lúc qua internet), bạn cần Firebase Realtime Database.

## Các bước thiết lập

### 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Nhập tên project và làm theo hướng dẫn

### 2. Tạo Realtime Database

1. Trong Firebase Console, chọn "Realtime Database"
2. Click "Create Database"
3. Chọn location (ví dụ: asia-southeast1)
4. Chọn chế độ: **Test mode** (cho development) hoặc **Production mode** (cho production)

### 3. Lấy Firebase Config

1. Vào Project Settings (biểu tượng bánh răng)
2. Scroll xuống phần "Your apps"
3. Click "Web" (biểu tượng `</>`)
4. Đăng ký app và copy config

### 4. Cập nhật config trong code

Mở file `src/config/firebase.js` và thay thế:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

Bằng config thật từ Firebase Console.

### 5. Cập nhật MultiplayerQuiz component

Bạn cần cập nhật `src/components/MultiplayerQuiz.jsx` để sử dụng Firebase Realtime Database thay vì localStorage. Ví dụ:

```javascript
import { ref, set, onValue, push } from 'firebase/database'
import { database } from '../config/firebase'

// Thay vì localStorage.setItem
const roomRef = ref(database, `rooms/${roomCode}`)
set(roomRef, {
  code: roomCode,
  host: playerName,
  players: [...],
  gameState: 'lobby'
})

// Lắng nghe thay đổi
onValue(roomRef, (snapshot) => {
  const data = snapshot.val()
  // Cập nhật state
})
```

## Lưu ý bảo mật

1. **Rules cho Realtime Database**: Cập nhật rules trong Firebase Console để bảo mật:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      ".write": true,
      "$roomId": {
        ".validate": "newData.hasChildren(['code', 'host', 'players'])"
      }
    }
  }
}
```

2. **Authentication** (tùy chọn): Có thể thêm Firebase Authentication để xác thực người chơi.

## Giải pháp thay thế không cần Firebase

Nếu không muốn dùng Firebase, bạn có thể:
- Sử dụng WebSocket server (Node.js + Socket.io)
- Sử dụng Supabase (tương tự Firebase nhưng open-source)
- Sử dụng các service khác như Pusher, Ably

Hiện tại, ứng dụng hoạt động tốt với localStorage cho single-player và demo multiplayer trên cùng máy.
