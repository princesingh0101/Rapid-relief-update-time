
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, CreditCard, LogOut, User, Plus, Trash2, X } from 'lucide-react';
import { OrderStatus, Address } from '../types';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  const { orders } = useData();
  const { user, logout, addAddress, removeAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [showAddAddress, setShowAddAddress] = useState(false);
  
  // Address Form State
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: 'Home',
    street: '',
    city: '',
    zip: ''
  });

  if (!user) return null;

  const userOrders = orders.filter(o => o.userEmail === user.email);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.street && newAddress.city && newAddress.zip) {
      addAddress(newAddress);
      setShowAddAddress(false);
      setNewAddress({ type: 'Home', street: '', city: '', zip: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-20 h-20 bg-medical-100 dark:bg-medical-900/30 rounded-full mx-auto mb-4 flex items-center justify-center text-medical-600 dark:text-medical-400">
                <User size={32} />
              </div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{user.email}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{user.phone}</p>
            </div>
            
            <nav className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-1">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Package size={18} /> Orders
              </button>
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'addresses' ? 'bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <MapPin size={18} /> Addresses
              </button>
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {activeTab === 'orders' && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Order History</h2>
                
                {userOrders.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <Package size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No orders found yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-slate-50 dark:border-slate-800 gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Order ID</p>
                            <p className="font-bold text-slate-900 dark:text-white">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date</p>
                            <p className="font-medium text-slate-700 dark:text-slate-300">{order.date}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total</p>
                            <p className="font-bold text-slate-900 dark:text-white">₹{order.total}</p>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              order.status === OrderStatus.OUT_FOR_DELIVERY ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {order.items.map((item: any, idx: number) => (
                             <div key={idx} className="flex items-center gap-4 text-sm">
                               <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                                 <img src={item.image} alt="" className="w-full h-full object-cover"/>
                               </div>
                               <span className="text-slate-700 dark:text-slate-300 flex-grow">{item.name}</span>
                               <span className="text-slate-400">x{item.quantity || 1}</span>
                             </div>
                          ))}
                        </div>

                        {order.status === OrderStatus.OUT_FOR_DELIVERY && (
                          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                                <MapPin className="text-blue-600 dark:text-blue-400"/>
                              </div>
                              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Track Live Delivery</span>
                            </div>
                            <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">VIEW MAP</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'addresses' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Addresses</h2>
                  <Button onClick={() => setShowAddAddress(true)} size="sm" className="flex items-center gap-2">
                    <Plus size={16} /> Add New
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative group">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">{addr.type}</span>
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">{addr.street}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{addr.city} - {addr.zip}</p>
                      
                      <button 
                        onClick={() => removeAddress(addr.id)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {user.addresses.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
                      <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">No addresses saved yet.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Add New Address</h3>
              <button onClick={() => setShowAddAddress(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address Type</label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddress({...newAddress, type: type as any})}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                        newAddress.type === type 
                          ? 'bg-medical-50 dark:bg-medical-900/20 border-medical-500 text-medical-700 dark:text-medical-400' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                <input 
                  type="text" 
                  required
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white"
                  placeholder="House No, Street, Area"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input 
                    type="text" 
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ZIP Code</label>
                  <input 
                    type="text" 
                    required
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 dark:bg-slate-800 dark:text-white"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2">
                Save Address
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
