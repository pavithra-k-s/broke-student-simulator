import { Transaction } from '../types/transaction';
import { UserProfile } from '../types/profile';
import { FinancialSummary, FinancialStatus } from '../types/game';
import { formatINR } from '../utils/currency';

/**
 * Core Financial Engine for Broke Student Simulator.
 * Computes balances, daily limits, survival statuses, and explanations using integer paise.
 */

export function calculateFinancialSummary(
  profile: UserProfile | null,
  transactions: Transaction[]
): FinancialSummary {
  if (!profile) {
    return {
      startingBalancePaise: 0,
      totalIncomePaise: 0,
      totalExpensesPaise: 0,
      availableBalancePaise: 0,
      totalFixedExpensesPaise: 0,
      unpaidFixedExpensesPaise: 0,
      daysUntilAllowance: 1,
      dailySpendingLimitPaise: 0,
      adjustedDailyLimitWithSavingsPaise: 0,
      savingsGoalPaise: 0,
      savingsProgressPercent: 0,
      status: {
        title: 'UNINITIALIZED',
        subtitle: 'Please complete character setup to begin.',
        tone: 'normal' as any,
        badgeColor: 'bg-retro-panel-light text-cream',
        emoji: '👾',
      },
      explanation: 'No profile configured.',
    };
  }

  const startingBalancePaise = profile.startingBalancePaise || 0;

  // Calculate totals from transactions
  let totalIncomePaise = 0;
  let totalExpensesPaise = 0;

  for (const tx of transactions) {
    if (tx.type === 'income') {
      totalIncomePaise += tx.amountPaise;
    } else if (tx.type === 'expense') {
      totalExpensesPaise += tx.amountPaise;
    }
  }

  // Core formula: Available balance = Starting balance + Total Income - Total Expenses
  const availableBalancePaise = startingBalancePaise + totalIncomePaise - totalExpensesPaise;

  // Track fixed expenses
  const totalFixedExpensesPaise = profile.fixedExpenses.reduce(
    (sum, item) => sum + (item.amountPaise || 0),
    0
  );

  // Unpaid fixed expenses (those not flagged as paid)
  const unpaidFixedExpensesPaise = profile.fixedExpenses
    .filter((item) => !item.isPaid)
    .reduce((sum, item) => sum + (item.amountPaise || 0), 0);

  const daysUntilAllowance = Math.max(1, profile.daysUntilAllowance || 1);

  // Daily budget calculations
  // Discretionary budget left = available balance minus pending fixed bills
  const poolForDiscretionary = availableBalancePaise - unpaidFixedExpensesPaise;

  // Daily limit in paise
  const dailySpendingLimitPaise = Math.floor(poolForDiscretionary / daysUntilAllowance);

  // If user has a savings goal, calculate adjusted daily limit keeping savings aside
  const savingsGoalPaise = profile.savingsGoalPaise || 0;
  const poolAfterSavings = poolForDiscretionary - savingsGoalPaise;
  const adjustedDailyLimitWithSavingsPaise = Math.floor(poolAfterSavings / daysUntilAllowance);

  // Calculate savings progress (based on positive net margin vs goal)
  let savingsProgressPercent = 0;
  if (savingsGoalPaise > 0) {
    const netCurrent = Math.max(0, availableBalancePaise - unpaidFixedExpensesPaise);
    savingsProgressPercent = Math.min(100, Math.max(0, Math.round((netCurrent / savingsGoalPaise) * 100)));
  }

  // Derive dynamic financial status label based on actual numbers
  const status = deriveFinancialStatus(availableBalancePaise, dailySpendingLimitPaise, daysUntilAllowance);

  // Clear explanation for player
  const explanation = generateBudgetExplanation({
    available: availableBalancePaise,
    unpaidFixed: unpaidFixedExpensesPaise,
    days: daysUntilAllowance,
    dailyLimit: dailySpendingLimitPaise,
    savingsGoal: savingsGoalPaise,
  });

  return {
    startingBalancePaise,
    totalIncomePaise,
    totalExpensesPaise,
    availableBalancePaise,
    totalFixedExpensesPaise,
    unpaidFixedExpensesPaise,
    daysUntilAllowance,
    dailySpendingLimitPaise,
    adjustedDailyLimitWithSavingsPaise,
    savingsGoalPaise,
    savingsProgressPercent,
    status,
    explanation,
  };
}

/**
 * Deterministically computes the financial status badge and witty subtitle
 */
function deriveFinancialStatus(
  availablePaise: number,
  dailyLimitPaise: number,
  daysUntilAllowance: number
): FinancialStatus {
  // Negative balance: Critical debt
  if (availablePaise < 0) {
    return {
      title: 'WALLET IN CRITICAL CONDITION',
      subtitle: 'Flatlining! You are currently in debt. Avoid cafeteria canteen at all costs.',
      tone: 'critical',
      badgeColor: 'border-danger-red bg-danger-red/20 text-danger-red',
      emoji: '💀',
    };
  }

  // Daily limit under ₹50 (5,000 paise)
  if (dailyLimitPaise <= 5000) {
    return {
      title: 'SURVIVING ON AIR & WIFI',
      subtitle: `Under ${formatINR(5000)}/day for the next ${daysUntilAllowance} days. Maggi noodle rationing is in effect.`,
      tone: 'critical',
      badgeColor: 'border-danger-red bg-danger-red/10 text-danger-red',
      emoji: '🍜',
    };
  }

  // Daily limit under ₹150 (15,000 paise)
  if (dailyLimitPaise <= 15000) {
    return {
      title: 'BARELY SURVIVING',
      subtitle: `One impulsive Swiggy or iced coffee order away from economic collapse.`,
      tone: 'warning',
      badgeColor: 'border-amber bg-amber/20 text-amber',
      emoji: '⚡',
    };
  }

  // Daily limit between ₹150 and ₹450
  if (dailyLimitPaise <= 45000) {
    return {
      title: 'BROKE BUT OPTIMISTIC',
      subtitle: 'Decent daily runway. Stick to your budget and you might survive the semester.',
      tone: 'optimistic',
      badgeColor: 'border-lavender bg-lavender/20 text-lavender',
      emoji: '🎒',
    };
  }

  // Daily limit over ₹450
  return {
    title: 'FINANCIALLY STABLE (SUSPICIOUS)',
    subtitle: 'Healthy reserves detected! Did you just receive your pocket money or win a hackathon?',
    tone: 'suspicious',
    badgeColor: 'border-neon-lime bg-neon-lime/20 text-neon-lime',
    emoji: '🧐',
  };
}

function generateBudgetExplanation(params: {
  available: number;
  unpaidFixed: number;
  days: number;
  dailyLimit: number;
  savingsGoal: number;
}): string {
  const { available, unpaidFixed, days, dailyLimit, savingsGoal } = params;
  const availStr = formatINR(available);
  const fixedStr = formatINR(unpaidFixed);
  const limitStr = formatINR(dailyLimit);

  if (available <= 0) {
    return `Deficit alert: Your balance is ${availStr}. No daily spending budget available until new income is added.`;
  }

  if (unpaidFixed > 0) {
    return `Calculation: (${availStr} available - ${fixedStr} reserved for unpaid fixed bills) ÷ ${days} days until allowance = ${limitStr} safe daily allowance.`;
  }

  if (savingsGoal > 0) {
    return `Calculation: ${availStr} available ÷ ${days} days until allowance = ${limitStr}/day (Total budget before savings goal deduction).`;
  }

  return `Calculation: ${availStr} available ÷ ${days} days until allowance = ${limitStr} recommended daily limit.`;
}

