export interface Product {
  id: string;
  storeId?: string; // ID of the store that owns this product
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
  storeId?: string; // ID of the store this order belongs to
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
  role: 'admin' | 'user' | 'store' | 'delivery';
  status: 'active' | 'suspended';
  profileImage?: string;
  addresses: Address[];
  password?: string;
  // Store specific fields
  storeName?: string;
  ownerName?: string;
  license?: string;
  totalOrders?: number;
  revenue?: number;
  rating?: number;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  zip: string;
}