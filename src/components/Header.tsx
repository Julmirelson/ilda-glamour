import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatKz } from '../data/products';

interface HeaderProps {
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInfo }) => {
  const {
    activeView,
    setActiveView,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalItems,
    subtotal,
  } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleTabClick = (view: 'featured' | 'menu') => {
    setActiveView(view);
    if (view === 'menu') {
      setSelectedCategory('todos');
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-surface/98 backdrop-blur-md border-b border-dark-outline-variant/30 py-2.5 px-3 sm:px-6 lg:px-8">
      
      {/* ── Search Overlay ─────────────────────────────────── */}
      {isSearchOpen && (
        <div className="absolute inset-x-2.5 top-1.5 bottom-1.5 z-50 flex items-center bg-dark-surface-container border border-accent rounded-full px-3.5 shadow-2xl animate-scale-in">
          <span className="material-symbols-outlined text-accent mr-2 shrink-0" style={{ fontSize: '18px' }}>search</span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'menu') setActiveView('menu');
            }}
            placeholder="Pesquisar pratos ou bebidas..."
            className="flex-1 bg-transparent text-dark-on-surface placeholder-dark-on-surface-variant/50 font-body text-xs sm:text-sm py-1 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-dark-on-surface-variant hover:text-white p-1 shrink-0"
              title="Limpar pesquisa"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleCloseSearch}
            className="ml-1 text-[11px] font-label uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded-full hover:bg-accent/15 shrink-0"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">

        {/* ── MOBILE NAVBAR LEFT: Apenas Destaques & Menu (Sem Lanches nem Bebidas) ── */}
        <div className="sm:hidden flex items-center gap-3 py-0.5">
          <button
            type="button"
            onClick={() => handleTabClick('featured')}
            className={`text-xs font-label uppercase tracking-wider transition-colors duration-75 ${
              activeView === 'featured'
                ? 'text-accent font-bold border-b-2 border-accent pb-0.5'
                : 'text-dark-on-surface-variant hover:text-white font-medium'
            }`}
          >
            Destaques
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('menu')}
            className={`text-xs font-label uppercase tracking-wider transition-colors duration-75 ${
              activeView === 'menu'
                ? 'text-accent font-bold border-b-2 border-accent pb-0.5'
                : 'text-dark-on-surface-variant hover:text-white font-medium'
            }`}
          >
            Menu
          </button>
        </div>

        {/* ── DESKTOP NAVBAR LEFT: Logo + ILDA GLAMOUR Brand ── */}
        <div className="hidden sm:flex items-center shrink-0">
          <button
            type="button"
            onClick={() => handleTabClick('featured')}
            className="flex items-center gap-2.5 group text-left"
          >
            <img
              src="/chef-icon.png"
              alt="Chef Ilda Glamour"
              className="w-10 h-10 rounded-full object-cover border-2 border-accent/60 shadow-md group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold uppercase tracking-wider text-dark-on-surface">
                ILDA
              </span>
              <span className="font-display text-sm font-light uppercase tracking-widest text-accent">
                GLAMOUR
              </span>
            </div>
          </button>
        </div>

        {/* ── DESKTOP NAVBAR CENTER: Destaques & Menu ── */}
        <nav aria-label="Navegação principal" className="hidden sm:flex items-center justify-center gap-2 flex-1 px-2">
          <button
            type="button"
            onClick={() => handleTabClick('featured')}
            className={`px-4 py-1.5 rounded-full font-label text-xs uppercase tracking-wider transition-colors duration-75 ${
              activeView === 'featured'
                ? 'bg-accent text-dark-on-primary font-bold shadow-sm'
                : 'text-dark-on-surface-variant hover:text-accent'
            }`}
          >
            Destaques
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('menu')}
            className={`px-4 py-1.5 rounded-full font-label text-xs uppercase tracking-wider transition-colors duration-75 ${
              activeView === 'menu'
                ? 'bg-accent text-dark-on-primary font-bold shadow-sm'
                : 'text-dark-on-surface-variant hover:text-accent'
            }`}
          >
            Menu
          </button>
        </nav>

        {/* ── NAVBAR RIGHT ICONS: [Pesquisa] [Localização] [Sacola] ── */}
        <div className="flex items-center gap-2.5 xs:gap-3 shrink-0">

          {/* 1. Ícone de Pesquisa */}
          <button
            type="button"
            onClick={toggleSearch}
            aria-label="Pesquisar"
            className="inline-flex items-center justify-center text-dark-on-surface hover:text-accent transition-colors p-1"
            title="Pesquisar no cardápio"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
          </button>

          {/* 2. Ícone de Localização do Espaço (substitui o perfil) */}
          <button
            type="button"
            onClick={onOpenInfo}
            aria-label="Localização e Horários do Espaço"
            className="inline-flex items-center justify-center text-dark-on-surface hover:text-accent transition-colors p-1"
            title="Localização do restaurante (Golf 2, Vila Estoril)"
          >
            <span className="material-symbols-outlined text-accent" style={{ fontSize: '21px' }}>location_on</span>
          </button>

          {/* 3. Ícone da Sacola com distintivo de quantidade */}
          <button
            type="button"
            onClick={() => setActiveView('cart')}
            aria-label="Ver sacola de pedidos"
            className="relative inline-flex items-center justify-center text-dark-on-surface hover:text-accent transition-colors p-1"
            title="Ver carrinho"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-accent text-dark-on-primary font-label text-[10px] font-bold tabular-nums flex items-center justify-center shadow-md leading-none">
                {totalItems}
              </span>
            )}
          </button>

          {/* Subtotal em ecrãs grandes */}
          {subtotal > 0 && (
            <span className="hidden lg:inline font-label text-xs font-semibold tabular-nums text-accent pl-1">
              {formatKz(subtotal)}
            </span>
          )}

        </div>

      </div>
    </header>
  );
};
