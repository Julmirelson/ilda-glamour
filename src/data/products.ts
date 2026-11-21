import { Product, DeliveryZone, ProductExtra } from '../types';

export const RESTAURANT_INFO = {
  name: 'Ilda Glamour',
  hours: '08:00 – 22:00',
  openHour: 8,
  closeHour: 22,
  phoneDisplay: '927 395 838 / 958 386 747',
  primaryPhone: '927 395 838',
  secondaryPhone: '958 386 747',
  whatsappNumber: '244927395838',
  secondaryWhatsapp: '244958386747',
  currency: 'AOA (Kz)',
  address: 'Golf 2, Triângulo, Vila Estoril',
  city: 'Luanda, Angola',
  iban: 'AO06 0040 0000 1234 5678 9012 3',
  multicaixaExpress: '927 395 838',
  beneficiaryName: 'Ilda Glamour Comércio & Serviços',
};

// Check if restaurant is currently open (8h to 22h local Angola time UTC+1 WAT)
export function isRestaurantOpen(): { isOpen: boolean; message: string; angolaHour: number; isScheduledNotice?: boolean } {
  const now = new Date();
  // Angola is WAT (UTC+1) without Daylight Saving Time
  const utcHours = now.getUTCHours();
  const angolaHour = (utcHours + 1) % 24;

  const isOpen = angolaHour >= RESTAURANT_INFO.openHour && angolaHour < RESTAURANT_INFO.closeHour;
  
  if (isOpen) {
    return {
      isOpen: true,
      message: `Aberto agora (fecha às ${RESTAURANT_INFO.closeHour}:00)`,
      angolaHour,
    };
  } else {
    return {
      isOpen: false,
      message: `Restaurante fechado no momento (atendimento todos os dias das 08h às 22h). Pode fazer o seu pedido agora e nós agendamos para a abertura às 08h!`,
      angolaHour,
      isScheduledNotice: true,
    };
  }
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'estoril-triangulo', name: 'Vila Estoril / Triângulo (Golf 2)', fee: 500, estimatedTime: '20-35 min' },
  { id: 'golf2-geral', name: 'Golf 2 (Geral) / Palanca', fee: 800, estimatedTime: '30-45 min' },
  { id: 'kilamba-kiaxi', name: 'Kilamba Kiaxi / Projecto Nova Vida', fee: 1200, estimatedTime: '40-55 min' },
  { id: 'talatona-benfica', name: 'Talatona / Morro Bento / Benfica', fee: 1800, estimatedTime: '45-60 min' },
  { id: 'luanda-centro', name: 'Maianga / Alvalade / Maculusso / Centro', fee: 2000, estimatedTime: '45-60 min' },
  { id: 'outras-zonas', name: 'Outras Zonas de Luanda (A combinar no WhatsApp)', fee: 1500, estimatedTime: '45-70 min' },
];

export const BURGER_EXTRAS: ProductExtra[] = [
  { id: 'extra-queijo', name: 'Queijo Derretido Extra', price: 300 },
  { id: 'extra-bacon', name: 'Bacon Crocante', price: 400 },
  { id: 'extra-ovo', name: 'Ovo Estrelado', price: 300 },
  { id: 'extra-molho', name: 'Dose Molho Especial Glamour', price: 200 },
];

export const PRODUCTS: Product[] = [
  // ================= HAMBÚRGUERES =================
  {
    id: 'h-simples',
    name: 'Hambúrguer Simples',
    category: 'hamburgueres',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Carne bovina grelhada na chapa, queijo suave e molho artesanal no pão macio e fofo.',
  },
  {
    id: 'h-glamoroso',
    name: 'Hambúrguer Glamouroso',
    category: 'hamburgueres',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    wordmark: 'GLAMOUR',
    tag: 'especial da casa',
    description: 'Carne suculenta grelhada, queijo derretido, salada fresca e o toque secreto do molho Glamour.',
  },
  {
    id: 'h-composto',
    name: 'Hambúrguer Composto',
    category: 'hamburgueres',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'Carne grelhada na chapa, ovo estrelado, bacon estaladiço, queijo cheddar derretido e alface fresca.',
  },
  {
    id: 'h-duas-carnes',
    name: 'Hambúrguer com Duas Carnes',
    category: 'hamburgueres',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1583032015879-c5c8e310065a?w=600&auto=format&fit=crop&q=80',
    wordmark: '2 CARNES',
    tag: 'dobro de sabor',
    description: 'Dois suculentos discos de carne grelhada, queijo duplo derretido, molho cremoso especial da casa.',
  },
  {
    id: 'h-duplo',
    name: 'Hambúrguer Duplo',
    category: 'hamburgueres',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=80',
    wordmark: 'DUPLO TOP',
    tag: 'para apetites exigentes',
    description: 'Hambúrguer gigante duplo com carnes nobres grelhadas, generosa camada de cheddar, bacon crocante e molho especial.',
  },

  // ================= CACHORROS =================
  {
    id: 'c-simples',
    name: 'Cachorro Simples',
    category: 'cachorros',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
    description: 'Salsicha selecionada em pão macio aquecido, batata palha crocante e molhos tradicionais.',
  },
  {
    id: 'c-glamoroso',
    name: 'Cachorro Glamouroso',
    category: 'cachorros',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1627054234553-6239bc7a61d6?w=600&auto=format&fit=crop&q=80',
    wordmark: 'GLAMOUR',
    tag: 'favorito dos clientes',
    description: 'Salsicha especial gratinada com queijo derretido, bacon picado, batata palha estaladiça e molho especial Ilda Glamour.',
  },

  // ================= PRATOS & KITUTES =================
  {
    id: 'feijoada',
    name: 'Feijoada',
    category: 'pratos',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format&fit=crop&q=80',
    description: 'Feijão encorpado cozinhado no ponto com carnes suculentas, acompanhado de arroz soltinho e farofa.',
  },
  {
    id: 'caldeirada',
    name: 'Caldeirada',
    category: 'pratos',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
    description: 'Ensopado tradicional aromático com tomates frescos, pimentos, batatas e tempero apurado da casa.',
  },
  {
    id: 'bitoque',
    name: 'Bitoque',
    category: 'pratos',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    description: 'Bife tenro grelhado na chapa coberto com ovo estrelado a cavalo, servido com batatas fritas e arroz.',
  },
  {
    id: 'funge-frango',
    name: 'Funge com Frango',
    category: 'pratos',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
    description: 'Funge de mandioca/milho quentinho e aveludado, servido com frango caseiro em molho rico e bem temperado.',
  },
  {
    id: 'funge-peixe',
    name: 'Funge com Peixe',
    category: 'pratos',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=80',
    description: 'Funge tradicional angolano servido com peixe fresco preparado em molho delicioso e aromático.',
  },
  {
    id: 'funge-carne-abatida',
    name: 'Funge com Carne Abatida',
    category: 'pratos',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    description: 'Funge quentinho servido com carne abatida tradicional refogada lentamente em molho espesso e saboroso.',
  },
  {
    id: 'funge-carne-grelhada',
    name: 'Funge com Carne Grelhada',
    category: 'pratos',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    description: 'A combinação do funge aveludado com carne bovina suculenta grelhada na brasa e molho de acompanhamento.',
  },
  {
    id: 'churrasco',
    name: 'Churrasco',
    category: 'pratos',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
    wordmark: 'CHURRASCO',
    tag: 'na brasa na hora',
    description: 'Carnes temperadas grelhadas no carvão ao estilo tradicional, acompanhadas com guarnição da casa.',
  },
  {
    id: 'cabrite',
    name: 'Cabrité',
    category: 'pratos',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    wordmark: 'CABRITÉ',
    tag: 'iguaria apreciada',
    description: 'Carne de cabrito macia e suculenta grelhada na brasa com tempero especial angolano.',
  },
  {
    id: 'franguite',
    name: 'Franguité',
    category: 'pratos',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&auto=format&fit=crop&q=80',
    wordmark: 'FRANGUITÉ',
    tag: 'crocante e estaladiço',
    description: 'Frango assado/grelhado à moda Ilda Glamour com tempero picante moderado e pele estaladiça.',
  },
  {
    id: 'kitutes-banda',
    name: 'Kitutes da Banda (por doses)',
    category: 'pratos',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    wordmark: 'KITUTES',
    tag: 'sabores autênticos de Angola',
    description: 'Banana-pão frita dourada, mandioca crocante, carne temperada e petiscos autênticos da terra.',
    dosesOptions: [
      { label: 'Dose Pequena', price: 3500 },
      { label: 'Dose Média', price: 5500 },
      { label: 'Dose Familiar', price: 7500 },
      { label: 'Dose Super Glamour', price: 10000 },
    ],
  },

  // ================= BEBIDAS =================
  {
    id: 'cerveja-3',
    name: 'Cerveja (Pack 3 un.)',
    category: 'bebidas',
    price: 1050,
    image: 'https://images.unsplash.com/photo-1608270116812-32a76f289d0e?w=600&auto=format&fit=crop&q=80',
    description: 'Pack promocional de 3 cervejas bem geladas (1.050 Kz).',
  },
  {
    id: 'gasosa-garrafa',
    name: 'Gasosa em Garrafa',
    category: 'bebidas',
    price: 400,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    description: 'Refrigerante em garrafa fresca (Coca-Cola, Fanta, Sprite ou similar).',
  },
  {
    id: 'sumol',
    name: 'Sumol',
    category: 'bebidas',
    price: 500,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    description: 'Refrigerante Sumol com sabor autêntico a fruta bem gelado.',
  },
  {
    id: 'compal',
    name: 'Compal',
    category: 'bebidas',
    price: 600,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    description: 'Néctar de fruta Compal saboroso e refrescante.',
  },
  {
    id: 'zip',
    name: 'Zip',
    category: 'bebidas',
    price: 350,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
    description: 'Bebida energética / refresco Zip bem fresco.',
  },
  {
    id: 'agua-normal',
    name: 'Água Mineral (Grande)',
    category: 'bebidas',
    price: 250,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    description: 'Garrafa de água mineral pura natural ou gelada.',
  },
  {
    id: 'agua-pequena',
    name: 'Água Mineral (Pequena)',
    category: 'bebidas',
    price: 200,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    description: 'Garrafa de água mineral formato prático pequeno.',
  },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    ...PRODUCTS.find(p => p.id === 'h-glamoroso')!,
    image: '/burger-featured.png',
    wordmark: 'HAMBÚRGUER',
  },
  {
    ...PRODUCTS.find(p => p.id === 'h-duplo')!,
    image: '/burger-featured.png',
    wordmark: 'DUPLO',
  },
  {
    ...PRODUCTS.find(p => p.id === 'franguite')!,
    image: '/fried-chicken.png',
    wordmark: 'FRANGUITÉ',
  },
  {
    ...PRODUCTS.find(p => p.id === 'c-glamoroso')!,
    image: '/sandwich.png',
    wordmark: 'CACHORRO',
  },
];

export function formatKz(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' Kz';
}
