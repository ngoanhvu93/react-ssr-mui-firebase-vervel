// Database Schema Types for Flash Cards Vocabulary App

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  settings: {
    preferredLanguage: string;
    dailyGoal: number; // số từ/ngày
    notifications: boolean;
    learningMode: "flashcard" | "quiz" | "writing" | "listening";
  };
}

export interface Card {
  id: string;
  word: string; // từ tiếng Anh
  definition: string; // nghĩa ngắn gọn
  example: string; // ví dụ
  translation: string; // nghĩa tiếng Việt
  pronunciationUrl?: string; // link audio
  imageUrl?: string; // ảnh minh họa
  tags: string[]; // ví dụ: ["IELTS", "travel"]
  createdBy: "system" | string; // system = mặc định, string = userId
}

export interface UserCard {
  id: string;
  userId: string;
  cardId: string;
  status: "new" | "learning" | "review" | "mastered";
  easeFactor: number; // độ dễ (cho thuật toán SRS)
  interval: number; // khoảng cách ngày lặp lại
  nextReview: Date; // ngày ôn tập tiếp theo
  lastReviewed: Date; // lần học gần nhất
  correctStreak: number; // số lần đúng liên tiếp
}

export interface Deck {
  id: string;
  name: string; // ví dụ: "IELTS Basic", "Travel", "Business"
  description?: string;
  imageUrl?: string;
  createdBy: "system" | string;
  tags: string[];
  isPublic: boolean;
}

export interface DeckCard {
  deckId: string;
  cardId: string;
}

export interface Review {
  id: string;
  userId: string;
  cardId: string;
  reviewedAt: Date;
  result: "correct" | "incorrect";
  timeSpent: number; // giây
}

export interface Translation {
  id: string;
  cardId: string;
  language: string; // "vi", "ja", "es"
  translation: string;
}

export interface Session {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  reviewedCardIds: string[];
}

// Legacy interface for backward compatibility
export interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed: Date | null;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  userId: string;
  createdAt: Date;
}

// Utility types
export type Difficulty = "easy" | "medium" | "hard";
export type LearningStatus = "new" | "learning" | "review" | "mastered";
export type ReviewResult = "correct" | "incorrect";
export type LearningMode = "flashcard" | "quiz" | "writing" | "listening";
