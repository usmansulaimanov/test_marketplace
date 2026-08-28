export type CategoryId = 'all' | 'headwear' | 'tops' | 'bottoms' | 'footwear';

export interface Category {
  id: CategoryId;
  name: string;
  nameKz: string;
  description: string;
  count?: number;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: CategoryId;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  stock: number;
  description: string;
  sizes: string[];
  colors: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type Role = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  balance: number;
  avatarUrl?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'paid_and_delivered' | 'completed' | 'processing';
  paymentMethod: 'kaspi_qr' | 'kaspi_gold' | 'card';
  deliveryAddress: string;
}

export interface ExpenseRecord {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  category: string;
  itemCount: number;
}
