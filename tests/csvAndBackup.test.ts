import test from 'node:test';
import assert from 'node:assert/strict';
import { exportTransactionsToCSV, parseCSVToTransactions } from '../src/utils/csv';
import { validateAndParseBackupJSON } from '../src/services/backupEngine';
import { paiseToRupees } from '../src/utils/currency';
import { Transaction } from '../src/types/transaction';
import { GameSaveData } from '../src/types/game';

test('CSV Utils: round-trip exports and parses transactions accurately', () => {
  const transactions: Transaction[] = [
    {
      id: 'tx-101',
      date: '2026-11-01',
      type: 'expense',
      category: 'Food',
      amountPaise: 12000,
      description: 'Hostel Night Canteen',
      createdAt: Date.now(),
    },
    {
      id: 'tx-102',
      date: '2026-11-02',
      type: 'income',
      category: 'Allowance',
      amountPaise: 150000,
      description: 'Care package from parents',
      createdAt: Date.now(),
    },
  ];

  const csvString = exportTransactionsToCSV(transactions);
  assert.ok(csvString.includes('Hostel Night Canteen'));
  assert.ok(csvString.includes('120'));

  const parsed = parseCSVToTransactions(csvString);
  assert.equal(parsed.success, true);
  assert.equal(parsed.imported.length, 2);
  assert.equal(paiseToRupees(parsed.imported[0].amountPaise), 120);
  assert.equal(parsed.imported[0].amountPaise, 12000);
  assert.equal(parsed.imported[0].category, 'Food');
  assert.equal(parsed.imported[1].type, 'income');
  assert.equal(paiseToRupees(parsed.imported[1].amountPaise), 1500);
});

test('BackupEngine: validates and parses valid GameSaveData JSON', () => {
  const mockSave: GameSaveData = {
    version: '1.0.0',
    profile: {
      id: 'test-backup',
      nickname: 'BackupScholar',
      avatarId: 'student_1',
      monthlyAllowance: 4000,
      monthlyAllowancePaise: 400000,
      startingBalance: 2000,
      startingBalancePaise: 200000,
      daysUntilAllowance: 15,
      difficulty: 'NORMAL',
      monthlySavingsGoal: 0,
      monthlySavingsGoalPaise: 0,
      essentialDailyBaseline: 150,
      essentialDailyBaselinePaise: 15000,
      fixedExpenses: [],
      onboardingCompleted: true,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    },
    transactions: [],
    settings: {
      soundEffects: true,
      music: false,
      crtEffect: true,
      animations: true,
      currency: 'INR',
    },
  };

  const jsonStr = JSON.stringify(mockSave);
  const result = validateAndParseBackupJSON(jsonStr);

  assert.equal(result.isValid, true);
  assert.equal(result.data?.profile?.nickname, 'BackupScholar');
  assert.equal(result.data?.version, '1.0.0');

  // Test invalid JSON string
  const failResult = validateAndParseBackupJSON('invalid-json{{{');
  assert.equal(failResult.isValid, false);
  assert.ok(failResult.error?.includes('Failed to parse JSON'));
});
