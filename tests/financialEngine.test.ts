import test from 'node:test';
import assert from 'node:assert/strict';

import {
  rupeesToPaise,
  paiseToRupees,
  formatINR,
  parseInputToPaise,
} from '../src/utils/currency.ts';

import {
  validateOnboarding,
  validateTransaction,
} from '../src/utils/validation.ts';

import { calculateFinancialSummary } from '../src/services/budgetEngine.ts';

test('Currency Utility: Paise & Rupee conversion', () => {
  assert.equal(rupeesToPaise(100), 10000);
  assert.equal(rupeesToPaise(1.5), 150);
  assert.equal(rupeesToPaise(0), 0);
  assert.equal(paiseToRupees(150), 1.5);
  assert.equal(paiseToRupees(10000), 100);
});

test('Currency Utility: INR formatting', () => {
  assert.equal(formatINR(150000), '₹1,500');
  assert.equal(formatINR(0), '₹0');
  assert.equal(formatINR(-45000), '-₹450');
  assert.equal(formatINR(5000, { showSign: true }), '+₹50');
  assert.equal(formatINR(25050), '₹250.50');
  assert.equal(formatINR(-125075), '-₹1,250.75');
});

test('Currency Utility: parseInputToPaise', () => {
  assert.equal(parseInputToPaise('100'), 10000);
  assert.equal(parseInputToPaise('₹2,500.50'), 250050);
  assert.equal(parseInputToPaise('0'), 0);
  assert.equal(parseInputToPaise('invalid'), 0);
});

test('Validation: Onboarding input rules', () => {
  // Valid setup with ₹0 starting balance (valid broke student)
  const valid = validateOnboarding({
    nickname: 'PlayerOne',
    startingBalance: 0,
    monthlyAllowance: 5000,
    daysUntilAllowance: 15,
    dailyEssentialEstimate: 100,
    savingsGoal: 500,
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);

  // Invalid: negative starting balance, empty name
  const invalid = validateOnboarding({
    nickname: '',
    startingBalance: -100,
    monthlyAllowance: -50,
    daysUntilAllowance: 0,
    dailyEssentialEstimate: -50,
    savingsGoal: -10,
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.nickname);
  assert.ok(invalid.errors.startingBalance);
  assert.ok(invalid.errors.monthlyAllowance);
  assert.ok(invalid.errors.daysUntilAllowance);
  assert.ok(invalid.errors.dailyEssentialEstimate);
  assert.ok(invalid.errors.savingsGoal);
});

test('Validation: Transaction input rules', () => {
  const valid = validateTransaction({
    description: 'Chai & Biscuit',
    amount: 25,
    category: 'Food',
    date: '2026-11-02',
  });
  assert.equal(valid.isValid, true);

  const invalid = validateTransaction({
    description: '',
    amount: 0,
    category: '',
    date: '',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.description);
  assert.ok(invalid.errors.amount);
  assert.ok(invalid.errors.category);
  assert.ok(invalid.errors.date);

  const negativeAmount = validateTransaction({
    description: 'Negative',
    amount: -100,
    category: 'Food',
    date: '2026-11-02',
  });
  assert.equal(negativeAmount.isValid, false);
  assert.ok(negativeAmount.errors.amount);
});

test('Budget Engine: Correct calculation of available balance and daily limit', () => {
  const profile = {
    nickname: 'Neo',
    startingBalancePaise: 200000, // ₹2,000
    monthlyAllowancePaise: 600000, // ₹6,000
    daysUntilAllowance: 10,
    fixedExpenses: [
      { id: '1', name: 'Wifi', amountPaise: 50000, category: 'Fixed', isPaid: false }, // ₹500
    ],
    dailyEssentialEstimatePaise: 15000,
    savingsGoalPaise: 50000,
    difficulty: 'NORMAL' as const,
    onboardingCompleted: true,
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  const transactions = [
    {
      id: 'tx1',
      type: 'income' as const,
      description: 'Scholarship pocket cash',
      amountPaise: 100000, // +₹1,000
      category: 'Scholarship' as const,
      date: '2026-11-01',
      createdAt: 1,
    },
    {
      id: 'tx2',
      type: 'expense' as const,
      description: 'Canteen Burger',
      amountPaise: 30000, // -₹300
      category: 'Food' as const,
      date: '2026-11-02',
      createdAt: 2,
    },
  ];

  const summary = calculateFinancialSummary(profile, transactions);

  // Available = Starting (2000) + Inflow (1000) - Outflow (300) = ₹2,700 (270,000 paise)
  assert.equal(summary.availableBalancePaise, 270000);
  assert.equal(summary.totalIncomePaise, 100000);
  assert.equal(summary.totalExpensesPaise, 30000);
  assert.equal(summary.unpaidFixedExpensesPaise, 50000);

  // Discretionary pool = ₹2,700 - ₹500 (unpaid fixed) = ₹2,200
  // Daily limit = ₹2,200 / 10 days = ₹220/day (22,000 paise)
  assert.equal(summary.dailySpendingLimitPaise, 22000);
  assert.equal(summary.daysUntilAllowance, 10);
  assert.equal(summary.status.tone, 'optimistic');
});

test('Budget Engine: Paid vs Unpaid fixed expenses do not double count', () => {
  const profile = {
    nickname: 'Anya',
    startingBalancePaise: 100000, // ₹1,000
    monthlyAllowancePaise: 500000,
    daysUntilAllowance: 5,
    fixedExpenses: [
      { id: '1', name: 'Hostel Rent', amountPaise: 40000, category: 'Hostel', isPaid: true }, // marked paid
      { id: '2', name: 'Wifi Bill', amountPaise: 20000, category: 'Wifi', isPaid: false }, // pending
    ],
    dailyEssentialEstimatePaise: 10000,
    savingsGoalPaise: 0,
    difficulty: 'EASY' as const,
    onboardingCompleted: true,
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  const summary = calculateFinancialSummary(profile, []);
  // Only unpaid (20000 paise) should be deducted from discretionary pool
  assert.equal(summary.totalFixedExpensesPaise, 60000);
  assert.equal(summary.unpaidFixedExpensesPaise, 20000);

  // Available = ₹1,000. Pool = ₹1,000 - ₹200 = ₹800. Daily = ₹800 / 5 = ₹160/day
  assert.equal(summary.dailySpendingLimitPaise, 16000);
});

test('Budget Engine: Handles negative / deficit balance properly', () => {
  const profile = {
    nickname: 'BrokeGuy',
    startingBalancePaise: 0, // ₹0 starting balance
    monthlyAllowancePaise: 0,
    daysUntilAllowance: 5,
    fixedExpenses: [],
    dailyEssentialEstimatePaise: 0,
    savingsGoalPaise: 0,
    difficulty: 'HARD' as const,
    onboardingCompleted: true,
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  const transactions = [
    {
      id: 'tx1',
      type: 'expense' as const,
      description: 'Emergency medicine',
      amountPaise: 50000, // -₹500
      category: 'Other' as const,
      date: '2026-11-02',
      createdAt: 1,
    },
  ];

  const summary = calculateFinancialSummary(profile, transactions);
  assert.equal(summary.availableBalancePaise, -50000);
  assert.equal(summary.status.tone, 'critical');
  assert.equal(summary.status.title, 'WALLET IN CRITICAL CONDITION');
});

test('Budget Engine: Status thresholds match gameplay criteria', () => {
  const baseProfile = {
    nickname: 'StatusCheck',
    startingBalancePaise: 0,
    monthlyAllowancePaise: 0,
    daysUntilAllowance: 10,
    fixedExpenses: [],
    dailyEssentialEstimatePaise: 0,
    savingsGoalPaise: 0,
    difficulty: 'NORMAL' as const,
    onboardingCompleted: true,
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  // 1. Critical Debt: available < 0
  const summaryDebt = calculateFinancialSummary(baseProfile, [
    { id: '1', type: 'expense', description: 'Debt', amountPaise: 100, category: 'Other', date: '2026-11-02', createdAt: 1 },
  ]);
  assert.equal(summaryDebt.status.title, 'WALLET IN CRITICAL CONDITION');

  // 2. Air & Wifi: daily limit <= ₹50 (<= 5,000 paise)
  // Balance = ₹400 for 10 days = ₹40/day
  const summaryAir = calculateFinancialSummary({ ...baseProfile, startingBalancePaise: 40000 }, []);
  assert.equal(summaryAir.status.title, 'SURVIVING ON AIR & WIFI');

  // 3. Barely Surviving: daily limit <= ₹150 (<= 15,000 paise)
  // Balance = ₹1,200 for 10 days = ₹120/day
  const summaryBarely = calculateFinancialSummary({ ...baseProfile, startingBalancePaise: 120000 }, []);
  assert.equal(summaryBarely.status.title, 'BARELY SURVIVING');

  // 4. Broke But Optimistic: daily limit <= ₹450 (<= 45,000 paise)
  // Balance = ₹3,000 for 10 days = ₹300/day
  const summaryOpt = calculateFinancialSummary({ ...baseProfile, startingBalancePaise: 300000 }, []);
  assert.equal(summaryOpt.status.title, 'BROKE BUT OPTIMISTIC');

  // 5. Financially Stable: daily limit > ₹450
  // Balance = ₹6,000 for 10 days = ₹600/day
  const summaryStable = calculateFinancialSummary({ ...baseProfile, startingBalancePaise: 600000 }, []);
  assert.equal(summaryStable.status.title, 'FINANCIALLY STABLE (SUSPICIOUS)');
});
