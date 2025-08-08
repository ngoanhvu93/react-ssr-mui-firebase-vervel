import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Query,
  type CollectionReference,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import type {
  User,
  Card,
  UserCard,
  Deck,
  DeckCard,
  Review,
  Session,
  LearningStatus,
  ReviewResult,
} from "../types";

// User Management
export const createUser = async (userData: Omit<User, "id" | "createdAt">) => {
  const userRef = doc(db, "users", userData.email);
  const user: User = {
    ...userData,
    id: userData.email,
    createdAt: new Date(),
  };

  await setDoc(userRef, {
    ...user,
    createdAt: serverTimestamp(),
  });

  return user;
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      id: userSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as User;
  }

  return null;
};

export const updateUserSettings = async (
  userId: string,
  settings: Partial<User["settings"]>
) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    settings: settings,
    updatedAt: serverTimestamp(),
  });
};

// Card Management
export const createCard = async (cardData: Omit<Card, "id">) => {
  const cardRef = doc(collection(db, "cards"));
  const card: Card = {
    ...cardData,
    id: cardRef.id,
  };

  await setDoc(cardRef, {
    ...card,
    createdAt: serverTimestamp(),
  });

  return card;
};

export const getCards = async (filters?: {
  createdBy?: string;
  tags?: string[];
}): Promise<Card[]> => {
  let q: Query | CollectionReference = collection(db, "cards");

  if (filters?.createdBy) {
    q = query(q, where("createdBy", "==", filters.createdBy));
  }

  const querySnapshot = await getDocs(q);
  const cards: Card[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.word && data.definition && data.example && data.translation) {
      cards.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as unknown as Card);
    }
  });

  return cards;
};

export const getCard = async (cardId: string): Promise<Card | null> => {
  const cardRef = doc(db, "cards", cardId);
  const cardSnap = await getDoc(cardRef);

  if (cardSnap.exists()) {
    const data = cardSnap.data();
    if (data.word && data.definition && data.example && data.translation) {
      return {
        ...data,
        id: cardSnap.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as unknown as Card;
    }
  }

  return null;
};

// UserCard Management (Learning Progress)
export const createUserCard = async (
  userCardData: Omit<UserCard, "id" | "lastReviewed" | "nextReview">
) => {
  const userCardRef = doc(collection(db, "user_cards"));
  const userCard: UserCard = {
    ...userCardData,
    id: userCardRef.id,
    lastReviewed: new Date(),
    nextReview: new Date(), // Will be calculated based on SRS algorithm
  };

  await setDoc(userCardRef, {
    ...userCard,
    lastReviewed: serverTimestamp(),
    nextReview: serverTimestamp(),
  });

  return userCard;
};

export const getUserCards = async (userId: string): Promise<UserCard[]> => {
  const q = query(collection(db, "user_cards"), where("userId", "==", userId));

  const querySnapshot = await getDocs(q);
  const userCards: UserCard[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    userCards.push({
      ...data,
      id: doc.id,
      lastReviewed: data.lastReviewed?.toDate() || new Date(),
      nextReview: data.nextReview?.toDate() || new Date(),
    } as UserCard);
  });

  return userCards;
};

export const updateUserCard = async (
  userCardId: string,
  updates: Partial<UserCard>
) => {
  const userCardRef = doc(db, "user_cards", userCardId);
  const updateData: any = { ...updates };

  if (updates.lastReviewed) {
    updateData.lastReviewed = serverTimestamp();
  }
  if (updates.nextReview) {
    updateData.nextReview = serverTimestamp();
  }

  await updateDoc(userCardRef, updateData);
};

export const getUserCardsForReview = async (
  userId: string
): Promise<UserCard[]> => {
  const now = new Date();
  const q = query(
    collection(db, "user_cards"),
    where("userId", "==", userId),
    where("nextReview", "<=", now),
    orderBy("nextReview", "asc")
  );

  const querySnapshot = await getDocs(q);
  const userCards: UserCard[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    userCards.push({
      ...data,
      id: doc.id,
      lastReviewed: data.lastReviewed?.toDate() || new Date(),
      nextReview: data.nextReview?.toDate() || new Date(),
    } as UserCard);
  });

  return userCards;
};

// Review Management
export const createReview = async (
  reviewData: Omit<Review, "id" | "reviewedAt">
) => {
  const reviewRef = doc(collection(db, "reviews"));
  const review: Review = {
    ...reviewData,
    id: reviewRef.id,
    reviewedAt: new Date(),
  };

  await setDoc(reviewRef, {
    ...review,
    reviewedAt: serverTimestamp(),
  });

  return review;
};

export const getReviews = async (
  userId: string,
  cardId?: string
): Promise<Review[]> => {
  let q = query(
    collection(db, "reviews"),
    where("userId", "==", userId),
    orderBy("reviewedAt", "desc")
  );

  if (cardId) {
    q = query(q, where("cardId", "==", cardId));
  }

  const querySnapshot = await getDocs(q);
  const reviews: Review[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    reviews.push({
      ...data,
      id: doc.id,
      reviewedAt: data.reviewedAt?.toDate() || new Date(),
    } as Review);
  });

  return reviews;
};

// Session Management
export const createSession = async (
  sessionData: Omit<Session, "id" | "startedAt">
) => {
  const sessionRef = doc(collection(db, "sessions"));
  const session: Session = {
    ...sessionData,
    id: sessionRef.id,
    startedAt: new Date(),
  };

  await setDoc(sessionRef, {
    ...session,
    startedAt: serverTimestamp(),
  });

  return session;
};

export const endSession = async (sessionId: string) => {
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, {
    endedAt: serverTimestamp(),
  });
};

export const getSessions = async (userId: string): Promise<Session[]> => {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", userId),
    orderBy("startedAt", "desc"),
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  const sessions: Session[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sessions.push({
      ...data,
      id: doc.id,
      startedAt: data.startedAt?.toDate() || new Date(),
      endedAt: data.endedAt?.toDate(),
    } as Session);
  });

  return sessions;
};

// Deck Management
export const createDeck = async (deckData: Omit<Deck, "id">) => {
  const deckRef = doc(collection(db, "decks"));
  const deck: Deck = {
    ...deckData,
    id: deckRef.id,
  };

  await setDoc(deckRef, {
    ...deck,
    createdAt: serverTimestamp(),
  });

  return deck;
};

export const getDecks = async (filters?: {
  createdBy?: string;
  isPublic?: boolean;
}): Promise<Deck[]> => {
  let q: Query | CollectionReference = collection(db, "decks");

  if (filters?.createdBy) {
    q = query(q, where("createdBy", "==", filters.createdBy));
  }

  if (filters?.isPublic !== undefined) {
    q = query(q, where("isPublic", "==", filters.isPublic));
  }

  const querySnapshot = await getDocs(q);
  const decks: Deck[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (
      data.name &&
      data.createdBy &&
      data.tags &&
      data.isPublic !== undefined
    ) {
      decks.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as unknown as Deck);
    }
  });

  return decks;
};

// DeckCard Management
export const addCardToDeck = async (deckId: string, cardId: string) => {
  const deckCardRef = doc(collection(db, "deck_cards"));
  const deckCard: DeckCard = {
    deckId,
    cardId,
  };

  await setDoc(deckCardRef, deckCard);

  return deckCard;
};

export const getDeckCards = async (deckId: string): Promise<Card[]> => {
  const q = query(collection(db, "deck_cards"), where("deckId", "==", deckId));

  const querySnapshot = await getDocs(q);
  const cardIds = querySnapshot.docs.map((doc) => doc.data().cardId);

  if (cardIds.length === 0) return [];

  const cards: Card[] = [];
  for (const cardId of cardIds) {
    const card = await getCard(cardId);
    if (card) cards.push(card);
  }

  return cards;
};

// SRS Algorithm Implementation
export const calculateNextReview = (
  currentStatus: LearningStatus,
  easeFactor: number,
  correctStreak: number,
  result: ReviewResult
): { nextReview: Date; newEaseFactor: number; newStatus: LearningStatus } => {
  const now = new Date();
  let interval: number;
  let newEaseFactor = easeFactor;
  let newStatus = currentStatus;

  if (result === "correct") {
    if (currentStatus === "new") {
      newStatus = "learning";
      interval = 1; // 1 day
    } else if (currentStatus === "learning") {
      if (correctStreak >= 2) {
        newStatus = "review";
        interval = 6; // 6 days
      } else {
        interval = 1; // 1 day
      }
    } else {
      // review or mastered
      interval = Math.round(easeFactor * (correctStreak + 1));
      newEaseFactor = Math.max(1.3, easeFactor + 0.1);
    }
  } else {
    // incorrect
    newStatus = "learning";
    interval = 1; // 1 day
    newEaseFactor = Math.max(1.3, easeFactor - 0.2);
  }

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return { nextReview, newEaseFactor, newStatus };
};

// Real-time listeners
export const subscribeToUserCards = (
  userId: string,
  callback: (userCards: UserCard[]) => void
) => {
  const q = query(collection(db, "user_cards"), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const userCards: UserCard[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      userCards.push({
        ...data,
        id: doc.id,
        lastReviewed: data.lastReviewed?.toDate() || new Date(),
        nextReview: data.nextReview?.toDate() || new Date(),
      } as UserCard);
    });
    callback(userCards);
  });
};

export const subscribeToCards = (
  callback: (cards: Card[]) => void,
  filters?: { createdBy?: string }
) => {
  let q: Query | CollectionReference = collection(db, "cards");

  if (filters?.createdBy) {
    q = query(q, where("createdBy", "==", filters.createdBy));
  }

  return onSnapshot(q, (snapshot) => {
    const cards: Card[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.word && data.definition && data.example && data.translation) {
        cards.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as unknown as Card);
      }
    });
    callback(cards);
  });
};
