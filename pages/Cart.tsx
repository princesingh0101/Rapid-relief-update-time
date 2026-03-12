import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <img 
          src="https://illustrations.popsy.co/amber/surr-shopping-cart.svg" 
          alt="Empty Cart" 
          className="w-64 h-64 mb-6 opacity-80" 
        />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added any medicines yet.</p>
        <Link to="/shop">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-grow space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-slate-50" />
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{item.dosage}</p>
                  
                  <div className="flex justify-between items-end">
                    <div className="font-bold text-slate-900">₹{item.price * item.quantity}</div>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-slate-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-slate-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
               <h3 className="font-bold text-lg mb-4">Order Summary</h3>
               
               <div className="space-y-3 text-sm text-slate-600 mb-6">
                 <div className="flex justify-between">
                   <span>Item Total</span>
                   <span>₹{totalAmount}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Delivery Fee</span>
                   <span className="text-green-600">FREE</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Platform Fee</span>
                   <span>₹10</span>
                 </div>
                 <div className="border-t pt-3 flex justify-between font-bold text-slate-900 text-lg">
                   <span>To Pay</span>
                   <span>₹{totalAmount + 10}</span>
                 </div>
               </div>

               <Link to="/checkout" className="block w-full">
                 <Button className="w-full py-3" size="lg">Proceed to Checkout</Button>
               </Link>

               <div className="mt-4 flex items-center gap-2 justify-center text-xs text-slate-500">
                 <ShieldCheck size={14} className="text-green-500"/>
                 Secure 256-bit SSL encrypted payment
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;