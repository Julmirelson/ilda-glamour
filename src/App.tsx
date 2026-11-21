import React, { useState, useEffect } from 'react';
import { useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { InfoModal } from './components/InfoModal';
import { FeaturedView } from './views/FeaturedView';
import { MenuView } from './views/MenuView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';

export const App: React.FC = () => {
  const { activeView, setActiveView, setSelectedCategory } = useCart();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Parse URL hash or query params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat === 'pratos' || window.location.hash === '#pratos') {
      setActiveView('menu');
      setSelectedCategory('pratos');
    }
  }, [setActiveView, setSelectedCategory]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-dark-surface text-dark-on-surface font-body antialiased flex flex-col justify-between selection:bg-accent selection:text-dark-on-primary">
      {/* Top Header with integrated search bar spanning across navbar */}
      <Header onOpenInfo={() => setIsInfoOpen(true)} />

      {/* Main Content Area - Fully responsive with max-w-7xl on desktop */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex-1 flex flex-col">
        {activeView === 'featured' && <FeaturedView />}
        {activeView === 'menu' && <MenuView />}
        {activeView === 'cart' && <CartView />}
        {activeView === 'checkout' && <CheckoutView />}
      </div>

      {/* Shared Footer Shell */}
      <Footer />

      {/* Global Notification Toast */}
      <Toast />

      {/* Info Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
};

export default App;
