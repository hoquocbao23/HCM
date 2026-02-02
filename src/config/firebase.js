// Firebase configuration
// Bạn cần tạo một Firebase project và thêm config ở đây
// Hoặc có thể sử dụng localStorage cho phiên bản đơn giản hơn

import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Lấy cấu hình Firebase từ biến môi trường (Vite)
// Định nghĩa trong file .env:
// VITE_FIREBASE_API_KEY=...
// VITE_FIREBASE_AUTH_DOMAIN=...
// VITE_FIREBASE_DATABASE_URL=...
// VITE_FIREBASE_PROJECT_ID=...
// VITE_FIREBASE_STORAGE_BUCKET=...
// VITE_FIREBASE_MESSAGING_SENDER_ID=...
// VITE_FIREBASE_APP_ID=...
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Khởi tạo Firebase (chỉ khi có config)
let app = null
let database = null

try {
  // Kiểm tra xem có config hợp lệ không
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig)
    database = getDatabase(app)
  }
} catch (error) {
  console.log('Firebase not configured, using localStorage fallback')
}

export { database }
export default app
