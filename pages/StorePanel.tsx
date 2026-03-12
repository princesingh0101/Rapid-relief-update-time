import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { OrderStatus, Product } from '../types';
import { Link, useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  TrendingUp, 
  AlertCircle,
  Search,
  Bell,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronDown,
  Store,
  HeartPulse,
  Activity,
  UserCircle,
  FileText,
  Save,
  Calendar,
  Building2,
  PackageCheck
} from 'lucide-react';
import Button from '../components/Button';
import { CATEGORIES } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ImageUpload from '../components/ImageUpload';

// Mock Data for Analytics
const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 4500 },
  { name: 'Fri', sales: 6000 },
  { name: 'Sat', sales: 7000 },
  { name: 'Sun', sales: 5500 },
];

const topMedicines = [
  { name: 'Paracetamol', sold: 450 },
  { name: 'Amoxicillin', sold: 320 },
  { name: 'Cetirizine', sold: 280 },
  { name: 'Ibuprofen', sold: 210 },
  { name: 'Vitamin C', sold: 190 },
];

const StorePanel: React.FC = () => {
  const { user, logout } = useAuth();
  const { products, orders, updateOrderStatus, deleteProduct, addProduct, updateProduct, stats } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get active tab from URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/store/inventory')) return 'inventory';
    if (path.includes('/store/orders')) return 'orders';
    if (path.includes('/store/analytics')) return 'analytics';
    if (path.includes('/store/customers')) return 'customers';
    if (path.includes('/store/notifications')) return 'notifications';
    if (path.includes('/store/profile')) return 'profile';
    if (path.includes('/store/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTabFromPath();

  // Inventory State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Product Form State
  const initialFormState = {
    name: '',
    category: 'Tablets',
    price: 0,
    originalPrice: 0,
    description: '',
    image: '',
    images: [] as string[],
    requiresPrescription: false,
    inStock: true,
    stock: 0,
    dosage: '',
    manufacturer: '',
    expiryDate: ''
  };
  const [productForm, setProductForm] = useState(initialFormState);

  const handleLogout = () => {
    logout();
    navigate('/store');
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm(initialFormState);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      description: product.description,
      image: product.image,
      images: product.images || [product.image],
      requiresPrescription: product.requiresPrescription,
      inStock: product.inStock,
      stock: product.stock || 0,
      dosage: product.dosage,
      manufacturer: product.manufacturer || '',
      expiryDate: product.expiryDate || ''
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProduct = {
      ...productForm,
      image: productForm.images[0] || productForm.image || 'https://picsum.photos/400/400?random=' + Math.floor(Math.random() * 1000),
      inStock: productForm.stock > 0
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, finalProduct);
    } else {
      addProduct({
        ...finalProduct,
        rating: 5,
        reviews: 0
      } as any);
    }
    setIsProductModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.manufacturer && p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Profile Form State (Mock)
  const [profileData, setProfileData] = useState({
    storeName: user?.name || 'HealthPlus Pharmacy',
    ownerName: 'Admin User',
    address: '45, MG Road, Bangalore',
    phone: user?.phone || '8888888888',
    email: user?.email || 'store@rapidrelief.com',
    hours: '08:00 AM - 10:00 PM'
  });

  // --- SUB-COMPONENTS ---

  const SidebarItem = ({ icon: Icon, label, id, path }: { icon: any, label: string, id: string, path: string }) => (
    <Link 
      to={path}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
        activeTab === id 
          ? 'bg-medical-500 text-white shadow-lg shadow-medical-500/30' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <Icon size={20} /> {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 hidden md:flex flex-col transition-colors duration-300 z-20">
        <div className="p-6">
          <Link to="/store/dashboard" className="flex items-center gap-2">
            <div className="bg-medical-500 text-white p-1.5 rounded-lg shadow-md shadow-medical-500/30">
              <Store size={22} />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Store Portal
            </h2>
          </Link>
        </div>

        <div className="overflow-y-auto flex-grow px-4 space-y-1 py-2 custom-scrollbar">
          <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" path="/store/dashboard" />
          <SidebarItem icon={Package} label="My Inventory" id="inventory" path="/store/inventory" />
          <SidebarItem icon={ShoppingCart} label="Store Orders" id="orders" path="/store/orders" />
          <SidebarItem icon={Activity} label="Analytics" id="analytics" path="/store/analytics" />
          <SidebarItem icon={Users} label="Customers" id="customers" path="/store/customers" />
          
          <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-6">System</p>
          <SidebarItem icon={Bell} label="Notifications" id="notifications" path="/store/notifications" />
          <SidebarItem icon={UserCircle} label="Store Profile" id="profile" path="/store/profile" />
          <SidebarItem icon={Settings} label="Settings" id="settings" path="/store/settings" />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold transition-all duration-200"
           >
             <LogOut size={18} /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 relative">
        
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
             <span className="font-bold text-lg text-slate-800 dark:text-white capitalize tracking-tight">
                {activeTab.replace('-', ' ')}
             </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
             <div className="relative hidden sm:block w-64">
               <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search orders, medicines..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-10 pr-4 py-1.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-medical-500 focus:ring-1 focus:ring-medical-500 transition-all placeholder:text-slate-400"
               />
             </div>
             
             <Link to="/store/notifications" className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
               <Bell size={20} />
               <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
             </Link>

             {/* Profile Dropdown */}
             <div className="relative border-l border-slate-200 dark:border-slate-700 pl-4 sm:pl-6" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 focus:outline-none group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md shadow-medical-500/20 group-hover:shadow-medical-500/40 transition-all">
                    {user?.name?.charAt(0) || 'S'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user?.name?.split(' ')[0]}</p>
                    <p className="text-[10px] font-bold text-medical-500 uppercase tracking-wider mt-1">Store Admin</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 hidden sm:block ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-up origin-top-right">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/store/profile" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-medical-50 dark:hover:bg-medical-900/20 hover:text-medical-600 dark:hover:text-medical-400 rounded-xl transition-colors"
                      >
                        <UserCircle size={16} /> Store Profile
                      </Link>
                      <Link 
                        to="/store/settings" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-medical-50 dark:hover:bg-medical-900/20 hover:text-medical-600 dark:hover:text-medical-400 rounded-xl transition-colors"
                      >
                        <Settings size={16} /> Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <Routes>
            <Route path="/" element={<Navigate to="/store/dashboard" replace />} />
            
            {/* DASHBOARD VIEW */}
            <Route path="/dashboard" element={
              <div className="space-y-6 animate-fade-in">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TrendingUp size={48} className="text-medical-500" />
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="bg-medical-50 dark:bg-medical-900/20 p-3 rounded-xl text-medical-600 dark:text-medical-400">
                         <TrendingUp size={24} />
                      </div>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">+15.3%</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Daily Sales</h3>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight relative z-10">₹12,450</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ShoppingCart size={48} className="text-blue-500" />
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                         <ShoppingCart size={24} />
                      </div>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">+8</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Active Orders</h3>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight relative z-10">18</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <AlertCircle size={48} className="text-red-500" />
                    </div>
                     <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-red-600 dark:text-red-400">
                         <AlertCircle size={24} />
                      </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Low Stock Alerts</h3>
                    <p className="text-3xl font-black text-red-600 dark:text-red-400 tracking-tight relative z-10">{stats.lowStockItems}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Package size={48} className="text-amber-500" />
                    </div>
                     <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl text-amber-600 dark:text-amber-400">
                         <Package size={24} />
                      </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Total Inventory</h3>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight relative z-10">{products.length}</p>
                  </div>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart Widget */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Revenue Overview</h3>
                      <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium cursor-pointer">
                        <option>This Week</option>
                        <option>This Month</option>
                      </select>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(value) => `₹${value}`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`₹${value}`, 'Sales']}
                          />
                          <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#8b5cf6'}} activeDot={{r: 6, strokeWidth: 0}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Selling Widget */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Top Selling</h3>
                      <Link to="/store/analytics" className="text-medical-600 dark:text-medical-400 text-sm font-bold hover:underline">View All</Link>
                    </div>
                    <div className="flex-grow flex flex-col justify-center gap-4">
                      {topMedicines.slice(0, 4).map((med, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400 dark:bg-slate-800'}`}>
                              #{idx + 1}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{med.name}</span>
                          </div>
                          <span className="text-sm font-bold text-medical-600 dark:text-medical-400">{med.sold} units</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                     <h3 className="font-bold text-lg text-slate-800 dark:text-white">Recent Orders</h3>
                     <Link to="/store/orders" className="text-medical-600 dark:text-medical-400 text-sm font-bold hover:underline">Manage Orders</Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-4 font-mono text-sm text-slate-900 dark:text-slate-200">{order.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">{order.userEmail.split('@')[0]}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                 order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                 order.status === OrderStatus.OUT_FOR_DELIVERY ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-bold text-right">₹{order.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            } />

            {/* INVENTORY VIEW */}
            <Route path="/inventory" element={
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="relative w-full md:w-96">
                     <input 
                       type="text" 
                       placeholder="Search name, category, manufacturer..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium"
                     />
                     <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  </div>
                  <Button onClick={openAddProductModal} className="w-full md:w-auto flex items-center justify-center gap-2 shadow-lg shadow-medical-500/30">
                    <Plus size={18} /> Add New Medicine
                  </Button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Product Details</th>
                          <th className="px-6 py-4">Manufacturer</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Stock Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-slate-200">{product.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">{product.category}</span>
                                    {product.requiresPrescription && <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded uppercase">Rx Required</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{product.manufacturer || 'N/A'}</p>
                              {product.expiryDate && <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">Exp: {product.expiryDate}</p>}
                            </td>
                            <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-bold">₹{product.price}</td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                {product.stock === 0 ? (
                                  <span className="inline-flex items-center gap-1.5 text-red-500 dark:text-red-400 font-bold text-sm">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div> Out of Stock
                                  </span>
                                ) : product.stock < 10 ? (
                                  <span className="inline-flex items-center gap-1.5 text-amber-500 dark:text-amber-400 font-bold text-sm">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div> Low Stock ({product.stock})
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> In Stock ({product.stock})
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openEditProductModal(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors" title="Edit">
                                  <Edit2 size={18} />
                                </button>
                                <button onClick={() => {
                                  if(confirm('Are you sure you want to delete this medicine?')) {
                                    deleteProduct(product.id);
                                  }
                                }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Delete">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            } />

            {/* ORDERS VIEW */}
            <Route path="/orders" element={
              <div className="space-y-6 animate-fade-in">
                 <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {['All Orders', 'Pending', 'Preparing', 'Ready', 'Delivered'].map((tab, i) => (
                      <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold text-sm transition-colors ${i === 0 ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}>
                        {tab}
                      </button>
                    ))}
                 </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer Details</th>
                          <th className="px-6 py-4">Items</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-sm font-bold text-slate-900 dark:text-slate-200">{order.id}</td>
                            <td className="px-6 py-4">
                               <p className="font-bold text-slate-900 dark:text-slate-200">{order.userEmail.split('@')[0]}</p>
                               <p className="text-xs text-slate-500 mt-0.5">{order.date}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold w-8 h-8 rounded-lg flex items-center justify-center text-xs">
                                  {order.items.length}
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Items</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-black tracking-tight">₹{order.total}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                 order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                 order.status === OrderStatus.OUT_FOR_DELIVERY ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold focus:outline-none focus:border-medical-500 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                              >
                                {Object.values(OrderStatus).map((status) => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            } />

            {/* ANALYTICS VIEW */}
            <Route path="/analytics" element={
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sales Growth Chart */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Weekly Sales Growth</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(value) => `₹${value/1000}k`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`₹${value}`, 'Revenue']}
                          />
                          <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: '#8b5cf6'}} activeDot={{r: 8, strokeWidth: 0}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Products Bar Chart */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Top Selling Medicines</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topMedicines} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} width={100} />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="sold" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            } />

            {/* CUSTOMERS VIEW */}
            <Route path="/customers" element={
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                   <h3 className="font-bold text-lg text-slate-800 dark:text-white">Customer Directory</h3>
                   <Button size="sm" variant="outline" className="hidden sm:flex">Export CSV</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4 text-center">Total Orders</th>
                        <th className="px-6 py-4 text-right">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <tr key={item} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-100 to-medical-200 dark:from-medical-900/40 dark:to-medical-800/40 text-medical-700 dark:text-medical-400 flex items-center justify-center font-bold text-sm">
                                C{item}
                              </div>
                              <span className="font-bold text-slate-900 dark:text-slate-200">Customer {item}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">customer{item}@example.com<br/>+91 98765 0000{item}</td>
                          <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">{Math.floor(Math.random() * 10) + 1}</td>
                          <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-slate-200 tracking-tight">₹{Math.floor(Math.random() * 5000) + 500}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            } />

            {/* NOTIFICATIONS VIEW */}
            <Route path="/notifications" element={
              <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
                <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-6">Notifications</h3>
                {[
                  { title: 'New Order Received', desc: 'Order #ORD-1234 needs your attention.', time: '2 mins ago', type: 'order', unread: true },
                  { title: 'Low Stock Alert', desc: 'Paracetamol 500mg is running low (3 strips left).', time: '1 hour ago', type: 'alert', unread: true },
                  { title: 'System Update', desc: 'RapidRelief platform has been updated to v2.0.', time: '1 day ago', type: 'system', unread: false },
                ].map((notif, i) => (
                  <div key={i} className={`p-4 sm:p-6 rounded-2xl border flex gap-4 transition-all ${notif.unread ? 'bg-white dark:bg-slate-900 border-medical-200 dark:border-medical-900/50 shadow-md' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-70'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'order' ? 'bg-blue-100 text-blue-600' : notif.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {notif.type === 'order' ? <ShoppingCart size={20} /> : notif.type === 'alert' ? <AlertCircle size={20} /> : <Bell size={20} />}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-slate-900 dark:text-white ${notif.unread ? '' : 'font-medium'}`}>{notif.title}</h4>
                        <span className="text-xs font-bold text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{notif.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            } />

            {/* PROFILE VIEW */}
            <Route path="/profile" element={
              <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-medical-500 to-medical-600 relative">
                     <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors flex items-center gap-2">
                       <Edit2 size={14}/> Edit Cover
                     </button>
                  </div>
                  <div className="px-8 pb-8 relative">
                    <div className="flex justify-between items-end mb-8">
                      <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-medical-500 -mt-12 relative z-10">
                        <Store size={40} />
                      </div>
                      <Button>Save Changes</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Business Details</h4>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Store Name</label>
                          <input type="text" value={profileData.storeName} onChange={(e) => setProfileData({...profileData, storeName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none font-medium dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Owner Name</label>
                          <input type="text" value={profileData.ownerName} onChange={(e) => setProfileData({...profileData, ownerName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none font-medium dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Operating Hours</label>
                          <input type="text" value={profileData.hours} onChange={(e) => setProfileData({...profileData, hours: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none font-medium dark:text-white" />
                        </div>
                      </div>

                      <div className="space-y-5">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Contact Information</h4>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                          <input type="email" value={profileData.email} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed font-medium" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                          <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none font-medium dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Store Address</label>
                          <textarea rows={3} value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none font-medium dark:text-white resize-none"></textarea>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Documents</h4>
                      <div className="flex items-center gap-4 p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                          <FileText size={24} />
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-sm text-slate-900 dark:text-white">Store License.pdf</p>
                          <p className="text-xs text-slate-500">Uploaded on Oct 12, 2023</p>
                        </div>
                        <button className="text-medical-600 dark:text-medical-400 text-sm font-bold hover:underline">Replace</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />

            {/* SETTINGS VIEW */}
            <Route path="/settings" element={
              <div className="max-w-3xl mx-auto animate-fade-in">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Store Settings</h3>
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
                   
                   <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                         <h4 className="font-bold text-slate-900 dark:text-white text-lg">Auto-Accept Orders</h4>
                         <p className="text-sm text-slate-500 mt-1">Automatically accept new orders if items are in stock.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                         <input type="checkbox" className="sr-only peer" />
                         <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-medical-500 shadow-inner"></div>
                      </label>
                   </div>

                   <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                         <h4 className="font-bold text-slate-900 dark:text-white text-lg">SMS Notifications</h4>
                         <p className="text-sm text-slate-500 mt-1">Receive SMS alerts for new orders and low stock.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                         <input type="checkbox" className="sr-only peer" defaultChecked />
                         <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-medical-500 shadow-inner"></div>
                      </label>
                   </div>

                   <div className="p-6">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Security</h4>
                      <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
                   </div>
                   
                   <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-b-3xl">
                      <h4 className="font-bold text-red-600 dark:text-red-400 text-lg mb-2">Danger Zone</h4>
                      <p className="text-sm text-red-500/80 mb-4">Temporarily deactivate your store listing. Customers will not be able to place orders.</p>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">Deactivate Store</button>
                   </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                {editingProduct ? <Edit2 size={24} className="text-medical-500"/> : <Plus size={24} className="text-medical-500"/>}
                {editingProduct ? 'Edit Medicine Details' : 'Add New Medicine'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="productForm" onSubmit={handleProductSubmit} className="space-y-8">
                
                {/* Image Upload Section */}
                <div>
                  <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Product Images</label>
                  <ImageUpload 
                    images={productForm.images} 
                    onChange={(imgs) => setProductForm({...productForm, images: imgs})} 
                    maxImages={6}
                  />
                  <p className="text-[10px] text-slate-400 mt-2 italic">* First image will be used as the primary thumbnail.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <h4 className="text-sm font-black text-medical-600 dark:text-medical-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <FileText size={16}/> Basic Information
                    </h4>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medicine Name</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                        placeholder="e.g. Paracetamol 500mg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                        <select 
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white font-medium cursor-pointer"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₹)</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                      <textarea 
                        rows={4}
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white font-medium resize-none"
                        placeholder="Describe the medicine usage and benefits..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h4 className="text-sm font-black text-medical-600 dark:text-medical-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <PackageCheck size={16}/> Stock & Logistics
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock Quantity</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Calendar size={12}/> Expiry Date</label>
                        <input 
                          type="date" 
                          value={productForm.expiryDate}
                          onChange={(e) => setProductForm({...productForm, expiryDate: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Building2 size={12}/> Manufacturer</label>
                      <input 
                        type="text" 
                        value={productForm.manufacturer}
                        onChange={(e) => setProductForm({...productForm, manufacturer: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                        placeholder="e.g. Cipla, Sun Pharma"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Dosage Info</label>
                      <input 
                        type="text" 
                        value={productForm.dosage}
                        onChange={(e) => setProductForm({...productForm, dosage: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                        placeholder="e.g., 1 tablet twice daily"
                      />
                    </div>

                    <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Prescription Required (Rx)</span>
                        <input 
                          type="checkbox" 
                          checked={productForm.requiresPrescription}
                          onChange={(e) => setProductForm({...productForm, requiresPrescription: e.target.checked})}
                          className="w-5 h-5 rounded text-medical-600 focus:ring-medical-500 border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 rounded-b-3xl">
              <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
              <Button type="submit" form="productForm" className="flex items-center gap-2 px-8 shadow-xl shadow-medical-500/20">
                <Save size={18} /> {editingProduct ? 'Update Inventory' : 'Add to Inventory'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StorePanel;