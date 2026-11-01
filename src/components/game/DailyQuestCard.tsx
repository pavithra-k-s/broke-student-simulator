import React from 'react';
import { DailyQuest } from '../../types/gameplay';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { Target, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface DailyQuestCardProps {
  quest: DailyQuest;
  onClaimReward: () => void;
}

export const DailyQuestCard: React.FC<DailyQuestCardProps> = ({ quest, onClaimReward }) => {
  return (
    <div className="bg-retro-panel border-2 border-retro-border p-4 shadow-pixel">
      <div className="flex items-center justify-between border-b border-retro-border/60 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-neon-lime" />
          <h3 className="font-pixel text-xs text-cream uppercase">
            DAILY SURVIVAL OBJECTIVE
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <PixelBadge variant={quest.isCompleted ? 'lime' : 'amber'} size="sm">
            {quest.isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
          </PixelBadge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-retro-dark border border-retro-border">
        <div className="space-y-1">
          <h4 className="font-pixel text-[11px] text-neon-lime tracking-wide uppercase">
            {quest.title}
          </h4>
          <p className="font-mono text-xs text-cream-muted leading-relaxed">
            {quest.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="font-pixel text-xs text-lavender block">
              +{quest.xpReward} XP
            </span>
            <span className="font-mono text-[10px] text-cream-muted">
              Reward
            </span>
          </div>

          {quest.isCompleted && !quest.xpClaimed && (
            <PixelButton
              variant="lime"
              size="sm"
              onClick={onClaimReward}
              icon={<Sparkles size={13} />}
              className="animate-bounce-slow text-[10px]"
            >
              CLAIM XP
            </PixelButton>
          )}

          {quest.isCompleted && quest.xpClaimed && (
            <div className="flex items-center gap-1 text-neon-lime font-mono text-xs px-2 py-1 bg-neon-lime/10 border border-neon-lime/40">
              <CheckCircle2 size={14} />
              <span>XP CLAIMED</span>
            </div>
          )}

          {!quest.isCompleted && (
            <div className="flex items-center gap-1 text-amber font-mono text-xs px-2 py-1 bg-amber/10 border border-amber/30">
              <Clock size={13} />
              <span>ACTIVE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

