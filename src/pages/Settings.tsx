import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types/profile';
import { AppSettings } from '../types/game';
import { PixelInput } from '../components/common/PixelInput';
import { PixelButton } from '../components/common/PixelButton';
import { PixelModal } from '../components/common/PixelModal';
import { parseInputToPaise, paiseToRupees } from '../utils/currency';
import { Sliders, Monitor, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile | null;
  settings: AppSettings;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  onResetGame: () => void;
  onBackToDashboard: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  profile,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onResetGame,
  onBackToDashboard,
}) => {
  // Form state initialized with profile
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [allowanceInput, setAllowanceInput] = useState(
    profile ? paiseToRupees(profile.monthlyAllowancePaise).toString() : '0'
  );
  const [daysInput, setDaysInput] = useState(
    profile ? profile.daysUntilAllowance.toString() : '1'
  );
  const [savingsInput, setSavingsInput] = useState(
    profile ? paiseToRupees(profile.savingsGoalPaise).toString() : '0'
  );

  const [savedNotice, setSavedNotice] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname);
      setAllowanceInput(paiseToRupees(profile.monthlyAllowancePaise).toString());
      setDaysInput(profile.daysUntilAllowance.toString());
      setSavingsInput(paiseToRupees(profile.savingsGoalPaise).toString());
    }
  }, [profile]);

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    onUpdateProfile({
      nickname: nickname.trim() || profile.nickname,
      monthlyAllowancePaise: parseInputToPaise(allowanceInput),
      daysUntilAllowance: Math.max(1, parseInt(daysInput, 10) || 1),
      savingsGoalPaise: parseInputToPaise(savingsInput),
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Settings Header */}
      <div className="bg-retro-panel border-2 border-retro-border p-4 sm:p-5 shadow-pixel flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-retro-dark border border-retro-border text-neon-lime">
            <Sliders size={20} />
          </div>
          <div>
            <h2 className="font-pixel text-xs sm:text-sm text-cream uppercase">
              SIMULATOR SETTINGS & PREFERENCES
            </h2>
            <p className="font-mono text-xs text-cream-muted">
              Configure parameters, CRT filters, or reset campaign
            </p>
          </div>
        </div>

        <PixelButton
          variant="outline"
          size="sm"
          onClick={onBackToDashboard}
        >
          BACK
        </PixelButton>
      </div>

      {/* Financial & Profile Configuration */}
      {profile && (
        <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel">
          <div className="border-b border-retro-border/60 pb-3 mb-4">
            <h3 className="font-pixel text-xs text-neon-lime uppercase">
              FINANCIAL PARAMETERS
            </h3>
            <p className="font-mono text-xs text-cream-muted">
              Adjust your monthly budget horizon and targets
            </p>
          </div>

          <form onSubmit={handleSaveProfileSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PixelInput
                label="Player Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />

              <PixelInput
                label="Days Until Next Allowance"
                type="number"
                min="1"
                max="365"
                suffix="Days"
                value={daysInput}
                onChange={(e) => setDaysInput(e.target.value)}
                required
              />

              <PixelInput
                label="Expected Allowance (INR)"
                type="number"
                prefix="₹"
                min="0"
                value={allowanceInput}
                onChange={(e) => setAllowanceInput(e.target.value)}
                required
              />

              <PixelInput
                label="Savings Goal (INR)"
                type="number"
                prefix="₹"
                min="0"
                value={savingsInput}
                onChange={(e) => setSavingsInput(e.target.value)}
              />
            </div>

            {savedNotice && (
              <div className="p-2 bg-neon-lime/20 border border-neon-lime text-neon-lime font-mono text-xs flex items-center gap-2">
                <CheckCircle size={14} />
                <span>Financial configuration updated successfully!</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <PixelButton variant="lime" size="md" type="submit">
                SAVE CHANGES
              </PixelButton>
            </div>
          </form>
        </div>
      )}

      {/* Visual & Retro Audio/Effect Settings */}
      <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel">
        <div className="border-b border-retro-border/60 pb-3 mb-4 flex items-center gap-2">
          <Monitor size={16} className="text-lavender" />
          <h3 className="font-pixel text-xs text-lavender uppercase">
            RETRO GRAPHICS & IMMERSION
          </h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {/* CRT Toggle */}
          <div className="flex items-center justify-between p-3 bg-retro-dark border border-retro-border">
            <div>
              <p className="font-bold text-cream">CRT Scanline & Flicker Effect</p>
              <p className="text-[11px] text-cream-muted">
                Simulates a genuine 1990s cathode ray tube arcade monitor.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ crtEffect: !settings.crtEffect })}
              className={`px-3 py-1 font-pixel text-[10px] border-2 transition-colors ${
                settings.crtEffect
                  ? 'bg-neon-lime text-retro-dark border-neon-lime shadow-pixel-sm font-bold'
                  : 'bg-retro-panel text-cream-muted border-retro-border'
              }`}
            >
              {settings.crtEffect ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Animations Toggle */}
          <div className="flex items-center justify-between p-3 bg-retro-dark border border-retro-border">
            <div>
              <p className="font-bold text-cream">Pixel UI Animations</p>
              <p className="text-[11px] text-cream-muted">
                Subtle floating and bouncing retro sprite motion.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ animations: !settings.animations })}
              className={`px-3 py-1 font-pixel text-[10px] border-2 transition-colors ${
                settings.animations
                  ? 'bg-neon-lime text-retro-dark border-neon-lime shadow-pixel-sm font-bold'
                  : 'bg-retro-panel text-cream-muted border-retro-border'
              }`}
            >
              {settings.animations ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Hard Reset Game */}
      <div className="bg-retro-panel border-2 border-danger-red/60 p-5 shadow-pixel">
        <div className="border-b border-danger-red/30 pb-3 mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-danger-red" />
          <h3 className="font-pixel text-xs text-danger-red uppercase">
            DANGER ZONE: RESTART CAMPAIGN
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="font-mono text-xs text-cream-muted">
            Wipe your player profile, all transactions, and restart the onboarding process from zero.
          </p>
          <PixelButton
            variant="danger"
            size="md"
            onClick={() => setShowResetConfirm(true)}
            icon={<RotateCcw size={14} />}
          >
            RESET GAME
          </PixelButton>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <PixelModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="CONFIRM PROFILE RESET"
      >
        <div className="space-y-4 font-mono text-xs text-cream">
          <p>
            Are you completely certain? Resetting will wipe all local storage data, including your financial history and custom configurations.
          </p>
          <div className="p-3 bg-danger-red/10 border border-danger-red text-danger-red font-bold">
            ⚠️ This will send you back to the Start Game screen immediately.
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
                setShowResetConfirm(false);
                onResetGame();
              }}
            >
              CONFIRM HARD RESET
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  );
};

