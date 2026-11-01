import test from 'node:test';
import assert from 'node:assert/strict';

import {
  initializeGamePlayState,
  calculateGameDailyLimit,
  generateDayEndCommentary,
} from '../src/services/gameEngine.ts';

import { selectDailyEvent, findChoice } from '../src/services/eventEngine.ts';
import { calculateLevelInfo, getTotalXpForLevel } from '../src/services/xpEngine.ts';
import { evaluateQuestCondition } from '../src/services/questEngine.ts';
import { getQuestForDay, QUEST_TEMPLATES } from '../src/data/quests.ts';
import { GAME_EVENTS } from '../src/data/events.ts';
import { INITIAL_STORE_PRODUCTS } from '../src/data/products.ts';
import { rupeesToPaise } from '../src/utils/currency.ts';
import { UserProfile } from '../src/types/profile.ts';

const mockProfile: UserProfile = {
  nickname: 'Speedy',
  startingBalancePaise: rupeesToPaise(2000), // ₹2,000
  monthlyAllowancePaise: rupeesToPaise(5000), // ₹5,000
  daysUntilAllowance: 10,
  fixedExpenses: [],
  dailyEssentialEstimatePaise: 15000,
  savingsGoalPaise: 50000,
  difficulty: 'NORMAL',
  onboardingCompleted: true,
  createdAt: Date.now(),
  lastUpdated: Date.now(),
};

test('Game Engine: Initialization isolates game balance to profile starting cash', () => {
  const state = initializeGamePlayState(mockProfile);
  assert.equal(state.simulatedDay, 1);
  assert.equal(state.gameBalancePaise, rupeesToPaise(2000));
  assert.equal(state.openingBalancePaise, rupeesToPaise(2000));
  assert.equal(state.dailySpentPaise, 0);
  assert.equal(state.level, 1);
  assert.equal(state.streak, 0);
  assert.equal(state.gameTransactions.length, 0);
  assert.ok(state.currentQuest);
  assert.ok(state.currentEvent);
});

test('Game Engine: Daily limit formula for gameplay', () => {
  // ₹2,000 / 10 days = ₹200/day = 20,000 paise
  const limit = calculateGameDailyLimit(rupeesToPaise(2000), 10);
  assert.equal(limit, 20000);

  // Negative balance returns 0 daily limit
  assert.equal(calculateGameDailyLimit(-5000, 5), 0);

  // Zero balance returns 0
  assert.equal(calculateGameDailyLimit(0, 5), 0);
});

test('Event Engine: Selection respects difficulty filters and avoids recent repeats', () => {
  const hardEvent = selectDailyEvent('HARD', ['evt_birthday_trap'], 1);
  assert.ok(hardEvent);
  assert.ok(hardEvent.difficultyAllowed.includes('HARD'));

  // Ensure resolved event is not immediately selected
  const newEvent = selectDailyEvent('NORMAL', [hardEvent.id], 2);
  assert.notEqual(newEvent.id, hardEvent.id);
});

test('Event Engine: Choice consequence calculation', () => {
  const event = GAME_EVENTS.find((e) => e.id === 'evt_birthday_trap')!;
  assert.ok(event);

  // Full dinner choice: ₹500 cost, +10 XP
  const fullDinner = findChoice(event, 'c1')!;
  assert.equal(fullDinner.costPaise, rupeesToPaise(500));
  assert.equal(fullDinner.xpReward, 10);

  // Decline choice: ₹0 cost, +30 XP
  const decline = findChoice(event, 'c4')!;
  assert.equal(decline.costPaise, 0);
  assert.equal(decline.xpReward, 30);
});

test('Store Products: Products have valid integer paise prices and categories', () => {
  assert.ok(INITIAL_STORE_PRODUCTS.length >= 15);

  const maggi = INITIAL_STORE_PRODUCTS.find((p) => p.id === 'prod_maggi');
  assert.ok(maggi);
  assert.equal(maggi.pricePaise, rupeesToPaise(40));

  const freeWalk = INITIAL_STORE_PRODUCTS.find((p) => p.id === 'prod_campus_walk');
  assert.ok(freeWalk);
  assert.equal(freeWalk.pricePaise, 0);
});

test('Quest Engine: Evaluates completion conditions accurately', () => {
  const budgetQuest = QUEST_TEMPLATES.find((q) => q.conditionType === 'SPEND_LESS_THAN_BUDGET')!;
  const dailyQuest = { ...budgetQuest, isCompleted: false, xpClaimed: false };

  // When spent is less than daily limit, quest is complete
  const passed = evaluateQuestCondition(dailyQuest, {
    dailySpentPaise: rupeesToPaise(50),
    discretionarySpentPaise: 0,
    dailyBudgetLimitPaise: rupeesToPaise(100),
    closingBalancePaise: rupeesToPaise(1950),
    hasFreePurchaseToday: false,
    hasImpulsePurchaseToday: false,
    hasCafePurchaseToday: false,
    choseFrugalChoiceToday: true,
  });
  assert.equal(passed, true);

  // When spent exceeds daily limit, quest fails
  const failed = evaluateQuestCondition(dailyQuest, {
    dailySpentPaise: rupeesToPaise(250),
    discretionarySpentPaise: rupeesToPaise(250),
    dailyBudgetLimitPaise: rupeesToPaise(100),
    closingBalancePaise: rupeesToPaise(1750),
    hasFreePurchaseToday: false,
    hasImpulsePurchaseToday: true,
    hasCafePurchaseToday: false,
    choseFrugalChoiceToday: false,
  });
  assert.equal(failed, false);
});

test('XP Progression Engine: Correct levels and thresholds', () => {
  // Level 1 at 0 XP
  const l1 = calculateLevelInfo(0);
  assert.equal(l1.level, 1);
  assert.equal(l1.title, 'Frugal Fresher');

  // Level 2 at 100 XP
  const l2 = calculateLevelInfo(100);
  assert.equal(l2.level, 2);
  assert.equal(l2.title, 'Hostel Scavenger');

  // Level 3 at 250 XP
  const l3 = calculateLevelInfo(250);
  assert.equal(l3.level, 3);
  assert.equal(l3.title, 'Kettle Chef');
});

test('Game Engine: Day-End commentary accurately matches outcome', () => {
  // Debt outcome
  const debtComment = generateDayEndCommentary({
    dailySpentPaise: 50000,
    dailyLimitPaise: 20000,
    closingBalancePaise: -10000,
    questCompleted: false,
    discretionarySpentPaise: 50000,
    hasImpulsePurchase: false,
  });
  assert.ok(debtComment.includes('CRITICAL DEBT'));

  // Zero rupee monk
  const monkComment = generateDayEndCommentary({
    dailySpentPaise: 0,
    dailyLimitPaise: 20000,
    closingBalancePaise: 200000,
    questCompleted: true,
    discretionarySpentPaise: 0,
    hasImpulsePurchase: false,
  });
  assert.ok(monkComment.includes('ZERO-RUPEE MONK'));
});
