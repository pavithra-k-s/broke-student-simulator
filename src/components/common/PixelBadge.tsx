import React from 'react';

export interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'amber' | 'danger' | 'lavender' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const PixelBadge: React.FC<PixelBadgeProps> = ({
  children,
  variant = 'lime',
  size = 'md',
  className = '',
  icon,
}) => {
  const variantStyles = {
    lime: 'bg-neon-lime/20 text-neon-lime border-neon-lime/50',
    amber: 'bg-amber/20 text-amber border-amber/50',
    danger: 'bg-danger-red/20 text-danger-red border-danger-red/50',
    lavender: 'bg-lavender/20 text-lavender border-lavender/50',
    neutral: 'bg-retro-panel-light text-cream-muted border-retro-border',
  }[variant];

  const sizeStyles = {
    sm: 'text-[9px] px-1.5 py-0.5 font-pixel',
    md: 'text-[10px] px-2.5 py-1 font-pixel',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border uppercase select-none ${variantStyles} ${sizeStyles} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

