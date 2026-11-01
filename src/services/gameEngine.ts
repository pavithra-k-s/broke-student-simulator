import { GamePlayState } from '../types/gameplay';
import { UserProfile } from '../types/profile';
import { getQuestForDay } from '../data/quests';
import { selectDailyEvent } from './eventEngine';

/**
 * Initializes a fresh GamePlayState when a player begins or resets the game.
 * Sets the initial fictional game balance to the player's starting profile balance.
 */
export function initializeGamePlayState(profile: UserProfile | null): GamePlayState {
  const initialBalance = profile ? profile.startingBalancePaise : 150000;
  const initialDay = 1;
  const quest = getQuestForDay(initialDay);
  const event = selectDailyEvent(profile?.difficulty || 'NORMAL', [], initialDay);

  return {
    simulatedDay: initialDay,
    gameBalancePaise: initialBalance,
    openingBalancePaise: initialBalance,
    dailySpentPaise: 0,
    discretionarySpentPaise: 0,
    essentialSpentPaise: 0,
    streak: 0,
    level: 1,
    xp: 0,
    currentQuest: quest,
    currentEvent: event,
    eventResolved: false,
    eventChoiceId: null,
    resolvedEventIds: [],
    gameTransactions: [],
    dayHistory: [],
    isDayEnded: false,
    paydayClaimedForCurrentCycle: false,
    customProducts: [],
  };
}

/**
 * Computes the recommended daily spending limit specifically for the gameplay loop.
 * Game Daily Limit = Game Balance / Days remaining in allowance horizon
 */
export function calculateGameDailyLimit(gameBalancePaise: number, daysRemaining: number): number {
  const days = Math.max(1, daysRemaining);
  if (gameBalancePaise <= 0) return 0;
  return Math.floor(gameBalancePaise / days);
}

/**
 * Generate funny, accurate retro commentary for Day-End summary based on real actions.
 */
export function generateDayEndCommentary(params: {
  dailySpentPaise: number;
  dailyLimitPaise: number;
  closingBalancePaise: number;
  questCompleted: boolean;
  discretionarySpentPaise: number;
  hasImpulsePurchase: boolean;
}): string {
  const {
    dailySpentPaise,
    dailyLimitPaise,
    closingBalancePaise,
    questCompleted,
    discretionarySpentPaise,
    hasImpulsePurchase,
  } = params;

  if (closingBalancePaise < 0) {
    return '💀 CRITICAL DEBT: You spent beyond zero. Your wallet is currently on life support. Cease all operations!';
  }

  if (dailySpentPaise === 0) {
    return '🧘 ZERO-RUPEE MONK: Not a single rupee spent today. Tap water and sheer willpower carried you to victory!';
  }

  if (hasImpulsePurchase) {
    return '🛍️ IMPULSE BUYER DETECTED: You succumbed to the store temptation. Instant dopamine, delayed economic regret.';
  }

  if (discretionarySpentPaise > 0 && discretionarySpentPaise >= dailySpentPaise * 0.8) {
    return '🍰 LUXURY ENTHUSIAST: Over 80% of today was pure discretionary treats. The canteen economy thanks you for your service!';
  }

  if (dailySpentPaise > dailyLimitPaise * 1.5) {
    return '💸 BUDGET BREACH: You blew past your recommended daily runway. You are living like a millionaire on an intern budget!';
  }

  if (questCompleted && dailySpentPaise <= dailyLimitPaise) {
    return '🌟 FLAWLESS EXECUTION: Daily quest conquered and spending kept under budget. The college economy could not defeat you today!';
  }

  if (dailySpentPaise <= dailyLimitPaise) {
    return '✨ SOLID SURVIVAL: Kept spending within limits. Another day survived in the campus jungle.';
  }

  return '🎒 SURVIVED THE DAY: One step closer to allowance day. Stay vigilant, player!';
}
