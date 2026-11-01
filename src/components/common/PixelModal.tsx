import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface PixelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

export const PixelModal: React.FC<PixelModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  icon,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-retro-dark/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Retro Dialogue Box Modal */}
      <div
        className={`relative w-full ${widthClass} bg-retro-panel border-4 border-retro-border shadow-pixel-lg z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer pixel notches */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-neon-lime" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-neon-lime" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-neon-lime" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-neon-lime" />

        {/* Modal RPG Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-retro-dark border-b-2 border-retro-border">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-neon-lime">{icon}</span>}
            <h2 className="font-pixel text-xs sm:text-sm text-neon-lime uppercase tracking-wide">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-cream-muted hover:text-danger-red hover:bg-danger-red/10 border border-transparent hover:border-danger-red transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

