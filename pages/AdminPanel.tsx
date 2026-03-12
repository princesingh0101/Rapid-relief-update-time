import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { OrderStatus, Product } from '../types';
import { Link, useNavigate, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
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
  Filter,
  Save,
  HeartPulse,
  Calendar,
  Building2,
  FileText,
  PackageCheck,
  UserCircle,
  Store,
  Eye,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Phone,
  Mail,
  Star
} from 'lucide-react';
import Button from '../components/Button';
import { CATEGORIES } from '../constants';
import ImageUpload from '../components/ImageUpload';

const AdminPanel: React.FC = () => {
  const { user, users, logout, deleteUser, updateUserAdmin, addUser } = useAuth();
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
    if (path.includes('/admin/inventory')) return 'inventory';
    if (path.includes('/admin/orders')) return 'orders';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/stores')) return 'stores';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/profile')) return 'profile';
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

  // Store Form State
  const initialStoreFormState = {
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    license: '',
    password: '',
    status: 'active' as User['status']
  };
  const [storeForm, setStoreForm] = useState(initialStoreFormState);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<User | null>(null);

  const openAddStoreModal = () => {
    setEditingStore(null);
    setStoreForm(initialStoreFormState);
    setIsStoreModalOpen(true);
  };

  const openEditStoreModal = (store: User) => {
    setEditingStore(store);
    setStoreForm({
      storeName: store.storeName || '',
      ownerName: store.ownerName || '',
      email: store.email,
      phone: store.phone,
      address: store.addresses?.[0]?.street || '',
      license: store.license || '',
      password: '',
      status: store.status
    });
    setIsStoreModalOpen(true);
  };

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStore = {
      name: storeForm.storeName,
      storeName: storeForm.storeName,
      ownerName: storeForm.ownerName,
      email: storeForm.email,
      phone: storeForm.phone,
      license: storeForm.license,
      status: storeForm.status,
      role: 'store' as User['role'],
      addresses: [{ id: 'addr-' + Date.now(), type: 'Work', street: storeForm.address, city: '', zip: '' }]
    };

    if (editingStore) {
      updateUserAdmin(editingStore.id, finalStore);
    } else {
      addUser({
        ...finalStore,
        password: storeForm.password,
        totalOrders: 0,
        revenue: 0,
        rating: 5
      });
    }
    setIsStoreModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
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

  const StoreDetailsView = () => {
    const { id } = useParams();
    const store = users.find(u => u.id === id);

    if (!store) return <Navigate to="/admin/stores" />;

    const storeProducts = products.filter(p => p.storeId === store.id);
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={() => navigate('/admin/stores')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Store Details: {store.storeName || store.name}</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-28 h-24 bg-medical-50 dark:bg-medical-900/30 rounded-3xl flex items-center justify-center text-medical-500 mb-4 shadow-inner">
                  <Store size={56} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{store.storeName || store.name}</h4>
                <span className={`mt-3 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  store.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {store.status}
                </span>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                {[
                  { label: 'Owner', val: store.ownerName, icon: UserCircle },
                  { label: 'Email', val: store.email, icon: Mail },
                  { label: 'Phone', val: store.phone, icon: Phone },
                  { label: 'Address', val: store.addresses?.[0]?.street, icon: MapPin }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                      <p className="font-bold text-slate-700 dark:text-slate-200">{item.val || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Revenue</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{store.revenue?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Orders Fulfilled</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{store.totalOrders || 0}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Customer Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{store.rating || 5.0}</p>
                  <Star size={24} className="text-amber-400 fill-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h4 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">Store Inventory ({storeProducts.length})</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {storeProducts.map(p => (
                      <tr key={p.id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{p.name}</td>
                        <td className="px-6 py-4 text-slate-500">{p.category}</td>
                        <td className="px-6 py-4 font-black text-right">{p.stock}</td>
                      </tr>
                    ))}
                    {storeProducts.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium">
                          No inventory data for this store.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 hidden md:flex flex-col transition-colors duration-300">
        <div className="p-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="bg-medical-500 text-white p-1 rounded-lg">
              <HeartPulse size={20} />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              RapidAdmin
            </h2>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-4">Main</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" path="/admin/dashboard" />
          <SidebarItem icon={Package} label="Inventory" id="inventory" path="/admin/inventory" />
          <SidebarItem icon={ShoppingCart} label="Orders" id="orders" path="/admin/orders" />
          
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-6">Management</p>
          <SidebarItem icon={Users} label="Users" id="users" path="/admin/users" />
          <SidebarItem icon={Store} label="Stores" id="stores" path="/admin/stores" />
          
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-6">System</p>
          <SidebarItem icon={UserCircle} label="Profile" id="profile" path="/admin/profile" />
          <SidebarItem icon={Settings} label="Settings" id="settings" path="/admin/settings" />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors"
           >
             <LogOut size={20} /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 relative">
        
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
             <span className="font-semibold text-slate-800 dark:text-white capitalize tracking-tight">{activeTab} Overview</span>
          </div>

          <div className="flex items-center gap-6">
             <div className="relative hidden sm:block w-64">
               <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search dashboard..." 
                 className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-10 pr-4 py-1.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-medical-500 transition-all"
               />
             </div>
             
             <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
             </button>

             {/* Profile Dropdown */}
             <div className="relative border-l border-slate-200 dark:border-slate-700 pl-6" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 focus:outline-none group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md shadow-medical-200 dark:shadow-none transition-all group-hover:scale-105">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black mt-1 tracking-widest">Super Admin</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-up origin-top-right z-50">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/admin/profile" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-medical-50 dark:hover:bg-medical-900/20 hover:text-medical-600 dark:hover:text-medical-400 rounded-xl transition-colors"
                      >
                        <UserCircle size={16} /> Admin Profile
                      </Link>
                      <Link 
                        to="/admin/settings" 
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
        <div className="flex-grow overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-medical-50 dark:bg-medical-900/20 p-3 rounded-xl text-medical-600 dark:text-medical-400">
                         <TrendingUp size={24} />
                      </div>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-bold">+12.5%</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Revenue</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{stats.totalRevenue}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                         <ShoppingCart size={24} />
                      </div>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-bold">+5.2%</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Orders</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalOrders}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                     <div className="flex justify-between items-start mb-4">
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl text-amber-600 dark:text-amber-400">
                         <AlertCircle size={24} />
                      </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Orders</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingOrders}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                     <div className="flex justify-between items-start mb-4">
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-red-600 dark:text-red-400">
                         <Package size={24} />
                      </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Low Stock Items</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.lowStockItems}</p>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                     <h3 className="font-bold text-lg text-slate-800 dark:text-white">Recent Orders</h3>
                     <Link to="/admin/orders" className="text-medical-600 dark:text-medical-400 text-sm font-bold hover:underline">View All</Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4Status">Status</th>
                          <th className="px-6 py-4">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{order.id}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{order.userEmail}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                 order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' :
                                 order.status === OrderStatus.OUT_FOR_DELIVERY ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-medium">₹{order.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            } />

            <Route path="/inventory" element={
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-96">
                     <input 
                       type="text" 
                       placeholder="Search products, manufacturers..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium"
                     />
                     <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  </div>
                  <Button onClick={openAddProductModal} className="w-full md:w-auto flex items-center gap-2">
                    <Plus size={18} /> Add Product
                  </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                        <tr>
                          <th className="px-6 py-4">Product Details</th>
                          <th className="px-6 py-4">Manufacturer</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Stock Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-slate-200">{product.name}</span>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{product.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                              {product.manufacturer || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-medium">₹{product.price}</td>
                            <td className="px-6 py-4">
                              {product.stock === 0 ? (
                                <span className="text-red-500 flex items-center gap-1 text-xs font-bold"><X size={12}/> Out of Stock</span>
                              ) : product.stock < 10 ? (
                                <span className="text-amber-500 flex items-center gap-1 text-xs font-bold"><AlertCircle size={12}/> Low Stock ({product.stock})</span>
                              ) : (
                                <span className="text-green-600 flex items-center gap-1 text-xs font-bold"><Check size={12}/> In Stock ({product.stock})</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openEditProductModal(product)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => {
                                  if(confirm('Are you sure you want to delete this medicine?')) {
                                    deleteProduct(product.id);
                                  }
                                }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                  <Trash2 size={16} />
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

            <Route path="/orders" element={
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Items</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4Status">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{order.id}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{order.userEmail}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{order.date}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{order.items.length} Items</td>
                            <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-medium">₹{order.total}</td>
                            <td className="px-6 py-4">
                              <div className="relative inline-block">
                                <select 
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                  className="appearance-none bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-1 pl-3 pr-8 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 cursor-pointer"
                                >
                                  {Object.values(OrderStatus).map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                  ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-2 text-slate-500 pointer-events-none" />
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

            <Route path="/users" element={
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Users size={32} className="text-slate-400"/>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">User Management</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                   This module typically connects to the user database. Currently showing mock data for demonstration.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                   {['John Doe', 'Jane Smith', 'Mike Ross', 'Rachel Green'].map((name, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                         <div className="w-10 h-10 bg-medical-100 dark:bg-medical-900/30 text-medical-600 rounded-full flex items-center justify-center font-bold">
                            {name[0]}
                         </div>
                         <div className="text-left">
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{name}</p>
                            <p className="text-xs text-slate-500">Customer</p>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            } />

            <Route path="/stores" element={
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-96">
                     <input 
                       type="text" 
                       placeholder="Search stores..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium"
                     />
                     <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  </div>
                  <Button onClick={openAddStoreModal} className="w-full md:w-auto flex items-center gap-2">
                    <Plus size={18} /> Add Store
                  </Button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                        <tr>
                          <th className="px-6 py-4">Store Name</th>
                          <th className="px-6 py-4 text-center">Orders</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {users.filter(u => u.role === 'store' && (u.storeName || u.name).toLowerCase().includes(searchTerm.toLowerCase())).map((store) => (
                          <tr key={store.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-medical-500 text-white flex items-center justify-center shadow-lg">
                                  <Store size={20} />
                                </div>
                                <div>
                                  <Link to={`/admin/stores/${store.id}`} className="font-bold text-slate-900 dark:text-slate-200 hover:text-medical-500 transition-colors">
                                    {store.storeName || store.name}
                                  </Link>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{store.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center text-slate-900 dark:text-slate-200 font-medium">
                              {store.totalOrders || 0}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                store.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {store.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link to={`/admin/stores/${store.id}`} className="p-2 text-slate-400 hover:text-medical-500 hover:bg-medical-50 dark:hover:bg-medical-900/20 rounded-lg transition-colors">
                                  <Eye size={16}/>
                                </Link>
                                <button onClick={() => openEditStoreModal(store)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => {
                                  if(confirm('Are you sure you want to delete this store?')) {
                                    deleteUser(store.id);
                                  }
                                }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {users.filter(u => u.role === 'store').length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                              No stores found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            } />

            <Route path="/stores/:id" element={<StoreDetailsView />} />

            <Route path="/profile" element={
              <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-medical-500 to-medical-600 relative"></div>
                  <div className="px-8 pb-8 relative">
                    <div className="flex justify-between items-end mb-8">
                      <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-medical-500 -mt-12 relative z-10">
                        <UserCircle size={40} />
                      </div>
                      <Button>Save Profile</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Account Details</h4>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                          <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none font-medium dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                          <input type="text" value="Super Administrator" disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed font-medium" />
                        </div>
                      </div>

                      <div className="space-y-5">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Contact Info</h4>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                          <input type="email" value={user?.email} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed font-medium" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                          <input type="tel" defaultValue={user?.phone} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none font-medium dark:text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />

            <Route path="/settings" element={
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">General Settings</h3>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
                   <div className="p-6 flex items-center justify-between">
                      <div>
                         <h4 className="font-bold text-slate-900 dark:text-white">Maintenance Mode</h4>
                         <p className="text-sm text-slate-500">Temporarily disable the store for visitors.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-600"></div>
                      </label>
                   </div>
                   <div className="p-6 flex items-center justify-between">
                      <div>
                         <h4 className="font-bold text-slate-900 dark:text-white">Email Notifications</h4>
                         <p className="text-sm text-slate-500">Receive emails for new orders.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" defaultChecked />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-600"></div>
                      </label>
                   </div>
                   <div className="p-6 flex items-center justify-between">
                      <div>
                         <h4 className="font-bold text-slate-900 dark:text-white">Auto-Confirm Orders</h4>
                         <p className="text-sm text-slate-500">Automatically set new orders to "Placed".</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" defaultChecked />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-600"></div>
                      </label>
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
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
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
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
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
                        placeholder="Describe the product details..."
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
                <Save size={18} /> {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Store Modal */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                {editingStore ? <Edit2 size={24} className="text-medical-500"/> : <Plus size={24} className="text-medical-500"/>}
                {editingStore ? 'Edit Store Details' : 'Add New Store'}
              </h3>
              <button onClick={() => setIsStoreModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="storeForm" onSubmit={handleStoreSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <h4 className="text-sm font-black text-medical-600 dark:text-medical-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <Store size={16}/> Business Info
                    </h4>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Store Name</label>
                      <input 
                        type="text" 
                        required
                        value={storeForm.storeName}
                        onChange={(e) => setStoreForm({...storeForm, storeName: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Owner Name</label>
                      <input 
                        type="text" 
                        required
                        value={storeForm.ownerName}
                        onChange={(e) => setStoreForm({...storeForm, ownerName: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">License Number</label>
                      <input 
                        type="text" 
                        value={storeForm.license}
                        onChange={(e) => setStoreForm({...storeForm, license: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h4 className="text-sm font-black text-medical-600 dark:text-medical-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <Phone size={16}/> Contact & Access
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={storeForm.email}
                        onChange={(e) => setStoreForm({...storeForm, email: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                      <input 
                        type="text" 
                        required
                        value={storeForm.phone}
                        onChange={(e) => setStoreForm({...storeForm, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                      />
                    </div>

                    {!editingStore && (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Temporary Password</label>
                        <input 
                          type="password" 
                          required
                          value={storeForm.password}
                          onChange={(e) => setStoreForm({...storeForm, password: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 dark:bg-slate-800 dark:text-white font-medium"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2 space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Address</label>
                      <textarea 
                        rows={2}
                        value={storeForm.address}
                        onChange={(e) => setStoreForm({...storeForm, address: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white font-medium resize-none"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Store Status</label>
                      <select 
                        value={storeForm.status}
                        onChange={(e) => setStoreForm({...storeForm, status: e.target.value as any})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white font-medium cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 rounded-b-3xl">
              <Button type="button" variant="outline" onClick={() => setIsStoreModalOpen(false)}>Cancel</Button>
              <Button type="submit" form="storeForm" className="flex items-center gap-2 px-8 shadow-xl shadow-medical-500/20">
                <Save size={18} /> {editingStore ? 'Update Store' : 'Add Store'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;