import React, { useState, useEffect } from 'react';
import { PixelModal } from '../common/PixelModal';
import { PixelInput } from '../common/PixelInput';
import { PixelSelect } from '../common/PixelSelect';
import { PixelButton } from '../common/PixelButton';
import {
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
  Transaction,
} from '../../types/transaction';
import { parseInputToPaise } from '../../utils/currency';
import { validateTransaction } from '../../utils/validation';
import { MinusCircle, PlusCircle, CheckCircle } from 'lucide-react';

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Education',
  'Hostel',
  'Shopping',
  'Entertainment',
  'Personal Care',
  'Subscriptions',
  'Other',
];

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Allowance',
  'Scholarship',
  'Part-time work',
  'Gift',
  'Other',
];

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
  onAddTransaction,
}) => {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [category, setCategory] = useState<string>('Food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successNotice, setSuccessNotice] = useState(false);

  // Sync default type when opened
  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setCategory(defaultType === 'income' ? 'Allowance' : 'Food');
      setDescription('');
      setAmountInput('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setErrors({});
      setSuccessNotice(false);
    }
  }, [isOpen, defaultType]);

  const handleTypeSwitch = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Allowance' : 'Food');
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amountInput);
    const validation = validateTransaction({
      description,
      amount: numericAmount,
      category,
      date,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const amountPaise = parseInputToPaise(amountInput);

    onAddTransaction({
      type,
      description: description.trim(),
      amountPaise,
      category: category as ExpenseCategory | IncomeCategory,
      date,
      notes: notes.trim() ? notes.trim() : undefined,
    });

    setSuccessNotice(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <PixelModal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'expense' ? 'RECORD EXPENSE (-)' : 'RECORD INCOME (+)'}
      icon={
        type === 'expense' ? (
          <MinusCircle size={18} className="text-danger-red" />
        ) : (
          <PlusCircle size={18} className="text-neon-lime" />
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle between Expense and Income */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-retro-dark border border-retro-border">
          <button
            type="button"
            onClick={() => handleTypeSwitch('expense')}
            className={`py-2 text-xs font-pixel transition-all ${
              type === 'expense'
                ? 'bg-danger-red text-white shadow-pixel-sm font-bold'
                : 'text-cream-muted hover:text-cream'
            }`}
          >
            💸 EXPENSE
          </button>
          <button
            type="button"
            onClick={() => handleTypeSwitch('income')}
            className={`py-2 text-xs font-pixel transition-all ${
              type === 'income'
                ? 'bg-neon-lime text-retro-dark shadow-pixel-sm font-bold'
                : 'text-cream-muted hover:text-cream'
            }`}
          >
            💰 INCOME
          </button>
        </div>

        {/* Description Input */}
        <PixelInput
          label="Description / Item Name"
          placeholder={type === 'expense' ? 'e.g. Canteen Samosa, Swiggy, Wifi bill' : 'e.g. Pocket money, Freelance gig'}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          error={errors.description}
          required
        />

        {/* Amount Input */}
        <PixelInput
          label="Amount (in INR)"
          type="number"
          step="any"
          min="0.01"
          placeholder="0.00"
          prefix="₹"
          value={amountInput}
          onChange={(e) => {
            setAmountInput(e.target.value);
            if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
          }}
          error={errors.amount}
          required
        />

        {/* Category Selector */}
        <PixelSelect
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={
            type === 'expense'
              ? EXPENSE_CATEGORIES.map((cat) => ({ value: cat, label: cat }))
              : INCOME_CATEGORIES.map((cat) => ({ value: cat, label: cat }))
          }
          error={errors.category}
        />

        {/* Date Input */}
        <PixelInput
          label="Date of Transaction"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          required
        />

        {/* Optional Notes */}
        <PixelInput
          label="Notes (Optional)"
          placeholder="e.g. Shared with roommate, Split ₹100 each"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {successNotice && (
          <div className="flex items-center gap-2 p-2 bg-neon-lime/20 border border-neon-lime text-neon-lime font-mono text-xs">
            <CheckCircle size={14} />
            <span>Transaction successfully logged to ledger!</span>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-retro-border">
          <PixelButton
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
          >
            CANCEL
          </PixelButton>

          <PixelButton
            type="submit"
            variant={type === 'expense' ? 'danger' : 'lime'}
            size="md"
          >
            {type === 'expense' ? 'SAVE EXPENSE' : 'SAVE INCOME'}
          </PixelButton>
        </div>
      </form>
    </PixelModal>
  );
};

