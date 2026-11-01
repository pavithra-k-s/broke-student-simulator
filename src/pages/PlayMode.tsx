import React, { useState } from 'react';
import { GamePlayState } from '../types/gameplay';
import { UserProfile } from '../types/profile';
import { GameHUD } from '../components/game/GameHUD';
import { CampusEnvironment } from '../components/game/CampusEnvironment';
import { DailyQuestCard } from '../components/game/DailyQuestCard';
import { EventDialogue } from '../components/game/EventDialogue';
import { DaySummaryModal } from '../components/game/DaySummaryModal';
import { PixelButton } from '../components/common/PixelButton';
import { formatINR } from '../utils/currency';
import {
  ShoppingBag,
  Moon,
  ReceiptText,
  RotateCcw,
} from 'lucide-react';
import { PixelModal } from '../components/common/PixelModal';

interface PlayModeProps {
  gamePlay: GamePlayState;
  profile: UserProfile | null;
  onSelectEventChoice: (choiceId: string) => void;
  onClaimQuestReward: () => void;
  onOpenDaySummary: () => void;
  onCloseDaySummary: () => void;
  onConfirmAdvanceDay: () => void;
  onNavigateStore: () => void;
  onResetSimulationOnly: () => void;
}

export const PlayMode: React.FC<PlayModeProps> = ({
  gamePlay,
  profile,
  onSelectEventChoice,
  onClaimQuestReward,
  onOpenDaySummary,
  onCloseDaySummary,
  onConfirmAdvanceDay,
  onNavigateStore,
  onResetSimulationOnly,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const todayGameTransactions = gamePlay.gameTransactions.filter(
    (tx) => tx.simulatedDay === gamePlay.simulatedDay
  );

  return (
    <div className="space-y-6">
      {/* 1. Main Game HUD */}
      <GameHUD profile={profile} gamePlay={gamePlay} />

      {/* 2. Campus Visual Environment */}
      <CampusEnvironment
        simulatedDay={gamePlay.simulatedDay}
        gameBalancePaise={gamePlay.gameBalancePaise}
        dailySpentPaise={gamePlay.dailySpentPaise}
        streak={gamePlay.streak}
      />

      {/* 3. Daily Quest Objective */}
      <DailyQuestCard
        quest={gamePlay.currentQuest}
        onClaimReward={onClaimQuestReward}
      />

      {/* 4. Daily Campus Event Encounter */}
      <EventDialogue
        event={gamePlay.currentEvent}
        eventResolved={gamePlay.eventResolved}
        selectedChoiceId={gamePlay.eventChoiceId}
        onSelectChoice={onSelectEventChoice}
      />

      {/* 5. Gameplay Action Control Bar */}
      <div className="bg-retro-panel border-2 border-retro-border p-4 shadow-pixel flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <PixelButton
            variant="amber"
            size="md"
            onClick={onNavigateStore}
            icon={<ShoppingBag size={16} />}
            className="w-full sm:w-auto"
          >
            TEMPTATION STORE 🛒
          </PixelButton>

          <button
            onClick={() => setShowHistory(true)}
            className="p-2.5 bg-retro-dark border border-retro-border text-cream-muted hover:text-neon-lime transition-colors shrink-0"
            title="View today's game log"
          >
            <ReceiptText size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <PixelButton
            variant="lime"
            size="md"
            onClick={onOpenDaySummary}
            icon={<Moon size={16} />}
            className="w-full sm:w-auto"
          >
            FINISH & END DAY {gamePlay.simulatedDay} 🌙
          </PixelButton>
        </div>
      </div>

      {/* 6. Today's Game Ledger Quick Preview */}
      <div className="bg-retro-panel border-2 border-retro-border p-4 shadow-pixel">
        <div className="flex items-center justify-between border-b border-retro-border/60 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <ReceiptText size={14} className="text-neon-lime" />
            <h4 className="font-pixel text-[11px] text-cream uppercase">
              DAY {gamePlay.simulatedDay} GAMEPLAY LOG
            </h4>
          </div>
          <span className="font-mono text-[10px] text-cream-muted">
            {todayGameTransactions.length} actions today (Game Money only)
          </span>
        </div>

        {todayGameTransactions.length === 0 ? (
          <p className="font-mono text-xs text-cream-muted italic py-2 text-center">
            No purchases or event expenses logged yet today. Your opening balance of {formatINR(gamePlay.openingBalancePaise)} remains untouched.
          </p>
        ) : (
          <div className="divide-y divide-retro-border/40 font-mono text-xs">
            {todayGameTransactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="py-1.5 flex items-center justify-between">
                <span className="text-cream truncate max-w-xs">{tx.description}</span>
                <span
                  className={`font-pixel text-[10px] ${
                    tx.type === 'income' ? 'text-neon-lime' : 'text-danger-red'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  {formatINR(tx.amountPaise)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Day End Summary & Advancement Modal */}
      <DaySummaryModal
        isOpen={gamePlay.isDayEnded}
        onClose={onCloseDaySummary}
        gamePlay={gamePlay}
        profile={profile}
        onConfirmAdvanceDay={onConfirmAdvanceDay}
      />

      {/* Full Simulated History Modal */}
      <PixelModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="SIMULATED GAME TRANSACTION HISTORY"
        maxWidth="lg"
      >
        <div className="space-y-3 font-mono text-xs">
          <p className="text-cream-muted text-[11px]">
            This ledger tracks fictional Play Mode transactions. Real-world budgeting records remain safely separated in the main Dashboard.
          </p>
          <div className="max-h-72 overflow-y-auto divide-y divide-retro-border border border-retro-border bg-retro-dark p-2">
            {gamePlay.gameTransactions.length === 0 ? (
              <p className="py-4 text-center text-cream-muted">No simulated game transactions yet.</p>
            ) : (
              gamePlay.gameTransactions.map((tx) => (
                <div key={tx.id} className="py-2 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-cream font-bold">{tx.description}</p>
                    <p className="text-[10px] text-cream-muted">
                      Day {tx.simulatedDay} • {tx.category}
                    </p>
                  </div>
                  <span
                    className={`font-pixel text-[11px] shrink-0 ${
                      tx.type === 'income' ? 'text-neon-lime' : 'text-danger-red'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatINR(tx.amountPaise)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                setShowHistory(false);
                setShowResetConfirm(true);
              }}
              className="font-mono text-xs text-danger-red hover:underline flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Reset Game Simulation Back to Day 1</span>
            </button>

            <PixelButton
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(false)}
            >
              CLOSE
            </PixelButton>
          </div>
        </div>
      </PixelModal>

      {/* Reset Simulation Confirmation */}
      <PixelModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="RESET SIMULATOR PROGRESS?"
      >
        <div className="space-y-4 font-mono text-xs text-cream">
          <p>
            Restart simulated Play Mode from Day 1?
          </p>
          <div className="p-3 bg-neon-lime/10 border border-neon-lime text-neon-lime">
            ✓ Your real personal transactions and profile balance will <strong>NOT</strong> be deleted. Only the fictional simulation is reset.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <PixelButton
              variant="outline"
              size="sm"
              onClick={() => setShowResetConfirm(false)}
            >
              CANCEL
            </PixelButton>
            <PixelButton
              variant="danger"
              size="sm"
              onClick={() => {
                onResetSimulationOnly();
                setShowResetConfirm(false);
              }}
            >
              RESET SIMULATION
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  );
};
