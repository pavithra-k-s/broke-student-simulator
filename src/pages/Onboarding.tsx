import React, { useState } from 'react';
import { UserProfile, DifficultyLevel, FixedExpenseItem } from '../types/profile';
import { PixelButton } from '../components/common/PixelButton';
import { PixelInput } from '../components/common/PixelInput';
import { PixelBadge } from '../components/common/PixelBadge';
import { PixelStudent, PixelWallet } from '../components/common/PixelArtIcons';
import { formatINR, parseInputToPaise, rupeesToPaise } from '../utils/currency';
import { validateOnboarding } from '../utils/validation';
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [nickname, setNickname] = useState('Pavi');
  const [startingBalanceInput, setStartingBalanceInput] = useState('1500');
  const [allowanceInput, setAllowanceInput] = useState('5000');
  const [daysUntilAllowanceInput, setDaysUntilAllowanceInput] = useState('15');
  const [dailyEssentialInput, setDailyEssentialInput] = useState('150');
  const [savingsGoalInput, setSavingsGoalInput] = useState('1000');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('NORMAL');

  // Fixed Expenses
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpenseItem[]>([
    { id: '1', name: 'Hostel / Rent Fee', amountPaise: rupeesToPaise(1200), category: 'Hostel', isPaid: false },
    { id: '2', name: 'Mobile / Wifi Data', amountPaise: rupeesToPaise(300), category: 'Subscriptions', isPaid: false },
  ]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper validation for each step
  const handleNextStep = () => {
    const startBal = parseFloat(startingBalanceInput);
    const allow = parseFloat(allowanceInput);
    const days = parseInt(daysUntilAllowanceInput, 10);
    const daily = parseFloat(dailyEssentialInput);
    const savings = parseFloat(savingsGoalInput);

    const validation = validateOnboarding({
      nickname,
      startingBalance: isNaN(startBal) ? -1 : startBal,
      monthlyAllowance: isNaN(allow) ? -1 : allow,
      daysUntilAllowance: isNaN(days) ? 0 : days,
      dailyEssentialEstimate: isNaN(daily) ? -1 : daily,
      savingsGoal: isNaN(savings) ? 0 : savings,
    });

    if (step === 1) {
      if (validation.errors.nickname || validation.errors.startingBalance) {
        setErrors(validation.errors);
        return;
      }
    } else if (step === 2) {
      if (validation.errors.monthlyAllowance || validation.errors.daysUntilAllowance) {
        setErrors(validation.errors);
        return;
      }
    } else if (step === 3) {
      if (validation.errors.dailyEssentialEstimate || validation.errors.savingsGoal) {
        setErrors(validation.errors);
        return;
      }
    }

    setErrors({});
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrevStep = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleAddFixedExpense = () => {
    if (!newExpenseName.trim()) return;
    const amountNum = parseFloat(newExpenseAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const newItem: FixedExpenseItem = {
      id: `fe_${Date.now()}`,
      name: newExpenseName.trim(),
      amountPaise: parseInputToPaise(newExpenseAmount),
      category: 'Fixed',
      isPaid: false,
    };

    setFixedExpenses((prev) => [...prev, newItem]);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const handleRemoveFixedExpense = (id: string) => {
    setFixedExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFinishOnboarding = () => {
    const profile: UserProfile = {
      nickname: nickname.trim(),
      startingBalancePaise: parseInputToPaise(startingBalanceInput),
      monthlyAllowancePaise: parseInputToPaise(allowanceInput),
      daysUntilAllowance: Math.max(1, parseInt(daysUntilAllowanceInput, 10) || 1),
      fixedExpenses,
      dailyEssentialEstimatePaise: parseInputToPaise(dailyEssentialInput),
      savingsGoalPaise: parseInputToPaise(savingsGoalInput),
      difficulty,
      onboardingCompleted: true,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };

    onComplete(profile);
  };

  const totalFixedPaise = fixedExpenses.reduce((s, i) => s + i.amountPaise, 0);

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-retro-panel border-4 border-retro-border shadow-pixel-lg">
        {/* Outer pixel notches */}
        <div className="relative">
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-neon-lime" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-neon-lime" />
        </div>

        {/* Wizard Header */}
        <div className="p-6 border-b-2 border-retro-border bg-retro-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-[10px] text-neon-lime uppercase tracking-widest">
              STAGE {step} OF 4
            </span>
            <span className="font-mono text-xs text-cream-muted">
              CAMPAIGN SETUP
            </span>
          </div>

          <h1 className="font-pixel text-sm sm:text-base text-cream uppercase leading-relaxed">
            WELCOME TO THE ECONOMIC CRISIS, PLAYER 1.
          </h1>
          <p className="font-mono text-xs text-cream-muted mt-1">
            "Configure your financial survival campaign."
          </p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-retro-panel border border-retro-border mt-4">
            <div
              className="h-full bg-neon-lime transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Step Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: PLAYER BASICS */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-start gap-4 p-3 bg-retro-dark border border-retro-border">
                <PixelStudent className="w-12 h-12 shrink-0 hidden sm:block" />
                <div>
                  <h3 className="font-pixel text-xs text-neon-lime uppercase mb-1">
                    IDENTITY INITIALIZATION
                  </h3>
                  <p className="font-mono text-xs text-cream-muted">
                    Choose your in-game student tag and current liquid cash in your pocket or UPI account.
                  </p>
                </div>
              </div>

              <PixelInput
                label="Player Nickname / Gamer Tag"
                placeholder="e.g. Neo, Pavi, Chotu"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                error={errors.nickname}
                helperText="How other broke students and NPCs will address you."
              />

              <PixelInput
                label="Starting Liquid Balance (INR)"
                type="number"
                step="any"
                min="0"
                placeholder="0"
                prefix="₹"
                value={startingBalanceInput}
                onChange={(e) => setStartingBalanceInput(e.target.value)}
                error={errors.startingBalance}
                helperText="Current bank/cash available today (₹0 is totally fine if you're flat broke!)."
              />
            </div>
          )}

          {/* STEP 2: ALLOWANCE & COUNTDOWN */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-start gap-4 p-3 bg-retro-dark border border-retro-border">
                <PixelWallet className="w-12 h-12 shrink-0 hidden sm:block" />
                <div>
                  <h3 className="font-pixel text-xs text-amber uppercase mb-1">
                    ALLOWANCE HORIZON
                  </h3>
                  <p className="font-mono text-xs text-cream-muted">
                    When does the next cash injection arrive from parents or salary?
                  </p>
                </div>
              </div>

              <PixelInput
                label="Expected Allowance / Income Amount"
                type="number"
                step="any"
                min="0"
                placeholder="0"
                prefix="₹"
                value={allowanceInput}
                onChange={(e) => setAllowanceInput(e.target.value)}
                error={errors.monthlyAllowance}
                helperText="Regular pocket money, monthly stipend, or gig wage."
              />

              <PixelInput
                label="Days Until Next Allowance Drop"
                type="number"
                min="1"
                max="365"
                placeholder="15"
                suffix="Days"
                value={daysUntilAllowanceInput}
                onChange={(e) => setDaysUntilAllowanceInput(e.target.value)}
                error={errors.daysUntilAllowance}
                helperText="How many days your current balance needs to survive."
              />
            </div>
          )}

          {/* STEP 3: FIXED EXPENSES & SAVINGS */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="font-pixel text-xs text-lavender uppercase mb-1">
                  FIXED BILLS & ESSENTIAL ESTIMATES
                </h3>
                <p className="font-mono text-xs text-cream-muted">
                  Lock in mandatory expenses so you don't accidentally blow rent on steam sales.
                </p>
              </div>

              {/* Fixed Expenses List */}
              <div className="space-y-2">
                <label className="font-pixel text-[10px] text-cream-muted uppercase">
                  Upcoming Fixed Obligations (Total: {formatINR(totalFixedPaise)})
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {fixedExpenses.map((fe) => (
                    <div
                      key={fe.id}
                      className="flex items-center justify-between p-2 bg-retro-dark border border-retro-border text-xs font-mono"
                    >
                      <span>{fe.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lavender font-bold">
                          {formatINR(fe.amountPaise)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFixedExpense(fe.id)}
                          className="text-cream-muted hover:text-danger-red transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Add Row */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="New fixed bill (e.g. Gym, Mess)"
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                    className="flex-1 bg-retro-dark border border-retro-border text-cream px-2 py-1 text-xs font-mono"
                  />
                  <input
                    type="number"
                    placeholder="₹ Amount"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    className="w-24 bg-retro-dark border border-retro-border text-cream px-2 py-1 text-xs font-mono"
                  />
                  <PixelButton
                    type="button"
                    variant="panel"
                    size="sm"
                    onClick={handleAddFixedExpense}
                    icon={<Plus size={12} />}
                  >
                    ADD
                  </PixelButton>
                </div>
              </div>

              {/* Essential daily estimate & Savings goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <PixelInput
                  label="Daily Food/Travel Estimate"
                  type="number"
                  prefix="₹"
                  placeholder="150"
                  value={dailyEssentialInput}
                  onChange={(e) => setDailyEssentialInput(e.target.value)}
                  error={errors.dailyEssentialEstimate}
                  helperText="Typical baseline per day."
                />

                <PixelInput
                  label="Target Savings Goal (Optional)"
                  type="number"
                  prefix="₹"
                  placeholder="1000"
                  value={savingsGoalInput}
                  onChange={(e) => setSavingsGoalInput(e.target.value)}
                  error={errors.savingsGoal}
                  helperText="Emergency fund target."
                />
              </div>
            </div>
          )}

          {/* STEP 4: DIFFICULTY & CONFIRMATION SUMMARY */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="font-pixel text-xs text-neon-lime uppercase mb-1">
                  CHOOSE DIFFICULTY & CONFIRM SETUP
                </h3>
                <p className="font-mono text-xs text-cream-muted">
                  Pick your campaign difficulty level (saved to profile for Day 2 mechanics).
                </p>
              </div>

              {/* Difficulty Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    level: 'EASY' as DifficultyLevel,
                    title: 'EASY',
                    desc: 'Spoiled Main Character',
                    color: 'border-neon-lime text-neon-lime bg-neon-lime/10',
                  },
                  {
                    level: 'NORMAL' as DifficultyLevel,
                    title: 'NORMAL',
                    desc: 'Average College Student',
                    color: 'border-amber text-amber bg-amber/10',
                  },
                  {
                    level: 'HARD' as DifficultyLevel,
                    title: 'HARD',
                    desc: 'Final Boss: Empty Wallet',
                    color: 'border-danger-red text-danger-red bg-danger-red/10',
                  },
                ].map((diff) => {
                  const isSelected = difficulty === diff.level;
                  return (
                    <button
                      key={diff.level}
                      type="button"
                      onClick={() => setDifficulty(diff.level)}
                      className={`p-3 text-left border-2 transition-all ${
                        isSelected
                          ? `${diff.color} shadow-pixel-sm font-bold scale-[1.02]`
                          : 'border-retro-border bg-retro-dark text-cream-muted hover:border-cream-muted'
                      }`}
                    >
                      <p className="font-pixel text-[11px] mb-1">{diff.title}</p>
                      <p className="font-mono text-[11px] leading-tight">{diff.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Confirmation Financial Summary Card */}
              <div className="p-4 bg-retro-dark border-2 border-retro-border font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-retro-border pb-2">
                  <span className="font-pixel text-[10px] text-cream uppercase">
                    CAMPAIGN DOSSIER
                  </span>
                  <PixelBadge variant="lime" size="sm">READY</PixelBadge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-cream-muted">Player:</span>{' '}
                    <span className="text-neon-lime font-bold">{nickname}</span>
                  </div>
                  <div>
                    <span className="text-cream-muted">Difficulty:</span>{' '}
                    <span className="text-amber font-bold">{difficulty}</span>
                  </div>
                  <div>
                    <span className="text-cream-muted">Starting Cash:</span>{' '}
                    <span className="text-cream font-bold">
                      {formatINR(parseInputToPaise(startingBalanceInput))}
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-muted">Next Allowance:</span>{' '}
                    <span className="text-cream font-bold">
                      {formatINR(parseInputToPaise(allowanceInput))} in {daysUntilAllowanceInput} days
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-muted">Fixed Bills:</span>{' '}
                    <span className="text-lavender font-bold">
                      {formatINR(totalFixedPaise)}
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-muted">Savings Goal:</span>{' '}
                    <span className="text-neon-lime font-bold">
                      {formatINR(parseInputToPaise(savingsGoalInput))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="p-6 border-t-2 border-retro-border bg-retro-dark/60 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <PixelButton
                variant="outline"
                size="md"
                onClick={handlePrevStep}
                icon={<ArrowLeft size={14} />}
              >
                BACK
              </PixelButton>
            ) : onCancel ? (
              <PixelButton
                variant="outline"
                size="md"
                onClick={onCancel}
              >
                EXIT
              </PixelButton>
            ) : (
              <div />
            )}
          </div>

          <div>
            {step < 4 ? (
              <PixelButton
                variant="lime"
                size="md"
                onClick={handleNextStep}
                icon={<ArrowRight size={14} />}
              >
                CONTINUE
              </PixelButton>
            ) : (
              <PixelButton
                variant="lime"
                size="lg"
                onClick={handleFinishOnboarding}
                icon={<CheckCircle2 size={16} />}
              >
                ENTER SIMULATION
              </PixelButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
