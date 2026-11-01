import React, { useState, useMemo } from 'react';
import { Achievement } from '../types/achievement';
import { PixelBadge } from '../components/common/PixelBadge';
import { Trophy, Sparkles, Filter } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const [filter, setFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const unlockPercentage = Math.round((unlockedCount / totalCount) * 100);

  const filtered = useMemo(() => {
    return achievements.filter((a) => {
      if (filter === 'UNLOCKED') return a.isUnlocked;
      if (filter === 'LOCKED') return !a.isUnlocked;
      return true;
    });
  }, [achievements, filter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-retro-panel border-4 border-retro-border p-4 sm:p-5 shadow-pixel-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-retro-dark border border-retro-border text-amber">
            <Trophy size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-xs sm:text-sm text-cream uppercase">
                BAD DECISION TROPHIES & ACHIEVEMENTS
              </h2>
              <PixelBadge variant="amber" size="sm">
                16-BIT TROPHIES
              </PixelBadge>
            </div>
            <p className="font-mono text-xs text-cream-muted">
              Commemorating triumphs, frugality, and spectacular financial disasters
            </p>
          </div>
        </div>

        {/* Progress Summary Pill */}
        <div className="bg-retro-dark border-2 border-retro-border p-3 shadow-pixel-sm text-right shrink-0">
          <span className="font-pixel text-[9px] text-cream-muted uppercase block">
            UNLOCKED: {unlockedCount} / {totalCount} ({unlockPercentage}%)
          </span>
          <div className="w-36 h-2 bg-retro-panel border border-retro-border mt-1.5 overflow-hidden">
            <div
              className="h-full bg-amber transition-all duration-300"
              style={{ width: `${unlockPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="font-pixel text-[9px] text-cream-muted uppercase flex items-center gap-1">
          <Filter size={11} /> FILTER:
        </span>
        {(['ALL', 'UNLOCKED', 'LOCKED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 font-pixel text-[9px] uppercase border transition-all ${
              filter === tab
                ? 'bg-amber text-retro-dark border-amber shadow-pixel-sm font-bold'
                : 'bg-retro-panel text-cream-muted hover:text-cream border-retro-border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => {
          const progressPercent = Math.min(100, Math.round((ach.currentCount / ach.targetCount) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 border-2 transition-all flex flex-col justify-between ${
                ach.isUnlocked
                  ? 'bg-retro-panel border-amber/80 shadow-pixel-amber'
                  : 'bg-retro-panel/50 border-retro-border opacity-70 grayscale-[0.4]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl p-1.5 bg-retro-dark border border-retro-border shrink-0 select-none">
                    {ach.isUnlocked ? ach.emoji : '🔒'}
                  </span>
                  <div className="flex items-center gap-1">
                    {ach.isUnlocked ? (
                      <PixelBadge variant="amber" size="sm">
                        UNLOCKED
                      </PixelBadge>
                    ) : (
                      <span className="font-pixel text-[9px] text-cream-muted px-2 py-0.5 border border-retro-border bg-retro-dark">
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-pixel text-xs text-cream uppercase mt-2">
                  {ach.title}
                </h3>
                <p className="font-mono text-xs text-cream-muted mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Progress & Bonus */}
              <div className="mt-4 pt-3 border-t border-retro-border/60 space-y-1.5 font-mono text-[11px]">
                {!ach.isUnlocked && (
                  <div>
                    <div className="flex justify-between text-[10px] text-cream-muted mb-1">
                      <span>Progress</span>
                      <span>
                        {ach.currentCount} / {ach.targetCount}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-retro-dark border border-retro-border">
                      <div
                        className="h-full bg-amber transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="font-pixel text-[9px] text-lavender flex items-center gap-1">
                    <Sparkles size={11} /> +{ach.xpBonus} XP
                  </span>

                  {ach.isUnlocked && ach.unlockedAt && (
                    <span className="text-[10px] text-cream-muted">
                      {new Date(ach.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
