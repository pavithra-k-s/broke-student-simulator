import React from 'react';

export interface PixelSelectOption {
  value: string;
  label: string;
}

export interface PixelSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: PixelSelectOption[];
  error?: string;
  helperText?: string;
}

export const PixelSelect = React.forwardRef<HTMLSelectElement, PixelSelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block font-pixel text-[10px] text-cream-muted uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full bg-retro-dark border-2 ${
              error ? 'border-danger-red focus:border-danger-red' : 'border-retro-border focus:border-neon-lime'
            } text-cream px-3 py-2 text-sm font-mono appearance-none focus:outline-none focus:ring-1 focus:ring-neon-lime/50 shadow-inner cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-retro-panel text-cream py-1">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-cream-muted">
            <span className="text-xs">▼</span>
          </div>
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

PixelSelect.displayName = 'PixelSelect';

