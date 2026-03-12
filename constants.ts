import { Category, Product, Order, OrderStatus } from './types';
import { Pill, Syringe, Baby, HeartPulse, Stethoscope, Activity } from 'lucide-react';

export const CATEGORIES: Category[] = [
  { id: 'tablets', name: 'Tablets', icon: 'Pill', color: 'bg-blue-100 text-blue-600' },
  { id: 'syrups', name: 'Syrups', icon: 'Syringe', color: 'bg-amber-100 text-amber-600' },
  { id: 'firstaid', name: 'First Aid', icon: 'Stethoscope', color: 'bg-red-100 text-red-600' },
  { id: 'babycare', name: 'Baby Care', icon: 'Baby', color: 'bg-pink-100 text-pink-600' },
  { id: 'personal', name: 'Personal', icon: 'HeartPulse', color: 'bg-purple-100 text-purple-600' },
  { id: 'devices', name: 'Devices', icon: 'Activity', color: 'bg-emerald-100 text-emerald-600' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 650mg',
    category: 'Tablets',
    price: 30,
    originalPrice: 45,
    description: 'Effective for fever and mild to moderate pain relief.',
    image: 'https://picsum.photos/400/400?random=1',
    rating: 4.8,
    reviews: 1240,
    requiresPrescription: false,
    inStock: true,
    stock: 120,
    dosage: '1 tablet every 6 hours',
    manufacturer: 'GSK Pharma',
    expiryDate: '2025-12-31'
  },
  {
    id: '2',
    name: 'Cough Syrup Advanced',
    category: 'Syrups',
    price: 120,
    originalPrice: 150,
    description: 'Fast relief from dry and wet cough. Non-drowsy formula.',
    image: 'https://picsum.photos/400/400?random=2',
    rating: 4.5,
    reviews: 850,
    requiresPrescription: false,
    inStock: true,
    stock: 45,
    dosage: '10ml twice a day',
    manufacturer: 'Cipla Ltd',
    expiryDate: '2025-06-15'
  },
  {
    id: '3',
    name: 'Digital Thermometer',
    category: 'Devices',
    price: 250,
    originalPrice: 350,
    description: 'High precision digital thermometer with LCD display.',
    image: 'https://picsum.photos/400/400?random=3',
    rating: 4.9,
    reviews: 2100,
    requiresPrescription: false,
    inStock: true,
    stock: 8,
    dosage: 'N/A',
    manufacturer: 'Omron',
    expiryDate: '2030-01-01'
  },
  {
    id: '4',
    name: 'Amoxicillin 500mg',
    category: 'Tablets',
    price: 85,
    description: 'Antibiotic used to treat a number of bacterial infections.',
    image: 'https://picsum.photos/400/400?random=4',
    rating: 4.7,
    reviews: 320,
    requiresPrescription: true,
    inStock: true,
    stock: 65,
    dosage: 'As prescribed by physician',
    manufacturer: 'Sun Pharma',
    expiryDate: '2024-11-20'
  },
  {
    id: '5',
    name: 'Bandage Roll (Large)',
    category: 'First Aid',
    price: 40,
    description: 'Sterile cotton bandage for wound dressing.',
    image: 'https://picsum.photos/400/400?random=5',
    rating: 4.6,
    reviews: 150,
    requiresPrescription: false,
    inStock: true,
    stock: 200,
    dosage: 'N/A',
    manufacturer: 'Johnson & Johnson',
    expiryDate: '2028-05-10'
  },
  {
    id: '6',
    name: 'Vitamin C Serum',
    category: 'Personal',
    price: 499,
    originalPrice: 699,
    description: 'Brightening serum for glowing skin.',
    image: 'https://picsum.photos/400/400?random=6',
    rating: 4.8,
    reviews: 5000,
    requiresPrescription: false,
    inStock: true,
    stock: 12,
    dosage: 'Apply daily at night',
    manufacturer: 'L\'Oreal',
    expiryDate: '2025-03-25'
  },
    {
    id: '7',
    name: 'Baby Diapers (Pack of 10)',
    category: 'Baby Care',
    price: 299,
    description: 'Soft and absorbent diapers for infants.',
    image: 'https://picsum.photos/400/400?random=7',
    rating: 4.9,
    reviews: 300,
    requiresPrescription: false,
    inStock: true,
    stock: 5,
    dosage: 'N/A',
    manufacturer: 'Pampers',
    expiryDate: '2027-08-14'
  },
  {
    id: '8',
    name: 'Emergency Inhaler',
    category: 'Tablets',
    price: 450,
    description: 'Rapid relief for asthma symptoms.',
    image: 'https://picsum.photos/400/400?random=8',
    rating: 4.9,
    reviews: 120,
    requiresPrescription: true,
    inStock: false,
    stock: 0,
    dosage: 'As needed',
    manufacturer: 'AstraZeneca',
    expiryDate: '2025-01-10'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: '#ORD-2023-001',
    date: '2023-10-24',
    total: 350,
    status: OrderStatus.DELIVERED,
    items: [PRODUCTS[0], PRODUCTS[4]] as any,
    userEmail: 'john.doe@example.com'
  },
  {
    id: '#ORD-2023-002',
    date: '2023-10-26',
    total: 120,
    status: OrderStatus.OUT_FOR_DELIVERY,
    items: [PRODUCTS[1]] as any,
    userEmail: 'john.doe@example.com'
  }
];
