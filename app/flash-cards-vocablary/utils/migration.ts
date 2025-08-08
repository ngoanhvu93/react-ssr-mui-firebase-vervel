import type { FlashCard, Card } from "../types";
import {
  createCard,
  createUserCard,
  createUser,
  getUser,
} from "../services/database";

export interface MigrationResult {
  success: boolean;
  migratedCards: number;
  migratedUsers: number;
  errors: string[];
}

/**
 * Migrate old FlashCard data to new structured schema
 */
export async function migrateOldData(
  oldCards: FlashCard[],
  userEmail: string,
  userName: string,
  userAvatarUrl?: string
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migratedCards: 0,
    migratedUsers: 0,
    errors: [],
  };

  try {
    // First, ensure user exists in new schema
    let user = await getUser(userEmail);
    if (!user) {
      user = await createUser({
        email: userEmail,
        name: userName,
        avatarUrl: userAvatarUrl,
        settings: {
          preferredLanguage: "vi",
          dailyGoal: 20,
          notifications: true,
          learningMode: "flashcard",
        },
      });
      result.migratedUsers = 1;
    }

    // Migrate each card
    for (const oldCard of oldCards) {
      try {
        // Create new card structure
        const newCard = await createCard({
          word: oldCard.front,
          definition: oldCard.back,
          example: "", // Old schema didn't have examples
          translation: oldCard.back, // Use back as translation
          pronunciationUrl: undefined,
          imageUrl: undefined,
          tags: [oldCard.difficulty], // Use difficulty as tag
          createdBy: user.id,
        });

        // Create user card relationship
        await createUserCard({
          userId: user.id,
          cardId: newCard.id,
          status: oldCard.reviewCount > 0 ? "learning" : "new",
          easeFactor: 2.5, // Default ease factor
          interval: 1, // Default interval
          correctStreak: oldCard.correctCount,
        });

        result.migratedCards++;
      } catch (error) {
        console.error(`Error migrating card ${oldCard.id}:`, error);
        result.errors.push(`Failed to migrate card: ${oldCard.front}`);
      }
    }

    result.success = true;
  } catch (error) {
    console.error("Migration failed:", error);
    result.errors.push("Migration failed: " + (error as Error).message);
  }

  return result;
}

/**
 * Convert old FlashCard to new Card format
 */
export function convertOldCardToNew(oldCard: FlashCard): Omit<Card, "id"> {
  return {
    word: oldCard.front,
    definition: oldCard.back,
    example: "", // Old schema didn't have examples
    translation: oldCard.back, // Use back as translation
    pronunciationUrl: undefined,
    imageUrl: undefined,
    tags: [oldCard.difficulty], // Use difficulty as tag
    createdBy: oldCard.userId,
  };
}

/**
 * Calculate initial learning status based on old card data
 */
export function calculateInitialStatus(
  oldCard: FlashCard
): "new" | "learning" | "review" | "mastered" {
  if (oldCard.reviewCount === 0) return "new";
  if (oldCard.reviewCount < 3) return "learning";
  if (oldCard.correctCount / oldCard.reviewCount > 0.8) return "mastered";
  return "review";
}

/**
 * Calculate initial ease factor based on old card performance
 */
export function calculateInitialEaseFactor(oldCard: FlashCard): number {
  if (oldCard.reviewCount === 0) return 2.5;

  const correctRate = oldCard.correctCount / oldCard.reviewCount;
  if (correctRate > 0.9) return 2.5;
  if (correctRate > 0.7) return 2.0;
  if (correctRate > 0.5) return 1.5;
  return 1.3;
}

/**
 * Validate if data needs migration
 */
export function needsMigration(oldCards: FlashCard[]): boolean {
  return oldCards.length > 0;
}

/**
 * Get migration summary
 */
export function getMigrationSummary(oldCards: FlashCard[]): {
  totalCards: number;
  cardsByDifficulty: Record<string, number>;
  averageReviewCount: number;
  averageCorrectRate: number;
} {
  const totalCards = oldCards.length;
  const cardsByDifficulty = oldCards.reduce(
    (acc, card) => {
      acc[card.difficulty] = (acc[card.difficulty] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalReviewCount = oldCards.reduce(
    (sum, card) => sum + card.reviewCount,
    0
  );
  const averageReviewCount = totalCards > 0 ? totalReviewCount / totalCards : 0;

  const totalCorrectRate = oldCards.reduce((sum, card) => {
    const rate =
      card.reviewCount > 0 ? card.correctCount / card.reviewCount : 0;
    return sum + rate;
  }, 0);
  const averageCorrectRate = totalCards > 0 ? totalCorrectRate / totalCards : 0;

  return {
    totalCards,
    cardsByDifficulty,
    averageReviewCount,
    averageCorrectRate,
  };
}
