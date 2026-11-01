import React from 'react';
import { PixelModal } from '../common/PixelModal';
import { PixelButton } from '../common/PixelButton';
import { StoreProduct } from '../../types/gameplay';
import { formatINR } from '../../utils/currency';
import { AlertCircle } from 'lucide-react';

interface PurchaseConfirmModalProps {
  product: StoreProduct | null;
  currentBalancePaise: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: StoreProduct) => void;
}

export const PurchaseConfirmModal: React.FC<PurchaseConfirmModalProps> = ({
  product,
  currentBalancePaise,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  const cost = product.pricePaise;
  const newBalance = currentBalancePaise - cost;

  return (
    <PixelModal
      isOpen={isOpen}
      onClose={onClose}
      title="EXPENSIVE PURCHASE WARNING"
      icon={<AlertCircle className="text-amber" size={18} />}
    >
      <div className="space-y-4 font-mono text-xs text-cream">
        <div className="p-3 bg-amber/10 border border-amber/40 text-amber flex items-start gap-2.5">
          <span className="text-xl shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="font-bold">High Value Transaction Alert!</p>
            <p className="text-[11px] text-cream-muted mt-0.5">
              This purchase exceeds ₹200. Are you sure you want to commit your limited collegiate capital?
            </p>
          </div>
        </div>

        <div className="p-3 bg-retro-dark border border-retro-border space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{product.emoji}</span>
            <div>
              <p className="font-pixel text-xs text-cream">{product.name}</p>
              <p className="text-cream-muted text-[11px]">{product.category}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-retro-border/80 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-cream-muted">Price:</span>
              <span className="font-bold text-danger-red">-{formatINR(cost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cream-muted">Current Balance:</span>
              <span>{formatINR(currentBalancePaise)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-retro-border/40 pt-1">
              <span>Balance After Purchase:</span>
              <span className={newBalance < 0 ? 'text-danger-red' : 'text-neon-lime'}>
                {formatINR(newBalance)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <PixelButton
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            RESIST TEMPTATION
          </PixelButton>
          <PixelButton
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm(product);
              onClose();
            }}
          >
            CONFIRM & BUY
          </PixelButton>
        </div>
      </div>
    </PixelModal>
  );
};
