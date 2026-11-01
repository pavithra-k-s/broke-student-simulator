# 💸 BROKE STUDENT SIMULATOR
> *"Your money is temporary. Your bad decisions are forever."*

A nostalgic 16-bit retro RPG financial survival game built for college students navigating the perilous economic crisis between allowance drops.

---

## 🎮 Live Concept & Overview

**Broke Student Simulator** merges the addictive progression loop of a 1990s Game Boy / SNES RPG with a real, rock-solid personal finance budgeting system.

College students don't need another sterile corporate spreadsheet or boring fintech dashboard — they need an engaging, relatable game loop that turns financial discipline, avoiding unnecessary impulse purchases, and stretching their rupee runway into an epic quest for survival.

---

## 🌟 The 3-Day Development Journey

### 🛡️ DAY 1 — The Cartridge Foundation & Real Budget Ledger
- **Retro 16-Bit Design System**: Pixel-art typography (`Press Start 2P`, `VT323`, `Space Mono`), custom CRT scanline phosphor shaders, chunky borders, and a vibrant color palette (`#111522`, `#20243A`, `#C8FF70`, `#FFC857`, `#FF657A`, `#B8A5FF`, `#F5F0DF`).
- **Interactive Onboarding Flow**: 4-step wizard setting Player Nickname, Starting Balance, Monthly Allowance, Allowance Countdown, Fixed Commitments (Mess, Rent, Wi-Fi), and Difficulty Level (`EASY`, `NORMAL`, `HARD`).
- **Financial Calculation Engine**: Integer-paise precision (1 INR = 100 paise) preventing IEEE-754 floating-point inaccuracies. Calculates Available Balance, Safe Daily Limit, Runway Days, and Health Status.
- **Real Budget Ledger**: Logging real income & expense transactions with category tags, notes, and local storage cartridge persistence.

### 🕹️ DAY 2 — The Interactive Campus Play Loop & Temptation Store
- **Play Mode Engine**: 30-day simulated survival campaign featuring a dynamic pixel-art college campus (Hostel dorm, Main quad, Library, Canteen).
- **Random Campus Events**: Dynamic choice trees with branching outcomes affecting game balance, student dignity, and XP. Frugal vs reckless trade-offs.
- **Temptation Store**: Campus store stocking 8-bit student staples (Midnight Maggi, Cold Brew, Concert Tickets, Noise-Cancelling Headphones). Supports real-time price editing and custom item creation.
- **Daily Quests & Progression**: Procedural daily objectives, streak multipliers, and 5 level tiers (from *Level 1: Broke Fresher* up to *Level 5: Broke God*).
- **End-of-Day Autopsy Summary**: Nightly retro modal grading your day (`A+` to `F-`) with humorous 8-bit commentary before advancing the countdown clock.
- **Payday Celebration**: Automatic allowance injection upon surviving to Day 1.

### 🏆 DAY 3 — Financial Autopsy, Analytics, Achievements & Data Management
- **Visual Analytics Dashboard (Recharts)**:
  - **Category Spending Donut Chart**: Visual distribution across Food, Transport, Education, Hostel, Shopping, Entertainment, etc.
  - **Daily Spending Trendline**: Responsive line chart tracking expenses over 7-day, 30-day, or all-time horizons.
  - **Income vs Expense Comparison**: Bar chart benchmarking monthly inflow against total outflows.
  - **Category Budget Progress**: Real-time progress bars monitoring spend vs category thresholds.
  - **Essential vs Discretionary Breakdown**: Explicitly categorizing vital survival costs vs impulse desires.
  - **Automated Financial Insights**: Algorithmic insights pinpointing largest single expense, highest burn category, and projected runway.
- **Spending Personality Diagnostics**: Identifies which of 7 collegiate archetypes you belong to (*The Frugal Ninja*, *The Caffeine Alchemist*, *The Impulse Goblin*, *The Generous Hosteler*, *The Weekend Warrior*, *The Ghost Investor*, or *The Balanced Scholar*).
- **15 Retro Unlockable Achievements**: 16-bit badges & trophies with live achievement pop-up toasts (`FIRST_BLOOD`, `COIN_COLLECTOR`, `THE_RESISTANCE`, `STREAK_MACHINE`, `PIXEL_MILLIONAIRE`, and more).
- **Enhanced Transaction Ledger**: Multi-filter search (by keyword, category, type, and date range), column sorting, in-place transaction editing, and safe deletion.
- **Dual Ledger View**: Switch between **Real Budget Ledger** and **Simulated Game Ledger** with 100% strict data isolation.
- **CSV Import & Export**: One-click download of your transaction history to CSV and parser for importing transaction files.
- **Full JSON Cartridge Backup & Restore**: Export complete game state and budget history into portable JSON files and restore anytime.
- **Instant Demo Cartridge Mode**: 1-click test drive loaded with rich realistic transactions, Day 4 game progression, and unlocked trophies. Easily exit back to your real data at any time.

---

## 🔒 Sacred Rule: Strict Ledger Isolation

A core architecture principle of **Broke Student Simulator** is total isolation between your **Real Budget** and the **Fictional Simulation Game**:

```
┌─────────────────────────────────────────────────────────────┐
│                       LOCAL STORAGE                         │
│                    (GameSaveData schema)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │  REAL BUDGET LEDGER  │        │   GAME PLAY ENGINE   │
    │   data.transactions  │        │     data.gamePlay    │
    └──────────┬───────────┘        └──────────┬───────────┘
               │                               │
    • Dashboard Balances            • Campus Day Simulation
    • Financial Analytics           • Temptation Store Buys
    • Recharts Donut & Trend        • Random Event Consequence
    • Personality Diagnosis         • XP & Survival Streaks
    • CSV Export / Import           • Day-End Autopsy Modals
```

*Fictional purchases (like ₹50 Midnight Maggi in Play Mode) NEVER affect your real-world wallet balance or analytics.*

---

## 🛠️ Tech Stack & Architecture

- **UI Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom 16-Bit Retro Pixel Theme & CRT Shaders
- **Charts & Data Visualization**: Recharts (Custom dark retro tooltips and responsive containers)
- **Icons**: Lucide React + Custom SVG 16-bit Pixel-Art Assets
- **State & Storage**: Custom reactive hook `useGameState` with LocalStorage cartridge serialization
- **Testing**: Node.js Native Test Runner (`node:test`, `node:assert/strict`) via Vite SSR test bundle (23/23 tests passing)

---

## 🎨 Color Palette & Aesthetics

| Swatch | Color | Hex Code | Purpose |
|:---:|:---:|:---:|:---|
| ⬛ | Void Black | `#111522` | Deep space retro background |
| 🪟 | Cyber Panel | `#20243A` | Elevated UI cards and dialog boxes |
| 🟩 | Neon Lime | `#C8FF70` | Primary action buttons, success, gains |
| 🟨 | Retro Amber | `#FFC857` | Warnings, coins, secondary highlights |
| 🟥 | Danger Red | `#FF657A` | Deficit, damage, expenses, debt alerts |
| 🟪 | Lavender | `#B8A5FF` | Badges, level badges, rare trophies |
| 📜 | Cream Text | `#F5F0DF` | High-contrast readable 8-bit text |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/broke-student-simulator.git
cd broke-student-simulator

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173` to play!

### Running Unit Tests

```bash
npm test
```
Executes all 23 unit tests across currency conversion, budget formulas, event generation, quest conditions, analytics calculations, personality diagnostics, CSV parsing, and achievement triggers.

### Building for Production

```bash
npm run build
```
Typechecks via `tsc` and creates an optimized static production bundle in `dist/`.

---

## 📋 LocalStorage Cartridge Schema

The entire state of the simulator is persisted under the `broke_student_simulator_save_v1` key:

```typescript
interface GameSaveData {
  version: string;
  profile: UserProfile | null;
  transactions: Transaction[];          // Real-world budget records
  gamePlay?: GamePlayState;             // Fictional 30-day simulation records
  achievements?: AchievementState;      // Trophies & unlock progress
  isDemoMode?: boolean;                 // Demo cartridge flag
  settings: AppSettings;
}
```

---

## 🎓 Hackathon / Project Defense Highlights

When demonstrating this project to reviewers or instructors:
1. **Click "LOAD DEMO CARTRIDGE"** on the landing screen to instantly showcase a live, populated save state without manual typing.
2. **Navigate to Analytics**: Show the Recharts Donut category breakdown, spending trendline, and the AI Spending Personality diagnosis.
3. **Navigate to Play Mode**: Advance a simulated day, trigger a campus random event (e.g. "Senior Treat" or "Forgotten Assignment"), visit the Temptation Store, and watch the evening autopsy modal.
4. **Demonstrate Data Portability**: Go to Transactions, export your data as a clean `.csv` file, and show full JSON cartridge backup and restore under Settings.
5. **Show Zero Ledger Contamination**: Buy an item in the Temptation Store, then switch to the Real Ledger to verify real finances remained completely untouched.

---

*Built with caffeine, instant noodles, and panic during the 3-day financial survival hackathon.* 🍜

