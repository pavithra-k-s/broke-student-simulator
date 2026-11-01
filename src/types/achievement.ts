export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'budget' | 'game' | 'streak' | 'saving';
  emoji: string;
  targetCount: number;
  currentCount: number;
  isUnlocked: boolean;
  unlockedAt?: number;
  xpBonus: number;
}

export type AchievementState = Record<string, {
  currentCount: number;
  isUnlocked: boolean;
  unlockedAt?: number;
}>;

