# Ilda Glamour — Cardápio Digital em React 🍔✨

Aplicação moderna SPA (Single Page Application) construída em **React + TypeScript + Vite + Tailwind CSS** para o restaurante/hamburgueria **Ilda Glamour**.

---

## 🚀 Funcionalidades

1. **Destaques (Hero Carousel):**
   - Carrossel interativo com os pratos estrela da casa (*Hambúrguer Glamoroso*, *Hambúrguer Duplo*, *Kitutes da Terra*, *Churrasco Misto*).
   - Efeito visual com gradiente radial e tipografia de luxo (*Oswald* + *Commissioner*).
   - Botões para encomendar directamente e partilhar prato (Web Share API com fallback para cópia de link).

2. **Catálogo & Menu Completo:**
   - Filtros dinâmicos por categoria: *Todos*, *Hambúrgueres*, *Cachorros*, *Pratos/Kitutes*.
   - Barra de pesquisa em tempo real com sugestões e limpeza rápida.
   - Seleção de pratos com destaque visual e botão rápido de encomenda.

3. **Carrinho de Compras Interativo (`CartContext`):**
   - Gestão global de estado com sincronização automática em `localStorage` (`ilda_cart`).
   - Modo de entrega selecionável: **Entrega ao Domicílio** (taxa de 1.000 Kz) ou **Levantar no Local** (Grátis).
   - Controles de quantidade (+ / - / remover item / limpar pedido).
   - Cálculo automático de subtotal, taxa e total em Kwanzas (Kz).

4. **Checkout & Integração WhatsApp:**
   - Resumo detalhado do pedido.
   - Formulário com validação de campos (Nome, Telefone/WhatsApp, Morada de Entrega, Observações).
   - Botão **"ENVIAR VIA WHATSAPP"**: formata a mensagem com formatação rica (negrito, emojis e quebras de linha) e abre diretamente o WhatsApp do restaurante (+244 942 668 662).

5. **Modal de Informações & Notificações Toast:**
   - Modal acessível com horários (11h–23h), contacto e localização.
   - Sistema de toasts animados com feedback instantâneo de adições ao carrinho.

---

## 🛠️ Como Executar

### 1. Iniciar servidor de desenvolvimento
```bash
npm run dev
```
Acesse no browser: `http://localhost:3000`

### 2. Gerar build de produção
```bash
npm run build
```
Os ficheiros otimizados serão gerados na pasta `dist/`.

### 3. Visualizar build localmente
```bash
npm run preview
```

---

## 📁 Estrutura do Projeto

```
ilda-glamour/
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Cabeçalho com navegação e badge do carrinho
│   │   ├── Footer.tsx         # Rodapé com redes sociais e idioma
│   │   ├── DishCard.tsx       # Cartão de prato interativo do catálogo
│   │   ├── InfoModal.tsx      # Modal de informações da hamburgueria
│   │   └── Toast.tsx          # Notificação toast animada
│   ├── context/
│   │   └── CartContext.tsx    # Contexto global do carrinho e preferências
│   ├── data/
│   │   └── products.ts        # Dados dos pratos, preços, imagens e configuração
│   ├── views/
│   │   ├── FeaturedView.tsx   # Ecrã de pratos em destaque com carrossel
│   │   ├── MenuView.tsx       # Ecrã de menu com busca e categorias
│   │   ├── CartView.tsx       # Ecrã do carrinho de compras
│   │   └── CheckoutView.tsx   # Ecrã de checkout e envio para WhatsApp
│   ├── types.ts               # Tipos TypeScript do domínio
│   ├── App.tsx                # Shell principal da aplicação
│   ├── index.css              # Diretivas Tailwind e animações
│   └── main.tsx               # Ponto de entrada React
├── index.html                 # HTML com fontes Google e ícones
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```
