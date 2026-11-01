import React from 'react';
import { FinancialSummary } from '../../types/game';
import { formatINR } from '../../utils/currency';
import { Calendar, Target, FileText, Zap } from 'lucide-react';

interface SurvivalStatusCardProps {
  summary: FinancialSummary;
}

export const SurvivalStatusCard: React.FC<SurvivalStatusCardProps> = ({ summary }) => {
  const { status } = summary;

  return (
    <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel">
      {/* Survival Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-retro-border/60 pb-3 mb-4">
        <div>
          <h3 className="font-pixel text-xs text-cream uppercase flex items-center gap-2">
            <span>SURVIVAL STATUS</span>
          </h3>
          <p className="font-mono text-xs text-cream-muted">Real-time health of your wallet</p>
        </div>

        {/* Dynamic Financial Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xl shrink-0">{status.emoji}</span>
          <div className="text-left">
            <span
              className={`inline-block font-pixel text-[10px] px-2.5 py-1 border-2 uppercase ${status.badgeColor}`}
            >
              {status.title}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 bg-retro-dark/60 p-2.5 border border-retro-border text-xs font-mono text-cream-muted">
        <span className="text-amber font-bold">STATUS REPORT:</span> {status.subtitle}
      </div>

      {/* Grid of Key Survival Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Days until allowance */}
        <div className="bg-retro-dark/50 border border-retro-border p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-cream-muted text-xs mb-1">
            <Calendar size={13} className="text-amber" />
            <span className="font-mono">Days Left</span>
          </div>
          <p className="font-pixel text-base sm:text-lg text-amber">
            {summary.daysUntilAllowance}
          </p>
          <p className="text-[10px] text-cream-muted font-mono mt-0.5">Until next income</p>
        </div>

        {/* Metric 2: Daily Limit */}
        <div className="bg-retro-dark/50 border border-retro-border p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-cream-muted text-xs mb-1">
            <Zap size={13} className="text-neon-lime" />
            <span className="font-mono">Daily Limit</span>
          </div>
          <p
            className={`font-pixel text-sm sm:text-base ${
              summary.dailySpendingLimitPaise <= 0
                ? 'text-danger-red'
                : summary.dailySpendingLimitPaise < 15000
                ? 'text-amber'
                : 'text-neon-lime'
            }`}
          >
            {formatINR(summary.dailySpendingLimitPaise)}
          </p>
          <p className="text-[10px] text-cream-muted font-mono mt-0.5">Per day max</p>
        </div>

        {/* Metric 3: Remaining Fixed Expenses */}
        <div className="bg-retro-dark/50 border border-retro-border p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-cream-muted text-xs mb-1">
            <FileText size={13} className="text-lavender" />
            <span className="font-mono">Fixed Bills</span>
          </div>
          <p className="font-pixel text-sm sm:text-base text-lavender">
            {formatINR(summary.unpaidFixedExpensesPaise)}
          </p>
          <p className="text-[10px] text-cream-muted font-mono mt-0.5">Pending dues</p>
        </div>

        {/* Metric 4: Savings Goal */}
        <div className="bg-retro-dark/50 border border-retro-border p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-cream-muted text-xs mb-1">
            <Target size={13} className="text-neon-lime" />
            <span className="font-mono">Goal Target</span>
          </div>
          <p className="font-pixel text-sm sm:text-base text-cream">
            {formatINR(summary.savingsGoalPaise)}
          </p>
          <p className="text-[10px] text-cream-muted font-mono mt-0.5">
            {summary.savingsGoalPaise > 0 ? `${summary.savingsProgressPercent}% achieved` : 'Not set'}
          </p>
        </div>
      </div>

      {/* Retro 8-bit Progress Bar for Savings Goal (if configured) */}
      {summary.savingsGoalPaise > 0 && (
        <div className="mt-4 pt-3 border-t border-retro-border">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-cream-muted flex items-center gap-1.5">
              <Target size={13} className="text-neon-lime" /> Savings Goal Progress
            </span>
            <span className="font-pixel text-[10px] text-neon-lime">
              {summary.savingsProgressPercent}%
            </span>
          </div>
          <div className="w-full h-3 bg-retro-dark border border-retro-border p-0.5">
            <div
              className="h-full bg-neon-lime transition-all duration-300"
              style={{ width: `${summary.savingsProgressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
