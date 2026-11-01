import React from 'react';
import { StoreProduct } from '../../types/gameplay';
import { formatINR } from '../../utils/currency';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { Edit2, AlertTriangle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: StoreProduct;
  currentBalancePaise: number;
  onBuy: (product: StoreProduct) => void;
  onEditPrice?: (product: StoreProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentBalancePaise,
  onBuy,
  onEditPrice,
}) => {
  const isFree = product.pricePaise === 0;
  const canAfford = currentBalancePaise >= product.pricePaise;

  const categoryVariant = {
    'Food & Drinks': 'amber',
    'Entertainment': 'lavender',
    'College Essentials': 'neutral',
    'Transport': 'neutral',
    'Impulse Buys': 'danger',
    'Free Alternatives': 'lime',
  }[product.category] as any;

  return (
    <div className="bg-retro-panel border-2 border-retro-border p-4 shadow-pixel flex flex-col justify-between hover:border-cream-muted transition-colors relative group">
      {/* Top Header: Category & Edit Button */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <PixelBadge variant={categoryVariant} size="sm">
            {product.category}
          </PixelBadge>
          {onEditPrice && (
            <button
              onClick={() => onEditPrice(product)}
              className="opacity-60 hover:opacity-100 p-1 text-cream-muted hover:text-neon-lime transition-opacity"
              title="Edit product price"
            >
              <Edit2 size={12} />
            </button>
          )}
        </div>

        {/* Product Emoji & Name */}
        <div className="flex items-start gap-3 my-2">
          <div className="text-3xl p-2 bg-retro-dark border border-retro-border shrink-0 select-none">
            {product.emoji}
          </div>
          <div>
            <h4 className="font-pixel text-[11px] sm:text-xs text-cream leading-snug">
              {product.name}
            </h4>
            <p className="font-mono text-[11px] text-cream-muted mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="mt-4 pt-3 border-t border-retro-border/60 flex items-center justify-between gap-2">
        <div>
          <span className="font-pixel text-xs sm:text-sm text-neon-lime block">
            {isFree ? (
              <span className="text-neon-lime flex items-center gap-1">
                <Sparkles size={12} /> FREE
              </span>
            ) : (
              formatINR(product.pricePaise)
            )}
          </span>
          {!isFree && !canAfford && (
            <span className="font-mono text-[9px] text-danger-red flex items-center gap-0.5">
              <AlertTriangle size={10} /> Too Broke
            </span>
          )}
        </div>

        <PixelButton
          variant={isFree ? 'lime' : canAfford ? 'panel' : 'outline'}
          size="sm"
          onClick={() => onBuy(product)}
          className="text-[10px]"
          title={!canAfford && !isFree ? 'Insufficient balance' : `Buy ${product.name}`}
        >
          {isFree ? 'ENJOY' : 'BUY'}
        </PixelButton>
      </div>
    </div>
  );
};
