export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Education'
  | 'Hostel'
  | 'Shopping'
  | 'Entertainment'
  | 'Personal Care'
  | 'Subscriptions'
  | 'Other';

export type IncomeCategory =
  | 'Allowance'
  | 'Scholarship'
  | 'Part-time work'
  | 'Gift'
  | 'Other';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amountPaise: number; // Integer paise (₹1 = 100 paise)
  category: ExpenseCategory | IncomeCategory;
  date: string; // ISO date string YYYY-MM-DD
  notes?: string;
  createdAt: number;
}

