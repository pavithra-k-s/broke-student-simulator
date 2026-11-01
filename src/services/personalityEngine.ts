import { Transaction, ExpenseCategory } from '../types/transaction';
import { ESSENTIAL_CATEGORIES } from './analyticsEngine';

export interface PersonalityReport {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
  description: string;
  evidence: string;
  practicalTip: string;
  badgeColor: string;
  hasEnoughData: boolean;
}

export function determineSpendingPersonality(transactions: Transaction[]): PersonalityReport {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');

  if (expenses.length < 3) {
    return {
      id: 'INSUFFICIENT_DATA',
      title: 'MYSTERIOUS UNKNOWN',
      emoji: '🕵️',
      subtitle: 'Data Incomplete',
      description: 'Not enough financial evidence to expose your spending personality yet. Keep recording transactions.',
      evidence: 'Requires at least 3 logged expense transactions to formulate a personality profile.',
      practicalTip: 'Log daily snacks, bus fares, and supplies to unlock your financial diagnosis.',
      badgeColor: 'border-retro-border bg-retro-panel-light text-cream-muted',
      hasEnoughData: false,
    };
  }

  const totalExpensePaise = expenses.reduce((s, t) => s + t.amountPaise, 0);
  const totalIncomePaise = incomes.reduce((s, t) => s + t.amountPaise, 0);

  // Category counts and amounts
  const categoryTotals: Record<ExpenseCategory, number> = {
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
    if (categoryTotals[exp.category as ExpenseCategory] !== undefined) {
      categoryTotals[exp.category as ExpenseCategory] += exp.amountPaise;
    } else {
      categoryTotals.Other += exp.amountPaise;
    }
  }

  let essentialPaise = 0;
  for (const exp of expenses) {
    if (ESSENTIAL_CATEGORIES.includes(exp.category as ExpenseCategory)) {
      essentialPaise += exp.amountPaise;
    }
  }

  const foodPercent = totalExpensePaise > 0 ? (categoryTotals.Food / totalExpensePaise) * 100 : 0;
  const shoppingPercent = totalExpensePaise > 0 ? (categoryTotals.Shopping / totalExpensePaise) * 100 : 0;
  const entertainmentPercent = totalExpensePaise > 0 ? (categoryTotals.Entertainment / totalExpensePaise) * 100 : 0;
  const essentialPercent = totalExpensePaise > 0 ? (essentialPaise / totalExpensePaise) * 100 : 0;
  const discretionaryPercent = 100 - essentialPercent;

  // 1. THE FINANCIAL DELUSIONIST: Total expenses exceed income
  if (totalIncomePaise > 0 && totalExpensePaise > totalIncomePaise) {
    return {
      id: 'FINANCIAL_DELUSIONIST',
      title: 'THE FINANCIAL DELUSIONIST',
      emoji: '🤡',
      subtitle: 'Living on pure mathematical optimism',
      description: 'You believe money is an abstract social construct that will magically resolve itself before the semester ends.',
      evidence: `Your total outflow exceeds your total inflow by ${(totalExpensePaise - totalIncomePaise) / 100} rupees.`,
      practicalTip: 'Freeze non-essential purchases for 5 days to stop the cash-burn spiral.',
      badgeColor: 'border-danger-red bg-danger-red/20 text-danger-red',
      hasEnoughData: true,
    };
  }

  // 2. THE CAFÉ ADDICT: Food and drinks consume > 45% of budget
  if (foodPercent >= 45) {
    return {
      id: 'CAFE_ADDICT',
      title: 'THE CAFÉ ADDICT',
      emoji: '☕',
      subtitle: 'Caffeine runs through your veins',
      description: 'Half of your life capital is invested in roasted coffee beans, late-night Swiggy orders, and canteen samosas.',
      evidence: `Food and café drinks account for ${Math.round(foodPercent)}% of all your recorded spending.`,
      practicalTip: 'Switch to making kettle coffee in the hostel twice a week to save up to ₹500/month.',
      badgeColor: 'border-amber bg-amber/20 text-amber',
      hasEnoughData: true,
    };
  }

  // 3. THE IMPULSE BUYER: Shopping + Entertainment > 40%
  if (shoppingPercent + entertainmentPercent >= 35) {
    return {
      id: 'IMPULSE_BUYER',
      title: 'THE IMPULSE BUYER',
      emoji: '🛍️',
      subtitle: 'Click first, regret later',
      description: 'You see a limited-time flash deal or a new gadget and your fingers tap checkout before your brain can stop them.',
      evidence: `Shopping and entertainment make up ${Math.round(shoppingPercent + entertainmentPercent)}% of your expenses.`,
      practicalTip: 'Enforce the 24-Hour Rule: Wait a full day before finalizing any non-essential purchase.',
      badgeColor: 'border-lavender bg-lavender/20 text-lavender',
      hasEnoughData: true,
    };
  }

  // 4. THE COUPON WARRIOR: Essential > 80% with low discretionary
  if (essentialPercent >= 80) {
    return {
      id: 'COUPON_WARRIOR',
      title: 'THE COUPON WARRIOR',
      emoji: '🏷️',
      subtitle: 'Master of discounts and student bargains',
      description: 'You know every single student discount in a 5km radius and would rather walk 3km than pay surge fare.',
      evidence: `${Math.round(essentialPercent)}% of your expenses are strictly non-negotiable survival essentials.`,
      practicalTip: 'You have mastered frugality! Don’t forget to occasionally reward yourself with a small ₹30 treat.',
      badgeColor: 'border-neon-lime bg-neon-lime/20 text-neon-lime',
      hasEnoughData: true,
    };
  }

  // 5. THE SPREADSHEET GOBLIN: Multiple categories used, all under 35%, very even
  const categoriesUsed = Object.values(categoryTotals).filter((amt) => amt > 0).length;
  if (categoriesUsed >= 4 && foodPercent < 35 && discretionaryPercent < 35) {
    return {
      id: 'SPREADSHEET_GOBLIN',
      title: 'THE SPREADSHEET GOBLIN',
      emoji: '📊',
      subtitle: 'Precision budgeting incarnate',
      description: 'Every rupee has a home. You probably organize your socks by color and know your balance to the exact paise.',
      evidence: `Evenly distributed spending across ${categoriesUsed} distinct categories with zero runaway line items.`,
      practicalTip: 'Automate a small fraction into an emergency savings lockbox.',
      badgeColor: 'border-neon-lime bg-neon-lime/20 text-neon-lime',
      hasEnoughData: true,
    };
  }

  // 6. THE SOCIAL BUTTERFLY: Entertainment > 20%
  if (entertainmentPercent >= 20) {
    return {
      id: 'SOCIAL_BUTTERFLY',
      title: 'THE SOCIAL BUTTERFLY',
      emoji: '🦋',
      subtitle: 'Powered by friend hangouts and outings',
      description: 'You cannot say no to group outings, movie tickets, or celebration dinners. FOMO is your financial kryptonite.',
      evidence: `Entertainment and social outings take up ${Math.round(entertainmentPercent)}% of your budget.`,
      practicalTip: 'Suggest campus walks or hostel movie nights instead of café bills.',
      badgeColor: 'border-lavender bg-lavender/20 text-lavender',
      hasEnoughData: true,
    };
  }

  // 7. THE SURVIVAL STRATEGIST (Default healthy profile)
  return {
    id: 'SURVIVAL_STRATEGIST',
    title: 'THE SURVIVAL STRATEGIST',
    emoji: '🎒',
    subtitle: 'Steadily navigating college economics',
    description: 'You balance surviving college with having a bit of fun. You know when to spend and when to hit the brakes.',
    evidence: `Balanced essentials (${Math.round(essentialPercent)}%) vs discretionary (${Math.round(discretionaryPercent)}%) ratio.`,
    practicalTip: 'Keep an eye on the allowance countdown to make sure you finish the month in the green.',
    badgeColor: 'border-neon-lime bg-neon-lime/20 text-neon-lime',
    hasEnoughData: true,
  };
}

