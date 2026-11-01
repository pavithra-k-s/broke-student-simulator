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
import { Settings } from './pages/Settings';
import { PlayMode } from './pages/PlayMode';
import { Store } from './pages/Store';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { AddTransactionModal } from './components/transactions/AddTransactionModal';
import { TransactionType } from './types/transaction';

export function App() {
  const {
    profile,
    transactions,
    settings,
    financialSummary,
    hasProfile,
    gamePlay,
    saveProfile,
    updateProfile,
    addTransaction,
    deleteTransaction,
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

  const handleOpenAddExpense = () => {
    setTxModalDefaultType('expense');
    setIsTxModalOpen(true);
  };

  const handleOpenAddIncome = () => {
    setTxModalDefaultType('income');
    setIsTxModalOpen(true);
  };

  // Render view
  return (
    <div className={`min-h-screen bg-retro-bg text-cream ${settings.animations ? '' : 'no-animations'}`}>
      {/* CRT Scanline Overlay Effect */}
      <RetroScanlines enabled={settings.crtEffect} />

      {/* Screen 1: Landing Page */}
      {screen === 'landing' && (
        <Landing
          hasProfile={hasProfile}
          profile={profile}
          summary={financialSummary}
          onStartGame={handleStartGame}
          onContinueGame={handleContinueGame}
          onResetGame={handleHardReset}
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
                  onDeleteTransaction={deleteTransaction}
                  onOpenAddExpense={handleOpenAddExpense}
                  onOpenAddIncome={handleOpenAddIncome}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'settings' && (
                <Settings
                  profile={profile}
                  settings={settings}
                  onUpdateProfile={updateProfile}
                  onUpdateSettings={updateSettings}
                  onResetGame={handleHardReset}
                  onBackToDashboard={() => setActiveTab('dashboard')}
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

              {/* Day 3 Placeholders */}
              {activeTab === 'analytics' && (
                <PlaceholderPage
                  title="FINANCIAL AUTOPSY & ANALYTICS"
                  targetDay="DAY 3"
                  description="Detailed data visualization and expense breakdown charts exposing where every single rupee slipped through your fingers."
                  upcomingFeatures={[
                    'Category Breakdown Donut Chart (Food vs Hostel vs Chaos)',
                    'Burn-rate Trajectory vs Allowance Forecast',
                    'Spending Personality Diagnostics (Frugal Ninja vs Chaos Spender)',
                    'Historical Net Worth graph across the semester',
                  ]}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'achievements' && (
                <PlaceholderPage
                  title="BAD DECISION TROPHIES & ACHIEVEMENTS"
                  targetDay="DAY 3"
                  description="Earn 8-bit badges and unlockable retro trophies commemorating your triumphs and spectacular budget failures."
                  upcomingFeatures={[
                    '30+ Custom Pixel Trophies ("Ramen Alchemist", "Zero Balance Survivor")',
                    'Unlockable Secret Titles and Custom Avatars',
                    'End-of-Month Survival Report Card with Letter Grades (A+ down to F-)',
                    'Shareable 16-Bit Retro Financial Certificates',
                  ]}
                  onBackToDashboard={() => setActiveTab('dashboard')}
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
