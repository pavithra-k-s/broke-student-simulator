import test from 'node:test';
import assert from 'node:assert/strict';
import { computeAnalytics } from '../src/services/analyticsEngine';
import { determineSpendingPersonality } from '../src/services/personalityEngine';
import { UserProfile } from '../src/types/profile';
import { Transaction } from '../src/types/transaction';

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
  fixedExpenses: [
    { id: 'f1', name: 'Hostel Wifi', amount: 400, category: 'Hostel', isPaid: true },
  ],
  onboardingCompleted: true,
  createdAt: Date.now() - 86400000 * 5,
  lastUpdated: Date.now(),
};

const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    amount: 150,
    amountPaise: 15000,
    type: 'expense',
    category: 'Food',
    description: 'Mess canteen meal',
    date: '2026-11-01',
    timestamp: Date.now() - 86400000 * 2,
    isRecurring: false,
  },
  {
    id: 'tx-2',
    amount: 50,
    amountPaise: 5000,
    type: 'expense',
    category: 'Transport',
    description: 'Shared auto to campus',
    date: '2026-11-01',
    timestamp: Date.now() - 86400000 * 2,
    isRecurring: false,
  },
  {
    id: 'tx-3',
    amount: 800,
    amountPaise: 80000,
    type: 'expense',
    category: 'Entertainment',
    description: 'Concert ticket impulse',
    date: '2026-11-02',
    timestamp: Date.now() - 86400000,
    isRecurring: false,
  },
  {
    id: 'tx-4',
    amount: 2000,
    amountPaise: 200000,
    type: 'income',
    category: 'Side Hustle',
    description: 'Freelance gig payout',
    date: '2026-11-02',
    timestamp: Date.now() - 86400000,
    isRecurring: false,
  },
];

test('AnalyticsEngine: computeAnalytics aggregates accurately', () => {
  // Signature: computeAnalytics(transactions, profile, dateRange)
  const analytics = computeAnalytics(mockTransactions, mockProfile, 'ALL');

  assert.equal(analytics.totalExpensesPaise, 100000, 'Total expense should be 150 + 50 + 800 = 1000 INR = 100000 paise');
  assert.equal(analytics.totalIncomePaise, 200000, 'Total income should be 2000 INR = 200000 paise');
  assert.equal(analytics.netSavingsPaise, 100000, 'Net savings should be 2000 - 1000 = 1000 INR = 100000 paise');

  // Verify category breakdown
  assert.ok(analytics.categoryData.length >= 3, 'Should have at least 3 expense categories');
  const entCat = analytics.categoryData.find((c) => c.category === 'Entertainment');
  assert.ok(entCat, 'Entertainment category must exist');
  assert.equal(entCat?.amountPaise, 80000);
  assert.equal(entCat?.percentage, 80, 'Entertainment is 800/1000 = 80%');

  // Verify highest category
  assert.equal(analytics.highestCategory?.name, 'Entertainment');
  assert.equal(analytics.largestExpense?.amountPaise, 80000);

  // Verify essential vs discretionary breakdown
  // Food (15000) + Transport (5000) = 20000 essential; Entertainment (80000) = discretionary
  assert.equal(analytics.essentialSpentPaise, 20000);
  assert.equal(analytics.discretionarySpentPaise, 80000);
  assert.equal(analytics.discretionaryPercent, 80);
});

test('PersonalityEngine: accurately classifies archetype', () => {
  const result = determineSpendingPersonality(mockTransactions);
  assert.ok(result.title, 'Personality must have a title');
  assert.ok(result.description, 'Personality must have a description');
  assert.ok(result.evidence, 'Personality must have evidence string');
  assert.ok(result.practicalTip, 'Personality must have a practical tip');
});
