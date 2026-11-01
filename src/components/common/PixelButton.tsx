import React from 'react';

export interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'lime' | 'amber' | 'danger' | 'lavender' | 'panel' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  pixelFont?: boolean;
  icon?: React.ReactNode;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  variant = 'lime',
  size = 'md',
  fullWidth = false,
  pixelFont = true,
  icon,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center gap-2 transition-transform select-none cursor-pointer border-2 border-black focus:outline-none';

  const sizeClasses = {
    sm: pixelFont ? 'px-3 py-1.5 text-[10px]' : 'px-3 py-1 text-xs font-bold',
    md: pixelFont ? 'px-4 py-2.5 text-xs' : 'px-4 py-2 text-sm font-bold',
    lg: pixelFont ? 'px-6 py-3.5 text-sm tracking-wide' : 'px-6 py-3 text-base font-bold',
  };

  const variantClasses = {
    lime: 'bg-neon-lime text-retro-dark shadow-pixel hover:brightness-105 active:shadow-pixel-sm active:translate-x-0.5 active:translate-y-0.5',
    amber: 'bg-amber text-retro-dark shadow-pixel hover:brightness-105 active:shadow-pixel-sm active:translate-x-0.5 active:translate-y-0.5',
    danger: 'bg-danger-red text-white shadow-pixel hover:brightness-105 active:shadow-pixel-sm active:translate-x-0.5 active:translate-y-0.5',
    lavender: 'bg-lavender text-retro-dark shadow-pixel hover:brightness-105 active:shadow-pixel-sm active:translate-x-0.5 active:translate-y-0.5',
    panel: 'bg-retro-panel-light text-cream shadow-pixel hover:bg-retro-border active:shadow-pixel-sm active:translate-x-0.5 active:translate-y-0.5 border-retro-border',
    outline: 'bg-transparent text-cream border-2 border-retro-border shadow-pixel hover:bg-retro-panel-light active:shadow-pixel-sm active:translate-x-0.5 active:translate-y-0.5',
  };

  const fontClass = pixelFont ? 'font-pixel' : 'font-mono uppercase tracking-wider';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale'
    : '';

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fontClass} ${widthClass} ${disabledClasses} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

