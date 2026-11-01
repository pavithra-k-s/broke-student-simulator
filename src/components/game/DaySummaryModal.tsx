import React, { useState } from 'react';
import { PixelModal } from '../common/PixelModal';
import { PixelButton } from '../common/PixelButton';
import { GamePlayState } from '../../types/gameplay';
import { UserProfile } from '../../types/profile';
import { formatINR } from '../../utils/currency';
import { calculateGameDailyLimit, generateDayEndCommentary } from '../../services/gameEngine';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Flame,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface DaySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gamePlay: GamePlayState;
  profile: UserProfile | null;
  onConfirmAdvanceDay: () => void;
}

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({
  isOpen,
  onClose,
  gamePlay,
  profile,
  onConfirmAdvanceDay,
}) => {
  const [isAdvancing, setIsAdvancing] = useState(false);

  if (!isOpen) return null;

  const daysUntilAllowance = profile ? profile.daysUntilAllowance : 14;
  const gameDailyLimit = calculateGameDailyLimit(gamePlay.openingBalancePaise, daysUntilAllowance);
  const closingBalance = gamePlay.gameBalancePaise;

  const questCompleted = gamePlay.currentQuest.isCompleted;
  const hasImpulse = gamePlay.gameTransactions.some(
    (t) => t.simulatedDay === gamePlay.simulatedDay && t.category === 'Impulse Buys'
  );

  const commentary = generateDayEndCommentary({
    dailySpentPaise: gamePlay.dailySpentPaise,
    dailyLimitPaise: gameDailyLimit,
    closingBalancePaise: closingBalance,
    questCompleted,
    discretionarySpentPaise: gamePlay.discretionarySpentPaise,
    hasImpulsePurchase: hasImpulse,
  });

  const handleNextDayClick = () => {
    if (isAdvancing) return;
    setIsAdvancing(true);
    onConfirmAdvanceDay();
    setTimeout(() => {
      setIsAdvancing(false);
      onClose();
    }, 200);
  };

  return (
    <PixelModal
      isOpen={isOpen}
      onClose={onClose}
      title={`DAY ${gamePlay.simulatedDay} FINANCIAL DEBRIEF`}
      maxWidth="lg"
      icon={<Calendar className="text-amber" size={18} />}
    >
      <div className="space-y-4">
        {/* Dynamic Commentary Banner */}
        <div className="p-3 bg-retro-dark border-2 border-retro-border text-xs sm:text-sm font-mono text-cream leading-relaxed">
          <p className="font-pixel text-[10px] text-neon-lime mb-1 uppercase">
            CAMPUS OBSERVER REPORT:
          </p>
          <p>{commentary}</p>
        </div>

        {/* Financial Flow Ledger Breakdown */}
        <div className="bg-retro-dark/80 border-2 border-retro-border p-4 font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-retro-border pb-2">
            <span className="text-cream-muted">Day Opening Balance:</span>
            <span className="font-pixel text-cream">
              {formatINR(gamePlay.openingBalancePaise)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-cream-muted">Essential Needs Spent:</span>
            <span className="font-mono text-cream">
              {formatINR(gamePlay.essentialSpentPaise)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-cream-muted">Discretionary Spending:</span>
            <span className="font-mono text-amber">
              {formatINR(gamePlay.discretionarySpentPaise)}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-retro-border pb-2">
            <span className="text-cream-muted">Total Day Outflow:</span>
            <span className="font-pixel text-danger-red">
              -{formatINR(gamePlay.dailySpentPaise)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-cream-muted">Target Daily Limit:</span>
            <span className="font-mono text-cream-muted">
              {formatINR(gameDailyLimit)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 font-bold text-sm">
            <span className="text-cream font-pixel text-xs">Closing Balance:</span>
            <span
              className={`font-pixel text-sm ${
                closingBalance < 0 ? 'text-danger-red glow-red' : 'text-neon-lime glow-lime'
              }`}
            >
              {formatINR(closingBalance)}
            </span>
          </div>
        </div>

        {/* Quest and Progression Status */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 bg-retro-dark border border-retro-border">
            <p className="text-[10px] text-cream-muted uppercase font-pixel mb-1">
              DAILY QUEST
            </p>
            <div className="flex items-center gap-1.5">
              {questCompleted ? (
                <>
                  <CheckCircle2 size={16} className="text-neon-lime" />
                  <span className="text-neon-lime font-bold">COMPLETED!</span>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-danger-red" />
                  <span className="text-danger-red font-bold">MISSED</span>
                </>
              )}
            </div>
            <p className="text-[10px] text-cream-muted mt-1 truncate">
              {gamePlay.currentQuest.title}
            </p>
          </div>

          <div className="p-3 bg-retro-dark border border-retro-border">
            <p className="text-[10px] text-cream-muted uppercase font-pixel mb-1">
              SURVIVAL STREAK
            </p>
            <div className="flex items-center gap-1.5 text-amber font-pixel text-sm">
              <Flame size={16} />
              <span>{gamePlay.streak} DAYS</span>
            </div>
            <p className="text-[10px] text-cream-muted mt-1">
              Consecutive on-budget days
            </p>
          </div>
        </div>

        {/* Payday Notice if about to hit day 0 */}
        {daysUntilAllowance === 1 && (
          <div className="p-3 bg-neon-lime/20 border-2 border-neon-lime text-neon-lime font-mono text-xs flex items-center gap-2">
            <Sparkles size={16} />
            <span>
              🎉 TOMORROW IS PAYDAY! Your monthly allowance will drop upon day advancement.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-retro-border">
          <PixelButton
            variant="outline"
            size="md"
            onClick={onClose}
          >
            REVIEW TODAY
          </PixelButton>

          <PixelButton
            variant="lime"
            size="lg"
            onClick={handleNextDayClick}
            disabled={isAdvancing}
            icon={<ArrowRight size={16} />}
          >
            {isAdvancing ? 'ADVANCING...' : `ADVANCE TO DAY ${gamePlay.simulatedDay + 1} ▶`}
          </PixelButton>
        </div>
      </div>
    </PixelModal>
  );
};
