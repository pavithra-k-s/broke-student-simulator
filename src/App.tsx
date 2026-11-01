import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { RetroScanlines } from './components/common/RetroScanlines';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { Analytics } from './pages/Analytics';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { PlayMode } from './pages/PlayMode';
import { Store } from './pages/Store';
import { AddTransactionModal } from './components/transactions/AddTransactionModal';
import { TransactionType } from './types/transaction';
import { Trophy, Gamepad2, X, CheckCircle } from 'lucide-react';

export function App() {
  const {
    profile,
    transactions,
    settings,
    financialSummary,
    hasProfile,
    gamePlay,
    achievements,
    unlockedToast,
    dismissAchievementToast,
    isDemoMode,
    saveProfile,
    updateProfile,
    addTransaction,
    editTransaction,
    deleteTransaction,
    importTransactions,
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
    fullSaveData,
  } = useGameState();

  // Primary screen state: 'landing' | 'onboarding' | 'app'
  const [screen, setScreen] = useState<'landing' | 'onboarding' | 'app'>(() =>
    hasProfile ? 'app' : 'landing'
  );

  // Sub-tabs when inside 'app'
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Transaction Modal state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalDefaultType, setTxModalDefaultType] = useState<TransactionType>('expense');

  // Handlers for starting / onboarding
  const handleStartGame = () => {
    if (hasProfile) {
      setScreen('app');
    } else {
      setScreen('onboarding');
    }
  };

  const handleContinueGame = () => {
    setScreen('app');
    setActiveTab('dashboard');
  };

  const handleOnboardingComplete = (newProfile: any) => {
    saveProfile(newProfile);
    setScreen('app');
    setActiveTab('dashboard');
  };

  const handleHardReset = () => {
    resetGame();
    setScreen('landing');
    setActiveTab('dashboard');
  };

  const handleDirectDemoLoad = () => {
    loadDemoMode();
    setScreen('app');
    setActiveTab('dashboard');
  };

  const handleOpenAddExpense = () => {
    setTxModalDefaultType('expense');
    setIsTxModalOpen(true);
  };

  const handleOpenAddIncome = () => {
    setTxModalDefaultType('income');
    setIsTxModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-retro-bg text-cream ${settings.animations ? '' : 'no-animations'}`}>
      {/* CRT Scanline Overlay Effect */}
      <RetroScanlines enabled={settings.crtEffect} />

      {/* FLOATING ACHIEVEMENT UNLOCKED NOTIFICATION WITH ACCEPT BUTTON */}
      {unlockedToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-retro-panel border-4 border-amber p-4 shadow-pixel-lg animate-fade-in">
          {/* Header with Trophy and Close Button */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber/20 border-2 border-amber flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4 text-amber animate-pulse" />
              </div>
              <div>
                <span className="font-pixel text-[8px] text-amber tracking-wider block">
                  🏆 TROPHY UNLOCKED!
                </span>
                <span className="font-pixel text-[8px] text-neon-lime">
                  +{unlockedToast.xpBonus || 50} XP REWARD
                </span>
              </div>
            </div>

            <button
              onClick={dismissAchievementToast}
              className="text-cream/50 hover:text-danger-red p-1 transition-colors cursor-pointer"
              title="Close notification"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Trophy Info */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{unlockedToast.emoji || '🏆'}</span>
              <h4 className="font-pixel text-xs text-cream">{unlockedToast.title}</h4>
            </div>
            <p className="font-mono text-[11px] text-cream-muted leading-tight">
              {unlockedToast.description}
            </p>
          </div>

          {/* Prominent Accept / Claim Button */}
          <button
            onClick={dismissAchievementToast}
            className="w-full py-2 bg-amber hover:bg-neon-lime text-retro-dark font-pixel text-[10px] tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-pixel-sm active:translate-y-0.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            ACCEPT & CLAIM
          </button>
        </div>
      )}

      {/* Screen 1: Landing Page */}
      {screen === 'landing' && (
        <Landing
          hasProfile={hasProfile}
          profile={profile}
          summary={financialSummary}
          onStartGame={handleStartGame}
          onContinueGame={handleContinueGame}
          onResetGame={handleHardReset}
          onLoadDemo={handleDirectDemoLoad}
        />
      )}

      {/* Screen 2: Onboarding Flow */}
      {screen === 'onboarding' && (
        <Onboarding
          onComplete={handleOnboardingComplete}
          onCancel={hasProfile ? () => setScreen('app') : undefined}
        />
      )}

      {/* Screen 3: Main Application */}
      {screen === 'app' && profile && (
        <div className="flex flex-col min-h-screen">
          {/* DEMO MODE ACTIVE BANNER */}
          {isDemoMode && (
            <div className="bg-amber/90 text-bg px-4 py-1.5 font-mono text-xs font-bold flex items-center justify-between shadow-md z-40">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 shrink-0" />
                <span>DEMO MODE ACTIVE — Loaded with sample transactions, Day 4 game progress, and unlocked badges.</span>
              </div>
              <button
                onClick={exitDemoMode}
                className="font-pixel text-[9px] bg-bg text-amber px-2.5 py-1 rounded hover:bg-cream hover:text-bg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" /> EXIT DEMO
              </button>
            </div>
          )}

          {/* Top Application Header with Live Wallet Display */}
          <Header
            profile={profile}
            summary={financialSummary}
            onOpenAddExpense={handleOpenAddExpense}
            onOpenAddIncome={handleOpenAddIncome}
            onNavigateSettings={() => setActiveTab('settings')}
            activeTab={activeTab}
          />

          <div className="flex flex-1">
            {/* Desktop Navigation Sidebar */}
            <Sidebar currentTab={activeTab} onSelectTab={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
              {activeTab === 'dashboard' && (
                <Dashboard
                  profile={profile}
                  transactions={transactions}
                  summary={financialSummary}
                  onOpenAddExpense={handleOpenAddExpense}
                  onOpenAddIncome={handleOpenAddIncome}
                  onViewTransactions={() => setActiveTab('transactions')}
                  onDeleteTransaction={deleteTransaction}
                  onNavigatePlayMode={() => setActiveTab('play-mode')}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionsPage
                  transactions={transactions}
                  summary={financialSummary}
                  onAddTransaction={addTransaction}
                  onDeleteTransaction={deleteTransaction}
                  onEditTransaction={editTransaction}
                  onImportTransactions={importTransactions}
                  onOpenAddExpense={handleOpenAddExpense}
                  onOpenAddIncome={handleOpenAddIncome}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                  gameTransactions={gamePlay?.gameTransactions || []}
                />
              )}

              {/* Day 3: Full Analytics Dashboard */}
              {activeTab === 'analytics' && (
                <Analytics
                  profile={profile}
                  transactions={transactions}
                  onNavigateTransactions={() => setActiveTab('transactions')}
                />
              )}

              {/* Day 3: 15 Unlockable Achievements */}
              {activeTab === 'achievements' && (
                <Achievements
                  achievements={achievements}
                />
              )}

              {/* Day 2: Interactive Play Mode & Temptation Store */}
              {activeTab === 'play-mode' && (
                <PlayMode
                  gamePlay={gamePlay}
                  profile={profile}
                  onSelectEventChoice={handleEventChoice}
                  onClaimQuestReward={claimQuestReward}
                  onOpenDaySummary={openDaySummary}
                  onCloseDaySummary={closeDaySummary}
                  onConfirmAdvanceDay={advanceToNextDay}
                  onNavigateStore={() => setActiveTab('store')}
                  onResetSimulationOnly={resetGameSimulationOnly}
                />
              )}

              {activeTab === 'store' && (
                <Store
                  gamePlay={gamePlay}
                  onBuyProduct={buyStoreProduct}
                  onAddCustomProduct={addCustomStoreProduct}
                  onUpdateProductPrice={updateStoreProductPrice}
                  onBackToPlayMode={() => setActiveTab('play-mode')}
                />
              )}

              {/* Day 3 Settings & Data Management */}
              {activeTab === 'settings' && (
                <Settings
                  profile={profile}
                  fullSaveData={fullSaveData}
                  onUpdateProfile={updateProfile}
                  onResetGameOnly={resetGameSimulationOnly}
                  onResetRealLedgerOnly={resetRealTransactionsOnly}
                  onFullReset={handleHardReset}
                  onImportFullBackup={importFullBackup}
                  onLoadDemoMode={handleDirectDemoLoad}
                  onExitDemoMode={isDemoMode ? exitDemoMode : undefined}
                  isDemoMode={isDemoMode}
                />
              )}
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileNav currentTab={activeTab} onSelectTab={setActiveTab} />
        </div>
      )}

      {/* Modal for Logging Income / Expense */}
      <AddTransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        defaultType={txModalDefaultType}
        onAddTransaction={addTransaction}
      />
    </div>
  );
}

export default App;
