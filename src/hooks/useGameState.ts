import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserProfile } from '../types/profile';
import { Transaction } from '../types/transaction';
import { AppSettings, GameSaveData, FinancialSummary } from '../types/game';
import { GamePlayState, GameTransaction, StoreProduct, DayRecord } from '../types/gameplay';
import { loadGameData, saveGameData, clearGameData, DEFAULT_SETTINGS } from '../services/storageService';
import { calculateFinancialSummary } from '../services/budgetEngine';
import { initializeGamePlayState, calculateGameDailyLimit } from '../services/gameEngine';
import { findChoice, selectDailyEvent } from '../services/eventEngine';
import { evaluateQuestCondition } from '../services/questEngine';
import { getQuestForDay } from '../data/quests';
import { formatINR } from '../utils/currency';

export function useGameState() {
  const [data, setData] = useState<GameSaveData>(() => {
    const loaded = loadGameData();
    // If profile exists but no gamePlay state, initialize one
    if (loaded.profile && !loaded.gamePlay) {
      loaded.gamePlay = initializeGamePlayState(loaded.profile);
    }
    return loaded;
  });

  const [isInitialized, setIsInitialized] = useState<boolean>(false);

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

  // Real Profile actions
  const saveProfile = useCallback((newProfile: UserProfile) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...newProfile,
        lastUpdated: Date.now(),
      },
      // When profile is newly created, initialize fresh gamePlay state
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

  const deleteTransaction = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((tx) => tx.id !== id),
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
    });
  }, []);

  // Reset Game Simulation Only (Preserves Real Budget records!)
  const resetGameSimulationOnly = useCallback(() => {
    setData((prev) => ({
      ...prev,
      gamePlay: initializeGamePlayState(prev.profile),
    }));
  }, []);

  // ==========================================
  // DAY 2 GAMEPLAY ACTIONS (SEPARATE GAME MONEY)
  // ==========================================

  // 1. Resolve Daily Random Event Choice
  const handleEventChoice = useCallback((choiceId: string) => {
    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);
      if (!current.currentEvent || current.eventResolved) return prev;

      const choice = findChoice(current.currentEvent, choiceId);
      if (!choice) return prev;

      const cost = choice.costPaise; // Positive = cost, Negative = reward/income
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

      // Live Quest check
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

  // 2. Buy Store Product
  const buyStoreProduct = useCallback((product: StoreProduct): { success: boolean; message: string } => {
    let result = { success: false, message: '' };

    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);

      // Free alternative handling
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

      // Affordability check
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

      // Evaluate quest
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

  // 3. Claim Quest XP
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

  // 4. Custom Store Products
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

  // 5. Open / Close Day End Summary Modal
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

  // 6. Advance to Next Simulated Day (Strictly explicit confirmation)
  const advanceToNextDay = useCallback(() => {
    setData((prev) => {
      const current = prev.gamePlay || initializeGamePlayState(prev.profile);
      const profile = prev.profile;
      const gameDailyLimit = calculateGameDailyLimit(current.openingBalancePaise, profile?.daysUntilAllowance || 15);

      // Evaluate quest completion at day end
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

      // Award quest XP if completed and not yet claimed
      const questXp = questComplete && !current.currentQuest.xpClaimed ? current.currentQuest.xpReward : 0;
      const budgetSurviveXp = current.dailySpentPaise <= gameDailyLimit && current.gameBalancePaise >= 0 ? 25 : 5;
      const totalDayXp = questXp + budgetSurviveXp;

      // Survival streak calculation
      const survivedUnderBudget = current.dailySpentPaise <= gameDailyLimit && current.gameBalancePaise >= 0;
      const newStreak = survivedUnderBudget ? current.streak + 1 : 0;

      // Create historical day record
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

      // Days to allowance countdown logic
      let daysLeft = profile ? Math.max(0, profile.daysUntilAllowance - 1) : 14;
      let newBalance = current.gameBalancePaise;
      let paydayTransactions: GameTransaction[] = [];

      // Payday Event: when allowance drop is triggered (daysLeft === 0)
      if (daysLeft === 0 && profile && profile.monthlyAllowancePaise > 0) {
        newBalance += profile.monthlyAllowancePaise;
        daysLeft = 30; // Reset allowance cycle

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

      // Next day quest & event
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
    saveProfile,
    updateProfile,
    addTransaction,
    deleteTransaction,
    toggleFixedExpensePaid,
    updateSettings,
    resetGame,
    resetGameSimulationOnly,
    handleEventChoice,
    buyStoreProduct,
    claimQuestReward,
    addCustomStoreProduct,
    updateStoreProductPrice,
    openDaySummary,
    closeDaySummary,
    advanceToNextDay,
  };
}
