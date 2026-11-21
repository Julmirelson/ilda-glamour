import React, { useMemo } from 'react';
import { PRODUCTS, isRestaurantOpen, RESTAURANT_INFO } from '../data/products';
import { Category, Product, DoseOption } from '../types';
import { DishCard } from '../components/DishCard';
import { useCart } from '../context/CartContext';

export const MenuView: React.FC = () => {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, addToCart } = useCart();
  const operationalStatus = isRestaurantOpen();

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'todos',        label: 'Todos',            icon: 'restaurant_menu' },
    { id: 'hamburgueres', label: 'Hambúrgueres',     icon: 'lunch_dining' },
    { id: 'cachorros',    label: 'Cachorros',        icon: 'fastfood' },
    { id: 'pratos',       label: 'Pratos & Kitutes', icon: 'soup_kitchen' },
    { id: 'bebidas',      label: 'Bebidas',          icon: 'local_bar' },
  ];

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      todos: PRODUCTS.length,
      hamburgueres: 0,
      cachorros: 0,
      pratos: 0,
      bebidas: 0,
    };
    PRODUCTS.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, []);

  return (
    <main className="flex-1 flex flex-col justify-between py-2 sm:py-4 animate-fade-in w-full max-w-lg lg:max-w-7xl mx-auto">
      
      {/* ── TOP TITLE (COMO NO MOCKUP SCREEN 2: BURGER / HOUSE) ── */}
      <div className="flex flex-col items-center text-center pt-1 pb-1">
        <h1 className="font-display font-black text-3xl xs:text-4xl sm:text-5xl uppercase tracking-wider text-white leading-none">
          ILDA GLAMOUR
        </h1>
        <span className="font-display text-xs sm:text-sm font-light uppercase tracking-[0.3em] text-accent mt-0.5">
          CARDÁPIO DIGITAL
        </span>
      </div>

      {/* ── TABELA / BARRA DE FILTRO POR CATEGORIA (MOBILE & DESKTOP) ── */}
      <div className="w-full my-2.5 sm:my-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1 sm:justify-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id];
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full font-label text-xs uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-accent text-dark-on-primary font-bold shadow-md shadow-accent/20 scale-100'
                    : 'bg-dark-surface-container border border-dark-outline-variant/40 text-dark-on-surface-variant hover:text-white hover:border-accent/40'
                }`}
              >
                <span className="material-symbols-outlined shrink-0" style={{ fontSize: '15px' }}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                    isSelected
                      ? 'bg-black/25 text-dark-on-primary'
                      : 'bg-dark-surface-container-high text-dark-on-surface-variant'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Closed banner if closed */}
      {!operationalStatus.isOpen && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-center justify-center gap-2 text-center">
          <span className="material-symbols-outlined text-amber-400" style={{ fontSize: '16px' }}>schedule</span>
          <span>{operationalStatus.message}</span>
        </div>
      )}

      {/* Search status indicator */}
      {searchQuery && (
        <div className="flex items-center justify-between mb-3 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/25 text-xs text-accent">
          <span>A pesquisar: "<strong>{searchQuery}</strong>"</span>
          <button type="button" onClick={() => setSearchQuery('')} className="hover:text-white">
            <span className="material-symbols-outlined align-middle" style={{ fontSize: '15px' }}>close</span>
          </button>
        </div>
      )}

      {/* ── 2x2 PRODUCT GRID (EXATAMENTE COMO NO MOCKUP SCREEN 2) ── */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-dark-on-surface-variant flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-dark-outline" style={{ fontSize: '36px' }}>search_off</span>
          <p className="font-headline text-base text-dark-on-surface">Nenhum produto encontrado</p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedCategory('todos'); }}
            className="mt-1 text-xs text-accent underline uppercase font-label"
          >
            Ver todos os produtos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 my-1">
          {filteredProducts.map((product, index) => (
            <DishCard
              key={product.id}
              product={product}
              isHighlighted={index === 0 && !searchQuery && selectedCategory === 'todos'}
              onAddToCart={(p: Product, options?: { dose?: DoseOption }) => addToCart(p, options)}
            />
          ))}
        </div>
      )}

      {/* ── BOTTOM ROW: SOCIAL ICONS (LEFT) + REGION (RIGHT) (COMO NO MOCKUP) ── */}
      <div className="w-full flex items-center justify-between px-4 py-2 border-t border-dark-outline-variant/15 text-xs text-dark-on-surface-variant mt-4 sm:mt-6">
        
        {/* Left: Social Icons */}
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="hover:text-accent transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-accent transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-accent transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>
        </div>

        {/* Right: Region & Currency */}
        <div className="font-label text-[11px] uppercase tracking-wider text-dark-on-surface-variant">
          <span className="text-accent font-semibold">LUANDA</span>
          <span className="mx-1 text-dark-outline">|</span>
          <span>AOA (Kz)</span>
        </div>

      </div>

    </main>
  );
};
