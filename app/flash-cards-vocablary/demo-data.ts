// Demo data cho ứng dụng Flash Cards
export const demoCards = [
  {
    id: "1",
    front: "Hello",
    back: "Xin chào",
    difficulty: "easy" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: "2",
    front: "Goodbye",
    back: "Tạm biệt",
    difficulty: "easy" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: "3",
    front: "Thank you",
    back: "Cảm ơn",
    difficulty: "easy" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: "4",
    front: "Beautiful",
    back: "Đẹp",
    difficulty: "medium" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: "5",
    front: "Intelligent",
    back: "Thông minh",
    difficulty: "medium" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: "6",
    front: "Perseverance",
    back: "Kiên trì",
    difficulty: "hard" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: "7",
    front: "Accomplishment",
    back: "Thành tựu",
    difficulty: "hard" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: "8",
    front: "Opportunity",
    back: "Cơ hội",
    difficulty: "medium" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: "9",
    front: "Success",
    back: "Thành công",
    difficulty: "medium" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
  {
    id: "10",
    front: "Knowledge",
    back: "Kiến thức",
    difficulty: "medium" as const,
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  },
];

// Hàm để load demo data
export const loadDemoData = () => {
  return demoCards.map((card) => ({
    ...card,
    createdAt: new Date(),
  }));
};

// Categories cho từ vựng
export const vocabularyCategories = [
  {
    name: "Cơ bản",
    words: ["Hello", "Goodbye", "Thank you", "Please", "Sorry"],
  },
  {
    name: "Cảm xúc",
    words: ["Happy", "Sad", "Angry", "Excited", "Nervous"],
  },
  {
    name: "Màu sắc",
    words: ["Red", "Blue", "Green", "Yellow", "Purple"],
  },
  {
    name: "Số đếm",
    words: ["One", "Two", "Three", "Four", "Five"],
  },
  {
    name: "Gia đình",
    words: ["Father", "Mother", "Brother", "Sister", "Grandfather"],
  },
];

// Tips cho việc học từ vựng
export const learningTips = [
  "Học từ vựng mỗi ngày để duy trì thói quen",
  "Sử dụng flash cards để ghi nhớ hiệu quả",
  "Ôn tập lại từ vựng cũ thường xuyên",
  "Tạo câu với từ vựng để hiểu sâu hơn",
  "Học theo chủ đề để dễ nhớ hơn",
  "Sử dụng hình ảnh để liên kết từ vựng",
  "Luyện tập phát âm khi học từ mới",
  "Ghi chú lại những từ khó nhớ",
];

// Study statistics
export const getStudyStats = (cards: any[]) => {
  const totalCards = cards.length;
  const studiedToday = cards.filter(
    (card) =>
      card.lastReviewed &&
      new Date(card.lastReviewed).toDateString() === new Date().toDateString()
  ).length;

  const totalReviews = cards.reduce((sum, card) => sum + card.reviewCount, 0);
  const totalCorrect = cards.reduce((sum, card) => sum + card.correctCount, 0);
  const correctRate =
    totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  return {
    totalCards,
    studiedToday,
    totalReviews,
    totalCorrect,
    correctRate,
    averageReviews: totalCards > 0 ? Math.round(totalReviews / totalCards) : 0,
  };
};
