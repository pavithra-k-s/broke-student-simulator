import { Achievement, AchievementState } from '../types/achievement';
import { ACHIEVEMENT_TEMPLATES } from '../data/achievements';
import { UserProfile } from '../types/profile';
import { Transaction } from '../types/transaction';
import { GamePlayState } from '../types/gameplay';
import { calculateFinancialSummary } from './budgetEngine';
import { rupeesToPaise } from '../utils/currency';

export function evaluateAchievements(params: {
  existingState: AchievementState;
  profile: UserProfile | null;
  transactions: Transaction[];
  gamePlay?: GamePlayState;
}): {
  updatedState: AchievementState;
  achievements: Achievement[];
  newlyUnlocked: Achievement[];
} {
  const { existingState, profile, transactions, gamePlay } = params;
  const updatedState: AchievementState = { ...existingState };
  const newlyUnlocked: Achievement[] = [];

  const summary = calculateFinancialSummary(profile, transactions);
  const realExpenses = transactions.filter((t) => t.type === 'expense');

  // Compute game-related metrics safely
  const gameDaysSurvived = gamePlay ? (gamePlay.simulatedDay || 1) - 1 : 0;
  const gameBalancePaise = gamePlay ? (gamePlay.gameBalancePaise || 0) : 0;
  const gameTransactions = gamePlay?.gameTransactions || [];
  const dayHistory = gamePlay?.dayHistory || [];
  const resolvedEventIds = gamePlay?.resolvedEventIds || [];

  const gameStorePurchases = gameTransactions.filter((t) => t.source === 'store_purchase').length;
  const completedQuestsCount =
    dayHistory.filter((d) => d.questCompleted).length +
    (gamePlay?.currentQuest?.isCompleted ? 1 : 0);
  const daysUnderBudgetCount = dayHistory.filter(
    (d) => d.totalExpensePaise <= (summary.dailySpendingLimitPaise || 10000)
  ).length;
  const zeroDiscretionaryDays = dayHistory.filter((d) => d.discretionarySpentPaise === 0).length;
  const frugalChoicesCount = resolvedEventIds.length;
  const receivedPayday = gameTransactions.some((t) => t.source === 'allowance_drop');

  const achievements: Achievement[] = ACHIEVEMENT_TEMPLATES.map((tmpl) => {
    const prev = updatedState[tmpl.id] || { currentCount: 0, isUnlocked: false };
    let currentCount = prev.currentCount;

    switch (tmpl.id) {
      case 'FIRST_BLOOD':
        currentCount = realExpenses.length > 0 ? 1 : 0;
        break;

      case 'COIN_COLLECTOR':
        currentCount =
          summary.savingsGoalPaise > 0 && summary.availableBalancePaise >= summary.savingsGoalPaise
            ? 1
            : 0;
        break;

      case 'THE_RESISTANCE':
        currentCount = Math.min(tmpl.targetCount, zeroDiscretionaryDays);
        break;

      case 'COUPON_WARRIOR':
        currentCount = Math.min(tmpl.targetCount, frugalChoicesCount);
        break;

      case 'SURVIVAL_EXPERT':
        currentCount = receivedPayday && gameBalancePaise >= 0 ? 1 : 0;
        break;

      case 'NO_IMPULSE_NO_PROBLEM':
        const noImpulseDay = gamePlay
          ? gamePlay.dayHistory.some((d) => d.discretionarySpentPaise === 0)
          : false;
        currentCount = noImpulseDay ? 1 : 0;
        break;

      case 'FINANCIAL_DELUSIONIST':
        const exceededDiscretionary = realExpenses.some(
          (t) => t.category === 'Entertainment' || t.category === 'Shopping'
        );
        currentCount = exceededDiscretionary ? 1 : 0;
        break;

      case 'PIXEL_MILLIONAIRE':
        currentCount = gameBalancePaise >= rupeesToPaise(5000) ? 1 : 0;
        break;

      case 'STREAK_MACHINE':
        currentCount = Math.min(tmpl.targetCount, gameDaysSurvived);
        break;

      case 'RESPONSIBLE_FOR_ONCE':
        currentCount = Math.min(tmpl.targetCount, completedQuestsCount);
        break;

      case 'FIRST_PAYDAY':
        currentCount = receivedPayday ? 1 : 0;
        break;

      case 'SHOPPING_ADDICT':
        currentCount = Math.min(tmpl.targetCount, gameStorePurchases);
        break;

      case 'BUDGET_LEGEND':
        currentCount = Math.min(tmpl.targetCount, daysUnderBudgetCount);
        break;

      case 'THE_SAVER':
        currentCount = Math.min(tmpl.targetCount, frugalChoicesCount);
        break;

      case 'FINAL_BOSS_SURVIVOR':
        currentCount =
          profile?.difficulty === 'HARD' && gameDaysSurvived >= 5 && gameBalancePaise >= 0 ? 1 : 0;
        break;
    }

    const wasUnlocked = prev.isUnlocked;
    const shouldUnlock = wasUnlocked || currentCount >= tmpl.targetCount;

    const ach: Achievement = {
      ...tmpl,
      currentCount,
      isUnlocked: shouldUnlock,
      unlockedAt: wasUnlocked ? prev.unlockedAt : shouldUnlock ? Date.now() : undefined,
    };

    if (!wasUnlocked && shouldUnlock) {
      newlyUnlocked.push(ach);
    }

    updatedState[tmpl.id] = {
      currentCount,
      isUnlocked: shouldUnlock,
      unlockedAt: ach.unlockedAt,
    };

    return ach;
  });

  return { updatedState, achievements, newlyUnlocked };
}
