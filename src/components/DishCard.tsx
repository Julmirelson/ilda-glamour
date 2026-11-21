import React, { useState } from 'react';
import { Product, DoseOption } from '../types';
import { formatKz } from '../data/products';

interface DishCardProps {
  product: Product;
  isHighlighted?: boolean;
  onAddToCart?: (product: Product, options?: { dose?: DoseOption }) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ product, isHighlighted = false, onAddToCart }) => {
  const [selectedDose, setSelectedDose] = useState<DoseOption | undefined>(
    product.dosesOptions ? product.dosesOptions[0] : undefined
  );
  const [added, setAdded] = useState(false);

  const isAvailable = product.isAvailable !== false;
  const displayPrice = selectedDose ? selectedDose.price : product.price;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable || !onAddToCart) return;
    onAddToCart(product, { dose: selectedDose });
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div
      onClick={handleAdd}
      className={`group cursor-pointer flex flex-col overflow-hidden bg-black transition-all duration-150 relative ${
        isHighlighted
          ? 'border-2 border-accent'
          : 'border border-dark-outline-variant/30 hover:border-accent'
      }`}
    >
      {/* ── PRODUCT IMAGE ── */}
      <div className="relative aspect-square w-full overflow-hidden bg-dark-surface-container-low">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Esgotado tag */}
        {!isAvailable && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-950/85 text-red-300 font-label text-[9px] uppercase tracking-wider font-bold border border-red-500/40">
            Esgotado
          </span>
        )}

        {/* Quick Add Floating Indicator */}
        <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
          added
            ? 'bg-green-600 text-white scale-110'
            : 'bg-black/60 text-accent opacity-0 group-hover:opacity-100 hover:scale-110'
        }`}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {added ? 'check' : 'add'}
          </span>
        </div>
      </div>

      {/* ── BOTTOM INFO BAR (EXATAMENTE COMO NO MOCKUP SCREEN 2) ── */}
      <div className="bg-black px-2.5 py-2 flex items-center justify-between gap-1.5 border-t border-dark-outline-variant/20">
        <span className="font-headline text-[10px] sm:text-xs font-bold uppercase text-dark-on-surface truncate flex-1">
          {product.name}
        </span>
        <span className="font-display text-[11px] sm:text-xs font-bold tabular-nums text-accent shrink-0">
          {formatKz(displayPrice)}
        </span>
      </div>

      {/* ── SELECTOR MODERNO DE DOSES (KITUTES DA BANDA) ── */}
      {product.dosesOptions && (
        <div className="bg-neutral-950 px-2 py-1.5 border-t border-dark-outline-variant/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-label uppercase tracking-wider text-dark-on-surface-variant flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-accent" style={{ fontSize: '11px' }}>soup_kitchen</span>
              Dose:
            </span>
            <span className="text-[9px] font-bold text-accent font-label uppercase">
              {selectedDose?.label.replace('Dose ', '')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {product.dosesOptions.map((dose) => {
              const isSelected = selectedDose?.label === dose.label;
              const shortLabel = dose.label.replace('Dose ', '');
              return (
                <button
                  key={dose.label}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDose(dose);
                  }}
                  className={`py-1 px-1.5 rounded-lg text-left transition-all duration-150 flex flex-col justify-center border ${
                    isSelected
                      ? 'bg-accent/15 border-accent text-accent shadow-sm'
                      : 'bg-dark-surface-container/60 border-dark-outline-variant/30 text-dark-on-surface-variant hover:text-white hover:border-dark-outline-variant'
                  }`}
                >
                  <span className={`text-[9px] font-label font-bold uppercase truncate leading-tight ${isSelected ? 'text-accent' : 'text-dark-on-surface'}`}>
                    {shortLabel}
                  </span>
                  <span className="text-[8.5px] font-display font-medium tabular-nums opacity-90 leading-tight">
                    {formatKz(dose.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
