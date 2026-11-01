import React, { useState } from 'react';
import { PixelModal } from '../common/PixelModal';
import { PixelInput } from '../common/PixelInput';
import { PixelSelect } from '../common/PixelSelect';
import { PixelButton } from '../common/PixelButton';
import { StoreCategory, StoreProduct } from '../../types/gameplay';
import { parseInputToPaise } from '../../utils/currency';
import { PlusCircle } from 'lucide-react';

const CATEGORIES: StoreCategory[] = [
  'Food & Drinks',
  'Entertainment',
  'College Essentials',
  'Transport',
  'Impulse Buys',
  'Free Alternatives',
];

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<StoreProduct, 'id'>) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<StoreCategory>('Food & Drinks');
  const [priceInput, setPriceInput] = useState('');
  const [emoji, setEmoji] = useState('🛍️');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an item name.');
      return;
    }

    const pricePaise = parseInputToPaise(priceInput || '0');
    if (pricePaise < 0) {
      setError('Price cannot be negative.');
      return;
    }

    onAddProduct({
      name: name.trim(),
      description: description.trim() || 'Custom student item added to the local inventory.',
      category,
      pricePaise,
      emoji: emoji.trim() || '🛍️',
    });

    setName('');
    setDescription('');
    setPriceInput('');
    setError('');
    onClose();
  };

  return (
    <PixelModal
      isOpen={isOpen}
      onClose={onClose}
      title="ADD CUSTOM STORE ITEM"
      icon={<PlusCircle className="text-neon-lime" size={18} />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="w-16">
            <PixelInput
              label="Icon"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              maxLength={2}
              className="text-center text-lg"
            />
          </div>
          <div className="flex-1">
            <PixelInput
              label="Item Name"
              placeholder="e.g. Samosa Pav, Badminton Shuttle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <PixelInput
          label="Description"
          placeholder="Brief witty description of this item"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <PixelSelect
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as StoreCategory)}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />

        <PixelInput
          label="Price in INR (₹0 for Free)"
          type="number"
          prefix="₹"
          placeholder="50"
          min="0"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
        />

        {error && (
          <p className="font-mono text-xs text-danger-red">⚠️ {error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-retro-border">
          <PixelButton variant="outline" size="sm" type="button" onClick={onClose}>
            CANCEL
          </PixelButton>
          <PixelButton variant="lime" size="sm" type="submit">
            ADD ITEM TO SHOP
          </PixelButton>
        </div>
      </form>
    </PixelModal>
  );
};

