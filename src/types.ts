export type Category = 'todos' | 'hamburgueres' | 'cachorros' | 'pratos' | 'bebidas';

export type DeliveryMode = 'delivery' | 'pickup';

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
}

export interface DoseOption {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'hamburgueres' | 'cachorros' | 'pratos' | 'bebidas';
  price: number;
  image: string;
  description?: string;
  tag?: string;
  wordmark?: string;
  isAvailable?: boolean;
  dosesOptions?: DoseOption[];
}

export interface CartItem {
  id: string;        // unique key (productId + dose label)
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  doseLabel?: string;
}

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  address: string;
  zoneId: string;
  notes: string;
}

export type ViewType = 'featured' | 'menu' | 'cart' | 'checkout';
