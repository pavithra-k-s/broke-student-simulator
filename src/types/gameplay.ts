import { DifficultyLevel } from './profile';

export type EventCategory =
  | 'Social'
  | 'Academic'
  | 'Food'
  | 'Transport'
  | 'Luck'
  | 'Disaster';

export interface EventChoice {
  id: string;
  text: string;
  costPaise: number; // Cost in paise (0 for free, negative for cash gain/reward)
  outcomeText: string;
  reaction: string;
  xpReward: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  choices: EventChoice[];
  difficultyAllowed: DifficultyLevel[]; // EASY, NORMAL, HARD
  weight: number; // Probability weight
  emoji: string;
}

export type QuestConditionType =
  | 'SPEND_LESS_THAN_BUDGET'
  | 'SPEND_LESS_THAN_AMOUNT'
  | 'NO_IMPULSE_PURCHASE'
  | 'NO_DISCRETIONARY_SPEND'
  | 'NO_CAFE_PURCHASE'
  | 'CHOOSE_CHEAPER_ALTERNATIVE'
  | 'SAVE_AMOUNT'
  | 'FINISH_DAY_POSITIVE'
  | 'BUY_FREE_ALTERNATIVE';

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  conditionType: QuestConditionType;
  targetValuePaise?: number; // e.g. Max spending ₹100 = 10,000 paise
  xpReward: number;
  isCompleted: boolean;
  xpClaimed: boolean;
}

export type StoreCategory =
  | 'Food & Drinks'
  | 'Entertainment'
  | 'College Essentials'
  | 'Transport'
  | 'Impulse Buys'
  | 'Free Alternatives';

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  category: StoreCategory;
  pricePaise: number;
  emoji: string;
  isCustom?: boolean;
}

export interface GameTransaction {
  id: string;
  type: 'income' | 'expense';
  source: 'game_event' | 'store_purchase' | 'allowance_drop' | 'quest_reward';
  description: string;
  amountPaise: number;
  category: string;
  simulatedDay: number;
  createdAt: number;
}

export interface DayRecord {
  day: number;
  openingBalancePaise: number;
  closingBalancePaise: number;
  totalIncomePaise: number;
  totalExpensePaise: number;
  essentialSpentPaise: number;
  discretionarySpentPaise: number;
  questCompleted: boolean;
  xpEarned: number;
  eventTitle?: string;
  eventChoiceText?: string;
}

export interface GamePlayState {
  simulatedDay: number;
  gameBalancePaise: number;
  openingBalancePaise: number;
  dailySpentPaise: number;
  discretionarySpentPaise: number;
  essentialSpentPaise: number;
  streak: number;
  level: number;
  xp: number;
  currentQuest: DailyQuest;
  currentEvent: GameEvent | null;
  eventResolved: boolean;
  eventChoiceId: string | null;
  resolvedEventIds: string[];
  gameTransactions: GameTransaction[];
  dayHistory: DayRecord[];
  isDayEnded: boolean;
  paydayClaimedForCurrentCycle: boolean;
  customProducts: StoreProduct[];
}

