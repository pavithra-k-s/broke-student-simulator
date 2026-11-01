import React, { useState } from 'react';
import { PixelButton } from '../components/common/PixelButton';
import { PixelBadge } from '../components/common/PixelBadge';
import { PixelModal } from '../components/common/PixelModal';
import {
  PixelStudent,
  PixelWallet,
  PixelCoin,
  PixelRamen,
  PixelCoffee,
} from '../components/common/PixelArtIcons';
import { Play, RotateCcw, HelpCircle, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types/profile';
import { FinancialSummary } from '../types/game';
import { formatINR } from '../utils/currency';

interface LandingProps {
  hasProfile: boolean;
  profile: UserProfile | null;
  summary: FinancialSummary;
  onStartGame: () => void;
  onContinueGame: () => void;
  onResetGame: () => void;
}

export const Landing: React.FC<LandingProps> = ({
  hasProfile,
  profile,
  summary,
  onStartGame,
  onContinueGame,
  onResetGame,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Floating Pixel Decor */}
      <div className="absolute top-12 left-10 opacity-30 animate-float hidden md:block">
        <PixelRamen className="w-12 h-12" />
      </div>
      <div className="absolute bottom-16 right-12 opacity-30 animate-float hidden md:block">
        <PixelCoffee className="w-12 h-12" />
      </div>
      <div className="absolute top-16 right-16 opacity-30 animate-bounce-slow hidden md:block">
        <PixelCoin className="w-8 h-8" />
      </div>

      {/* Main Start Card */}
      <div className="w-full max-w-2xl bg-retro-panel border-4 border-retro-border p-6 sm:p-10 shadow-pixel-lg text-center relative z-10">
        {/* Corner Pixel Dots */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-neon-lime" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-neon-lime" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-neon-lime" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-neon-lime" />

        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-retro-dark border border-retro-border text-neon-lime font-pixel text-[9px] uppercase tracking-wider mb-6">
          <Sparkles size={12} />
          <span>DAY 1 EDITION • 16-BIT RETRO SURVIVAL</span>
        </div>

        {/* Character and Graphic Cluster */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <PixelWallet className="w-12 h-12 hidden sm:block animate-pulse-subtle" />
          <div className="relative p-3 bg-retro-dark border-2 border-retro-border shadow-pixel">
            <PixelStudent className="w-20 h-20 animate-float" />
          </div>
          <PixelCoin className="w-10 h-10 hidden sm:block animate-bounce-slow" />
        </div>

        {/* Main Heading */}
        <h1 className="font-pixel text-xl sm:text-3xl text-cream tracking-wider uppercase leading-snug mb-3">
          BROKE STUDENT <br />
          <span className="text-neon-lime glow-lime">SIMULATOR</span> 💸
        </h1>

        {/* Tagline & Supporting text */}
        <p className="font-mono text-sm sm:text-base text-amber font-bold italic mb-3">
          "Your money is temporary. Your bad decisions are forever."
        </p>

        <p className="font-mono text-xs sm:text-sm text-cream-muted max-w-lg mx-auto mb-6 leading-relaxed">
          Survive college life, defeat unnecessary expenses, and make it to your next allowance without having to pawn your calculator.
        </p>

        {/* Funny Status Banner */}
        <div className="inline-block bg-danger-red/10 border border-danger-red/40 px-4 py-2 mb-8 text-xs font-mono text-danger-red">
          <span className="font-bold">⚠️ SYSTEM NOTICE:</span> "Your wallet is currently experiencing emotional damage."
        </div>

        {/* Saved Game Status (If existing save file found) */}
        {hasProfile && profile && (
          <div className="mb-6 p-4 bg-retro-dark border-2 border-retro-border text-left">
            <div className="flex items-center justify-between border-b border-retro-border pb-2 mb-2">
              <span className="font-pixel text-[10px] text-neon-lime">
                SAVED SAVE STATE DETECTED
              </span>
              <PixelBadge variant="lime" size="sm">SLOT 1</PixelBadge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-cream-muted gap-2">
              <div>
                Player: <strong className="text-cream">{profile.nickname}</strong> ({profile.difficulty})
              </div>
              <div>
                Wallet:{' '}
                <strong
                  className={
                    summary.availableBalancePaise < 0 ? 'text-danger-red' : 'text-neon-lime'
                  }
                >
                  {formatINR(summary.availableBalancePaise)}
                </strong>{' '}
                • Runway: <strong className="text-amber">{summary.daysUntilAllowance} days</strong>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          {hasProfile ? (
            <>
              <PixelButton
                variant="lime"
                size="lg"
                fullWidth
                onClick={onContinueGame}
                icon={<Play size={16} />}
              >
                CONTINUE GAME
              </PixelButton>

              <PixelButton
                variant="danger"
                size="lg"
                fullWidth
                onClick={() => setShowResetConfirm(true)}
                icon={<RotateCcw size={16} />}
              >
                NEW GAME / RESET
              </PixelButton>
            </>
          ) : (
            <PixelButton
              variant="lime"
              size="lg"
              fullWidth
              onClick={onStartGame}
              icon={<Play size={16} />}
            >
              START GAME
            </PixelButton>
          )}
        </div>

        {/* How to play trigger button */}
        <div className="mt-6">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-cream-muted hover:text-neon-lime transition-colors underline cursor-pointer"
          >
            <HelpCircle size={14} />
            <span>HOW TO PLAY</span>
          </button>
        </div>
      </div>

      {/* HOW TO PLAY MODAL */}
      <PixelModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        title="HOW TO PLAY — SURVIVAL GUIDE"
      >
        <div className="space-y-4 font-mono text-xs text-cream leading-relaxed">
          <div className="p-3 bg-retro-dark border border-retro-border">
            <h4 className="font-pixel text-[11px] text-neon-lime mb-1 uppercase">
              1. KNOW YOUR DAILY RUNWAY
            </h4>
            <p className="text-cream-muted">
              The engine takes your cash, locks away mandatory bills (hostel, wifi), and divides what's left across your remaining days until your next allowance.
            </p>
          </div>

          <div className="p-3 bg-retro-dark border border-retro-border">
            <h4 className="font-pixel text-[11px] text-amber mb-1 uppercase">
              2. LOG EVERY CHAI & SAMOSA
            </h4>
            <p className="text-cream-muted">
              Record both regular inflow (allowance, gigs) and random outflow. Watch your live balance update instantly.
            </p>
          </div>

          <div className="p-3 bg-retro-dark border border-retro-border">
            <h4 className="font-pixel text-[11px] text-lavender mb-1 uppercase">
              3. AVOID THE CRITICAL CONDITION
            </h4>
            <p className="text-cream-muted">
              If your daily limit falls below ₹50, the simulator switches to survival rationing mode. Don't let your wallet flatline!
            </p>
          </div>

          <div className="p-3 bg-retro-dark border border-retro-border">
            <h4 className="font-pixel text-[11px] text-danger-red mb-1 uppercase">
              4. PREPARE FOR DAYS 2 & 3
            </h4>
            <p className="text-cream-muted">
              Tomorrow brings Random Events (surprise group dinners, broken phone screens) and the Temptation Store!
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <PixelButton
              variant="lime"
              size="sm"
              onClick={() => setShowHowToPlay(false)}
            >
              GOT IT, CAPTAIN
            </PixelButton>
          </div>
        </div>
      </PixelModal>

      {/* RESET GAME CONFIRMATION MODAL */}
      <PixelModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="RESET PROFILE & CAMPAIGN?"
      >
        <div className="space-y-4 font-mono text-xs text-cream">
          <div className="flex items-start gap-3 p-3 bg-danger-red/10 border border-danger-red text-danger-red">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>
              Starting a new game will erase your existing player profile, historical transactions, and financial progress. This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <PixelButton
              variant="outline"
              size="sm"
              onClick={() => setShowResetConfirm(false)}
            >
              KEEP EXISTING GAME
            </PixelButton>
            <PixelButton
              variant="danger"
              size="sm"
              onClick={() => {
                setShowResetConfirm(false);
                onResetGame();
              }}
            >
              CONFIRM RESET
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  );
};

