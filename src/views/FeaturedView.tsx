import React, { useState, useEffect } from 'react';
import { FEATURED_PRODUCTS, formatKz, RESTAURANT_INFO } from '../data/products';
import { useCart } from '../context/CartContext';

export const FeaturedView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addToCart } = useCart();

  const currentDish = FEATURED_PRODUCTS[currentIndex] || FEATURED_PRODUCTS[0];

  // Auto-advance carousel every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((currentIndex + 1) % FEATURED_PRODUCTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 220);
  };

  const handlePrev = () => goTo(currentIndex === 0 ? FEATURED_PRODUCTS.length - 1 : currentIndex - 1);
  const handleNext = () => goTo(currentIndex === FEATURED_PRODUCTS.length - 1 ? 0 : currentIndex + 1);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) handleNext();
    else if (diff < -45) handlePrev();
    setTouchStartX(null);
  };

  return (
    <main className="flex-1 flex flex-col justify-between py-1 sm:py-4 animate-fade-in w-full max-w-lg lg:max-w-7xl mx-auto">
      
      {/* ── HERO COHESIVE GROUP: PREÇO + IMAGEM + NOME APROXIMADOS ── */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto w-full">

        {/* 1. Preço Dourado no Topo do Hero */}
        <div className="flex flex-col items-center text-center pb-0.5">
          <span className="font-display text-4xl xs:text-5xl sm:text-6xl font-bold tabular-nums text-accent tracking-wide leading-none select-none">
            {formatKz(currentDish.price)}
          </span>
        </div>

        {/* 2. Tipografia Gigante em Português + PNG Transparente + Setas */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative flex flex-col items-center justify-center select-none w-full my-0"
        >
          {/* Giant White Background Typography */}
          <h1 className="font-display font-black text-5xl xs:text-6xl sm:text-7xl md:text-8xl text-white tracking-tight uppercase leading-none select-none text-center -mb-8 sm:-mb-14 z-0 pointer-events-none opacity-90">
            {currentDish.wordmark || 'HAMBÚRGUER'}
          </h1>

          {/* Dish Image container (Sem fundo opaco para não cobrir o texto) */}
          <div className="relative w-full max-w-[250px] xs:max-w-[280px] sm:max-w-[380px] aspect-square flex items-center justify-center z-10">
            
            {/* Seta Esquerda */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Anterior"
              className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent text-dark-on-primary hover:bg-dark-primary-container hover:scale-110 active:scale-95 transition-all shadow-lg flex items-center justify-center"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>chevron_left</span>
            </button>

            {/* Imagem transparente recortada com efeito float */}
            <div className="w-full h-full flex items-center justify-center p-2">
              <img
                key={currentDish.id}
                src={currentDish.image}
                alt={currentDish.name}
                className={`w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-opacity duration-200 animate-float ${
                  isAnimating ? 'opacity-30' : 'opacity-100'
                }`}
              />
            </div>

            {/* Seta Direita */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próximo"
              className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent text-dark-on-primary hover:bg-dark-primary-container hover:scale-110 active:scale-95 transition-all shadow-lg flex items-center justify-center"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>chevron_right</span>
            </button>
          </div>
        </div>

        {/* 3. Detalhes do Produto (Aproximados da imagem e do preço) */}
        <div className="w-full flex flex-col items-end text-right px-3 xs:px-4 -mt-2 sm:mt-0">
          <h2 className="font-headline font-bold text-sm xs:text-base sm:text-lg text-accent uppercase tracking-wider">
            {currentDish.name}
          </h2>
          <span className="w-12 h-0.5 bg-accent rounded-full mt-1 mb-1.5" />
          <p className="font-body text-xs sm:text-sm text-dark-on-surface-variant max-w-[270px] leading-relaxed">
            {currentDish.description}
          </p>
        </div>

        {/* 4. Botão Pedir Agora */}
        <div className="w-full flex justify-center mt-3 sm:mt-4 mb-2 px-4">
          <button
            type="button"
            onClick={() => addToCart(currentDish)}
            className="w-full max-w-xs py-3 sm:py-3.5 px-8 rounded-full bg-accent hover:bg-dark-primary-container text-dark-on-primary font-label text-xs sm:text-sm uppercase tracking-wider font-bold shadow-lg shadow-accent/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_shopping_cart</span>
            <span>PEDIR AGORA</span>
          </button>
        </div>

      </div>

      {/* ── BOTTOM ROW: REDES SOCIAIS (ESQUERDA) + LOCALIZAÇÃO (DIREITA) ── */}
      <div className="w-full flex items-center justify-between px-4 py-2 border-t border-dark-outline-variant/15 text-xs text-dark-on-surface-variant mt-auto">
        
        {/* Esquerda: Redes Sociais */}
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp Ilda Glamour"
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
            aria-label="Instagram Ilda Glamour"
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
            aria-label="Facebook Ilda Glamour"
            className="hover:text-accent transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>
        </div>

        {/* Direita: Região e Moeda em Português */}
        <div className="font-label text-[11px] uppercase tracking-wider text-dark-on-surface-variant">
          <span className="text-accent font-semibold">LUANDA</span>
          <span className="mx-1 text-dark-outline">|</span>
          <span>AOA (Kz)</span>
        </div>

      </div>

    </main>
  );
};
