import React from 'react';
import { useCart } from '../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-dark-surface-container-high border border-accent px-5 py-2.5 font-label text-label-sm text-dark-on-surface shadow-2xl flex items-center gap-2 animate-bounce-in transition-all duration-surface-enter"
    >
      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
      <span>{toastMessage}</span>
    </div>
  );
};
