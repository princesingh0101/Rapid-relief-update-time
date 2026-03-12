import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Menu, X, Home, User, Pill, Activity, Phone, LogOut, LayoutDashboard, Sun, Moon, HeartPulse } from 'lucide-react';
import ChatAssistant from './ChatAssistant';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Toggle Theme Function
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const isActive = (path: string) => location.pathname === path ? "text-medical-600 font-semibold" : "text-slate-500 hover:text-medical-500 dark:text-slate-400 dark:hover:text-medical-400";

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-medical-500 text-white p-1.5 rounded-lg">
                  <HeartPulse size={24} />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">
                  Rapid<span className="text-medical-500">Relief</span>
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`${isActive('/')} transition-colors`}>Home</Link>
              <Link to="/shop" className={`${isActive('/shop')} transition-colors`}>Medicines</Link>
              <Link to="/emergency" className={`${isActive('/emergency')} transition-colors text-red-500 font-medium`}>Emergency</Link>
              {isAdmin ? (
                <Link to="/admin" className="text-violet-600 font-semibold flex items-center gap-1">
                   <LayoutDashboard size={18}/> Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className={`${isActive('/dashboard')} transition-colors`}>Dashboard</Link>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-600 hover:text-medical-600 dark:text-slate-400 dark:hover:text-medical-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <Link to="/cart" className="relative p-2 text-slate-600 hover:text-medical-600 dark:text-slate-400 dark:hover:text-medical-400 transition-colors">
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                 <div className="hidden md:flex items-center gap-3">
                   <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hi, {user.name.split(' ')[0]}</span>
                   <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                     <LogOut size={20} />
                   </button>
                 </div>
              ) : (
                <Link to="/login" className="hidden md:block">
                   <button className="px-4 py-1.5 bg-medical-500 text-white rounded-lg text-sm font-medium hover:bg-medical-600 transition-colors">
                     Login
                   </button>
                </Link>
              )}

              <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-slate-100 dark:border-slate-800 absolute w-full animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-medical-600 hover:bg-slate-50 dark:hover:bg-slate-800">Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-medical-600 hover:bg-slate-50 dark:hover:bg-slate-800">Medicines</Link>
              <Link to="/emergency" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Emergency SOS</Link>
              
              {user ? (
                <>
                  <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-medical-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                    {isAdmin ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Logout
                  </button>
                </>
              ) : (
                 <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-medical-600 bg-medical-50 dark:bg-slate-800 dark:text-medical-400">Login</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow dark:text-slate-100">
        {children}
      </main>
      
      {/* Floating Chat */}
      <ChatAssistant />

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-[#020617] text-slate-300 pt-12 pb-6 border-t dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-medical-500 text-white p-1 rounded-lg">
                <HeartPulse size={20} />
              </div>
              <span className="font-bold text-lg text-white">RapidRelief</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              India's fastest medicine delivery platform. Trusted by millions for genuine medicines and rapid delivery.
            </p>
            <div className="flex gap-4">
               {/* Social placeholders */}
               <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-medical-500 transition-colors cursor-pointer">X</div>
               <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-medical-500 transition-colors cursor-pointer">In</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-medical-400">Buy Medicines</Link></li>
              <li><Link to="/dashboard" className="hover:text-medical-400">Order History</Link></li>
              <li><Link to="/emergency" className="hover:text-medical-400">Emergency</Link></li>
              <li><a href="#" className="hover:text-medical-400">Upload Prescription</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
             <ul className="space-y-2 text-sm">
              <li><Link to="/shop?cat=tablets" className="hover:text-medical-400">Tablets</Link></li>
              <li><Link to="/shop?cat=syrups" className="hover:text-medical-400">Syrups</Link></li>
              <li><Link to="/shop?cat=babycare" className="hover:text-medical-400">Baby Care</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={14}/> +91 98765 43210</li>
              <li>support@rapidrelief.com</li>
              <li>Bangalore, India</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2024 RapidRelief. All rights reserved.
        </div>
      </footer>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 px-6 py-2 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-medical-600 dark:text-medical-400' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center gap-1 ${location.pathname === '/shop' ? 'text-medical-600 dark:text-medical-400' : ''}`}>
          <Pill size={20} />
          <span>Meds</span>
        </Link>
        <Link to={user ? (isAdmin ? "/admin" : "/dashboard") : "/login"} className={`flex flex-col items-center gap-1 ${['/dashboard','/admin','/login'].includes(location.pathname) ? 'text-medical-600 dark:text-medical-400' : ''}`}>
          <User size={20} />
          <span>{user ? 'Account' : 'Login'}</span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;