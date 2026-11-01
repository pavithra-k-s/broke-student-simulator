import { UserProfile } from './profile';
import { Transaction } from './transaction';
import { GamePlayState } from './gameplay';
import { AchievementState } from './achievement';

export type FinancialTone = 'critical' | 'warning' | 'surviving' | 'optimistic' | 'suspicious';

export interface FinancialStatus {
  title: string;
  subtitle: string;
  tone: FinancialTone;
  badgeColor: string;
  emoji: string;
}

export interface AppSettings {
  crtEffect: boolean;
  animations: boolean;
}

export interface GameSaveData {
  version: number;
  profile: UserProfile | null;
  transactions: Transaction[];
  settings: AppSettings;
  gamePlay?: GamePlayState;
  achievements?: AchievementState;
  isDemoMode?: boolean;
}

export interface FinancialSummary {
  startingBalancePaise: number;
  totalIncomePaise: number;
  totalExpensesPaise: number;
  availableBalancePaise: number;
  totalFixedExpensesPaise: number;
  unpaidFixedExpensesPaise: number;
  daysUntilAllowance: number;
  dailySpendingLimitPaise: number;
  adjustedDailyLimitWithSavingsPaise: number;
  savingsGoalPaise: number;
  savingsProgressPercent: number;
  status: FinancialStatus;
  explanation: string;
}

