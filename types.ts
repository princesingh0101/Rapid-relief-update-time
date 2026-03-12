export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  requiresPrescription: boolean;
  inStock: boolean;
  stock: number;
  dosage: string;
  expiryDate?: string;
  manufacturer?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export enum OrderStatus {
  PLACED = 'Placed',
  PACKED = 'Packed',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: CartItem[];
  userEmail: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | 'store';
  addresses: Address[];
  password?: string;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  zip: string;
}