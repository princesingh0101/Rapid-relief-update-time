import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import Button from './Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-full">
      {/* Discount Badge */}
      {product.originalPrice && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
        </div>
      )}
      
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-50 dark:bg-slate-700">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-white text-slate-800 px-3 py-1 rounded-full font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-medical-600 dark:text-medical-400 bg-medical-50 dark:bg-medical-900/30 px-2 py-1 rounded">
            {product.category}
          </span>
          <div className="flex items-center text-amber-500 text-xs font-bold">
            <Star size={12} className="fill-current mr-1" />
            {product.rating}
          </div>
        </div>

        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 truncate group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through ml-2">₹{product.originalPrice}</span>
            )}
          </div>
          <Button 
            size="sm" 
            variant="secondary"
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            className="rounded-full !px-3"
          >
            <ShoppingCart size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;