
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const Shop: React.FC = () => {
  const { products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState(1000);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat) setSelectedCategory(cat);
  }, [location]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase().replace(' ', '') === selectedCategory.toLowerCase().replace(' ', '');
    const matchesPrice = product.price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Medicines & Healthcare</h1>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search for medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent bg-white shadow-sm"
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
                 <Filter size={18} /> Filters
               </div>
               
               {/* Categories */}
               <div className="mb-6">
                 <h3 className="text-sm font-semibold text-slate-900 mb-3">Categories</h3>
                 <div className="space-y-2">
                   <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-medical-600">
                     <input 
                       type="radio" 
                       name="category" 
                       checked={selectedCategory === 'all'} 
                       onChange={() => setSelectedCategory('all')}
                       className="text-medical-600 focus:ring-medical-500"
                     />
                     All Products
                   </label>
                   {CATEGORIES.map((cat) => (
                     <label key={cat.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-medical-600">
                       <input 
                         type="radio" 
                         name="category"
                         checked={selectedCategory === cat.id}
                         onChange={() => setSelectedCategory(cat.id)}
                         className="text-medical-600 focus:ring-medical-500"
                       />
                       {cat.name}
                     </label>
                   ))}
                 </div>
               </div>

               {/* Price Range */}
               <div>
                 <div className="flex justify-between items-center mb-2">
                   <h3 className="text-sm font-semibold text-slate-900">Max Price</h3>
                   <span className="text-xs font-medium text-medical-600">₹{priceRange}</span>
                 </div>
                 <input 
                   type="range" 
                   min="50" 
                   max="2000" 
                   step="50"
                   value={priceRange}
                   onChange={(e) => setPriceRange(Number(e.target.value))}
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-500"
                 />
                 <div className="flex justify-between text-xs text-slate-400 mt-1">
                   <span>₹50</span>
                   <span>₹2000+</span>
                 </div>
               </div>
             </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No medicines found</h3>
                <p className="text-slate-500">Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
