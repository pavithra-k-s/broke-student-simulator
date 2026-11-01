import React, { useState } from 'react';
import { UserProfile, FixedExpenseItem } from '../types/profile';
import { GameSaveData } from '../types/game';
import { exportBackupJSON, validateAndParseBackupJSON } from '../services/backupEngine';
import { paiseToRupees, rupeesToPaise } from '../utils/currency';
import {
  User,
  Sliders,
  DollarSign,
  AlertTriangle,
  Download,
  Upload,
  CheckCircle,
  Plus,
  Trash2,
  Tv,
  Sparkles,
  Volume2,
  Gamepad2,
  RotateCcw
} from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  fullSaveData: GameSaveData;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetGameOnly: () => void;
  onResetRealLedgerOnly: () => void;
  onFullReset: () => void;
  onImportFullBackup: (importedData: GameSaveData) => void;
  onLoadDemoMode: () => void;
  onExitDemoMode?: () => void;
  isDemoMode?: boolean;
}

export const Settings: React.FC<SettingsProps> = ({
  profile,
  fullSaveData,
  onUpdateProfile,
  onResetGameOnly,
  onResetRealLedgerOnly,
  onFullReset,
  onImportFullBackup,
  onLoadDemoMode,
  onExitDemoMode,
  isDemoMode = false,
}) => {
  // Local editable form state
  const [nickname, setNickname] = useState(profile.nickname);
  const [monthlyAllowance, setMonthlyAllowance] = useState(
    paiseToRupees(profile.monthlyAllowancePaise).toString()
  );
  const [daysRemaining, setDaysRemaining] = useState(profile.daysUntilAllowance.toString());
  const [savingsGoal, setSavingsGoal] = useState(
    paiseToRupees(profile.savingsGoalPaise || 0).toString()
  );
  const [essentialDailyBaseline, setEssentialDailyBaseline] = useState(
    paiseToRupees(profile.dailyEssentialEstimatePaise || 15000).toString()
  );
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpenseItem[]>(
    profile.fixedExpenses || []
  );

  // Appearance & Audio state (persisted on profile or localStorage)
  const [crtEffect, setCrtEffect] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [retroAnimations, setRetroAnimations] = useState(true);

  // New fixed expense form
  const [newExpName, setNewExpName] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals for destructive actions
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    action: () => {},
  });

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const allowanceNum = parseFloat(monthlyAllowance);
    const daysNum = parseInt(daysRemaining, 10);
    const goalNum = parseFloat(savingsGoal);
    const baselineNum = parseFloat(essentialDailyBaseline);

    if (!nickname.trim()) {
      showStatus('Nickname cannot be empty, Player!', 'error');
      return;
    }
    if (isNaN(allowanceNum) || allowanceNum <= 0) {
      showStatus('Please enter a valid monthly allowance (₹ > 0)', 'error');
      return;
    }
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 60) {
      showStatus('Days remaining must be between 1 and 60', 'error');
      return;
    }

    const updated: UserProfile = {
      ...profile,
      nickname: nickname.trim(),
      monthlyAllowancePaise: rupeesToPaise(allowanceNum),
      daysUntilAllowance: daysNum,
      savingsGoalPaise: isNaN(goalNum) ? 0 : rupeesToPaise(Math.max(0, goalNum)),
      dailyEssentialEstimatePaise: isNaN(baselineNum) ? 15000 : rupeesToPaise(Math.max(0, baselineNum)),
      fixedExpenses,
      lastUpdated: Date.now(),
    };

    onUpdateProfile(updated);
    showStatus('Profile & budget settings saved to cartridge! 💾');
  };

  const handleAddFixedExpense = () => {
    const amount = parseFloat(newExpAmount);
    if (!newExpName.trim() || isNaN(amount) || amount <= 0) {
      showStatus('Enter valid name and amount for fixed expense', 'error');
      return;
    }

    const newExpense: FixedExpenseItem = {
      id: `fixed_${Date.now()}`,
      name: newExpName.trim(),
      amountPaise: rupeesToPaise(amount),
      category: 'Other',
      isPaid: false,
    };

    setFixedExpenses((prev) => [...prev, newExpense]);
    setNewExpName('');
    setNewExpAmount('');
    showStatus(`Added fixed expense: ${newExpense.name}`);
  };

  const handleRemoveFixedExpense = (id: string) => {
    setFixedExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    exportBackupJSON(fullSaveData);
    showStatus('JSON Backup exported to downloads! 📦');
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = validateAndParseBackupJSON(content);
      if (result.isValid && result.data) {
        onImportFullBackup(result.data);
        showStatus('Backup successfully restored! 🚀');
      } else {
        showStatus(result.error || 'Invalid backup file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-panel-border pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Sliders className="w-6 h-6 text-neon-lime" />
            <h1 className="font-pixel text-xl md:text-2xl text-cream">SYSTEM CONFIG</h1>
          </div>
          <p className="font-mono text-xs md:text-sm text-cream/70 mt-1">
            Manage your budget parameters, character settings, data backup, and game engine controls.
          </p>
        </div>

        {/* DEMO MODE BADGE / TOGGLE */}
        <div className="flex items-center gap-2">
          {isDemoMode ? (
            <div className="flex items-center gap-2 bg-amber/20 border-2 border-amber px-3 py-1.5 rounded">
              <span className="font-pixel text-[10px] text-amber animate-pulse">● DEMO ACTIVE</span>
              {onExitDemoMode && (
                <button
                  onClick={onExitDemoMode}
                  className="font-pixel text-[9px] bg-amber text-bg px-2 py-0.5 rounded hover:bg-cream transition-colors"
                >
                  EXIT DEMO
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onLoadDemoMode}
              className="font-pixel text-[10px] flex items-center gap-2 bg-lavender/20 border-2 border-lavender text-lavender px-3 py-2 rounded hover:bg-lavender hover:text-bg transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              LOAD DEMO CARTRIDGE
            </button>
          )}
        </div>
      </div>

      {/* STATUS TOAST NOTIFICATION */}
      {statusMsg && (
        <div
          className={`p-3 border-2 font-mono text-xs flex items-center gap-2 rounded animate-bounce ${
            statusMsg.type === 'error'
              ? 'bg-danger/20 border-danger text-danger'
              : 'bg-neon-lime/20 border-neon-lime text-neon-lime'
          }`}
        >
          {statusMsg.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. CHARACTER & FINANCIAL PROFILE */}
        <div className="bg-panel border-2 border-panel-border rounded p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-panel-border pb-2">
            <User className="w-4 h-4 text-neon-lime" />
            <h2 className="font-pixel text-xs text-neon-lime">SURVIVOR PROFILE</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-cream/70 mb-1">
                PLAYER NICKNAME
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-bg border-2 border-panel-border focus:border-neon-lime px-3 py-2 text-cream font-mono text-sm rounded outline-none"
                placeholder="e.g. BrokeScholar_99"
                maxLength={20}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-cream/70 mb-1">
                  MONTHLY ALLOWANCE (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-xs text-cream/40">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={monthlyAllowance}
                    onChange={(e) => setMonthlyAllowance(e.target.value)}
                    className="w-full bg-bg border-2 border-panel-border focus:border-neon-lime pl-7 pr-3 py-2 text-cream font-mono text-sm rounded outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-cream/70 mb-1">
                  DAYS UNTIL ALLOWANCE
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={daysRemaining}
                  onChange={(e) => setDaysRemaining(e.target.value)}
                  className="w-full bg-bg border-2 border-panel-border focus:border-neon-lime px-3 py-2 text-cream font-mono text-sm rounded outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-cream/70 mb-1">
                  MONTHLY SAVINGS GOAL (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-xs text-cream/40">₹</span>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(e.target.value)}
                    className="w-full bg-bg border-2 border-panel-border focus:border-neon-lime pl-7 pr-3 py-2 text-cream font-mono text-sm rounded outline-none"
                    placeholder="e.g. 1000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-cream/70 mb-1">
                  ESSENTIAL DAILY BASELINE (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-xs text-cream/40">₹</span>
                  <input
                    type="number"
                    step="10"
                    min="0"
                    value={essentialDailyBaseline}
                    onChange={(e) => setEssentialDailyBaseline(e.target.value)}
                    className="w-full bg-bg border-2 border-panel-border focus:border-neon-lime pl-7 pr-3 py-2 text-cream font-mono text-sm rounded outline-none"
                    placeholder="e.g. 150"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-neon-lime text-bg font-pixel text-xs rounded hover:bg-neon-lime/90 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              SAVE PROFILE SETTINGS
            </button>
          </form>
        </div>

        {/* 2. FIXED EXPENSES (RENT, MESS, WIFI) */}
        <div className="bg-panel border-2 border-panel-border rounded p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-panel-border pb-2">
            <DollarSign className="w-4 h-4 text-amber" />
            <h2 className="font-pixel text-xs text-amber">MONTHLY FIXED EXPENSES</h2>
          </div>

          <p className="font-mono text-xs text-cream/70">
            Commitments deducted before calculating your daily safe spending allowance.
          </p>

          {/* List of Fixed Expenses */}
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {fixedExpenses.length === 0 ? (
              <p className="font-mono text-xs text-cream/40 italic py-2">
                No fixed expenses configured yet. Add rent, mess fees, or subscriptions below!
              </p>
            ) : (
              fixedExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between bg-bg/80 border border-panel-border px-3 py-2 rounded font-mono text-xs"
                >
                  <span className="text-cream">{exp.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-amber font-bold">₹{paiseToRupees(exp.amountPaise).toFixed(0)}</span>
                    <button
                      onClick={() => handleRemoveFixedExpense(exp.id)}
                      className="text-danger hover:text-cream transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Fixed Expense Input */}
          <div className="flex gap-2 pt-2 border-t border-panel-border">
            <input
              type="text"
              placeholder="Expense Name (e.g. Wifi)"
              value={newExpName}
              onChange={(e) => setNewExpName(e.target.value)}
              className="flex-1 bg-bg border border-panel-border focus:border-amber px-2.5 py-1.5 text-cream font-mono text-xs rounded outline-none"
            />
            <input
              type="number"
              placeholder="₹ Amount"
              value={newExpAmount}
              onChange={(e) => setNewExpAmount(e.target.value)}
              className="w-24 bg-bg border border-panel-border focus:border-amber px-2.5 py-1.5 text-cream font-mono text-xs rounded outline-none"
            />
            <button
              onClick={handleAddFixedExpense}
              className="bg-amber text-bg font-pixel text-[10px] px-3 py-1.5 rounded hover:bg-amber/90 transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> ADD
            </button>
          </div>
        </div>

        {/* 3. APPEARANCE & AUDIO PREFERENCES */}
        <div className="bg-panel border-2 border-panel-border rounded p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-panel-border pb-2">
            <Tv className="w-4 h-4 text-lavender" />
            <h2 className="font-pixel text-xs text-lavender">RETRO DISPLAY & AUDIO</h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 bg-bg/50 border border-panel-border rounded">
              <div className="flex items-center gap-2 text-cream">
                <Tv className="w-4 h-4 text-lavender" />
                <span>CRT Scanlines & Phosphor Glow</span>
              </div>
              <button
                onClick={() => setCrtEffect(!crtEffect)}
                className={`font-pixel text-[9px] px-2.5 py-1 rounded transition-colors ${
                  crtEffect ? 'bg-neon-lime text-bg' : 'bg-panel-border text-cream/50'
                }`}
              >
                {crtEffect ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-bg/50 border border-panel-border rounded">
              <div className="flex items-center gap-2 text-cream">
                <Volume2 className="w-4 h-4 text-amber" />
                <span>8-Bit Audio & FX Cues</span>
              </div>
              <button
                onClick={() => setSoundEffects(!soundEffects)}
                className={`font-pixel text-[9px] px-2.5 py-1 rounded transition-colors ${
                  soundEffects ? 'bg-neon-lime text-bg' : 'bg-panel-border text-cream/50'
                }`}
              >
                {soundEffects ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-bg/50 border border-panel-border rounded">
              <div className="flex items-center gap-2 text-cream">
                <Sparkles className="w-4 h-4 text-neon-lime" />
                <span>Pixel Animations & XP Floaters</span>
              </div>
              <button
                onClick={() => setRetroAnimations(!retroAnimations)}
                className={`font-pixel text-[9px] px-2.5 py-1 rounded transition-colors ${
                  retroAnimations ? 'bg-neon-lime text-bg' : 'bg-panel-border text-cream/50'
                }`}
              >
                {retroAnimations ? 'ENABLED' : 'REDUCED'}
              </button>
            </div>
          </div>
        </div>

        {/* 4. BACKUP, EXPORT & RESTORE */}
        <div className="bg-panel border-2 border-panel-border rounded p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-panel-border pb-2">
            <Download className="w-4 h-4 text-neon-lime" />
            <h2 className="font-pixel text-xs text-neon-lime">DATA CARTRIDGE BACKUP</h2>
          </div>

          <p className="font-mono text-xs text-cream/70">
            Export a full JSON backup cartridge containing your profile, real transactions, game state, and achievements.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleExportBackup}
              className="flex-1 py-2.5 px-3 bg-panel-border hover:bg-neon-lime/20 border-2 border-neon-lime text-neon-lime font-pixel text-[10px] rounded transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              EXPORT BACKUP (.JSON)
            </button>

            <label className="flex-1 py-2.5 px-3 bg-panel-border hover:bg-lavender/20 border-2 border-lavender text-lavender font-pixel text-[10px] rounded transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>RESTORE BACKUP</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 5. DANGER ZONE / RESET CONTROLS */}
      <div className="bg-panel border-2 border-danger/40 rounded p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-danger/30 pb-2">
          <AlertTriangle className="w-4 h-4 text-danger" />
          <h2 className="font-pixel text-xs text-danger">DANGER ZONE & RESETS</h2>
        </div>

        <p className="font-mono text-xs text-cream/70">
          Selective reset operations. Note: Game simulation and real budget records are separate, so you can reset either independently without damaging the other.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Reset Simulation Only */}
          <div className="border border-panel-border bg-bg/40 p-4 rounded flex flex-col justify-between">
            <div className="space-y-1 mb-4">
              <h3 className="font-pixel text-[10px] text-amber">RESET GAME RUN</h3>
              <p className="font-mono text-[11px] text-cream/60">
                Resets the Day 1–30 simulation run, XP, and game inventory. Leaves your real transactions intact.
              </p>
            </div>
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  title: 'RESET GAME SIMULATION?',
                  description:
                    'This will reset your simulated gameplay days, game balance, and streak back to Day 1. Your REAL transactions and budget history will NOT be affected.',
                  confirmText: 'RESET SIMULATION',
                  action: () => {
                    onResetGameOnly();
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                    showStatus('Game simulation reset to Day 1! 🎮');
                  },
                })
              }
              className="py-2 px-3 border border-amber/60 text-amber hover:bg-amber hover:text-bg font-pixel text-[9px] rounded transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> RESET GAME RUN
            </button>
          </div>

          {/* Reset Real Transactions Only */}
          <div className="border border-panel-border bg-bg/40 p-4 rounded flex flex-col justify-between">
            <div className="space-y-1 mb-4">
              <h3 className="font-pixel text-[10px] text-danger">CLEAR REAL LEDGER</h3>
              <p className="font-mono text-[11px] text-cream/60">
                Clears all logged real expense & income transactions. Keeps your player profile and game simulation intact.
              </p>
            </div>
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  title: 'CLEAR REAL TRANSACTIONS?',
                  description:
                    'This will permanently delete all real income and expense entries in your ledger. Your character profile and simulation game progress will NOT be touched.',
                  confirmText: 'CLEAR LEDGER',
                  action: () => {
                    onResetRealLedgerOnly();
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                    showStatus('Real transaction ledger cleared.');
                  },
                })
              }
              className="py-2 px-3 border border-danger/60 text-danger hover:bg-danger hover:text-cream font-pixel text-[9px] rounded transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> CLEAR REAL LEDGER
            </button>
          </div>

          {/* Full Nuclear Wipe */}
          <div className="border border-danger/50 bg-danger/10 p-4 rounded flex flex-col justify-between">
            <div className="space-y-1 mb-4">
              <h3 className="font-pixel text-[10px] text-danger animate-pulse">NUCLEAR WIPE</h3>
              <p className="font-mono text-[11px] text-cream/60">
                Erase everything: profile, real transactions, game state, and achievements. Return to fresh landing.
              </p>
            </div>
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  title: 'CONFIRM NUCLEAR FACTORY RESET?',
                  description:
                    'THIS CANNOT BE UNDONE. All profile records, real transactions, achievements, and game progression will be wiped from LocalStorage.',
                  confirmText: 'WIPE EVERYTHING',
                  action: () => {
                    onFullReset();
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                  },
                })
              }
              className="py-2 px-3 bg-danger text-cream hover:bg-danger/80 font-pixel text-[9px] rounded transition-all flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> FACTORY RESET
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-panel border-4 border-danger rounded max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-danger">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h3 className="font-pixel text-sm">{confirmModal.title}</h3>
            </div>
            <p className="font-mono text-xs text-cream/80 leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2 font-mono text-xs border border-panel-border text-cream/80 hover:text-cream rounded"
              >
                CANCEL
              </button>
              <button
                onClick={confirmModal.action}
                className="flex-1 py-2 font-pixel text-[10px] bg-danger text-cream rounded hover:bg-danger/90"
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
