import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, CheckCircle, ArrowLeft } from 'lucide-react';
import { OrderStatus } from '../types';

const Checkout: React.FC = () => {
  const { totalAmount, clearCart, cart } = useCart();
  const { addOrder } = useData();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const newOrder = {
      id: `#ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      total: totalAmount + 10, // Including platform fee
      status: OrderStatus.PLACED,
      items: cart,
      userEmail: user.email
    };

    addOrder(newOrder);
    setStep(3); // Success state
    clearCart();
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-slate-500 mb-8">Your medicines will arrive in 15 minutes.</p>
        <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
      </div>
    );
  }

  const defaultAddress = user?.addresses?.[0];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/cart" className="flex items-center gap-2 text-slate-500 mb-6 hover:text-medical-600">
           <ArrowLeft size={16} /> Back to Cart
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-xl font-bold text-slate-900">Checkout</h1>
            <p className="text-sm text-slate-500">Complete your order details</p>
          </div>

          <div className="p-6 space-y-8">
            
            {/* Address Section */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="bg-medical-100 text-medical-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Delivery Address
              </h3>
              <div className="p-4 border border-medical-500 bg-medical-50 rounded-xl relative">
                <div className="absolute top-4 right-4 text-medical-600">
                  <CheckCircle size={20} />
                </div>
                {defaultAddress ? (
                  <>
                    <p className="font-bold text-slate-900">{user?.name} ({defaultAddress.type})</p>
                    <p className="text-sm text-slate-600 mt-1">{defaultAddress.street}<br/>{defaultAddress.city}, {defaultAddress.zip}</p>
                    <p className="text-sm text-slate-600 mt-1">Phone: {user?.phone}</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-slate-900">{user?.name || 'Guest User'}</p>
                    <p className="text-sm text-slate-600 mt-1">No address saved. Please add an address in your profile.</p>
                    <Link to="/dashboard" className="text-medical-600 text-sm font-bold mt-2 inline-block">Add Address</Link>
                  </>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="bg-medical-100 text-medical-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Payment Method
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="border border-slate-200 p-4 rounded-xl cursor-pointer hover:border-medical-500 hover:bg-slate-50 transition-all">
                  <input type="radio" name="payment" className="hidden" defaultChecked />
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                      <CreditCard size={20}/>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">UPI / Card</p>
                      <p className="text-xs text-slate-500">Google Pay, PhonePe, Visa</p>
                    </div>
                  </div>
                </label>

                <label className="border border-slate-200 p-4 rounded-xl cursor-pointer hover:border-medical-500 hover:bg-slate-50 transition-all">
                  <input type="radio" name="payment" className="hidden" />
                  <div className="flex items-center gap-3">
                     <div className="bg-green-100 p-2 rounded-lg text-green-600">
                      <Banknote size={20}/>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Cash on Delivery</p>
                      <p className="text-xs text-slate-500">Pay when it arrives</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500">Total Payable</span>
                <span className="text-2xl font-bold text-slate-900">₹{totalAmount + 10}</span>
              </div>
              <Button onClick={handlePlaceOrder} className="w-full py-4 text-lg" disabled={!defaultAddress}>
                Pay & Place Order
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;