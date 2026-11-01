import React from 'react';
import { PixelButton } from '../common/PixelButton';
import { MinusCircle, PlusCircle, History } from 'lucide-react';

interface QuickActionsProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
  onViewTransactions: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddExpense,
  onAddIncome,
  onViewTransactions,
}) => {
  return (
    <div className="bg-retro-panel border-2 border-retro-border p-4 shadow-pixel">
      <div className="flex items-center justify-between mb-3 border-b border-retro-border/60 pb-2">
        <h3 className="font-pixel text-xs text-cream uppercase">
          QUICK ACTIONS
        </h3>
        <span className="font-mono text-[11px] text-cream-muted">Fast Transaction Logging</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <PixelButton
          variant="danger"
          size="md"
          onClick={onAddExpense}
          icon={<MinusCircle size={16} />}
          fullWidth
        >
          LOG EXPENSE
        </PixelButton>

        <PixelButton
          variant="lime"
          size="md"
          onClick={onAddIncome}
          icon={<PlusCircle size={16} />}
          fullWidth
        >
          LOG INCOME
        </PixelButton>

        <PixelButton
          variant="panel"
          size="md"
          onClick={onViewTransactions}
          icon={<History size={16} />}
          fullWidth
        >
          LEDGER LOGS
        </PixelButton>
      </div>
    </div>
  );
};

