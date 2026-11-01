import { DailyQuest, QuestConditionType } from '../types/gameplay';
import { rupeesToPaise } from '../utils/currency';

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  conditionType: QuestConditionType;
  targetValuePaise?: number;
  xpReward: number;
}

export const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    id: 'quest_under_budget',
    title: 'THE DISCIPLINED RUNWAY',
    description: 'Keep your total spending today strictly below your recommended daily budget.',
    conditionType: 'SPEND_LESS_THAN_BUDGET',
    xpReward: 50,
  },
  {
    id: 'quest_spend_under_100',
    title: 'DOUBLE DIGIT SURVIVOR',
    description: 'Spend less than ₹100 across the entire simulated day.',
    conditionType: 'SPEND_LESS_THAN_AMOUNT',
    targetValuePaise: rupeesToPaise(100),
    xpReward: 45,
  },
  {
    id: 'quest_no_impulse',
    title: 'WILLPOWER TITAN',
    description: 'Avoid making any purchases from the "Impulse Buys" section today.',
    conditionType: 'NO_IMPULSE_PURCHASE',
    xpReward: 40,
  },
  {
    id: 'quest_no_discretionary',
    title: 'MONK OF THE HOSTEL',
    description: 'End the day with ₹0 in discretionary luxury spending.',
    conditionType: 'NO_DISCRETIONARY_SPEND',
    xpReward: 60,
  },
  {
    id: 'quest_free_alternative',
    title: 'ZERO-RUPEE ALCHEMIST',
    description: 'Enjoy at least one ₹0 Free Alternative from the Temptation Store today.',
    conditionType: 'BUY_FREE_ALTERNATIVE',
    xpReward: 35,
  },
  {
    id: 'quest_no_cafe',
    title: 'COFFEE SHOP ABSTINENCE',
    description: 'Do not purchase iced coffee or artisan café drinks today.',
    conditionType: 'NO_CAFE_PURCHASE',
    xpReward: 30,
  },
  {
    id: 'quest_frugal_choice',
    title: 'STREET-SMART HUSTLER',
    description: 'Select a frugal or free choice in today’s random campus event.',
    conditionType: 'CHOOSE_CHEAPER_ALTERNATIVE',
    xpReward: 40,
  },
  {
    id: 'quest_save_50',
    title: 'PIGGY BANK DEFENDER',
    description: 'Leave at least ₹50 of unspent margin from your daily allowance today.',
    conditionType: 'SAVE_AMOUNT',
    targetValuePaise: rupeesToPaise(50),
    xpReward: 50,
  },
  {
    id: 'quest_positive_balance',
    title: 'OUT OF THE RED',
    description: 'End the simulated day with a strictly positive wallet balance (above ₹0).',
    conditionType: 'FINISH_DAY_POSITIVE',
    xpReward: 45,
  },
  {
    id: 'quest_spend_under_150',
    title: 'FRUGAL SPRINT',
    description: 'Keep your total spending today under ₹150.',
    conditionType: 'SPEND_LESS_THAN_AMOUNT',
    targetValuePaise: rupeesToPaise(150),
    xpReward: 35,
  },
];

/**
 * Deterministically pick a quest for a given simulated day, so page reloads never re-roll it!
 */
export function getQuestForDay(day: number): DailyQuest {
  const index = (day - 1) % QUEST_TEMPLATES.length;
  const template = QUEST_TEMPLATES[index];

  return {
    ...template,
    id: `${template.id}_day_${day}`,
    isCompleted: false,
    xpClaimed: false,
  };
}

