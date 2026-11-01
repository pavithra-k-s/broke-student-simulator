import React, { useState } from 'react';
import { FinancialSummary } from '../../types/game';
import { formatINR } from '../../utils/currency';
import { HelpCircle, ChevronDown, ChevronUp, Calculator } from 'lucide-react';

interface DailyBudgetCardProps {
  summary: FinancialSummary;
}

export const DailyBudgetCard: React.FC<DailyBudgetCardProps> = ({ summary }) => {
  const [showFormula, setShowFormula] = useState(false);

  const isCritical = summary.dailySpendingLimitPaise <= 0;
  const isTight = summary.dailySpendingLimitPaise > 0 && summary.dailySpendingLimitPaise < 15000;

  return (
    <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-retro-border/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-neon-lime" />
          <h3 className="font-pixel text-xs text-cream uppercase">
            DAILY SPENDING RUNWAY
          </h3>
        </div>
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="flex items-center gap-1 text-[11px] font-mono text-neon-lime hover:underline cursor-pointer"
        >
          <HelpCircle size={14} />
          <span>{showFormula ? 'Hide Formula' : 'How is this calculated?'}</span>
          {showFormula ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Main Number Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-retro-dark border border-retro-border">
        <div>
          <p className="text-xs font-mono text-cream-muted uppercase tracking-wider">
            Safe Discretionary Allowance for Today
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`font-pixel text-2xl sm:text-3xl ${
                isCritical
                  ? 'text-danger-red glow-red'
                  : isTight
                  ? 'text-amber glow-amber'
                  : 'text-neon-lime glow-lime'
              }`}
            >
              {formatINR(summary.dailySpendingLimitPaise)}
            </span>
            <span className="font-mono text-xs text-cream-muted">/ day</span>
          </div>
        </div>

        <div className="text-left sm:text-right font-mono text-xs text-cream-muted">
          <p>
            Days remaining: <span className="text-amber font-bold">{summary.daysUntilAllowance}</span>
          </p>
          {summary.unpaidFixedExpensesPaise > 0 && (
            <p className="text-[11px] text-lavender">
              Reserved for bills: {formatINR(summary.unpaidFixedExpensesPaise)}
            </p>
          )}
        </div>
      </div>

      {/* Collapsible/Expandable Formula and Explanation */}
      {showFormula && (
        <div className="mt-3 p-3 bg-retro-panel-light border border-retro-border text-xs font-mono text-cream space-y-2 animate-in fade-in duration-150">
          <p className="font-pixel text-[10px] text-amber uppercase">
            📐 BUDGET ENGINE FORMULA
          </p>
          <div className="p-2 bg-retro-dark border border-retro-border text-xs leading-relaxed">
            <code>
              Daily Limit = (Available Balance - Pending Fixed Bills) ÷ Days to Allowance
            </code>
          </div>
          <div className="space-y-1 text-cream-muted text-[11px]">
            <p>• <strong>Available Balance:</strong> {formatINR(summary.availableBalancePaise)}</p>
            <p>• <strong>Unpaid Fixed Bills:</strong> -{formatINR(summary.unpaidFixedExpensesPaise)}</p>
            <p>• <strong>Remaining Discretionary Pool:</strong> {formatINR(summary.availableBalancePaise - summary.unpaidFixedExpensesPaise)}</p>
            <p>• <strong>Horizon:</strong> ÷ {summary.daysUntilAllowance} days</p>
          </div>
          <p className="text-[11px] text-cream pt-1 border-t border-retro-border">
            {summary.explanation}
          </p>
          {summary.savingsGoalPaise > 0 && (
            <div className="pt-1 text-[11px] text-lavender">
              💡 <em>If strictly reserving your savings goal ({formatINR(summary.savingsGoalPaise)}), your limit is {formatINR(summary.adjustedDailyLimitWithSavingsPaise)}/day.</em>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

