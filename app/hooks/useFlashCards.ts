import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "./useAuth";
import { toast } from "react-hot-toast";
import { db } from "firebase/firebase";

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

export function useFlashCards() {
  const { user } = useAuth();
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "flashCards"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardsData: FlashCard[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        cardsData.push({
          id: doc.id,
          front: data.front,
          back: data.back,
          difficulty: data.difficulty,
          lastReviewed: data.lastReviewed?.toDate() || null,
          reviewCount: data.reviewCount || 0,
          correctCount: data.correctCount || 0,
          incorrectCount: data.incorrectCount || 0,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      setCards(cardsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addCard = async (
    cardData: Omit<
      FlashCard,
      | "id"
      | "userId"
      | "createdAt"
      | "lastReviewed"
      | "reviewCount"
      | "correctCount"
      | "incorrectCount"
    >
  ) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    try {
      await addDoc(collection(db, "flashCards"), {
        ...cardData,
        userId: user.uid,
        createdAt: Timestamp.now(),
        lastReviewed: null,
        reviewCount: 0,
        correctCount: 0,
        incorrectCount: 0,
      });
    } catch (error) {
      console.error("Add card error:", error);
      toast.error("Thêm thẻ thất bại!");
    }
  };

  const updateCard = async (id: string, updates: Partial<FlashCard>) => {
    try {
      const cardRef = doc(db, "flashCards", id);
      await updateDoc(cardRef, updates);
    } catch (error) {
      console.error("Update card error:", error);
      toast.error("Cập nhật thẻ thất bại!");
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await deleteDoc(doc(db, "flashCards", id));
      toast.success("Xóa thẻ thành công!");
    } catch (error) {
      console.error("Delete card error:", error);
      toast.error("Xóa thẻ thất bại!");
    }
  };

  const updateProgress = async (id: string, isCorrect: boolean) => {
    try {
      const cardRef = doc(db, "flashCards", id);
      const card = cards.find((c) => c.id === id);

      if (card) {
        await updateDoc(cardRef, {
          lastReviewed: Timestamp.now(),
          reviewCount: card.reviewCount + 1,
          correctCount: card.correctCount + (isCorrect ? 1 : 0),
          incorrectCount: card.incorrectCount + (isCorrect ? 0 : 1),
        });
      }
    } catch (error) {
      console.error("Update progress error:", error);
    }
  };

  const getStudyCards = () => {
    // Return cards that need review (not reviewed today or never reviewed)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return cards.filter((card) => {
      if (!card.lastReviewed) return true;

      const lastReview = new Date(card.lastReviewed);
      lastReview.setHours(0, 0, 0, 0);

      return lastReview < today;
    });
  };

  return {
    cards,
    loading,
    addCard,
    updateCard,
    deleteCard,
    updateProgress,
    getStudyCards,
  };
}
