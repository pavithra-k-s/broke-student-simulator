import React from 'react';

export interface RetroScanlinesProps {
  enabled?: boolean;
}

export const RetroScanlines: React.FC<RetroScanlinesProps> = ({ enabled = true }) => {
  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 scanlines crt-flicker opacity-60"
      aria-hidden="true"
    />
  );
};

