import React from 'react';
import { LayoutDashboard, Gamepad2, ShoppingBag, ReceiptText, Settings } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dash', icon: <LayoutDashboard size={17} /> },
    { id: 'play-mode', label: 'Play', icon: <Gamepad2 size={17} /> },
    { id: 'store', label: 'Store', icon: <ShoppingBag size={17} /> },
    { id: 'transactions', label: 'Ledger', icon: <ReceiptText size={17} /> },
    { id: 'settings', label: 'Config', icon: <Settings size={17} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-retro-panel border-t-2 border-retro-border flex md:hidden px-2 py-1 justify-around shadow-pixel">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-none transition-colors ${
              isActive
                ? 'text-neon-lime border-t-2 border-neon-lime bg-retro-dark/50'
                : 'text-cream-muted hover:text-cream'
            }`}
          >
            {tab.icon}
            <span className="font-pixel text-[8px] mt-1 tracking-tighter">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

