import React from 'react';
import { PixelButton } from '../components/common/PixelButton';
import { PixelBadge } from '../components/common/PixelBadge';
import { ArrowLeft, Clock, Lock } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  targetDay: 'DAY 2' | 'DAY 3';
  description: string;
  upcomingFeatures: string[];
  onBackToDashboard: () => void;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  targetDay,
  description,
  upcomingFeatures,
  onBackToDashboard,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-retro-panel border-4 border-retro-border p-6 sm:p-8 shadow-pixel-lg text-center relative">
        {/* Pixel Notches */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-amber" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber" />

        <div className="flex justify-center mb-4">
          <div className="p-4 bg-retro-dark border-2 border-retro-border shadow-pixel inline-flex items-center justify-center">
            <Lock className="w-8 h-8 text-amber animate-pulse-subtle" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 mb-2">
          <PixelBadge variant={targetDay === 'DAY 2' ? 'amber' : 'lavender'} size="md">
            COMING IN {targetDay}
          </PixelBadge>
        </div>

        <h2 className="font-pixel text-base sm:text-xl text-cream uppercase mb-3">
          {title}
        </h2>

        <p className="font-mono text-xs sm:text-sm text-cream-muted max-w-md mx-auto mb-6">
          {description}
        </p>

        {/* Feature roadmap preview */}
        <div className="text-left bg-retro-dark border-2 border-retro-border p-4 mb-6">
          <p className="font-pixel text-[10px] text-neon-lime uppercase mb-2 flex items-center gap-1.5">
            <Clock size={12} />
            <span>DEVELOPMENT ROADMAP PREVIEW</span>
          </p>
          <ul className="space-y-2 font-mono text-xs text-cream-muted">
            {upcomingFeatures.map((feat, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-neon-lime">▶</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center gap-3">
          <PixelButton
            variant="outline"
            size="md"
            onClick={onBackToDashboard}
            icon={<ArrowLeft size={14} />}
          >
            RETURN TO DASHBOARD
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
