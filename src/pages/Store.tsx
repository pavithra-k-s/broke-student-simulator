import React, { useState, useMemo } from 'react';
import { GamePlayState, StoreCategory, StoreProduct } from '../types/gameplay';
import { INITIAL_STORE_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/store/ProductCard';
import { PurchaseConfirmModal } from '../components/store/PurchaseConfirmModal';
import { AddProductModal } from '../components/store/AddProductModal';
import { PixelButton } from '../components/common/PixelButton';
import { PixelBadge } from '../components/common/PixelBadge';
import { formatINR, paiseToRupees, parseInputToPaise } from '../utils/currency';
import { PixelModal } from '../components/common/PixelModal';
import { PixelInput } from '../components/common/PixelInput';
import {
  ArrowLeft,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const CATEGORY_TABS: Array<'ALL' | StoreCategory> = [
  'ALL',
  'Food & Drinks',
  'Entertainment',
  'College Essentials',
  'Transport',
  'Impulse Buys',
  'Free Alternatives',
];

interface StoreProps {
  gamePlay: GamePlayState;
  onBuyProduct: (product: StoreProduct) => { success: boolean; message: string };
  onAddCustomProduct: (product: Omit<StoreProduct, 'id'>) => void;
  onUpdateProductPrice: (productId: string, newPricePaise: number) => void;
  onBackToPlayMode: () => void;
}

export const Store: React.FC<StoreProps> = ({
  gamePlay,
  onBuyProduct,
  onAddCustomProduct,
  onUpdateProductPrice,
  onBackToPlayMode,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | StoreCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmProduct, setConfirmProduct] = useState<StoreProduct | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [newPriceInput, setNewPriceInput] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Combine initial products and custom products with any price overrides
  const allProducts = useMemo(() => {
    return [...INITIAL_STORE_PRODUCTS, ...gamePlay.customProducts];
  }, [gamePlay.customProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory = activeCategory === 'ALL' || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, activeCategory, searchQuery]);

  const triggerToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleBuyAttempt = (product: StoreProduct) => {
    // If expensive item (> ₹200 = 20,000 paise), show confirmation dialogue
    if (product.pricePaise > 20000 && gamePlay.gameBalancePaise >= product.pricePaise) {
      setConfirmProduct(product);
      return;
    }

    const res = onBuyProduct(product);
    triggerToast(res.message, !res.success);
  };

  const handleConfirmExpensiveBuy = (product: StoreProduct) => {
    const res = onBuyProduct(product);
    triggerToast(res.message, !res.success);
  };

  const handleSavePriceEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const newPaise = parseInputToPaise(newPriceInput);
    onUpdateProductPrice(editingProduct.id, newPaise);
    setEditingProduct(null);
    triggerToast(`Updated price for ${editingProduct.name} to ${formatINR(newPaise)}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed top-16 right-4 z-50 max-w-sm p-3 border-2 shadow-pixel font-mono text-xs animate-in slide-in-from-top-2 duration-200 flex items-start gap-2 ${
            toastMessage.isError
              ? 'bg-danger-red/90 border-black text-white'
              : 'bg-neon-lime/90 border-black text-retro-dark font-bold'
          }`}
        >
          {toastMessage.isError ? <AlertTriangle size={16} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={16} className="shrink-0 mt-0.5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Store Header: Title, Balance HUD, and Back Button */}
      <div className="bg-retro-panel border-4 border-retro-border p-4 sm:p-5 shadow-pixel-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPlayMode}
            className="p-2 bg-retro-dark border border-retro-border text-cream-muted hover:text-neon-lime transition-colors"
            title="Return to Play Mode"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏪</span>
              <h2 className="font-pixel text-xs sm:text-sm text-cream uppercase">
                THE TEMPTATION STORE
              </h2>
              <PixelBadge variant="amber" size="sm">
                DAY {gamePlay.simulatedDay}
              </PixelBadge>
            </div>
            <p className="font-mono text-xs text-cream-muted">
              Campus Vending Machine & Impulse Purchase Bazaar
            </p>
          </div>
        </div>

        {/* Live Game Wallet Balance Display */}
        <div className="flex items-center gap-3">
          <div className="bg-retro-dark border-2 border-retro-border px-3 py-1.5 shadow-pixel-sm text-right">
            <span className="font-pixel text-[9px] text-cream-muted uppercase block">
              GAME WALLET
            </span>
            <span
              className={`font-pixel text-xs sm:text-base ${
                gamePlay.gameBalancePaise < 0 ? 'text-danger-red glow-red' : 'text-neon-lime glow-lime'
              }`}
            >
              {formatINR(gamePlay.gameBalancePaise)}
            </span>
          </div>

          <PixelButton
            variant="lime"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus size={14} />}
            className="text-[10px]"
          >
            ADD ITEM
          </PixelButton>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 font-pixel text-[9px] uppercase border-2 whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-neon-lime text-retro-dark border-neon-lime shadow-pixel-sm font-bold scale-[1.02]'
                    : 'bg-retro-panel text-cream-muted hover:text-cream border-retro-border hover:bg-retro-panel-light'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search items (e.g. coffee, maggi, pen, movie)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-retro-panel border-2 border-retro-border pl-9 pr-3 py-2 text-xs font-mono text-cream placeholder-cream-muted/50 focus:outline-none focus:border-neon-lime shadow-inner"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currentBalancePaise={gamePlay.gameBalancePaise}
            onBuy={handleBuyAttempt}
            onEditPrice={
              product.isCustom
                ? (p) => {
                    setEditingProduct(p);
                    setNewPriceInput(paiseToRupees(p.pricePaise).toString());
                  }
                : undefined
            }
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-8 bg-retro-panel border-2 border-dashed border-retro-border text-center font-mono text-xs text-cream-muted">
          No items found matching your filter or search query. Click "ADD ITEM" to create your own!
        </div>
      )}

      {/* Confirmation Modal for Expensive Purchases */}
      <PurchaseConfirmModal
        isOpen={Boolean(confirmProduct)}
        product={confirmProduct}
        currentBalancePaise={gamePlay.gameBalancePaise}
        onClose={() => setConfirmProduct(null)}
        onConfirm={handleConfirmExpensiveBuy}
      />

      {/* Add Custom Item Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={(p) => {
          onAddCustomProduct(p);
          triggerToast(`Added custom product "${p.name}" to inventory!`);
        }}
      />

      {/* Edit Custom Product Price Modal */}
      <PixelModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        title="EDIT PRODUCT PRICE"
      >
        <form onSubmit={handleSavePriceEdit} className="space-y-4 font-mono text-xs">
          <p className="text-cream">
            Edit price for <strong>{editingProduct?.name}</strong>:
          </p>
          <PixelInput
            label="New Price in INR"
            type="number"
            prefix="₹"
            min="0"
            value={newPriceInput}
            onChange={(e) => setNewPriceInput(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <PixelButton
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setEditingProduct(null)}
            >
              CANCEL
            </PixelButton>
            <PixelButton variant="lime" size="sm" type="submit">
              SAVE PRICE
            </PixelButton>
          </div>
        </form>
      </PixelModal>
    </div>
  );
};
