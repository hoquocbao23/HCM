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

Tạo file `.env` ở thư mục gốc của project và thêm các biến môi trường:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Lưu ý:** 
- Thay thế các giá trị `your_*` bằng giá trị thật từ Firebase Console
- File `.env` đã được thêm vào `.gitignore` để không commit lên git
- Sau khi thêm `.env`, restart dev server (`npm run dev`)

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

### 6. Ví dụ code hoàn chỉnh cho MultiplayerQuiz

Dưới đây là ví dụ cách cập nhật các hàm chính trong `MultiplayerQuiz.jsx`:

#### Tạo phòng:

```javascript
import { ref, set, onValue, off, push, update } from 'firebase/database'
import { database } from '../config/firebase'

const createRoom = () => {
  if (!database) {
    // Fallback về localStorage nếu Firebase chưa được cấu hình
    const code = generateRoomCode()
    localStorage.setItem(`room_${code}`, JSON.stringify({...}))
    return
  }

  const code = generateRoomCode()
  const roomRef = ref(database, `rooms/${code}`)
  
  const roomData = {
    code: code,
    host: playerName,
    players: [{ name: playerName, id: 'self', score: 0 }],
    gameState: 'lobby',
    currentQuestion: 0,
    createdAt: Date.now()
  }
  
  set(roomRef, roomData)
    .then(() => {
      setRoomCode(code)
      setIsHost(true)
      setPlayers(roomData.players)
    })
    .catch((error) => {
      console.error('Error creating room:', error)
      alert('Không thể tạo phòng. Vui lòng thử lại!')
    })
}
```

#### Tham gia phòng:

```javascript
const joinRoom = () => {
  if (!roomCode.trim()) {
    alert('Vui lòng nhập mã phòng!')
    return
  }
  
  if (!database) {
    // Fallback về localStorage
    const roomData = localStorage.getItem(`room_${roomCode}`)
    // ... xử lý localStorage
    return
  }

  const roomRef = ref(database, `rooms/${roomCode}`)
  
  // Kiểm tra phòng có tồn tại không
  onValue(roomRef, (snapshot) => {
    const room = snapshot.val()
    
    if (!room) {
      alert('Không tìm thấy phòng!')
      return
    }

    // Thêm người chơi mới
    const playersRef = ref(database, `rooms/${roomCode}/players`)
    const newPlayer = { 
      name: playerName, 
      id: Date.now().toString(), 
      score: 0 
    }
    
    push(playersRef, newPlayer)
      .then(() => {
        setPlayers([...room.players, newPlayer])
        setIsHost(false)
      })
      .catch((error) => {
        console.error('Error joining room:', error)
        alert('Không thể tham gia phòng!')
      })
  }, { onlyOnce: true })
}
```

#### Lắng nghe thay đổi realtime:

```javascript
useEffect(() => {
  if (!roomCode || !database) return

  const roomRef = ref(database, `rooms/${roomCode}`)
  
  // Lắng nghe mọi thay đổi trong phòng
  const unsubscribe = onValue(roomRef, (snapshot) => {
    const room = snapshot.val()
    
    if (room) {
      setPlayers(room.players || [])
      setGameState(room.gameState || 'lobby')
      setCurrentQuestionIndex(room.currentQuestion || 0)
      
      // Cập nhật điểm số từ tất cả người chơi
      if (room.scores) {
        setScores(room.scores)
      }
    }
  })

  // Cleanup khi component unmount
  return () => {
    off(roomRef)
  }
}, [roomCode])
```

#### Cập nhật điểm số:

```javascript
const handleAnswer = (answerIndex) => {
  if (selectedAnswer !== null) return

  setSelectedAnswer(answerIndex)
  const currentQuestion = shuffledQuestions[currentQuestionIndex]
  const isCorrect = answerIndex === currentQuestion.correctAnswer

  if (isCorrect) {
    const newScore = (scores[playerName] || 0) + 10
    const updatedScores = { ...scores, [playerName]: newScore }
    setScores(updatedScores)

    // Cập nhật lên Firebase
    if (database && roomCode) {
      const scoresRef = ref(database, `rooms/${roomCode}/scores`)
      update(scoresRef, { [playerName]: newScore })
    }
  }

  // ... phần còn lại
}
```

### 7. Xử lý lỗi và Fallback

Luôn kiểm tra `database` có tồn tại không trước khi sử dụng:

```javascript
if (!database) {
  // Fallback về localStorage
  console.log('Firebase not configured, using localStorage')
  // ... code localStorage
} else {
  // Sử dụng Firebase
  // ... code Firebase
}
```

### 8. Test Firebase Integration

1. **Kiểm tra kết nối:**
   - Mở browser console
   - Kiểm tra không có lỗi Firebase
   - Xem Firebase Console để thấy dữ liệu được ghi

2. **Test multiplayer:**
   - Mở 2 tab trình duyệt khác nhau
   - Tạo phòng ở tab 1
   - Tham gia phòng ở tab 2
   - Kiểm tra cả 2 tab đều thấy nhau

3. **Test realtime:**
   - Thay đổi trạng thái ở một tab
   - Kiểm tra tab khác tự động cập nhật

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

### 9. Tạo file .env

Tạo file `.env` ở thư mục gốc của project (cùng cấp với `package.json`):

```bash
# Trong terminal
touch .env
```

Sau đó thêm các biến môi trường vào file `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Lưu ý quan trọng:**
- File `.env` đã được thêm vào `.gitignore` để không commit lên git
- Sau khi thêm `.env`, **restart dev server** (`npm run dev`)
- Vite chỉ load biến môi trường khi khởi động, nên cần restart

### 10. Kiểm tra kết nối Firebase

Sau khi cấu hình xong, kiểm tra:

1. **Mở browser console** (F12)
2. Kiểm tra không có lỗi Firebase
3. Vào Firebase Console → Realtime Database → Data
4. Tạo một phòng trong app, kiểm tra dữ liệu xuất hiện trong Firebase Console

### 11. Troubleshooting

**Lỗi: "Firebase not configured"**
- Kiểm tra file `.env` có tồn tại không
- Kiểm tra tên biến môi trường có đúng prefix `VITE_` không
- Đảm bảo đã restart dev server sau khi thêm `.env`

**Lỗi: "Permission denied"**
- Kiểm tra Firebase Database Rules trong Console
- Đảm bảo rules cho phép read/write (hoặc dùng Test mode cho development)

**Không thấy dữ liệu realtime**
- Kiểm tra `onValue` listener có được setup đúng không
- Kiểm tra `off()` được gọi trong cleanup để tránh memory leak

## Giải pháp thay thế không cần Firebase

Nếu không muốn dùng Firebase, bạn có thể:
- Sử dụng WebSocket server (Node.js + Socket.io)
- Sử dụng Supabase (tương tự Firebase nhưng open-source)
- Sử dụng các service khác như Pusher, Ably

Hiện tại, ứng dụng hoạt động tốt với localStorage cho single-player và demo multiplayer trên cùng máy. Firebase chỉ cần thiết khi muốn multiplayer thực sự qua internet.
