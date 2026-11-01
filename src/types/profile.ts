export type DifficultyLevel = 'EASY' | 'NORMAL' | 'HARD';

export interface FixedExpenseItem {
  id: string;
  name: string;
  amountPaise: number;
  category: string;
  isPaid?: boolean;
}

export interface UserProfile {
  nickname: string;
  startingBalancePaise: number;
  monthlyAllowancePaise: number;
  daysUntilAllowance: number;
  fixedExpenses: FixedExpenseItem[];
  dailyEssentialEstimatePaise: number;
  savingsGoalPaise: number;
  difficulty: DifficultyLevel;
  onboardingCompleted: boolean;
  createdAt: number;
  lastUpdated: number;
}

