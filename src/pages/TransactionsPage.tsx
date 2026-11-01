import React from 'react';
import { Transaction } from '../types/transaction';
import { FinancialSummary } from '../types/game';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { PixelButton } from '../components/common/PixelButton';
import { formatINR } from '../utils/currency';
import { PlusCircle, MinusCircle, ArrowLeft } from 'lucide-react';

interface TransactionsPageProps {
  transactions: Transaction[];
  summary: FinancialSummary;
  onDeleteTransaction: (id: string) => void;
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onBackToDashboard: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  summary,
  onDeleteTransaction,
  onOpenAddExpense,
  onOpenAddIncome,
  onBackToDashboard,
}) => {
  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-retro-panel border-2 border-retro-border p-4 shadow-pixel">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 bg-retro-dark border border-retro-border text-cream-muted hover:text-neon-lime transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="font-pixel text-xs sm:text-sm text-cream uppercase">
              FINANCIAL TRANSACTION LEDGER
            </h2>
            <p className="font-mono text-xs text-cream-muted">
              Complete historical record of student economic decisions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PixelButton
            variant="danger"
            size="sm"
            onClick={onOpenAddExpense}
            icon={<MinusCircle size={14} />}
          >
            - EXPENSE
          </PixelButton>
          <PixelButton
            variant="lime"
            size="sm"
            onClick={onOpenAddIncome}
            icon={<PlusCircle size={14} />}
          >
            + INCOME
          </PixelButton>
        </div>
      </div>

      {/* Mini Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-retro-panel border border-retro-border p-3">
          <p className="font-mono text-[11px] text-cream-muted">Total Records</p>
          <p className="font-pixel text-base text-cream">{transactions.length}</p>
        </div>
        <div className="bg-retro-panel border border-retro-border p-3">
          <p className="font-mono text-[11px] text-cream-muted">Total Inflow</p>
          <p className="font-pixel text-base text-neon-lime">+{formatINR(summary.totalIncomePaise)}</p>
        </div>
        <div className="bg-retro-panel border border-retro-border p-3">
          <p className="font-mono text-[11px] text-cream-muted">Total Outflow</p>
          <p className="font-pixel text-base text-danger-red">-{formatINR(summary.totalExpensesPaise)}</p>
        </div>
        <div className="bg-retro-panel border border-retro-border p-3">
          <p className="font-mono text-[11px] text-cream-muted">Net Position</p>
          <p
            className={`font-pixel text-base ${
              summary.availableBalancePaise < 0 ? 'text-danger-red' : 'text-neon-lime'
            }`}
          >
            {formatINR(summary.availableBalancePaise)}
          </p>
        </div>
      </div>

      {/* Full Transaction List */}
      <RecentTransactions
        transactions={transactions}
        onDeleteTransaction={onDeleteTransaction}
        limit={100} // Show all transactions on dedicated page
      />
    </div>
  );
};

