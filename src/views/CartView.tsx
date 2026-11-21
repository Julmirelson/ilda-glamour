import React from 'react';
import { useCart } from '../context/CartContext';
import { formatKz, DELIVERY_ZONES, PRODUCTS } from '../data/products';

export const CartView: React.FC = () => {
  const {
    cart,
    deliveryMode,
    setDeliveryMode,
    selectedZone,
    selectedZoneId,
    setSelectedZoneId,
    subtotal,
    deliveryFee,
    total,
    updateQty,
    removeFromCart,
    clearCart,
    addToCart,
    setActiveView,
  } = useCart();

  const isEmpty = cart.length === 0;

  // Drinks upsell (only show if no drinks in cart already)
  const hasNoDrinks = !cart.some(item => {
    const p = PRODUCTS.find(p => p.id === item.productId);
    return p?.category === 'bebidas';
  });
  const drinkSuggestions = hasNoDrinks
    ? PRODUCTS.filter(p => p.category === 'bebidas').slice(0, 4)
    : [];

  if (isEmpty) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-20 animate-fade-in">
        <div className="animate-float w-24 h-24 rounded-full bg-dark-surface-container flex items-center justify-center border border-dark-outline-variant/60 shadow-inner">
          <span className="material-symbols-outlined text-dark-outline" style={{ fontSize: '48px' }}>shopping_bag</span>
        </div>
        <div className="flex flex-col gap-1 max-w-xs">
          <h2 className="font-display text-2xl font-bold uppercase text-dark-on-surface">Pedido vazio</h2>
          <p className="font-body text-sm text-dark-on-surface-variant">
            Adicione hambúrgueres, kitutes ou bebidas ao seu carrinho.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveView('menu')}
          className="rounded-full bg-accent text-dark-on-primary px-8 py-3 font-label text-sm uppercase tracking-wider font-bold hover:bg-dark-primary-container transition-all shadow-md shadow-accent/20 active:scale-95"
        >
          Explorar Cardápio
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col gap-5 sm:gap-6 py-2 sm:py-5 animate-fade-in">

      {/* Title row */}
      <div className="flex items-center justify-between border-b border-dark-outline-variant/40 pb-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-dark-on-surface">
            O Seu Pedido
          </h1>
          <p className="font-body text-xs text-dark-on-surface-variant mt-0.5">
            {cart.length} {cart.length === 1 ? 'item' : 'itens'} · {formatKz(subtotal)}
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1 text-xs text-dark-outline hover:text-red-400 font-label py-1 px-2.5 rounded-full hover:bg-red-500/8 transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete_outline</span>
          <span>Limpar</span>
        </button>
      </div>

      {/* 2-col on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: Delivery + Items ───────────────────── */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* Delivery mode toggle */}
          <section className="p-4 rounded-2xl bg-dark-surface-container border border-dark-outline-variant/60">
            <p className="font-label text-[11px] uppercase tracking-wider text-dark-on-surface-variant font-semibold mb-2.5">
              Como deseja receber?
            </p>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-dark-surface-container-low border border-dark-outline-variant/40">
              <button
                type="button"
                onClick={() => setDeliveryMode('delivery')}
                className={`flex items-center justify-center gap-1.5 rounded-full py-2 px-2 font-label text-[11px] sm:text-xs uppercase tracking-wider transition-all ${
                  deliveryMode === 'delivery'
                    ? 'bg-accent text-dark-on-primary font-bold shadow-sm'
                    : 'text-dark-on-surface-variant hover:text-dark-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delivery_dining</span>
                <span>Entrega</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode('pickup')}
                className={`flex items-center justify-center gap-1.5 rounded-full py-2 px-2 font-label text-[11px] sm:text-xs uppercase tracking-wider transition-all ${
                  deliveryMode === 'pickup'
                    ? 'bg-accent text-dark-on-primary font-bold shadow-sm'
                    : 'text-dark-on-surface-variant hover:text-dark-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>storefront</span>
                <span>Levantar (Grátis)</span>
              </button>
            </div>

            {deliveryMode === 'delivery' && (
              <div className="mt-3 pt-3 border-t border-dark-outline-variant/30 animate-fade-in">
                <label htmlFor="zone-select" className="block font-label text-[11px] uppercase tracking-wider text-accent font-semibold mb-1.5 flex items-center justify-between">
                  <span>Zona de Entrega (Luanda)</span>
                  <span className="text-dark-on-surface-variant font-normal normal-case tracking-normal">
                    {selectedZone.estimatedTime}
                  </span>
                </label>
                <select
                  id="zone-select"
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full bg-dark-surface-container-high border border-dark-outline-variant rounded-xl px-3 py-2 text-xs sm:text-sm text-dark-on-surface focus:outline-none focus:border-accent cursor-pointer"
                >
                  {DELIVERY_ZONES.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} — {formatKz(zone.fee)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>

          {/* Cart items */}
          <div className="flex flex-col gap-2.5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="card-lift flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-dark-surface-container border border-dark-outline-variant/50 hover:border-accent/35"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-dark-surface-container-low shrink-0 border border-dark-outline-variant/30"
                />

                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-headline text-xs sm:text-sm uppercase text-dark-on-surface font-semibold truncate">
                        {item.name}
                      </h3>
                      <p className="font-body text-[11px] text-dark-on-surface-variant">
                        {formatKz(item.price)} cada
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remover ${item.name}`}
                      className="text-dark-outline hover:text-red-400 hover:bg-red-500/8 transition-colors p-1 rounded-full shrink-0"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Qty stepper */}
                    <div className="flex items-center gap-1.5 bg-dark-surface-container-high rounded-full px-2 py-0.5 border border-dark-outline-variant/40">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Diminuir"
                        className="w-5 h-5 flex items-center justify-center text-dark-on-surface-variant hover:text-accent transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>remove</span>
                      </button>
                      <span className="font-label text-sm font-bold tabular-nums min-w-[18px] text-center">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Aumentar"
                        className="w-5 h-5 flex items-center justify-center text-dark-on-surface-variant hover:text-accent transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
                      </button>
                    </div>

                    <span className="font-display text-sm sm:text-base tabular-nums text-accent font-bold">
                      {formatKz(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Drinks upsell — only if no drinks in cart */}
          {drinkSuggestions.length > 0 && (
            <section className="p-3.5 rounded-2xl bg-dark-surface-container-low border border-dark-outline-variant/40 flex flex-col gap-2.5 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent" style={{ fontSize: '17px' }}>local_bar</span>
                <h4 className="font-label text-[11px] sm:text-xs uppercase tracking-wider text-dark-on-surface font-semibold">
                  Adicione uma bebida gelada?
                </h4>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {drinkSuggestions.map((drink) => (
                  <button
                    key={drink.id}
                    type="button"
                    onClick={() => addToCart(drink)}
                    className="flex flex-col items-center text-center p-1.5 rounded-xl bg-dark-surface-container border border-dark-outline-variant/40 hover:border-accent/50 hover:bg-dark-surface-container-high transition-all group active:scale-95"
                  >
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover mb-1 group-hover:scale-105 transition-transform"
                    />
                    <span className="font-body text-[9px] sm:text-[10px] text-dark-on-surface truncate w-full leading-tight">{drink.name}</span>
                    <span className="font-label text-[9px] sm:text-[10px] text-accent font-bold">{formatKz(drink.price)}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── RIGHT: Order Summary ─────────────────────── */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 flex flex-col gap-3">
          <section className="rounded-2xl bg-dark-surface-container border border-dark-outline-variant p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
            <h2 className="font-headline text-base sm:text-lg uppercase tracking-wide text-accent font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>receipt_long</span>
              Resumo da Conta
            </h2>

            {/* Line items mini */}
            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto no-scrollbar text-xs divide-y divide-dark-outline-variant/20">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-1.5 first:pt-0 last:pb-0">
                  <span className="text-dark-on-surface-variant truncate pr-2 flex items-center gap-1.5">
                    <span className="font-bold text-dark-on-surface tabular-nums">{item.qty}×</span>
                    {item.name}
                  </span>
                  <span className="text-accent font-semibold tabular-nums shrink-0">{formatKz(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-2 py-3 border-y border-dark-outline-variant/40 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-on-surface-variant">Subtotal</span>
                <span className="font-semibold text-dark-on-surface tabular-nums">{formatKz(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-on-surface-variant">Entrega</span>
                <span className={`font-semibold tabular-nums ${deliveryMode === 'pickup' ? 'text-green-400' : 'text-dark-on-surface'}`}>
                  {deliveryMode === 'pickup' ? 'Grátis' : formatKz(deliveryFee)}
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="font-headline text-lg uppercase text-dark-on-surface font-bold">Total</span>
              <span className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-accent">
                {formatKz(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveView('checkout')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent text-dark-on-primary py-3.5 font-label text-sm uppercase tracking-wider font-bold transition-all hover:bg-dark-primary-container active:scale-95 shadow-xl shadow-accent/25 mt-1 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">Finalizar Encomenda</span>
              <span className="relative material-symbols-outlined" style={{ fontSize: '19px' }}>arrow_forward</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-dark-on-surface-variant font-body text-[11px] text-center">
              <span className="material-symbols-outlined text-green-400" style={{ fontSize: '14px' }}>verified_user</span>
              <span>Confirmação via WhatsApp da Ilda Glamour</span>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
};
