import React from 'react';
import { FinancialSummary } from '../../types/game';
import { formatINR } from '../../utils/currency';
import { PixelWallet, PixelCoin } from '../common/PixelArtIcons';
import { ArrowDownRight, ArrowUpRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface WalletCardProps {
  summary: FinancialSummary;
}

export const WalletCard: React.FC<WalletCardProps> = ({ summary }) => {
  const isNegative = summary.availableBalancePaise < 0;

  return (
    <div className="relative bg-gradient-to-br from-retro-panel to-retro-panel-light border-4 border-retro-border p-5 sm:p-6 shadow-pixel-lg">
      {/* Decorative retro badges */}
      <div className="flex items-center justify-between border-b-2 border-retro-border/60 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <PixelWallet className="w-8 h-8" />
          <div>
            <h2 className="font-pixel text-xs sm:text-sm text-cream uppercase">
              PLAYER WALLET
            </h2>
            <p className="font-mono text-[11px] text-cream-muted">Live Economic Inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-retro-dark border border-retro-border text-xs font-mono">
          <PixelCoin className="w-4 h-4 animate-bounce-slow" />
          <span className="text-amber font-bold">INR</span>
        </div>
      </div>

      {/* Main Available Balance Highlight */}
      <div className="my-4 bg-retro-dark/80 border-2 border-retro-border p-4 text-center">
        <p className="font-pixel text-[10px] text-cream-muted uppercase tracking-widest mb-1">
          CURRENT AVAILABLE BALANCE
        </p>
        <div className="flex items-center justify-center gap-2">
          <span
            className={`font-pixel text-2xl sm:text-4xl tracking-tight ${
              isNegative ? 'text-danger-red glow-red' : 'text-neon-lime glow-lime'
            }`}
          >
            {formatINR(summary.availableBalancePaise)}
          </span>
        </div>
        {isNegative && (
          <div className="mt-2 inline-flex items-center gap-1 text-danger-red font-mono text-xs bg-danger-red/10 px-2 py-0.5 border border-danger-red/30">
            <AlertTriangle size={12} />
            <span>Overdraft state! Emotional damage accumulating.</span>
          </div>
        )}
      </div>

      {/* Secondary Stats Breakdown: Starting, Income, Expenses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Starting Balance */}
        <div className="bg-retro-dark/40 border border-retro-border p-3">
          <div className="flex items-center gap-1.5 text-cream-muted text-xs font-mono mb-1">
            <ShieldCheck size={14} className="text-lavender" />
            <span>Starting Base</span>
          </div>
          <p className="font-mono font-bold text-sm sm:text-base text-lavender">
            {formatINR(summary.startingBalancePaise)}
          </p>
        </div>

        {/* Total Income */}
        <div className="bg-retro-dark/40 border border-retro-border p-3">
          <div className="flex items-center gap-1.5 text-cream-muted text-xs font-mono mb-1">
            <ArrowUpRight size={14} className="text-neon-lime" />
            <span>Total Inflow</span>
          </div>
          <p className="font-mono font-bold text-sm sm:text-base text-neon-lime">
            +{formatINR(summary.totalIncomePaise)}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-retro-dark/40 border border-retro-border p-3">
          <div className="flex items-center gap-1.5 text-cream-muted text-xs font-mono mb-1">
            <ArrowDownRight size={14} className="text-danger-red" />
            <span>Total Spent</span>
          </div>
          <p className="font-mono font-bold text-sm sm:text-base text-danger-red">
            -{formatINR(summary.totalExpensesPaise)}
          </p>
        </div>
      </div>
    </div>
  );
};

