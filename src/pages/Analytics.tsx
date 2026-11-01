import React, { useState, useMemo } from 'react';
import { Transaction } from '../types/transaction';
import { UserProfile } from '../types/profile';
import {
  computeAnalytics,
  CATEGORY_COLORS,
} from '../services/analyticsEngine';
import { determineSpendingPersonality } from '../services/personalityEngine';
import { formatINR } from '../utils/currency';
import { PixelBadge } from '../components/common/PixelBadge';
import { PixelButton } from '../components/common/PixelButton';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface AnalyticsProps {
  transactions: Transaction[];
  profile: UserProfile | null;
  onNavigateTransactions: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  transactions,
  profile,
  onNavigateTransactions,
}) => {
  const [dateRange, setDateRange] = useState<'7D' | '30D' | 'ALL'>('ALL');

  const analytics = useMemo(() => {
    return computeAnalytics(transactions, profile, dateRange);
  }, [transactions, profile, dateRange]);

  const personality = useMemo(() => {
    return determineSpendingPersonality(transactions);
  }, [transactions]);

  // Custom retro tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-retro-dark border-2 border-retro-border p-2.5 shadow-pixel font-mono text-xs">
          {label && <p className="text-cream-muted text-[10px] mb-1">{label}</p>}
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color || entry.fill }}>
              {entry.name || 'Amount'}: {formatINR(entry.value * 100)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header with Date Range Filter */}
      <div className="bg-retro-panel border-4 border-retro-border p-4 sm:p-5 shadow-pixel-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-retro-dark border border-retro-border text-neon-lime">
            <BarChart3 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-xs sm:text-sm text-cream uppercase">
                FINANCIAL AUTOPSY & ANALYTICS
              </h2>
              <PixelBadge variant="lime" size="sm">
                REAL BUDGET
              </PixelBadge>
            </div>
            <p className="font-mono text-xs text-cream-muted">
              Data visualizations derived strictly from your genuine expense ledger
            </p>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-retro-dark border border-retro-border self-start sm:self-auto">
          {(['ALL', '30D', '7D'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 font-pixel text-[9px] border transition-all ${
                dateRange === range
                  ? 'bg-neon-lime text-retro-dark border-neon-lime shadow-pixel-sm font-bold'
                  : 'bg-transparent text-cream-muted hover:text-cream border-transparent'
              }`}
            >
              {range === 'ALL' ? 'ALL TIME' : range === '30D' ? 'LAST 30D' : 'LAST 7D'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-retro-panel border-2 border-retro-border p-3 shadow-pixel">
          <p className="font-mono text-[10px] text-cream-muted uppercase">Total Inflow</p>
          <p className="font-pixel text-xs sm:text-base text-neon-lime mt-1">
            +{formatINR(analytics.totalIncomePaise)}
          </p>
        </div>
        <div className="bg-retro-panel border-2 border-retro-border p-3 shadow-pixel">
          <p className="font-mono text-[10px] text-cream-muted uppercase">Total Outflow</p>
          <p className="font-pixel text-xs sm:text-base text-danger-red mt-1">
            -{formatINR(analytics.totalExpensesPaise)}
          </p>
        </div>
        <div className="bg-retro-panel border-2 border-retro-border p-3 shadow-pixel">
          <p className="font-mono text-[10px] text-cream-muted uppercase">Daily Burn Average</p>
          <p className="font-pixel text-xs sm:text-base text-amber mt-1">
            {formatINR(analytics.averageDailySpendPaise)}/day
          </p>
        </div>
        <div className="bg-retro-panel border-2 border-retro-border p-3 shadow-pixel">
          <p className="font-mono text-[10px] text-cream-muted uppercase">Projected Horizon</p>
          <p
            className={`font-pixel text-xs sm:text-base mt-1 ${
              analytics.projectedEndBalancePaise < 0 ? 'text-danger-red glow-red' : 'text-neon-lime glow-lime'
            }`}
          >
            {formatINR(analytics.projectedEndBalancePaise)}
          </p>
        </div>
      </div>

      {/* Spending Personality Banner Widget */}
      <div className="bg-gradient-to-r from-retro-panel via-[#252A44] to-retro-panel border-4 border-retro-border p-5 shadow-pixel-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="text-4xl p-2 bg-retro-dark border-2 border-retro-border shrink-0 select-none">
              {personality.emoji}
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] text-amber uppercase">
                  FINANCIAL PERSONALITY PROFILE:
                </span>
                <span
                  className={`font-pixel text-[10px] px-2 py-0.5 border uppercase ${personality.badgeColor}`}
                >
                  {personality.title}
                </span>
              </div>
              <p className="font-mono text-sm text-cream font-bold">
                "{personality.subtitle}"
              </p>
              <p className="font-mono text-xs text-cream-muted max-w-xl leading-relaxed">
                {personality.description}
              </p>
              <p className="font-mono text-[11px] text-cream/90 pt-1">
                <strong>Why you got this:</strong> {personality.evidence}
              </p>
            </div>
          </div>

          <div className="bg-retro-dark/80 border border-retro-border p-3 w-full sm:w-64 shrink-0 font-mono text-xs space-y-1">
            <p className="font-pixel text-[9px] text-neon-lime flex items-center gap-1 uppercase">
              <Lightbulb size={12} /> PROACTION TIP:
            </p>
            <p className="text-cream-muted text-[11px] leading-relaxed">
              {personality.practicalTip}
            </p>
          </div>
        </div>
      </div>

      {/* Empty State Guard if user hasn't logged transactions */}
      {!analytics.hasEnoughData ? (
        <div className="p-8 bg-retro-panel border-2 border-dashed border-retro-border text-center space-y-3 shadow-pixel">
          <PieIcon className="w-12 h-12 text-cream-muted mx-auto opacity-40 animate-pulse" />
          <h3 className="font-pixel text-xs sm:text-sm text-cream uppercase">
            INSUFFICIENT EXPENSE DATA FOR CHARTS
          </h3>
          <p className="font-mono text-xs text-cream-muted max-w-md mx-auto">
            You need at least 2 recorded real-budget transactions to populate donut charts, category distributions, and burn-rate trendlines.
          </p>
          <PixelButton
            variant="lime"
            size="sm"
            onClick={onNavigateTransactions}
            icon={<ArrowRight size={14} />}
          >
            RECORD TRANSACTIONS IN LEDGER ▶
          </PixelButton>
        </div>
      ) : (
        <>
          {/* Grid A: Spending by Category Donut & Daily Spending Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* A. Spending by Category Donut Chart */}
            <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel flex flex-col justify-between">
              <div className="border-b border-retro-border pb-2.5 mb-3 flex items-center justify-between">
                <h3 className="font-pixel text-xs text-cream uppercase flex items-center gap-2">
                  <span>EXPENSES BY CATEGORY</span>
                </h3>
                <span className="font-mono text-[10px] text-cream-muted">
                  {analytics.categoryData.length} categories
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryData}
                      dataKey="amountRupees"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      stroke="#20243A"
                      strokeWidth={3}
                      paddingAngle={2}
                    >
                      {analytics.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Legend with Amounts & Percentages */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-retro-border/60 font-mono text-[11px]">
                {analytics.categoryData.map((cat) => (
                  <div key={cat.category} className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 shrink-0 border border-black"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate text-cream">{cat.category}:</span>
                    <span className="font-bold text-cream-muted">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* B. Daily Spending Trend Line Chart */}
            <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel flex flex-col justify-between">
              <div className="border-b border-retro-border pb-2.5 mb-3 flex items-center justify-between">
                <h3 className="font-pixel text-xs text-cream uppercase flex items-center gap-2">
                  <span>DAILY SPENDING TRAJECTORY</span>
                </h3>
                <span className="font-mono text-[10px] text-cream-muted">
                  Trendline Over Time
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2C324E" />
                    <XAxis dataKey="displayDate" stroke="#BDB6A2" fontSize={10} tickLine={false} />
                    <YAxis stroke="#BDB6A2" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="expenseRupees"
                      name="Expense"
                      stroke="#FF657A"
                      strokeWidth={3}
                      dot={{ fill: '#FF657A', stroke: '#111522', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#C8FF70' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-3 border-t border-retro-border/60 flex items-center justify-between text-xs font-mono text-cream-muted">
                <span>Burn Rate Analysis:</span>
                <span className="text-amber font-bold">
                  Avg {formatINR(analytics.averageDailySpendPaise)} / active day
                </span>
              </div>
            </div>
          </div>

          {/* Grid B: Income vs Expenses & Essential vs Discretionary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* C. Income vs Expenses Comparison */}
            <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel">
              <div className="border-b border-retro-border pb-2.5 mb-3 flex items-center justify-between">
                <h3 className="font-pixel text-xs text-cream uppercase">
                  INCOME VS EXPENSES
                </h3>
                <span className="font-mono text-[10px] text-cream-muted">
                  Inflow vs Outflow
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'Totals',
                        Inflow: analytics.totalIncomePaise / 100,
                        Outflow: analytics.totalExpensesPaise / 100,
                      },
                    ]}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2C324E" />
                    <XAxis dataKey="name" stroke="#BDB6A2" fontSize={10} tickLine={false} />
                    <YAxis stroke="#BDB6A2" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Space Mono' }} />
                    <Bar dataKey="Inflow" fill="#C8FF70" />
                    <Bar dataKey="Outflow" fill="#FF657A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* E. Essential vs Discretionary Breakdown */}
            <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel flex flex-col justify-between">
              <div>
                <div className="border-b border-retro-border pb-2.5 mb-3 flex items-center justify-between">
                  <h3 className="font-pixel text-xs text-cream uppercase">
                    ESSENTIAL VS DISCRETIONARY
                  </h3>
                  <span className="font-mono text-[10px] text-cream-muted">
                    Survival Ratio
                  </span>
                </div>

                <div className="space-y-4 my-4 font-mono text-xs">
                  {/* Visual Proportion Bar */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-neon-lime font-bold">
                        Essentials: {analytics.essentialPercent}%
                      </span>
                      <span className="text-danger-red font-bold">
                        Discretionary: {analytics.discretionaryPercent}%
                      </span>
                    </div>
                    <div className="w-full h-4 bg-retro-dark border border-retro-border flex overflow-hidden p-0.5">
                      <div
                        className="h-full bg-neon-lime transition-all duration-300"
                        style={{ width: `${analytics.essentialPercent}%` }}
                      />
                      <div
                        className="h-full bg-danger-red transition-all duration-300"
                        style={{ width: `${analytics.discretionaryPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-retro-dark p-3 border border-retro-border">
                      <p className="text-[10px] text-cream-muted uppercase">Essential Spent</p>
                      <p className="font-pixel text-xs sm:text-sm text-neon-lime mt-1">
                        {formatINR(analytics.essentialSpentPaise)}
                      </p>
                      <p className="text-[9px] text-cream-muted mt-0.5">Food, Hostel, Transport</p>
                    </div>

                    <div className="bg-retro-dark p-3 border border-retro-border">
                      <p className="text-[10px] text-cream-muted uppercase">Discretionary Spent</p>
                      <p className="font-pixel text-xs sm:text-sm text-danger-red mt-1">
                        {formatINR(analytics.discretionarySpentPaise)}
                      </p>
                      <p className="text-[9px] text-cream-muted mt-0.5">Shopping, Fun, Luxury</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-retro-dark/60 border border-retro-border font-mono text-[11px] text-cream-muted">
                {analytics.discretionaryPercent > 40
                  ? '⚠️ High luxury alert: Non-essential purchases are exceeding 40% of outflow.'
                  : '✓ Disciplined ratio: Essentials dominate your spending.'}
              </div>
            </div>
          </div>

          {/* D. Monthly Budget Progress Bars */}
          <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel">
            <div className="border-b border-retro-border pb-2.5 mb-4 flex items-center justify-between">
              <h3 className="font-pixel text-xs text-cream uppercase">
                CATEGORY BUDGET CONSUMPTION
              </h3>
              <span className="font-mono text-[10px] text-cream-muted">
                Estimated Allowance Allocation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              {analytics.budgetProgress.map((item) => {
                const color = CATEGORY_COLORS[item.category];
                return (
                  <div key={item.category} className="bg-retro-dark border border-retro-border p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cream flex items-center gap-1.5">
                        <span className="w-2 h-2" style={{ backgroundColor: color }} />
                        {item.category}
                      </span>
                      <span
                        className={`font-pixel text-[10px] ${
                          item.isOverBudget ? 'text-danger-red' : 'text-neon-lime'
                        }`}
                      >
                        {item.percentUsed}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-retro-panel border border-retro-border overflow-hidden">
                      <div
                        className={`h-full ${item.isOverBudget ? 'bg-danger-red' : 'bg-neon-lime'}`}
                        style={{ width: `${Math.min(100, item.percentUsed)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-cream-muted pt-0.5">
                      <span>Spent: {formatINR(item.spentPaise)}</span>
                      <span>Target: {formatINR(item.limitPaise)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* F. Dynamic Financial Insights */}
          <div className="bg-retro-panel border-2 border-retro-border p-5 shadow-pixel space-y-3">
            <div className="border-b border-retro-border pb-2 flex items-center gap-2">
              <Lightbulb size={16} className="text-amber" />
              <h3 className="font-pixel text-xs text-amber uppercase">
                AUTOMATED FINANCIAL INSIGHTS
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs text-cream">
              {analytics.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-retro-dark border border-retro-border">
                  <span className="text-neon-lime">▶</span>
                  <p>{insight}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-cream-muted/70 italic pt-1">
              * Note: Projections and allocations are transparent mathematical estimates based strictly on your logged transaction history.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
