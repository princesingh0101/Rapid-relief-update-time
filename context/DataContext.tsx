
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { PRODUCTS, MOCK_ORDERS } from '../constants';

interface DataContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  addOrder: (order: Order) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    lowStockItems: number;
    pendingOrders: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      rating: 0,
      reviews: 0
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    lowStockItems: products.filter(p => p.stock > 0 && p.stock < 10).length + products.filter(p => p.stock === 0).length,
    pendingOrders: orders.filter(o => o.status !== OrderStatus.DELIVERED).length
  };

  return (
    <DataContext.Provider value={{ 
      products, 
      orders, 
      addProduct, 
      addOrder,
      updateProduct, 
      deleteProduct, 
      updateOrderStatus,
      stats 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
