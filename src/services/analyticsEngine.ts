import { Transaction, ExpenseCategory } from '../types/transaction';
import { UserProfile } from '../types/profile';
import { formatINR, paiseToRupees } from '../utils/currency';

export interface CategorySpendingData {
  category: ExpenseCategory;
  amountPaise: number;
  amountRupees: number;
  percentage: number;
  color: string;
}

export interface DailyTrendPoint {
  date: string;
  displayDate: string;
  expensePaise: number;
  expenseRupees: number;
  incomePaise: number;
  incomeRupees: number;
}

export interface BudgetProgressItem {
  category: ExpenseCategory;
  spentPaise: number;
  limitPaise: number;
  remainingPaise: number;
  percentUsed: number;
  isOverBudget: boolean;
}

export interface AnalyticsReport {
  totalIncomePaise: number;
  totalExpensesPaise: number;
  netSavingsPaise: number;
  averageDailySpendPaise: number;
  highestCategory: { name: string; amountPaise: number; percentage: number } | null;
  largestExpense: { description: string; amountPaise: number; date: string } | null;
  projectedEndBalancePaise: number;
  essentialSpentPaise: number;
  discretionarySpentPaise: number;
  essentialPercent: number;
  discretionaryPercent: number;
  categoryData: CategorySpendingData[];
  trendData: DailyTrendPoint[];
  budgetProgress: BudgetProgressItem[];
  insights: string[];
  hasEnoughData: boolean;
}

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#FFC857',          // Amber
  Transport: '#60A5FA',     // Blue
  Education: '#C8FF70',     // Neon Lime
  Hostel: '#B8A5FF',        // Lavender
  Shopping: '#F472B6',       // Pink
  Entertainment: '#FF657A',  // Danger Red
  'Personal Care': '#34D399',// Emerald
  Subscriptions: '#A78BFA',  // Purple
  Other: '#9CA3AF',          // Gray
};

export const ESSENTIAL_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Education',
  'Hostel',
];

export function computeAnalytics(
  transactions: Transaction[],
  profile: UserProfile | null,
  dateRange: '7D' | '30D' | 'ALL' = 'ALL'
): AnalyticsReport {
  // Filter transactions by date range
  const now = Date.now();
  const filteredTx = transactions.filter((tx) => {
    if (dateRange === 'ALL') return true;
    const txTime = new Date(tx.date).getTime();
    const daysAgo = (now - txTime) / (1000 * 60 * 60 * 24);
    if (dateRange === '7D') return daysAgo <= 7;
    if (dateRange === '30D') return daysAgo <= 30;
    return true;
  });

  const expenses = filteredTx.filter((t) => t.type === 'expense');
  const incomes = filteredTx.filter((t) => t.type === 'income');

  const totalIncomePaise = incomes.reduce((s, t) => s + t.amountPaise, 0);
  const totalExpensesPaise = expenses.reduce((s, t) => s + t.amountPaise, 0);
  const netSavingsPaise = totalIncomePaise - totalExpensesPaise;

  // 1. Category Spending breakdown
  const categoryMap: Record<ExpenseCategory, number> = {
    Food: 0,
    Transport: 0,
    Education: 0,
    Hostel: 0,
    Shopping: 0,
    Entertainment: 0,
    'Personal Care': 0,
    Subscriptions: 0,
    Other: 0,
  };

  for (const exp of expenses) {
    if (categoryMap[exp.category as ExpenseCategory] !== undefined) {
      categoryMap[exp.category as ExpenseCategory] += exp.amountPaise;
    } else {
      categoryMap.Other += exp.amountPaise;
    }
  }

  const categoryData: CategorySpendingData[] = (Object.keys(categoryMap) as ExpenseCategory[])
    .map((cat) => {
      const amountPaise = categoryMap[cat];
      const percentage =
        totalExpensesPaise > 0 ? Math.round((amountPaise / totalExpensesPaise) * 100) : 0;
      return {
        category: cat,
        amountPaise,
        amountRupees: paiseToRupees(amountPaise),
        percentage,
        color: CATEGORY_COLORS[cat],
      };
    })
    .filter((c) => c.amountPaise > 0)
    .sort((a, b) => b.amountPaise - a.amountPaise);

  // Highest Category
  const highestCategory =
    categoryData.length > 0
      ? {
          name: categoryData[0].category,
          amountPaise: categoryData[0].amountPaise,
          percentage: categoryData[0].percentage,
        }
      : null;

  // Largest individual expense
  let largestExpense: { description: string; amountPaise: number; date: string } | null = null;
  if (expenses.length > 0) {
    const sortedExpenses = [...expenses].sort((a, b) => b.amountPaise - a.amountPaise);
    largestExpense = {
      description: sortedExpenses[0].description,
      amountPaise: sortedExpenses[0].amountPaise,
      date: sortedExpenses[0].date,
    };
  }

  // 2. Essential vs Discretionary
  let essentialSpentPaise = 0;
  let discretionarySpentPaise = 0;

  for (const exp of expenses) {
    if (ESSENTIAL_CATEGORIES.includes(exp.category as ExpenseCategory)) {
      essentialSpentPaise += exp.amountPaise;
    } else {
      discretionarySpentPaise += exp.amountPaise;
    }
  }

  const essentialPercent =
    totalExpensesPaise > 0 ? Math.round((essentialSpentPaise / totalExpensesPaise) * 100) : 0;
  const discretionaryPercent =
    totalExpensesPaise > 0 ? 100 - essentialPercent : 0;

  // 3. Daily Trend Points
  const trendMap: Record<string, { expensePaise: number; incomePaise: number }> = {};
  for (const tx of filteredTx) {
    if (!trendMap[tx.date]) {
      trendMap[tx.date] = { expensePaise: 0, incomePaise: 0 };
    }
    if (tx.type === 'expense') {
      trendMap[tx.date].expensePaise += tx.amountPaise;
    } else {
      trendMap[tx.date].incomePaise += tx.amountPaise;
    }
  }

  const sortedDates = Object.keys(trendMap).sort();
  const trendData: DailyTrendPoint[] = sortedDates.map((date) => {
    // Format "YYYY-MM-DD" -> "DD MMM"
    const parts = date.split('-');
    const displayDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : date;
    const item = trendMap[date];
    return {
      date,
      displayDate,
      expensePaise: item.expensePaise,
      expenseRupees: paiseToRupees(item.expensePaise),
      incomePaise: item.incomePaise,
      incomeRupees: paiseToRupees(item.incomePaise),
    };
  });

  // 4. Average Daily Spend & Projected Balance
  const uniqueDays = Math.max(1, Object.keys(trendMap).length);
  const averageDailySpendPaise = Math.round(totalExpensesPaise / uniqueDays);

  const daysLeft = profile ? profile.daysUntilAllowance : 15;
  const startingBal = profile ? profile.startingBalancePaise : 0;
  const currentAvailable = startingBal + totalIncomePaise - totalExpensesPaise;
  const projectedSpend = averageDailySpendPaise * daysLeft;
  const projectedEndBalancePaise = currentAvailable - projectedSpend;

  // 5. Monthly Budget Progress
  // Pro-rate category limits based on monthly allowance and standard student proportions
  const monthlyAllowance = profile?.monthlyAllowancePaise || 600000;
  const categoryProportions: Partial<Record<ExpenseCategory, number>> = {
    Food: 0.35,          // 35%
    Hostel: 0.25,        // 25%
    Transport: 0.10,     // 10%
    Education: 0.10,     // 10%
    Shopping: 0.05,      // 5%
    Entertainment: 0.05, // 5%
    'Personal Care': 0.05,
    Subscriptions: 0.03,
    Other: 0.02,
  };

  const budgetProgress: BudgetProgressItem[] = (Object.keys(categoryMap) as ExpenseCategory[])
    .map((cat) => {
      const spentPaise = categoryMap[cat];
      const prop = categoryProportions[cat] || 0.05;
      const limitPaise = Math.round(monthlyAllowance * prop);
      const remainingPaise = limitPaise - spentPaise;
      const percentUsed = limitPaise > 0 ? Math.min(200, Math.round((spentPaise / limitPaise) * 100)) : 0;
      return {
        category: cat,
        spentPaise,
        limitPaise,
        remainingPaise,
        percentUsed,
        isOverBudget: spentPaise > limitPaise,
      };
    })
    .filter((b) => b.spentPaise > 0 || b.limitPaise > 0);

  // 6. Dynamic Financial Insights
  const insights: string[] = [];
  const hasEnoughData = transactions.length >= 2;

  if (hasEnoughData) {
    if (highestCategory) {
      insights.push(`Your largest spending category is ${highestCategory.name}, accounting for ${highestCategory.percentage}% of all expenses.`);
    }

    if (categoryMap.Food > 0 && categoryMap.Transport > 0) {
      if (categoryMap.Food > categoryMap.Transport) {
        const ratio = Math.round(((categoryMap.Food - categoryMap.Transport) / categoryMap.Transport) * 100);
        insights.push(`You spent ${ratio}% more on Food than on Transport.`);
      }
    }

    if (discretionaryPercent > 45) {
      insights.push(`Discretionary spending is high at ${discretionaryPercent}% of total expenses. Consider tightening entertainment & shopping.`);
    } else {
      insights.push(`Disciplined financial health! ${essentialPercent}% of your spending went towards essentials.`);
    }

    if (projectedEndBalancePaise < 0) {
      insights.push(`Deficit warning: At current burn rate (${formatINR(averageDailySpendPaise)}/day), your projected end-of-period balance is ${formatINR(projectedEndBalancePaise)}.`);
    } else {
      insights.push(`Safe trajectory: Projected remaining balance at next allowance is ${formatINR(projectedEndBalancePaise)}.`);
    }
  }

  return {
    totalIncomePaise,
    totalExpensesPaise,
    netSavingsPaise,
    averageDailySpendPaise,
    highestCategory,
    largestExpense,
    projectedEndBalancePaise,
    essentialSpentPaise,
    discretionarySpentPaise,
    essentialPercent,
    discretionaryPercent,
    categoryData,
    trendData,
    budgetProgress,
    insights,
    hasEnoughData,
  };
}

