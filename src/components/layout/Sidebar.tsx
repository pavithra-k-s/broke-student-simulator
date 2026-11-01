import React from 'react';
import {
  LayoutDashboard,
  Gamepad2,
  ShoppingBag,
  ReceiptText,
  BarChart3,
  Trophy,
  Settings,
} from 'lucide-react';
import { PixelBadge } from '../common/PixelBadge';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isAvailableDay1: boolean;
  comingSoonBadge?: string;
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    isAvailableDay1: true,
  },
  {
    id: 'play-mode',
    label: 'Play Mode',
    icon: <Gamepad2 size={18} />,
    isAvailableDay1: true,
  },
  {
    id: 'store',
    label: 'Temptation Store',
    icon: <ShoppingBag size={18} />,
    isAvailableDay1: true,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: <ReceiptText size={18} />,
    isAvailableDay1: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 size={18} />,
    isAvailableDay1: false,
    comingSoonBadge: 'DAY 3',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: <Trophy size={18} />,
    isAvailableDay1: false,
    comingSoonBadge: 'DAY 3',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={18} />,
    isAvailableDay1: true,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  return (
    <aside className="w-64 bg-retro-panel border-r-2 border-retro-border flex-col shrink-0 min-h-[calc(100vh-65px)] hidden md:flex">
      {/* Sidebar Header / Logo */}
      <div className="p-4 border-b-2 border-retro-border bg-retro-dark/40">
        <div className="flex items-center gap-2">
          <span className="text-xl">💸</span>
          <div>
            <h1 className="font-pixel text-[11px] text-cream tracking-wider leading-tight">
              BROKE STUDENT
            </h1>
            <p className="font-pixel text-[9px] text-neon-lime">SIMULATOR v1.0</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-2 py-1 font-pixel text-[9px] text-cream-muted uppercase tracking-wider">
          MAIN MENU
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono transition-all text-left border-2 ${
                isActive
                  ? 'bg-retro-panel-light text-neon-lime border-neon-lime shadow-pixel-sm font-bold translate-x-1'
                  : 'bg-transparent text-cream hover:bg-retro-panel-light/70 hover:text-neon-lime border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-neon-lime' : 'text-cream-muted'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.comingSoonBadge ? (
                <PixelBadge
                  variant={item.comingSoonBadge === 'DAY 2' ? 'amber' : 'lavender'}
                  size="sm"
                  className="text-[8px] px-1 py-0"
                >
                  {item.comingSoonBadge}
                </PixelBadge>
              ) : isActive ? (
                <span className="text-neon-lime font-pixel text-[9px]">▶</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-3 border-t-2 border-retro-border bg-retro-dark/50">
        <div className="border border-retro-border p-2 bg-retro-panel text-center">
          <p className="font-pixel text-[9px] text-amber mb-1">PRO-TIP</p>
          <p className="font-mono text-[11px] text-cream-muted leading-tight">
            Maggi noodles provide +10 HP but -50 Dignity.
          </p>
        </div>
      </div>
    </aside>
  );
};

