import React from 'react';
import { RESTAURANT_INFO, isRestaurantOpen } from '../data/products';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const operationalStatus = isRestaurantOpen();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-md my-auto rounded-2xl bg-dark-surface-container border border-dark-outline-variant p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Chef Icon */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-dark-outline-variant/60">
          <div className="flex items-center gap-3">
            <img
              src="/chef-icon.png"
              alt="Ilda Glamour Chef"
              className="w-12 h-12 rounded-full object-cover border-2 border-accent shadow-md"
            />
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-dark-on-surface">
                {RESTAURANT_INFO.name}
              </h2>
              <p className="font-label text-xs sm:text-label-sm text-accent uppercase tracking-widest">
                Hamburgueria & Kitutes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="w-8 h-8 rounded-full inline-flex items-center justify-center text-dark-on-surface-variant hover:text-dark-on-surface hover:bg-dark-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Operational Status Pill */}
        <div className={`p-3 rounded-xl border flex items-center gap-3 ${operationalStatus.isOpen ? 'bg-green-950/40 border-green-500/40 text-green-300' : 'bg-amber-950/40 border-amber-500/40 text-amber-200'}`}>
          <span className={`w-3 h-3 rounded-full shrink-0 ${operationalStatus.isOpen ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
          <p className="font-body text-xs sm:text-sm leading-relaxed">
            {operationalStatus.message}
          </p>
        </div>

        {/* Content list */}
        <div className="flex flex-col gap-3.5 font-body text-body-md text-dark-on-surface-variant divide-y divide-dark-outline-variant/40">
          
          {/* Horário */}
          <div className="flex items-start gap-3 pt-2">
            <span className="material-symbols-outlined text-accent shrink-0 mt-0.5" style={{ fontSize: '20px' }}>schedule</span>
            <div>
              <p className="font-label text-label-sm uppercase text-dark-on-surface font-semibold">Horário de Funcionamento</p>
              <p className="text-body-sm text-dark-on-surface">{RESTAURANT_INFO.hours} · Todos os dias</p>
            </div>
          </div>

          {/* Contactos */}
          <div className="flex items-start gap-3 pt-3">
            <span className="material-symbols-outlined text-accent shrink-0 mt-0.5" style={{ fontSize: '20px' }}>call</span>
            <div className="flex flex-col gap-1">
              <p className="font-label text-label-sm uppercase text-dark-on-surface font-semibold">Linhas de Atendimento & WhatsApp</p>
              <div className="flex flex-wrap gap-2 text-body-sm">
                <a href={`tel:${RESTAURANT_INFO.primaryPhone.replace(/\s+/g, '')}`} className="px-2.5 py-1 rounded-md bg-dark-surface-container-high text-accent hover:underline font-medium inline-flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>phone</span>
                  {RESTAURANT_INFO.primaryPhone}
                </a>
                <a href={`tel:${RESTAURANT_INFO.secondaryPhone.replace(/\s+/g, '')}`} className="px-2.5 py-1 rounded-md bg-dark-surface-container-high text-accent hover:underline font-medium inline-flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>phone</span>
                  {RESTAURANT_INFO.secondaryPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="flex items-start gap-3 pt-3">
            <span className="material-symbols-outlined text-accent shrink-0 mt-0.5" style={{ fontSize: '20px' }}>location_on</span>
            <div>
              <p className="font-label text-label-sm uppercase text-dark-on-surface font-semibold">Localização</p>
              <p className="text-body-sm text-dark-on-surface">{RESTAURANT_INFO.address}</p>
              <p className="text-xs text-dark-outline">{RESTAURANT_INFO.city}</p>
            </div>
          </div>

          {/* Serviço de Entrega (Sem listagem individual de taxas por área) */}
          <div className="flex items-start gap-3 pt-3">
            <span className="material-symbols-outlined text-accent shrink-0 mt-0.5" style={{ fontSize: '20px' }}>local_shipping</span>
            <div>
              <p className="font-label text-label-sm uppercase text-dark-on-surface font-semibold">Entrega e Levantamento</p>
              <p className="text-body-sm text-dark-on-surface">
                Entregas rápidas ao domicílio em Luanda ou levantamento direto no restaurante (Grátis).
              </p>
            </div>
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-1 rounded-full bg-dark-primary text-dark-on-primary py-2.5 font-label text-label-md uppercase tracking-wider font-semibold hover:bg-dark-primary-container transition-colors shadow-md"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
