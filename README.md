# Tư tưởng Hồ Chí Minh về Đoàn kết Quốc tế

Trang web trình bày về Tư tưởng Hồ Chí Minh về đoàn kết quốc tế, được xây dựng với React và các công nghệ hiện đại.

## Tính năng

- 🎨 **Thiết kế hiện đại**: Giao diện đẹp mắt với animations mượt mà
- 🌙 **Dark Mode**: Hỗ trợ chế độ tối
- 📱 **Responsive**: Tối ưu cho mọi thiết bị
- ✨ **Tương tác**: Cards tương tác, timeline, parallax effects
- 🎯 **Nội dung phong phú**: 3 phần chính với nội dung chi tiết
- 🎮 **Quiz Trắc nghiệm**: 
  - 10 câu hỏi về Tư tưởng Hồ Chí Minh
  - Giọng đọc tự động (Text-to-Speech)
  - Tính điểm và hiển thị kết quả
  - Bảng xếp hạng (Leaderboard)
  - Chế độ chơi cùng bạn bè (Multiplayer)

## Cài đặt

```bash
npm install
```

## Chạy dự án

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Cấu trúc dự án

```
src/
├── components/
│   ├── Navbar.jsx          # Thanh điều hướng
│   ├── Hero.jsx            # Phần hero với animation
│   ├── Section1.jsx        # Mục tiêu chiến lược
│   ├── Section2.jsx        # Không đánh đổi bản sắc
│   ├── Section3.jsx        # Vai trò trí thức trẻ
│   ├── Quiz.jsx            # Quiz trắc nghiệm
│   ├── Leaderboard.jsx     # Bảng xếp hạng
│   ├── MultiplayerQuiz.jsx # Chế độ chơi cùng bạn bè
│   ├── InteractiveCard.jsx # Card tương tác
│   ├── ActionCard.jsx      # Card hành động
│   ├── Timeline.jsx        # Timeline kết hợp sức mạnh
│   ├── Footer.jsx          # Footer
│   └── DarkModeToggle.jsx  # Nút chuyển dark mode
├── data/
│   └── quizQuestions.js    # Câu hỏi quiz
├── config/
│   └── firebase.js         # Cấu hình Firebase (tùy chọn)
├── App.jsx
├── main.jsx
└── index.css
```

## Công nghệ sử dụng

- React 18
- Vite
- Framer Motion (animations)
- React Icons
- React Intersection Observer
- Firebase (tùy chọn, cho multiplayer thực sự)
- Web Speech API (Text-to-Speech)

## Nội dung

### Phần 1: Mục tiêu chiến lược hay sách lược tạm thời?
Khẳng định đây là mục tiêu chiến lược nhất quán, không phải thủ thuật ngoại giao nhất thời.

### Phần 2: Đoàn kết quốc tế không phải là "đánh đổi bản sắc"
Kết hợp sức mạnh dân tộc với sức mạnh thời đại để tạo nên sức mạnh tổng hợp.

### Phần 3: Vai trò của trí thức trẻ
Các hành động cụ thể để thực thi tư tưởng Hồ Chí Minh về đoàn kết quốc tế.

### Phần 4: Quiz Trắc nghiệm
- 10 câu hỏi về nội dung đã học
- Giọng đọc tự động bằng tiếng Việt
- Tính điểm và hiển thị kết quả chi tiết
- Bảng xếp hạng với filter theo thời gian
- Chế độ multiplayer (chơi cùng bạn bè)

## Về Multiplayer

Hiện tại, Multiplayer Quiz sử dụng localStorage để demo. Để có multiplayer thực sự qua internet, bạn cần thiết lập Firebase. Xem hướng dẫn chi tiết trong file `FIREBASE_SETUP.md`.

## Lưu ý

- Text-to-Speech yêu cầu trình duyệt hỗ trợ Web Speech API (Chrome, Edge, Safari)
- Multiplayer hiện tại chỉ hoạt động trên cùng máy tính (localStorage)
- Để multiplayer qua mạng, cần thiết lập Firebase hoặc backend server
