export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateOnboarding(data: {
  nickname: string;
  startingBalance: number;
  monthlyAllowance: number;
  daysUntilAllowance: number;
  dailyEssentialEstimate: number;
  savingsGoal: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.nickname || data.nickname.trim().length < 2) {
    errors.nickname = 'Player name must be at least 2 characters.';
  } else if (data.nickname.trim().length > 20) {
    errors.nickname = 'Player name cannot exceed 20 characters.';
  }

  if (isNaN(data.startingBalance) || data.startingBalance < 0) {
    errors.startingBalance = 'Starting balance cannot be negative (use ₹0 if broke!).';
  }

  if (isNaN(data.monthlyAllowance) || data.monthlyAllowance < 0) {
    errors.monthlyAllowance = 'Allowance cannot be negative (use ₹0 if no allowance).';
  }

  if (isNaN(data.daysUntilAllowance) || data.daysUntilAllowance < 1) {
    errors.daysUntilAllowance = 'Must be at least 1 day until next allowance.';
  } else if (data.daysUntilAllowance > 365) {
    errors.daysUntilAllowance = 'Survival horizon cannot exceed 365 days.';
  }

  if (isNaN(data.dailyEssentialEstimate) || data.dailyEssentialEstimate < 0) {
    errors.dailyEssentialEstimate = 'Daily estimate cannot be negative.';
  }

  if (isNaN(data.savingsGoal) || data.savingsGoal < 0) {
    errors.savingsGoal = 'Savings goal cannot be negative.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateTransaction(data: {
  description: string;
  amount: number;
  category: string;
  date: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.description || data.description.trim().length < 2) {
    errors.description = 'Please enter a description (at least 2 characters).';
  } else if (data.description.trim().length > 60) {
    errors.description = 'Description is too long (max 60 characters).';
  }

  if (isNaN(data.amount) || data.amount <= 0) {
    errors.amount = 'Amount must be greater than ₹0.';
  }

  if (!data.category || data.category.trim() === '') {
    errors.category = 'Please choose a category.';
  }

  if (!data.date || isNaN(Date.parse(data.date))) {
    errors.date = 'Please provide a valid date.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

