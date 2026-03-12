
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { ArrowLeft, Star, ShoppingCart, Truck, Shield, AlertCircle } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useData();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/shop"><Button>Go Back</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-slate-500 hover:text-medical-600 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Medicines
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-slate-50 rounded-3xl p-8 flex items-center justify-center">
             <img src={product.image} alt={product.name} className="max-w-full rounded-xl shadow-lg hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="bg-medical-50 text-medical-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-amber-100 text-amber-700 px-2 py-1 rounded gap-1 text-sm font-bold">
                  <Star size={14} className="fill-current" /> {product.rating}
                </div>
                <span className="text-slate-400 text-sm">{product.reviews} Reviews</span>
              </div>
            </div>

            <div className="border-t border-b border-slate-100 py-6">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-bold text-slate-900">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-slate-400 line-through mb-1">₹{product.originalPrice}</span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                   <span className="text-green-600 font-bold mb-1 ml-2">{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>
                )}
              </div>
              <p className="text-slate-500 text-sm">Inclusive of all taxes</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            <div>
               <h3 className="font-bold text-slate-900 mb-2">Dosage</h3>
               <p className="text-slate-600">{product.dosage}</p>
            </div>

            {product.requiresPrescription && (
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm">Prescription Required</h4>
                    <p className="text-amber-700 text-xs mt-1">Please upload a valid prescription at checkout for this item.</p>
                  </div>
               </div>
            )}

            <div className="flex gap-4 pt-4">
               <Button 
                 onClick={() => addToCart(product)} 
                 size="lg" 
                 className="flex-grow flex items-center gap-2"
                 disabled={!product.inStock}
               >
                 <ShoppingCart size={20}/>
                 {product.inStock ? 'Add to Cart' : 'Out of Stock'}
               </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500 pt-4">
               <div className="flex items-center gap-2">
                 <Truck size={16} className="text-medical-500"/> Delivered in 20 mins
               </div>
               <div className="flex items-center gap-2">
                 <Shield size={16} className="text-medical-500"/> Safety Checked
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
