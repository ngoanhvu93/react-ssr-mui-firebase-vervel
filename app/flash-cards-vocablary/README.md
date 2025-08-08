# Flash Cards Vocabulary App - Structured Database Schema

Ứng dụng học từ vựng thông minh với flash cards, được xây dựng với React, TypeScript, Tailwind CSS và Firebase, sử dụng cấu trúc cơ sở dữ liệu được thiết kế lại.

## 🗄️ Cấu trúc Database Schema

### 1. Users Collection

```typescript
{
  id: string,                    // Email của user
  email: string,
  name: string,
  avatarUrl?: string,
  createdAt: Date,
  settings: {
    preferredLanguage: string,    // "vi", "en", etc.
    dailyGoal: number,           // Số từ/ngày
    notifications: boolean,
    learningMode: 'flashcard' | 'quiz' | 'writing' | 'listening'
  }
}
```

### 2. Cards Collection

```typescript
{
  id: string,
  word: string,                  // Từ tiếng Anh
  definition: string,            // Nghĩa ngắn gọn
  example: string,               // Ví dụ
  translation: string,           // Nghĩa tiếng Việt
  pronunciationUrl?: string,     // Link audio
  imageUrl?: string,             // Ảnh minh họa
  tags: string[],                // ["IELTS", "travel"]
  createdBy: 'system' | string,  // system = mặc định, string = userId
  createdAt: Date
}
```

### 3. UserCards Collection (Learning Progress)

```typescript
{
  id: string,
  userId: string,
  cardId: string,
  status: 'new' | 'learning' | 'review' | 'mastered',
  easeFactor: number,            // Độ dễ (cho thuật toán SRS)
  interval: number,              // Khoảng cách ngày lặp lại
  nextReview: Date,              // Ngày ôn tập tiếp theo
  lastReviewed: Date,            // Lần học gần nhất
  correctStreak: number          // Số lần đúng liên tiếp
}
```

### 4. Reviews Collection

```typescript
{
  id: string,
  userId: string,
  cardId: string,
  reviewedAt: Date,
  result: 'correct' | 'incorrect',
  timeSpent: number              // Giây
}
```

### 5. Sessions Collection

```typescript
{
  id: string,
  userId: string,
  startedAt: Date,
  endedAt?: Date,
  reviewedCardIds: string[]
}
```

### 6. Decks Collection

```typescript
{
  id: string,
  name: string,                  // "IELTS Basic", "Travel"
  description?: string,
  imageUrl?: string,
  createdBy: 'system' | string,
  tags: string[],
  isPublic: boolean,
  createdAt: Date
}
```

### 7. DeckCards Collection

```typescript
{
  deckId: string,
  cardId: string
}
```

### 8. Translations Collection (Multi-language support)

```typescript
{
  id: string,
  cardId: string,
  language: string,              // "vi", "ja", "es"
  translation: string
}
```

## 🚀 Tính năng chính

### 🔐 Hệ thống đăng nhập

- Đăng nhập/đăng ký với Firebase Authentication
- Lưu trữ dữ liệu cá nhân an toàn
- Quản lý phiên đăng nhập

### 📚 Quản lý thẻ từ vựng

- Thêm, chỉnh sửa, xóa thẻ từ vựng
- Hỗ trợ ví dụ và định nghĩa chi tiết
- Phân loại bằng tags
- Lưu trữ dữ liệu trên Firebase Firestore

### 🎯 Học tập thông minh với SRS

- Thuật toán Spaced Repetition System (SRS)
- Theo dõi tiến độ học tập chi tiết
- Tính toán thời gian ôn tập tối ưu
- Hiệu ứng confetti khi trả lời đúng

### 📊 Thống kê học tập nâng cao

- Tổng số thẻ đã học
- Số thẻ cần ôn tập
- Tỷ lệ trả lời đúng
- Số thẻ đã thuộc
- Theo dõi phiên học

## 🏗️ Cấu trúc dự án

```
app/flash-cards-vocablary/
├── page.tsx                    # Trang chính
├── types.ts                    # Định nghĩa types cho schema
├── services/
│   └── database.ts             # Service tương tác với Firestore
├── hooks/
│   └── useVocabularyApp.ts     # Custom hook quản lý state
├── components/
│   └── VocabularyApp.tsx       # Component chính
├── utils/
│   └── migration.ts            # Utility migration từ schema cũ
└── README.md                   # Hướng dẫn này
```

## 🔄 Migration từ Schema cũ

Ứng dụng hỗ trợ migration từ schema cũ sang schema mới:

```typescript
import { migrateOldData } from "./utils/migration";

// Migration dữ liệu cũ
const result = await migrateOldData(
  oldCards,
  userEmail,
  userName,
  userAvatarUrl
);
```

## 🧠 Thuật toán SRS (Spaced Repetition System)

### Các trạng thái học tập:

- **New**: Thẻ mới, chưa học
- **Learning**: Đang học, cần ôn tập thường xuyên
- **Review**: Đã học, ôn tập theo khoảng cách
- **Mastered**: Đã thuộc, ôn tập ít thường xuyên

### Công thức tính toán:

```typescript
// Khi trả lời đúng
if (result === "correct") {
  if (status === "new") {
    newStatus = "learning";
    interval = 1; // 1 ngày
  } else if (status === "learning") {
    if (correctStreak >= 2) {
      newStatus = "review";
      interval = 6; // 6 ngày
    } else {
      interval = 1; // 1 ngày
    }
  } else {
    // review hoặc mastered
    interval = Math.round(easeFactor * (correctStreak + 1));
    newEaseFactor = Math.max(1.3, easeFactor + 0.1);
  }
} else {
  // Trả lời sai
  newStatus = "learning";
  interval = 1; // 1 ngày
  newEaseFactor = Math.max(1.3, easeFactor - 0.2);
}
```

## 🛠️ Cài đặt và chạy

1. Cài đặt dependencies:

```bash
npm install
```

2. Cấu hình Firebase:

- Tạo project Firebase
- Bật Authentication và Firestore
- Cập nhật config trong `firebase/firebase.ts`

3. Chạy ứng dụng:

```bash
npm run dev
```

## 📈 Tính năng nâng cao

### Real-time Updates

- Sử dụng Firestore listeners để cập nhật real-time
- Đồng bộ dữ liệu giữa các thiết bị

### Performance Optimization

- Lazy loading cho cards
- Pagination cho large datasets
- Caching với React Query (có thể thêm)

### Analytics & Insights

- Theo dõi thời gian học tập
- Phân tích hiệu suất học tập
- Gợi ý từ vựng dựa trên performance

## 🔮 Roadmap

- [ ] Hỗ trợ nhiều ngôn ngữ
- [ ] Tích hợp AI để gợi ý từ vựng
- [ ] Hệ thống gamification (badges, achievements)
- [ ] Chia sẻ bộ thẻ với bạn bè
- [ ] Export/Import dữ liệu
- [ ] Dark mode
- [ ] Offline support
- [ ] Voice pronunciation
- [ ] Advanced analytics dashboard

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request để cải thiện ứng dụng.

## 📄 License

```typescript
interface FlashCard {
  id: string;
  front: string; // Từ vựng
  back: string; // Nghĩa
  difficulty: "easy" | "medium" | "hard";
  lastReviewed: Date | null;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  userId: string;
  createdAt: Date;
}
```

## Tương lai

- [ ] Tích hợp AI để gợi ý từ vựng
- [ ] Hệ thống gamification (badges, achievements)
- [ ] Chia sẻ bộ thẻ với bạn bè
- [ ] Export/Import dữ liệu
- [ ] Dark mode
- [ ] Offline support
- [ ] Voice pronunciation
- [ ] Multiple languages support

## Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request để cải thiện ứng dụng.

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.
