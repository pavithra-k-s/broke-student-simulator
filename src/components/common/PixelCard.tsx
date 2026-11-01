import React from 'react';

export interface PixelCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accent?: 'default' | 'lime' | 'amber' | 'danger' | 'lavender';
  className?: string;
  headerRight?: React.ReactNode;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  accent = 'default',
  className = '',
  headerRight,
}) => {
  const accentBorder = {
    default: 'border-retro-border',
    lime: 'border-neon-lime/80 shadow-pixel-lime',
    amber: 'border-amber/80 shadow-pixel-amber',
    danger: 'border-danger-red/80 shadow-pixel-danger',
    lavender: 'border-lavender/80 shadow-pixel-lavender',
  }[accent];

  const hasHeader = title || icon || headerRight;

  return (
    <div
      className={`relative bg-retro-panel border-2 ${accentBorder} shadow-pixel rounded-none transition-all ${className}`}
    >
      {/* Corner pixel dots for extra retro charm */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-retro-border" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-retro-border" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-retro-border" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-retro-border" />

      {hasHeader && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-retro-border/60 bg-retro-dark/60">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-neon-lime shrink-0">{icon}</span>}
            <div>
              {title && (
                <h3 className="font-pixel text-[11px] sm:text-xs text-cream tracking-wide uppercase">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-cream-muted font-mono">{subtitle}</p>
              )}
            </div>
          </div>
          {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
        </div>
      )}

      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};

