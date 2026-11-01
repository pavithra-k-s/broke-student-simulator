import { DailyQuest } from '../types/gameplay';

export interface QuestEvaluationContext {
  dailySpentPaise: number;
  discretionarySpentPaise: number;
  dailyBudgetLimitPaise: number;
  closingBalancePaise: number;
  hasFreePurchaseToday: boolean;
  hasImpulsePurchaseToday: boolean;
  hasCafePurchaseToday: boolean;
  choseFrugalChoiceToday: boolean;
}

export function evaluateQuestCondition(
  quest: DailyQuest,
  context: QuestEvaluationContext
): boolean {
  switch (quest.conditionType) {
    case 'SPEND_LESS_THAN_BUDGET':
      return context.dailySpentPaise <= context.dailyBudgetLimitPaise;

    case 'SPEND_LESS_THAN_AMOUNT':
      return context.dailySpentPaise < (quest.targetValuePaise || 10000);

    case 'NO_IMPULSE_PURCHASE':
      return !context.hasImpulsePurchaseToday;

    case 'NO_DISCRETIONARY_SPEND':
      return context.discretionarySpentPaise <= 0;

    case 'BUY_FREE_ALTERNATIVE':
      return context.hasFreePurchaseToday;

    case 'NO_CAFE_PURCHASE':
      return !context.hasCafePurchaseToday;

    case 'CHOOSE_CHEAPER_ALTERNATIVE':
      return context.choseFrugalChoiceToday;

    case 'SAVE_AMOUNT':
      const margin = context.dailyBudgetLimitPaise - context.dailySpentPaise;
      return margin >= (quest.targetValuePaise || 5000);

    case 'FINISH_DAY_POSITIVE':
      return context.closingBalancePaise > 0;

    default:
      return false;
  }
}
