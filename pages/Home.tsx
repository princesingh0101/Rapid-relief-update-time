
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { Search, Clock, ShieldCheck, Truck, Pill, Syringe, Baby, HeartPulse, Stethoscope, Activity, ArrowRight, ShoppingBag } from 'lucide-react';

// Icon Map for dynamic rendering
const IconMap: Record<string, React.FC<any>> = {
  Pill, Syringe, Baby, HeartPulse, Stethoscope, Activity
};

const Home: React.FC = () => {
  const { products } = useData();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="pb-16 md:pb-0 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 py-12 md:py-20 overflow-hidden transition-colors duration-300">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-medical-200 dark:bg-medical-500/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-500/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white dark:border-slate-700 px-3 py-1 rounded-full text-sm text-medical-700 dark:text-medical-300 font-medium shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Deliveries in 10-30 minutes
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
                India's Fastest <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-500 to-medical-700 dark:from-medical-400 dark:to-medical-300">
                  Medicine Delivery
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 md:max-w-lg">
                Order medicines, essentials, and health products. We deliver trust to your doorstep in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-medical-500/20 hover:scale-105 transition-transform">
                    Order Now
                  </Button>
                </Link>
                <Link to="/emergency">
                  <Button size="lg" variant="danger" className="w-full sm:w-auto shadow-xl shadow-red-500/20 animate-pulse hover:scale-105 transition-transform">
                    Emergency SOS 🚑
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={18} className="text-emerald-500"/> 100% Genuine
                </div>
                <div className="flex items-center gap-2">
                   <Truck size={18} className="text-medical-500 dark:text-medical-400"/> Live Tracking
                </div>
              </div>
            </div>

            <div className="hidden md:block relative group">
              <div className="absolute inset-0 bg-medical-500/20 dark:bg-medical-500/10 rounded-3xl rotate-2 transform transition-transform group-hover:rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=600&h=600" 
                alt="Delivery" 
                className="relative rounded-3xl shadow-2xl rotate-2 group-hover:rotate-0 transition-all duration-500 object-cover border-4 border-white dark:border-slate-800"
              />
              {/* Floating Cards Mock */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Estimated Time</p>
                    <p className="font-bold text-slate-800 dark:text-white">12 Mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Shop by Category</h2>
             <Link to="/shop" className="text-medical-600 dark:text-medical-400 font-medium hover:underline flex items-center gap-1">View all <ArrowRight size={16}/></Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = IconMap[cat.icon];
              return (
                <Link to={`/shop?cat=${cat.id}`} key={cat.id} className="group cursor-pointer">
                  <div className={`h-32 rounded-2xl ${cat.color} bg-opacity-10 dark:bg-opacity-10 flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border border-transparent group-hover:border-current dark:border-slate-800 dark:group-hover:border-medical-500`}>
                    <div className={`p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm ${cat.color.split(' ')[1]} dark:text-gray-200`}>
                      <Icon size={24} className="dark:text-current" />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white">{cat.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Medicines */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Popular Essentials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-12">How RapidRelief Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
               <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                 <Search size={32} />
               </div>
               <h3 className="font-bold text-lg mb-2 dark:text-white">1. Search Medicine</h3>
               <p className="text-slate-500 dark:text-slate-400">Find your required medicines or upload a prescription.</p>
            </div>
            <div className="p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
               <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                 <ShoppingBag size={32} />
               </div>
               <h3 className="font-bold text-lg mb-2 dark:text-white">2. Add to Cart</h3>
               <p className="text-slate-500 dark:text-slate-400">Select items and proceed to secure checkout.</p>
            </div>
            <div className="p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
               <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
                 <Truck size={32} />
               </div>
               <h3 className="font-bold text-lg mb-2 dark:text-white">3. Superfast Delivery</h3>
               <p className="text-slate-500 dark:text-slate-400">Get your order delivered in as fast as 10 minutes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
