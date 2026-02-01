// Firebase configuration
// Bạn cần tạo một Firebase project và thêm config ở đây
// Hoặc có thể sử dụng localStorage cho phiên bản đơn giản hơn

import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Đây là config mẫu - bạn cần thay thế bằng config thật từ Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// Khởi tạo Firebase (chỉ khi có config)
let app = null
let database = null

try {
  // Kiểm tra xem có config hợp lệ không
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig)
    database = getDatabase(app)
  }
} catch (error) {
  console.log('Firebase not configured, using localStorage fallback')
}

export { database }
export default app
