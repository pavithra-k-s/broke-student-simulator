import React, { useState } from 'react';
import { Transaction } from '../../types/transaction';
import { formatINR } from '../../utils/currency';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { Trash2, ArrowUpRight, ArrowDownRight, FileQuestion } from 'lucide-react';
import { PixelModal } from '../common/PixelModal';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onViewAll?: () => void;
  limit?: number;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onDeleteTransaction,
  onViewAll,
  limit = 5,
}) => {
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const displayed = limit ? transactions.slice(0, limit) : transactions;

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteTransaction(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel">
      <div className="flex items-center justify-between border-b-2 border-retro-border/60 pb-3 mb-4">
        <div>
          <h3 className="font-pixel text-xs text-cream uppercase">
            RECENT TRANSACTIONS
          </h3>
          <p className="font-mono text-xs text-cream-muted">
            {transactions.length} record{transactions.length === 1 ? '' : 's'} recorded
          </p>
        </div>
        {onViewAll && transactions.length > limit && (
          <button
            onClick={onViewAll}
            className="font-pixel text-[10px] text-neon-lime hover:underline"
          >
            VIEW ALL ({transactions.length}) ▶
          </button>
        )}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-8 px-4 bg-retro-dark/50 border border-dashed border-retro-border">
          <FileQuestion className="w-10 h-10 text-cream-muted mx-auto mb-2 opacity-50" />
          <p className="font-pixel text-xs text-cream mb-1">NO TRANSACTIONS YET</p>
          <p className="font-mono text-xs text-cream-muted max-w-sm mx-auto">
            Your ledger is currently pristine. Click "+ INCOME" or "- EXPENSE" above to record your first real-world transaction!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-retro-border/60">
          {displayed.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-retro-dark/40 px-2 transition-colors group"
              >
                {/* Left: Indicator Icon & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-none border flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'border-neon-lime/40 bg-neon-lime/10 text-neon-lime'
                        : 'border-danger-red/40 bg-danger-red/10 text-danger-red'
                    }`}
                  >
                    {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>

                  <div className="min-w-0">
                    <p className="font-mono text-xs text-cream font-bold truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <PixelBadge
                        variant={isIncome ? 'lime' : 'neutral'}
                        size="sm"
                        className="text-[8px]"
                      >
                        {tx.category}
                      </PixelBadge>
                      <span className="font-mono text-[10px] text-cream-muted">
                        {tx.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-pixel text-xs sm:text-sm font-bold ${
                      isIncome ? 'text-neon-lime' : 'text-danger-red'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatINR(tx.amountPaise)}
                  </span>

                  <button
                    onClick={() => setDeleteTarget(tx)}
                    className="opacity-70 group-hover:opacity-100 p-1.5 text-cream-muted hover:text-danger-red hover:bg-danger-red/10 border border-transparent hover:border-danger-red transition-all"
                    title="Delete Transaction"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      <PixelModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="CONFIRM DELETION"
      >
        <div className="space-y-4">
          <p className="font-mono text-xs text-cream">
            Are you sure you want to permanently erase this transaction from your financial history?
          </p>
          {deleteTarget && (
            <div className="p-3 bg-retro-dark border border-retro-border font-mono text-xs space-y-1">
              <p>
                <strong>Description:</strong> {deleteTarget.description}
              </p>
              <p>
                <strong>Amount:</strong>{' '}
                <span
                  className={
                    deleteTarget.type === 'income' ? 'text-neon-lime' : 'text-danger-red'
                  }
                >
                  {deleteTarget.type === 'income' ? '+' : '-'}
                  {formatINR(deleteTarget.amountPaise)}
                </span>
              </p>
              <p>
                <strong>Date:</strong> {deleteTarget.date}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <PixelButton
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              CANCEL
            </PixelButton>
            <PixelButton
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
            >
              YES, DELETE
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  );
};

