import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserProfile } from '../types/profile';
import { Transaction } from '../types/transaction';
import { AppSettings, GameSaveData, FinancialSummary } from '../types/game';
import { GamePlayState, GameTransaction, StoreProduct, DayRecord } from '../types/gameplay';
import { Achievement } from '../types/achievement';
import { loadGameData, saveGameData, clearGameData, DEFAULT_SETTINGS } from '../services/storageService';
import { calculateFinancialSummary } from '../services/budgetEngine';
import { initializeGamePlayState, calculateGameDailyLimit } from '../services/gameEngine';
import { findChoice, selectDailyEvent } from '../services/eventEngine';
import { evaluateQuestCondition } from '../services/questEngine';
import { evaluateAchievements } from '../services/achievementEngine';
import { createDemoSaveData } from '../data/demoData';
import { getQuestForDay } from '../data/quests';
import { formatINR } from '../utils/currency';

export function useGameState() {
  const [data, setData] = useState<GameSaveData>(() => {
    const loaded = loadGameData();
    if (loaded.profile && !loaded.gamePlay) {
      loaded.gamePlay = initializeGamePlayState(loaded.profile);
    }
    return loaded;
  });

  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [unlockedToast, setUnlockedToast] = useState<Achievement | null>(null);

  // Sync to LocalStorage on state changes once initialized
  useEffect(() => {
    if (isInitialized) {
      saveGameData(data);
    } else {
      setIsInitialized(true);
    }
  }, [data, isInitialized]);

  // Derive live financial summary for REAL budget
  const financialSummary: FinancialSummary = useMemo(() => {
    return calculateFinancialSummary(data.profile, data.transactions);
  }, [data.profile, data.transactions]);

  const hasProfile = Boolean(data.profile && data.profile.onboardingCompleted);

  // Active gamePlay state (ensuring non-null fallback)
  const gamePlay: GamePlayState = useMemo(() => {
    return data.gamePlay || initializeGamePlayState(data.profile);
  }, [data.gamePlay, data.profile]);

  // Derive live achievements
  const achievementResult = useMemo(() => {
    return evaluateAchievements({
      existingState: data.achievements || {},
      profile: data.profile,
      transactions: data.transactions,
      gamePlay: data.gamePlay,
    });
  }, [data.achievements, data.profile, data.transactions, data.gamePlay]);

  // If new achievements unlocked, save updated state and notify
  useEffect(() => {
    if (achievementResult.newlyUnlocked.length > 0) {
      const latest = achievementResult.newlyUnlocked[0];
      setUnlockedToast(latest);
      setData((prev) => ({
        ...prev,
        achievements: achievementResult.updatedState,
      }));
      const timer = setTimeout(() => setUnlockedToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [achievementResult.newlyUnlocked, achievementResult.updatedState]);

  // Real Profile actions
  const saveProfile = useCallback((newProfile: UserProfile) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...newProfile,
        lastUpdated: Date.now(),
      },
      gamePlay: prev.gamePlay || initializeGamePlayState(newProfile),
    }));
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setData((prev) => {
      if (!prev.profile) return prev;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          ...updates,
          lastUpdated: Date.now(),
        },
      };
    });
  }, []);

  // Real Transaction actions (strictly isolated to real budget ledger)
  const addTransaction = useCallback((txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };

    setData((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));

    return newTx;
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((tx) => tx.id !== id),
    }));
  }, []);

  const importTransactions = useCallback((imported: Transaction[]) => {
    setData((prev) => ({
      ...prev,
      transactions: [...imported, ...prev.transactions],
    }));
  }, []);

  const toggleFixedExpensePaid = useCallback((id: string) => {
    setData((prev) => {
      if (!prev.profile) return prev;
      const updatedFixed = prev.profile.fixedExpenses.map((fe) =>
        fe.id === id ? { ...fe, isPaid: !fe.isPaid } : fe
      );
      return {
        ...prev,
        profile: {
          ...prev.profile,
          fixedExpenses: updatedFixed,
          lastUpdated: Date.now(),
        },
      };
    });
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
      },
    }));
  }, []);

  // Full Hard Reset
  const resetGame = useCallback(() => {
    clearGameData();
    setData({
      version: 1,
      profile: null,
      transactions: [],
      settings: DEFAULT_SETTINGS,
      gamePlay: undefined,
      achievements: {},
      isDemoMode: false,
    });
  }, []);

  // Reset Game Simulation Only (Preserves Real Budget records!)
  const resetGameSimulationOnly = useCallback(() => {
    setData((prev) => ({
      ...prev,
      gamePlay: initializeGamePlayState(prev.profile),
    }));
  }, []);

  // Reset Real Transactions Only (Preserves Game Play save!)
  const resetRealTransactionsOnly = useCallback(() => {
    setData((prev) => ({
      ...prev,
      transactions: [],
    }));
  }, []);

  // Demo Mode
  const loadDemoMode = useCallback(() => {
    const demo = createDemoSaveData();
    setData(demo);
  }, []);

  const exitDemoMode = useCallback(() => {
    clearGameData();
    setData({
      version: 1,
      profile: null,
      transactions: [],
      settings: DEFAULT_SETTINGS,
      gamePlay: undefined,
      achievements: {},
      isDemoMode: false,
    });
  }, []);

  // Full Backup Import
  const importFullBackup = useCallback((backup: GameSaveData) => {
    setData(backup);
  }, []);

  // ==========================================
  // DAY 2 & 3 GAMEPLAY ACTIONS
  // ==========================================

  const handleEventChoice = useCallback((choiceId: string) => {
    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);
      if (!current.currentEvent || current.eventResolved) return prev;

      const choice = findChoice(current.currentEvent, choiceId);
      if (!choice) return prev;

      const cost = choice.costPaise;
      const isExpense = cost > 0;
      const isIncome = cost < 0;
      const absAmount = Math.abs(cost);

      const newBalance = isExpense
        ? current.gameBalancePaise - absAmount
        : isIncome
        ? current.gameBalancePaise + absAmount
        : current.gameBalancePaise;

      const newDailySpent = isExpense
        ? current.dailySpentPaise + absAmount
        : current.dailySpentPaise;

      const newDiscretionary = isExpense && current.currentEvent.category !== 'Academic'
        ? current.discretionarySpentPaise + absAmount
        : current.discretionarySpentPaise;

      const newEssential = isExpense && current.currentEvent.category === 'Academic'
        ? current.essentialSpentPaise + absAmount
        : current.essentialSpentPaise;

      const eventTx: GameTransaction = {
        id: `gtx_evt_${Date.now()}`,
        type: isIncome ? 'income' : 'expense',
        source: 'game_event',
        description: `${current.currentEvent.title}: ${choice.text}`,
        amountPaise: absAmount,
        category: current.currentEvent.category,
        simulatedDay: current.simulatedDay,
        createdAt: Date.now(),
      };

      const newXp = current.xp + choice.xpReward;
      const isFrugal = cost <= 0 || choiceId === 'c2' || choiceId === 'c3';

      const questComplete = current.currentQuest.isCompleted || evaluateQuestCondition(current.currentQuest, {
        dailySpentPaise: newDailySpent,
        discretionarySpentPaise: newDiscretionary,
        dailyBudgetLimitPaise: calculateGameDailyLimit(newBalance, prev.profile?.daysUntilAllowance || 15),
        closingBalancePaise: newBalance,
        hasFreePurchaseToday: false,
        hasImpulsePurchaseToday: false,
        hasCafePurchaseToday: false,
        choseFrugalChoiceToday: isFrugal,
      });

      return {
        ...prev,
        gamePlay: {
          ...current,
          gameBalancePaise: newBalance,
          dailySpentPaise: newDailySpent,
          discretionarySpentPaise: newDiscretionary,
          essentialSpentPaise: newEssential,
          xp: newXp,
          eventResolved: true,
          eventChoiceId: choiceId,
          resolvedEventIds: [...current.resolvedEventIds, current.currentEvent.id],
          gameTransactions: [eventTx, ...current.gameTransactions],
          currentQuest: {
            ...current.currentQuest,
            isCompleted: questComplete,
          },
        },
      };
    });
  }, []);

  const buyStoreProduct = useCallback((product: StoreProduct): { success: boolean; message: string } => {
    let result = { success: false, message: '' };

    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);

      if (product.pricePaise === 0) {
        const freeTx: GameTransaction = {
          id: `gtx_free_${Date.now()}`,
          type: 'expense',
          source: 'store_purchase',
          description: `Enjoyed: ${product.name} (Free Alternative)`,
          amountPaise: 0,
          category: product.category,
          simulatedDay: current.simulatedDay,
          createdAt: Date.now(),
        };

        const questComplete = current.currentQuest.isCompleted || evaluateQuestCondition(current.currentQuest, {
          dailySpentPaise: current.dailySpentPaise,
          discretionarySpentPaise: current.discretionarySpentPaise,
          dailyBudgetLimitPaise: calculateGameDailyLimit(current.gameBalancePaise, prev.profile?.daysUntilAllowance || 15),
          closingBalancePaise: current.gameBalancePaise,
          hasFreePurchaseToday: true,
          hasImpulsePurchaseToday: false,
          hasCafePurchaseToday: false,
          choseFrugalChoiceToday: true,
        });

        result = {
          success: true,
          message: `Enjoyed ${product.name}! Free activities provide +15 Serenity & ₹0 debt.`,
        };

        return {
          ...prev,
          gamePlay: {
            ...current,
            gameTransactions: [freeTx, ...current.gameTransactions],
            currentQuest: {
              ...current.currentQuest,
              isCompleted: questComplete,
            },
          },
        };
      }

      if (current.gameBalancePaise < product.pricePaise) {
        result = {
          success: false,
          message: `Insufficient game funds! You have ${formatINR(current.gameBalancePaise)} but this item costs ${formatINR(product.pricePaise)}. Emotional damage incoming!`,
        };
        return prev;
      }

      const isImpulse = product.category === 'Impulse Buys';
      const isCafe = product.id === 'prod_iced_coffee' || product.id === 'prod_cafe_hangout';
      const isDiscretionary = product.category === 'Entertainment' || product.category === 'Impulse Buys' || product.category === 'Food & Drinks';

      const newBalance = current.gameBalancePaise - product.pricePaise;
      const newDailySpent = current.dailySpentPaise + product.pricePaise;
      const newDiscretionary = isDiscretionary ? current.discretionarySpentPaise + product.pricePaise : current.discretionarySpentPaise;
      const newEssential = !isDiscretionary ? current.essentialSpentPaise + product.pricePaise : current.essentialSpentPaise;

      const storeTx: GameTransaction = {
        id: `gtx_buy_${Date.now()}`,
        type: 'expense',
        source: 'store_purchase',
        description: `Bought: ${product.name}`,
        amountPaise: product.pricePaise,
        category: product.category,
        simulatedDay: current.simulatedDay,
        createdAt: Date.now(),
      };

      const questComplete = current.currentQuest.isCompleted || evaluateQuestCondition(current.currentQuest, {
        dailySpentPaise: newDailySpent,
        discretionarySpentPaise: newDiscretionary,
        dailyBudgetLimitPaise: calculateGameDailyLimit(newBalance, prev.profile?.daysUntilAllowance || 15),
        closingBalancePaise: newBalance,
        hasFreePurchaseToday: false,
        hasImpulsePurchaseToday: isImpulse,
        hasCafePurchaseToday: isCafe,
        choseFrugalChoiceToday: false,
      });

      result = {
        success: true,
        message: `Purchased ${product.name} for ${formatINR(product.pricePaise)}!`,
      };

      return {
        ...prev,
        gamePlay: {
          ...current,
          gameBalancePaise: newBalance,
          dailySpentPaise: newDailySpent,
          discretionarySpentPaise: newDiscretionary,
          essentialSpentPaise: newEssential,
          gameTransactions: [storeTx, ...current.gameTransactions],
          currentQuest: {
            ...current.currentQuest,
            isCompleted: questComplete,
          },
        },
      };
    });

    return result;
  }, []);

  const claimQuestReward = useCallback(() => {
    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);
      if (!current.currentQuest.isCompleted || current.currentQuest.xpClaimed) return prev;

      return {
        ...prev,
        gamePlay: {
          ...current,
          xp: current.xp + current.currentQuest.xpReward,
          currentQuest: {
            ...current.currentQuest,
            xpClaimed: true,
          },
        },
      };
    });
  }, []);

  const addCustomStoreProduct = useCallback((productData: Omit<StoreProduct, 'id'>) => {
    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);
      const newProduct: StoreProduct = {
        ...productData,
        id: `prod_custom_${Date.now()}`,
        isCustom: true,
      };
      return {
        ...prev,
        gamePlay: {
          ...current,
          customProducts: [...current.customProducts, newProduct],
        },
      };
    });
  }, []);

  const updateStoreProductPrice = useCallback((productId: string, newPricePaise: number) => {
    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);
      const updatedCustom = current.customProducts.map((p) =>
        p.id === productId ? { ...p, pricePaise: newPricePaise } : p
      );
      return {
        ...prev,
        gamePlay: {
          ...current,
          customProducts: updatedCustom,
        },
      };
    });
  }, []);

  const openDaySummary = useCallback(() => {
    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);
      return {
        ...prev,
        gamePlay: {
          ...current,
          isDayEnded: true,
        },
      };
    });
  }, []);

  const closeDaySummary = useCallback(() => {
    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);
      return {
        ...prev,
        gamePlay: {
          ...current,
          isDayEnded: false,
        },
      };
    });
  }, []);

  const advanceToNextDay = useCallback(() => {
    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);
      const profile = prev.profile;
      const gameDailyLimit = calculateGameDailyLimit(current.openingBalancePaise, profile?.daysUntilAllowance || 15);

      const questComplete = current.currentQuest.isCompleted || evaluateQuestCondition(current.currentQuest, {
        dailySpentPaise: current.dailySpentPaise,
        discretionarySpentPaise: current.discretionarySpentPaise,
        dailyBudgetLimitPaise: gameDailyLimit,
        closingBalancePaise: current.gameBalancePaise,
        hasFreePurchaseToday: current.gameTransactions.some(
          (t) => t.simulatedDay === current.simulatedDay && t.amountPaise === 0
        ),
        hasImpulsePurchaseToday: current.gameTransactions.some(
          (t) => t.simulatedDay === current.simulatedDay && t.category === 'Impulse Buys'
        ),
        hasCafePurchaseToday: current.gameTransactions.some(
          (t) => t.simulatedDay === current.simulatedDay && t.description.toLowerCase().includes('coffee')
        ),
        choseFrugalChoiceToday: current.eventChoiceId === 'c2' || current.eventChoiceId === 'c3',
      });

      const questXp = questComplete && !current.currentQuest.xpClaimed ? current.currentQuest.xpReward : 0;
      const budgetSurviveXp = current.dailySpentPaise <= gameDailyLimit && current.gameBalancePaise >= 0 ? 25 : 5;
      const totalDayXp = questXp + budgetSurviveXp;

      const survivedUnderBudget = current.dailySpentPaise <= gameDailyLimit && current.gameBalancePaise >= 0;
      const newStreak = survivedUnderBudget ? current.streak + 1 : 0;

      const dayRecord: DayRecord = {
        day: current.simulatedDay,
        openingBalancePaise: current.openingBalancePaise,
        closingBalancePaise: current.gameBalancePaise,
        totalIncomePaise: current.gameTransactions
          .filter((t) => t.simulatedDay === current.simulatedDay && t.type === 'income')
          .reduce((s, t) => s + t.amountPaise, 0),
        totalExpensePaise: current.dailySpentPaise,
        essentialSpentPaise: current.essentialSpentPaise,
        discretionarySpentPaise: current.discretionarySpentPaise,
        questCompleted: questComplete,
        xpEarned: totalDayXp,
        eventTitle: current.currentEvent?.title,
      };

      const nextDay = current.simulatedDay + 1;

      let daysLeft = profile ? Math.max(0, profile.daysUntilAllowance - 1) : 14;
      let newBalance = current.gameBalancePaise;
      let paydayTransactions: GameTransaction[] = [];

      if (daysLeft === 0 && profile && profile.monthlyAllowancePaise > 0) {
        newBalance += profile.monthlyAllowancePaise;
        daysLeft = 30;

        paydayTransactions.push({
          id: `gtx_payday_${Date.now()}`,
          type: 'income',
          source: 'allowance_drop',
          description: `💰 PAYDAY! Monthly Allowance Dropped: +${formatINR(profile.monthlyAllowancePaise)}`,
          amountPaise: profile.monthlyAllowancePaise,
          category: 'Allowance',
          simulatedDay: nextDay,
          createdAt: Date.now(),
        });
      }

      const nextQuest = getQuestForDay(nextDay);
      const nextEvent = selectDailyEvent(
        profile?.difficulty || 'NORMAL',
        [...current.resolvedEventIds, current.currentEvent ? current.currentEvent.id : ''],
        nextDay
      );

      return {
        ...prev,
        profile: profile ? { ...profile, daysUntilAllowance: daysLeft } : null,
        gamePlay: {
          ...current,
          simulatedDay: nextDay,
          gameBalancePaise: newBalance,
          openingBalancePaise: newBalance,
          dailySpentPaise: 0,
          discretionarySpentPaise: 0,
          essentialSpentPaise: 0,
          streak: newStreak,
          xp: current.xp + totalDayXp,
          currentQuest: nextQuest,
          currentEvent: nextEvent,
          eventResolved: false,
          eventChoiceId: null,
          isDayEnded: false,
          dayHistory: [dayRecord, ...current.dayHistory],
          gameTransactions: [...paydayTransactions, ...current.gameTransactions],
        },
      };
    });
  }, []);

  return {
    profile: data.profile,
    transactions: data.transactions,
    settings: data.settings,
    financialSummary,
    hasProfile,
    gamePlay,
    achievements: achievementResult.achievements,
    unlockedToast,
    isDemoMode: Boolean(data.isDemoMode),
    saveProfile,
    updateProfile,
    addTransaction,
    editTransaction,
    deleteTransaction,
    importTransactions,
    toggleFixedExpensePaid,
    updateSettings,
    resetGame,
    resetGameSimulationOnly,
    resetRealTransactionsOnly,
    loadDemoMode,
    exitDemoMode,
    importFullBackup,
    handleEventChoice,
    buyStoreProduct,
    claimQuestReward,
    addCustomStoreProduct,
    updateStoreProductPrice,
    openDaySummary,
    closeDaySummary,
    advanceToNextDay,
    fullSaveData: data,
  };
}
