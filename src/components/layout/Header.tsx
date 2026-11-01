import React from 'react';
import { UserProfile } from '../../types/profile';
import { FinancialSummary } from '../../types/game';
import { formatINR } from '../../utils/currency';
import { PixelButton } from '../common/PixelButton';
import { PixelBadge } from '../common/PixelBadge';
import { PixelWallet } from '../common/PixelArtIcons';
import { Sliders } from 'lucide-react';

interface HeaderProps {
  profile: UserProfile | null;
  summary: FinancialSummary;
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onNavigateSettings: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  summary,
  onOpenAddExpense,
  onOpenAddIncome,
  onNavigateSettings,
}) => {
  const isNegative = summary.availableBalancePaise < 0;

  return (
    <header className="sticky top-0 z-30 bg-retro-dark/95 border-b-2 border-retro-border backdrop-blur px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Player / Brand Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-retro-panel border-2 border-retro-border shadow-pixel-sm">
            <PixelWallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs sm:text-sm text-neon-lime">
                {profile ? `${profile.nickname.toUpperCase()}.EXE` : 'PLAYER_1'}
              </span>
              {profile && (
                <PixelBadge
                  variant={profile.difficulty === 'HARD' ? 'danger' : profile.difficulty === 'NORMAL' ? 'amber' : 'lime'}
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  {profile.difficulty}
                </PixelBadge>
              )}
            </div>
            <p className="text-[11px] text-cream-muted font-mono hidden sm:block">
              Countdown: <span className="text-amber font-bold">{summary.daysUntilAllowance} days</span> to allowance
            </p>
          </div>
        </div>

        {/* Center/Right: Live Wallet Balance Display */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="bg-retro-panel border-2 border-retro-border px-3 py-1.5 sm:px-4 sm:py-2 shadow-pixel-sm flex items-center gap-2.5">
            <span className="font-pixel text-[9px] sm:text-[10px] text-cream-muted uppercase hidden xs:inline">
              WALLET:
            </span>
            <span
              className={`font-pixel text-xs sm:text-base ${
                isNegative ? 'text-danger-red glow-red' : 'text-neon-lime glow-lime'
              }`}
            >
              {formatINR(summary.availableBalancePaise)}
            </span>
          </div>

          {/* Quick Transaction Action Buttons */}
          <div className="flex items-center gap-2">
            <PixelButton
              variant="danger"
              size="sm"
              onClick={onOpenAddExpense}
              className="text-[10px]"
              title="Add an expense"
            >
              - EXPENSE
            </PixelButton>
            <PixelButton
              variant="lime"
              size="sm"
              onClick={onOpenAddIncome}
              className="text-[10px] hidden sm:inline-flex"
              title="Add income"
            >
              + INCOME
            </PixelButton>
            <button
              onClick={onNavigateSettings}
              className="p-2 bg-retro-panel hover:bg-retro-panel-light border-2 border-retro-border text-cream-muted hover:text-cream shadow-pixel-sm active:translate-x-0.5 active:translate-y-0.5 transition-colors"
              title="Settings"
            >
              <Sliders size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
