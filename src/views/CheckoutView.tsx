import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatKz, RESTAURANT_INFO, DELIVERY_ZONES, isRestaurantOpen } from '../data/products';

export const CheckoutView: React.FC = () => {
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
    clearCart,
    setActiveView,
    showToast,
  } = useCart();

  // Pre-fill customer info from localStorage
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('ilda_customer_name') || ''; } catch { return ''; }
  });
  const [phone, setPhone] = useState(() => {
    try { return localStorage.getItem('ilda_customer_phone') || ''; } catch { return ''; }
  });
  const [address, setAddress] = useState(() => {
    try { return localStorage.getItem('ilda_customer_address') || ''; } catch { return ''; }
  });
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const operationalStatus = isRestaurantOpen();

  // Persist customer info
  const save = (key: string, val: string) => {
    try { localStorage.setItem(key, val); } catch {}
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3800);
  };

  // Build the WhatsApp message
  const buildMessage = (): string => {
    const lines: string[] = [];
    lines.push('🍔 *NOVO PEDIDO — ILDA GLAMOUR*');
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push(`👤 *Cliente:* ${name.trim()}`);
    lines.push(`📱 *Contacto:* ${phone.trim()}`);
    lines.push(
      `📍 *Modalidade:* ${
        deliveryMode === 'delivery'
          ? `Entrega — ${selectedZone.name}`
          : 'Levantamento no Restaurante (Golf 2, Vila Estoril)'
      }`
    );
    if (deliveryMode === 'delivery') {
      lines.push(`🏠 *Morada:* ${address.trim()}`);
    }
    lines.push('');
    lines.push('📋 *ITENS:*');
    cart.forEach((item) => {
      lines.push(`• ${item.qty}× ${item.name} — ${formatKz(item.qty * item.price)}`);
    });
    lines.push('');
    lines.push(`Subtotal: ${formatKz(subtotal)}`);
    if (deliveryMode === 'delivery') {
      lines.push(`Taxa de entrega: ${formatKz(deliveryFee)}`);
    }
    lines.push(`💰 *TOTAL: ${formatKz(total)}*`);
    if (notes.trim()) {
      lines.push('');
      lines.push(`📝 *Obs.:* ${notes.trim()}`);
    }
    if (!operationalStatus.isOpen) {
      lines.push('');
      lines.push('⏰ _Pedido agendado para abertura às 08h00_');
    }
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push('_Enviado via cardápio digital Ilda Glamour_');
    return lines.join('\n');
  };

  const validate = (): boolean => {
    if (cart.length === 0) { showError('O carrinho está vazio.'); return false; }
    if (!name.trim())  { showError('Por favor, informe o seu nome.'); return false; }
    if (!phone.trim()) { showError('Por favor, informe o seu contacto.'); return false; }
    if (deliveryMode === 'delivery' && !address.trim()) {
      showError('Por favor, informe o endereço de entrega.');
      return false;
    }
    return true;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const messageText = buildMessage();
    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent(messageText)}`;
    
    // Esvazia imediatamente o carrinho para que a sacola não continue cheia
    clearCart();
    
    window.open(url, '_blank');
    setIsSuccess(true);
    showToast('Pedido encaminhado para o WhatsApp!');
  };

  const handleCopy = () => {
    if (!validate()) return;
    navigator.clipboard.writeText(buildMessage()).then(() => {
      setCopiedSuccess(true);
      showToast('Texto do pedido copiado!');
      setTimeout(() => setCopiedSuccess(false), 3000);
    }).catch(() => showToast('Não foi possível copiar.'));
  };

  /* ── SUCCESS SCREEN ──────────────────────────────────── */
  if (isSuccess) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-12 px-4 max-w-sm mx-auto animate-scale-in">
        <div className="animate-float w-20 h-20 rounded-full bg-green-500/12 border-2 border-green-500 flex items-center justify-center text-green-400 shadow-xl shadow-green-500/10">
          <span className="material-symbols-outlined" style={{ fontSize: '42px' }}>check_circle</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-dark-on-surface">
            Pedido Enviado!
          </h1>
          <p className="font-body text-sm text-dark-on-surface-variant leading-relaxed">
            A sua mensagem foi encaminhada para a <strong className="text-accent">Ilda Glamour</strong>.
            Aguarde confirmação no WhatsApp em instantes.
          </p>
        </div>

        <div className="w-full p-4 rounded-2xl bg-dark-surface-container border border-dark-outline-variant text-left text-xs flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-dark-on-surface-variant">Contacto 1</span>
            <span className="text-accent font-semibold">{RESTAURANT_INFO.primaryPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-on-surface-variant">Contacto 2</span>
            <span className="text-accent font-semibold">{RESTAURANT_INFO.secondaryPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-on-surface-variant">Localização</span>
            <span className="text-dark-on-surface">{RESTAURANT_INFO.address}</span>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => { clearCart(); setActiveView('menu'); }}
            className="flex-1 rounded-full bg-accent text-dark-on-primary py-3 font-label text-sm uppercase tracking-wider font-bold hover:bg-dark-primary-container transition-all shadow-lg active:scale-95"
          >
            Novo Pedido
          </button>
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-full bg-green-600 hover:bg-green-500 text-white py-3 font-label text-sm uppercase tracking-wider font-bold transition-all shadow-lg inline-flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>chat</span>
            WhatsApp
          </a>
        </div>
      </main>
    );
  }

  /* ── CHECKOUT FORM ───────────────────────────────────── */
  return (
    <main className="flex-1 flex flex-col gap-5 py-2 sm:py-5 animate-fade-in max-w-4xl mx-auto w-full">

      {/* Title */}
      <div className="border-b border-dark-outline-variant/40 pb-3">
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-dark-on-surface">
          Finalizar Encomenda
        </h1>
        <p className="font-body text-xs text-dark-on-surface-variant mt-0.5">
          Preencha os seus dados — o pedido é enviado directamente pelo WhatsApp ({RESTAURANT_INFO.primaryPhone}).
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-sm flex items-center gap-2 animate-scale-in">
          <span className="material-symbols-outlined text-red-400 shrink-0" style={{ fontSize: '18px' }}>error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Closed notice */}
      {!operationalStatus.isOpen && (
        <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-2">
          <span className="material-symbols-outlined text-amber-400 shrink-0 mt-0.5" style={{ fontSize: '17px' }}>schedule</span>
          <span>{operationalStatus.message}</span>
        </div>
      )}

      <form onSubmit={handleSend} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── FORM FIELDS ───────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* 1. Customer info */}
          <section className="p-4 sm:p-5 rounded-2xl bg-dark-surface-container border border-dark-outline-variant flex flex-col gap-3.5">
            <h2 className="font-label text-sm uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>person</span>
              1. Os Seus Dados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="cname" className="block font-label text-[11px] uppercase tracking-wider text-dark-on-surface-variant mb-1 font-medium">
                  Nome *
                </label>
                <input
                  id="cname"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); save('ilda_customer_name', e.target.value); }}
                  placeholder="Ex: Manuel dos Santos"
                  className="w-full rounded-xl bg-dark-surface-container-high border border-dark-outline-variant text-dark-on-surface placeholder-dark-on-surface-variant/50 text-sm px-3.5 py-2.5 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label htmlFor="cphone" className="block font-label text-[11px] uppercase tracking-wider text-dark-on-surface-variant mb-1 font-medium">
                  Telefone / WhatsApp *
                </label>
                <input
                  id="cphone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); save('ilda_customer_phone', e.target.value); }}
                  placeholder="Ex: 923 000 000"
                  className="w-full rounded-xl bg-dark-surface-container-high border border-dark-outline-variant text-dark-on-surface placeholder-dark-on-surface-variant/50 text-sm px-3.5 py-2.5 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </section>

          {/* 2. Delivery */}
          <section className="p-4 sm:p-5 rounded-2xl bg-dark-surface-container border border-dark-outline-variant flex flex-col gap-3.5">
            <h2 className="font-label text-sm uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>local_shipping</span>
              2. Entrega ou Levantamento
            </h2>

            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-dark-surface-container-low border border-dark-outline-variant/40">
              <button type="button" onClick={() => setDeliveryMode('delivery')}
                className={`py-2 px-3 rounded-full font-label text-[11px] uppercase tracking-wider transition-all ${deliveryMode === 'delivery' ? 'bg-accent text-dark-on-primary font-bold shadow' : 'text-dark-on-surface-variant'}`}>
                Entrega ao Domicílio
              </button>
              <button type="button" onClick={() => setDeliveryMode('pickup')}
                className={`py-2 px-3 rounded-full font-label text-[11px] uppercase tracking-wider transition-all ${deliveryMode === 'pickup' ? 'bg-accent text-dark-on-primary font-bold shadow' : 'text-dark-on-surface-variant'}`}>
                Levantar (Grátis)
              </button>
            </div>

            {deliveryMode === 'delivery' ? (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div>
                  <label htmlFor="dzone" className="block font-label text-[11px] uppercase tracking-wider text-dark-on-surface-variant mb-1 font-medium flex items-center justify-between">
                    <span>Zona / Bairro *</span>
                    <span className="normal-case tracking-normal text-accent">{selectedZone.estimatedTime}</span>
                  </label>
                  <select
                    id="dzone"
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="w-full rounded-xl bg-dark-surface-container-high border border-dark-outline-variant text-dark-on-surface text-sm px-3.5 py-2.5 focus:outline-none focus:border-accent"
                  >
                    {DELIVERY_ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} — {formatKz(z.fee)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="caddr" className="block font-label text-[11px] uppercase tracking-wider text-dark-on-surface-variant mb-1 font-medium">
                    Endereço & Referência *
                  </label>
                  <textarea
                    id="caddr"
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); save('ilda_customer_address', e.target.value); }}
                    placeholder="Rua, nº, edifício ou ponto de referência próximo..."
                    className="w-full rounded-xl bg-dark-surface-container-high border border-dark-outline-variant text-dark-on-surface placeholder-dark-on-surface-variant/50 text-sm px-3.5 py-2.5 focus:outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-dark-surface-container-low border border-dark-outline-variant/30 text-xs text-dark-on-surface-variant flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-accent" style={{ fontSize: '17px' }}>storefront</span>
                <span><strong className="text-dark-on-surface">{RESTAURANT_INFO.address}</strong> · {RESTAURANT_INFO.hours}</span>
              </div>
            )}
          </section>

          {/* 3. Notes */}
          <section className="p-4 sm:p-5 rounded-2xl bg-dark-surface-container border border-dark-outline-variant flex flex-col gap-2.5">
            <label htmlFor="cnotes" className="font-label text-sm uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>notes</span>
              3. Observações (Opcional)
            </label>
            <textarea
              id="cnotes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem cebola, bem passado, bebidas bem geladas..."
              className="w-full rounded-xl bg-dark-surface-container-high border border-dark-outline-variant text-dark-on-surface placeholder-dark-on-surface-variant/50 text-sm px-3.5 py-2.5 focus:outline-none focus:border-accent resize-none"
            />
          </section>

        </div>

        {/* ── ORDER SUMMARY + ACTIONS ───────────────────── */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 flex flex-col gap-3">
          <section className="p-4 sm:p-5 rounded-2xl bg-dark-surface-container border border-dark-outline-variant shadow-2xl flex flex-col gap-4">
            <h2 className="font-headline text-base uppercase tracking-wide text-accent font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '19px' }}>receipt</span>
              Resumo ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
            </h2>

            {/* Compact items */}
            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto no-scrollbar divide-y divide-dark-outline-variant/20 text-xs">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-1.5 first:pt-0">
                  <span className="text-dark-on-surface-variant truncate pr-2 flex items-center gap-1.5">
                    <span className="font-bold text-dark-on-surface">{item.qty}×</span>
                    {item.name}
                  </span>
                  <span className="text-accent font-semibold tabular-nums shrink-0">{formatKz(item.qty * item.price)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-1.5 py-3 border-y border-dark-outline-variant/40 text-sm">
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
              <span className="font-headline text-base sm:text-lg uppercase font-bold text-dark-on-surface">Total</span>
              <span className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-accent">{formatKz(total)}</span>
            </div>

            {/* Send WhatsApp */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3.5 font-label text-sm uppercase tracking-wider font-bold transition-all shadow-xl active:scale-95 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="w-5 h-5 fill-current relative shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="relative">
                {operationalStatus.isOpen ? 'Enviar via WhatsApp' : 'Agendar Pedido (08h)'}
              </span>
            </button>

            {/* Copy fallback */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-dark-surface-container-high border border-dark-outline-variant hover:border-accent text-dark-on-surface py-2.5 font-label text-[11px] uppercase tracking-wider transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                {copiedSuccess ? 'done' : 'content_copy'}
              </span>
              <span>{copiedSuccess ? 'Copiado!' : 'Copiar Texto do Pedido'}</span>
            </button>

            <p className="text-[10px] text-dark-on-surface-variant text-center leading-relaxed">
              Ao enviar, abre-se a conversa WhatsApp da Ilda Glamour com o pedido já formatado.
            </p>
          </section>
        </div>

      </form>
    </main>
  );
};
