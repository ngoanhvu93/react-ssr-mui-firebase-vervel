import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";
import type {
  User,
  Card,
  UserCard,
  Review,
  Session,
  ReviewResult,
} from "../types";
import {
  createUser,
  getUser,
  updateUserSettings,
  createCard,
  getCards,
  createUserCard,
  getUserCards,
  updateUserCard,
  getUserCardsForReview,
  createReview,
  getReviews,
  createSession,
  endSession,
  getSessions,
  calculateNextReview,
  subscribeToUserCards,
  subscribeToCards,
} from "../services/database";

export interface VocabularyAppState {
  user: User | null;
  cards: Card[];
  userCards: UserCard[];
  reviews: Review[];
  sessions: Session[];
  loading: boolean;
  error: string | null;
}

export interface VocabularyAppActions {
  // User management
  initializeUser: (
    email: string,
    name: string,
    avatarUrl?: string
  ) => Promise<void>;
  updateUserSettings: (settings: Partial<User["settings"]>) => Promise<void>;

  // Card management
  addCard: (cardData: Omit<Card, "id">) => Promise<void>;
  getCardsForUser: (userId: string) => Promise<void>;

  // Learning management
  startLearningSession: () => Promise<Session>;
  endLearningSession: (sessionId: string) => Promise<void>;
  reviewCard: (
    userCardId: string,
    result: ReviewResult,
    timeSpent: number
  ) => Promise<void>;
  getCardsForReview: (userId: string) => Promise<UserCard[]>;

  // Statistics
  getLearningStats: () => {
    totalCards: number;
    cardsForReview: number;
    masteredCards: number;
    learningCards: number;
    correctRate: number;
    streak: number;
  };
}

export function useVocabularyApp(): VocabularyAppState & VocabularyAppActions {
  const [state, setState] = useState<VocabularyAppState>({
    user: null,
    cards: [],
    userCards: [],
    reviews: [],
    sessions: [],
    loading: true,
    error: null,
  });

  // Initialize user
  const initializeUser = useCallback(
    async (email: string, name: string, avatarUrl?: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        let user = await getUser(email);

        if (!user) {
          // Create new user
          user = await createUser({
            email,
            name,
            avatarUrl,
            settings: {
              preferredLanguage: "vi",
              dailyGoal: 20,
              notifications: true,
              learningMode: "flashcard",
            },
          });
        }

        setState((prev) => ({ ...prev, user, loading: false }));

        // Load user's data
        await Promise.all([
          getCardsForUser(email),
          loadUserCards(email),
          loadReviews(email),
          loadSessions(email),
        ]);
      } catch (error) {
        console.error("Error initializing user:", error);
        setState((prev) => ({
          ...prev,
          error: "Lỗi khi khởi tạo người dùng",
          loading: false,
        }));
        toast.error("Lỗi khi khởi tạo người dùng");
      }
    },
    []
  );

  // Update user settings
  const updateUserSettingsAction = useCallback(
    async (settings: Partial<User["settings"]>) => {
      if (!state.user) {
        toast.error("Vui lòng đăng nhập!");
        return;
      }

      try {
        await updateUserSettings(state.user.id, settings);
        setState((prev) => ({
          ...prev,
          user: prev.user
            ? { ...prev.user, settings: { ...prev.user.settings, ...settings } }
            : null,
        }));
        toast.success("Cập nhật cài đặt thành công!");
      } catch (error) {
        console.error("Error updating user settings:", error);
        toast.error("Lỗi khi cập nhật cài đặt!");
      }
    },
    [state.user]
  );

  // Add card
  const addCard = useCallback(
    async (cardData: Omit<Card, "id">) => {
      if (!state.user) {
        toast.error("Vui lòng đăng nhập!");
        return;
      }

      try {
        const card = await createCard({
          ...cardData,
          createdBy: state.user.id,
        });

        setState((prev) => ({
          ...prev,
          cards: [card, ...prev.cards],
        }));

        toast.success("Thêm thẻ thành công!");
      } catch (error) {
        console.error("Error adding card:", error);
        toast.error("Lỗi khi thêm thẻ!");
      }
    },
    [state.user]
  );

  // Get cards for user
  const getCardsForUser = useCallback(async (userId: string) => {
    try {
      const cards = await getCards({ createdBy: userId });
      setState((prev) => ({ ...prev, cards }));
    } catch (error) {
      console.error("Error loading cards:", error);
      setState((prev) => ({ ...prev, error: "Lỗi khi tải thẻ" }));
    }
  }, []);

  // Load user cards
  const loadUserCards = useCallback(async (userId: string) => {
    try {
      const userCards = await getUserCards(userId);
      setState((prev) => ({ ...prev, userCards }));
    } catch (error) {
      console.error("Error loading user cards:", error);
    }
  }, []);

  // Load reviews
  const loadReviews = useCallback(async (userId: string) => {
    try {
      const reviews = await getReviews(userId);
      setState((prev) => ({ ...prev, reviews }));
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }, []);

  // Load sessions
  const loadSessions = useCallback(async (userId: string) => {
    try {
      const sessions = await getSessions(userId);
      setState((prev) => ({ ...prev, sessions }));
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  }, []);

  // Start learning session
  const startLearningSession = useCallback(async (): Promise<Session> => {
    if (!state.user) {
      throw new Error("User not logged in");
    }

    const session = await createSession({
      userId: state.user.id,
      reviewedCardIds: [],
    });

    setState((prev) => ({
      ...prev,
      sessions: [session, ...prev.sessions],
    }));

    return session;
  }, [state.user]);

  // End learning session
  const endLearningSession = useCallback(async (sessionId: string) => {
    try {
      await endSession(sessionId);
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session) =>
          session.id === sessionId
            ? { ...session, endedAt: new Date() }
            : session
        ),
      }));
    } catch (error) {
      console.error("Error ending session:", error);
    }
  }, []);

  // Review card
  const reviewCard = useCallback(
    async (userCardId: string, result: ReviewResult, timeSpent: number) => {
      if (!state.user) {
        toast.error("Vui lòng đăng nhập!");
        return;
      }

      try {
        const userCard = state.userCards.find((uc) => uc.id === userCardId);
        if (!userCard) {
          toast.error("Không tìm thấy thẻ!");
          return;
        }

        // Create review record
        await createReview({
          userId: state.user.id,
          cardId: userCard.cardId,
          result,
          timeSpent,
        });

        // Calculate next review using SRS algorithm
        const { nextReview, newEaseFactor, newStatus } = calculateNextReview(
          userCard.status,
          userCard.easeFactor,
          userCard.correctStreak,
          result
        );

        // Update user card
        await updateUserCard(userCardId, {
          status: newStatus,
          easeFactor: newEaseFactor,
          nextReview,
          lastReviewed: new Date(),
          correctStreak: result === "correct" ? userCard.correctStreak + 1 : 0,
        });

        // Update local state
        setState((prev) => ({
          ...prev,
          userCards: prev.userCards.map((uc) =>
            uc.id === userCardId
              ? {
                  ...uc,
                  status: newStatus,
                  easeFactor: newEaseFactor,
                  nextReview,
                  lastReviewed: new Date(),
                  correctStreak:
                    result === "correct" ? uc.correctStreak + 1 : 0,
                }
              : uc
          ),
        }));

        // Show feedback
        if (result === "correct") {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          toast.success("Chính xác! 🎉");
        } else {
          toast.error("Sai rồi, hãy thử lại!");
        }
      } catch (error) {
        console.error("Error reviewing card:", error);
        toast.error("Lỗi khi cập nhật kết quả!");
      }
    },
    [state.user, state.userCards]
  );

  // Get cards for review
  const getCardsForReview = useCallback(
    async (userId: string): Promise<UserCard[]> => {
      try {
        return await getUserCardsForReview(userId);
      } catch (error) {
        console.error("Error getting cards for review:", error);
        return [];
      }
    },
    []
  );

  // Get learning statistics
  const getLearningStats = useCallback(() => {
    const totalCards = state.userCards.length;
    const cardsForReview = state.userCards.filter(
      (uc) => uc.nextReview <= new Date()
    ).length;
    const masteredCards = state.userCards.filter(
      (uc) => uc.status === "mastered"
    ).length;
    const learningCards = state.userCards.filter(
      (uc) => uc.status === "learning"
    ).length;

    const totalReviews = state.reviews.length;
    const correctReviews = state.reviews.filter(
      (r) => r.result === "correct"
    ).length;
    const correctRate =
      totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

    // Calculate streak (simplified)
    const streak = 7; // TODO: Implement proper streak calculation

    return {
      totalCards,
      cardsForReview,
      masteredCards,
      learningCards,
      correctRate,
      streak,
    };
  }, [state.userCards, state.reviews]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!state.user) return;

    const unsubscribeUserCards = subscribeToUserCards(
      state.user.id,
      (userCards) => {
        setState((prev) => ({ ...prev, userCards }));
      }
    );

    const unsubscribeCards = subscribeToCards(
      (cards) => {
        setState((prev) => ({ ...prev, cards }));
      },
      { createdBy: state.user.id }
    );

    return () => {
      unsubscribeUserCards();
      unsubscribeCards();
    };
  }, [state.user]);

  return {
    ...state,
    initializeUser,
    updateUserSettings: updateUserSettingsAction,
    addCard,
    getCardsForUser,
    startLearningSession,
    endLearningSession,
    reviewCard,
    getCardsForReview,
    getLearningStats,
  };
}
