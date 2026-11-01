import React, { useState, useMemo } from 'react';
import { Transaction, ExpenseCategory, IncomeCategory } from '../types/transaction';
import { FinancialSummary } from '../types/game';
import { GameTransaction } from '../types/gameplay';
import { PixelButton } from '../components/common/PixelButton';
import { PixelBadge } from '../components/common/PixelBadge';
import { PixelModal } from '../components/common/PixelModal';
import { PixelInput } from '../components/common/PixelInput';
import { formatINR, paiseToRupees, parseInputToPaise } from '../utils/currency';
import { exportTransactionsToCSV, downloadCSVFile, parseCSVToTransactions } from '../utils/csv';
import {
  PlusCircle,
  MinusCircle,
  ArrowLeft,
  Search,
  Download,
  Upload,
  Trash2,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

const ALL_CATEGORIES: string[] = [
  'ALL',
  'Food',
  'Transport',
  'Education',
  'Hostel',
  'Shopping',
  'Entertainment',
  'Personal Care',
  'Subscriptions',
  'Allowance',
  'Scholarship',
  'Part-time work',
  'Gift',
  'Other',
];

interface TransactionsPageProps {
  transactions: Transaction[];
  summary: FinancialSummary;
  gameTransactions?: GameTransaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onEditTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
  onImportTransactions: (imported: Transaction[]) => void;
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onBackToDashboard: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  summary,
  gameTransactions = [],
  onEditTransaction,
  onDeleteTransaction,
  onImportTransactions,
  onOpenAddExpense,
  onOpenAddIncome,
  onBackToDashboard,
}) => {
  // Ledger view toggle: 'real' vs 'game'
  const [ledgerMode, setLedgerMode] = useState<'real' | 'game'>('real');

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'income' | 'expense'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');

  // Modal states
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = (text: string, isError = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filtered and Sorted Real Transactions
  const filteredRealTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          !query ||
          tx.description.toLowerCase().includes(query) ||
          (tx.notes && tx.notes.toLowerCase().includes(query));

        // Category
        const matchesCat = selectedCategory === 'ALL' || tx.category === selectedCategory;

        // Type
        const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;

        // Date Range
        const matchesStart = !startDate || tx.date >= startDate;
        const matchesEnd = !endDate || tx.date <= endDate;

        return matchesSearch && matchesCat && matchesType && matchesStart && matchesEnd;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt;
        if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime() || a.createdAt - b.createdAt;
        if (sortBy === 'amount_high') return b.amountPaise - a.amountPaise;
        if (sortBy === 'amount_low') return a.amountPaise - b.amountPaise;
        return 0;
      });
  }, [transactions, searchQuery, selectedCategory, typeFilter, startDate, endDate, sortBy]);

  // CSV Export
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export!', true);
      return;
    }
    const csv = exportTransactionsToCSV(transactions);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSVFile(`broke-student-transactions-${dateStr}.csv`, csv);
    showToast(`Exported ${transactions.length} records to CSV!`);
  };

  // CSV Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const result = parseCSVToTransactions(text);
      if (result.success && result.imported.length > 0) {
        onImportTransactions(result.imported);
        showToast(`Successfully imported ${result.imported.length} transactions from CSV!`);
      } else {
        showToast(result.errors[0] || 'Failed to parse CSV.', true);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Edit Handlers
  const handleOpenEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setEditDesc(tx.description);
    setEditAmount(paiseToRupees(tx.amountPaise).toString());
    setEditCategory(tx.category);
    setEditDate(tx.date);
    setEditNotes(tx.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    const amtPaise = parseInputToPaise(editAmount);
    if (amtPaise <= 0) {
      showToast('Amount must be greater than zero.', true);
      return;
    }

    onEditTransaction(editingTx.id, {
      description: editDesc.trim() || editingTx.description,
      amountPaise: amtPaise,
      category: editCategory as ExpenseCategory | IncomeCategory,
      date: editDate || editingTx.date,
      notes: editNotes.trim() ? editNotes.trim() : undefined,
    });

    setEditingTx(null);
    showToast('Transaction successfully updated!');
  };

  // Delete Handler
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteTransaction(deleteTarget.id);
      setDeleteTarget(null);
      showToast('Transaction removed from ledger.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div
          className={`fixed top-16 right-4 z-50 p-3 border-2 shadow-pixel font-mono text-xs flex items-center gap-2 ${
            toastMsg.isError ? 'bg-danger-red text-white border-black' : 'bg-neon-lime text-retro-dark border-black font-bold'
          }`}
        >
          {toastMsg.isError ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-retro-panel border-4 border-retro-border p-4 sm:p-5 shadow-pixel-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 bg-retro-dark border border-retro-border text-cream-muted hover:text-neon-lime transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-xs sm:text-sm text-cream uppercase">
                FINANCIAL TRANSACTION LEDGER
              </h2>
              <PixelBadge variant={ledgerMode === 'real' ? 'lime' : 'amber'} size="sm">
                {ledgerMode === 'real' ? 'REAL MONEY' : 'GAME LEDGER'}
              </PixelBadge>
            </div>
            <p className="font-mono text-xs text-cream-muted">
              {ledgerMode === 'real'
                ? 'Your verified personal budget transaction records'
                : 'Fictional gameplay decisions and store purchases'}
            </p>
          </div>
        </div>

        {/* Ledger Mode Switch & Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle between Real Ledger and Game Ledger */}
          <div className="flex items-center p-1 bg-retro-dark border border-retro-border font-pixel text-[9px]">
            <button
              onClick={() => setLedgerMode('real')}
              className={`px-2.5 py-1 transition-all ${
                ledgerMode === 'real' ? 'bg-neon-lime text-retro-dark font-bold shadow-pixel-sm' : 'text-cream-muted hover:text-cream'
              }`}
            >
              REAL LEDGER
            </button>
            <button
              onClick={() => setLedgerMode('game')}
              className={`px-2.5 py-1 transition-all ${
                ledgerMode === 'game' ? 'bg-amber text-retro-dark font-bold shadow-pixel-sm' : 'text-cream-muted hover:text-cream'
              }`}
            >
              GAME LEDGER
            </button>
          </div>

          {ledgerMode === 'real' && (
            <>
              <PixelButton
                variant="danger"
                size="sm"
                onClick={onOpenAddExpense}
                icon={<MinusCircle size={14} />}
                className="text-[10px]"
              >
                - EXPENSE
              </PixelButton>
              <PixelButton
                variant="lime"
                size="sm"
                onClick={onOpenAddIncome}
                icon={<PlusCircle size={14} />}
                className="text-[10px]"
              >
                + INCOME
              </PixelButton>
            </>
          )}
        </div>
      </div>

      {/* Mini Summary Strip (Real Ledger only) */}
      {ledgerMode === 'real' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-retro-panel border-2 border-retro-border p-3 shadow-pixel">
            <p className="font-mono text-[10px] text-cream-muted uppercase">Total Records</p>
            <p className="font-pixel text-base text-cream mt-1">{transactions.length}</p>
          </div>
          <div className="bg-retro-panel border-2 border-retro-border p-3 shadow-pixel">
            <p className="font-mono text-[10px] text-cream-muted uppercase">Total Inflow</p>
            <p className="font-pixel text-base text-neon-lime mt-1">+{formatINR(summary.totalIncomePaise)}</p>
          </div>
          <div className="bg-retro-panel border-2 border-retro-border p-3 shadow-pixel">
            <p className="font-mono text-[10px] text-cream-muted uppercase">Total Outflow</p>
            <p className="font-pixel text-base text-danger-red mt-1">-{formatINR(summary.totalExpensesPaise)}</p>
          </div>
          <div className="bg-retro-panel border-2 border-retro-border p-3 shadow-pixel">
            <p className="font-mono text-[10px] text-cream-muted uppercase">Net Available</p>
            <p
              className={`font-pixel text-base mt-1 ${
                summary.availableBalancePaise < 0 ? 'text-danger-red' : 'text-neon-lime'
              }`}
            >
              {formatINR(summary.availableBalancePaise)}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-amber/10 border-2 border-amber/40 text-amber font-mono text-xs flex items-center justify-between">
          <span>🎮 Showing {gameTransactions.length} fictional Play Mode transactions.</span>
          <span className="font-bold">Isolated from Real Budget</span>
        </div>
      )}

      {/* Filter, Search, and CSV Toolbar (Real Ledger) */}
      {ledgerMode === 'real' && (
        <div className="bg-retro-panel border-2 border-retro-border p-4 shadow-pixel space-y-3 font-mono text-xs">
          {/* Top row: Search, Category, Type, Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cream-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search description / notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-retro-dark border border-retro-border pl-8 pr-3 py-1.5 text-xs text-cream focus:outline-none focus:border-neon-lime"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-retro-dark border border-retro-border px-3 py-1.5 text-xs text-cream focus:outline-none focus:border-neon-lime cursor-pointer"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-retro-dark border border-retro-border px-3 py-1.5 text-xs text-cream focus:outline-none focus:border-neon-lime cursor-pointer"
            >
              <option value="ALL">All Types (+ & -)</option>
              <option value="expense">Expenses Only (-)</option>
              <option value="income">Income Only (+)</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-retro-dark border border-retro-border px-3 py-1.5 text-xs text-cream focus:outline-none focus:border-neon-lime cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount_high">Sort: Amount High to Low</option>
              <option value="amount_low">Sort: Amount Low to High</option>
            </select>
          </div>

          {/* Bottom row: Date Filters and CSV Import / Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-retro-border/60">
            {/* Date Pickers */}
            <div className="flex items-center gap-2 text-cream-muted text-[11px]">
              <span>Date Range:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-retro-dark border border-retro-border px-2 py-1 text-xs text-cream"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-retro-dark border border-retro-border px-2 py-1 text-xs text-cream"
              />
              {(startDate || endDate || searchQuery || selectedCategory !== 'ALL' || typeFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setTypeFilter('ALL');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-danger-red hover:underline ml-1"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* CSV Actions */}
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-retro-dark border border-retro-border text-cream-muted hover:text-neon-lime hover:border-neon-lime text-xs cursor-pointer shadow-pixel-sm transition-colors">
                <Upload size={13} />
                <span>IMPORT CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-retro-dark border border-retro-border text-cream-muted hover:text-neon-lime hover:border-neon-lime text-xs cursor-pointer shadow-pixel-sm transition-colors"
                title="Export as CSV spreadsheet"
              >
                <Download size={13} />
                <span>EXPORT CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ledger Table / List */}
      <div className="bg-retro-panel border-4 border-retro-border p-4 sm:p-5 shadow-pixel-lg">
        {ledgerMode === 'real' ? (
          filteredRealTransactions.length === 0 ? (
            <div className="text-center py-12 px-4 bg-retro-dark/50 border border-dashed border-retro-border font-mono">
              <FileSpreadsheet className="w-10 h-10 text-cream-muted mx-auto mb-2 opacity-40" />
              <p className="font-pixel text-xs text-cream mb-1">NO MATCHING TRANSACTIONS</p>
              <p className="text-xs text-cream-muted">
                {transactions.length === 0
                  ? 'Your real ledger is empty. Click "+ INCOME" or "- EXPENSE" above to record your first transaction.'
                  : 'No records matched your search or filter settings.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-retro-border/60">
              {filteredRealTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div
                    key={tx.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-retro-dark/40 px-2 transition-colors group"
                  >
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
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
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
                          {tx.notes && (
                            <span className="font-mono text-[10px] text-cream-muted/80 italic truncate max-w-xs">
                              • {tx.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`font-pixel text-xs sm:text-sm font-bold ${
                          isIncome ? 'text-neon-lime' : 'text-danger-red'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatINR(tx.amountPaise)}
                      </span>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(tx)}
                        className="opacity-70 group-hover:opacity-100 p-1.5 text-cream-muted hover:text-neon-lime hover:bg-neon-lime/10 border border-transparent hover:border-neon-lime transition-all"
                        title="Edit Transaction"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Delete Button */}
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
          )
        ) : (
          /* Game Transactions View */
          gameTransactions.length === 0 ? (
            <div className="text-center py-12 px-4 bg-retro-dark/50 border border-dashed border-retro-border font-mono">
              <p className="font-pixel text-xs text-amber mb-1">NO SIMULATED GAME TRANSACTIONS</p>
              <p className="text-xs text-cream-muted">
                Enter Play Mode or visit the Temptation Store to generate simulated transactions.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-retro-border/60">
              {gameTransactions.map((gtx) => {
                const isIncome = gtx.type === 'income';
                return (
                  <div key={gtx.id} className="py-2.5 flex items-center justify-between gap-3 px-2">
                    <div>
                      <p className="font-mono text-xs text-cream font-bold">{gtx.description}</p>
                      <p className="font-mono text-[10px] text-cream-muted">
                        Simulated Day {gtx.simulatedDay} • Category: {gtx.category} • Source: {gtx.source}
                      </p>
                    </div>
                    <span
                      className={`font-pixel text-xs ${
                        isIncome ? 'text-neon-lime' : 'text-danger-red'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatINR(gtx.amountPaise)}
                    </span>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Edit Transaction Modal */}
      <PixelModal
        isOpen={Boolean(editingTx)}
        onClose={() => setEditingTx(null)}
        title="EDIT TRANSACTION"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <PixelInput
            label="Description"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            required
          />

          <PixelInput
            label="Amount in INR"
            type="number"
            step="any"
            min="0.01"
            prefix="₹"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            required
          />

          <PixelInput
            label="Date"
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            required
          />

          <PixelInput
            label="Notes (Optional)"
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-retro-border">
            <PixelButton
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setEditingTx(null)}
            >
              CANCEL
            </PixelButton>
            <PixelButton variant="lime" size="sm" type="submit">
              SAVE CHANGES
            </PixelButton>
          </div>
        </form>
      </PixelModal>

      {/* Delete Confirmation Modal */}
      <PixelModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="CONFIRM TRANSACTION REMOVAL"
      >
        <div className="space-y-4 font-mono text-xs text-cream">
          <p>
            Are you sure you want to permanently delete this transaction from your budget history? All dependent dashboard totals and analytics will update immediately.
          </p>

          {deleteTarget && (
            <div className="p-3 bg-retro-dark border border-retro-border space-y-1">
              <p><strong>Item:</strong> {deleteTarget.description}</p>
              <p>
                <strong>Amount:</strong>{' '}
                <span className={deleteTarget.type === 'income' ? 'text-neon-lime' : 'text-danger-red'}>
                  {deleteTarget.type === 'income' ? '+' : '-'}{formatINR(deleteTarget.amountPaise)}
                </span>
              </p>
              <p><strong>Date:</strong> {deleteTarget.date}</p>
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
              CONFIRM DELETE
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  );
};
