import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, DeliveryMode, Product, ViewType, Category, DeliveryZone, DoseOption } from '../types';
import { DELIVERY_ZONES } from '../data/products';

interface CartContextType {
  cart: CartItem[];
  deliveryMode: DeliveryMode;
  selectedZone: DeliveryZone;
  selectedZoneId: string;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  activeView: ViewType;
  selectedCategory: Category;
  searchQuery: string;
  toastMessage: string | null;
  addToCart: (product: Product, options?: { qty?: number; dose?: DoseOption }) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setDeliveryMode: (mode: DeliveryMode) => void;
  setSelectedZoneId: (zoneId: string) => void;
  setActiveView: (view: ViewType) => void;
  setSelectedCategory: (cat: Category) => void;
  setSearchQuery: (query: string) => void;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart — load from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ilda_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Delivery mode
  const [deliveryMode, setDeliveryModeState] = useState<DeliveryMode>(() => {
    try {
      const saved = localStorage.getItem('ilda_delivery_mode') as DeliveryMode;
      return saved === 'pickup' ? 'pickup' : 'delivery';
    } catch { return 'delivery'; }
  });

  // Selected delivery zone
  const [selectedZoneId, setSelectedZoneIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ilda_delivery_zone');
      return saved && DELIVERY_ZONES.some(z => z.id === saved) ? saved : DELIVERY_ZONES[0].id;
    } catch { return DELIVERY_ZONES[0].id; }
  });

  const [activeView, setActiveView] = useState<ViewType>('featured');
  const [selectedCategory, setSelectedCategory] = useState<Category>('todos');
  const [searchQueryState, setSearchQueryState] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    if (query.trim() && activeView !== 'menu') {
      setActiveView('menu');
    }
  };

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('ilda_cart', JSON.stringify(cart));
      localStorage.setItem('ilda_bag_count', String(cart.reduce((a, i) => a + i.qty, 0)));
    } catch {}
  }, [cart]);

  const setDeliveryMode = (mode: DeliveryMode) => {
    setDeliveryModeState(mode);
    try { localStorage.setItem('ilda_delivery_mode', mode); } catch {}
  };

  const setSelectedZoneId = (zoneId: string) => {
    setSelectedZoneIdState(zoneId);
    try { localStorage.setItem('ilda_delivery_zone', zoneId); } catch {}
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(curr => curr === message ? null : curr);
    }, 2800);
  };

  const addToCart = (
    product: Product,
    options?: { qty?: number; dose?: DoseOption }
  ) => {
    const qty = options?.qty || 1;
    const dose = options?.dose;
    const basePrice = dose ? dose.price : product.price;
    const displayName = dose ? `${product.name} (${dose.label})` : product.name;
    const uniqueId = `${product.id}${dose ? `_${dose.label}` : ''}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === uniqueId);
      if (existing) {
        return prev.map(item =>
          item.id === uniqueId ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: uniqueId,
          productId: product.id,
          name: displayName,
          price: basePrice,
          qty,
          image: product.image,
          doseLabel: dose?.label,
        },
      ];
    });

    showToast(`${displayName} adicionado ao pedido!`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('ilda_cart');
      localStorage.removeItem('ilda_bag_count');
    } catch {}
    showToast('Pedido limpo');
  };

  const selectedZone = DELIVERY_ZONES.find(z => z.id === selectedZoneId) || DELIVERY_ZONES[0];
  const totalItems   = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal     = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const deliveryFee  = deliveryMode === 'delivery' && subtotal > 0 ? selectedZone.fee : 0;
  const total        = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        deliveryMode,
        selectedZone,
        selectedZoneId,
        totalItems,
        subtotal,
        deliveryFee,
        total,
        activeView,
        selectedCategory,
        searchQuery: searchQueryState,
        toastMessage,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        setDeliveryMode,
        setSelectedZoneId,
        setActiveView,
        setSelectedCategory,
        setSearchQuery,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
