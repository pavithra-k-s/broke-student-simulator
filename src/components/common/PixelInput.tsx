import React from 'react';

export interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: string;
  suffix?: string;
}

export const PixelInput = React.forwardRef<HTMLInputElement, PixelInputProps>(
  ({ label, error, helperText, prefix, suffix, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-pixel text-[10px] text-cream-muted uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-neon-lime font-mono font-bold select-none pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-retro-dark border-2 ${
              error ? 'border-danger-red focus:border-danger-red' : 'border-retro-border focus:border-neon-lime'
            } text-cream px-3 py-2 text-sm font-mono placeholder-cream-muted/50 focus:outline-none focus:ring-1 focus:ring-neon-lime/50 shadow-inner transition-colors ${
              prefix ? 'pl-8' : ''
            } ${suffix ? 'pr-8' : ''} ${className}`}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-cream-muted font-mono text-xs select-none pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {error ? (
          <p className="font-mono text-xs text-danger-red flex items-center gap-1 mt-1">
            <span>⚠️</span> {error}
          </p>
        ) : helperText ? (
          <p className="font-mono text-[11px] text-cream-muted/80 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

PixelInput.displayName = 'PixelInput';

