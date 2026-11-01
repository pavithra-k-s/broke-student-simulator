import React from 'react';
import { UserProfile } from '../types/profile';
import { Transaction } from '../types/transaction';
import { FinancialSummary } from '../types/game';
import { WalletCard } from '../components/dashboard/WalletCard';
import { SurvivalStatusCard } from '../components/dashboard/SurvivalStatusCard';
import { DailyBudgetCard } from '../components/dashboard/DailyBudgetCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { PixelStudent } from '../components/common/PixelArtIcons';
import { PixelBadge } from '../components/common/PixelBadge';
import { PixelButton } from '../components/common/PixelButton';
import { Gamepad2 } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  transactions: Transaction[];
  summary: FinancialSummary;
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onViewTransactions: () => void;
  onDeleteTransaction: (id: string) => void;
  onNavigatePlayMode?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  transactions,
  summary,
  onOpenAddExpense,
  onOpenAddIncome,
  onViewTransactions,
  onDeleteTransaction,
  onNavigatePlayMode,
}) => {
  return (
    <div className="space-y-6">
      {/* A. Player Greeting Banner */}
      <div className="relative bg-retro-panel border-2 border-retro-border p-4 sm:p-5 shadow-pixel overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-pixel text-sm sm:text-lg text-neon-lime glow-lime tracking-wide">
                HEY, {profile.nickname.toUpperCase()}.EXE 👾
              </h1>
              <PixelBadge
                variant={
                  profile.difficulty === 'HARD'
                    ? 'danger'
                    : profile.difficulty === 'NORMAL'
                    ? 'amber'
                    : 'lime'
                }
                size="sm"
              >
                {profile.difficulty} MODE
              </PixelBadge>
            </div>
            <p className="font-mono text-xs sm:text-sm text-cream-muted mb-2">
              "Another day, another financial crisis."
            </p>
            {onNavigatePlayMode && (
              <PixelButton
                variant="amber"
                size="sm"
                onClick={onNavigatePlayMode}
                icon={<Gamepad2 size={14} />}
                className="text-[10px]"
              >
                PLAY SIMULATED DAY ▶
              </PixelButton>
            )}
          </div>

          <div className="hidden sm:block shrink-0">
            <PixelStudent className="w-14 h-14 animate-float" />
          </div>
        </div>
      </div>

      {/* B. Main Wallet Card */}
      <WalletCard summary={summary} />

      {/* D. Quick Actions */}
      <QuickActions
        onAddExpense={onOpenAddExpense}
        onAddIncome={onOpenAddIncome}
        onViewTransactions={onViewTransactions}
      />

      {/* Grid: Survival Status & Daily Budget Runway */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C. Survival Status */}
        <SurvivalStatusCard summary={summary} />

        {/* F. Daily Budget Runway */}
        <DailyBudgetCard summary={summary} />
      </div>

      {/* E. Recent Transactions */}
      <RecentTransactions
        transactions={transactions}
        onDeleteTransaction={onDeleteTransaction}
        onViewAll={onViewTransactions}
        limit={5}
      />
    </div>
  );
};

