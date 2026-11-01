import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAchievements } from '../src/services/achievementEngine';
import { UserProfile } from '../src/types/profile';
import { Transaction } from '../src/types/transaction';
import { GamePlayState } from '../src/types/gameplay';

const mockProfile: UserProfile = {
  id: 'test-user',
  nickname: 'TestStudent',
  avatarId: 'student_1',
  monthlyAllowance: 5000,
  monthlyAllowancePaise: 500000,
  startingBalance: 3000,
  startingBalancePaise: 300000,
  daysUntilAllowance: 20,
  difficulty: 'NORMAL',
  monthlySavingsGoal: 500,
  monthlySavingsGoalPaise: 50000,
  essentialDailyBaseline: 150,
  essentialDailyBaselinePaise: 15000,
  fixedExpenses: [],
  onboardingCompleted: true,
  createdAt: Date.now(),
  lastUpdated: Date.now(),
};

test('AchievementEngine: unlocks first real transaction (FIRST_BLOOD)', () => {
  const initial = evaluateAchievements({
    existingState: {},
    profile: mockProfile,
    transactions: [],
  });

  const firstBloodBefore = initial.achievements.find((a) => a.id === 'FIRST_BLOOD');
  assert.equal(firstBloodBefore?.isUnlocked, false, 'FIRST_BLOOD should be locked before transactions');

  // Now simulate adding 1 expense
  const sampleTx: Transaction = {
    id: 'tx-1',
    amount: 100,
    amountPaise: 10000,
    type: 'expense',
    category: 'Food',
    description: 'Chai and bun maska',
    date: '2026-11-01',
    timestamp: Date.now(),
    isRecurring: false,
  };

  const afterTx = evaluateAchievements({
    existingState: initial.updatedState,
    profile: mockProfile,
    transactions: [sampleTx],
  });

  const firstBloodAfter = afterTx.achievements.find((a) => a.id === 'FIRST_BLOOD');
  assert.equal(firstBloodAfter?.isUnlocked, true, 'FIRST_BLOOD should unlock on first real expense');
  assert.ok(afterTx.newlyUnlocked.some((a) => a.id === 'FIRST_BLOOD'));
});

test('AchievementEngine: tracks game progression metrics and streak', () => {
  const mockGamePlay: Partial<GamePlayState> = {
    streak: 3,
    xp: 250,
    gameBalancePaise: 200000,
    simulatedDay: 8,
    purchasedProductIds: [],
    completedQuestIds: [],
    gameTransactions: [],
    dayHistory: [],
    resolvedEventIds: [],
  };

  const evalResult = evaluateAchievements({
    existingState: {},
    profile: mockProfile,
    transactions: [],
    gamePlay: mockGamePlay as GamePlayState,
  });

  const streakMachine = evalResult.achievements.find((a) => a.id === 'STREAK_MACHINE');
  assert.equal(streakMachine?.isUnlocked, true, 'STREAK_MACHINE should unlock when days survived >= 7');
});
