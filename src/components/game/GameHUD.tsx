import React from 'react';
import { GamePlayState } from '../../types/gameplay';
import { UserProfile } from '../../types/profile';
import { formatINR } from '../../utils/currency';
import { calculateLevelInfo } from '../../services/xpEngine';
import { calculateGameDailyLimit } from '../../services/gameEngine';
import { PixelBadge } from '../common/PixelBadge';
import { Flame, Calendar, Sparkles } from 'lucide-react';

interface GameHUDProps {
  profile: UserProfile | null;
  gamePlay: GamePlayState;
}

export const GameHUD: React.FC<GameHUDProps> = ({ profile, gamePlay }) => {
  const levelInfo = calculateLevelInfo(gamePlay.xp);
  const daysUntilAllowance = profile ? profile.daysUntilAllowance : 14;
  const gameDailyLimit = calculateGameDailyLimit(gamePlay.gameBalancePaise, daysUntilAllowance);
  const isNegative = gamePlay.gameBalancePaise < 0;

  return (
    <div className="bg-retro-panel border-4 border-retro-border p-4 shadow-pixel-lg">
      {/* Top Strip: Player Identity, Day Counter, and Survival Streak */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-retro-border/60 pb-3 mb-3">
        {/* Player & Level Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-retro-dark border-2 border-retro-border flex items-center justify-center font-pixel text-xs text-neon-lime shadow-pixel-sm">
            Lv{levelInfo.level}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs sm:text-sm text-neon-lime">
                {profile ? `${profile.nickname.toUpperCase()}.EXE` : 'PLAYER_1'}
              </span>
              <PixelBadge variant="lime" size="sm">
                {levelInfo.title}
              </PixelBadge>
            </div>
            <p className="font-mono text-[11px] text-cream-muted">
              SIMULATED SURVIVAL CAMPAIGN
            </p>
          </div>
        </div>

        {/* Day & Streak Indicators */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Simulated Day */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-retro-dark border border-retro-border">
            <Calendar size={13} className="text-amber" />
            <span className="font-pixel text-[11px] text-amber">
              DAY {gamePlay.simulatedDay}
            </span>
          </div>

          {/* Survival Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-retro-dark border border-retro-border">
            <Flame size={14} className={gamePlay.streak > 0 ? 'text-amber animate-pulse' : 'text-cream-muted'} />
            <span className="font-pixel text-[10px] text-cream">
              {gamePlay.streak} {gamePlay.streak === 1 ? 'DAY' : 'DAYS'} STREAK
            </span>
          </div>
        </div>
      </div>

      {/* Main HUD Row: Balance, Daily Limit, Allowance Countdown, and XP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Game Balance */}
        <div className="bg-retro-dark/80 border-2 border-retro-border p-3 text-center sm:text-left">
          <span className="font-pixel text-[9px] text-cream-muted uppercase block mb-1">
            GAME WALLET BALANCE
          </span>
          <p
            className={`font-pixel text-sm sm:text-lg ${
              isNegative ? 'text-danger-red glow-red' : 'text-neon-lime glow-lime'
            }`}
          >
            {formatINR(gamePlay.gameBalancePaise)}
          </p>
          <span className="font-mono text-[10px] text-cream-muted">
            Spent Today: {formatINR(gamePlay.dailySpentPaise)}
          </span>
        </div>

        {/* 2. Daily Runway Limit */}
        <div className="bg-retro-dark/80 border-2 border-retro-border p-3 text-center sm:text-left">
          <span className="font-pixel text-[9px] text-cream-muted uppercase block mb-1">
            SAFE DAILY RUNWAY
          </span>
          <p
            className={`font-pixel text-sm sm:text-lg ${
              gameDailyLimit <= 0
                ? 'text-danger-red'
                : gameDailyLimit < 15000
                ? 'text-amber'
                : 'text-neon-lime'
            }`}
          >
            {formatINR(gameDailyLimit)}
            <span className="text-xs font-mono font-normal text-cream-muted">/day</span>
          </p>
          <span className="font-mono text-[10px] text-cream-muted">
            Based on {daysUntilAllowance} days left
          </span>
        </div>

        {/* 3. Allowance Drop Countdown */}
        <div className="bg-retro-dark/80 border-2 border-retro-border p-3 text-center sm:text-left">
          <span className="font-pixel text-[9px] text-cream-muted uppercase block mb-1">
            PAYDAY HORIZON
          </span>
          <p className="font-pixel text-sm sm:text-lg text-amber">
            {daysUntilAllowance} DAYS
          </p>
          <span className="font-mono text-[10px] text-cream-muted">
            Allowance: {profile ? formatINR(profile.monthlyAllowancePaise) : '₹0'}
          </span>
        </div>

        {/* 4. RPG XP Progress */}
        <div className="bg-retro-dark/80 border-2 border-retro-border p-3">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="font-pixel text-[9px] text-lavender uppercase flex items-center gap-1">
              <Sparkles size={11} /> XP PROGRESS
            </span>
            <span className="font-pixel text-[9px] text-cream">
              {gamePlay.xp} XP
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full h-2.5 bg-retro-panel border border-retro-border p-0.5 mt-1">
            <div
              className="h-full bg-lavender transition-all duration-300 shadow-pixel-sm"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <p className="font-mono text-[10px] text-cream-muted mt-1 text-right">
            {levelInfo.currentLevelXp}/{levelInfo.xpNeededForNext} to Level {levelInfo.level + 1}
          </p>
        </div>
      </div>
    </div>
  );
};
